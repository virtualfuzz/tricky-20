import { accounts, db, users } from "../../../db/schema.ts";
import { and, eq, ilike } from "drizzle-orm";
import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ request }: APIContext) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const provider = searchParams.get("provider");

  const users_to_show = await db
    .select({
      user_id: users.id,
      username: users.name,
      provider: accounts.provider,
    })
    .from(users)
    .leftJoin(accounts, eq(users.id, accounts.userId))
    .where(
      and(
        provider ? ilike(accounts.provider, `${provider}%`) : undefined,
        username ? ilike(users.name, `${username}%`) : undefined,
      ),
    );

  const users_hashmap = users_to_show.reduce(
    (acc: { [key: string]: typeof user & { user_url: string } }, user) => {
      acc[user.user_id] = {
        user_url: `/api/v1/users/${user.user_id}`,
        ...user,
      };
      return acc;
    },
    {},
  );

  return new Response(JSON.stringify(users_hashmap, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}

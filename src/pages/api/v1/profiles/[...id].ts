import { accounts, db, users } from "../../../../db/schema.ts";
import { eq } from "drizzle-orm";
import type { APIContext, APIRoute } from "astro";
import { checkSolutionAPI } from "../../../../scripts/solution.ts";

export const prerender = false;

export async function GET({ params }: APIContext) {
  if (params.id === undefined) {
    throw new Error("params.id is undefined, please report this as a bug!");
  }

  const user = await db
    .select({ id: users.id, username: users.name, provider: accounts.provider })
    .from(users)
    .leftJoin(accounts, eq(users.id, accounts.userId))
    .where(eq(users.id, params.id));

  if (user.length <= 0) {
    return new Response(
      JSON.stringify(
        {
          error:
            `Profile with ${params.id} doesn't exist, are you sure you wrote it right?`,
        },
        null,
        2,
      ),
      {
        headers: { "Content-Type": "application/json" },
        status: 404,
      },
    );
  }

  return new Response(JSON.stringify(user[0], null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  return await checkSolutionAPI(true, request);
};

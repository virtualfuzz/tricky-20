import { accounts, db, solutions, users } from "../../../db/schema.ts";
import { and, eq, ilike } from "drizzle-orm";
import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ request }: APIContext) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const provider = searchParams.get("provider");
  const needExport = searchParams.get("export");
  console.log(needExport);

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

  // if export then add the puzzlesSolved from each user (costly so dont do it by default)

  // now only do this
  // Fetch data for all users asynchronously
  const usersWithPuzzles = await Promise.all(
    users_to_show.map(async (user) => {
      const puzzlesSolved = await db
        .select({
          puzzleId: solutions.puzzleId,
          sha512Solution: solutions.sha512Solution,
          saltSolution: solutions.saltSolution,
        })
        .from(solutions)
        .where(eq(solutions.userId, user.user_id)); // Use current user's ID

      if (needExport === "true") {
        return {
          user_url: `/api/v1/users/${user.user_id}`,
          ...user,

          puzzlesSolved,
        };
      } else {
        return { user_url: `/api/v1/users/${user.user_id}`, ...user };
      }
    }),
  );

  // Convert the array into a hashmap
  const users_hashmap = usersWithPuzzles.reduce(
    (acc, user) => {
      acc[user.user_id] = user;
      return acc;
    },
    {} as Record<string, (typeof usersWithPuzzles)[number]>,
  );

  return new Response(JSON.stringify(users_hashmap, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}

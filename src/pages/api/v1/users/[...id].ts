import { accounts, db, solutions, users } from "../../../../db/schema.ts";
import { eq } from "drizzle-orm";
import type { APIContext, APIRoute } from "astro";
import { checkSolutionAPI } from "../../../../scripts/solution.ts";

export const prerender = false;

export async function GET({ params }: APIContext) {
  if (params.id === undefined) {
    throw new Error("params.id is undefined, please report this as a bug!");
  }

  // Query user with provider
  const user = await db
    .select({
      user_id: users.id,
      username: users.name,
      provider: accounts.provider,
    })
    .from(users)
    .leftJoin(accounts, eq(users.id, accounts.userId))
    .where(eq(users.id, params.id));

  if (user.length <= 0) {
    return new Response(
      JSON.stringify(
        {
          error:
            `User with ${params.id} doesn't exist, are you sure you wrote it right?`,
        },
        null,
        "\t",
      ),
      {
        headers: { "Content-Type": "application/json" },
        status: 404,
      },
    );
  }

  // Query solutions from that user
  const puzzlesSolved = await db
    .select({
      puzzleId: solutions.puzzleId,
      sha512Solution: solutions.sha512Solution,
      saltSolution: solutions.saltSolution,
    })
    .from(solutions)
    .where(eq(solutions.userId, params.id));

  return new Response(
    JSON.stringify({ ...user[0], puzzlesSolved }, null, "\t"),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}

export const POST: APIRoute = async ({ request }) => {
  return await checkSolutionAPI(true, request);
};

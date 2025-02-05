import { getEntry } from "astro:content";
import { createHash, randomBytes } from "node:crypto";
import { apiKeys, db, solutions } from "../db/schema.ts";
import { and, eq, sql } from "drizzle-orm";

// Function to check if a solution from a puzzle is correct
// Returns true if correct, false if wrong
async function checkSolution(
  puzzleId: string,
  solution: string,
): Promise<boolean> {
  const puzzle = await getEntry("puzzles", puzzleId);
  if (puzzle === undefined) {
    throw new Error(`Puzzle with ${puzzleId} doesn't exist`);
  }

  const saltedSolution = solution.concat(
    puzzle.data.USED_INTERNALLY_salt_of_solution,
  );
  const hashBuffer = createHash("sha512").update(saltedSolution).digest("hex");

  if (hashBuffer === puzzle.data.USED_INTERNALLY_sha512_of_solution) {
    return true;
  } else {
    return false;
  }
}

async function getUserIdFromHeaders(headers: Headers): Promise<string> {
  const authorization = headers.get("authorization");
  if (authorization === null) {
    throw new Error("authorization header is missing, can't authentificate");
  }

  const token = authorization.split(" ")[1];
  if (token === undefined) {
    throw new Error(
      "authorization header not formatted correctly: 'Authorization: Bearer API_KEY'",
    );
  }

  const keySha512 = createHash("sha512").update(token).digest("hex");

  // check expire date
  const apiKey = await db
    .update(apiKeys)
    .set({ lastUsedDate: sql`NOW()` })
    .where(eq(apiKeys.keySha512, keySha512))
    .returning();

  if (apiKey[0] === undefined || apiKey[0].lastUsedDate === null) {
    throw new Error("Unknown or invalid API key");
  }

  // Make sure key is not expired
  // Since we also set lastUsedDate to the current date we compare it to that
  if (apiKey[0].expireDate <= apiKey[0].lastUsedDate) {
    throw new Error("This API key is expired, please generate a new one");
  }

  return apiKey[0].userId;
}

export const checkSolutionAPI = async (
  submitPossible: boolean,
  request: Request,
  puzzleId?: string | undefined,
) => {
  // Make sure puzzle_id and solution exists in the json input
  let submission = undefined;

  // Make sure it is proper json
  try {
    submission = await request.json();
  } catch (e) {
    let error = "";
    if (e instanceof Error) {
      error = e.message;
    } else {
      error = "CRITICAL Report as bug! An unknown error occured";
    }

    return new Response(JSON.stringify({ error }, null, 2), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  if (submission.solution === undefined) {
    return new Response(
      JSON.stringify({ error: "Where is the solution?" }, null, 2),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  let userId = "";
  if (submitPossible === true) {
    try {
      userId = await getUserIdFromHeaders(request.headers);
    } catch (e) {
      let error = "";
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = "CRITICAL Report as bug! An unknown error occured";
      }

      return new Response(
        JSON.stringify(
          {
            error,
          },
          null,
          2,
        ),
        {
          headers: { "Content-Type": "application/json" },
          status: 401,
        },
      );
    }
    puzzleId = submission.puzzleId;
  }

  // Make sure puzzleId exists
  if (puzzleId === undefined) {
    return new Response(
      JSON.stringify(
        {
          error:
            "For some reason the puzzleId is undefined, please check documentation. If you are doing this correctly, please report this as a bug with the current url!",
        },
        null,
        2,
      ),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  let valid_solution = false;
  try {
    valid_solution = await checkSolution(puzzleId, submission.solution);
  } catch (e) {
    let error = "";
    if (e instanceof Error) {
      error = e.message;
    } else {
      error = "CRITICAL Report as bug! An unknown error occured";
    }

    return new Response(
      JSON.stringify(
        {
          error,
        },
        null,
        2,
      ),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  // Check the hash and return the response
  let response = {};
  let status;
  let saved_into_your_profile = false;
  let save_message = "";
  if (valid_solution === true) {
    if (userId !== "") {
      // Fetch solution to see if it was already saved
      const fetchedSolution = await db
        .select()
        .from(solutions)
        .where(
          and(eq(solutions.userId, userId), eq(solutions.puzzleId, puzzleId)),
        );

      // Solution not inside of the profile, save it
      if (fetchedSolution[0] === undefined) {
        const saltSolution = puzzleId + userId +
          randomBytes(32).toString("hex");
        const saltedSolution = submission.solution.concat(saltSolution);

        const sha512Solution = createHash("sha512")
          .update(saltedSolution)
          .digest("hex");

        // Create api key item and put it into the database
        const solution: typeof solutions.$inferInsert = {
          userId,
          puzzleId,
          saltSolution,
          sha512Solution,
        };

        await db.insert(solutions).values(solution);

        save_message = "Successfully saved into your profile";
      } else {
        save_message = "You already have the solution saved into your profile.";
      }

      saved_into_your_profile = true;
    } else {
      save_message =
        "This wasn't saved into your profile since you aren't logged in, you don't have to do that though.";
    }

    status = 200;
    response = {
      valid_solution: true,
      message: "You got yourself a valid solution, congrats!",
    };
  } else {
    save_message = "Not saved because you got the wrong solution.";
    status = 400;
    response = {
      valid_solution: false,
      message:
        "Uh oh, that's the wrong solution, make sure you wrote it correctly, the spaces matter!",
    };
  }

  // If submit is possible send more information related to saving the solution
  if (submitPossible === true) {
    response = { ...response, userId, saved_into_your_profile, save_message };
  }

  return new Response(JSON.stringify(response, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: status,
  });
};

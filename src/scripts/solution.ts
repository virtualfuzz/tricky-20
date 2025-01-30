import { getEntry } from "astro:content";
import { createHash } from "node:crypto";

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

// func (puzzleId, userId)
// if userId -> add it to the list of puzzles

// add to APIRoute puzzleId and userId? yeah
export const checkSolutionAPI = async (request: Request, puzzleId: string) => {
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
  let response;
  let status;
  if (valid_solution === true) {
    status = 200;
    response = {
      valid_solution: true,
      message: "You got yourself a valid solution, congrats!",
    };
  } else {
    status = 400;
    response = {
      valid_solution: false,
      message:
        "Uh oh, that's the wrong solution, make sure you wrote it correctly, the spaces matter!",
    };
  }

  return new Response(JSON.stringify(response, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: status,
  });
};

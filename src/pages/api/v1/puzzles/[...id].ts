import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { createHash } from "node:crypto";

export const prerender = false;

export async function getStaticPaths() {
  const puzzles = await getCollection("puzzles");
  return puzzles.map((puzzle) => ({
    params: { id: puzzle.id },
    props: { puzzle },
  }));
}

// GET request to get the puzzle
export const GET: APIRoute = async ({ params }) => {
  const puzzle = await getEntry("puzzles", params.id);
  puzzle.data["how_to_submit"] =
    "Submit a solution as a POST request with the same URL your using to get this puzzle.";
  puzzle.data["example_submission"] = {
    solution: "I just wish I could see another perspective, one-",
  };

  return new Response(JSON.stringify(puzzle.data, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};

// POST request to actually send a solution and verify it
export const POST: APIRoute = async ({ request, params }) => {
  // Make sure puzzle_id and solution exists in the json input
  const submission = await request.json();
  if (submission.solution === undefined) {
    return new Response(
      JSON.stringify({ error: "Where is the solution?" }, null, 2),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  const puzzle = await getEntry("puzzles", params.id);
  if (puzzle === undefined) {
    return new Response(
      JSON.stringify(
        {
          error: `Puzzle with ${params.id} doesn't exist, are you sure you wrote it right?`,
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

  // Add a salt to the solution and hash it using sha512
  const saltedSolution = submission.solution.concat(
    puzzle.data.USED_INTERNALLY_salt_of_solution,
  );
  const hashBuffer = createHash("sha512").update(saltedSolution).digest("hex");

  // Check the hash and return the response
  let response;
  let status;
  if (hashBuffer === puzzle.data.USED_INTERNALLY_sha512_of_solution) {
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

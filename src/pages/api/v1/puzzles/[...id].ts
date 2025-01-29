import type { APIRoute } from "astro";
import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import { createHash } from "node:crypto";
import { checkSolution } from "../../../../scripts/solution.ts";

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
  if (params.id === undefined) {
    throw new Error(
      "params.id is undefined, please report as bug with the current url",
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

  interface Puzzle extends CollectionEntry<"puzzles"> {
    data: CollectionEntry<"puzzles">["data"] & {
      how_to_submit?: string;
      example_submission?: { solution: string };
    };
  }

  (puzzle as Puzzle).data["how_to_submit"] =
    "Submit a solution as a POST request with the same URL your using to get this puzzle.";
  (puzzle as Puzzle).data["example_submission"] = {
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
  // what if its not json
  if (submission.solution === undefined) {
    return new Response(
      JSON.stringify({ error: "Where is the solution?" }, null, 2),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  if (params.id === undefined) {
    throw new Error(
      "For some reason params.id is undefined? Please report this as a bug with the current url!",
    );
  }

  let valid_solution = false;
  try {
    valid_solution = await checkSolution(params.id, submission.solution);
  } catch (e) {
    return new Response(
      JSON.stringify(
        {
          error: e.message,
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

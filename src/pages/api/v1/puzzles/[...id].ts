import type { APIRoute } from "astro";
import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import { checkSolutionAPI } from "../../../../scripts/solution.ts";

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
  // Make sure params.id
  if (params.id === undefined) {
    throw new Error(
      "For some reason params.id is undefined? Please report this as a bug with the current url!",
    );
  }

  return await checkSolutionAPI(request, params.id);
};

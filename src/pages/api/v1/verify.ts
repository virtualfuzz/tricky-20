import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
// TODO: Would use the official deno API if @std/encode worked
import { createHash } from "node:crypto";

// GET request returns an example on how to use the verify API
export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify(
      {
        verify_via_api_post_request: "/api/v1/verify",
        instruction: "submit to the url provided above using a POST request",
        format: {
          puzzle_id: "puzzle_id/here",
          solution: "string of solution here",
        },
        example: {
          puzzle_id: "tutorials/hashy_hashy",
          solution: "i need somebody, i want to feel love",
        },
        did_you_know: `This works by running adding a salt at the end of the solution (USED_INTERNALLY_salt_of_solution), \
hashing it with sha512, and comparing it to the expected value in USED_INTERNALLY_sha512_of_solution! \
Of course you don't really need to know that to use that. But if you want to verify it yourself, you know how now!`,
      },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/json" } },
  );
};

// POST request to actually send a solution and verify it
export const POST: APIRoute = async ({ request }) => {
  // Make sure puzzle_id and solution exists in the json input
  const submission = await request.json();
  if (submission.puzzle_id === undefined) {
    return new Response(
      JSON.stringify({ error: "Where is the puzzle_id?" }, null, 2),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
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

  const puzzle = await getEntry("puzzles", submission.puzzle_id);
  if (puzzle === undefined) {
    return new Response(
      JSON.stringify(
        {
          error: `Puzzle with ${submission.puzzle_id} doesn't exist, are you sure you wrote it right?`,
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

import { getEntry } from "astro:content";
import { createHash } from "node:crypto";

// Function to check if a solution from a puzzle is correct
// Returns true if correct, false if wrong
export async function checkSolution(
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

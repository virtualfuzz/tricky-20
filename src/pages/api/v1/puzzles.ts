import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ request }: APIContext) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const puzzlesCollection = await getCollection("puzzles");
  const puzzleList = puzzlesCollection
    .filter((puzzle) => {
      if (search === null || puzzle.id.startsWith(search) === true) {
        return true;
      } else {
        return false;
      }
    })
    .map((puzzle) => ({
      puzzle_url: "/api/v1/puzzles/".concat(puzzle.id),
      puzzle_id: puzzle.id,
      you_will_learn: puzzle.data.you_will_learn,
    }));

  const puzzleHashmap = puzzleList.reduce(
    (acc: { [key: string]: typeof puzzle }, puzzle) => {
      acc[puzzle.puzzle_id] = puzzle;
      return acc;
    },
    {},
  );

  return new Response(JSON.stringify(puzzleHashmap, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}

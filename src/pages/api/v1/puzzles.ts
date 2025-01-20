import { getCollection } from "astro:content";

export const prerender = false;

export async function GET({ request }) {
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
      puzzle_url: "/api/v1/".concat(puzzle.id),
      puzzle_id: puzzle.id,
      you_will_learn: puzzle.data.you_will_learn,
    }));

  return new Response(JSON.stringify(puzzleList, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}

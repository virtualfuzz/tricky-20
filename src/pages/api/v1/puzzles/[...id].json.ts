import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";

export async function getStaticPaths() {
  const puzzles = await getCollection("puzzles");
  return puzzles.map((puzzle) => ({
    params: { id: puzzle.id },
    props: { puzzle },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const puzzle = await getEntry("puzzles", params.id);

  return new Response(JSON.stringify(puzzle.data, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};

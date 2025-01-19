import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";

const usernames = ["Sarah", "Chris", "Yan", "Elian"];

export const GET: APIRoute = async ({ params, request }) => {
  const puzzle = await getEntry("puzzles", params.id);

  return new Response(JSON.stringify(puzzle.data, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};

export async function getStaticPaths() {
  const posts = await getCollection("puzzles");
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

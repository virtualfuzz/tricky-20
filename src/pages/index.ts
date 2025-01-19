export function GET() {
  return new Response(
    `<h1>Tricky 20</h1>
<p>Tricky 20 is a collection of a bunch of computer puzzles to solve.</p>
<p>
  The special thing about tricky-20 is that the puzzles are made to be
  only accessible though the api/curl. For some reason this makes it seem
  more fun and hacker-y to me.
</p>`,
    { headers: { "Content-Type": "text/html" } },
  );
}

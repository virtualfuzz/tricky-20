export function GET() {
  return new Response(
    JSON.stringify(
      {
        "Full API reference": "Availible at /reference/api",
        "Available routes": {
          "/api/v1/puzzles": "GET: Show a list of available puzzles",
          "/api/v1/puzzles/PUZZLE_ID":
            "GET: Show a specific puzzle, POST: Submit a solution and verify it",
          "/api/v1/users": "GET: Show a list of users",
          "/api/v1/users/USER_ID":
            "GET: Show a specific user, POST: Add a completed puzzle to the user's profile, requires authentification",
        },
        Account:
          "If an API route doesn't mention requring authentication, it means it doesn't need it. An account is only used to save progress",
        "How to create an account":
          "I use oauth because I don't need to verify/moderate user accounts, since other platforms have already done that. Route is available at /account",
      },
      null,
      "\t",
    ),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}

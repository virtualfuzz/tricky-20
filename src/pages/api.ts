export function GET() {
  return new Response(
    JSON.stringify(
      {
        "Available API versions": { "/api/v1": "First version" },
        "Semantic versioning":
          "Semantic versionning is used, API routes will not be removed within one version, however new routes may be added/more functionality may be added.",
        Notice:
          "There is also some frontend with more documentation available at /",
      },
      null,
      "\t",
    ),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}

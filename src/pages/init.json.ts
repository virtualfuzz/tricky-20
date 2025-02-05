export function GET() {
  const siteData = {
    welcome_message: "welcome to tricky-20",
  };

  return new Response(JSON.stringify(siteData), {
    headers: { "Content-Type": "application/json" },
  });
}

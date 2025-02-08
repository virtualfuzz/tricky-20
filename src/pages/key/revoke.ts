import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { apiKeys, db } from "../../db/schema.ts";
import { eq } from "drizzle-orm";

export const prerender = false;

export function GET() {
  return new Response(
    JSON.stringify(
      {
        what_is_this: "This is a POST endpoint used to revoke API keys.",
        how_to_use:
          "You cannot revoke API keys using API keys (I really don't think this is a good idea). You must be logged in online and use your browser to revoke a new API key.",
        how_does_this_work:
          "Once if gets a POST request, it looks into the formData and gets apiKeyId (which is the id of the API key), then it deletes the API key from the database.",
      },
      null,
      "\t",
    ),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}

export const POST: APIRoute = async ({ request }) => {
  // Make sure user is logged in
  const session = await getSession(request);

  if (session === null) {
    return new Response(
      JSON.stringify(
        {
          error:
            "Unauthorized: You are not logged in, do this from the /account page.",
        },
        null,
        "\t",
      ),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      },
    );
  }

  // Get apiKeyId from form data
  const data = await request.formData();
  const apiKeyId = data.get("apiKeyId");

  // Check that apiKeyId exists
  if (apiKeyId === null) {
    return new Response(
      JSON.stringify(
        {
          error: "We require apiKeyId to be passed in the form data.\
apiKeyId is the internal id of the api key.",
        },
        null,
        "\t",
      ),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  const apiKey_item = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.id, apiKeyId.toString()));

  // Make sure the api key is there
  if (apiKey_item[0] === undefined) {
    return new Response(
      JSON.stringify(
        {
          error: "Couldn't find API key with apiKeyId as an id.\
apiKeyId is the internal id of the api key.",
        },
        null,
        "\t",
      ),
      {
        headers: { "Content-Type": "application/json" },
        status: 404,
      },
    );
  }

  // Actually delete the API key
  await db.delete(apiKeys).where(eq(apiKeys.id, apiKeyId.toString()));

  // Return success
  return new Response(
    JSON.stringify(
      {
        message: `Successfully deleted the API key ending with ${
          apiKey_item[0].first8Chars
        }`,
      },
      null,
      "\t",
    ),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );
};

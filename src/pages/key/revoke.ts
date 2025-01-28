import { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { db, apiKeys } from "../../db/schema.ts";
import { eq } from "drizzle-orm";

export const prerender = false;

// make it expire when the date is reached
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
        2,
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
          error:
            "We require apiKeyId to be passed in the form data.\
            apiKeyId is the internal id of the api key.",
        },
        null,
        2,
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
    .where(eq(apiKeys.id, apiKeyId));

  // Make sure the api key is there
  if (apiKey_item.length <= 0) {
    return new Response(
      JSON.stringify(
        {
          error:
            "Couldn't find API key with apiKeyId as an id.\
              apiKeyId is the internal id of the api key.",
        },
        null,
        2,
      ),
      {
        headers: { "Content-Type": "application/json" },
        status: 404,
      },
    );
  }

  //Actuaally delete the API key
  await db.delete(apiKeys).where(eq(apiKeys.id, apiKeyId));

  // Return success
  return new Response(
    JSON.stringify(
      {
        message: `Successfully deleted the API key ending with ${apiKey_item[0].last8Chars}`,
      },
      null,
      2,
    ),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );
};

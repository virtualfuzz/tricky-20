import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { createHash, randomBytes } from "node:crypto";
import { apiKeys, db } from "../../db/schema.ts";

export const prerender = false;

export function GET() {
  return new Response(
    JSON.stringify(
      {
        what_is_this: "This is a POST endpoint used to generate new API keys.",
        how_to_use:
          "You cannot generate API keys using API keys (I really don't think this is a good idea), so you must be logged in online and use your browser to generate a new API key.",
        how_does_this_work:
          "Once if gets a POST request, it looks into the formData and gets expireDate (which is the expire date of the API key), then it creates and adds a new API key.",
      },
      null,
      2,
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
        2,
      ),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      },
    );
  }

  if (session.user === undefined) {
    throw new Error(
      "session.user is undefined, please report as bug with the current url",
    );
  }

  if (session.user.id === undefined) {
    throw new Error(
      "session.user.id is undefined, please report as bug with the current url",
    );
  }

  // Get expireDate from form data
  const data = await request.formData();
  const date = data.get("expireDate");

  // Check that date exists
  if (date === null) {
    return new Response(
      JSON.stringify(
        {
          error: "We require expireDate to be passed in the form data.\
            expireDate is the date in which this API key expires and is unusable.\
            expireDate also needs to be in the future and not further then 1 year in the future.",
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

  // Check if expireDate is not too far into the future
  const maxExpireDate = new Date();
  maxExpireDate.setDate(maxExpireDate.getDate() + 365);
  const expireDate = new Date(date.toString());
  if (maxExpireDate <= expireDate) {
    return new Response(
      JSON.stringify(
        {
          error: "expireDate is too far into the future",
          message: "expireDate cannot be further then 1 year into the future.\
          expireDate is the date in which this API key expires and is unusable.\
            expireDate also needs to be in the future and not further then 1 year in the future.",
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

  // Check if expire date is not into the past
  const current = new Date();
  if (expireDate <= current) {
    return new Response(
      JSON.stringify(
        {
          error: "expireDate is in the past",
          message:
            "expireDate is in the past, this means you will generate an unusable API key.\
            expireDate is the date in which this API key expires and is unusable.\
          expireDate also needs to be in the future and not further then 1 year in the future.",
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

  // Generate api key and hash it for security
  const apiKey = randomBytes(32).toString("hex");
  const keySha512 = createHash("sha512").update(apiKey).digest("hex");

  // Create api key item and put it into the database
  const api_key: typeof apiKeys.$inferInsert = {
    first8Chars: apiKey.substring(0, 8), // stored as an identifier of the api key
    userId: session.user.id,
    keySha512,
    expireDate,
  };

  await db.insert(apiKeys).values(api_key);

  // Return success
  return new Response(
    JSON.stringify(
      {
        warning:
          "This API key will **NOT** and **CANNOT** be shown again, copy it and store it somewhere safe.",
        permissions:
          "This API key allows you to save solutions on your profile, you can play the whole 'game?' without any account.",
        apiKey,
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

import { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { randomBytes, createHash } from "node:crypto";
import { db, apiKeys } from "../db/schema.ts";

export const prerender = false;

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

  // Get expireDate from form data
  const data = await request.formData();
  const date = data.get("expireDate");

  // Check that date exists
  if (date === null) {
    return new Response(
      JSON.stringify(
        {
          error:
            "We require expireDate to be passed in the form data.\
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
  if (maxExpireDate < expireDate) {
    return new Response(
      JSON.stringify(
        {
          error: "expireDate is too far into the future",
          message:
            "expireDate cannot be further then 1 year into the future.\
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
    last8Chars: apiKey.substring(apiKey.length - 8), // stored as an identifier of the api key
    userId: session.userId,
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

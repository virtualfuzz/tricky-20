// auth.config.ts
import GitHub from "@auth/core/providers/github";
import { defineConfig } from "auth-astro";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./src/db/schema.ts";

export default defineConfig({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      // Ensure the user ID is included in the session
      if (session.user) {
        session.user = user;
      }
      return session;
    },
  },
});

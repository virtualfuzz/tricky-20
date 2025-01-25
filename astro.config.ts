import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";
import auth from "auth-astro";
import deno from "@deno/astro-adapter";

// https://astro.build/config
export default defineConfig({
  site: "https://example.org/", // TODO: Temporary until I work on a website
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
        },
      },
    }),
    compress(),
    auth(),
  ],
  output: "server",
  adapter: deno(),
  prefetch: {
    prefetchAll: true,
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
});

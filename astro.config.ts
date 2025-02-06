import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";
import auth from "auth-astro";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://tricky.jayden295.hackclub.app",
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
  adapter: node({
    mode: "standalone",
  }),
  prefetch: {
    prefetchAll: true,
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
});

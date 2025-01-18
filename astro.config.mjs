import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
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
  ],
  prefetch: {
    prefetchAll: true,
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
});

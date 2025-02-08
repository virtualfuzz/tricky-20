import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";
import auth from "auth-astro";
import node from "@astrojs/node";
import starlight from "@astrojs/starlight";

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
    starlight({
      title: "tricky-20",
      head: [
        // Example: add Fathom analytics script tag.
        {
          tag: "meta",
          attrs: {
            name: "referrer",
            content: "no-referrer",
          },
        },
        {
          tag: "meta",
          attrs: {
            "http-equiv": "Content-Security-Policy",
            content: "upgrade-insecure-requests",
          },
        },
        {
          tag: "meta",
          attrs: {
            "http-equiv": "Content-Security-Policy",
            content: "object-src 'none'",
          },
        },
      ],
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      components: {
        // Override the default `SocialIcons` component.
        Header: "./src/components/Header.astro",
        MobileMenuFooter: "./src/components/MobileMenuFooter.astro",
      },
    }),
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

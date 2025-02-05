import type { APIRoute } from "astro";

import Robots from "../ai.robots.txt/robots.json";

let getRobotsTxt = `# Taken from https://github.com/ai-robots-txt/ai.robots.txt
# This file is thus licensed with the MIT license of the ai.robots.txt project
# https://github.com/ai-robots-txt/ai.robots.txt/blob/main/LICENSE

`;

// import json and loop
for (const robot in Robots) {
  getRobotsTxt = getRobotsTxt.concat(`User-agent: ${robot}\n`);
}
getRobotsTxt = getRobotsTxt.concat("Disallow: /\n");

const getRobots = (sitemapURL: URL) =>
  `${getRobotsTxt}

Sitemap: ${sitemapURL.href}`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobots(sitemapURL));
};

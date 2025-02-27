import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

const puzzles = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/puzzles" }),
  schema: z.object({
    puzzle_id: z.string(),
    slug: z.string(),
    difficulty: z.string(),
    requirements: z.string(),
    you_will_learn: z.string().optional(),
    description: z.string(),
    vocabulary: z.array(z.unknown()),
    hints: z.array(z.string()),
    goal: z.string(),
    download: z.string(),
    USED_INTERNALLY_salt_of_solution: z.string(),
    USED_INTERNALLY_sha512_of_solution: z.string(),
  }),
});

export const collections = {
  puzzles,
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};

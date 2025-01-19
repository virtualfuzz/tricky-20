import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const puzzles = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/puzzles" }),
  schema: z.object({
    puzzle_id: z.string(),
    slug: z.string(),
    difficulty: z.string(),
    requirements: z.string(),
    you_will_learn: z.string(),
    description: z.string(),
    vocabulary: z.array(z.unknown()),
    hints: z.array(z.string()),
    goal: z.string(),
    download: z.string(),
    submit_to: z.string(),
    USED_INTERNALLY_salt_of_solution: z.string(),
    USED_INTERNALLY_sha512_of_solution: z.string(),
  }),
});

export const collections = { puzzles };

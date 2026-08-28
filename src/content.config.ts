import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const research = defineCollection({
  loader: glob({
    base: "./src/content/research",
    pattern: "**/*.md",
  }),
  schema: z.object({
    title: z.string().min(1),
    problem: z.string().min(1),
    summary: z.string().min(1).max(420),
    field: z.string().min(1),
    tags: z.array(z.string().min(1)).default([]),
    status: z.enum([
      "exploring",
      "partial-result",
      "candidate-solution",
      "inconclusive",
      "expository",
    ]),
    verification: z.enum([
      "unverified",
      "independently-checked",
      "peer-reviewed",
    ]),
    version: z.string().min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    pdf: z.string().startsWith("/research/").endsWith(".pdf"),
    source: z.string().startsWith("/research/").endsWith(".tex"),
    externalUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

export const collections = { research };

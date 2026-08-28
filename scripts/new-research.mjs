import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const [, , rawSlug, ...titleParts] = process.argv;
const slug = rawSlug?.trim().toLowerCase();

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    'Usage: npm run research:new -- <slug> "Optional paper title"\n' +
      "The slug may contain lowercase letters, numbers, and single hyphens.",
  );
  process.exit(1);
}

const title =
  titleParts.join(" ").trim() ||
  slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
const root = process.cwd();
const entryPath = join(root, "src", "content", "research", `${slug}.md`);
const assetDirectory = join(root, "public", "research", slug);

try {
  await stat(entryPath);
  console.error(`Research entry already exists: ${entryPath}`);
  process.exit(1);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const today = new Date().toISOString().slice(0, 10);
const frontmatter = `---
title: "${title.replaceAll('"', '\\"')}"
problem: "Problem name or number"
summary: "One plain-language paragraph describing the paper and its result."
field: "Mathematical field"
tags:
  - "first tag"
status: "exploring"
verification: "unverified"
version: "0.1"
publishedAt: "${today}"
updatedAt: "${today}"
pdf: "/research/${slug}/paper-v0.1.pdf"
source: "/research/${slug}/source-v0.1.tex"
externalUrl: "https://example.com/problem"
featured: false
draft: true
---

## The problem

Explain the original question and define the terms a reader needs.

## What this paper claims

State the result precisely. Separate a partial result from a claimed solution.

## Approach

Summarize the main construction or proof idea without reproducing the paper.

## What remains open

List the gaps, limitations, and checks still needed.
`;

await mkdir(join(root, "src", "content", "research"), { recursive: true });
await mkdir(assetDirectory, { recursive: true });
await writeFile(entryPath, frontmatter, { flag: "wx" });

console.log(`Created ${entryPath}`);
console.log(`Created ${assetDirectory}`);
console.log(
  "Add the PDF and LaTeX files, finish the entry, then set draft: false.",
);
console.log("Run npm run research:check before publishing.");

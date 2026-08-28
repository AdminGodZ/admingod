import { readdir, readFile, stat } from "node:fs/promises";
import { join, normalize, relative, resolve, sep } from "node:path";

const root = process.cwd();
const contentDirectory = join(root, "src", "content", "research");
const publicDirectory = join(root, "public");
const allowedStatuses = new Set([
  "exploring",
  "partial-result",
  "candidate-solution",
  "inconclusive",
  "expository",
]);
const allowedVerification = new Set([
  "unverified",
  "independently-checked",
  "peer-reviewed",
]);

function readScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match?.[1].trim().replace(/^(["'])(.*)\1$/, "$2") ?? "";
}

function resolvePublicPath(assetPath) {
  const normalizedAsset = normalize(assetPath.replace(/^\/+/, ""));
  const resolved = resolve(publicDirectory, normalizedAsset);
  const relativePath = relative(publicDirectory, resolved);

  if (relativePath.startsWith(`..${sep}`) || relativePath === "..") {
    throw new Error(`Asset escapes public/: ${assetPath}`);
  }

  return resolved;
}

async function checkAsset(assetPath, kind) {
  const filePath = resolvePublicPath(assetPath);
  const fileStats = await stat(filePath);

  if (!fileStats.isFile() || fileStats.size === 0) {
    throw new Error(`${kind} is empty or not a file: ${assetPath}`);
  }

  const file = await readFile(filePath);
  if (kind === "PDF" && !file.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
    throw new Error(`PDF signature is missing: ${assetPath}`);
  }

  if (kind === "LaTeX" && !file.toString("utf8").includes("\\documentclass")) {
    throw new Error(`LaTeX source has no \\documentclass: ${assetPath}`);
  }
}

const files = (await readdir(contentDirectory)).filter((file) =>
  file.endsWith(".md"),
);
const errors = [];

for (const file of files) {
  try {
    const slug = file.slice(0, -3);
    const content = await readFile(join(contentDirectory, file), "utf8");
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

    if (!match) throw new Error("Frontmatter block is missing");

    const frontmatter = match[1];
    const draft = readScalar(frontmatter, "draft") === "true";
    const status = readScalar(frontmatter, "status");
    const verification = readScalar(frontmatter, "verification");
    const publishedAt = readScalar(frontmatter, "publishedAt");
    const updatedAt = readScalar(frontmatter, "updatedAt");
    const version = readScalar(frontmatter, "version");
    const pdf = readScalar(frontmatter, "pdf");
    const source = readScalar(frontmatter, "source");

    if (!allowedStatuses.has(status))
      throw new Error(`Unknown status: ${status}`);
    if (!allowedVerification.has(verification)) {
      throw new Error(`Unknown verification state: ${verification}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
      throw new Error("publishedAt must use YYYY-MM-DD");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(updatedAt)) {
      throw new Error("updatedAt must use YYYY-MM-DD");
    }
    if (updatedAt < publishedAt) {
      throw new Error("updatedAt cannot be earlier than publishedAt");
    }

    for (const [label, assetPath, extension] of [
      ["PDF", pdf, ".pdf"],
      ["LaTeX", source, ".tex"],
    ]) {
      if (!assetPath.startsWith(`/research/${slug}/`)) {
        throw new Error(`${label} path must start with /research/${slug}/`);
      }
      if (!assetPath.endsWith(extension)) {
        throw new Error(`${label} path must end with ${extension}`);
      }
      if (!assetPath.includes(`v${version}`)) {
        throw new Error(`${label} filename must include v${version}`);
      }
    }

    if (!draft) {
      const placeholders = [
        "Problem name or number",
        "One plain-language paragraph describing the paper and its result.",
        "Mathematical field",
        "https://example.com/problem",
      ];
      const remainingPlaceholder = placeholders.find((value) =>
        content.includes(value),
      );

      if (remainingPlaceholder) {
        throw new Error(
          `Published entry still contains: ${remainingPlaceholder}`,
        );
      }

      await checkAsset(pdf, "PDF");
      await checkAsset(source, "LaTeX");
    }
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}

if (errors.length > 0) {
  console.error("Research release checks failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Research release checks passed for ${files.length} entr${files.length === 1 ? "y" : "ies"}.`,
);

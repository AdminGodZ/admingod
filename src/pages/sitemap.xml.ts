import type { APIRoute } from "astro";
import { getPublishedResearch } from "@/lib/research";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ?? new URL("https://admingod.ch");
  const research = await getPublishedResearch();
  const staticPaths = ["/", "/contact", "/research"];
  const urls = [
    ...staticPaths.map((path) => ({ location: new URL(path, baseUrl).href })),
    ...research.map((entry) => ({
      location: new URL(`/research/${entry.id}`, baseUrl).href,
      lastModified: entry.data.updatedAt.toISOString().slice(0, 10),
    })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ location, lastModified }) => `  <url>
    <loc>${escapeXml(location)}</loc>${lastModified ? `\n    <lastmod>${lastModified}</lastmod>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};

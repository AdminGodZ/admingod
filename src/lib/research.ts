import { type CollectionEntry, getCollection } from "astro:content";

export type ResearchEntry = CollectionEntry<"research">;

type ResearchQuery = {
  includeDrafts?: boolean;
};

export async function getResearch({
  includeDrafts = import.meta.env.DEV,
}: ResearchQuery = {}) {
  const entries = await getCollection(
    "research",
    ({ data }) => includeDrafts || !data.draft,
  );

  return entries.sort(
    (left, right) =>
      right.data.updatedAt.getTime() - left.data.updatedAt.getTime(),
  );
}

export function getPublishedResearch() {
  return getResearch({ includeDrafts: false });
}

export function formatResearchDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

# Portfolio Website

AdminGod's static portfolio, built with Astro, React islands, and Tailwind CSS.

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Publishing math research

Research entries live in `src/content/research`. Each Markdown file generates one page at `/research/<slug>` and points to versioned paper files under `public/research/<slug>`.

Start a paper with:

```bash
npm run research:new -- erdos-problem-000 "Paper title"
```

The command creates a draft metadata file and its public asset folder. Then:

1. Put the compiled PDF and complete `.tex` source in the generated asset folder.
2. Update the `pdf`, `source`, `version`, dates, result status, and verification state in the Markdown frontmatter.
3. Write the web summary below the frontmatter. Markdown supports `$inline$` and `$$display$$` math.
4. Keep `draft: true` while writing. Drafts appear during local development but are omitted from production builds, the public archive, and the sitemap. Change it to `false` only when the release is ready.
5. Run `npm run research:check` and `npm run build` before committing.

Result status and verification are separate on purpose. A paper can claim a `candidate-solution` while remaining `unverified`. Supported result statuses are `exploring`, `partial-result`, `candidate-solution`, `inconclusive`, and `expository`. Verification can be `unverified`, `independently-checked`, or `peer-reviewed`.

For a revision, add new versioned PDF and LaTeX filenames instead of overwriting an already published file. Update the entry's `version`, `updatedAt`, `pdf`, and `source` fields. The archive, home-page teaser, detail route, metadata, and sitemap update from the content entry automatically.

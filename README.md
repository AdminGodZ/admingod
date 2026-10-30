<div align="center">

# AdminGod

**My personal portfolio: the software I build, the tools I use, and where I'm headed next.**

[![CI/CD](https://img.shields.io/github/actions/workflow/status/AdminGodZ/admingod/ci.yml?branch=master&style=flat-square&label=CI%2FCD&logo=githubactions&logoColor=white)](https://github.com/AdminGodZ/admingod/actions/workflows/ci.yml)
[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Railway](https://img.shields.io/badge/hosted_on-Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.com)

**[admingod.ch](https://admingod.ch)**

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/hero-dark.webp" />
  <source media="(prefers-color-scheme: light)" srcset="docs/hero-light.webp" />
  <img src="docs/hero-dark.webp" alt="The AdminGod hero: the AdminGod wordmark next to the AdminGod logo over a starfield" width="900" />
</picture>

</div>

<br />

## ✨ Highlights

|                             |                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 🌌 **Living background**    | A starfield behind every page and a canvas particle field rising out of the hero.                                        |
| 🟢 **Live status pills**    | Project cards for self-hosted services ping them from the browser and show whether they're up, with the round-trip time. |
| 🧭 **Career roadmap**       | A scroll-driven timeline from school to apprenticeship that branches into the paths I'm considering next.                |
| 🪐 **Orbiting stack**       | The tools I work with circle the logo on two tilted rings, passing behind it as they go around.                          |
| 🌗 **Light & dark themes**  | The new theme spreads out from the toggle as a growing circle, using the View Transitions API.                           |
| ⚡ **Fully static**         | Astro renders every page at build time and only the interactive pieces ship as React islands.                            |
| ♿ **Reduced motion aware** | Scroll reveals, the starfield and the particle effects settle down when `prefers-reduced-motion` is set.                 |

<div align="center">
<br />
<img src="docs/work.webp" alt="Built projects: AdminSearch, AetherZ and Aeralyth cards, two of them with green Live status pills" width="900" />
<br /><br />
<img src="docs/roadmap.webp" alt="The career roadmap branching into joining the cantonal police, continuing in IT, and the academic route" width="900" />
<br /><br />
<img src="docs/stack.webp" alt="Tool icons for Next.js, React, TypeScript, Tailwind CSS, Node.js, Rust, Railway and Linux orbiting the AdminGod logo" width="700" />
<br /><br />
</div>

## 🚀 Getting started

You need Node.js 26 (see [`.nvmrc`](.nvmrc)).

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

| Command             | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Starts the dev server with hot reload              |
| `npm run build`     | Typechecks, then builds the static site to `dist/` |
| `npm run preview`   | Serves the production build locally                |
| `npm run typecheck` | Runs `tsc --noEmit`                                |
| `npm run lint`      | Lints and checks formatting with Biome             |
| `npm run format`    | Formats the code with Biome                        |

## 🧭 Project structure

```text
src/
├── pages/
│   ├── index.astro            # Hero, projects, roadmap, tool stack, footer
│   ├── contact.astro          # Contact form that opens a prefilled email
│   ├── 404.astro
│   └── sitemap.xml.ts
├── layouts/layout.astro       # Metadata, pre-paint theme script, theme toggle
├── components/
│   ├── portfolio/
│   │   ├── hero-text-reveal.tsx      # Animated hero heading and actions
│   │   ├── void-particle-field.tsx   # Canvas particles rising out of the hero
│   │   ├── living-starfield.astro    # Page-wide starfield
│   │   ├── service-status.astro      # Live reachability pill for self-hosted projects
│   │   ├── career-roadmap.astro      # Timeline markup and styles
│   │   ├── career-roadmap-motion.ts  # Scroll-driven roadmap animation
│   │   ├── stack-orbit.astro         # Tools orbiting the logo
│   │   ├── scroll-reveal.astro       # Fades sections in as they enter the viewport
│   │   └── scroll-sidebar.tsx        # Draggable scroll position indicator
│   └── ui/button.tsx
├── assets/                    # Logo and project artwork, optimized by astro:assets
└── styles/global.css          # Tailwind v4 theme tokens
public/                        # Favicons, robots.txt, white logo for dark mode
scripts/smoke-test.sh          # Checks a running container
```

## 🚢 CI/CD

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every pull request and every push to `master`:

| Job                    | Checks                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 🧹 Biome               | `biome ci`: lint, formatting, import order                                                                               |
| 🔨 Typecheck and build | `tsc --noEmit`, `astro build`, expected pages exist, lockfile in sync                                                    |
| 🛡️ Dependency audit    | `npm audit` fails on high or critical advisories in production dependencies                                              |
| 🐳 Container           | builds the `Dockerfile` and runs `scripts/smoke-test.sh` against it: routes, 404s, sitemap, caching and security headers |

On `master`, the **Deploy to Railway** job runs only after all four pass, and deploys with `railway up`.

> [!NOTE]
> Deploying needs the `production` GitHub environment to have a `RAILWAY_TOKEN` secret (a Railway project token for the
> production environment) and a `RAILWAY_SERVICE` variable (`admingod`).

## 🐳 Running the container

The site ships as a [Caddy](https://caddyserver.com) container ([`Dockerfile`](Dockerfile), [`Caddyfile`](Caddyfile),
[`railway.json`](railway.json)). Caddy serves the static build with compression, long-lived caching for hashed assets
and security headers. To check it locally:

```bash
docker build -t admingod .
docker run --rm -e PORT=8080 -p 8080:8080 admingod
scripts/smoke-test.sh http://localhost:8080
```

<div align="center">
<br />

<img src="docs/contact.webp" alt="The contact page: 'Let's build something.' next to a message form" width="700" />

<sub>Built and self-hosted by <a href="https://github.com/AdminGodZ">AdminGod</a></sub>

</div>

# Portfolio Website

AdminGod's static portfolio, built with Astro, React islands, and Tailwind CSS.

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm run format
```

## CI/CD

`.github/workflows/ci.yml` runs on every pull request and every push to `master`:

| Job                 | Checks                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Biome               | `biome ci`: lint, formatting, import order                                                                               |
| Typecheck and build | `tsc --noEmit`, `astro build`, expected pages exist, lockfile in sync                                                    |
| Dependency audit    | `npm audit` fails on high or critical advisories in production dependencies                                              |
| Container           | builds the `Dockerfile` and runs `scripts/smoke-test.sh` against it: routes, 404s, sitemap, caching and security headers |

On `master`, the `Deploy to Railway` job runs only after all four pass, and deploys with `railway up`. It needs the `production` GitHub environment to have a `RAILWAY_TOKEN` secret (a Railway project token for the production environment) and a `RAILWAY_SERVICE` variable (`admingod`).

The site ships as a Caddy container (`Dockerfile`, `Caddyfile`, `railway.json`). To check it locally:

```bash
docker build -t admingod .
docker run --rm -e PORT=8080 -p 8080:8080 admingod
scripts/smoke-test.sh http://localhost:8080
```

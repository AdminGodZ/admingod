import {
  ArrowUp,
  ArrowUpRight,
  Mail,
} from "lucide-react";
import Image from "next/image";
import {
  siLinux,
  siNextdotjs,
  siNodedotjs,
  siRailway,
  siReact,
  siRust,
  siTailwindcss,
  siTypescript,
} from "simple-icons";
import { HeroTextReveal } from "./components/hero-text-reveal";
import ScrollSidebar from "./components/scroll-sidebar";
import VoidParticleField from "./components/void-particle-field";

const projects = [
  {
    name: "AdminSearch",
    type: "Search engine",
    description:
      "A self-made search engine experience built around private, practical search, with SearXNG running as the underlying engine.",
    meta: "Next.js / SearXNG",
    image: "/adminsearch_transparent.png",
    href: "https://github.com/AdminGodZ/AdminSearch",
  },
  {
    name: "AetherZ",
    type: "Chess engine",
    description:
      "A self-programmed chess engine focused on move search, board evaluation, and building the core engine logic from scratch.",
    meta: "Custom Engine / Chess AI",
    image: "/aetherz_transparent.png",
    href: "https://github.com/AdminGodZ/AetherZ",
  },
  {
    name: "Aeralyth",
    type: "Self-hosted cloud",
    description:
      "A self-hosted cloud platform with encrypted vaults, file permissions, and storage backed by a Next.js frontend and Actix Web backend.",
    meta: "Next.js / Actix Web",
    image: "/aeralyth_transparent.png",
    href: "https://github.com/AdminGodZ/Aeralyth",
  },
];

const stack = [
  { name: "Next.js", type: "Framework", icon: siNextdotjs },
  { name: "React", type: "UI library", icon: siReact },
  { name: "TypeScript", type: "Language", icon: siTypescript },
  { name: "Tailwind CSS", type: "Styling", icon: siTailwindcss },
  { name: "Node.js", type: "Runtime", icon: siNodedotjs },
  { name: "Rust", type: "Language", icon: siRust },
  { name: "Railway", type: "Cloud platform", icon: siRailway },
  { name: "Linux", type: "Platform", icon: siLinux },
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.28-.36 6.72-1.61 6.72-7.25a5.65 5.65 0 0 0-1.5-3.95 5.4 5.4 0 0 0-.14-2.95S17.9 0 15.18 1.85a13.38 13.38 0 0 0-7 0C5.46 0 4.28.35 4.28.35a5.4 5.4 0 0 0-.14 2.95 5.65 5.65 0 0 0-1.5 3.95c0 5.63 3.44 6.88 6.72 7.25A4.8 4.8 0 0 0 8 18v4" />
      <path d="M8 19c-3 .9-3-2-4-2" />
    </svg>
  );
}

export default function Home() {
  return (
    <main
      id="top"
      className="min-h-screen overflow-hidden bg-background text-foreground"
    >
      <ScrollSidebar />

      <section className="relative flex min-h-[100svh] items-center overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
        <div className="portfolio-void-bg absolute inset-0" />
        <div className="portfolio-void-grid absolute inset-0" />
        <div className="void-scanline" />
        <VoidParticleField className="void-particle-canvas pointer-events-none absolute inset-x-0 bottom-0 h-[54vh] w-full" />
        <div className="void-portal pointer-events-none absolute inset-x-0 bottom-0 h-[48vh]" />
        <div className="void-portal-fade pointer-events-none absolute inset-x-0 bottom-0 h-[42vh]" />

        <aside className="pointer-events-none absolute inset-y-0 right-[2vw] left-[58%] z-[4] hidden items-center justify-center lg:flex">
          <Image
            src="/admingod_dark_transparent.png"
            alt="AdminGod logo"
            width={900}
            height={900}
            priority
            draggable={false}
            sizes="44vw"
            className="h-auto w-[min(44vw,880px)] select-none object-contain opacity-95 drop-shadow-[0_38px_54px_rgba(0,0,0,0.22)]"
          />
        </aside>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl -translate-y-6 gap-10 lg:grid-cols-[minmax(0,0.56fr)_minmax(360px,0.44fr)] lg:items-center xl:-translate-y-8">
          <div className="max-w-[740px] pt-12 sm:pt-16 lg:pt-0">
            <HeroTextReveal
              title="AdminGod"
              description="I love building software and hosting it myself."
              titleClassName="max-w-4xl text-[clamp(4rem,10vw,9rem)] font-black leading-[0.84] tracking-normal text-[#0c0c0c]"
              descriptionClassName="mt-8 max-w-2xl text-xl leading-8 text-black/68 sm:text-2xl sm:leading-9"
              actionsClassName="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                className="inline-flex h-12 select-none items-center justify-center gap-2 border border-black bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#242424]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Contact me
              </button>
              <a
                href="https://github.com/AdminGodZ"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 select-none items-center justify-center gap-2 border border-black/12 bg-white/60 px-5 text-sm font-semibold text-black backdrop-blur-md transition-colors hover:border-black/25 hover:bg-white"
              >
                <GitHubIcon className="h-4 w-4" />
                GitHub
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </HeroTextReveal>
          </div>

          <aside className="relative z-[5] flex justify-center pb-20 lg:hidden">
            <Image
              src="/admingod_dark_transparent.png"
              alt="AdminGod logo"
              width={760}
              height={760}
              priority
              draggable={false}
              sizes="88vw"
              className="h-auto w-full max-w-[560px] select-none object-contain drop-shadow-[0_34px_48px_rgba(0,0,0,0.2)]"
            />
          </aside>
        </div>

        <div
          className="hero-section-dissolve pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[30vh]"
          aria-hidden="true"
        />
      </section>

      <section
        id="work"
        className="relative z-[7] -mt-10 px-5 pt-12 pb-24 text-foreground sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-5">
            <h2 className="shrink-0 text-lg font-semibold text-black/76">
              Built projects
            </h2>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {projects.map((project) => {
              const cardClassName = `project-card group relative flex min-h-[230px] overflow-hidden rounded-lg border border-black/8 bg-white p-6 text-left no-underline shadow-[0_18px_38px_rgba(0,0,0,0.08)] ring-1 ring-white/80 sm:min-h-[260px] ${project.href ? "cursor-pointer" : ""}`;
              const cardContent = (
                <>
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`${project.name} project visual`}
                      fill
                      draggable={false}
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="project-card-image project-card-image-uniform pointer-events-none select-none opacity-[0.92]"
                    />
                  ) : null}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_42%,rgba(255,255,255,0.96)_100%)]" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/90" />
                  <div className="relative z-10 mt-auto flex w-full items-end justify-between gap-5">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-[0.18em] text-black">
                        {project.name}
                      </h3>
                      {project.name !== "Under Construction" ? (
                        <p className="mt-1 text-sm font-semibold text-black/56">
                          {project.type}
                        </p>
                      ) : null}
                      <p className="sr-only">
                        {project.description} {project.meta}
                      </p>
                    </div>
                    {project.name !== "Under Construction" ? (
                      <ArrowUpRight
                        className="project-card-arrow h-5 w-5 shrink-0 text-black"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                </>
              );

              if (project.href) {
                return (
                  <a
                    key={project.name}
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cardClassName}
                    aria-label={`Open ${project.name} on GitHub`}
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <article key={project.name} className={cardClassName}>
                  {cardContent}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="stack"
        className="border-t border-black/8 bg-background px-5 py-24 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-5">
            <h2 className="shrink-0 text-lg font-semibold text-black/76">
              Tools I work with
            </h2>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stack.map((item) => (
              <li
                key={item.name}
                className="group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-lg border border-black/8 bg-white p-5 shadow-[0_18px_38px_rgba(0,0,0,0.06)] ring-1 ring-white/80 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-black/16 hover:shadow-[0_24px_46px_rgba(0,0,0,0.1)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0)_36%,rgba(0,0,0,0.035)_100%)]" />
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute -top-7 -right-7 h-32 w-32 fill-current text-black/[0.035] transition-transform duration-500 group-hover:scale-110"
                  aria-hidden="true"
                >
                  <path d={item.icon.path} />
                </svg>

                <div className="relative flex h-14 w-14 items-center justify-center rounded-md border border-black/8 bg-black/[0.025]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 fill-current text-black/78"
                    aria-hidden="true"
                  >
                    <path d={item.icon.path} />
                  </svg>
                </div>

                <div className="relative mt-8">
                  <h3 className="text-lg font-bold text-black">{item.name}</h3>
                  <p className="mt-1 text-sm text-black/60">{item.type}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <footer className="border-t border-black bg-[#0d0d0d] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="max-w-lg">
              <p className="text-2xl font-bold">AdminGod</p>
              <p className="mt-4 max-w-md leading-7 text-white/65">
                Selected software projects and the tools I use to build them.
              </p>
            </div>

            <nav
              aria-label="Footer navigation"
              className="grid grid-cols-2 gap-x-12 gap-y-8 sm:gap-x-20"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Explore
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href="#work"
                    className="text-sm font-semibold text-white/70 transition-colors hover:text-white"
                  >
                    Projects
                  </a>
                  <a
                    href="#stack"
                    className="text-sm font-semibold text-white/70 transition-colors hover:text-white"
                  >
                    Tools
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Connect
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href="https://github.com/AdminGodZ"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
                  >
                    GitHub
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="https://github.com/AdminGodZ/admingod"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
                  >
                    Site source
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </nav>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 AdminGod</p>
            <a
              href="#top"
              className="inline-flex items-center gap-2 font-semibold text-white/65 transition-colors hover:text-white"
            >
              Back to top
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

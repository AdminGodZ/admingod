import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  Github,
  Mail,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import Image from "next/image";
import CipherText from "./components/cipher-text";
import ScrollSidebar from "./components/scroll-sidebar";
import VoidParticleField from "./components/void-particle-field";
import VoidPortalButton from "./components/void-portal-button";

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
    name: "Under Construction",
    type: "In progress",
    description:
      "A third project is currently being built and will be added here once it is ready to show properly.",
    meta: "Coming Soon",
    image: "/under_construction_transparent.png",
  },
];

const capabilities = [
  {
    icon: Code2,
    title: "Product UI",
    copy: "Interfaces that stay quiet, usable, and sharp under real repeated use.",
  },
  {
    icon: TerminalSquare,
    title: "Practical Automation",
    copy: "Small tools, scripts, and workflows that remove manual steps instead of adding ceremonies.",
  },
  {
    icon: ShieldCheck,
    title: "Security Awareness",
    copy: "Engineering choices that account for failure modes, permissions, and operational behavior.",
  },
];

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Rust",
  "Python",
  "Linux",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <ScrollSidebar />

      <section className="relative flex min-h-[100svh] items-center overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
        <div className="portfolio-void-bg absolute inset-0" />
        <div className="portfolio-void-grid absolute inset-0" />
        <div className="void-scanline" />
        <VoidParticleField className="void-particle-canvas pointer-events-none absolute inset-x-0 bottom-0 h-[54vh] w-full" />
        <div className="void-portal pointer-events-none absolute inset-x-0 bottom-0 h-[48vh]" />
        <div className="void-portal-fade pointer-events-none absolute inset-x-0 bottom-0 h-[42vh]" />

        <Image
          src="/admingod_dark_transparent.png"
          alt="AdminGod logo"
          width={900}
          height={900}
          priority
          draggable={false}
          sizes="(min-width: 1280px) 760px, (min-width: 1024px) 58vw, 88vw"
          className="pointer-events-none absolute right-[-12vw] bottom-[4vh] z-[4] hidden h-[88vh] w-auto max-w-none select-none object-contain opacity-95 drop-shadow-[0_38px_54px_rgba(0,0,0,0.22)] lg:block xl:right-[-6vw]"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl -translate-y-6 gap-10 lg:grid-cols-[minmax(0,0.56fr)_minmax(360px,0.44fr)] lg:items-center xl:-translate-y-8">
          <div className="max-w-[740px] pt-12 sm:pt-16 lg:pt-0">
            <div className="mb-8 inline-flex max-w-full items-center gap-3 border border-black/10 bg-white/58 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-black/58 backdrop-blur-md">
              <span className="font-mono text-black/36">{"//"}</span>
              <CipherText text="Developer - Systems Engineer - Privacy Enthusiast" />
            </div>

            <h1 className="max-w-4xl text-[clamp(4rem,10vw,9rem)] font-black leading-[0.84] tracking-normal text-[#0c0c0c]">
              AdminGod
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-black/68 sm:text-2xl sm:leading-9">
              I build private systems, intelligent tools, and clean digital
              experiences with code that stays understandable after the first
              version ships.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="inline-flex h-12 select-none items-center justify-center gap-2 border border-black bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#242424]"
              >
                Contact me
                <Mail className="h-4 w-4" aria-hidden="true" />
              </button>
              <a
                href="https://github.com/AdminGodZ"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 select-none items-center justify-center gap-2 border border-black/12 bg-white/60 px-5 text-sm font-semibold text-black backdrop-blur-md transition-colors hover:border-black/25 hover:bg-white"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
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

        <div className="void-portal-actions absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
          <VoidPortalButton targetId="work" ariaLabel="Scroll to selected work">
            <ArrowDown className="h-5 w-5" aria-hidden="true" />
          </VoidPortalButton>
        </div>
      </section>

      <section
        id="work"
        className="border-t border-black/8 bg-background px-5 py-24 text-foreground sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-5">
              <p className="shrink-0 font-mono text-sm font-black uppercase tracking-[0.34em] text-black/76">
                Built projects
              </p>
              <div className="h-px flex-1 bg-black/10" />
            </div>
            <a
              href="https://github.com/AdminGodZ"
              target="_blank"
              rel="noreferrer"
              className="inline-flex select-none items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-black/72 transition-colors hover:text-black"
            >
              View all projects
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
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
                      className="project-card-image pointer-events-none select-none object-cover opacity-[0.92]"
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

      <section className="border-t border-black/8 bg-background px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {capabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <article
                  key={capability.title}
                  className="border border-black/10 bg-white p-6"
                >
                  <Icon className="h-6 w-6 text-black/72" aria-hidden="true" />
                  <h3 className="mt-8 text-xl font-bold">{capability.title}</h3>
                  <p className="mt-3 leading-7 text-black/62">
                    {capability.copy}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-14 grid gap-8 border-t border-black/10 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/42">
                Stack
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-normal sm:text-5xl">
                The toolset changes. The taste for simple systems stays.
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="border border-black/10 bg-white px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-black/62"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-black/12 bg-background px-5 py-10 text-foreground sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-black/40">
            AdminGod / Portfolio
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/AdminGodZ"
              target="_blank"
              rel="noreferrer"
              className="inline-flex select-none items-center gap-2 text-sm font-semibold text-black/68 transition-colors hover:text-black"
            >
              GitHub
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

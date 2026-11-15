// Drives the pinned career roadmap. The section is several screens tall and
// its stage sticks to the viewport; how far the page has scrolled through the
// section picks the chapter on show. Each chapter holds for most of its share
// of the scroll and then hands over to the next, and after the last one the
// fork of possible paths draws itself in.

type MotionWindow = Window & {
  __careerRoadmapMotionCleanup?: () => void;
};

const HANDOVER = 0.42; // share of each chapter's scroll spent moving on
const REVEAL_LENGTH = 0.22; // share of the fork's scroll each reveal takes
const FORK_REVEAL_UNITS = 0.7; // share of the fork's scroll used for reveals

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const easeInOut = (value: number) =>
  value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;
const easeOut = (value: number) => 1 - (1 - value) ** 3;
const pad = (value: number) => String(value).padStart(2, "0");

const motionWindow = window as MotionWindow;
motionWindow.__careerRoadmapMotionCleanup?.();

const section = document.querySelector<HTMLElement>("[data-roadmap]");
const stage = section?.querySelector<HTMLElement>("[data-roadmap-stage]");
const frame = section?.querySelector<HTMLElement>("[data-roadmap-frame]");

if (section && stage && frame) {
  const chapters = Array.from(
    section.querySelectorAll<HTMLElement>("[data-roadmap-chapter]"),
  );
  const stops = Array.from(
    section.querySelectorAll<HTMLButtonElement>("[data-roadmap-stop]"),
  );
  const fill = section.querySelector<HTMLElement>("[data-roadmap-fill]");
  const counter = section.querySelector<HTMLElement>("[data-roadmap-counter]");
  const future = section.querySelector<HTMLElement>("[data-roadmap-future]");
  const fork = section.querySelector<SVGSVGElement>("[data-roadmap-fork]");
  const reveals = Array.from(
    section.querySelectorAll<HTMLElement>("[data-roadmap-reveal]"),
  ).map((element) => ({
    element,
    start: Number(element.dataset.roadmapReveal) || 0,
  }));
  const draws = Array.from(
    section.querySelectorAll<SVGPathElement>("[data-roadmap-draw]"),
  ).map((element) => ({
    element,
    start: Number(element.dataset.roadmapDraw) || 0,
  }));

  const chapterCount = chapters.length;
  const futureUnits = Number(section.dataset.roadmapFutureUnits) || 2;
  const totalUnits = chapterCount + futureUnits;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let current = -1;
  let target = 0;
  let frameId = 0;
  let lastTime = 0;
  let activeIndex = -1;

  const scrollProgress = () => {
    const rect = section.getBoundingClientRect();
    const distance = rect.height - window.innerHeight;
    return distance > 0 ? clamp(-rect.top / distance) : 0;
  };

  // Where on the rail the stage is: 0 is the first chapter, chapterCount is
  // the fork. Between whole numbers the stage is handing over.
  const railPosition = (units: number) => {
    if (units >= chapterCount) return chapterCount;
    const whole = Math.floor(units);
    const handover = clamp((units - whole - (1 - HANDOVER)) / HANDOVER);
    return whole + easeInOut(handover);
  };

  const render = (progress: number) => {
    const units = progress * totalUnits;
    const position = railPosition(units);
    const forkProgress = clamp(
      (units - chapterCount) / (futureUnits * FORK_REVEAL_UNITS),
    );

    chapters.forEach((chapter, index) => {
      const offset = index - position;
      const distance = Math.min(1, Math.abs(offset));
      const opacity = clamp(1 - distance * 1.6);
      chapter.style.setProperty("--chapter-opacity", opacity.toFixed(3));
      chapter.style.setProperty("--chapter-x", `${(offset * 64).toFixed(1)}px`);
      chapter.style.setProperty(
        "--chapter-scale",
        (1 - distance * 0.05).toFixed(4),
      );
      chapter.style.setProperty(
        "--chapter-blur",
        reduceMotion ? "0px" : `${(distance * 10).toFixed(2)}px`,
      );
      chapter.style.visibility = opacity > 0.001 ? "visible" : "hidden";
    });

    if (future) {
      const offset = clamp(chapterCount - position);
      const opacity = clamp(1 - offset * 1.6);
      future.style.setProperty("--future-opacity", opacity.toFixed(3));
      future.style.setProperty("--future-y", `${(offset * 40).toFixed(1)}px`);
      future.style.setProperty(
        "--future-visibility",
        opacity > 0.001 ? "visible" : "hidden",
      );
    }

    reveals.forEach(({ element, start }) => {
      const reveal = easeOut(clamp((forkProgress - start) / REVEAL_LENGTH));
      element.style.setProperty("--reveal", reveal.toFixed(3));
    });

    draws.forEach(({ element, start }) => {
      const drawn = easeInOut(clamp((forkProgress - start) / REVEAL_LENGTH));
      element.style.setProperty("--draw-offset", (1 - drawn).toFixed(4));
    });

    fill?.style.setProperty(
      "--roadmap-fill",
      `${((position / chapterCount) * 100).toFixed(2)}%`,
    );

    const nextActive = Math.round(position);
    if (nextActive !== activeIndex) {
      activeIndex = nextActive;
      stops.forEach((stop, index) => {
        stop.classList.toggle("is-reached", index < nextActive);
        stop.classList.toggle("is-active", index === nextActive);
        if (index === nextActive) {
          stop.setAttribute("aria-current", "step");
        } else {
          stop.removeAttribute("aria-current");
        }
      });
      if (counter) {
        counter.textContent =
          nextActive < chapterCount
            ? `${pad(nextActive + 1)} / ${pad(chapterCount)}`
            : "What's next";
      }
    }
  };

  const tick = (time: number) => {
    frameId = 0;
    const elapsed = lastTime ? Math.min(64, time - lastTime) : 16.67;
    lastTime = time;

    const smoothing = reduceMotion ? 1 : 1 - Math.exp(-elapsed / 120);
    current += (target - current) * smoothing;
    if (Math.abs(target - current) < 0.0002) current = target;
    render(current);

    if (current !== target) {
      frameId = window.requestAnimationFrame(tick);
    } else {
      lastTime = 0;
    }
  };

  const onScroll = () => {
    target = scrollProgress();
    if (!frameId) frameId = window.requestAnimationFrame(tick);
  };

  // Shrink the stage when the window is too short to show all of it.
  const fit = () => {
    const available = stage.clientHeight - 32;
    const natural = frame.offsetHeight;
    const scale = natural > available ? available / natural : 1;
    frame.style.setProperty("--roadmap-fit", scale.toFixed(4));
  };

  // Lay the fork's lines from the middle of the stage to each path's card.
  const drawFork = () => {
    if (!fork || fork.clientWidth === 0) return;
    const box = fork.getBoundingClientRect();
    const width = box.width;
    const height = box.height;
    const middle = width / 2;
    const bend = height * 0.45;
    const radius = Math.min(12, bend);
    fork.setAttribute("viewBox", `0 0 ${width} ${height}`);

    fork
      .querySelectorAll<SVGPathElement>("[data-roadmap-fork-path]")
      .forEach((path) => {
        const name = path.dataset.roadmapForkPath;
        const card = section.querySelector<HTMLElement>(
          `[data-roadmap-path="${name}"] > :first-child`,
        );
        if (!card) return;
        const cardBox = card.getBoundingClientRect();
        const x = cardBox.left + cardBox.width / 2 - box.left;

        if (Math.abs(x - middle) < 1) {
          path.setAttribute("d", `M ${middle} 0 V ${height}`);
          return;
        }

        const direction = x < middle ? -1 : 1;
        path.setAttribute(
          "d",
          [
            `M ${middle} 0`,
            `V ${bend - radius}`,
            `Q ${middle} ${bend} ${middle + direction * radius} ${bend}`,
            `H ${x - direction * radius}`,
            `Q ${x} ${bend} ${x} ${bend + radius}`,
            `V ${height}`,
          ].join(" "),
        );
      });
  };

  const layout = () => {
    frame.style.setProperty("--roadmap-fit", "1");
    drawFork();
    fit();
    target = scrollProgress();
    current = current < 0 ? target : current;
    render(current);
  };

  // A stop on the rail scrolls the page to that chapter.
  const onStopClick = (event: Event) => {
    const stop = event.currentTarget as HTMLButtonElement;
    const index = Number(stop.dataset.roadmapStop);
    const units =
      index < chapterCount ? index + 0.2 : chapterCount + futureUnits * 0.8;
    const distance = section.offsetHeight - window.innerHeight;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: sectionTop + (units / totalUnits) * distance,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  stops.forEach((stop) => {
    stop.addEventListener("click", onStopClick);
  });

  let resizeFrame = 0;
  const onResize = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(layout);
  };

  layout();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  const resizeObserver =
    "ResizeObserver" in window ? new ResizeObserver(onResize) : null;
  resizeObserver?.observe(frame);
  document.fonts?.ready.then(onResize);

  motionWindow.__careerRoadmapMotionCleanup = () => {
    window.cancelAnimationFrame(frameId);
    window.cancelAnimationFrame(resizeFrame);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    resizeObserver?.disconnect();
    stops.forEach((stop) => {
      stop.removeEventListener("click", onStopClick);
    });
  };
}

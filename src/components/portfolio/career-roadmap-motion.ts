type MotionWindow = Window & {
  __careerRoadmapMotionCleanup?: () => void;
};

type Point = {
  x: number;
  y: number;
};

type RoadmapGeometry = {
  academicSpineEnd: number;
  academicSpineLeadEnd: number;
  academicSpineLeadStart: number;
  academicSpineStart: number;
  academicStepLeads: number[];
  desktop: boolean;
  futureBranchEnd: number;
  futureBranchStart: number;
  futureEntryEnd: number;
  futureEntryStart: number;
  futureMobileAcademicLead: number;
  futureMobileItLead: number;
  futureMobilePoliceLead: number;
  futureSpineEnd: number;
  futureSpineLeadEnd: number;
  futureSpineLeadStart: number;
  futureSpineStart: number;
  historyEnd: number;
  historyStart: number;
  junctionCenter: number;
  nodeCenters: number[];
  policeContinuationLeadEnd: number;
  policeContinuationLeadStart: number;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const progressBetween = (value: number, start: number, end: number) => {
  if (Math.abs(end - start) < 0.001) {
    return value >= end ? 1 : 0;
  }

  return clamp((value - start) / (end - start));
};

const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;

const format = (value: number) => Number(value.toFixed(2));

const motionWindow = window as MotionWindow;
motionWindow.__careerRoadmapMotionCleanup?.();

const section = document.querySelector<HTMLElement>("[data-roadmap-motion]");

if (section) {
  const tree = section.querySelector<HTMLElement>(".roadmap-tree");
  const routeMap = section.querySelector<SVGSVGElement>(".roadmap-route-map");
  const steps = Array.from(
    section.querySelectorAll<HTMLElement>("[data-roadmap-step]"),
  );
  const nodes = steps
    .map((step) => step.querySelector<HTMLElement>(".roadmap-node"))
    .filter((node): node is HTMLElement => Boolean(node));
  const historyCards = steps
    .map((step) => step.querySelector<HTMLElement>(".roadmap-card"))
    .filter((card): card is HTMLElement => Boolean(card));
  const junction = section.querySelector<HTMLElement>(".roadmap-junction");
  const futureHeading = section.querySelector<HTMLElement>(
    "[data-roadmap-future-heading]",
  );
  const futureHeadingContent = futureHeading
    ? Array.from(futureHeading.children).filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          !child.classList.contains("roadmap-junction"),
      )
    : [];
  const futurePaths = section.querySelector<HTMLElement>(
    "[data-roadmap-future-paths]",
  );
  const futureBranches = Array.from(
    section.querySelectorAll<HTMLElement>("[data-roadmap-future-branch]"),
  );
  const policeCard =
    futureBranches[0]?.querySelector<HTMLElement>(".roadmap-future-card") ??
    null;
  const itCard =
    futureBranches[1]?.querySelector<HTMLElement>(".roadmap-future-card") ??
    null;
  const policeContinuation = section.querySelector<HTMLElement>(
    "[data-roadmap-police-continuation]",
  );
  const specialUnit =
    policeContinuation?.querySelector<HTMLElement>(".roadmap-special-unit") ??
    null;
  const academicBranch = section.querySelector<HTMLElement>(
    "[data-roadmap-academic-branch]",
  );
  const academicRoot =
    academicBranch?.querySelector<HTMLElement>(".roadmap-academic-root") ??
    null;
  const academicSteps = Array.from(
    section.querySelectorAll<HTMLElement>("[data-roadmap-academic-step]"),
  );
  const academicStepCards = academicSteps
    .map((step) => step.querySelector<HTMLElement>(":scope > div"))
    .filter((card): card is HTMLElement => Boolean(card));

  const liveRoutes = new Map<string, SVGPathElement>();
  const trackRoutes = new Map<string, SVGPathElement>();
  const maskRoutes = new Map<string, SVGPathElement>();
  const routeTips = new Map<string, SVGCircleElement>();

  section
    .querySelectorAll<SVGPathElement>("[data-roadmap-live]")
    .forEach((path) => {
      const name = path.dataset.roadmapLive;
      if (name) liveRoutes.set(name, path);
    });
  section
    .querySelectorAll<SVGPathElement>("[data-roadmap-track]")
    .forEach((path) => {
      const name = path.dataset.roadmapTrack;
      if (name) trackRoutes.set(name, path);
    });
  section
    .querySelectorAll<SVGPathElement>("[data-roadmap-mask]")
    .forEach((path) => {
      const name = path.dataset.roadmapMask;
      if (name) maskRoutes.set(name, path);
    });
  section
    .querySelectorAll<SVGCircleElement>("[data-roadmap-tip]")
    .forEach((tip) => {
      const name = tip.dataset.roadmapTip;
      if (name) routeTips.set(name, tip);
    });

  const requiredElements = [
    tree,
    routeMap,
    junction,
    futureHeading,
    futurePaths,
    policeCard,
    itCard,
    academicBranch,
    academicRoot,
  ];

  if (requiredElements.every(Boolean) && nodes.length === steps.length) {
    const roadmapTree = tree as HTMLElement;
    const roadmapRouteMap = routeMap as SVGSVGElement;
    const roadmapJunction = junction as HTMLElement;
    const roadmapFuturePaths = futurePaths as HTMLElement;
    const roadmapPoliceCard = policeCard as HTMLElement;
    const roadmapItCard = itCard as HTMLElement;
    const roadmapAcademicRoot = academicRoot as HTMLElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let geometry: RoadmapGeometry | null = null;
    let frame = 0;
    let lastFrameTime = 0;
    let currentLead = 0;
    let furthestLead = Number.NEGATIVE_INFINITY;
    let hasInitialLead = false;
    let resizeFrame = 0;

    const localRect = (element: Element, treeRect: DOMRect) => {
      const rect = element.getBoundingClientRect();

      return {
        bottom: rect.bottom - treeRect.top,
        centerX: rect.left - treeRect.left + rect.width / 2,
        centerY: rect.top - treeRect.top + rect.height / 2,
        height: rect.height,
        left: rect.left - treeRect.left,
        right: rect.right - treeRect.left,
        top: rect.top - treeRect.top,
        width: rect.width,
      };
    };

    const verticalElbow = (start: Point, end: Point, radius = 10) => {
      const direction = end.x < start.x ? -1 : 1;
      const approachX = end.x - direction * radius;

      return [
        `M ${format(start.x)} ${format(start.y)}`,
        `H ${format(approachX)}`,
        `Q ${format(end.x)} ${format(start.y)} ${format(end.x)} ${format(start.y + radius)}`,
        `V ${format(end.y)}`,
      ].join(" ");
    };

    const setRoute = (name: string, pathData: string | null) => {
      const livePath = liveRoutes.get(name);
      const trackPath = trackRoutes.get(name);
      const maskPath = maskRoutes.get(name);
      const tip = routeTips.get(name);
      const isEnabled = Boolean(pathData);
      const resolvedPath = pathData || "M 0 0";

      [livePath, trackPath, maskPath].forEach((path) => {
        if (!path) return;
        path.setAttribute("d", resolvedPath);
        path.style.opacity = isEnabled ? "" : "0";
      });

      if (livePath) {
        livePath.dataset.routeEnabled = isEnabled ? "true" : "false";
      }

      if (!isEnabled && tip) {
        tip.style.opacity = "0";
      }
    };

    const setRouteProgress = (name: string, rawProgress: number) => {
      const progress = clamp(rawProgress);
      const livePath = liveRoutes.get(name);
      const maskPath = maskRoutes.get(name);
      const tip = routeTips.get(name);

      if (livePath?.dataset.routeEnabled !== "true") {
        if (tip) tip.style.opacity = "0";
        return;
      }

      if (maskPath) {
        maskPath.style.strokeDashoffset = String(1 - progress);
      } else {
        livePath.style.strokeDashoffset = String(1 - progress);
      }

      if (!tip) return;

      if (progress <= 0.012 || progress >= 0.995) {
        tip.style.opacity = "0";
        return;
      }

      const length = livePath.getTotalLength();
      if (!Number.isFinite(length) || length <= 0) {
        tip.style.opacity = "0";
        return;
      }

      const point = livePath.getPointAtLength(length * progress);
      tip.setAttribute("cx", String(point.x));
      tip.setAttribute("cy", String(point.y));
      tip.style.opacity = String(
        clamp(Math.sin(progress * Math.PI) * 1.25, 0.28, 1),
      );
    };

    const setReveal = (element: HTMLElement | null, rawProgress: number) => {
      if (!element) return;

      const progress = easeOutCubic(clamp(rawProgress));
      const blurProgress = easeOutCubic(clamp(rawProgress / 0.24));
      element.style.setProperty(
        "--roadmap-reveal-opacity",
        progress.toFixed(4),
      );
      element.style.setProperty(
        "--roadmap-reveal-y",
        `${((1 - progress) * 28).toFixed(2)}px`,
      );
      element.style.setProperty(
        "--roadmap-reveal-scale",
        (0.965 + progress * 0.035).toFixed(4),
      );
      element.style.setProperty(
        "--roadmap-reveal-blur",
        `${((1 - blurProgress) * 5).toFixed(2)}px`,
      );
    };

    const setNode = (
      element: HTMLElement | null,
      rawNodeProgress: number,
      rawLoadProgress: number,
    ) => {
      if (!element) return;

      const nodeProgress = easeOutCubic(clamp(rawNodeProgress));
      const loadProgress = clamp(rawLoadProgress);
      const ringOpacity =
        nodeProgress === 0 ? 0 : clamp(0.3 + loadProgress * 0.7, 0, 1);

      element.style.setProperty(
        "--roadmap-node-opacity",
        nodeProgress.toFixed(4),
      );
      element.style.setProperty(
        "--roadmap-node-scale",
        (0.68 + nodeProgress * 0.32).toFixed(4),
      );
      element.style.setProperty(
        "--roadmap-node-angle",
        `${(loadProgress * 360).toFixed(2)}deg`,
      );
      element.style.setProperty(
        "--roadmap-ring-opacity",
        ringOpacity.toFixed(4),
      );
    };

    const measure = () => {
      section.classList.add("roadmap-measuring");

      try {
        const treeRect = roadmapTree.getBoundingClientRect();
        const width = Math.max(1, treeRect.width);
        const height = Math.max(1, roadmapTree.scrollHeight);
        const desktop = window.matchMedia("(min-width: 1024px)").matches;
        const nodeRects = nodes.map((node) => localRect(node, treeRect));
        const historyCardRects = historyCards.map((card) =>
          localRect(card, treeRect),
        );
        const junctionRect = localRect(roadmapJunction, treeRect);
        const pathsRect = localRect(roadmapFuturePaths, treeRect);
        const policeCardRect = localRect(roadmapPoliceCard, treeRect);
        const itCardRect = localRect(roadmapItCard, treeRect);
        const academicRootRect = localRect(roadmapAcademicRoot, treeRect);
        const specialUnitRect = specialUnit
          ? localRect(specialUnit, treeRect)
          : null;
        const academicStepRects = academicStepCards.map((card) =>
          localRect(card, treeRect),
        );
        const firstNode = nodeRects[0];
        const lastHistoryCard = historyCardRects[historyCardRects.length - 1];
        const historyStart = {
          x: firstNode.centerX,
          y: firstNode.centerY - 56,
        };
        const historyEnd = {
          x: junctionRect.centerX,
          y: junctionRect.centerY,
        };

        roadmapRouteMap.setAttribute(
          "viewBox",
          `0 0 ${format(width)} ${format(height)}`,
        );

        if (desktop) {
          setRoute(
            "history",
            `M ${format(historyStart.x)} ${format(historyStart.y)} V ${format(historyEnd.y)}`,
          );
        } else {
          const radius = 12;
          const turnTop = Math.min(
            historyEnd.y - radius * 3,
            lastHistoryCard.bottom + 24,
          );

          setRoute(
            "history",
            [
              `M ${format(historyStart.x)} ${format(historyStart.y)}`,
              `V ${format(turnTop)}`,
              `Q ${format(historyStart.x)} ${format(turnTop + radius)} ${format(historyStart.x + radius)} ${format(turnTop + radius)}`,
              `H ${format(historyEnd.x - radius)}`,
              `Q ${format(historyEnd.x)} ${format(turnTop + radius)} ${format(historyEnd.x)} ${format(turnTop + radius * 2)}`,
              `V ${format(historyEnd.y)}`,
            ].join(" "),
          );
        }

        const entryStart = {
          x: pathsRect.centerX,
          y: pathsRect.top - 64,
        };
        const fork = {
          x: pathsRect.centerX,
          y: pathsRect.top,
        };

        let futureSpineStart = fork.y;
        let futureSpineEnd = fork.y;
        let mobilePoliceY = policeCardRect.top;
        let mobileItY = itCardRect.top;
        let mobileAcademicY = academicRootRect.top;

        if (desktop) {
          setRoute(
            "future-entry",
            `M ${format(entryStart.x)} ${format(entryStart.y)} V ${format(fork.y)}`,
          );
          setRoute("future-spine", null);
          setRoute(
            "future-police",
            verticalElbow(fork, {
              x: policeCardRect.centerX,
              y: policeCardRect.top,
            }),
          );
          setRoute(
            "future-it",
            `M ${format(fork.x)} ${format(fork.y)} V ${format(itCardRect.top)}`,
          );
          setRoute(
            "future-academic",
            verticalElbow(fork, {
              x: academicRootRect.centerX,
              y: academicRootRect.top,
            }),
          );
        } else {
          const radius = 12;
          const spineX = policeCardRect.left - 14;
          const turnY = pathsRect.top;
          mobilePoliceY = policeCardRect.top + 36;
          mobileItY = itCardRect.top + 36;
          mobileAcademicY = academicRootRect.top + 36;
          futureSpineStart = turnY;
          futureSpineEnd = mobileAcademicY - 8;

          setRoute(
            "future-entry",
            [
              `M ${format(entryStart.x)} ${format(entryStart.y)}`,
              `V ${format(turnY - radius)}`,
              `Q ${format(entryStart.x)} ${format(turnY)} ${format(entryStart.x - radius)} ${format(turnY)}`,
              `H ${format(spineX)}`,
            ].join(" "),
          );
          setRoute(
            "future-spine",
            `M ${format(spineX)} ${format(turnY)} V ${format(futureSpineEnd)}`,
          );
          setRoute(
            "future-police",
            `M ${format(spineX)} ${format(mobilePoliceY)} H ${format(policeCardRect.left)}`,
          );
          setRoute(
            "future-it",
            `M ${format(spineX)} ${format(mobileItY)} H ${format(itCardRect.left)}`,
          );
          setRoute(
            "future-academic",
            [
              `M ${format(spineX)} ${format(mobileAcademicY - 8)}`,
              `Q ${format(spineX)} ${format(mobileAcademicY)} ${format(spineX + 8)} ${format(mobileAcademicY)}`,
              `H ${format(academicRootRect.left)}`,
            ].join(" "),
          );
        }

        if (specialUnitRect) {
          setRoute(
            "police-continuation",
            `M ${format(policeCardRect.centerX)} ${format(policeCardRect.bottom)} V ${format(specialUnitRect.top)}`,
          );
        } else {
          setRoute("police-continuation", null);
        }

        const firstAcademicCard = academicStepRects[0];
        const lastAcademicCard =
          academicStepRects[academicStepRects.length - 1];
        const academicSpineX = firstAcademicCard
          ? firstAcademicCard.left - 15
          : academicRootRect.left + 5;
        const academicSpineStart = academicRootRect.bottom;
        const academicSpineEnd = lastAcademicCard
          ? lastAcademicCard.centerY
          : academicRootRect.bottom;

        setRoute(
          "academic-spine",
          `M ${format(academicSpineX)} ${format(academicSpineStart)} V ${format(academicSpineEnd)}`,
        );

        academicStepRects.forEach((stepRect, index) => {
          setRoute(
            `academic-step-${index}`,
            `M ${format(academicSpineX)} ${format(stepRect.centerY)} H ${format(stepRect.left)}`,
          );
        });

        const futureEntryStart = entryStart.y;
        const futureEntryEnd = futureEntryStart + 155;
        const futureBranchStart = futureEntryEnd + 18;
        const futureBranchEnd = futureBranchStart + 250;
        const futureSpineLeadStart = futureEntryEnd + 18;
        const futureSpineLeadEnd =
          futureSpineLeadStart + Math.max(0, futureSpineEnd - futureSpineStart);
        const mobileLeadOffset = futureSpineLeadStart - futureSpineStart;
        const futureMobileAcademicLead = mobileAcademicY - 8 + mobileLeadOffset;
        const futureMobileItLead = mobileItY + mobileLeadOffset;
        const futureMobilePoliceLead = mobilePoliceY + mobileLeadOffset;
        const policeBranchEnd = desktop
          ? futureBranchEnd
          : futureMobilePoliceLead + 82;
        const academicBranchEnd = desktop
          ? futureBranchEnd
          : futureMobileAcademicLead + 90;
        const policeContinuationLeadStart = policeBranchEnd + 22;
        const policeContinuationLeadEnd = policeContinuationLeadStart + 145;
        const academicSpineLeadStart = academicBranchEnd + 24;
        const academicSpineLeadEnd =
          academicSpineLeadStart +
          Math.max(0, academicSpineEnd - academicSpineStart);
        const academicStepLeads = academicStepRects.map(
          (stepRect) =>
            academicSpineLeadStart +
            Math.max(0, stepRect.centerY - academicSpineStart),
        );

        geometry = {
          academicSpineEnd,
          academicSpineLeadEnd,
          academicSpineLeadStart,
          academicSpineStart,
          academicStepLeads,
          desktop,
          futureBranchEnd,
          futureBranchStart,
          futureEntryEnd,
          futureEntryStart,
          futureMobileAcademicLead,
          futureMobileItLead,
          futureMobilePoliceLead,
          futureSpineEnd,
          futureSpineLeadEnd,
          futureSpineLeadStart,
          futureSpineStart,
          historyEnd: historyEnd.y,
          historyStart: historyStart.y,
          junctionCenter: junctionRect.centerY,
          nodeCenters: nodeRects.map((nodeRect) => nodeRect.centerY),
          policeContinuationLeadEnd,
          policeContinuationLeadStart,
        };

        section.classList.add("roadmap-motion-ready");
      } finally {
        section.classList.remove("roadmap-measuring");
      }
    };

    const render = (lead: number) => {
      if (!geometry) return;

      const resolvedLead = reduceMotion
        ? geometry.academicSpineEnd + 10000
        : lead;
      const historyProgress = progressBetween(
        resolvedLead,
        geometry.historyStart,
        geometry.historyEnd,
      );
      setRouteProgress("history", historyProgress);

      geometry.nodeCenters.forEach((nodeCenter, index) => {
        const reach = resolvedLead - nodeCenter;
        const nodeProgress = progressBetween(reach, 0, 52);
        const loadProgress = progressBetween(reach, 20, 122);
        const cardProgress = progressBetween(reach, 126, 276);

        setNode(nodes[index], nodeProgress, loadProgress);
        setReveal(historyCards[index], cardProgress);
      });

      const junctionReach = resolvedLead - geometry.junctionCenter;
      setNode(
        roadmapJunction,
        progressBetween(junctionReach, 0, 54),
        progressBetween(junctionReach, 20, 130),
      );
      const headingProgress = progressBetween(junctionReach, 132, 300);
      futureHeadingContent.forEach((element, index) => {
        setReveal(element, progressBetween(headingProgress, index * 0.08, 1));
      });

      const entryProgress = progressBetween(
        resolvedLead,
        geometry.futureEntryStart,
        geometry.futureEntryEnd,
      );
      setRouteProgress("future-entry", entryProgress);
      const entryIsComplete = entryProgress >= 0.999;

      let policeRouteProgress = 0;
      let itRouteProgress = 0;
      let academicRouteProgress = 0;

      if (geometry.desktop) {
        const branchProgress = entryIsComplete
          ? progressBetween(
              resolvedLead,
              geometry.futureBranchStart,
              geometry.futureBranchEnd,
            )
          : 0;
        policeRouteProgress = branchProgress;
        itRouteProgress = branchProgress;
        academicRouteProgress = branchProgress;
        setRouteProgress("future-spine", 0);
      } else {
        const spineProgress = entryIsComplete
          ? progressBetween(
              resolvedLead,
              geometry.futureSpineLeadStart,
              geometry.futureSpineLeadEnd,
            )
          : 0;
        setRouteProgress("future-spine", spineProgress);
        policeRouteProgress = entryIsComplete
          ? progressBetween(
              resolvedLead,
              geometry.futureMobilePoliceLead,
              geometry.futureMobilePoliceLead + 82,
            )
          : 0;
        itRouteProgress = entryIsComplete
          ? progressBetween(
              resolvedLead,
              geometry.futureMobileItLead,
              geometry.futureMobileItLead + 82,
            )
          : 0;
        academicRouteProgress = entryIsComplete
          ? progressBetween(
              resolvedLead,
              geometry.futureMobileAcademicLead,
              geometry.futureMobileAcademicLead + 90,
            )
          : 0;
      }

      setRouteProgress("future-police", policeRouteProgress);
      setRouteProgress("future-it", itRouteProgress);
      setRouteProgress("future-academic", academicRouteProgress);
      setReveal(
        roadmapPoliceCard,
        progressBetween(policeRouteProgress, 0.68, 1),
      );
      setReveal(roadmapItCard, progressBetween(itRouteProgress, 0.68, 1));
      setReveal(
        roadmapAcademicRoot,
        progressBetween(academicRouteProgress, 0.68, 1),
      );

      const continuationProgress =
        policeRouteProgress >= 0.999
          ? progressBetween(
              resolvedLead,
              geometry.policeContinuationLeadStart,
              geometry.policeContinuationLeadEnd,
            )
          : 0;
      setRouteProgress("police-continuation", continuationProgress);
      setReveal(specialUnit, progressBetween(continuationProgress, 0.62, 1));

      const academicSpineProgress =
        academicRouteProgress >= 0.999
          ? progressBetween(
              resolvedLead,
              geometry.academicSpineLeadStart,
              geometry.academicSpineLeadEnd,
            )
          : 0;
      setRouteProgress("academic-spine", academicSpineProgress);

      geometry.academicStepLeads.forEach((stepLead, index) => {
        const branchProgress = progressBetween(
          resolvedLead,
          stepLead,
          stepLead + 70,
        );
        setRouteProgress(`academic-step-${index}`, branchProgress);
        setReveal(
          academicStepCards[index],
          progressBetween(branchProgress, 0.56, 1),
        );
      });
    };

    const getTargetLead = () => {
      if (reduceMotion || !geometry) {
        return geometry ? geometry.academicSpineEnd + 10000 : 10000;
      }

      const treeRect = roadmapTree.getBoundingClientRect();
      return window.innerHeight * 0.62 - treeRect.top;
    };

    const getForwardTargetLead = () => {
      furthestLead = Math.max(furthestLead, getTargetLead());
      return furthestLead;
    };

    const runFrame = (time: number) => {
      frame = 0;

      const targetLead = getForwardTargetLead();
      if (!hasInitialLead) {
        currentLead = targetLead;
        hasInitialLead = true;
      }

      const elapsed = lastFrameTime
        ? Math.min(64, time - lastFrameTime)
        : 16.67;
      lastFrameTime = time;
      const smoothing = reduceMotion ? 1 : 1 - Math.exp(-elapsed / 260);

      currentLead += (targetLead - currentLead) * smoothing;
      render(currentLead);

      if (Math.abs(targetLead - currentLead) > 0.12) {
        frame = window.requestAnimationFrame(runFrame);
      }
    };

    const requestRender = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(runFrame);
      }
    };

    const requestMeasure = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        measure();
        currentLead = Math.max(currentLead, getForwardTargetLead());
        hasInitialLead = true;
        render(currentLead);
      });
    };

    measure();
    currentLead = getForwardTargetLead();
    hasInitialLead = true;
    render(currentLead);

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestMeasure, { passive: true });

    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(requestMeasure) : null;
    resizeObserver?.observe(roadmapTree);

    document.fonts?.ready.then(requestMeasure);

    motionWindow.__careerRoadmapMotionCleanup = () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestMeasure);
      resizeObserver?.disconnect();
      section.classList.remove("roadmap-motion-ready");
    };
  }
}

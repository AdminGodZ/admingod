"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const TRACK_MARGIN = 6;
const VISIBILITY_TIMEOUT_MS = 900;

type SidebarState = {
  visible: boolean;
  dragging: boolean;
  hovering: boolean;
  active: boolean;
};

type ScrollMetrics = {
  viewportHeight: number;
  scrollable: number;
  thumbHeightPercent: number;
  thumbHeightPx: number;
  thumbTranslateY: number;
  visible: boolean;
};

function getScrollMetrics(): ScrollMetrics {
  const doc = document.documentElement;
  const viewportHeight = window.innerHeight;
  const fullHeight = doc.scrollHeight;
  const visible = fullHeight - viewportHeight > 4;
  const scrollable = Math.max(1, fullHeight - viewportHeight);
  const scrollTop = window.scrollY || doc.scrollTop;

  const rawHeight = (viewportHeight / fullHeight) * 100;
  const thumbHeightPercent = Math.min(7, Math.max(2.6, rawHeight));
  const thumbHeightPx = (thumbHeightPercent / 100) * viewportHeight;
  const maxTrackY = Math.max(
    0,
    viewportHeight - TRACK_MARGIN * 2 - thumbHeightPx,
  );
  const progress = Math.min(1, Math.max(0, scrollTop / scrollable));
  const thumbTranslateY = TRACK_MARGIN + maxTrackY * progress;

  return {
    viewportHeight,
    scrollable,
    thumbHeightPercent,
    thumbHeightPx,
    thumbTranslateY,
    visible,
  };
}

export default function ScrollSidebar() {
  const [state, setState] = useState<SidebarState>({
    visible: false,
    dragging: false,
    hovering: false,
    active: false,
  });
  const thumbRef = useRef<HTMLButtonElement | null>(null);
  const metricsRef = useRef<ScrollMetrics | null>(null);
  const draggingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const dragStartYRef = useRef(0);
  const dragStartThumbYRef = useRef(0);
  const latestPointerYRef = useRef(0);
  const dragFrameRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);
  const previousUserSelectRef = useRef("");
  const previousWebkitUserSelectRef = useRef("");
  const previousScrollBehaviorRef = useRef("");

  const applyThumbMetrics = useCallback((metrics: ScrollMetrics) => {
    metricsRef.current = metrics;

    if (!thumbRef.current) {
      return;
    }

    thumbRef.current.style.height = `${metrics.thumbHeightPercent}%`;
    thumbRef.current.style.transform = `translateY(${metrics.thumbTranslateY}px)`;
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setState((current) => {
        if (current.dragging || current.hovering || !current.active) {
          return current;
        }

        return {
          ...current,
          active: false,
        };
      });
    }, VISIBILITY_TIMEOUT_MS);
  }, [clearHideTimer]);

  const restoreDragStyles = useCallback(() => {
    document.body.style.userSelect = previousUserSelectRef.current;
    document.body.style.webkitUserSelect =
      previousWebkitUserSelectRef.current;
    document.documentElement.style.scrollBehavior =
      previousScrollBehaviorRef.current;
  }, []);

  useEffect(() => {
    let updateFrame = 0;

    const update = () => {
      const metrics = getScrollMetrics();
      applyThumbMetrics(metrics);
      setState((current) => {
        if (current.visible === metrics.visible) {
          return current;
        }

        return {
          ...current,
          visible: metrics.visible,
        };
      });
      updateFrame = 0;
    };

    const requestUpdate = () => {
      if (updateFrame || draggingRef.current) {
        return;
      }

      updateFrame = window.requestAnimationFrame(update);
    };

    const handleScroll = () => {
      setState((current) =>
        current.active
          ? current
          : {
              ...current,
              active: true,
            },
      );

      if (!draggingRef.current) {
        scheduleHide();
        requestUpdate();
      }
    };

    requestUpdate();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", requestUpdate);
      clearHideTimer();
      restoreDragStyles();

      if (updateFrame) {
        window.cancelAnimationFrame(updateFrame);
      }

      if (dragFrameRef.current) {
        window.cancelAnimationFrame(dragFrameRef.current);
      }
    };
  }, [
    applyThumbMetrics,
    clearHideTimer,
    restoreDragStyles,
    scheduleHide,
  ]);

  const applyDragPosition = useCallback(() => {
    dragFrameRef.current = 0;

    const metrics = metricsRef.current ?? getScrollMetrics();
    const maxTrackY = Math.max(
      0,
      metrics.viewportHeight - TRACK_MARGIN * 2 - metrics.thumbHeightPx,
    );
    const deltaY = latestPointerYRef.current - dragStartYRef.current;
    const nextThumbY = Math.min(
      TRACK_MARGIN + maxTrackY,
      Math.max(TRACK_MARGIN, dragStartThumbYRef.current + deltaY),
    );
    const progress =
      maxTrackY > 0 ? (nextThumbY - TRACK_MARGIN) / maxTrackY : 0;

    if (thumbRef.current) {
      thumbRef.current.style.transform = `translateY(${nextThumbY}px)`;
    }

    window.scrollTo(0, progress * metrics.scrollable);
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    clearHideTimer();

    const metrics = getScrollMetrics();
    applyThumbMetrics(metrics);
    draggingRef.current = true;
    activePointerIdRef.current = event.pointerId;
    dragStartYRef.current = event.clientY;
    latestPointerYRef.current = event.clientY;
    dragStartThumbYRef.current = metrics.thumbTranslateY;
    previousUserSelectRef.current = document.body.style.userSelect;
    previousWebkitUserSelectRef.current =
      document.body.style.webkitUserSelect;
    previousScrollBehaviorRef.current =
      document.documentElement.style.scrollBehavior;
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.documentElement.style.scrollBehavior = "auto";
    event.currentTarget.setPointerCapture(event.pointerId);

    setState((current) => ({
      ...current,
      dragging: true,
      active: true,
      visible: true,
    }));
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (
      !draggingRef.current ||
      event.pointerId !== activePointerIdRef.current
    ) {
      return;
    }

    event.preventDefault();
    latestPointerYRef.current = event.clientY;

    if (!dragFrameRef.current) {
      dragFrameRef.current = window.requestAnimationFrame(applyDragPosition);
    }
  };

  const finishDragging = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (
      !draggingRef.current ||
      event.pointerId !== activePointerIdRef.current
    ) {
      return;
    }

    event.preventDefault();

    if (dragFrameRef.current) {
      window.cancelAnimationFrame(dragFrameRef.current);
      applyDragPosition();
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    draggingRef.current = false;
    activePointerIdRef.current = null;
    restoreDragStyles();
    setState((current) => ({
      ...current,
      dragging: false,
      active: true,
    }));
    scheduleHide();
  };

  const handleMouseEnter = () => {
    clearHideTimer();
    setState((current) =>
      current.hovering && current.active
        ? current
        : {
            ...current,
            hovering: true,
            active: true,
          },
    );
  };

  const handleMouseLeave = () => {
    setState((current) =>
      current.hovering
        ? {
            ...current,
            hovering: false,
          }
        : current,
    );
    scheduleHide();
  };

  const shouldShow =
    state.visible && (state.dragging || state.hovering || state.active);
  const opacity = shouldShow ? 1 : 0;
  const thumbColorClass = state.dragging
    ? "bg-[#c7c7c7] dark:bg-[#737373]"
    : "bg-[#d9d9d9] dark:bg-[#404040]";

  return (
    <div className="fixed top-0 right-2 z-[1000] h-screen w-3">
      <button
        ref={thumbRef}
        type="button"
        aria-label="Scroll position"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDragging}
        onPointerCancel={finishDragging}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDragStart={(event) => event.preventDefault()}
        className={`absolute top-0 right-0 w-1.5 rounded-full border-0 p-0 backdrop-blur-[4px] transition-[width,opacity,background-color] duration-[200ms] hover:w-2 ${thumbColorClass}`}
        style={{
          height: "2.6%",
          transform: "translateY(0)",
          opacity,
          cursor: "default",
          touchAction: "none",
        }}
      />
    </div>
  );
}

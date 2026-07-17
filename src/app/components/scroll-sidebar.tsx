"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TRACK_MARGIN = 6;
const VISIBILITY_TIMEOUT_MS = 900;

type SidebarState = {
  thumbHeightPercent: number;
  thumbTranslateY: number;
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
    thumbHeightPercent: 2.6,
    thumbTranslateY: 0,
    visible: false,
    dragging: false,
    hovering: false,
    active: false,
  });
  const dragStartY = useRef(0);
  const dragStartThumbY = useRef(0);
  const metricsRef = useRef<ScrollMetrics | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setState((current) => {
        if (current.dragging || current.hovering) {
          return current;
        }

        return {
          ...current,
          active: false,
        };
      });
    }, VISIBILITY_TIMEOUT_MS);
  }, [clearHideTimer]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const metrics = getScrollMetrics();
      metricsRef.current = metrics;
      setState((current) => ({
        ...current,
        thumbHeightPercent: metrics.thumbHeightPercent,
        thumbTranslateY: metrics.thumbTranslateY,
        visible: metrics.visible,
      }));
      frame = 0;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const handleScroll = () => {
      setState((current) => ({
        ...current,
        active: true,
      }));
      scheduleHide();
      requestUpdate();
    };

    requestUpdate();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", requestUpdate);
      clearHideTimer();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [clearHideTimer, scheduleHide]);

  useEffect(() => {
    if (!state.dragging) return;

    const previousUserSelect = document.body.style.userSelect;
    const previousWebkitUserSelect = document.body.style.webkitUserSelect;
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    const onPointerMove = (event: PointerEvent) => {
      event.preventDefault();

      const metrics = metricsRef.current ?? getScrollMetrics();
      metricsRef.current = metrics;

      const maxTrackY = Math.max(
        0,
        metrics.viewportHeight - TRACK_MARGIN * 2 - metrics.thumbHeightPx,
      );
      const deltaY = event.clientY - dragStartY.current;
      const nextThumbY = Math.min(
        TRACK_MARGIN + maxTrackY,
        Math.max(TRACK_MARGIN, dragStartThumbY.current + deltaY),
      );

      const progress =
        maxTrackY > 0 ? (nextThumbY - TRACK_MARGIN) / maxTrackY : 0;
      const nextScrollTop = progress * metrics.scrollable;
      window.scrollTo({ top: nextScrollTop, behavior: "auto" });

      setState((current) => ({
        ...current,
        thumbTranslateY: nextThumbY,
      }));
    };

    const onPointerUp = () => {
      setState((current) => ({
        ...current,
        dragging: false,
        active: true,
      }));
      scheduleHide();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
    window.addEventListener("pointercancel", onPointerUp, { once: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.body.style.userSelect = previousUserSelect;
      document.body.style.webkitUserSelect = previousWebkitUserSelect;
    };
  }, [state.dragging, scheduleHide]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    clearHideTimer();

    const metrics = getScrollMetrics();
    metricsRef.current = metrics;
    dragStartY.current = event.clientY;
    dragStartThumbY.current = metrics.thumbTranslateY;
    setState((current) => ({
      ...current,
      dragging: true,
      active: true,
      visible: true,
      thumbHeightPercent: metrics.thumbHeightPercent,
      thumbTranslateY: metrics.thumbTranslateY,
    }));
  };

  const handleMouseEnter = () => {
    clearHideTimer();
    setState((current) => ({
      ...current,
      hovering: true,
      active: true,
    }));
  };

  const handleMouseLeave = () => {
    setState((current) => ({
      ...current,
      hovering: false,
    }));
    scheduleHide();
  };

  const shouldShow =
    state.visible && (state.dragging || state.hovering || state.active);
  const opacity = shouldShow ? 1 : 0;
  const thumbColor = state.dragging ? "#c7c7c7" : "#d9d9d9";

  return (
    <div className="fixed right-2 top-0 z-[1000] h-screen w-3">
      <button
        type="button"
        aria-label="Scroll position"
        onPointerDown={handlePointerDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDragStart={(event) => event.preventDefault()}
        className="absolute top-0 right-0 w-1.5 rounded-full border-0 p-0 backdrop-blur-[4px] transition-[width,opacity,background-color] duration-[200ms] hover:w-2"
        style={{
          height: `${state.thumbHeightPercent}%`,
          transform: `translateY(${state.thumbTranslateY}px)`,
          opacity,
          backgroundColor: thumbColor,
          cursor: "default",
          touchAction: "none",
        }}
      />
    </div>
  );
}

"use client";

import type { ReactNode } from "react";

type VoidPortalButtonProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  targetId?: string;
};

export default function VoidPortalButton({
  children,
  className,
  ariaLabel = "Explore portfolio",
  targetId,
}: VoidPortalButtonProps) {
  const handleClick = () => {
    if (!targetId) return;

    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex h-12 w-12 select-none items-center justify-center rounded-full border border-[#202020] bg-[#111111] text-white backdrop-blur-md transition-colors duration-300 hover:bg-black ${className ?? ""}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

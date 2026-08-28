import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroTextRevealProps = {
  eyebrow?: string;
  title: string;
  description: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
  children: ReactNode;
};

type RevealStyle = CSSProperties & {
  "--hero-reveal-delay": string;
  "--hero-reveal-blur"?: string;
};

const revealStyle = (delay: number, blur?: number): RevealStyle => ({
  "--hero-reveal-delay": `${delay}ms`,
  ...(blur === undefined ? {} : { "--hero-reveal-blur": `${blur}px` }),
});

const withOccurrenceKeys = (values: string[]) => {
  const occurrences = new Map<string, number>();

  return values.map((value) => {
    const occurrence = occurrences.get(value) ?? 0;
    occurrences.set(value, occurrence + 1);

    return {
      key: `${value}-${occurrence}`,
      value,
    };
  });
};

export function HeroTextReveal({
  eyebrow,
  title,
  description,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
  actionsClassName,
  children,
}: HeroTextRevealProps) {
  const titleCharacters = withOccurrenceKeys(Array.from(title));
  const descriptionWords = withOccurrenceKeys(description.split(" "));

  return (
    <>
      {eyebrow ? (
        <div
          style={revealStyle(0)}
          className={cn(
            "hero-reveal-eyebrow mb-5 inline-flex items-center gap-2.5 text-base font-semibold tracking-[0.04em] text-black/58 dark:text-white/58 sm:text-lg",
            eyebrowClassName,
          )}
        >
          <span
            className="h-px w-7 bg-black/20 dark:bg-white/22"
            aria-hidden="true"
          />
          <span>{eyebrow}</span>
          <span
            className="hero-wave inline-block select-none text-base [filter:grayscale(1)] sm:text-lg"
            role="img"
            aria-label="Waving hand"
          >
            👋
          </span>
        </div>
      ) : null}

      <h1 className={cn("whitespace-nowrap", titleClassName)}>
        <span className="sr-only">{title}</span>
        {titleCharacters.map(({ key, value: character }, index) => (
          <span
            key={key}
            aria-hidden="true"
            className="hero-reveal-segment inline-block"
            style={revealStyle(180 + index * 45, 12)}
          >
            {character}
          </span>
        ))}
      </h1>

      <p className={descriptionClassName}>
        <span className="sr-only">{description}</span>
        {descriptionWords.map(({ key, value: word }, index) => (
          <span
            key={key}
            aria-hidden="true"
            className="hero-reveal-segment inline-block whitespace-pre"
            style={revealStyle(500 + index * 55, 9)}
          >
            {word}
            {index < descriptionWords.length - 1 ? " " : null}
          </span>
        ))}
      </p>

      <div
        style={revealStyle(1400)}
        className={cn("hero-reveal-actions", actionsClassName)}
      >
        {children}
      </div>
    </>
  );
}

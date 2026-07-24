"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroTextRevealProps = {
  title: string;
  description: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
  children: ReactNode;
};

const titleContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.045,
    },
  },
};

const titleCharacterVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const descriptionContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.055,
    },
  },
};

const descriptionWordVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(9px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const actionsVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.4,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function HeroTextReveal({
  title,
  description,
  titleClassName,
  descriptionClassName,
  actionsClassName,
  children,
}: HeroTextRevealProps) {
  const reduceMotion = useReducedMotion();
  const titleCharacters = Array.from(title);
  const descriptionWords = description.split(" ");
  const initial = reduceMotion ? false : "hidden";

  return (
    <>
      <motion.h1
        initial={initial}
        animate="visible"
        variants={titleContainerVariants}
        className={cn("whitespace-nowrap", titleClassName)}
      >
        <span className="sr-only">{title}</span>
        {titleCharacters.map((character, index) => (
          <motion.span
            key={`${character}-${index}`}
            aria-hidden="true"
            variants={titleCharacterVariants}
            className="hero-reveal-segment inline-block"
          >
            {character}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        initial={initial}
        animate="visible"
        variants={descriptionContainerVariants}
        className={descriptionClassName}
      >
        <span className="sr-only">{description}</span>
        {descriptionWords.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            aria-hidden="true"
            variants={descriptionWordVariants}
            className="hero-reveal-segment inline-block whitespace-pre"
          >
            {word}
            {index < descriptionWords.length - 1 ? " " : null}
          </motion.span>
        ))}
      </motion.p>

      <motion.div
        initial={initial}
        animate="visible"
        variants={actionsVariants}
        className={cn("hero-reveal-actions", actionsClassName)}
      >
        {children}
      </motion.div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

type CipherTextProps = {
  text: string;
  className?: string;
};

const GLYPHS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-";

export default function CipherText({ text, className }: CipherTextProps) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const scramble = () => {
      let frame = 0;

      const render = () => {
        frame += 1;
        const reveal = frame / 3;

        setDisplay(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") {
                return " ";
              }

              if (index < reveal) {
                return text[index];
              }

              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join(""),
        );

        if (reveal < text.length) {
          frameRef.current = requestAnimationFrame(render);
        }
      };

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(render);
    };

    scramble();
    const interval = setInterval(scramble, 5200);

    return () => {
      clearInterval(interval);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [text]);

  return <span className={className}>{display}</span>;
}

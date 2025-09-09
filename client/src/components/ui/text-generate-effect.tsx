"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "../../lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.6,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");
  const [key, setKey] = useState(0); // key to force remount

  const runAnimation = useCallback(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration || 1,
        delay: stagger(0.2),
      }
    );
  }, [animate, filter, duration]);

  // Trigger animation every time key changes
  useEffect(() => {
    runAnimation();
  }, [key, runAnimation]);

  // Change key every 10 seconds to regenerate text
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prev) => prev + 1);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("font-thin", className)}>
      <div className="mt-4">
        <div
          key={key} // force re-render to retrigger animation
          className="dark:text-white text-black text-xl leading-snug tracking-widest"
        >
          <motion.div ref={scope}>
            {wordsArray.map((word, idx) => (
              <motion.span
                key={word + idx}
                className="dark:text-white text-black opacity-0"
                style={{
                  filter: filter ? "blur(10px)" : "none",
                }}
              >
                {word}{" "}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "../../lib/utils";

interface VelocityScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultVelocity?: number;
  className?: string;
  numRows?: number;
  speedMultiplier?: number;
  smoothness?: number;
}

interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  baseVelocity: number;
  speedMultiplier?: number;
  smoothness?: number;
}

export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function ParallaxText({
  children,
  baseVelocity = 0.5, // Reduced from 0.5
  speedMultiplier = 0.3, // Reduced from 1
  smoothness = 1, // Increased for smoother animation
  ...props
}: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 80, // Increased damping for slower response
    stiffness: 200 * smoothness, // Reduced stiffness
  });

  // Much more conservative velocity transformation
  const velocityFactor = useTransform(
    smoothVelocity, 
    [0, 1000], 
    [0, 1.5 * speedMultiplier], // Reduced multiplier
    { clamp: false }
  );

  const [repetitions, setRepetitions] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const calculateRepetitions = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.offsetWidth;
        const newRepetitions = Math.max(3, Math.ceil(containerWidth / textWidth) + 2);
        setRepetitions(newRepetitions);
      }
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [children]);

  const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`);

  const directionFactor = React.useRef<number>(1);
  useAnimationFrame((delta: number) => {
    // Cap delta to prevent speed spikes
    const cappedDelta = Math.min(delta, 16.67); // Cap at ~60fps equivalent
    
    // Much slower base movement
    let moveBy = directionFactor.current * baseVelocity * (cappedDelta / 1000) * 0.3; // Added 0.3 multiplier
    
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    // Much more conservative scroll-based speed adjustment
    const scrollSpeedAdjustment = Math.min(Math.abs(velocityFactor.get()), 1) * 0.2; // Capped and reduced
    moveBy += directionFactor.current * moveBy * scrollSpeedAdjustment;
    
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden whitespace-nowrap"
      {...props}
    >
      <motion.div className="inline-block" style={{ x }}>
        {Array.from({ length: repetitions }).map((_, i) => (
          <span key={i} ref={i === 0 ? textRef : null}>
            {children}{" "}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityScroll({
  defaultVelocity = 1, // Further reduced for even slower movement
  numRows = 2,
  speedMultiplier = 0.2, // Further reduced
  smoothness = 0.9, // Increased for maximum smoothness
  children,
  className,
  ...props
}: VelocityScrollProps) {
  return (
    <div
      className={cn(
        "relative w-full text-4xl font-bold tracking-[-0.02em] md:text-7xl md:leading-[5rem]",
        className,
      )}
      {...props}
    >
      {Array.from({ length: numRows }).map((_, i) => (
        <ParallaxText
          key={i}
          baseVelocity={defaultVelocity * (i % 2 === 0 ? 1 : -1)}
          speedMultiplier={speedMultiplier}
          smoothness={smoothness}
        >
          {children}
        </ParallaxText>
      ))}
    </div>
  );
}
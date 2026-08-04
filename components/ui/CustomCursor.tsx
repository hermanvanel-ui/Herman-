"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor-hover]';

export function CustomCursor() {
  const isFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useReducedMotion();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 300, damping: 30 });
  const ringY = useSpring(dotY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (!isFinePointer || reducedMotion) return;

    function handleMove(event: PointerEvent) {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      if (!isVisible) setIsVisible(true);
      const target = event.target as HTMLElement;
      setIsHovering(Boolean(target.closest(INTERACTIVE_SELECTOR)));
    }

    function handleLeave() {
      setIsVisible(false);
    }

    window.addEventListener("pointermove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [isFinePointer, reducedMotion, dotX, dotY, isVisible]);

  if (!isFinePointer || reducedMotion) return null;

  return (
    <div aria-hidden="true" style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.2s" }}>
      <motion.div
        className="cursor-dot bg-accent"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 6,
          height: 6,
        }}
      />
      <motion.div
        className="cursor-ring border border-accent"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 56 : 32,
          height: isHovering ? 56 : 32,
          opacity: isHovering ? 0.9 : 0.5,
          transition: "width 0.25s var(--ease-premium), height 0.25s var(--ease-premium), opacity 0.25s",
        }}
      />
    </div>
  );
}

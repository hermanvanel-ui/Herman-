"use client";

import type { ReactNode, ElementType } from "react";
import { motion } from "motion/react";
import { EASE_PREMIUM, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  if (reducedMotion) {
    const Tag = as;
    return <Tag className={cn(className)}>{children}</Tag>;
  }

  const variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_PREMIUM, delay },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

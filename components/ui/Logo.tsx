"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const orbitVariants = {
  rest: { rotate: 0 },
  hover: {
    rotate: 90,
    transition: { type: "spring" as const, stiffness: 180, damping: 14 },
  },
};

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
}

export function Logo({ className, withWordmark = true }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="a.SYNC — retour à l'accueil"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <motion.span
        className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center text-text-primary"
        initial="rest"
        whileHover="hover"
        whileFocus="hover"
      >
        <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
          <path
            d="M52 32a20 20 0 1 1-8.5-16.4"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <motion.circle
            cx="49"
            cy="13"
            r="5.5"
            fill="#22D3EE"
            variants={orbitVariants}
            style={{ transformOrigin: "32px 32px", transformBox: "view-box" }}
          />
        </svg>
      </motion.span>
      {withWordmark && (
        <span className="font-display text-lg font-semibold tracking-[0.12em] text-text-primary">
          a<span className="text-accent">.</span>SYNC
        </span>
      )}
    </Link>
  );
}

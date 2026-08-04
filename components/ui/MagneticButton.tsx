"use client";

import { useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticButtonProps {
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  variant?: "solid" | "outline";
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  disabled?: boolean;
}

export function MagneticButton({
  href,
  type = "button",
  onClick,
  variant = "solid",
  className,
  children,
  disabled,
  ...aria
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.3 });

  function handleMouseMove(event: ReactMouseEvent<HTMLDivElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  }

  function handleMouseLeave() {
    setIsHovering(false);
    x.set(0);
    y.set(0);
  }

  const baseClasses = cn(
    "relative inline-flex items-center justify-center rounded-md px-7 py-3.5 font-sans text-sm font-medium tracking-wide transition-colors duration-300",
    variant === "solid"
      ? "bg-accent text-bg hover:bg-accent-soft"
      : "border border-border-strong bg-transparent text-text-primary hover:border-accent hover:text-accent",
    disabled && "pointer-events-none opacity-50",
    className
  );

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
      data-cursor-hover={isHovering ? "true" : undefined}
    >
      <span className={baseClasses}>{children}</span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} aria-label={aria["aria-label"]} className="inline-block">
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={aria["aria-label"]}
      className="inline-block"
    >
      {content}
    </button>
  );
}

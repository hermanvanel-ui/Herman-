"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { TeamMember } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-surface p-8 transition-colors duration-300 hover:border-border-strong"
    >
      <span
        aria-hidden="true"
        className="font-display text-5xl font-semibold text-text-primary/10 transition-colors duration-300 group-hover:text-accent/25"
      >
        {member.initials}
      </span>
      <h3 className="mt-6 font-display text-lg font-semibold text-text-primary">{member.name}</h3>
      <p className="mt-1 text-sm text-accent">{member.role}</p>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">{member.bio}</p>
    </motion.div>
  );
}

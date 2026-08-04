"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { stats } from "@/content/site";
import { useCountUp } from "@/hooks/useCountUp";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
}

function StatItem({ value, suffix, label }: StatItemProps) {
  const [start, setStart] = useState(false);
  const count = useCountUp(value, start);

  return (
    <motion.div
      className="flex flex-col gap-2 border-t border-border pt-6"
      viewport={{ once: true, margin: "-100px 0px -100px 0px" }}
      onViewportEnter={() => setStart(true)}
    >
      <span className="font-mono text-4xl font-medium text-accent md:text-5xl">
        {count}
        {suffix}
      </span>
      <span className="text-sm text-text-secondary">{label}</span>
    </motion.div>
  );
}

export function StatsBar() {
  return (
    <section className="border-b border-border bg-bg px-6 py-16 lg:px-10" aria-label="Chiffres clés">
      <div className="mx-auto grid max-w-content grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat) => (
          <StatItem key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
        ))}
      </div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import { EASE_PREMIUM } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PricingToggleProps {
  annual: boolean;
  onChange: (annual: boolean) => void;
}

export function PricingToggle({ annual, onChange }: PricingToggleProps) {
  return (
    <div className="inline-flex items-center gap-4 rounded-full border border-border bg-surface p-1.5">
      <button
        type="button"
        onClick={() => onChange(false)}
        aria-pressed={!annual}
        className={cn(
          "relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300",
          !annual ? "text-bg" : "text-text-secondary hover:text-text-primary"
        )}
      >
        {!annual && (
          <motion.span
            layoutId="pricing-toggle-pill"
            className="absolute inset-0 -z-10 rounded-full bg-accent"
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
          />
        )}
        Mensuel
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        aria-pressed={annual}
        className={cn(
          "relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300",
          annual ? "text-bg" : "text-text-secondary hover:text-text-primary"
        )}
      >
        {annual && (
          <motion.span
            layoutId="pricing-toggle-pill"
            className="absolute inset-0 -z-10 rounded-full bg-accent"
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
          />
        )}
        Annuel
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide",
            annual ? "bg-bg/20 text-bg" : "bg-accent-dim text-accent"
          )}
        >
          −2 mois
        </span>
      </button>
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import { EASE_PREMIUM } from "@/lib/motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = currentStep / totalSteps;

  return (
    <div className="flex items-center gap-4" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-border">
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-accent"
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.5, ease: EASE_PREMIUM }}
        />
      </div>
      <span className="shrink-0 font-mono text-xs text-text-tertiary">
        Étape {String(currentStep).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
      </span>
    </div>
  );
}

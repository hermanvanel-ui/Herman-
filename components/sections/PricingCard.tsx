"use client";

import { AnimatePresence, motion } from "motion/react";
import type { PricingTier } from "@/types";
import { pricingFeatures } from "@/content/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { EASE_PREMIUM } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  tier: PricingTier;
  annual: boolean;
}

export function PricingCard({ tier, annual }: PricingCardProps) {
  const displayedPrice = annual ? Math.round((tier.priceMonthly * 10) / 12) : tier.priceMonthly;

  const content = (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-lg p-8",
        tier.highlighted ? "bg-surface" : "border border-border bg-surface/60"
      )}
    >
      {tier.highlighted && (
        <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wide text-bg">
          Le plus choisi
        </span>
      )}

      <h3 className="font-display text-xl font-semibold text-text-primary">{tier.name}</h3>
      <p className="mt-1.5 text-sm text-text-secondary">{tier.tagline}</p>

      <div className="mt-6 flex items-end gap-1">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayedPrice}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
            className="font-mono text-4xl font-semibold text-text-primary"
          >
            {displayedPrice}€
          </motion.span>
        </AnimatePresence>
        <span className="pb-1 text-sm text-text-tertiary">/ mois</span>
      </div>
      {annual && (
        <p className="mt-1 font-mono text-xs text-accent">Facturé {displayedPrice * 12}€ / an</p>
      )}

      <ul className="mt-8 flex flex-1 flex-col gap-4 border-t border-border pt-6">
        {pricingFeatures.map((feature) => (
          <li key={feature.label} className="flex flex-col gap-0.5 text-sm">
            <span className="text-text-tertiary">{feature.label}</span>
            <span className="text-text-primary">{feature[tier.id]}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <MagneticButton
          href="#contact"
          variant={tier.highlighted ? "solid" : "outline"}
          className="w-full justify-center"
          aria-label={`Choisir l'offre ${tier.name}`}
        >
          Choisir {tier.name}
        </MagneticButton>
      </div>
    </div>
  );

  if (!tier.highlighted) {
    return content;
  }

  return (
    <div className="relative rounded-lg p-[1.5px]">
      <div className="absolute inset-0 overflow-hidden rounded-lg" aria-hidden="true">
        <div className="absolute -inset-[60%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0%,#22D3EE_12%,transparent_28%)]" />
      </div>
      <div className="relative">{content}</div>
    </div>
  );
}

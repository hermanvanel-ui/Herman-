"use client";

import { useState } from "react";
import { pricingIntro, pricingOutro, pricingTiers } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { PricingToggle } from "@/components/sections/PricingToggle";
import { PricingCard } from "@/components/sections/PricingCard";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="tarifs" className="border-b border-border bg-bg px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-content">
        <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Tarifs</span>
            <h2 className="mt-4 max-w-xl font-display text-h2 font-semibold text-text-primary">
              {pricingIntro.title}
            </h2>
            <p className="mt-4 max-w-lg text-base text-text-secondary">{pricingIntro.description}</p>
          </div>
          <PricingToggle annual={annual} onChange={setAnnual} />
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <Reveal key={tier.id} delay={index * 0.08}>
              <PricingCard tier={tier} annual={annual} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex flex-col items-center gap-5 border-t border-border pt-14 text-center">
          <p className="text-lg text-text-secondary">{pricingOutro.text}</p>
          <MagneticButton href={pricingOutro.cta.href}>{pricingOutro.cta.label}</MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}

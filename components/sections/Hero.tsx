"use client";

import { motion } from "motion/react";
import { hero } from "@/content/site";
import { HeroParticles } from "@/components/sections/HeroParticles";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { EASE_PREMIUM } from "@/lib/motion";

const words = hero.title.split(" ");

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-20 pt-32 lg:px-10"
    >
      <div className="absolute inset-0 hero-glow" aria-hidden="true" />
      <HeroParticles />

      <div className="relative z-10 mx-auto w-full max-w-content">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="max-w-5xl font-display text-hero font-semibold text-text-primary">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="inline-block overflow-hidden pb-[0.06em] pr-[0.22em] align-top"
            >
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: EASE_PREMIUM, delay: 0.15 + index * 0.04 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.6 }}
          className="mt-8 max-w-xl text-base text-text-secondary md:text-lg"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.75 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href={hero.ctaPrimary.href} variant="solid">
            {hero.ctaPrimary.label}
          </MagneticButton>
          <MagneticButton href={hero.ctaSecondary.href} variant="outline">
            {hero.ctaSecondary.label}
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

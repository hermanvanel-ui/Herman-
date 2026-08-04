"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { methodSteps } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

export function MethodTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.4"],
  });

  return (
    <section id="methode" className="relative border-b border-border bg-bg px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-content">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Notre méthode</span>
          <h2 className="mt-4 max-w-2xl font-display text-h2 font-semibold text-text-primary">
            Un process en 4 étapes, du diagnostic aux résultats.
          </h2>
        </Reveal>

        <div ref={containerRef} className="relative mt-20">
          <svg
            className="absolute left-[19px] top-0 h-full w-[2px] md:left-[27px]"
            preserveAspectRatio="none"
            viewBox="0 0 2 100"
            aria-hidden="true"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              stroke="rgba(255,255,255,.08)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              stroke="#22D3EE"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>

          <ol className="flex flex-col gap-14">
            {methodSteps.map((step, index) => (
              <Reveal
                as="li"
                key={step.number}
                delay={index * 0.05}
                className="relative flex gap-6 pl-14 md:gap-10 md:pl-20"
              >
                <span className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-accent bg-bg font-mono text-sm text-accent md:h-14 md:w-14">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-text-primary md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm text-text-secondary md:text-base">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

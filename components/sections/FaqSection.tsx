"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faqItems } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { EASE_PREMIUM } from "@/lib/motion";

function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-display text-base font-medium text-text-primary md:text-lg">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE_PREMIUM }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary"
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-sm leading-relaxed text-text-secondary md:text-base">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="border-b border-border bg-bg px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-content">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">FAQ</span>
          <h2 className="mt-4 max-w-2xl font-display text-h2 font-semibold text-text-primary">
            Questions fréquentes.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          {faqItems.map((item) => (
            <FaqRow key={item.question} question={item.question} answer={item.answer} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { QuoteExample } from "@/types";
import { TVA_RATE } from "@/content/site";
import { formatEuro } from "@/lib/utils";
import { EASE_PREMIUM } from "@/lib/motion";
import { generateQuotePdf } from "@/lib/generateQuotePdf";

interface QuoteCardProps {
  quote: QuoteExample;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const panelId = useId();

  const subtotal = quote.lines.reduce((sum, line) => sum + line.qty * line.unitPrice, 0);
  const tva = subtotal * TVA_RATE;
  const total = subtotal + tva;

  async function handleDownload() {
    setIsGenerating(true);
    try {
      await generateQuotePdf(quote);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold tracking-[0.1em] text-text-primary">
              a<span className="text-accent">.</span>SYNC
            </span>
            <span className="font-mono text-xs text-text-tertiary">{quote.reference}</span>
          </div>
          <p className="mt-2 font-display text-lg font-medium text-text-primary">{quote.clientLabel}</p>
          <p className="text-sm text-text-tertiary">{quote.clientType} — {quote.date}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="font-mono text-lg text-accent">{formatEuro(total)}</span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary"
            aria-hidden="true"
          >
            +
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
            className="border-t border-border"
          >
            <div className="px-6 py-6">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-text-tertiary">
                    <th className="pb-3 font-normal">Désignation</th>
                    <th className="pb-3 text-right font-normal">Qté</th>
                    <th className="pb-3 text-right font-normal">PU HT</th>
                    <th className="pb-3 text-right font-normal">Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.lines.map((line) => (
                    <tr key={line.label} className="border-t border-border">
                      <td className="py-3 pr-4 text-text-secondary">{line.label}</td>
                      <td className="py-3 text-right font-mono text-text-secondary">{line.qty}</td>
                      <td className="py-3 text-right font-mono text-text-secondary">
                        {formatEuro(line.unitPrice)}
                      </td>
                      <td className="py-3 text-right font-mono text-text-primary">
                        {formatEuro(line.qty * line.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex flex-col items-end gap-1.5 border-t border-border pt-4 font-mono text-sm">
                <div className="flex w-full max-w-[220px] justify-between text-text-secondary">
                  <span>Sous-total HT</span>
                  <span>{formatEuro(subtotal)}</span>
                </div>
                <div className="flex w-full max-w-[220px] justify-between text-text-secondary">
                  <span>TVA ({Math.round(TVA_RATE * 100)}%)</span>
                  <span>{formatEuro(tva)}</span>
                </div>
                <div className="flex w-full max-w-[220px] justify-between text-base text-text-primary">
                  <span>Total TTC</span>
                  <span className="text-accent">{formatEuro(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isGenerating}
                className="mt-6 inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-2.5 text-sm text-text-primary transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
              >
                {isGenerating ? "Génération..." : "Télécharger le modèle PDF"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

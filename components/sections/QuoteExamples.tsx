import { quoteExamples } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteCard } from "@/components/sections/QuoteCard";

export function QuoteExamples() {
  return (
    <section id="devis" className="border-b border-border bg-bg px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-content">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Exemples de devis</span>
          <h2 className="mt-4 max-w-2xl font-display text-h2 font-semibold text-text-primary">
            Trois profils, trois façons de nous confier votre croissance.
          </h2>
          <p className="mt-5 max-w-xl text-base text-text-secondary">
            Des devis types à titre d&apos;illustration. Le vôtre sera ajusté après un premier échange gratuit.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-5">
          {quoteExamples.map((quote, index) => (
            <Reveal key={quote.id} delay={index * 0.06}>
              <QuoteCard quote={quote} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { testimonials } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import type { Testimonial } from "@/types";

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="w-[360px] shrink-0 rounded-lg border border-border bg-surface p-6">
      <blockquote className="text-sm leading-relaxed text-text-secondary">
        &laquo;&nbsp;{testimonial.quote}&nbsp;&raquo;
      </blockquote>
      <figcaption className="mt-4 border-t border-border pt-4">
        <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
        <p className="text-xs text-text-tertiary">
          {testimonial.activity} — {testimonial.city}
        </p>
      </figcaption>
    </figure>
  );
}

function MarqueeRow({ items, reverse }: { items: Testimonial[]; reverse: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-mask overflow-hidden">
      <div
        className={`flex w-max gap-5 py-2 hover:[animation-play-state:paused] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {doubled.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.name}-${index}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  const midpoint = Math.ceil(testimonials.length / 2);
  const rowOne = testimonials.slice(0, midpoint);
  const rowTwo = testimonials.slice(midpoint);

  return (
    <section className="border-b border-border bg-bg py-24" aria-label="Témoignages clients">
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Témoignages</span>
          <h2 className="mt-4 max-w-2xl font-display text-h2 font-semibold text-text-primary">
            Ce que nos clients en disent.
          </h2>
        </Reveal>
      </div>

      {testimonials.length === 0 ? (
        <Reveal className="mx-auto mt-14 max-w-content px-6 lg:px-10">
          <div className="rounded-lg border border-dashed border-border bg-surface/50 px-8 py-16 text-center">
            <p className="font-display text-lg text-text-primary">
              Nos premiers retours clients arrivent bientôt.
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Nous publions ici les avis de nos clients dès les premières missions terminées.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="mt-14 flex flex-col gap-5">
          <MarqueeRow items={rowOne} reverse={false} />
          {rowTwo.length > 0 && <MarqueeRow items={rowTwo} reverse />}
        </div>
      )}
    </section>
  );
}

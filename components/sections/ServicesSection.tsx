import { services } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceRow } from "@/components/sections/ServiceRow";

export function ServicesSection() {
  return (
    <section id="services" className="relative border-b border-border bg-bg">
      <div className="mx-auto max-w-content px-6 pt-24 lg:px-10">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Nos services</span>
          <h2 className="mt-4 max-w-2xl font-display text-h2 font-semibold text-text-primary">
            Trois leviers, une seule équipe.
          </h2>
        </Reveal>
      </div>

      <div className="divide-y divide-border">
        {services.map((service, index) => (
          <ServiceRow key={service.id} service={service} reverse={index % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

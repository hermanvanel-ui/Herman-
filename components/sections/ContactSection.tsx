import { contactSection, siteConfig } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { MultiStepForm } from "@/components/forms/MultiStepForm";

export function ContactSection() {
  return (
    <section id="contact" className="bg-bg px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-content gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Contact</span>
          <h2 className="mt-4 font-display text-h2 font-semibold text-text-primary">{contactSection.title}</h2>
          <p className="mt-5 max-w-sm text-base text-text-secondary">{contactSection.description}</p>

          <dl className="mt-12 flex flex-col gap-6 border-t border-border pt-8">
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-tertiary">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${siteConfig.contact.email}`} className="font-mono text-sm text-text-primary hover:text-accent">
                  {siteConfig.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-tertiary">Téléphone</dt>
              <dd className="mt-1">
                <a href={`tel:${siteConfig.contact.phoneHref}`} className="font-mono text-sm text-text-primary hover:text-accent">
                  {siteConfig.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-tertiary">Ville</dt>
              <dd className="mt-1 font-mono text-sm text-text-primary">{siteConfig.contact.city}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-tertiary">Délai de réponse</dt>
              <dd className="mt-1 font-mono text-sm text-accent">{siteConfig.contact.responseTime}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="rounded-lg border border-border bg-surface p-8 md:p-10">
          <MultiStepForm />
        </Reveal>
      </div>
    </section>
  );
}

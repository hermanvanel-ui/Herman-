import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Merci pour votre demande",
  description: "Votre demande a bien été reçue. Notre équipe revient vers vous sous 24h ouvrées.",
  robots: { index: false, follow: true },
};

export default function MerciPage() {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-32 text-center">
      <Reveal className="flex flex-col items-center">
        <Logo className="mb-10" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Demande envoyée</span>
        <h1 className="mt-5 max-w-xl font-display text-h2 font-semibold text-text-primary">
          Merci, votre message est bien arrivé.
        </h1>
        <p className="mt-5 max-w-md text-base text-text-secondary">
          Notre équipe étudie votre demande et revient vers vous sous 24h ouvrées avec une première proposition
          adaptée à votre activité.
        </p>
        <p className="mt-8 font-mono text-sm text-text-tertiary">
          Une urgence ? Écrivez-nous directement à{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="text-accent hover:underline">
            {siteConfig.contact.email}
          </a>
        </p>
        <div className="mt-10">
          <MagneticButton href="/">Retour à l&apos;accueil</MagneticButton>
        </div>
      </Reveal>
    </section>
  );
}

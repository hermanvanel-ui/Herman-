import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site a.SYNC — agence digitale.",
};

export default function MentionsLegalesPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-32 lg:px-10">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Informations légales</span>
        <h1 className="mt-4 font-display text-h2 font-semibold text-text-primary">Mentions légales</h1>

        <div className="mt-12 flex flex-col gap-10 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">1. Éditeur du site</h2>
            <p className="mt-3">
              Le site {siteConfig.url.replace("https://", "")} est édité par {siteConfig.legalName}, société à
              responsabilité simplifiée unipersonnelle immatriculée au Registre du Commerce et des Sociétés
              (SIRET à compléter avant mise en production).
            </p>
            <p className="mt-3">
              Siège social : {siteConfig.contact.city}, France.
              <br />
              Email : {siteConfig.contact.email}
              <br />
              Téléphone : {siteConfig.contact.phone}
            </p>
            <p className="mt-3">Directeur de la publication : la gérance de {siteConfig.legalName}.</p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">2. Hébergement</h2>
            <p className="mt-3">
              Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
              (vercel.com).
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">3. Propriété intellectuelle</h2>
            <p className="mt-3">
              L&apos;ensemble des éléments du site (textes, visuels, logo, code) est la propriété exclusive de{" "}
              {siteConfig.legalName}, sauf mention contraire. Toute reproduction, représentation ou diffusion,
              totale ou partielle, sans autorisation préalable est interdite.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">4. Responsabilité</h2>
            <p className="mt-3">
              {siteConfig.legalName} s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées
              sur ce site, sans garantie d&apos;exhaustivité. {siteConfig.legalName} ne saurait être tenue
              responsable des erreurs, omissions ou de l&apos;indisponibilité temporaire du site.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">5. Liens externes</h2>
            <p className="mt-3">
              Le site peut contenir des liens vers des sites tiers. {siteConfig.legalName} n&apos;exerce aucun
              contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">6. Droit applicable</h2>
            <p className="mt-3">
              Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux
              français seront seuls compétents.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

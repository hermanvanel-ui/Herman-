import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et de protection des données personnelles du site a.SYNC.",
};

export default function ConfidentialitePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-32 lg:px-10">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Vie privée</span>
        <h1 className="mt-4 font-display text-h2 font-semibold text-text-primary">
          Politique de confidentialité
        </h1>
        <p className="mt-4 text-sm text-text-tertiary">Dernière mise à jour : 4 août 2026</p>

        <div className="mt-12 flex flex-col gap-10 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">1. Données collectées</h2>
            <p className="mt-3">
              Lorsque vous remplissez notre formulaire de contact, nous collectons les données que vous nous
              transmettez volontairement : nom, nom d&apos;entreprise, email, téléphone, secteur d&apos;activité,
              ville ciblée et message. Aucune autre donnée personnelle n&apos;est collectée à votre insu.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">2. Finalité du traitement</h2>
            <p className="mt-3">
              Ces données sont utilisées uniquement pour répondre à votre demande de devis ou de contact, et pour
              assurer le suivi commercial de la relation si vous devenez client. Elles ne sont ni vendues, ni
              cédées à des tiers à des fins commerciales.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">3. Base légale</h2>
            <p className="mt-3">
              Le traitement repose sur votre consentement explicite, exprimé par l&apos;envoi volontaire du
              formulaire de contact.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">4. Durée de conservation</h2>
            <p className="mt-3">
              Les données transmises via le formulaire sont conservées pendant 3 ans à compter du dernier
              contact, sauf demande de suppression anticipée de votre part.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">5. Vos droits</h2>
            <p className="mt-3">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un
              droit d&apos;accès, de rectification, d&apos;effacement et de portabilité de vos données, ainsi
              que d&apos;un droit d&apos;opposition au traitement. Pour exercer ces droits, contactez-nous à{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="text-accent hover:underline">
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">6. Cookies</h2>
            <p className="mt-3">
              Ce site n&apos;utilise pas de cookies de suivi publicitaire ni d&apos;outils de mesure d&apos;audience
              tiers. Aucun consentement cookie n&apos;est requis en l&apos;état actuel du site.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">7. Sécurité</h2>
            <p className="mt-3">
              Les données transmises via le formulaire sont chiffrées en transit (HTTPS) et traitées par des
              prestataires techniques fiables. Aucun système n&apos;étant infaillible, {siteConfig.legalName} met
              en œuvre les moyens raisonnables pour en assurer la sécurité.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-medium text-text-primary">8. Contact</h2>
            <p className="mt-3">
              Pour toute question relative à cette politique, contactez {siteConfig.legalName} à{" "}
              {siteConfig.contact.email} ou {siteConfig.contact.phone}.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

import { Resend } from "resend";
import type { ContactFormValues } from "@/lib/validations/contact";
import { siteConfig } from "@/content/site";

const needLabels: Record<ContactFormValues["need"], string> = {
  reseaux: "Réseaux sociaux",
  site: "Site internet",
  prospection: "Prospection",
  tout: "Tout (stratégie complète)",
};

export async function sendContactNotification(data: ContactFormValues): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO || siteConfig.contact.email;

  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY manquante — email non envoyé. Configurez .env pour activer l'envoi réel.",
      { to, data }
    );
    return;
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM || "a.SYNC <onboarding@resend.dev>",
    to,
    replyTo: data.email,
    subject: `Nouvelle demande de devis — ${data.company}`,
    html: `
      <h2>Nouvelle demande de devis</h2>
      <p><strong>Besoin :</strong> ${needLabels[data.need]}</p>
      <p><strong>Secteur :</strong> ${data.sector}</p>
      <p><strong>Ville ciblée :</strong> ${data.city}</p>
      <hr />
      <p><strong>Nom :</strong> ${data.name}</p>
      <p><strong>Entreprise :</strong> ${data.company}</p>
      <p><strong>Email :</strong> ${data.email}</p>
      <p><strong>Téléphone :</strong> ${data.phone}</p>
      ${data.message ? `<p><strong>Message :</strong><br />${data.message}</p>` : ""}
    `,
  });
}

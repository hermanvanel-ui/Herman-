# a.SYNC — Site vitrine

Site vitrine one-page pour **a.SYNC**, agence digitale (prospection B2B, sites internet haute performance,
visibilité réseaux sociaux automatisée). Next.js 15 (App Router) + TypeScript strict + Tailwind CSS + Motion
(Framer Motion) + Lenis + GSAP/ScrollTrigger.

## Installation

Prérequis : Node.js ≥ 18.18.

```bash
npm install
cp .env.example .env
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

### Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Lance le build de production |
| `npm run lint` | Lint ESLint |
| `npm run typecheck` | Vérification TypeScript sans émission |

## Structure du projet

```
app/                          Routes Next.js (App Router)
  layout.tsx                  Layout racine : fonts, metadata, JSON-LD, providers
  page.tsx                    Landing one-page (assemble toutes les sections)
  globals.css                 Reset, tokens CSS, utilitaires (grain, glow, curseur)
  sitemap.ts / robots.ts      SEO technique
  manifest.ts                 Manifeste PWA
  icon.svg / opengraph-image.tsx / icon-192 / icon-512   Favicons & image de partage
  merci/                      Page de remerciement post-formulaire
  mentions-legales/           Mentions légales
  confidentialite/            Politique de confidentialité
  api/contact/route.ts        Route API du formulaire (validation Zod + email)

content/
  site.ts                     ★ Tout le contenu éditorial du site (voir ci-dessous)

components/
  layout/                     Header, MobileMenu, Footer, PageTransition, Providers
  ui/                         Logo, MagneticButton, CustomCursor, Reveal, Grain, SmoothScrollProvider
  sections/                   Une section = un fichier (Hero, Services, Pricing, FAQ, Contact...)
    visuals/                  Visuels animés des blocs "Services" (gauge Lighthouse, planning, prospection)
  forms/                      Formulaire de contact multi-étapes

lib/
  motion.ts                   Constantes d'easing et variants Framer Motion partagés
  utils.ts                    Formatage (euros, dates), fusion de classes
  email.ts                    Adaptateur d'envoi d'email (Resend)
  generateQuotePdf.ts         Génération du PDF des devis types (jsPDF, chargé à la demande)
  jsonld.ts                   Générateurs de données structurées Schema.org
  validations/contact.ts      Schémas Zod du formulaire de contact

hooks/                        useLenis, useScrollPin, useCountUp, useReducedMotion, useMediaQuery
types/                        Types TypeScript partagés (contenu éditorial)
```

## Où modifier les textes et les prix

**Tout le contenu éditorial est centralisé dans `content/site.ts`.** C'est le seul fichier à modifier pour :

- Le titre, sous-titre et CTA du hero (`hero`)
- Les chiffres clés de la barre de stats (`stats`)
- Les textes des 3 services (`services`)
- Les étapes de la méthode (`methodSteps`)
- L'équipe (`team`)
- **Les tarifs des 3 offres** (`pricingTiers`, `pricingFeatures`) — prix mensuel dans `priceMonthly`,
  le prix annuel (−2 mois) est calculé automatiquement
- **Les exemples de devis** (`quoteExamples`) — ajoutez/modifiez des lignes, les totaux (sous-total, TVA,
  TTC) sont recalculés automatiquement dans l'UI et dans le PDF généré
- Les témoignages (`testimonials`) — laissez le tableau vide tant qu'aucun avis réel n'est disponible : la
  section affiche alors un état "à venir" plutôt que d'inventer des avis
- Les questions fréquentes (`faqItems`)
- Les coordonnées de contact et réseaux sociaux (`siteConfig.contact`, `siteConfig.social`)

Les pages `/mentions-legales` et `/confidentialite` contiennent leur propre texte directement dans leur
fichier (`app/mentions-legales/page.tsx`, `app/confidentialite/page.tsx`) — à adapter avec vos informations
légales réelles (SIRET notamment, actuellement marqué "à compléter").

## Formulaire de contact

Le formulaire multi-étapes (`components/forms/MultiStepForm.tsx`) valide chaque étape avec Zod
(`lib/validations/contact.ts`) puis envoie les données à `app/api/contact/route.ts`, qui déclenche l'envoi
d'un email via l'adaptateur `lib/email.ts` (Resend).

Sans variable d'environnement `RESEND_API_KEY` configurée, les demandes sont simplement journalisées côté
serveur (aucun email n'est envoyé) — pratique en développement, à activer avant mise en production réelle.

## Variables d'environnement

Voir `.env.example` :

- `RESEND_API_KEY` — clé API [Resend](https://resend.com) pour l'envoi réel des emails de contact
- `CONTACT_EMAIL_FROM` — adresse d'expédition (domaine vérifié sur Resend en production)
- `CONTACT_EMAIL_TO` — adresse de réception des demandes

## Accessibilité & performance

- Toutes les animations respectent `prefers-reduced-motion` (désactivation globale via
  `MotionConfig reducedMotion="user"` + media query CSS de secours)
- Navigation clavier complète, focus visibles, `<label>` réels sur tous les champs, `aria-*` sur les
  contrôles interactifs (accordéons, menu mobile, formulaire)
- Curseur personnalisé et effets magnétiques désactivés sur mobile / pointeurs tactiles
- Images et polices optimisées via `next/font` et `next/image` (AVIF/WebP)

## Déploiement sur Vercel

1. Poussez le dépôt sur GitHub (déjà fait si vous lisez ceci depuis la branche du projet).
2. Sur [vercel.com](https://vercel.com), importez le dépôt — Vercel détecte automatiquement Next.js.
3. Renseignez les variables d'environnement du `.env.example` dans les réglages du projet Vercel.
4. Déployez. Le domaine par défaut (`*.vercel.app`) fonctionne immédiatement ; ajoutez votre nom de domaine
   personnalisé dans les réglages du projet.
5. Pensez à mettre à jour `siteConfig.url` dans `content/site.ts` avec le domaine définitif (utilisé pour le
   sitemap, les données structurées et l'URL canonique Open Graph).

## Notes

- Le bouton "Télécharger le modèle PDF" des exemples de devis génère un vrai PDF côté client (librairie
  `jspdf`, chargée dynamiquement au clic pour ne pas alourdir le chargement initial du site).
- Le score Lighthouse "42 → 98" affiché dans la section Services est un visuel illustratif du service
  d'optimisation, pas une mesure en temps réel de ce site.

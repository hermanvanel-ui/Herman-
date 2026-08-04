import type {
  ContactStepOneOption,
  FaqItem,
  MethodStep,
  NavLink,
  PricingFeature,
  PricingTier,
  QuoteExample,
  ServiceBlock,
  Stat,
  Testimonial,
  TeamMember,
} from "@/types";

export const siteConfig = {
  name: "a.SYNC",
  legalName: "a.SYNC SASU",
  tagline: "On synchronise votre prospection, votre site et vos réseaux.",
  description:
    "Agence digitale de 5 experts. Prospection B2B ciblée, sites internet haute performance et planning automatique de réseaux sociaux, pour les dirigeants de TPE et PME.",
  url: "https://www.asyncagency.fr",
  // À MODIFIER si besoin : coordonnées de contact réelles.
  contact: {
    email: "asyncagency@gmail.com",
    phone: "06 61 21 91 68",
    phoneHref: "+33661219168",
    city: "Nice (06)",
    responseTime: "Réponse sous 24h ouvrées",
  },
  social: {
    instagram: "https://instagram.com/asyncagency",
    linkedin: "https://linkedin.com/company/asyncagency",
  },
};

export const navLinks: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "Méthode", href: "#methode" },
  { label: "Équipe", href: "#equipe" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Devis types", href: "#devis" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "Agence digitale — Nice & toute la France",
  title: "On synchronise votre prospection, votre site et vos réseaux.",
  subtitle:
    "Agence de 5 experts. Deux ans de R&D pour vous proposer un rapport qualité-prix qui n'existe nulle part ailleurs.",
  ctaPrimary: { label: "Voir nos offres", href: "#tarifs" },
  ctaSecondary: { label: "Obtenir un devis gratuit", href: "#contact" },
};

export const stats: Stat[] = [
  { value: 5, suffix: "", label: "experts dédiés" },
  { value: 2, suffix: " ans", label: "de R&D" },
  { value: 4, suffix: "", label: "réseaux synchronisés" },
  { value: 100, suffix: "%", label: "du planning automatisé" },
];

export const services: ServiceBlock[] = [
  {
    id: "prospection",
    kicker: "01 — Acquisition",
    title: "Prospection B2B ciblée",
    description:
      "Nous identifions et contactons des professionnels réellement qualifiés pour votre activité. Ciblage par niche métier et par zone géographique précise, séquences de relance construites pour obtenir des réponses, suivi des retours et reporting clair de chaque campagne.",
    bullets: [
      "Ciblage fin par secteur, taille d'entreprise et zone d'intervention",
      "Séquences de contact et de relance sur plusieurs canaux",
      "Suivi des réponses et qualification des prospects chauds",
      "Reporting mensuel : contacts, taux de réponse, rendez-vous obtenus",
    ],
    visual: "prospection",
  },
  {
    id: "sites",
    kicker: "02 — Conversion",
    title: "Sites internet haute performance",
    description:
      "Nous créons des sites rapides, propres et pensés pour convertir — et nous optimisons vos sites existants : vitesse de chargement, Core Web Vitals, SEO technique, refonte de l'expérience utilisateur. Un site lent ou mal structuré coûte des clients tous les jours.",
    bullets: [
      "Création de sites sur-mesure orientés conversion",
      "Optimisation de sites existants : vitesse, Core Web Vitals, SEO technique",
      "Refonte UX pour réduire le taux de rebond et augmenter les demandes de contact",
      "Suivi de performance continu après mise en ligne",
    ],
    visual: "lighthouse",
  },
  {
    id: "social",
    kicker: "03 — Visibilité",
    title: "Visibilité réseaux sociaux automatisée",
    description:
      "Vous nous envoyez vos photos et vidéos, on s'occupe du reste. Notre générateur de planning conçu en interne construit un calendrier de publication optimisé pour votre niche et votre zone géographique précise. Nous publions via plusieurs comptes de votre entreprise pour démultiplier la portée, sur Instagram, Facebook, X (Twitter) et Threads, en programmation 100% automatique, calée sur les logiques de recommandation de chaque plateforme.",
    bullets: [
      "Générateur de planning propriétaire, ciblé niche + zone géographique",
      "Publication automatique sur Instagram, Facebook, X et Threads",
      "Diffusion via plusieurs comptes de l'entreprise pour démultiplier la portée",
      "Programmation calée sur les logiques de recommandation de chaque plateforme",
    ],
    visual: "planning",
  },
];

export const methodSteps: MethodStep[] = [
  {
    number: "01",
    title: "Audit gratuit",
    description:
      "Analyse de votre présence actuelle — site, réseaux, visibilité locale — et identification des leviers prioritaires pour votre activité.",
  },
  {
    number: "02",
    title: "Stratégie & planning",
    description:
      "Construction d'un plan d'action ciblé sur votre niche et votre zone géographique, avec des objectifs mesurables et un calendrier clair.",
  },
  {
    number: "03",
    title: "Production & automatisation",
    description:
      "Mise en place du site, des campagnes de prospection et du planning automatique de publication sur vos réseaux.",
  },
  {
    number: "04",
    title: "Suivi et optimisation",
    description:
      "Reporting régulier, ajustements continus des campagnes et du planning pour améliorer les résultats mois après mois.",
  },
];

export const teamIntro = {
  title: "Nous sommes 5.",
  description:
    "Deux chargés de clientèle qui sont votre interlocuteur unique, toujours disponible. Trois développeurs spécialisés en code de précision et en automatisation, qui construisent les outils qui font tourner votre visibilité.",
};

export const team: TeamMember[] = [
  {
    initials: "LM",
    name: "Léa M.",
    role: "Chargée de clientèle",
    bio: "Votre interlocutrice principale : cadrage de vos besoins, suivi de campagne, reporting.",
    group: "clientele",
  },
  {
    initials: "TR",
    name: "Théo R.",
    role: "Chargé de clientèle",
    bio: "Suivi de la relation client sur la durée et coordination des équipes de production.",
    group: "clientele",
  },
  {
    initials: "SB",
    name: "Sacha B.",
    role: "Développeur full-stack",
    bio: "Conception et développement des sites clients, performance et Core Web Vitals.",
    group: "developpement",
  },
  {
    initials: "NK",
    name: "Nina K.",
    role: "Développeuse automatisation",
    bio: "Génération du planning automatique et intégrations multi-comptes réseaux sociaux.",
    group: "developpement",
  },
  {
    initials: "YD",
    name: "Yanis D.",
    role: "Développeur data & prospection",
    bio: "Outils de ciblage et de séquençage pour les campagnes de prospection B2B.",
    group: "developpement",
  },
];

export const pricingIntro = {
  title: "Des offres claires, sans surprise.",
  description:
    "Trois formules pensées pour trois moments différents de votre développement. Un besoin hybride ? On construit l'offre autour de vous.",
  annualNote: "2 mois offerts en engagement annuel",
};

export const pricingTiers: PricingTier[] = [
  { id: "essentiel", name: "Essentiel", tagline: "Lancer sa présence", priceMonthly: 490, highlighted: false },
  { id: "croissance", name: "Croissance", tagline: "Le meilleur rapport résultat / prix", priceMonthly: 890, highlighted: true },
  { id: "performance", name: "Performance", tagline: "Domination locale", priceMonthly: 1490, highlighted: false },
];

export const pricingFeatures: PricingFeature[] = [
  { label: "Réseaux sociaux", essentiel: "2 réseaux, 1 compte", croissance: "4 réseaux, comptes multiples", performance: "4 réseaux, réseau de comptes complet" },
  { label: "Publications", essentiel: "12 / mois", croissance: "30 / mois", performance: "Illimitées + stories" },
  { label: "Planning automatique", essentiel: "Inclus", croissance: "Ciblage niche + zone géo", performance: "Ciblage avancé + tests A/B" },
  { label: "Site internet", essentiel: "Optimisation du site existant", croissance: "Site 5 pages inclus", performance: "Site sur-mesure + refonte continue" },
  { label: "Prospection B2B", essentiel: "—", croissance: "100 prospects / mois", performance: "400 prospects / mois" },
  { label: "Reporting", essentiel: "Mensuel", croissance: "Bi-mensuel", performance: "Hebdomadaire + interlocuteur dédié" },
  { label: "Engagement", essentiel: "Sans engagement", croissance: "3 mois", performance: "6 mois" },
];

export const pricingOutro = {
  text: "Un besoin hybride ? On construit l'offre autour de vous.",
  cta: { label: "Demander un devis sur-mesure", href: "#contact" },
};

// À MODIFIER si vos tarifs réels diffèrent : content/site.ts, sections pricingTiers / quoteExamples.
export const quoteExamples: QuoteExample[] = [
  {
    id: "devis-a",
    reference: "DEV-2026-014",
    date: "12 février 2026",
    clientLabel: "Restaurant — 1 établissement",
    clientType: "Restauration",
    lines: [
      { label: "Setup planning automatique — 4 réseaux", qty: 1, unitPrice: 690 },
      { label: "Générateur de planning — ciblage niche & zone", qty: 1, unitPrice: 450 },
      { label: "Optimisation site existant (Core Web Vitals, SEO technique)", qty: 1, unitPrice: 590 },
      { label: "Abonnement gestion mensuelle — 1er mois", qty: 1, unitPrice: 490 },
    ],
  },
  {
    id: "devis-b",
    reference: "DEV-2026-021",
    date: "3 mars 2026",
    clientLabel: "Artisan du bâtiment",
    clientType: "Artisanat & BTP",
    lines: [
      { label: "Site vitrine 5 pages (design, développement, SEO on-page)", qty: 1, unitPrice: 1890 },
      { label: "Setup prospection B2B ciblée (niche + zone)", qty: 1, unitPrice: 590 },
      { label: "Abonnement prospection — 100 contacts / mois, 1er mois", qty: 1, unitPrice: 690 },
    ],
  },
  {
    id: "devis-c",
    reference: "DEV-2026-033",
    date: "22 avril 2026",
    clientLabel: "Salle de sport — 2 établissements",
    clientType: "Sport & bien-être",
    lines: [
      { label: "Refonte performance — 2 sites", qty: 1, unitPrice: 2890 },
      { label: "Setup réseau multi-comptes (4 réseaux x 2 établissements)", qty: 1, unitPrice: 990 },
      { label: "Abonnement prospection avancée — 400 contacts / mois, 1er mois", qty: 1, unitPrice: 1290 },
    ],
  },
];

export const TVA_RATE = 0.2;

// À REMPLIR avec de vrais avis clients. Ne pas inventer de témoignages : liste vide tant qu'aucun avis réel n'est disponible.
export const testimonials: Testimonial[] = [];

export const faqItems: FaqItem[] = [
  {
    question: "Combien de temps avant que tout soit opérationnel ?",
    answer:
      "Comptez 1 à 2 semaines entre l'audit et le lancement effectif : mise en place du planning automatique, configuration des comptes réseaux et démarrage des premières campagnes. La création d'un site sur-mesure prend généralement 3 à 4 semaines supplémentaires.",
  },
  {
    question: "Qu'attendez-vous de moi en tant que client ?",
    answer:
      "Essentiellement des photos et vidéos de votre activité, régulièrement si possible. C'est la matière première de votre communication : plus elle est riche, plus le planning automatique peut varier les formats. Le reste — montage, légendes, publication, ciblage — est pris en charge par nos équipes.",
  },
  {
    question: "À qui appartient le site une fois créé ?",
    answer:
      "Le site vous appartient intégralement : nom de domaine, hébergement et code source sont à votre nom ou transférables à tout moment. Aucune dépendance forcée à l'agence après la livraison.",
  },
  {
    question: "Comment résilier mon abonnement ?",
    answer:
      "Selon l'offre, l'engagement initial est de 0, 3 ou 6 mois. Passé ce délai, la résiliation se fait avec un préavis de 30 jours, sans frais ni justification à fournir, par simple email.",
  },
  {
    question: "Que couvre exactement le planning automatique ?",
    answer:
      "Notre générateur interne construit un calendrier de publication adapté à votre niche et à votre zone géographique, puis publie automatiquement le contenu que vous nous fournissez sur les réseaux inclus dans votre offre, aux horaires les plus pertinents selon les logiques de recommandation de chaque plateforme. Vous gardez un droit de regard et de modification à tout moment.",
  },
  {
    question: "Quelles zones géographiques couvrez-vous ?",
    answer:
      "Nous accompagnons des clients partout en France. Notre équipe est basée à Nice (06), avec des rendez-vous possibles en visio ou sur place selon votre localisation.",
  },
];

export const contactStepOneOptions: ContactStepOneOption[] = [
  { id: "reseaux", label: "Réseaux sociaux", description: "Planning automatique et gestion de comptes" },
  { id: "site", label: "Site internet", description: "Création ou optimisation" },
  { id: "prospection", label: "Prospection", description: "Génération de contacts qualifiés" },
  { id: "tout", label: "Tout", description: "Une stratégie complète et synchronisée" },
];

export const contactSection = {
  title: "Parlons de votre projet.",
  description:
    "Trois étapes, deux minutes. On revient vers vous sous 24h ouvrées avec une première proposition.",
};

export const footerContent = {
  baseline: "L'agence qui synchronise votre croissance.",
  sitemapTitle: "Plan du site",
  legalTitle: "Informations",
  copyright: `© 2026 ${siteConfig.name}. Tous droits réservés.`,
};

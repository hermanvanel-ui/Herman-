export interface NavLink {
  label: string;
  href: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface ServiceBullet {
  text: string;
}

export interface ServiceBlock {
  id: string;
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
  visual: "prospection" | "lighthouse" | "planning";
}

export interface MethodStep {
  number: string;
  title: string;
  description: string;
}

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
  group: "clientele" | "developpement";
}

export interface PricingFeature {
  label: string;
  essentiel: string;
  croissance: string;
  performance: string;
}

export interface PricingTier {
  id: "essentiel" | "croissance" | "performance";
  name: string;
  tagline: string;
  priceMonthly: number;
  highlighted: boolean;
}

export interface QuoteLine {
  label: string;
  qty: number;
  unitPrice: number;
}

export interface QuoteExample {
  id: string;
  reference: string;
  date: string;
  clientLabel: string;
  clientType: string;
  lines: QuoteLine[];
}

export interface Testimonial {
  name: string;
  activity: string;
  city: string;
  quote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContactStepOneOption {
  id: string;
  label: string;
  description: string;
}

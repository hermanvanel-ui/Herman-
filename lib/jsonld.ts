import { faqItems, services, siteConfig } from "@/content/site";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneHref,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nice",
      postalCode: "06000",
      addressCountry: "FR",
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    image: `${siteConfig.url}/icon.svg`,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneHref,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nice",
      postalCode: "06000",
      addressCountry: "FR",
    },
    areaServed: "FR",
  };
}

export function buildServicesJsonLd() {
  return services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    areaServed: "FR",
  }));
}

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

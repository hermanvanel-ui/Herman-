import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { MethodTimeline } from "@/components/sections/MethodTimeline";
import { TeamSection } from "@/components/sections/TeamSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { QuoteExamples } from "@/components/sections/QuoteExamples";
import { TestimonialsMarquee } from "@/components/sections/TestimonialsMarquee";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { buildFaqJsonLd } from "@/lib/jsonld";

export default function HomePage() {
  const faqJsonLd = buildFaqJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <StatsBar />
      <ServicesSection />
      <MethodTimeline />
      <TeamSection />
      <PricingSection />
      <QuoteExamples />
      <TestimonialsMarquee />
      <FaqSection />
      <ContactSection />
    </>
  );
}

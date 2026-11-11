import type { Metadata } from "next";
import { qualityContent } from "@/data/quality";
import PageHero from "@/components/sections/PageHero";
import QualityApproach from "@/components/sections/QualityApproach";
import QualityCards from "@/components/sections/QualityCards";
import DocumentShowcase from "@/components/sections/DocumentShowcase";
import PageCTA from "@/components/sections/PageCTA";

export const metadata: Metadata = {
  title: "Quality & Standards - Nutraverse",
  description:
    "Explore the product information and documentation available for review during your enquiry. Demonstration content pending client approval.",
  // Demo copy: keep out of search indexes until the client approves the content.
  robots: { index: false, follow: true },
};

export default function QualityPage() {
  const { hero, cta } = qualityContent;
  return (
    <main className="text-cream">
      <PageHero id="quality-heading" eyebrow={hero.eyebrow} heading={hero.heading} intro={hero.intro} />
      <QualityApproach />
      <QualityCards />
      <DocumentShowcase />
      <PageCTA
        id="quality-cta-heading"
        heading={cta.heading}
        description={cta.description}
        label={cta.label}
        href={cta.href}
      />
    </main>
  );
}

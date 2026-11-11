import type { Metadata } from "next";
import { aboutContent } from "@/data/company";
import PageHero from "@/components/sections/PageHero";
import AboutIntro from "@/components/sections/AboutIntro";
import PrincipleCards from "@/components/sections/PrincipleCards";
import ImmersiveStory from "@/components/sections/ImmersiveStory";
import CompanyFacts from "@/components/sections/CompanyFacts";
import PageCTA from "@/components/sections/PageCTA";

export const metadata: Metadata = {
  title: "About - Nutraverse",
  description:
    "Discover Nutraverse's approach to nutrition products and international business partnerships. Demonstration content pending client approval.",
  // Demo copy: keep out of search indexes until the client approves the content.
  robots: { index: false, follow: true },
};

export default function AboutPage() {
  const { hero, cta } = aboutContent;
  return (
    <main className="text-cream">
      <PageHero id="about-heading" eyebrow={hero.eyebrow} heading={hero.heading} intro={hero.intro} media={hero.image} />
      <AboutIntro />
      <PrincipleCards />
      <ImmersiveStory />
      <CompanyFacts />
      <PageCTA id="about-cta-heading" heading={cta.heading} label={cta.label} href={cta.href} />
    </main>
  );
}

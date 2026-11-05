import Hero from "@/components/sections/Hero";
import ProductShowcase from "@/components/sections/ProductShowcase";
import BrandStory from "@/components/sections/BrandStory";
import GlobalExport from "@/components/sections/GlobalExport";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductShowcase />
      <BrandStory />
      <GlobalExport />
      <ContactSection />
    </main>
  );
}

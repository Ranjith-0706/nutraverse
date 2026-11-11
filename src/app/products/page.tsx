import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsHero from "@/components/sections/ProductsHero";
import ProductCatalogue from "@/components/sections/ProductCatalogue";

export const metadata: Metadata = {
  title: "Products - Nutraverse",
  description:
    "Browse Nutraverse product categories for international distribution and supply partnerships. Demo content; specifications on enquiry.",
  // Sample catalogue: keep out of search indexes until real products are approved.
  robots: { index: false, follow: true },
};

export default function ProductsPage() {
  return (
    <main className="text-cream">
      <ProductsHero />
      <Suspense fallback={<div className="min-h-[40vh]" aria-hidden="true" />}>
        <ProductCatalogue />
      </Suspense>
    </main>
  );
}

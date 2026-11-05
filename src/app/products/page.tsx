import type { Metadata } from "next";
import ProductCard from "@/components/sections/ProductCard";
import { productCategories } from "@/data/products";

export const metadata: Metadata = {
  title: "Products - Nutraverse",
  description: "Sample product categories.",
};

export default function ProductsPage() {
  return (
    <main className="mx-auto w-full max-w-[90rem] px-5 pb-24 pt-28 md:px-12 md:pb-40 md:pt-40">
      <p className="mb-6 inline-flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] text-lime md:text-sm">
        <span className="h-px w-10 bg-lime md:w-12" />
        All products
      </p>
      <h1 className="font-display text-(length:--text-h1) font-semibold leading-[1.02] tracking-tight">
        Product categories
      </h1>
      <p className="mt-6 max-w-md text-cream/75">
        Sample categories. Replace with the approved product range.
      </p>

      <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
        {productCategories.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, calc(100vw - 40px)"
          />
        ))}
      </div>
    </main>
  );
}

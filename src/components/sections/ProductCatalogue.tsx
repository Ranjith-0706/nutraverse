"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { productCategories } from "@/data/products";
import { catalogueContent, getProductCategory, products } from "@/data/catalogue";
import ProductCard, { type ProductCardData } from "./ProductCard";
import ProductFilter from "./ProductFilter";

const ALL = "all";
const options = [
  { id: ALL, label: "All Products" },
  ...productCategories.map((c) => ({ id: c.slug, label: c.name })),
];

export default function ProductCatalogue() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const grid = useRef<HTMLDivElement>(null);

  const requested = params.get("category");
  const active = options.some((o) => o.id === requested) ? (requested as string) : ALL;

  const visible = useMemo(
    () =>
      products.filter((p) => active === ALL || p.categoryId === active),
    [active],
  );

  const select = (id: string) =>
    router.replace(id === ALL ? pathname : `${pathname}?category=${id}`, { scroll: false });

  // Re-run the reveal whenever the filter changes (cleanup restores the DOM first).
  useEffect(() => {
    const mm = gsap.matchMedia(grid);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-product-card]",
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: grid.current, start: "top 88%", toggleActions: "play none none none" },
        },
      );
    });
    return () => mm.revert();
  }, [active]);

  return (
    <section aria-label="Product catalogue" className="mx-auto w-full min-w-0 max-w-[90rem] px-5 pb-24 md:px-12 md:pb-40">
      <ProductFilter options={options} active={active} onChange={select} />
      <p aria-live="polite" className="mt-6 text-sm text-cream/60">
        Showing {visible.length} {visible.length === 1 ? "product" : "products"}.{" "}
        {catalogueContent.demoNote}
      </p>

      <div ref={grid} className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => {
          const cat = getProductCategory(p);
          const data: ProductCardData = {
            id: p.id,
            href: `/products/${p.slug}`,
            index: String(i + 1).padStart(2, "0"),
            name: p.productName,
            description: p.shortDescription,
            image: p.gallery[0].src,
            alt: p.gallery[0].alt,
            imagePosition: p.gallery[0].position,
            tone: p.tone,
            tag: `${cat?.name ?? "Product"} · Demo`,
          };
          return (
            <ProductCard
              key={p.id}
              product={data}
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, calc(100vw - 40px)"
            />
          );
        })}
      </div>
    </section>
  );
}

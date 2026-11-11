"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { PENDING_TEXT, statusLabel, type Product } from "@/data/catalogue";
import type { ProductCategory } from "@/data/products";
import MaskedHeading from "./MaskedHeading";
import ProductGallery from "./ProductGallery";

/** Specification rows. A row shows its value only when the client supplied one. */
function specRows(p: Product) {
  const join = (v?: readonly string[]) => (v && v.length ? v.join(", ") : undefined);
  return [
    { label: "Ingredients", value: join(p.ingredients) },
    { label: "Packaging options", value: join(p.packaging) },
    { label: "Minimum order quantity", value: p.moq },
    { label: "Shelf life", value: p.shelfLife },
    { label: "Storage", value: p.storage },
    { label: "Certifications", value: join(p.certifications) },
  ];
}

export default function ProductDetail({
  product,
  category,
  enquiryHref,
}: {
  product: Product;
  category?: ProductCategory;
  enquiryHref: string;
}) {
  const root = useRef<HTMLElement>(null);
  const words = product.productName.split(" ").map((text) => ({ text }));
  const rows = specRows(product);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-mh-word]",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, stagger: 0.07, ease: "power4.out", delay: 0.1 },
      );
      gsap.fromTo(
        "[data-pd-fade]",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.2 },
      );
      gsap.fromTo(
        "[data-pd-gallery]",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" },
      );
      gsap.fromTo(
        "[data-pd-reveal]",
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-pd-reveal]", start: "top 88%", toggleActions: "play none none none" },
        },
      );
    });
    // Gentle image parallax on large screens only.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-pd-par]",
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: "[data-pd-gallery]", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="product-heading"
      className="mx-auto w-full min-w-0 max-w-[90rem] px-5 pb-20 pt-28 md:px-12 md:pb-32 md:pt-40"
    >
      <Link
        data-pd-fade
        href="/products"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-cream/75 transition-colors hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to all products
      </Link>

      <div className="mt-6 grid gap-10 md:mt-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.gallery} tone={product.tone} />

        <div className="min-w-0 lg:pt-6">
          <p data-pd-fade className="text-xs font-medium uppercase tracking-[0.22em] text-lime md:text-sm">
            {category?.name ?? "Product"}
          </p>
          <MaskedHeading
            as="h1"
            id="product-heading"
            words={words}
            className="mt-4 font-display text-[clamp(2.25rem,1rem+5.5vw,6rem)] font-semibold leading-[1.02] tracking-tight"
          />
          <p data-pd-fade className="mt-6 max-w-lg text-base leading-relaxed text-cream/75 md:text-lg">
            {product.shortDescription}
          </p>
          <p
            data-pd-fade
            className="mt-6 inline-block rounded-full border border-cream/30 px-3 py-1 text-xs font-medium uppercase tracking-widest text-cream/70"
          >
            {statusLabel[product.status]}
          </p>

          <div data-pd-fade className="mt-8">
            <Link
              href={enquiryHref}
              className="group inline-flex min-h-14 w-full items-center justify-between gap-4 rounded-full bg-lime py-2 pl-7 pr-2 text-base font-semibold text-forest transition-colors duration-300 hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime sm:w-auto sm:justify-start md:text-lg"
            >
              Enquire About This Product
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-full bg-forest text-lime transition-transform duration-500 ease-out group-hover:rotate-45"
              >
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview + specifications */}
      <div className="mt-16 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-16">
        <div data-pd-reveal className="lg:col-span-5">
          <h2 className="font-display text-(length:--text-h3) font-semibold tracking-tight">Overview</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-cream/75">{product.detailedDescription}</p>
          {product.status !== "verified" && (
            <p className="mt-6 max-w-md rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm leading-relaxed text-cream/85">
              Specifications for this product are not confirmed yet. Nothing below is a claim about the final product.
            </p>
          )}
        </div>

        <div data-pd-reveal className="min-w-0 lg:col-span-7">
          <h2 className="font-display text-(length:--text-h3) font-semibold tracking-tight">Specifications</h2>
          <dl className="mt-4 divide-y divide-cream/15 border-y border-cream/15">
            {rows.map((r) => (
              <div key={r.label} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
                <dt className="text-sm font-medium uppercase tracking-[0.14em] text-cream/55">{r.label}</dt>
                <dd className={`sm:col-span-2 ${r.value ? "text-cream" : "text-cream/50"}`}>
                  {r.value ?? PENDING_TEXT}
                </dd>
              </div>
            ))}
          </dl>

          {product.nutritionFacts && product.nutritionFacts.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display text-xl font-semibold">Nutrition facts</h3>
              <dl className="mt-3 divide-y divide-cream/15 border-y border-cream/15">
                {product.nutritionFacts.map((n) => (
                  <div key={n.label} className="flex justify-between gap-6 py-3">
                    <dt className="text-cream/75">{n.label}</dt>
                    <dd>{n.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

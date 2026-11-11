"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { productCategories, showcaseContent } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductShowcase() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scoped to this section; everything created here is reverted on cleanup.
    const mm = gsap.matchMedia(root);

    const reveal = (ctaStart: string) => {
      const trigger = (el: string, start = "top 85%") => ({
        trigger: el,
        start,
        toggleActions: "play none none none" as const,
      });

      gsap.fromTo(
        "[data-sc-eyebrow]",
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: trigger("[data-sc-eyebrow]"),
        },
      );
      gsap.fromTo(
        "[data-sc-word]",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.06,
          ease: "power4.out",
          scrollTrigger: trigger("[data-sc-heading]", "top 80%"),
        },
      );
      gsap.fromTo(
        "[data-sc-intro]",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: trigger("[data-sc-intro]"),
        },
      );
      gsap.fromTo(
        "[data-sc-cta]",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: trigger("[data-sc-cta]", ctaStart),
        },
      );
    };

    // Desktop: larger movement + gentle image parallax.
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        reveal("top 92%");

        gsap.utils.toArray<HTMLElement>("[data-product-card]").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 90, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            },
          );

          const img = card.querySelector("[data-card-img]");
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -4 },
              {
                yPercent: 4,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }
        });
      },
    );

    // Mobile: fade-up only. No pinning, no parallax, small distances.
    mm.add(
      "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
      () => {
        reveal("top 95%");

        gsap.utils.toArray<HTMLElement>("[data-product-card]").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 32, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            },
          );
        });
      },
    );

    return () => mm.revert();
  }, []);

  const { eyebrow, heading, intro, cta } = showcaseContent;

  return (
    <section
      ref={root}
      id="products"
      aria-labelledby="showcase-heading"
      className="relative bg-forest px-5 py-24 text-cream md:px-12 md:py-40"
    >
      <div className="mx-auto w-full max-w-[90rem]">
        {/* Header */}
        <p
          data-sc-eyebrow
          className="mb-6 inline-flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] text-lime md:mb-8 md:text-sm"
        >
          <span className="h-px w-10 bg-lime md:w-12" />
          {eyebrow}
        </p>

        <div className="grid gap-8 md:grid-cols-12 md:gap-y-10">
          <h2
            id="showcase-heading"
            data-sc-heading
            aria-label={heading}
            className="font-display text-[clamp(2.5rem,1rem+7.5vw,9rem)] font-semibold leading-[1.02] tracking-tight md:col-span-11"
          >
            {heading.split(" ").map((word, i) => (
              <span
                key={`${word}-${i}`}
                aria-hidden="true"
                className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <span data-sc-word className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <p
            data-sc-intro
            className="max-w-md text-base leading-relaxed text-cream/75 md:col-span-4 md:col-start-8 md:text-lg"
          >
            {intro}
          </p>
        </div>

        {/* Cards: single column on mobile, alternating editorial layout on desktop */}
        <div className="mt-14 flex flex-col gap-6 md:mt-28 md:gap-12">
          {productCategories.map((product, i) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                href: `/products?category=${product.slug}`,
                index: product.index,
                name: product.name,
                description: product.description,
                image: product.image,
                alt: product.alt,
                tone: product.tone,
                tag: "Sample category",
              }}
              align={i % 2 === 0 ? "start" : "end"}
            />
          ))}
        </div>

        {/* Final CTA */}
        <div
          data-sc-cta
          className="mt-16 flex flex-col items-start gap-6 border-t border-cream/15 pt-10 md:mt-28 md:flex-row md:items-center md:justify-between md:pt-14"
        >
          <p className="max-w-sm text-cream/60">
            Sample categories shown. Full range coming soon.
          </p>
          <Link
            href={cta.href}
            className="group inline-flex min-h-14 w-full items-center justify-between gap-6 whitespace-nowrap rounded-full bg-cream py-2 pl-8 pr-2 text-lg font-medium text-forest transition-colors duration-300 hover:bg-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime sm:w-auto md:text-xl"
          >
            {cta.label}
            <span
              aria-hidden="true"
              className="grid size-12 place-items-center rounded-full bg-forest text-lime transition-transform duration-500 ease-out group-hover:scale-110"
            >
              <ArrowUpRight className="size-5 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { productsContent } from "@/data/products";

export default function Products() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop + motion allowed: pinned horizontal scroll.
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);

        const scrollTween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-products-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.fromTo(
          "[data-products-progress]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-products-pin]",
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        // Image drift inside each card, tied to the horizontal scroll.
        gsap.utils.toArray<HTMLElement>("[data-product-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest("[data-product-card]"),
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        gsap.from("[data-products-head] > *", {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
      },
    );

    // Mobile + motion allowed: simple reveal on scroll.
    mm.add(
      "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.from("[data-products-head] > *", {
          y: 30,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        });
        gsap.utils.toArray<HTMLElement>("[data-product-card]").forEach((card) => {
          gsap.from(card, {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });
      },
    );

    return () => mm.revert();
  }, []);

  const { eyebrow, heading, intro, items } = productsContent;

  return (
    <section
      ref={root}
      id="products"
      aria-labelledby="products-heading"
      className="relative bg-forest text-cream"
    >
      <div
        data-products-pin
        className="flex flex-col justify-center gap-10 overflow-hidden py-20 md:h-svh md:gap-8 md:py-0"
      >
        <div
          data-products-head
          className="flex flex-col gap-4 px-6 md:flex-row md:items-end md:justify-between md:px-12"
        >
          <div>
            <p className="mb-4 inline-flex items-center gap-4 text-sm font-medium uppercase tracking-[0.22em] text-lime">
              <span className="h-px w-12 bg-lime" />
              {eyebrow}
            </p>
            <h2
              id="products-heading"
              className="font-display text-(length:--text-h2) font-semibold leading-none tracking-tight"
            >
              {heading}
            </h2>
          </div>
          <p className="max-w-sm text-cream/70">{intro}</p>
        </div>

        <div
          ref={track}
          className="flex flex-col gap-6 px-6 will-change-transform md:w-max md:flex-row md:gap-8 md:px-12"
        >
          {items.map((item, i) => (
            <article
              key={item.id}
              data-product-card
              className="group relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-[2rem] border border-cream/10 bg-forest md:h-[58svh] md:w-auto"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div
                  data-product-img
                  className="absolute -inset-x-[8%] inset-y-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 50vh, 90vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/10 to-transparent" />

              <span className="absolute left-6 top-6 font-display text-sm tracking-widest text-lime">
                {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <span className="absolute right-6 top-6 rounded-full bg-coral px-3 py-1 text-xs font-medium text-forest">
                {item.tag}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h3 className="font-display text-(length:--text-h3) font-semibold leading-tight">
                  {item.name}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-cream/75">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="mx-6 hidden h-px bg-cream/15 md:mx-12 md:block"
        >
          <div
            data-products-progress
            className="h-full origin-left bg-lime"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { catalogueContent } from "@/data/catalogue";
import MaskedHeading from "./MaskedHeading";

const words = catalogueContent.heading.split(" ").map((text, i, a) => ({
  text,
  accent: i === a.length - 1 ? ("lime" as const) : undefined,
}));

export default function ProductsHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-ph-fade]",
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.1 },
      );
      gsap.fromTo(
        "[data-mh-word]",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, stagger: 0.07, ease: "power4.out", delay: 0.15 },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="catalogue-heading"
      className="relative overflow-hidden px-5 pb-12 pt-32 md:px-12 md:pb-20 md:pt-48"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-1/4 top-0 size-[28rem] rounded-full bg-lime/10 blur-3xl md:size-[44rem]"
      />
      <div className="relative mx-auto w-full min-w-0 max-w-[90rem]">
        <p
          data-ph-fade
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-lime/40 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-lime md:text-sm"
        >
          <span className="size-2 rounded-full bg-lime" />
          {catalogueContent.eyebrow}
        </p>
        <MaskedHeading
          id="catalogue-heading"
          words={words}
          className="max-w-[14ch] font-display text-[clamp(2.5rem,1rem+8vw,8.5rem)] font-semibold leading-[1.02] tracking-tight text-cream md:max-w-[16ch]"
        />
        <p data-ph-fade className="mt-8 max-w-lg text-base leading-relaxed text-cream/75 md:mt-12 md:text-lg">
          {catalogueContent.intro}
        </p>
      </div>
    </section>
  );
}

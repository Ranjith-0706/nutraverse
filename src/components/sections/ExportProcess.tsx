"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { processContent, processSteps } from "@/data/globalExport";

export default function ExportProcess() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-ep-head]",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-ep-head]", start: "top 85%", toggleActions: "play none none none" },
        },
      );
    });

    // Desktop: horizontal timeline, staggered reveal + progress bars filling on scroll.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-ep-step]",
        { y: 70, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: "[data-ep-list]", start: "top 80%", toggleActions: "play none none none" },
        },
      );
      gsap.fromTo(
        "[data-ep-bar]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          stagger: 0.25,
          scrollTrigger: { trigger: "[data-ep-list]", start: "top 70%", end: "bottom 55%", scrub: true },
        },
      );
    });

    // Mobile: stacked, simple fade + small translate per step.
    mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-ep-step]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="process-heading"
      className="mx-auto w-full max-w-[90rem] px-5 py-20 md:px-12 md:py-36"
    >
      <p
        data-ep-head
        className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-lime md:text-sm"
      >
        {processContent.eyebrow}
      </p>
      <h2
        id="process-heading"
        data-ep-head
        className="max-w-4xl font-display text-(length:--text-h1) font-semibold leading-[1.02] tracking-tight text-cream"
      >
        {processContent.heading}
      </h2>

      <ol
        data-ep-list
        className="mt-14 grid gap-5 md:mt-24 md:grid-cols-4 md:gap-6"
      >
        {processSteps.map((s) => (
          <li
            key={s.id}
            data-ep-step
            className="relative flex flex-col rounded-[1.75rem] border border-cream/15 bg-cream/[0.04] p-6 md:min-h-[22rem] md:p-7"
          >
            {/* Desktop timeline progress */}
            <span
              aria-hidden="true"
              data-ep-bar
              className="absolute inset-x-6 top-0 hidden h-0.5 origin-left bg-lime md:block"
            />
            <span
              aria-hidden="true"
              className="font-display text-[clamp(3.5rem,6vw,6rem)] font-semibold leading-[0.85] tracking-tight text-lime"
            >
              {s.index}
            </span>
            <h3 className="mt-8 font-display text-2xl font-semibold leading-tight tracking-tight text-cream md:mt-auto md:text-[1.75rem]">
              {s.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-cream/70">
              {s.description}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-cream/60">
        {processContent.disclaimer}
      </p>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { globalIntro } from "@/data/globalExport";
import MaskedHeading from "./MaskedHeading";

export default function GlobalIntro() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-gi-eyebrow], [data-gi-desc]",
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 75%", toggleActions: "play none none none" },
        },
      );
      gsap.fromTo(
        "[data-mh-word]",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-mh]", start: "top 80%", toggleActions: "play none none none" },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={root}
      className="mx-auto w-full max-w-[90rem] px-5 pb-16 pt-28 md:px-12 md:pb-24 md:pt-44"
    >
      <p
        data-gi-eyebrow
        className="mb-8 inline-flex items-center gap-3 rounded-full border border-lime/40 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-lime md:mb-10 md:text-sm"
      >
        <span className="size-2 rounded-full bg-lime" />
        {globalIntro.eyebrow}
      </p>
      <MaskedHeading
        id="global-heading"
        words={globalIntro.heading}
        className="font-display text-[clamp(2.75rem,1rem+8.5vw,9.5rem)] font-semibold leading-[1.02] tracking-tight text-cream"
      />
      <p
        data-gi-desc
        className="mt-10 max-w-md text-base leading-relaxed text-cream/75 md:ml-auto md:mt-14 md:mr-[8%] md:text-lg"
      >
        {globalIntro.description}
      </p>
    </div>
  );
}

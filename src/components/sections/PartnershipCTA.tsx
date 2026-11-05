"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { partnershipCta } from "@/data/globalExport";
import MaskedHeading from "./MaskedHeading";

const words = partnershipCta.heading.split(" ").map((text, i, a) => ({
  text,
  accent: i === a.length - 1 ? ("lime" as const) : undefined,
}));

export default function PartnershipCTA() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-mh-word]",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-mh]", start: "top 80%", toggleActions: "play none none none" },
        },
      );
      gsap.fromTo(
        "[data-cta-fade]",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-cta-fade]", start: "top 88%", toggleActions: "play none none none" },
        },
      );
    });
    // Slow glow drift on desktop only.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-cta-glow]",
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);


  return (
    <section
      ref={root}
      id="export-cta"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden px-5 pb-28 pt-20 md:px-12 md:pb-40 md:pt-32"
    >
      <div
        aria-hidden="true"
        data-cta-glow
        className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/10 blur-3xl md:size-[56rem]"
      />
      <div className="relative mx-auto w-full max-w-[90rem]">
        <MaskedHeading
          id="cta-heading"
          words={words}
          className="font-display text-[clamp(3rem,1rem+9vw,10.5rem)] font-semibold leading-[1] tracking-tight text-cream"
        />
        <p
          data-cta-fade
          className="mt-8 max-w-md text-base leading-relaxed text-cream/75 md:mt-12 md:text-lg"
        >
          {partnershipCta.description}
        </p>
        <div data-cta-fade className="mt-10 flex flex-col items-start gap-4">
          <a
            href="#enquiry"
            className="group inline-flex min-h-14 items-center gap-4 rounded-full bg-lime py-2 pl-7 pr-2 text-base font-semibold text-forest transition-colors duration-300 hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime md:text-lg"
          >
            {partnershipCta.button}
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-full bg-forest text-lime transition-transform duration-500 ease-out group-hover:rotate-45"
            >
              <ArrowUpRight className="size-5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

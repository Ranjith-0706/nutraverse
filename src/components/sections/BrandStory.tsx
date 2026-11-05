"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { brandStoryContent, storyCards } from "@/data/brandStory";
import type { HeadingWord } from "@/data/brandStory";
import StoryImageReveal from "./StoryImageReveal";
import StoryCards from "./StoryCards";

const accentClass: Record<NonNullable<HeadingWord["accent"]>, string> = {
  // Forest text on lime / on cream keeps strong contrast.
  highlight: "rounded-[0.18em] bg-lime px-[0.14em]",
  underline:
    "underline decoration-coral decoration-[0.07em] underline-offset-[0.1em]",
};

export default function BrandStory() {
  const root = useRef<HTMLElement>(null);

  // Header contrast: flip the fixed header to dark text while this cream section
  // is beneath it. State only (no motion), so it also runs with reduced motion.
  useEffect(() => {
    const html = document.documentElement;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top 40px",
      // The dark global section overlaps the cream bottom, so flip the header when its top (not the cream bottom) reaches the bar.
      end: () => `bottom ${40 + (window.innerWidth >= 768 ? 80 : 40)}px`,
      onToggle: (self) => {
        if (self.isActive) html.dataset.headerTone = "light";
        else delete html.dataset.headerTone;
      },
    });
    return () => {
      st.kill();
      delete html.dataset.headerTone;
    };
  }, []);

  useEffect(() => {
    // Scoped to this section; everything is reverted on cleanup.
    const mm = gsap.matchMedia(root);

    const fadeUp = (
      target: string,
      distance: number,
      opts: { stagger?: number; start?: string } = {},
    ) => {
      gsap.fromTo(
        target,
        { y: distance, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: opts.stagger ?? 0,
          scrollTrigger: {
            trigger: target,
            start: opts.start ?? "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    };

    const introText = (distance: number) => {
      fadeUp("[data-bs-eyebrow]", distance * 0.6);
      gsap.fromTo(
        "[data-bs-word]",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-bs-heading]",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
      fadeUp("[data-bs-desc]", distance);
    };

    // Desktop: scroll-linked image reveal (no pinning) + parallax + staggered cards.
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        introText(24);

        const reveal = {
          trigger: "[data-bs-image]",
          start: "top 90%",
          end: "top 10%",
          scrub: true,
        };
        // Starts as a smaller centred frame, expands to the full container.
        gsap.fromTo(
          "[data-bs-frame]",
          { clipPath: "inset(10% 24% 10% 24% round 48px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 32px)",
            ease: "none",
            scrollTrigger: reveal,
          },
        );
        gsap.fromTo(
          "[data-bs-img]",
          { scale: 1.3 },
          { scale: 1, ease: "none", scrollTrigger: reveal },
        );
        gsap.fromTo(
          "[data-bs-par]",
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-bs-image]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-bs-card]").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 80, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            },
          );
        });
      },
    );

    // Mobile: simple fade + small translate only. No scale/clip, no scrub, no pin.
    mm.add(
      "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
      () => {
        introText(18);
        fadeUp("[data-bs-image]", 24, { start: "top 92%" });
        gsap.utils.toArray<HTMLElement>("[data-bs-card]").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 24, autoAlpha: 0 },
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

  const { eyebrow, heading, description, image } = brandStoryContent;
  const headingText = heading.map((w) => w.text).join(" ");

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="brand-story-heading"
      // Overlaps the bottom of the dark showcase with rounded cream "sheet" corners
      // for a controlled dark-to-cream transition (pure CSS, no scroll listeners).
      className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-cream pb-24 pt-20 text-forest md:-mt-20 md:rounded-t-[4rem] md:pb-40 md:pt-36"
    >
      {/* 1. Editorial intro */}
      <div className="mx-auto w-full max-w-[90rem] px-5 md:px-12">
        <p
          data-bs-eyebrow
          className="mb-8 inline-flex items-center gap-3 rounded-full bg-forest px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-lime md:mb-10 md:text-sm"
        >
          <span className="size-2 rounded-full bg-lime" />
          {eyebrow}
        </p>

        <div className="grid gap-10 md:grid-cols-12 md:gap-y-14">
          <h2
            id="brand-story-heading"
            data-bs-heading
            aria-label={headingText}
            className="font-display text-[clamp(2.75rem,1rem+8.5vw,10rem)] font-semibold leading-[1.02] tracking-tight md:col-span-12"
          >
            {heading.map((w, i) => (
              <span
                key={`${w.text}-${i}`}
                aria-hidden="true"
                className="mr-[0.22em] inline-block overflow-hidden pb-[0.2em] align-bottom"
              >
                <span
                  data-bs-word
                  className={`inline-block ${w.accent ? accentClass[w.accent] : ""}`}
                >
                  {w.text}
                </span>
              </span>
            ))}
          </h2>

          <p
            data-bs-desc
            className="max-w-md text-base leading-relaxed text-forest/80 md:col-span-4 md:col-start-8 md:text-lg"
          >
            {description}
          </p>
        </div>
      </div>

      {/* 2. Cinematic image reveal (full width of the section, never overlaps neighbours) */}
      <div className="mt-16 md:mt-32">
        <StoryImageReveal src={image.src} alt={image.alt} />
      </div>

      {/* 3. Story cards */}
      <div className="mx-auto mt-16 w-full max-w-[90rem] px-5 md:mt-32 md:px-12">
        <StoryCards cards={storyCards} />
      </div>
    </section>
  );
}

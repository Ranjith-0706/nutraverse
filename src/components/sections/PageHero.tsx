"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import type { HeadingWord } from "@/data/company";
import Eyebrow from "./Eyebrow";
import MaskedHeading from "./MaskedHeading";

interface HeroMedia {
  src: string;
  alt: string;
  caption: string;
}

/** Editorial page hero. Optional media makes the composition asymmetric. */
export default function PageHero({
  id,
  eyebrow,
  heading,
  intro,
  media,
}: {
  id: string;
  eyebrow: string;
  heading: readonly HeadingWord[];
  intro: string;
  media?: HeroMedia;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-pg-fade]",
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.1 },
      );
      gsap.fromTo(
        "[data-mh-word]",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, stagger: 0.07, ease: "power4.out", delay: 0.15 },
      );
      gsap.fromTo(
        "[data-pg-media]",
        { y: 40, autoAlpha: 0, scale: 0.97 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.35 },
      );
    });
    // Gentle image parallax on large screens only.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-pg-par]",
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: "[data-pg-media]", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby={id}
      className="relative overflow-hidden px-5 pb-16 pt-32 md:px-12 md:pb-28 md:pt-48"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-1/4 top-0 size-[28rem] rounded-full bg-lime/10 blur-3xl md:size-[44rem]"
      />
      <div className="relative mx-auto grid w-full min-w-0 max-w-[90rem] gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className={`min-w-0 ${media ? "lg:col-span-7" : "lg:col-span-10"}`}>
          <Eyebrow data-pg-fade className="mb-8">
            {eyebrow}
          </Eyebrow>
          <MaskedHeading
            as="h1"
            id={id}
            words={heading}
            className="font-display text-[clamp(2.25rem,0.6rem+8.2vw,8.5rem)] font-semibold leading-[1.02] tracking-tight text-cream"
          />
          <p data-pg-fade className="mt-8 max-w-lg text-base leading-relaxed text-cream/75 md:mt-12 md:text-lg">
            {intro}
          </p>
        </div>

        {media && (
          <figure data-pg-media className="min-w-0 lg:col-span-5 lg:mb-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-forest md:aspect-[16/10] lg:aspect-[4/5] lg:rounded-[2rem]">
              <div data-pg-par className="absolute inset-x-0 -inset-y-[6%]">
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, calc(100vw - 40px)"
                  className="object-cover"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent"
              />
            </div>
            <figcaption className="mt-3 text-xs text-cream/55">{media.caption}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { aboutContent } from "@/data/company";
import { useHeaderTone } from "@/lib/useHeaderTone";
import MaskedHeading from "./MaskedHeading";

/**
 * Immersive image reveal. Large screens: scroll-linked clip + scale (no pinning,
 * no scroll lock). Small screens and reduced motion: a plain, fully visible image.
 */
export default function ImmersiveStory() {
  const root = useRef<HTMLElement>(null);
  const figure = useRef<HTMLElement>(null);
  // Bright imagery under the transparent header: switch to the light bar for legibility.
  useHeaderTone(figure);
  const { heading, image } = aboutContent.story;

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-mh-word]",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-is-heading]", start: "top 85%", toggleActions: "play none none none" },
        },
      );
    });
    mm.add("(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-is-figure]",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-is-figure]", start: "top 92%", toggleActions: "play none none none" },
        },
      );
    });
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const reveal = { trigger: "[data-is-figure]", start: "top 90%", end: "top 15%", scrub: true };
      gsap.fromTo(
        "[data-is-frame]",
        { clipPath: "inset(12% 22% 12% 22% round 48px)" },
        { clipPath: "inset(0% 0% 0% 0% round 32px)", ease: "none", scrollTrigger: reveal },
      );
      gsap.fromTo("[data-is-img]", { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: reveal });
      gsap.fromTo(
        "[data-is-par]",
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: "[data-is-figure]", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="story-heading" className="pb-20 md:pb-32">
      <div className="mx-auto w-full min-w-0 max-w-[90rem] px-5 md:px-12">
        <div data-is-heading>
          <MaskedHeading
            id="story-heading"
            words={heading}
            className="max-w-[16ch] font-display text-(length:--text-h1) font-semibold leading-[1.04] tracking-tight text-cream"
          />
        </div>
      </div>
      <figure ref={figure} data-is-figure className="mx-5 mt-10 md:mx-6 md:mt-16">
        <div
          data-is-frame
          className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-forest md:aspect-[16/9] lg:aspect-auto lg:h-[80svh] lg:rounded-[2rem]"
        >
          <div data-is-par className="absolute inset-x-0 -inset-y-[6%] will-change-transform lg:-inset-y-[10%]">
            <div data-is-img className="absolute inset-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) calc(100vw - 48px), calc(100vw - 40px)"
                className="object-cover object-[70%_25%] lg:object-[50%_22%]"
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent"
          />
        </div>
        <figcaption className="mx-auto mt-3 max-w-[90rem] px-0 text-xs text-cream/55 md:px-6">{image.caption}</figcaption>
      </figure>
    </section>
  );
}

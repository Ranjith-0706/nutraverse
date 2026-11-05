"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { heroContent } from "@/data/hero";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      video.current?.pause();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        "[data-hero-bg]",
        { scale: 1.15 },
        { scale: 1, duration: 2.2, ease: "power3.out" },
        0,
      )
        .fromTo(
          "[data-hero-eyebrow]",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9 },
          0.3,
        )
        .fromTo(
          "[data-hero-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 1.2, stagger: 0.08 },
          0.4,
        )
        .fromTo(
          "[data-hero-fade]",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, stagger: 0.12 },
          1.0,
        );

      // Gentle parallax as the hero scrolls away.
      gsap.to("[data-hero-bg]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to("[data-hero-content]", {
        yPercent: -10,
        autoAlpha: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const { eyebrow, headline, subline, primaryCta, secondaryCta } = heroContent;

  return (
    <section
      ref={root}
      className="relative flex min-h-svh items-end overflow-hidden bg-forest md:items-center"
    >
      {/* Background media */}
      <div data-hero-bg className="absolute inset-0 will-change-transform">
        <video
          ref={video}
          className="h-full w-full object-cover object-[70%_center]"
          src={heroContent.video}
          poster={heroContent.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>

      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/50 to-transparent md:bg-gradient-to-r md:from-forest md:via-forest/40 md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-forest to-transparent" />

      {/* Content */}
      <div
        data-hero-content
        className="relative z-10 mx-auto w-full max-w-[90rem] px-6 pb-28 pt-32 md:px-12 md:pb-0"
      >
        <p
          data-hero-eyebrow
          className="mb-6 inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-lime"
        >
          <span className="h-px w-10 bg-lime" />
          {eyebrow}
        </p>

        <h1 className="font-display text-(length:--text-h1) font-semibold leading-[0.95] tracking-tight text-cream md:max-w-[12ch] lg:max-w-[14ch]">
          {headline.map((line) => (
            <span key={line} className="block">
              {line.split(" ").map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom"
                >
                  <span data-hero-word className="inline-block">
                    {word}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          data-hero-fade
          className="mt-8 max-w-md text-cream/75"
        >
          {subline}
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={primaryCta.href}
            className="group inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 font-medium text-forest transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            {primaryCta.label}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href={secondaryCta.href}
            className="inline-flex items-center rounded-full border border-cream/30 px-7 py-3.5 font-medium text-cream transition-colors duration-300 hover:border-coral hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
          >
            {secondaryCta.label}
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero-fade
        className="absolute bottom-8 left-6 z-10 hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-cream/60 md:left-12 md:flex"
      >
        <ArrowDown className="size-4 animate-bounce text-lime" />
        Scroll
      </div>
    </section>
  );
}

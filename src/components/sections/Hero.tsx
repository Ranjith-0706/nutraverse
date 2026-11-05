"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { heroContent } from "@/data/hero";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      video.current?.pause();
      setPlaying(false);
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        "[data-hero-media]",
        { clipPath: "inset(16% 28% 16% 28% round 28px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          duration: 1.9,
          ease: "power4.inOut",
        },
        0,
      )
        .fromTo(
          "[data-hero-video]",
          { scale: 1.35 },
          { scale: 1, duration: 2.4, ease: "power3.out" },
          0,
        )
        .fromTo(
          "[data-hero-line]",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, transformOrigin: "left center" },
          1.0,
        )
        .fromTo(
          "[data-hero-char]",
          { yPercent: 115, rotate: 6 },
          { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.018 },
          1.0,
        )
        .fromTo(
          "[data-hero-fade]",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 },
          1.5,
        )
        .fromTo(
          "[data-hero-card]",
          { y: 80, rotate: -5, autoAlpha: 0 },
          { y: 0, rotate: 0, autoAlpha: 1, duration: 1.4 },
          1.7,
        );

      // Scroll-out: media shrinks into a rounded card, text drifts away.
      const st = {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to("[data-hero-media]", {
        clipPath: "inset(6% 5% 6% 5% round 36px)",
        ease: "none",
        scrollTrigger: st,
      });
      gsap.to("[data-hero-content]", {
        yPercent: -12,
        autoAlpha: 0.1,
        ease: "none",
        scrollTrigger: { ...st, end: "bottom 35%" },
      });

      // Pointer parallax (fine pointers only).
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const bgX = gsap.quickTo("[data-hero-parallax]", "x", {
          duration: 1.4,
          ease: "power3",
        });
        const bgY = gsap.quickTo("[data-hero-parallax]", "y", {
          duration: 1.4,
          ease: "power3",
        });
        const cardX = gsap.quickTo("[data-hero-float]", "x", {
          duration: 1.1,
          ease: "power3",
        });
        const cardY = gsap.quickTo("[data-hero-float]", "y", {
          duration: 1.1,
          ease: "power3",
        });

        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          bgX(nx * -30);
          bgY(ny * -20);
          cardX(nx * 40);
          cardY(ny * 28);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      }
    });

    return () => mm.revert();
  }, []);

  const { eyebrow, headline, subline, primaryCta, secondaryCta, featured } =
    heroContent;

  return (
    <section
      ref={root}
      aria-label="Introduction"
      className="relative flex min-h-svh items-end overflow-hidden bg-forest md:items-center"
    >
      {/* Cinematic media */}
      <div
        data-hero-media
        className="grain absolute inset-0 overflow-hidden"
      >
        <div
          data-hero-parallax
          className="absolute -inset-[4%] will-change-transform"
        >
          <video
            ref={video}
            data-hero-video
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

        {/* Legibility + mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-forest/10 md:bg-gradient-to-r md:from-forest md:via-forest/45 md:to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(198,243,107,0.12),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-forest to-transparent" />
      </div>

      {/* Content */}
      <div
        data-hero-content
        className="relative z-10 mx-auto w-full max-w-[90rem] px-6 pb-32 pt-32 md:px-12 md:pb-0"
      >
        <p className="mb-7 inline-flex items-center gap-4 text-sm font-medium uppercase tracking-[0.22em] text-lime">
          <span data-hero-line className="h-px w-12 bg-lime" />
          <span data-hero-fade>{eyebrow}</span>
        </p>

        <h1
          aria-label={headline.join(" ")}
          className="font-display text-(length:--text-display) font-semibold leading-[0.92] tracking-tight text-cream md:max-w-[9ch] lg:max-w-[11ch]"
        >
          {headline.map((line) => (
            <span key={line} aria-hidden="true" className="block">
              {line.split(" ").map((word, wi) => (
                <span
                  key={`${word}-${wi}`}
                  className="mr-[0.22em] inline-block whitespace-nowrap"
                >
                  {word.split("").map((ch, ci) => (
                    <span
                      key={ci}
                      className="inline-block overflow-hidden pb-[0.14em] align-bottom"
                    >
                      <span data-hero-char className="inline-block">
                        {ch}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p data-hero-fade className="mt-9 max-w-md text-cream/75">
          {subline}
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={primaryCta.href}
            className="group inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 font-medium text-forest transition-transform duration-300 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            {primaryCta.label}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href={secondaryCta.href}
            className="inline-flex items-center rounded-full border border-cream/30 px-7 py-3.5 font-medium text-cream transition-colors duration-300 hover:border-coral hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
          >
            {secondaryCta.label}
          </a>
        </div>
      </div>

      {/* Floating product card */}
      <div
        data-hero-float
        className="absolute bottom-24 right-6 z-10 hidden will-change-transform md:right-12 md:block lg:bottom-16"
      >
        <div
          data-hero-card
          className="w-48 rotate-0 overflow-hidden rounded-3xl border border-cream/20 bg-forest/40 p-2 shadow-2xl backdrop-blur-md lg:w-56"
        >
          <Image
            src={featured.image}
            alt=""
            width={448}
            height={448}
            sizes="224px"
            className="aspect-square w-full rounded-2xl object-cover"
          />
          <div className="flex items-center justify-between px-2 pb-1 pt-3 text-xs">
            <span className="font-medium text-cream">{featured.label}</span>
            <span className="rounded-full bg-coral px-2 py-0.5 text-forest">
              {featured.caption}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        data-hero-fade
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 pb-7 md:px-12"
      >
        <div className="hidden items-center gap-3 text-xs uppercase tracking-[0.22em] text-cream/60 md:flex">
          <ArrowDown className="size-4 animate-bounce text-lime" />
          Scroll
        </div>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="ml-auto flex size-11 items-center justify-center rounded-full border border-cream/25 bg-forest/40 text-cream backdrop-blur-md transition-colors duration-300 hover:border-lime hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:ml-0"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
      </div>
    </section>
  );
}

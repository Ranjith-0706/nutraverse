"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { heroContent } from "@/data/hero";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const media = useRef<HTMLDivElement>(null);
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const removers: Array<() => void> = [];

    // Read the layout CSS actually chose (media is absolutely positioned from
    // md up) instead of a second media query, so JS and CSS can never disagree
    // around the breakpoint.
    const isDesktop = () =>
      !!media.current && getComputedStyle(media.current).position === "absolute";

    const mobile = () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-line]",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, transformOrigin: "left center" },
        0.1,
      )
        .fromTo(
          "[data-hero-char]",
          { yPercent: 100, autoAlpha: 1 },
          { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.012 },
          0.15,
        )
        .fromTo(
          "[data-hero-media]",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          0.5,
        )
        .fromTo(
          "[data-hero-video]",
          { scale: 1.12 },
          { scale: 1, duration: 1.6 },
          0.5,
        )
        .fromTo(
          "[data-hero-fade]",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.07 },
          0.6,
        );
    };

    const desktop = () => {
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
          { yPercent: 115, rotate: 6, autoAlpha: 1 },
          {
            yPercent: 0,
            rotate: 0,
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.018,
          },
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
      // Explicit start values + immediateRender:false, so a ScrollTrigger refresh
      // (resize, load) at scroll 0 restores the finished-intro state instead of
      // snapping back to the intro's starting window.
      gsap.fromTo(
        "[data-hero-media]",
        { clipPath: "inset(0% 0% 0% 0% round 0px)" },
        {
          clipPath: "inset(6% 5% 6% 5% round 36px)",
          ease: "none",
          immediateRender: false,
          scrollTrigger: st,
        },
      );
      gsap.fromTo(
        "[data-hero-content]",
        { yPercent: 0, autoAlpha: 1 },
        {
          yPercent: -12,
          autoAlpha: 0.1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { ...st, end: "bottom 35%" },
        },
      );

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
        removers.push(() =>
          window.removeEventListener("pointermove", onMove),
        );
      }
    };

    let mode: "reduced" | "mobile" | "desktop" | null = null;
    let ctx: gsap.Context | null = null;

    const currentMode = () =>
      reduce.matches ? "reduced" : isDesktop() ? "desktop" : "mobile";

    const teardown = () => {
      removers.splice(0).forEach((fn) => fn());
      ctx?.revert();
      ctx = null;
    };

    const build = () => {
      teardown();
      mode = currentMode();
      if (mode === "reduced") {
        video.current?.pause();
        setPlaying(false);
        return;
      }
      // Unscoped on purpose: the fixed Header (outside this section) is part of the intro.
      ctx = gsap.context(mode === "desktop" ? desktop : mobile);
    };

    const onResize = () => {
      if (currentMode() !== mode) build();
    };

    build();
    window.addEventListener("resize", onResize);
    reduce.addEventListener("change", build);

    // Reverts every tween/ScrollTrigger and removes every listener.
    return () => {
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", build);
      teardown();
    };
  }, []);

  const { eyebrow, headline, subline, primaryCta, secondaryCta, featured } =
    heroContent;

  const playButtonClass =
    "flex size-11 items-center justify-center rounded-full border border-cream/25 bg-forest/40 text-cream backdrop-blur-md transition-colors duration-300 hover:border-lime hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";
  const playLabel = playing ? "Pause background video" : "Play background video";
  const PlayIcon = playing ? Pause : Play;

  return (
    <section
      ref={root}
      aria-label="Introduction"
      // Mobile: normal document flow (column). md+: fullscreen layered hero.
      className="relative flex flex-col bg-forest md:min-h-svh md:flex-row md:items-center md:overflow-hidden"
    >
      {/* Media: in-flow landscape card on mobile, fullscreen backdrop on md+ */}
      <div
        ref={media}
        data-hero-media
        className="grain relative order-2 mx-5 mt-8 aspect-[4/3] overflow-hidden rounded-3xl md:absolute md:inset-0 md:order-none md:m-0 md:aspect-auto md:rounded-none"
      >
        <div
          data-hero-parallax
          className="absolute -inset-[4%] will-change-transform"
        >
          <video
            ref={video}
            data-hero-video
            className="h-full w-full object-cover object-[78%_center] md:object-[70%_center]"
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

        {/* Mood + legibility (text-protection gradients are desktop only) */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest/35 to-transparent md:bg-gradient-to-r md:from-forest md:via-forest/45 md:to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(198,243,107,0.12),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-forest to-transparent md:block" />

        {/* Mobile play/pause, tucked into the image corner */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playLabel}
          className={`${playButtonClass} absolute bottom-3 right-3 z-10 md:hidden`}
        >
          <PlayIcon className="size-4" />
        </button>
      </div>

      {/* Copy. `contents` on mobile lets head/tail be ordered around the media. */}
      <div
        data-hero-content
        className="contents md:relative md:z-10 md:mx-auto md:block md:w-full md:max-w-[90rem] md:px-12 md:pt-32"
      >
        <div className="order-1 px-5 pt-24 md:px-0 md:pt-0">
          <p className="mb-5 inline-flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] text-lime md:mb-7 md:text-sm">
            <span data-hero-line className="h-px w-10 bg-lime md:w-12" />
            <span data-hero-fade>{eyebrow}</span>
          </p>

          <h1
            aria-label={headline.join(" ")}
            className="font-display text-[clamp(2.5rem,12vw,4rem)] font-semibold leading-[1.08] tracking-tight text-cream md:max-w-[10ch] md:text-(length:--text-h1) md:leading-[0.92] lg:max-w-[12ch]"
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
        </div>

        <div className="order-3 px-5 pt-8 md:px-0 md:pb-0 md:pt-0">
          <p
            data-hero-fade
            className="max-w-md text-base leading-relaxed text-cream/75 md:mt-9"
          >
            {subline}
          </p>

          <div
            data-hero-fade
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-10"
          >
            <a
              href={primaryCta.href}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-lime px-7 py-3.5 font-medium text-forest transition-transform duration-300 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
            >
              {primaryCta.label}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            {/* Already in the navbar, so hidden on very small screens */}
            <a
              href={secondaryCta.href}
              className="hidden min-h-12 items-center justify-center rounded-full border border-cream/30 px-7 py-3.5 font-medium text-cream transition-colors duration-300 hover:border-coral hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral sm:inline-flex"
            >
              {secondaryCta.label}
            </a>
          </div>
        </div>
      </div>

      {/* Featured product: compact row below the CTA on mobile, floating card on md+ */}
      <div
        data-hero-float
        className="relative z-10 order-4 mx-5 mb-12 mt-8 md:absolute md:bottom-24 md:right-12 md:order-none md:m-0 md:will-change-transform lg:bottom-28"
      >
        <div
          data-hero-card
          className="flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-cream/20 bg-forest/40 p-2 shadow-2xl backdrop-blur-md md:block md:w-48 lg:w-56"
        >
          <Image
            src={featured.image}
            alt=""
            width={448}
            height={448}
            sizes="(min-width: 1024px) 224px, (min-width: 768px) 192px, 80px"
            className="h-20 w-20 shrink-0 rounded-2xl object-cover md:aspect-square md:h-auto md:w-full"
          />
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2 pr-2 text-xs md:flex-row md:items-center md:justify-between md:px-2 md:pb-1 md:pr-2 md:pt-3">
            <span className="font-medium text-cream">{featured.label}</span>
            <span className="rounded-full bg-coral px-2 py-0.5 text-forest">
              {featured.caption}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop bottom bar: scroll cue + play/pause */}
      <div
        data-hero-fade
        className="absolute inset-x-0 bottom-0 z-10 hidden items-center justify-between px-12 pb-7 md:flex"
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-cream/60">
          <ArrowDown className="size-4 animate-bounce text-lime" />
          Scroll
        </div>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playLabel}
          className={playButtonClass}
        >
          <PlayIcon className="size-4" />
        </button>
      </div>
    </section>
  );
}

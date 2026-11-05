"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { contactAside, contactIntro } from "@/data/contact";
import { site } from "@/data/site";
import MaskedHeading from "./MaskedHeading";
import EnquiryForm from "./EnquiryForm";

export default function ContactSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);

    // Headline line-reveal at every size (it never moves content off-screen).
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-ct-fade]",
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-ct-fade]", start: "top 85%", toggleActions: "play none none none" },
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

    // Desktop only: scroll-linked drift for the decorative type and the form panel entrance.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-ct-deco]",
        { yPercent: 12 },
        {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: "[data-ct-grid]", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        "[data-ct-panel]",
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-ct-grid]", start: "top 80%", toggleActions: "play none none none" },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-t border-cream/10 bg-forest text-cream"
    >
      {/* Subtle background motion: two slow drifting gradients (CSS only, off for reduced motion) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-0 size-[32rem] rounded-full bg-lime/10 blur-3xl motion-safe:animate-[drift_22s_ease-in-out_infinite_alternate] md:size-[48rem]" />
        <div className="absolute -right-1/4 bottom-0 size-[28rem] rounded-full bg-coral/10 blur-3xl motion-safe:animate-[drift_28s_ease-in-out_infinite_alternate-reverse] md:size-[40rem]" />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-[90rem] px-5 pb-20 pt-28 md:px-12 md:pb-32 md:pt-44">
        {/* 1. Cinematic intro */}
        <p
          data-ct-fade
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-lime/40 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-lime md:mb-10 md:text-sm"
        >
          <span className="size-2 rounded-full bg-lime" />
          {contactIntro.eyebrow}
        </p>
        <MaskedHeading
          id="contact-heading"
          words={contactIntro.heading}
          className="max-w-[16ch] font-display text-[clamp(2.5rem,1rem+8vw,9rem)] font-semibold leading-[1.02] tracking-tight md:max-w-[18ch]"
        />
        <p
          data-ct-fade
          className="mt-8 max-w-md text-base leading-relaxed text-cream/75 md:mt-12 md:text-lg"
        >
          {contactIntro.description}
        </p>

        {/* 2. Two-column layout (single column below 768px) */}
        <div
          data-ct-grid
          className="mt-16 grid gap-12 md:mt-28 md:grid-cols-12 md:gap-x-12"
        >
          <div className="relative min-w-0 md:col-span-5">
            <span
              aria-hidden="true"
              data-ct-deco
              className="pointer-events-none absolute -top-6 right-0 select-none font-display text-[clamp(7rem,22vw,16rem)] font-semibold leading-none text-transparent [-webkit-text-stroke:1px_rgb(244_240_230/0.18)] md:-top-10 md:right-auto md:left-0"
            >
              05
            </span>
            <div className="relative pt-24 md:pt-56">
              <h3 className="font-display text-(length:--text-h2) font-semibold leading-[1.05] tracking-tight">
                {contactAside.heading}
              </h3>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-cream/75">
                {contactAside.body}
              </p>

              <div className="mt-8 space-y-3 text-base">
                {site.email ? (
                  <a href={`mailto:${site.email}`} className="block w-fit underline decoration-lime underline-offset-4 hover:text-lime">
                    {site.email}
                  </a>
                ) : (
                  <p className="text-cream/60">{contactAside.emailPlaceholder}</p>
                )}
                {site.whatsapp && (
                  <a
                    href={`https://wa.me/${site.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-fit underline decoration-lime underline-offset-4 hover:text-lime"
                  >
                    Message on WhatsApp
                  </a>
                )}
              </div>
              <p className="mt-6 text-sm text-cream/45">{contactAside.note}</p>
            </div>
          </div>

          <div
            id="enquiry"
            data-ct-panel
            className="min-w-0 scroll-mt-24 md:col-span-7 md:scroll-mt-28"
          >
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

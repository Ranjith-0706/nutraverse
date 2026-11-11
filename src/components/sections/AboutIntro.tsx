import { aboutContent } from "@/data/company";
import CreamSection from "./CreamSection";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

export default function AboutIntro() {
  const { heading, description, note } = aboutContent.intro;
  return (
    <div className="px-3 md:px-6">
      <CreamSection labelledBy="about-intro-heading" className="py-20 md:py-36">
        <div className="mx-auto grid w-full min-w-0 max-w-[90rem] gap-10 px-2 md:px-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Eyebrow tone="light" className="mb-8">
              Introduction
            </Eyebrow>
            <h2
              id="about-intro-heading"
              className="font-display text-[clamp(2rem,0.9rem+5.6vw,6rem)] font-semibold leading-[1.04] tracking-tight"
            >
              {heading.replace("connection.", "")}
              <span className="rounded-[0.18em] bg-lime px-[0.14em]">connection.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9 lg:pt-28">
            <p className="text-lg leading-relaxed text-forest/85 md:text-xl">{description}</p>
            {/* TODO(client): replace demo copy with approved company introduction. */}
            <p className="mt-6 inline-block rounded-full border border-forest/25 px-3 py-1 text-xs font-medium uppercase tracking-widest text-forest/70">
              {note}
            </p>
          </Reveal>
        </div>
      </CreamSection>
    </div>
  );
}

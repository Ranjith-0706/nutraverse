import { qualityContent } from "@/data/quality";
import CreamSection from "./CreamSection";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

export default function QualityApproach() {
  const { heading, description, topics } = qualityContent.approach;
  return (
    <div className="px-3 md:px-6">
      <CreamSection labelledBy="approach-heading" className="py-20 md:py-36">
        <div className="mx-auto grid w-full min-w-0 max-w-[90rem] gap-12 px-2 md:px-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow tone="light" className="mb-8">
              Our approach
            </Eyebrow>
            <h2
              id="approach-heading"
              className="font-display text-[clamp(2rem,0.9rem+5vw,5.25rem)] lg:text-[clamp(2rem,0.9rem+2.6vw,4.5rem)] font-semibold leading-[1.04] tracking-tight"
            >
              {heading}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-forest/80 md:text-lg">{description}</p>
          </Reveal>
          <ol className="min-w-0 divide-y divide-forest/15 border-y border-forest/15 lg:col-span-7 lg:col-start-6 lg:self-end">
            {topics.map((t, i) => (
              <li key={t}>
                <Reveal delay={i * 0.05} y={20}>
                  <div className="group flex items-baseline gap-5 py-6 transition-colors duration-300 md:gap-8 md:py-8">
                    <span className="font-display text-sm font-semibold text-coral md:text-base">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 font-display text-[clamp(1.375rem,1rem+1.8vw,2.5rem)] font-semibold leading-tight tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-2">
                      {t}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </CreamSection>
    </div>
  );
}

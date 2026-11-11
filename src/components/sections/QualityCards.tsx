import { qualityCards } from "@/data/quality";
import Reveal from "./Reveal";

export default function QualityCards() {
  return (
    <section aria-labelledby="quality-cards-heading" className="px-5 py-20 md:px-12 md:py-32">
      <div className="mx-auto w-full min-w-0 max-w-[90rem]">
        <h2
          id="quality-cards-heading"
          className="max-w-2xl font-display text-(length:--text-h2) font-semibold leading-[1.04] tracking-tight text-cream"
        >
          How we can <span className="text-lime">help.</span>
        </h2>
        <ul className="mt-10 grid gap-5 md:mt-16 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {qualityCards.map((c, i) => (
            <li key={c.id} className={`min-w-0 ${i === 2 ? "md:col-span-2 lg:col-span-1 " : ""}${i === 1 ? "lg:mt-12" : i === 2 ? "lg:mt-24" : ""}`}>
              <Reveal y={36} delay={i * 0.07} className="h-full">
                <article className="group flex h-full min-h-64 flex-col justify-between rounded-3xl border border-cream/20 bg-cream/[0.04] p-6 transition-colors duration-500 hover:border-lime hover:bg-lime/10 md:min-h-96 md:rounded-[2rem] md:p-8">
                  <span className="font-display text-5xl font-semibold leading-none text-lime md:text-7xl">
                    {c.index}
                  </span>
                  <div>
                    <h3 className="font-display text-(length:--text-h3) font-semibold tracking-tight text-cream">
                      {c.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-cream/75">{c.description}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

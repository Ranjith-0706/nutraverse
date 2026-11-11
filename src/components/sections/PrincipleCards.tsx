import { principles, type Principle } from "@/data/company";
import Reveal from "./Reveal";

const tone: Record<Principle["tone"], string> = {
  lime: "bg-lime text-forest",
  coral: "bg-coral text-forest",
  cream: "bg-cream text-forest",
};

// Asymmetric 12-column placement on large screens; single column on mobile.
const placement = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-24",
  "lg:col-span-8 lg:col-start-3 lg:-mt-8",
];

export default function PrincipleCards() {
  return (
    <section aria-labelledby="principles-heading" className="px-5 py-20 md:px-12 md:py-32">
      <div className="mx-auto w-full min-w-0 max-w-[90rem]">
        <h2
          id="principles-heading"
          className="max-w-2xl font-display text-(length:--text-h2) font-semibold leading-[1.04] tracking-tight text-cream"
        >
          What guides <span className="text-lime">every conversation.</span>
        </h2>
        <ul className="mt-10 grid gap-5 md:mt-16 md:gap-6 lg:grid-cols-12">
          {principles.map((p, i) => (
            <li key={p.id} className={`min-w-0 ${placement[i]}`}>
              <Reveal y={40} delay={i * 0.06} className="h-full">
                <article
                  className={`group flex h-full min-h-72 flex-col justify-between rounded-3xl p-6 transition-transform duration-500 ease-out hover:-translate-y-1 md:min-h-96 md:rounded-[2rem] md:p-10 ${tone[p.tone]}`}
                >
                  <span className="font-display text-6xl font-semibold leading-none tracking-tight md:text-8xl">
                    {p.index}
                  </span>
                  <div>
                    <h3 className="font-display text-(length:--text-h3) font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-3 max-w-sm text-base leading-relaxed text-forest/80">{p.description}</p>
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

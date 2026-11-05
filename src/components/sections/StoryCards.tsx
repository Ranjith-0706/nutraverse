import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { StoryCardData } from "@/data/brandStory";

const tone = {
  forest: {
    card: "bg-forest text-cream",
    number: "text-lime",
    body: "text-cream/75",
    arrow: "bg-lime text-forest",
  },
  lime: {
    card: "bg-lime text-forest",
    number: "text-forest",
    body: "text-forest/75",
    arrow: "bg-forest text-lime",
  },
  coral: {
    card: "bg-coral text-forest",
    number: "text-forest",
    body: "text-forest/80",
    arrow: "bg-forest text-coral",
  },
} as const;

// Asymmetric desktop placement: wide / narrow offset down / wide pushed right.
const placement = [
  "md:col-span-7",
  "md:col-span-5 md:mt-32",
  "md:col-span-7 md:col-start-5",
] as const;

export default function StoryCards({
  cards,
}: {
  cards: readonly StoryCardData[];
}) {
  return (
    <div className="grid gap-5 md:grid-cols-12 md:gap-x-6 md:gap-y-6">
      {cards.map((card, i) => {
        const t = tone[card.tone];
        return (
          <article
            key={card.id}
            data-bs-card
            className={`group relative flex min-h-[20rem] flex-col justify-between gap-12 rounded-[2rem] p-7 md:min-h-[26rem] md:rounded-[2.5rem] md:p-10 ${t.card} ${placement[i] ?? "md:col-span-6"}`}
          >
            <span
              aria-hidden="true"
              className={`font-display text-[clamp(4rem,10vw,9rem)] font-semibold leading-[0.8] tracking-tight ${t.number}`}
            >
              {card.index}
            </span>

            <div>
              <h3 className="font-display text-(length:--text-h2) font-semibold leading-[1.02] tracking-tight">
                {card.title}
              </h3>
              <p className={`mt-4 max-w-sm text-base leading-relaxed ${t.body}`}>
                {card.description}
              </p>

              <Link
                href={card.link.href}
                className="mt-8 inline-flex min-h-12 items-center gap-3 text-base font-medium after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-forest"
              >
                {card.link.label}
                <span
                  aria-hidden="true"
                  className={`grid size-12 place-items-center rounded-full transition-transform duration-500 ease-out group-hover:scale-110 ${t.arrow}`}
                >
                  <ArrowUpRight className="size-5 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

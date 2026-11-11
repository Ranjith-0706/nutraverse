import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

/** Closing call to action linking to the existing enquiry/contact section. */
export default function PageCTA({
  id,
  heading,
  description,
  label,
  href,
}: {
  id: string;
  heading: string;
  description?: string;
  label: string;
  href: string;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-cream/10 px-5 py-20 md:px-12 md:py-32">
      <Reveal className="mx-auto flex w-full min-w-0 max-w-[90rem] flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h2
            id={id}
            className="max-w-3xl font-display text-(length:--text-h1) font-semibold leading-[1.02] tracking-tight text-cream"
          >
            {heading}
          </h2>
          {description && (
            <p className="mt-6 max-w-md text-base leading-relaxed text-cream/75 md:text-lg">{description}</p>
          )}
        </div>
        <Link
          href={href}
          className="group inline-flex min-h-14 w-full shrink-0 items-center justify-between gap-4 rounded-full bg-lime py-2 pl-7 pr-2 text-base font-semibold text-forest transition-colors duration-300 hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime sm:w-auto md:text-lg"
        >
          {label}
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-full bg-forest text-lime transition-transform duration-500 ease-out group-hover:rotate-45"
          >
            <ArrowUpRight className="size-5" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}

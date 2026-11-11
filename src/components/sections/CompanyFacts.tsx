import { companyFacts, FACT_PENDING } from "@/data/company";
import Reveal from "./Reveal";

/** Editable fact sheet. Only client-supplied values appear as facts. */
export default function CompanyFacts() {
  return (
    <section aria-labelledby="facts-heading" className="px-5 pb-20 md:px-12 md:pb-32">
      <div className="mx-auto grid w-full min-w-0 max-w-[90rem] gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <h2
            id="facts-heading"
            className="font-display text-(length:--text-h2) font-semibold leading-[1.04] tracking-tight text-cream"
          >
            Company <span className="text-lime">information.</span>
          </h2>
          {/* TODO(client): supply approved company details in src/data/company.ts. */}
          <p className="mt-5 max-w-sm text-base leading-relaxed text-cream/70">
            Placeholder fields are shown until approved company details are supplied. Nothing marked as pending is a
            statement of fact.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="min-w-0 lg:col-span-7">
          <dl className="divide-y divide-cream/15 border-y border-cream/15">
            {companyFacts.map((f) => (
              <div key={f.id} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
                <dt className="text-sm font-medium uppercase tracking-[0.14em] text-cream/55">{f.label}</dt>
                <dd className={`min-w-0 break-words sm:col-span-2 ${f.value ? "text-cream" : "text-cream/50"}`}>
                  {f.value ?? FACT_PENDING}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

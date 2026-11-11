import { ArrowUpRight } from "lucide-react";
import { publicDocuments, qualityContent, qualityDocuments } from "@/data/quality";
import Reveal from "./Reveal";

/**
 * Data-driven credentials list. Renders ONLY documents that are verified and
 * marked public; otherwise a neutral state. No placeholder credentials exist.
 */
export default function DocumentShowcase() {
  const docs = publicDocuments(qualityDocuments);
  const { heading, empty } = qualityContent.documents;

  return (
    <section aria-labelledby="documents-heading" className="px-5 pb-20 md:px-12 md:pb-32">
      <div className="mx-auto grid w-full min-w-0 max-w-[90rem] gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <h2
            id="documents-heading"
            className="font-display text-(length:--text-h2) font-semibold leading-[1.04] tracking-tight text-cream"
          >
            {heading}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0 lg:col-span-7">
          {docs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-cream/25 p-6 md:p-10">
              <p className="font-display text-xl font-semibold leading-snug text-cream md:text-2xl">{empty}</p>
            </div>
          ) : (
            <ul className="divide-y divide-cream/15 border-y border-cream/15">
              {docs.map((d) => (
                <li key={d.id} className="py-6">
                  <h3 className="font-display text-xl font-semibold text-cream">{d.title}</h3>
                  <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm text-cream/75 sm:grid-cols-2">
                    <div>
                      <dt className="text-cream/50">Issuing authority</dt>
                      <dd>{d.issuingAuthority}</dd>
                    </div>
                    {d.credentialNumber && (
                      <div>
                        <dt className="text-cream/50">Credential number</dt>
                        <dd className="break-words">{d.credentialNumber}</dd>
                      </div>
                    )}
                    {(d.validFrom || d.validUntil) && (
                      <div>
                        <dt className="text-cream/50">Validity</dt>
                        <dd>
                          {d.validFrom ?? "-"} to {d.validUntil ?? "-"}
                        </dd>
                      </div>
                    )}
                  </dl>
                  {d.url && (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-lime hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                    >
                      View document or verify
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}

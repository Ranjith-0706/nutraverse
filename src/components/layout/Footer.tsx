"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { footerLinks, site } from "@/data/site";

export default function Footer() {
  // Set after mount so the static prerender never depends on the current time.
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-cream/10 bg-forest px-5 pb-10 pt-16 text-cream md:px-12 md:pt-24">
      <div className="mx-auto w-full min-w-0 max-w-[90rem]">
        <p
          aria-hidden="true"
          className="font-display text-[clamp(2.25rem,13vw,14rem)] font-semibold leading-[0.9] tracking-tight text-cream/90"
        >
          {site.name}
          <span className="text-lime">.</span>
        </p>

        <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="font-display text-xl font-semibold tracking-tight">
              {site.name}
              <span className="text-lime">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/65">{site.description}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-4 md:col-start-7">
            <ul className="space-y-1">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center text-base text-cream/85 transition-colors hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            {site.email ? (
              <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center text-base hover:text-lime">
                {site.email}
              </a>
            ) : (
              <p className="text-sm text-cream/50">Contact details to be provided.</p>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-sm text-cream/55 md:flex-row md:justify-between">
          <p>
            © {year ?? ""} {site.name}. All rights reserved.
          </p>
          {site.privacyHref ? (
            <Link href={site.privacyHref} className="hover:text-lime">
              Privacy policy
            </Link>
          ) : (
            <p>Privacy policy: pending client approval.</p>
          )}
        </div>
      </div>
    </footer>
  );
}

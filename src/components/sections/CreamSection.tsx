"use client";

import { useRef } from "react";
import { useHeaderTone } from "@/lib/useHeaderTone";

/** Cream editorial panel. Flips the fixed header to dark text while it is under the bar. */
export default function CreamSection({
  children,
  labelledBy,
  className = "",
}: {
  children: React.ReactNode;
  labelledBy: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useHeaderTone(ref);
  return (
    <section
      ref={ref}
      aria-labelledby={labelledBy}
      className={`relative z-10 rounded-[2.5rem] bg-cream text-forest md:rounded-[4rem] ${className}`}
    >
      {children}
    </section>
  );
}

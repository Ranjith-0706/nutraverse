"use client";

import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Flips the fixed header to dark text while a cream section is beneath it.
 * State only (no motion), so it also runs with reduced motion.
 */
export function useHeaderTone(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const html = document.documentElement;
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 40px",
      end: () => `bottom ${window.innerWidth >= 768 ? 80 : 40}px`,
      onToggle: (self) => {
        if (self.isActive) html.dataset.headerTone = "light";
        else delete html.dataset.headerTone;
      },
    });
    return () => {
      st.kill();
      delete html.dataset.headerTone;
    };
  }, [ref]);
}

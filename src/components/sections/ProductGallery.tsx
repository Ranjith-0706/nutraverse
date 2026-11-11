"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/data/catalogue";

const toneClass = { lime: "bg-lime", coral: "bg-coral", cream: "bg-cream" } as const;

const navBtn =
  "grid size-11 place-items-center rounded-full bg-forest/80 text-cream backdrop-blur transition-colors hover:bg-lime hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";

/** Main image + thumbnails. Controls only render when there is more than one real image. */
export default function ProductGallery({
  images,
  tone,
}: {
  images: readonly ProductImage[];
  tone: keyof typeof toneClass;
}) {
  const [i, setI] = useState(0);
  const many = images.length > 1;
  const go = (n: number) => setI((n + images.length) % images.length);
  const cur = images[i];

  return (
    <div
      data-pd-gallery
      className="min-w-0"
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
    >
      <div className={`rounded-[2rem] p-3 md:rounded-[2.5rem] md:p-4 ${toneClass[tone]}`}>
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-forest md:aspect-[4/5] md:rounded-[2rem]">
          <div data-pd-par className="absolute inset-x-0 -inset-y-[5%] will-change-transform">
            <Image
              key={`${cur.src}-${i}`}
              src={cur.src}
              alt={cur.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 45vw, calc(100vw - 40px)"
              style={cur.position ? { objectPosition: cur.position } : undefined}
              className="object-cover"
            />
          </div>
          {many && (
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
              <button type="button" onClick={() => go(i - 1)} aria-label="Previous image" className={navBtn}>
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <p className="rounded-full bg-forest/80 px-3 py-1 text-xs text-cream backdrop-blur" aria-live="polite">
                {i + 1} / {images.length}
              </p>
              <button type="button" onClick={() => go(i + 1)} aria-label="Next image" className={navBtn}>
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      {many && (
        <ul className="mt-4 flex gap-3" aria-label="Product images">
          {images.map((img, n) => (
            <li key={`${img.src}-${n}`}>
              <button
                type="button"
                onClick={() => setI(n)}
                aria-label={`Show image ${n + 1} of ${images.length}`}
                aria-current={n === i}
                className={`relative block size-16 overflow-hidden rounded-xl border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:size-20 ${
                  n === i ? "border-lime" : "border-cream/20 hover:border-cream/60"
                }`}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="80px"
                  style={img.position ? { objectPosition: img.position } : undefined}
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

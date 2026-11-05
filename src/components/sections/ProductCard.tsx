import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductCategory, ProductTone } from "@/data/products";

const toneClass: Record<ProductTone, string> = {
  lime: "bg-lime",
  coral: "bg-coral",
  cream: "bg-cream",
};

interface ProductCardProps {
  product: ProductCategory;
  /**
   * Desktop placement inside the showcase: alternate left/right.
   * "full" fills its container (used on the /products index grid).
   */
  align?: "start" | "end" | "full";
  /** Hint for next/image; defaults suit the showcase layout. */
  sizes?: string;
}

const alignClass = {
  start: "md:w-[58%] md:self-start",
  end: "md:w-[58%] md:self-end",
  full: "w-full",
} as const;

export default function ProductCard({
  product,
  align = "full",
  sizes = "(min-width: 768px) 56vw, calc(100vw - 40px)",
}: ProductCardProps) {
  const { slug, index, name, description, image, alt, tone } = product;

  return (
    <article data-product-card className={`w-full ${alignClass[align]}`}>
      <Link
        href={`/products/${slug}`}
        aria-label={`${name} - view category`}
        className={`group block rounded-[2rem] p-3 text-forest transition-transform duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime md:rounded-[2.5rem] md:p-4 md:hover:-translate-y-1 ${toneClass[tone]}`}
      >
        {/* Product visual: square on mobile so nothing is cropped away */}
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-forest md:aspect-[5/4] md:rounded-[2rem]">
          <div
            data-card-img
            className="absolute inset-x-0 -inset-y-[6%] will-change-transform"
          >
            <Image
              src={image}
              alt={alt}
              fill
              sizes={sizes}
              className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-[1.05] md:group-focus-visible:scale-[1.05]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 px-3 pb-3 pt-6 md:px-5 md:pb-5 md:pt-8">
          <div className="flex items-start justify-between gap-4">
            <span
              aria-hidden="true"
              className="font-display text-[clamp(3.5rem,9vw,7rem)] font-semibold leading-[0.8] tracking-tight"
            >
              {index}
            </span>
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-full bg-forest text-lime transition-transform duration-500 ease-out group-hover:scale-110 group-focus-visible:scale-110 md:size-16"
            >
              <ArrowUpRight className="size-6 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1" />
            </span>
          </div>

          <div>
            <h3 className="font-display text-(length:--text-h2) font-semibold leading-[1.02] tracking-tight">
              {name}
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-forest/75">
              {description}
            </p>
            <span className="mt-4 inline-block rounded-full border border-forest/30 px-3 py-1 text-xs font-medium uppercase tracking-widest">
              Sample category
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

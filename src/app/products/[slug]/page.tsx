import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategory, productCategories } from "@/data/products";

export function generateStaticParams() {
  return productCategories.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getCategory(slug);
  return { title: product ? `${product.name} - Nutraverse` : "Not found" };
}

const toneClass = {
  lime: "bg-lime",
  coral: "bg-coral",
  cream: "bg-cream",
} as const;

export default async function ProductCategoryPage(
  props: PageProps<"/products/[slug]">,
) {
  const { slug } = await props.params;
  const product = getCategory(slug);
  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-[90rem] px-5 pb-24 pt-28 md:px-12 md:pb-40 md:pt-40">
      <Link
        href="/products"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-cream/75 transition-colors hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
      >
        <ArrowLeft className="size-4" />
        All products
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div
          className={`rounded-[2rem] p-3 md:rounded-[2.5rem] md:p-4 ${toneClass[product.tone]}`}
        >
          <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-forest md:rounded-[2rem]">
            <Image
              src={product.image}
              alt={product.alt}
              fill
              priority
              sizes="(min-width: 768px) 45vw, calc(100vw - 40px)"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <p className="font-display text-lime">
            {product.index} / {String(productCategories.length).padStart(2, "0")}
          </p>
          <h1 className="mt-3 font-display text-(length:--text-h1) font-semibold leading-[1.02] tracking-tight">
            {product.name}
          </h1>
          <p className="mt-6 max-w-md text-cream/75">{product.details}</p>
          <span className="mt-6 inline-block rounded-full border border-cream/30 px-3 py-1 text-xs font-medium uppercase tracking-widest text-cream/70">
            Sample category
          </span>
          <div className="mt-10">
            <Link
              href="/#contact"
              className="inline-flex min-h-12 items-center rounded-full bg-lime px-7 py-3.5 font-medium text-forest transition-transform duration-300 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

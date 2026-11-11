import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  getProduct,
  getProductCategory,
  products,
  relatedProducts,
} from "@/data/catalogue";
import ProductDetail from "@/components/sections/ProductDetail";
import ProductCard, { type ProductCardData } from "@/components/sections/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found - Nutraverse" };
  const category = getProductCategory(product);
  return {
    title: `${product.productName} - ${category?.name ?? "Products"} - Nutraverse`,
    description: product.shortDescription,
    openGraph: { title: product.productName, description: product.shortDescription },
    // Demo content stays out of search indexes until verified.
    robots: product.status === "verified" ? undefined : { index: false, follow: true },
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getProductCategory(product);
  const related = relatedProducts(product);

  // Pre-select the category and mention the product in the enquiry form.
  const q = new URLSearchParams();
  if (category) q.set("interest", category.name);
  q.set("product", product.productName);
  const enquiryHref = `/?${q.toString()}#enquiry`;

  // Minimal structured data: no price, availability or rating claims.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    description: product.shortDescription,
    category: category?.name,
    image: product.gallery.map((g) => g.src),
  };

  return (
    <main className="text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetail product={product} category={category} enquiryHref={enquiryHref} />

      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="mx-auto w-full min-w-0 max-w-[90rem] px-5 pb-20 md:px-12 md:pb-32"
        >
          <h2 id="related-heading" className="font-display text-(length:--text-h2) font-semibold tracking-tight">
            More in {category?.name}
          </h2>
          <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => {
              const data: ProductCardData = {
                id: p.id,
                href: `/products/${p.slug}`,
                index: String(i + 1).padStart(2, "0"),
                name: p.productName,
                description: p.shortDescription,
                image: p.gallery[0].src,
                alt: p.gallery[0].alt,
                imagePosition: p.gallery[0].position,
                tone: p.tone,
                tag: `${category?.name ?? "Product"} · Demo`,
              };
              return (
                <ProductCard
                  key={p.id}
                  product={data}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, calc(100vw - 40px)"
                />
              );
            })}
          </div>
        </section>
      )}

      <section className="border-t border-cream/10 px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl font-display text-(length:--text-h1) font-semibold leading-[1.02] tracking-tight">
            Interested in supplying <span className="text-lime">this range?</span>
          </h2>
          <Link
            href={enquiryHref}
            className="group inline-flex min-h-14 w-full items-center justify-between gap-4 rounded-full bg-lime py-2 pl-7 pr-2 text-base font-semibold text-forest transition-colors duration-300 hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime sm:w-auto md:text-lg"
          >
            Request Export Quote
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-full bg-forest text-lime transition-transform duration-500 group-hover:rotate-45"
            >
              <ArrowUpRight className="size-5" />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

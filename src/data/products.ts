// SAMPLE CONTENT - the category names and descriptions below are editable
// placeholders, NOT real company products. Replace with the approved range.

export type ProductTone = "lime" | "coral" | "cream";

export interface ProductCategory {
  id: string;
  /** URL segment: /products/[slug] */
  slug: string;
  /** Display index, e.g. "01" */
  index: string;
  name: string;
  description: string;
  /** Longer neutral copy for the detail page. */
  details: string;
  image: string;
  alt: string;
  /** Colour block behind the card. */
  tone: ProductTone;
}

export const showcaseContent = {
  eyebrow: "Explore our range",
  heading: "Nutrition made for a world in motion.",
  intro:
    "Explore our product portfolio and discover opportunities for international supply partnerships.",
  cta: { label: "Explore all products", href: "/products" },
} as const;

export const productCategories: readonly ProductCategory[] = [
  {
    id: "sports-nutrition",
    slug: "sports-nutrition",
    index: "01",
    name: "Sports Nutrition",
    description:
      "Sample category. Replace with an approved description of this range.",
    details:
      "Sample category page. Add the approved overview, product list and specifications for this range here.",
    image: "/images/product-3.png",
    alt: "White product tub with a lime-green lid on a mossy rock, with orange and lime slices and water splashes",
    tone: "lime",
  },
  {
    id: "vitamins-supplements",
    slug: "vitamins-supplements",
    index: "02",
    name: "Vitamins & Supplements",
    description:
      "Sample category. Replace with an approved description of this range.",
    details:
      "Sample category page. Add the approved overview, product list and specifications for this range here.",
    image: "/images/product-2.png",
    alt: "Two white product jars with coral and lime lids floating above a mossy rock with citrus and water splashes",
    tone: "coral",
  },
  {
    id: "natural-wellness",
    slug: "natural-wellness",
    index: "03",
    name: "Natural Wellness",
    description:
      "Sample category. Replace with an approved description of this range.",
    details:
      "Sample category page. Add the approved overview, product list and specifications for this range here.",
    image: "/images/product-1.png",
    alt: "Product jar with a red lid floating above a stone podium with hibiscus, lime, ginger and green powder",
    tone: "cream",
  },
] as const;

export function getCategory(slug: string) {
  return productCategories.find((c) => c.slug === slug);
}

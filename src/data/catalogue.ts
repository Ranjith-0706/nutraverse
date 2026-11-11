// DEMO CATALOGUE - pending client approval.
// Every product below is a clearly marked SAMPLE using the project's existing
// placeholder photography. No ingredients, nutrition values, pack sizes, MOQ,
// shelf life, storage guidance or certifications have been invented: leave an
// optional field out until the client supplies and verifies it. Missing fields
// render as "Details available on enquiry".

import { productCategories, type ProductCategory, type ProductTone } from "./products";

export type VerificationStatus = "demo" | "pending" | "verified";

export interface ProductImage {
  /** Must be a real file under /public. */
  src: string;
  alt: string;
  /** CSS object-position, to crop the shared placeholder photos differently. */
  position?: string;
}

export interface NutritionFact {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  /** URL segment: /products/[slug] */
  slug: string;
  productName: string;
  /** References ProductCategory.id */
  categoryId: ProductCategory["id"];
  shortDescription: string;
  detailedDescription: string;
  gallery: readonly ProductImage[];
  tone: ProductTone;
  status: VerificationStatus;
  // Optional, ONLY when supplied and verified by the client:
  ingredients?: readonly string[];
  nutritionFacts?: readonly NutritionFact[];
  packaging?: readonly string[];
  moq?: string;
  shelfLife?: string;
  storage?: string;
  certifications?: readonly string[];
}

export const statusLabel: Record<VerificationStatus, string> = {
  demo: "Demo product",
  pending: "Details pending confirmation",
  verified: "Verified",
};

export const PENDING_TEXT = "Details available on enquiry";

export const catalogueContent = {
  eyebrow: "Our products",
  heading: "Discover our nutrition range.",
  intro:
    "Browse product categories for international distribution and supply partnerships. Sample content: specifications are shared on enquiry.",
  demoNote:
    "All products shown are demo placeholders pending client approval. Specifications are not yet confirmed.",
};

const DEMO_SHORT = "Demo product. Replace with an approved product description.";
const DEMO_LONG =
  "This is a placeholder product page. Add the approved overview, specifications and supporting documentation here once they have been confirmed by the client. No specifications are implied by this sample.";

const img = {
  sports: {
    src: "/images/product-3.png",
    alt: "White product tub with a lime-green lid on a mossy rock, with orange and lime slices and water splashes",
  },
  vitamins: {
    src: "/images/product-2.png",
    alt: "Two white product jars with coral and lime lids floating above a mossy rock with citrus and water splashes",
  },
  wellness: {
    src: "/images/product-1.png",
    alt: "Product jar with a red lid floating above a stone podium with hibiscus, lime, ginger and green powder",
  },
} as const;

export const products: readonly Product[] = [
  {
    id: "sample-01",
    slug: "sample-product-01",
    productName: "Sample Product 01",
    categoryId: "sports-nutrition",
    shortDescription: DEMO_SHORT,
    detailedDescription: DEMO_LONG,
    gallery: [img.sports, { ...img.vitamins, position: "30% 50%" }],
    tone: "lime",
    status: "demo",
  },
  {
    id: "sample-02",
    slug: "sample-product-02",
    productName: "Sample Product 02",
    categoryId: "sports-nutrition",
    shortDescription: DEMO_SHORT,
    detailedDescription: DEMO_LONG,
    gallery: [{ ...img.sports, position: "70% 40%" }, img.wellness],
    tone: "cream",
    status: "demo",
  },
  {
    id: "sample-03",
    slug: "sample-product-03",
    productName: "Sample Product 03",
    categoryId: "vitamins-supplements",
    shortDescription: DEMO_SHORT,
    detailedDescription: DEMO_LONG,
    gallery: [img.vitamins, { ...img.sports, position: "40% 50%" }],
    tone: "coral",
    status: "demo",
  },
  {
    id: "sample-04",
    slug: "sample-product-04",
    productName: "Sample Product 04",
    categoryId: "vitamins-supplements",
    shortDescription: DEMO_SHORT,
    detailedDescription: DEMO_LONG,
    gallery: [{ ...img.vitamins, position: "75% 45%" }, img.wellness],
    tone: "lime",
    status: "demo",
  },
  {
    id: "sample-05",
    slug: "sample-product-05",
    productName: "Sample Product 05",
    categoryId: "natural-wellness",
    shortDescription: DEMO_SHORT,
    detailedDescription: DEMO_LONG,
    gallery: [img.wellness, { ...img.vitamins, position: "60% 50%" }],
    tone: "cream",
    status: "demo",
  },
  {
    id: "sample-06",
    slug: "sample-product-06",
    productName: "Sample Product 06",
    categoryId: "natural-wellness",
    shortDescription: DEMO_SHORT,
    detailedDescription: DEMO_LONG,
    gallery: [{ ...img.wellness, position: "30% 50%" }, img.sports],
    tone: "coral",
    status: "demo",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductCategory = (p: Product) =>
  productCategories.find((c) => c.id === p.categoryId);
export const relatedProducts = (p: Product, limit = 3) =>
  products.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, limit);

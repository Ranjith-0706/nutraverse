// DEMO COPY - pending client approval.
// Everything here is neutral placeholder wording. It makes no claim about the
// company's history, scale, facilities, certifications, markets or partners.
// TODO(client): replace copy once approved, and fill `companyFacts` with
// verified details only.

import { productCategories } from "./products";
import { site } from "./site";

export interface HeadingWord {
  text: string;
  accent?: "lime" | "coral";
}

export const words = (s: string, accented: readonly string[] = []): HeadingWord[] =>
  s.split(" ").map((text) => ({
    text,
    accent: accented.includes(text) ? ("lime" as const) : undefined,
  }));

export const aboutContent = {
  hero: {
    eyebrow: "Get to know us",
    heading: words("Driven by nutrition. Connected by possibility.", ["nutrition.", "possibility."]),
    intro: "Discover our approach to nutrition products and international business partnerships.",
    image: {
      src: "/images/hero-poster.png",
      alt: "Halved orange and lime with green leaves and water droplets splashing against a deep green background",
      caption: "Illustrative imagery. Not a photograph of our team or facilities.",
    },
  },
  intro: {
    heading: "More than products. A focus on connection.",
    description:
      "Our goal is to connect nutrition product opportunities with businesses exploring international supply relationships.",
    note: "Demonstration copy pending client approval.",
  },
  story: {
    heading: words("Inspired by ingredients. Open to conversation.", ["ingredients."]),
    image: {
      src: "/images/product-1.png",
      alt: "Product jar with a red lid floating above a stone podium with hibiscus, lime, ginger and green powder",
      caption: "Illustrative imagery. Not a photograph of our team or facilities.",
    },
  },
  cta: {
    heading: "Let's explore opportunities together.",
    label: "Start a conversation",
    href: "/#contact",
  },
} as const;

export interface Principle {
  id: string;
  index: string;
  title: string;
  description: string;
  tone: "lime" | "coral" | "cream";
}

export const principles: readonly Principle[] = [
  {
    id: "product-focus",
    index: "01",
    title: "Product Focus",
    description: "Explore our nutrition product categories and discuss your requirements.",
    tone: "lime",
  },
  {
    id: "open-communication",
    index: "02",
    title: "Open Communication",
    description: "Start a conversation about product information and supply possibilities.",
    tone: "cream",
  },
  {
    id: "international-outlook",
    index: "03",
    title: "International Outlook",
    description: "Connect with us to discuss opportunities across different markets.",
    tone: "coral",
  },
];

export interface CompanyFact {
  id: string;
  label: string;
  /** Leave undefined until the client supplies and approves it. */
  value?: string;
}

/** Only supplied facts are shown as facts; the rest are marked as pending. */
export const companyFacts: readonly CompanyFact[] = [
  { id: "legal-name", label: "Legal company name" },
  { id: "hq", label: "Headquarters country" },
  { id: "category", label: "Business category" },
  {
    id: "products",
    label: "Product categories",
    // Sample categories from the demo catalogue (see src/data/products.ts).
    value: `${productCategories.map((c) => c.name).join(", ")} (sample categories)`,
  },
  {
    id: "contact",
    label: "Contact details",
    value: site.email || undefined,
  },
  { id: "registration", label: "Company registration" },
];

export const FACT_PENDING = "Pending client confirmation";

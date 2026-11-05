// PLACEHOLDER COPY - pending client approval.
// All wording below is neutral sample text. It makes no claims about the
// company's history, scale, certifications or markets. Replace once approved.

export interface HeadingWord {
  text: string;
  /** "highlight" = lime marker block, "underline" = coral underline (both keep forest text for contrast). */
  accent?: "highlight" | "underline";
}

export interface StoryCardData {
  id: string;
  index: string;
  title: string;
  description: string;
  link: { label: string; href: string };
  tone: "forest" | "lime" | "coral";
}

export const brandStoryContent = {
  eyebrow: "Our philosophy",
  heading: [
    { text: "Rooted" },
    { text: "in" },
    { text: "nature.", accent: "highlight" },
    { text: "Made" },
    { text: "for" },
    { text: "the" },
    { text: "world.", accent: "underline" },
  ] satisfies HeadingWord[],
  description:
    "We connect our nutrition product portfolio with opportunities for international distribution and supply partnerships.",
  image: {
    src: "/images/hero-poster.png",
    alt: "Halved orange and lime with green leaves and water droplets splashing against a deep green background",
  },
} as const;

export const storyCards: readonly StoryCardData[] = [
  {
    id: "nutrition",
    index: "01",
    title: "A Focus on Nutrition",
    description: "Explore the product categories that shape our portfolio.",
    link: { label: "View products", href: "/products" },
    tone: "forest",
  },
  {
    id: "partnerships",
    index: "02",
    title: "Built for Partnerships",
    description:
      "Connect with us to discuss product requirements and supply opportunities.",
    link: { label: "Get in touch", href: "/#contact" },
    tone: "lime",
  },
  {
    id: "global",
    index: "03",
    title: "A Global Outlook",
    description:
      "Start a conversation about international distribution and export enquiries.",
    link: { label: "Get in touch", href: "/#contact" },
    tone: "coral",
  },
] as const;

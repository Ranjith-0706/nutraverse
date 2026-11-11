// DEMO COPY - pending client approval.
// No certification, test result, audit or approval is claimed anywhere here.
// TODO(client): add a `qualityDocuments` entry ONLY for a real credential that
// the client has supplied, verified and approved for public display.

import { words, type HeadingWord } from "./company";

export const qualityContent = {
  hero: {
    eyebrow: "Quality & standards",
    heading: words("Confidence begins with clarity.", ["clarity."]) satisfies HeadingWord[],
    intro:
      "Explore the product information and documentation that may be available for review during your enquiry.",
  },
  approach: {
    heading: "Information you may request",
    description:
      "Every sourcing decision is different. These are examples of the topics buyers often ask about. Availability depends on the product and is confirmed during the enquiry.",
    topics: [
      "Product specifications",
      "Ingredient and nutrition information",
      "Packaging details",
      "Applicable compliance documentation",
    ],
  },
  documents: {
    heading: "Certifications & documents",
    empty: "Specific quality and compliance documentation can be discussed during an enquiry.",
  },
  cta: {
    heading: "Have specific quality requirements?",
    description: "Tell us what documentation or product information you need.",
    label: "Discuss Your Requirements",
    href: "/?product=Quality+documentation+and+product+information#enquiry",
  },
} as const;

export interface QualityCard {
  id: string;
  index: string;
  title: string;
  description: string;
}

export const qualityCards: readonly QualityCard[] = [
  {
    id: "product-information",
    index: "01",
    title: "Product Information",
    description: "Request available product information relevant to your sourcing requirements.",
  },
  {
    id: "documentation-review",
    index: "02",
    title: "Documentation Review",
    description: "Discuss applicable documentation and specifications during the enquiry process.",
  },
  {
    id: "packaging-supply",
    index: "03",
    title: "Packaging & Supply",
    description: "Share your packaging preferences and order requirements for further discussion.",
  },
];

export type DocumentStatus = "verified" | "pending" | "unverified";
export type DocumentVisibility = "public" | "private";

export interface QualityDocument {
  id: string;
  title: string;
  issuingAuthority: string;
  /** Certificate or credential number, where one applies. */
  credentialNumber?: string;
  /** ISO dates (YYYY-MM-DD), as printed on the document. */
  validFrom?: string;
  validUntil?: string;
  /** Link to the document or to the issuer's verification page. */
  url?: string;
  status: DocumentStatus;
  visibility: DocumentVisibility;
}

/** Keep EMPTY until real, verified credentials are supplied by the client. */
export const qualityDocuments: readonly QualityDocument[] = [];

/** Only documents that are both verified and approved for public display. */
export const publicDocuments = (docs: readonly QualityDocument[] = qualityDocuments) =>
  docs.filter((d) => d.status === "verified" && d.visibility === "public");

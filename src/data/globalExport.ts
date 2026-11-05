// PLACEHOLDER CONTENT - pending client approval.
// The origin, destinations and routes below are ILLUSTRATIVE ONLY. They are not
// claims about where the company is based or where it ships. Replace the
// coordinates/labels with verified client data; the map redraws automatically.
// Process steps are general enquiry stages, not service commitments.

export interface MapPoint {
  id: string;
  label: string;
  /** Short note shown in the tooltip and list. */
  note: string;
  /** Geographic coordinates (degrees). */
  lon: number;
  lat: number;
}

export const globalIntro = {
  eyebrow: "Global opportunities",
  heading: [
    { text: "Beyond" },
    { text: "borders.", accent: "lime" as const },
    { text: "Built" },
    { text: "for" },
    { text: "connection.", accent: "coral" as const },
  ],
  description:
    "Connect with us to explore international nutrition product supply opportunities.",
};

export const mapContent = {
  title: "Illustrative map of example trade routes",
  /** Text alternative for the SVG and visible disclaimer. */
  disclaimer:
    "Illustrative only. The origin and destinations shown are examples for design purposes and do not indicate active exports, offices or confirmed markets.",
  originTag: "Illustrative origin (to be confirmed)",
  destinationTag: "Example destination",
};

/** Origin is NOT confirmed by the client. India is used as a clearly labelled illustration. */
export const mapOrigin: MapPoint = {
  id: "origin",
  label: "India",
  note: "Illustrative origin, pending client confirmation.",
  lon: 78.5,
  lat: 21.5,
};

export const mapDestinations: readonly MapPoint[] = [
  { id: "uk", label: "United Kingdom", note: "Example destination, not a confirmed market.", lon: -1.5, lat: 52.5 },
  { id: "uae", label: "United Arab Emirates", note: "Example destination, not a confirmed market.", lon: 54.4, lat: 24.3 },
  { id: "usa", label: "United States", note: "Example destination, not a confirmed market.", lon: -98.5, lat: 39.5 },
  { id: "sg", label: "Singapore", note: "Example destination, not a confirmed market.", lon: 103.8, lat: 1.35 },
  { id: "au", label: "Australia", note: "Example destination, not a confirmed market.", lon: 134, lat: -25.5 },
  { id: "za", label: "South Africa", note: "Example destination, not a confirmed market.", lon: 24.5, lat: -29 },
];

export interface ProcessStep {
  id: string;
  index: string;
  title: string;
  description: string;
}

export const processContent = {
  eyebrow: "How an enquiry works",
  heading: "A clear path from first message to shipment.",
  disclaimer:
    "General enquiry-process stages, shown for illustration. They are not guaranteed service commitments; scope and timing are agreed with each customer.",
};

export const processSteps: readonly ProcessStep[] = [
  { id: "enquiry", index: "01", title: "Send Enquiry", description: "Share the products and markets you are interested in." },
  { id: "requirements", index: "02", title: "Discuss Requirements", description: "Talk through specifications, quantities and any documentation needs." },
  { id: "order", index: "03", title: "Confirm Order Details", description: "Review and agree the details of the order together." },
  { id: "shipment", index: "04", title: "Coordinate Shipment", description: "Work out shipping arrangements for the agreed order." },
];

export const partnershipCta = {
  heading: "Let's build what's next.",
  description:
    "Tell us about your product requirements and international supply needs.",
  button: "Request Export Quote",
};

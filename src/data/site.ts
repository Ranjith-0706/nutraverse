// PLACEHOLDER SITE DETAILS - pending client approval.
// Only fill these in with VERIFIED company details. Anything left empty is
// hidden (or shown as a clearly marked placeholder) so no fake contact data
// ever appears on the site.

export const site = {
  name: "Nutraverse",
  /** Public company email. Leave empty until verified. (Enquiry delivery uses env vars, not this.) */
  email: "",
  /** International format digits only, e.g. "447700900000". Leave empty until verified. */
  whatsapp: "",
  /** Real privacy-policy route (e.g. "/privacy"). Leave empty until the page exists. */
  privacyHref: "",
  description:
    "Nutraverse connects nutrition products with international distribution and supply partnerships. Placeholder description pending client approval.",
} as const;

export const footerLinks = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/#about" },
  { label: "Global reach", href: "/#global" },
  { label: "Contact", href: "/#contact" },
] as const;

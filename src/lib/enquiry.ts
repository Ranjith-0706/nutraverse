import { z } from "zod";
import { productCategories } from "@/data/products";

/** Shared by the client form and the server route so both validate identically. */

export const OTHER_PRODUCT = "Other / not sure yet";
export const productOptions = [
  ...productCategories.map((c) => c.name),
  OTHER_PRODUCT,
] as const;

export const quantityUnits = [
  "kg",
  "tonnes",
  "cartons",
  "pallets",
  "containers",
] as const;

const text = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const baseSchema = z.object({
  fullName: text("Full name", 100),
  email: z
    .string()
    .trim()
    .min(1, "Business email is required.")
    .max(254, "Email is too long.")
    .pipe(z.email("Enter a valid email address.")),
  company: text("Company name", 150),
  country: text("Country", 80),
  productInterest: z
    .string()
    .trim()
    .min(1, "Select a product interest.")
    .refine((v) => (productOptions as readonly string[]).includes(v), "Select a product interest from the list."),
  quantity: z
    .string()
    .trim()
    .max(30, "Quantity must be 30 characters or fewer.")
    .refine(
      (v) => v === "" || (/^\d{1,12}([.,]\d{1,3})?$/.test(v) && Number(v.replace(",", ".")) > 0),
      "Enter a positive number, for example 500.",
    )
    .optional(),
  unit: z.union([z.enum(quantityUnits), z.literal("")]).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail (at least 10 characters).")
    .max(2000, "Message must be 2000 characters or fewer."),
  consent: z.boolean().refine((v) => v === true, "Please confirm consent to continue."),
});

// A quantity needs a unit (and a unit needs a quantity) so enquiries are unambiguous.
export const enquirySchema = baseSchema.superRefine((d, ctx) => {
  if (d.quantity && !d.unit) {
    ctx.addIssue({ code: "custom", path: ["unit"], message: "Select a unit for the quantity." });
  }
  if (d.unit && !d.quantity) {
    ctx.addIssue({ code: "custom", path: ["quantity"], message: "Enter a quantity for the selected unit." });
  }
});

export type EnquiryInput = z.infer<typeof baseSchema>;
export type FieldName = keyof EnquiryInput;
export type FieldErrors = Partial<Record<FieldName, string>>;

/** First error message per field. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as FieldName | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export type EnquiryResponse =
  | { status: "sent" }
  | { status: "demo" }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "rate_limited" | "unconfigured" | "failed" | "error"; message: string };

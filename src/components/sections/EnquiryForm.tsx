"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { gsap } from "@/lib/gsap";
import {
  enquirySchema,
  fieldErrors,
  productOptions,
  quantityUnits,
  type EnquiryResponse,
  type FieldErrors,
  type FieldName,
} from "@/lib/enquiry";
import { site } from "@/data/site";

type Status = "idle" | "pending" | "sent" | "demo" | "error";

interface Values {
  fullName: string;
  email: string;
  company: string;
  country: string;
  productInterest: string;
  quantity: string;
  unit: string;
  message: string;
  consent: boolean;
  website: string; // honeypot
}

const empty: Values = {
  fullName: "",
  email: "",
  company: "",
  country: "",
  productInterest: "",
  quantity: "",
  unit: "",
  message: "",
  consent: false,
  website: "",
};

// Line-style control; the lime underline grows on focus (CSS only, no JS while typing).
const control =
  "block w-full min-h-12 border-0 border-b border-cream/25 bg-transparent px-0 py-3 text-base text-cream placeholder:text-cream/35 focus:outline-none aria-[invalid=true]:border-coral";
const underline =
  "relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-lime after:transition-transform after:duration-500 after:ease-out focus-within:after:scale-x-100";

function Field({
  id,
  label,
  required,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-cream/65 transition-colors duration-300 [&:has(~div:focus-within)]:text-lime"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="text-lime">
            {" "}*
          </span>
        ) : (
          <span className="normal-case tracking-normal text-cream/45"> (optional)</span>
        )}
      </label>
      <div className={underline}>{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-coral">
          {error}
        </p>
      )}
    </div>
  );
}

export default function EnquiryForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const pending = status === "pending";

  const set = <K extends keyof Values>(k: K, v: Values[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  const validate = (v: Values) => enquirySchema.safeParse(v);

  // Re-validate a single field when it loses focus (after the first attempt or once touched).
  const blur = (name: FieldName) => {
    const r = validate(values);
    const next = r.success ? {} : fieldErrors(r.error);
    setErrors((e) => ({ ...e, [name]: next[name] }));
  };
  const clearError = (name: FieldName) =>
    errors[name] && setErrors((e) => ({ ...e, [name]: undefined }));

  // Gentle success motion; moves focus to the result for screen readers.
  useEffect(() => {
    if (status !== "sent" && status !== "demo") return;
    const el = resultRef.current;
    if (!el) return;
    el.focus();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el.querySelectorAll("[data-result-in]"),
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 },
      );
      gsap.fromTo(
        el.querySelector("[data-result-check]"),
        { scale: 0.5, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(2)" },
      );
    });
    return () => mm.revert();
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return; // block duplicate submissions
    const r = validate(values);
    if (!r.success) {
      const errs = fieldErrors(r.error);
      setErrors(errs);
      setStatus("idle");
      const first = (Object.keys(errs)[0] as FieldName | undefined);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("pending");
    setServerMessage("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as EnquiryResponse;
      if (data.status === "sent" && res.ok) {
        setValues(empty);
        setStatus("sent");
      } else if (data.status === "demo" && res.ok) {
        setStatus("demo");
      } else if (data.status === "invalid") {
        setErrors(data.errors);
        setStatus("idle");
      } else {
        setServerMessage("message" in data ? data.message : "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setServerMessage("Network problem. Check your connection and try again.");
      setStatus("error");
    }
  }

  const invalid = (n: FieldName) => (errors[n] ? true : undefined);
  const describe = (n: FieldName) => (errors[n] ? `${n}-error` : undefined);

  if (status === "sent" || status === "demo") {
    const demo = status === "demo";
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="flex min-h-[28rem] flex-col justify-center rounded-[2rem] border border-cream/15 bg-cream/[0.04] p-7 outline-none md:p-12"
      >
        <span
          data-result-check
          className={`grid size-14 place-items-center rounded-full ${demo ? "bg-coral" : "bg-lime"} text-forest`}
        >
          <Check className="size-7" aria-hidden="true" />
        </span>
        <h3 data-result-in className="mt-8 font-display text-(length:--text-h2) font-semibold leading-tight text-cream">
          {demo ? "Demo mode: nothing was sent." : "Enquiry received."}
        </h3>
        <p data-result-in className="mt-4 max-w-md text-base leading-relaxed text-cream/75">
          {demo
            ? "Your details passed validation, but email delivery is not configured in this environment, so no enquiry was sent."
            : "Thank you. Your enquiry has been passed to our team."}
        </p>
        <button
          data-result-in
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full border border-cream/30 px-6 text-base text-cream transition-colors hover:border-lime hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
      className="rounded-[2rem] border border-cream/15 bg-cream/[0.04] p-5 md:p-10"
    >
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 md:gap-y-7">
        <Field id="fullName" label="Full name" required error={errors.fullName}>
          <input id="fullName" name="fullName" type="text" autoComplete="name" required maxLength={100}
            value={values.fullName} onChange={(e) => { set("fullName", e.target.value); clearError("fullName"); }}
            onBlur={() => blur("fullName")} aria-invalid={invalid("fullName")} aria-describedby={describe("fullName")}
            className={control} />
        </Field>
        <Field id="email" label="Business email" required error={errors.email}>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254}
            value={values.email} onChange={(e) => { set("email", e.target.value); clearError("email"); }}
            onBlur={() => blur("email")} aria-invalid={invalid("email")} aria-describedby={describe("email")}
            className={control} />
        </Field>
        <Field id="company" label="Company name" required error={errors.company}>
          <input id="company" name="company" type="text" autoComplete="organization" required maxLength={150}
            value={values.company} onChange={(e) => { set("company", e.target.value); clearError("company"); }}
            onBlur={() => blur("company")} aria-invalid={invalid("company")} aria-describedby={describe("company")}
            className={control} />
        </Field>
        <Field id="country" label="Country" required error={errors.country}>
          <input id="country" name="country" type="text" autoComplete="country-name" required maxLength={80}
            value={values.country} onChange={(e) => { set("country", e.target.value); clearError("country"); }}
            onBlur={() => blur("country")} aria-invalid={invalid("country")} aria-describedby={describe("country")}
            className={control} />
        </Field>

        <Field id="productInterest" label="Product interest" required error={errors.productInterest} className="sm:col-span-2">
          <select id="productInterest" name="productInterest" required
            value={values.productInterest} onChange={(e) => { set("productInterest", e.target.value); clearError("productInterest"); }}
            onBlur={() => blur("productInterest")} aria-invalid={invalid("productInterest")} aria-describedby={describe("productInterest")}
            className={`${control} ${values.productInterest ? "" : "text-cream/35"}`}>
            <option value="" className="bg-forest text-cream">Select a category</option>
            {productOptions.map((o) => (
              <option key={o} value={o} className="bg-forest text-cream">{o}</option>
            ))}
          </select>
        </Field>

        <Field id="quantity" label="Estimated quantity" error={errors.quantity}>
          <input id="quantity" name="quantity" type="text" inputMode="decimal" autoComplete="off" maxLength={30}
            placeholder="e.g. 500"
            value={values.quantity} onChange={(e) => { set("quantity", e.target.value); clearError("quantity"); }}
            onBlur={() => blur("quantity")} aria-invalid={invalid("quantity")} aria-describedby={describe("quantity")}
            className={control} />
        </Field>
        <Field id="unit" label="Unit" error={errors.unit}>
          <select id="unit" name="unit" value={values.unit} onChange={(e) => { set("unit", e.target.value); clearError("unit"); clearError("quantity"); }}
            onBlur={() => blur("unit")} aria-invalid={invalid("unit")} aria-describedby={describe("unit")}
            className={`${control} ${values.unit ? "" : "text-cream/35"}`}>
            <option value="" className="bg-forest text-cream">Select unit</option>
            {quantityUnits.map((u) => (
              <option key={u} value={u} className="bg-forest text-cream">{u}</option>
            ))}
          </select>
        </Field>

        <Field id="message" label="Message / product requirements" required error={errors.message} className="sm:col-span-2">
          <textarea id="message" name="message" rows={5} required maxLength={2000}
            value={values.message} onChange={(e) => { set("message", e.target.value); clearError("message"); }}
            onBlur={() => blur("message")} aria-invalid={invalid("message")} aria-describedby={describe("message")}
            className={`${control} resize-y`} />
        </Field>

        {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
            value={values.website} onChange={(e) => set("website", e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-relaxed text-cream/80">
            <input
              type="checkbox" name="consent" required checked={values.consent}
              onChange={(e) => { set("consent", e.target.checked); clearError("consent"); }}
              aria-invalid={invalid("consent")} aria-describedby={describe("consent")}
              className="mt-0.5 size-5 shrink-0 cursor-pointer appearance-none rounded border border-cream/40 bg-transparent checked:border-lime checked:bg-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime aria-[invalid=true]:border-coral"
            />
            <span>
              I agree to Nutraverse processing the information in this form to respond to my enquiry.{" "}
              {site.privacyHref ? (
                <a href={site.privacyHref} className="underline underline-offset-4 hover:text-lime">Privacy policy</a>
              ) : (
                <span className="text-cream/50">(Privacy policy page pending client approval.)</span>
              )}
              <span aria-hidden="true" className="text-lime"> *</span>
            </span>
          </label>
          {errors.consent && (
            <p id="consent-error" className="mt-2 text-sm text-coral">{errors.consent}</p>
          )}
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 rounded-xl border border-coral/50 bg-coral/10 px-4 py-3 text-sm text-cream">
          {serverMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group mt-8 inline-flex min-h-14 w-full items-center justify-between gap-4 rounded-full bg-lime py-2 pl-7 pr-2 text-base font-semibold text-forest transition-colors duration-300 hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime disabled:cursor-wait disabled:opacity-70 md:w-auto md:justify-start md:text-lg"
      >
        {pending ? "Sending…" : "Send enquiry"}
        <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-forest text-lime">
          <ArrowRight className="size-5 transition-transform duration-500 ease-out group-hover:translate-x-1 group-disabled:translate-x-0" />
        </span>
      </button>
    </form>
  );
}

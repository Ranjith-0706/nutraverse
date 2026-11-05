import { enquirySchema, fieldErrors, type EnquiryResponse } from "@/lib/enquiry";

/**
 * POST /api/enquiry
 *
 * Env vars (server only, never exposed to the browser):
 *   RESEND_API_KEY       Resend API key
 *   ENQUIRY_FROM_EMAIL   Sender on a domain verified in Resend, e.g. "Nutraverse <enquiries@your-domain.com>"
 *   ENQUIRY_TO_EMAIL     Inbox that receives enquiries
 *
 * Without all three: development -> demo mode (validates only, nothing sent);
 * production -> 503, the form never claims success.
 */

const MAX_BODY_BYTES = 20_000;

// Basic per-IP limiter. In-memory: per server instance only, and resets on
// cold start. For multi-instance/serverless production use a shared store
// (e.g. Upstash Redis rate limiting) or the host's WAF/rate-limit rules.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

const json = (body: EnquiryResponse, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
// Header-safe single line (prevents header/subject injection).
const oneLine = (s: string) => s.replace(/[\r\n\u0000-\u001f]+/g, " ").trim();

export async function POST(request: Request) {
  // Same-origin only.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json({ status: "error", message: "Request not allowed." }, 403);
    } catch {
      return json({ status: "error", message: "Request not allowed." }, 403);
    }
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ status: "error", message: "Unsupported request." }, 415);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return json({ status: "rate_limited", message: "Too many enquiries. Please try again later." }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ status: "error", message: "Request too large." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ status: "error", message: "Invalid request." }, 400);
  }

  // Honeypot: real users never fill this hidden field. Pretend success, send nothing.
  if (typeof body === "object" && body && typeof (body as { website?: unknown }).website === "string" && (body as { website: string }).website.length > 0) {
    return json({ status: "sent" });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return json({ status: "invalid", errors: fieldErrors(parsed.error) }, 400);
  const d = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const to = process.env.ENQUIRY_TO_EMAIL;
  if (!apiKey || !from || !to) {
    if (process.env.NODE_ENV === "production") {
      console.error("[enquiry] Email is not configured (RESEND_API_KEY / ENQUIRY_FROM_EMAIL / ENQUIRY_TO_EMAIL).");
      return json({ status: "unconfigured", message: "Enquiries are temporarily unavailable. Please try again later." }, 503);
    }
    return json({ status: "demo" });
  }

  const qty = [d.quantity, d.unit].filter(Boolean).join(" ") || "Not specified";
  const lines: [string, string][] = [
    ["Name", d.fullName],
    ["Email", d.email],
    ["Company", d.company],
    ["Country", d.country],
    ["Product interest", d.productInterest],
    ["Estimated quantity", qty],
  ];
  const text = `${lines.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${d.message}\n`;
  const html = `<div style="font-family:system-ui,sans-serif;line-height:1.5"><h2>New export enquiry</h2><table cellpadding="4">${lines
    .map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`)
    .join("")}</table><h3>Message</h3><p style="white-space:pre-wrap">${esc(d.message)}</p></div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: d.email,
        subject: oneLine(`Export enquiry: ${d.company} (${d.country})`).slice(0, 200),
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // Log status only: never the payload or personal data.
      console.error(`[enquiry] Email provider rejected the request (HTTP ${res.status}).`);
      return json({ status: "failed", message: "We could not send your enquiry. Please try again shortly." }, 502);
    }
    return json({ status: "sent" });
  } catch {
    console.error("[enquiry] Email provider request failed.");
    return json({ status: "failed", message: "We could not send your enquiry. Please try again shortly." }, 502);
  }
}

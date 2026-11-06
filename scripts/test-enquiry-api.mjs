// Server-side validation checks for POST /api/enquiry.
// Usage: node scripts/test-enquiry-api.mjs [baseUrl]   (default http://localhost:3000)
// Needs a running server. Sends NO real email: every case is rejected before
// delivery, or the server is unconfigured/in demo mode. Only valid enquiries count
// toward the strict send limit (5 per IP per 10 min), so this suite does not trip it.
const base = process.argv[2] || "http://localhost:3000";
const ok = { fullName: "A B", email: "a@b.co", company: "Co", country: "X", productInterest: "Sports Nutrition", quantity: "", unit: "", message: "Hello there, interested.", consent: true, website: "" };
const cases = [
  ["empty body rejected", {}, 400, (d) => d.errors.fullName && d.errors.email && d.errors.consent],
  ["empty strings rejected", { ...ok, fullName: "", company: "", country: "", message: "" }, 400, (d) => d.errors.fullName && d.errors.company && d.errors.country && d.errors.message],
  ["invalid email rejected", { ...ok, email: "not-an-email" }, 400, (d) => d.errors.email],
  ["consent false rejected", { ...ok, consent: false }, 400, (d) => d.errors.consent],
  ["unknown product rejected", { ...ok, productInterest: "Nope" }, 400, (d) => d.errors.productInterest],
  ["negative quantity rejected", { ...ok, quantity: "-5", unit: "kg" }, 400, (d) => d.errors.quantity],
  ["text quantity rejected", { ...ok, quantity: "lots", unit: "kg" }, 400, (d) => d.errors.quantity],
  ["zero quantity rejected", { ...ok, quantity: "0", unit: "kg" }, 400, (d) => d.errors.quantity],
  ["quantity without unit rejected", { ...ok, quantity: "500", unit: "" }, 400, (d) => d.errors.unit],
  ["overlong message rejected", { ...ok, message: "x".repeat(2001) }, 400, (d) => d.errors.message],
];
let failed = 0;
for (const [name, body, status, check] of cases) {
  const res = await fetch(`${base}/api/enquiry`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await res.json();
  const pass = res.status === status && check(d);
  if (!pass) failed++;
  console.log(pass ? "PASS" : "FAIL", name, res.status, JSON.stringify(d).slice(0, 120));
}
process.exit(failed ? 1 : 0);

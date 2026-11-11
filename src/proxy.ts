import { NextResponse, type NextRequest } from "next/server";
import { products } from "@/data/catalogue";

// The product page streams, which fixes its HTTP status at 200 before notFound()
// can run. Unknown slugs are rejected here so crawlers receive a real 404.
// (The page still calls notFound() as a safety net.)
const slugs = new Set(products.map((p) => p.slug));

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  let decoded = slug;
  try {
    decoded = slug && decodeURIComponent(slug);
  } catch {
    // Malformed percent-encoding can never match a slug.
  }
  if (slug && !slugs.has(decoded)) {
    return NextResponse.rewrite(new URL("/_nv-product-not-found", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: "/products/:slug" };

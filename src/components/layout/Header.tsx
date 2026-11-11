import Link from "next/link";

export default function Header() {
  return (
    <header
      // Revealed by the homepage hero intro; plain and visible on other routes.
      data-site-header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-forest/85 px-5 py-4 backdrop-blur-md md:bg-transparent md:backdrop-blur-none md:px-12 md:py-7"
    >
      <Link
        href="/"
        className="font-display text-xl font-semibold tracking-tight text-cream"
        aria-label="Nutraverse home"
      >
        Nutraverse<span className="text-lime">.</span>
      </Link>
      <Link
        href="/products"
        className="ml-auto mr-3 hidden min-h-11 items-center px-2 text-sm font-medium text-cream transition-colors hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime min-[400px]:inline-flex md:mr-5"
      >
        Products
      </Link>
      <Link
        href="/#contact"
        className="inline-flex min-h-11 items-center rounded-full border border-cream/25 bg-forest/30 px-4 text-sm font-medium text-cream backdrop-blur-md transition-colors duration-300 hover:border-lime hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:px-5"
      >
        Get in touch
      </Link>
    </header>
  );
}

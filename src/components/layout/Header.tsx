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
        className="ml-auto mr-0.5 inline-flex min-h-11 items-center px-1.5 text-sm min-[400px]:px-2 font-medium text-cream transition-colors hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime min-[400px]:mr-3 md:mr-2"
      >
        Products
      </Link>
      <Link
        href="/about"
        className="mr-2 hidden min-h-11 items-center px-2 text-sm font-medium text-cream transition-colors hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:inline-flex"
      >
        About
      </Link>
      <Link
        href="/quality"
        className="mr-2 hidden min-h-11 items-center px-2 text-sm font-medium text-cream transition-colors hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:inline-flex"
      >
        Quality
      </Link>
      <Link
        href="/#contact"
        className="inline-flex min-h-11 items-center rounded-full border border-cream/25 bg-forest/30 whitespace-nowrap px-2.5 text-[13px] min-[400px]:px-4 min-[400px]:text-sm font-medium text-cream backdrop-blur-md transition-colors duration-300 hover:border-lime hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:px-5"
      >
        Get in touch
      </Link>
    </header>
  );
}

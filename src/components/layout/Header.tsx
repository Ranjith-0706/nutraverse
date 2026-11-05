export default function Header() {
  return (
    <header
      data-hero-fade
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 md:py-7"
    >
      <a
        href="#"
        className="font-display text-xl font-semibold tracking-tight text-cream"
        aria-label="Nutraverse home"
      >
        Nutraverse<span className="text-lime">.</span>
      </a>
      <a
        href="#contact"
        className="rounded-full border border-cream/25 bg-forest/30 px-5 py-2 text-sm font-medium text-cream backdrop-blur-md transition-colors duration-300 hover:border-lime hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
      >
        Get in touch
      </a>
    </header>
  );
}

export default function Eyebrow({
  children,
  tone = "dark",
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  /** "dark" = on forest, "light" = on cream. */
  tone?: "dark" | "light";
  className?: string;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  const colours = tone === "dark" ? "border-lime/40 text-lime" : "border-forest/30 text-forest";
  return (
    <p
      {...rest}
      className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] md:text-sm ${colours} ${className}`}
    >
      <span className={`size-2 rounded-full ${tone === "dark" ? "bg-lime" : "bg-coral"}`} />
      {children}
    </p>
  );
}

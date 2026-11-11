interface FilterOption {
  id: string;
  label: string;
}

/** Accessible filter buttons (toggle buttons with aria-pressed). Wraps on small screens. */
export default function ProductFilter({
  options,
  active,
  onChange,
}: {
  options: readonly FilterOption[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="group" aria-label="Filter products by category" className="flex flex-wrap gap-2 md:gap-3">
      {options.map((o) => {
        const on = o.id === active;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.id)}
            className={`min-h-11 rounded-full border px-5 text-sm font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:text-base ${
              on
                ? "border-lime bg-lime text-forest"
                : "border-cream/25 text-cream hover:border-lime hover:text-lime"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

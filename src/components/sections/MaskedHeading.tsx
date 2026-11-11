interface Word {
  text: string;
  accent?: "lime" | "coral";
}

const accent = { lime: "text-lime", coral: "text-coral" } as const;

/** Word-masked heading. Animated by the parent through [data-mh-word]. */
export default function MaskedHeading({
  id,
  as: Tag = "h2",
  words,
  className = "",
}: {
  id?: string;
  /** Use "h1" for the page title. */
  as?: "h1" | "h2";
  words: readonly Word[];
  className?: string;
}) {
  const text = words.map((w) => w.text).join(" ");
  return (
    <Tag id={id} data-mh aria-label={text} className={className}>
      {words.map((w, i) => (
        <span
          key={`${w.text}-${i}`}
          aria-hidden="true"
          className="mr-[0.22em] inline-block overflow-hidden pb-[0.2em] align-bottom"
        >
          <span
            data-mh-word
            className={`inline-block ${w.accent ? accent[w.accent] : ""}`}
          >
            {w.text}
          </span>
        </span>
      ))}
    </Tag>
  );
}

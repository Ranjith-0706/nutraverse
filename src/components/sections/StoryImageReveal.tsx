import Image from "next/image";

interface StoryImageRevealProps {
  src: string;
  alt: string;
}

/**
 * Presentational only. The scroll-linked reveal is driven by BrandStory via
 * the data-bs-* hooks below. With no JS or reduced motion this renders as a
 * plain, fully visible rounded image.
 */
export default function StoryImageReveal({ src, alt }: StoryImageRevealProps) {
  return (
    <figure
      data-bs-image
      className="relative mx-5 aspect-[4/3] md:mx-6 md:aspect-auto md:h-[85svh]"
    >
      {/* Frame: clip-path target on desktop. Rounded + clipped by default. */}
      <div
        data-bs-frame
        className="absolute inset-0 overflow-hidden rounded-3xl bg-forest md:rounded-[2rem]"
      >
        {/* Parallax layer (bleeds vertically so it can drift) */}
        <div
          data-bs-par
          className="absolute inset-x-0 -inset-y-[8%] will-change-transform md:-inset-y-[10%]"
        >
          {/* Scale layer */}
          <div data-bs-img className="absolute inset-0">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 768px) calc(100vw - 48px), calc(100vw - 40px)"
              className="object-cover object-[75%_center] md:object-center"
            />
          </div>
        </div>
        {/* Gentle edge shading for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent" />
      </div>
    </figure>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  bordersPath,
  indiaPath,
  landPath,
  project,
} from "@/data/worldMap";
import {
  mapContent,
  mapDestinations,
  mapOrigin,
  type MapPoint,
} from "@/data/globalExport";

/**
 * Phones get a cropped 4:3 window of the SAME map (Europe, Africa, Asia, Australia).
 * Everything (land, routes, markers) is positioned against this one viewBox, so
 * alignment is identical to desktop. Points outside the window are listed in text.
 */
type View = { x: number; y: number; w: number; h: number };
const FULL: View = { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT };
const COMPACT: View = { x: 431, y: 15, w: 486, h: 365 };
const inView = (v: View, [x, y]: [number, number]) =>
  x >= v.x && x <= v.x + v.w && y >= v.y && y <= v.y + v.h;

const mq = "(max-width: 767.98px)";
const subscribeCompact = (cb: () => void) => {
  const m = window.matchMedia(mq);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** Curved route (quadratic Bezier) between two projected points, bowed upward. */
function arc(from: [number, number], to: [number, number]) {
  const [x0, y0] = from;
  const [x1, y1] = to;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.hypot(dx, dy) || 1;
  let nx = dy / dist;
  let ny = -dx / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bow = dist * 0.28;
  const cx = (x0 + x1) / 2 + nx * bow;
  const cy = (y0 + y1) / 2 + ny * bow;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

function Marker({
  point,
  tag,
  active,
  setActive,
  origin = false,
  view,
}: {
  point: MapPoint;
  tag: string;
  active: string | null;
  setActive: (id: string | null) => void;
  origin?: boolean;
  view: View;
}) {
  const [x, y] = project(point.lon, point.lat);
  const left = ((x - view.x) / view.w) * 100;
  const top = ((y - view.y) / view.h) * 100;
  const open = active === point.id;
  const tipId = `tip-${point.id}`;
  const horiz =
    left < 22 ? "left-0" : left > 78 ? "right-0" : "left-1/2 -translate-x-1/2";
  const vert = top < 35 ? "top-full mt-1" : "bottom-full mb-1";
  return (
    <div
      data-wm-marker
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      <button
        type="button"
        aria-label={`${point.label}. ${tag}. Illustrative.`}
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={() => setActive(point.id)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(point.id)}
        onBlur={() => setActive(null)}
        onClick={() => setActive(point.id)}
        className="relative grid size-10 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:size-11"
      >
        <span
          aria-hidden="true"
          className={`absolute size-3 rounded-full opacity-60 motion-safe:animate-ping md:size-4 ${origin ? "bg-coral" : "bg-lime"}`}
        />
        <span
          aria-hidden="true"
          className={`relative size-2.5 rounded-full ring-2 ring-forest md:size-3 ${origin ? "bg-coral shadow-[0_0_14px_3px_rgb(255_121_79/0.7)]" : "bg-lime shadow-[0_0_14px_3px_rgb(198_243_107/0.7)]"}`}
        />
      </button>
      {open && (
        <div
          id={tipId}
          role="tooltip"
          className={`pointer-events-none absolute z-20 w-max max-w-[12rem] rounded-xl bg-cream px-3 py-2 text-left text-xs leading-snug text-forest shadow-lg md:max-w-[14rem] md:text-sm ${horiz} ${vert}`}
        >
          <strong className="block font-semibold">{point.label}</strong>
          <span className="text-forest/75">{point.note}</span>
        </div>
      )}
    </div>
  );
}

export default function WorldMap() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const compact = useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia(mq).matches,
    () => false,
  );
  const view = compact ? COMPACT : FULL;

  const origin = useMemo(() => project(mapOrigin.lon, mapOrigin.lat), []);
  const visible = useMemo(
    () =>
      mapDestinations.filter(
        (d) => !compact || inView(COMPACT, project(d.lon, d.lat)),
      ),
    [compact],
  );
  const routes = useMemo(
    () =>
      visible.map((d) => ({
        id: d.id,
        d: arc(origin, project(d.lon, d.lat)),
      })),
    [origin, visible],
  );

  // Escape closes a pinned tooltip; tapping elsewhere closes it on touch.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-wm-marker]")) setActive(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    const stage = {
      trigger: "[data-wm-stage]",
      start: "top 70%",
      toggleActions: "play none none none",
    };

    // All sizes: map fades in, routes draw (pathLength=1 keeps dash maths unit based).
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-wm-land]",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1.2, ease: "power2.out", scrollTrigger: stage },
      );
      gsap.fromTo(
        "[data-wm-route]",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
          stagger: 0.12,
          scrollTrigger: stage,
        },
      );
      gsap.fromTo(
        "[data-wm-marker]",
        { autoAlpha: 0, scale: 0.4 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.15,
          delay: 0.6,
          scrollTrigger: stage,
        },
      );
    });

    // Desktop only: subtle map parallax + a travelling light along each route.
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.fromTo(
          "[data-wm-parallax]",
          { yPercent: 3 },
          {
            yPercent: -3,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-wm-stage]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        const paths = gsap.utils.toArray<SVGPathElement>("[data-wm-route-base]");
        const dots = gsap.utils.toArray<SVGCircleElement>("[data-wm-dot]");
        const loops = paths.map((p, i) => {
          const len = p.getTotalLength();
          const state = { t: 0 };
          return gsap.to(state, {
            t: 1,
            duration: 3.2,
            delay: 2.4 + i * 0.5,
            repeat: -1,
            repeatDelay: 1.5,
            ease: "power1.inOut",
            paused: true,
            onUpdate: () => {
              const pt = p.getPointAtLength(len * state.t);
              gsap.set(dots[i], {
                attr: { cx: pt.x, cy: pt.y },
                opacity: Math.sin(state.t * Math.PI),
              });
            },
          });
        });
        // Only run while the map is on screen.
        const st = ScrollTrigger.create({
          trigger: "[data-wm-stage]",
          start: "top 80%",
          end: "bottom 10%",
          onEnter: () => loops.forEach((l) => l.play()),
          onEnterBack: () => loops.forEach((l) => l.play()),
          onLeave: () => loops.forEach((l) => l.pause()),
          onLeaveBack: () => loops.forEach((l) => l.pause()),
        });
        return () => {
          st.kill();
          loops.forEach((l) => l.kill());
        };
      },
    );

    return () => mm.revert();
  }, [compact]);

  return (
    <div ref={root} className="mx-auto w-full min-w-0 max-w-[90rem] px-5 md:px-12">
      <div data-wm-stage className="relative">
        <div data-wm-parallax className="relative">
          <svg
            viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
            role="img"
            aria-labelledby="wm-title wm-desc"
            className="block h-auto w-full overflow-hidden rounded-3xl bg-cream/[0.03] md:rounded-none md:bg-transparent"
          >
            <title id="wm-title">{mapContent.title}</title>
            <desc id="wm-desc">
              {mapContent.disclaimer} Curved lines connect an illustrative origin
              to example destinations:{" "}
              {mapDestinations.map((d) => d.label).join(", ")}.
            </desc>
            <g data-wm-land>
              <path d={landPath} fill="rgb(244 240 230 / 0.07)" />
              <path
                d={bordersPath}
                fill="none"
                stroke="rgb(244 240 230 / 0.14)"
                strokeWidth="0.5"
              />
              <path
                d={indiaPath}
                fill="rgb(198 243 107 / 0.22)"
                stroke="rgb(198 243 107 / 0.7)"
                strokeWidth="0.8"
              />
            </g>
            {routes.map((r) => (
              <g key={r.id} fill="none" strokeLinecap="round">
                {/* Soft glow underlay */}
                <path
                  d={r.d}
                  pathLength={1}
                  data-wm-route
                  stroke="rgb(198 243 107 / 0.18)"
                  strokeWidth="5"
                  strokeDasharray="1"
                />
                {/* Crisp route line */}
                <path
                  d={r.d}
                  pathLength={1}
                  data-wm-route
                  data-wm-route-base
                  stroke="#C6F36B"
                  strokeWidth="1.3"
                  strokeDasharray="1"
                />
              </g>
            ))}
            {routes.map((r) => (
              <circle
                key={r.id}
                data-wm-dot
                r="2.6"
                cx={origin[0]}
                cy={origin[1]}
                fill="#F4F0E6"
                opacity="0"
              />
            ))}
          </svg>

          <Marker
            point={mapOrigin}
            tag={mapContent.originTag}
            active={active}
            setActive={setActive}
            origin
            view={view}
          />
          {visible.map((d) => (
            <Marker
              key={d.id}
              point={d}
              tag={mapContent.destinationTag}
              active={active}
              setActive={setActive}
              view={view}
            />
          ))}
        </div>
      </div>

      {/* Text alternative: always visible, nothing depends on hover */}
      <div className="mt-8 md:mt-12">
        <p className="max-w-2xl text-sm leading-relaxed text-cream/70 md:text-base">
          {mapContent.disclaimer}
        </p>
        <ul
          className="mt-6 flex flex-wrap gap-2 md:gap-3"
          aria-label="Example destinations (illustrative)"
        >
          <li className="rounded-3xl bg-coral px-4 py-2 text-sm font-medium text-forest">
            {mapOrigin.label} · {mapContent.originTag}
          </li>
          {mapDestinations.map((d) => (
            <li
              key={d.id}
              className="rounded-3xl border border-cream/25 px-4 py-2 text-sm text-cream"
            >
              {d.label} ·{" "}
              <span className="text-cream/60">
                {visible.includes(d) ? "example" : "example, outside map view"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

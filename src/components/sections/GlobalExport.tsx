import GlobalIntro from "./GlobalIntro";
import WorldMap from "./WorldMap";
import ExportProcess from "./ExportProcess";
import PartnershipCTA from "./PartnershipCTA";

/**
 * Dark "sheet" that overlaps the bottom of the cream Brand Story with rounded
 * top corners (pure CSS transition). Composition only; each part owns its motion.
 */
export default function GlobalExport() {
  return (
    <div
      id="global"
      className="relative z-20 -mt-10 overflow-x-clip rounded-t-[2.5rem] bg-forest text-cream md:-mt-20 md:rounded-t-[4rem]"
    >
      <section aria-labelledby="global-heading">
        <GlobalIntro />
        <WorldMap />
      </section>
      <ExportProcess />
      <PartnershipCTA />
    </div>
  );
}

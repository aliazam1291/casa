import { WorldMoodProvider } from "@/components/three/vase-hero/WorldMoodProvider";
import { GalleryHero } from "@/components/three/gallery/GalleryHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { CatalogueGrid } from "@/components/sections/CatalogueGrid";
import { Gallery } from "@/components/sections/Gallery";
import { Stats } from "@/components/sections/Stats";
import { Sojourn } from "@/components/sections/Sojourn";
import { Journal } from "@/components/sections/Journal";
import { Footer } from "@/components/footer/Footer";

// Order follows the buyer's actual question sequence: what is it (hero) ->
// what does it contain (composition) -> what's it built from (catalogue) ->
// individual proof (named pieces) -> credibility (stats) -> how it happens
// (sojourn) -> depth (journal) -> act (footer).
// Worlds moved to /the-wolf-way as anchored sections (it's the section that
// most read as abstract, and it occupied the slot the catalogue needed).
// Ticker dropped — a fourth abstract beat carrying no real information.
// FloorPlans dropped — no architectural floor-plan diagrams on the site,
// per explicit instruction; /rooms still lists all thirteen rooms directly.
//
// The immersive gallery hero is the single heavy WebGL context on the page —
// the Composed Room diorama (a second three/R3F context) was removed to avoid
// GPU context contention and to consolidate on the stronger gallery moment.
// Its components remain under components/three/composed-room if needed later.
export default function Home() {
  return (
    <WorldMoodProvider>
      <GalleryHero />
      <Manifesto />
      <CatalogueGrid />
      <Gallery />
      <Stats />
      <Sojourn />
      <Journal />
      <Footer />
    </WorldMoodProvider>
  );
}

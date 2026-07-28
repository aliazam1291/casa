import { WorldMoodProvider } from "@/components/three/vase-hero/WorldMoodProvider";
import { GalleryHero } from "@/components/three/gallery/GalleryHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { DomeGallery } from "@/components/sections/DomeGallery";
import { VillaSection } from "@/components/three/villa-section/VillaSection";
import { FloorPlans } from "@/components/sections/FloorPlans";
import { MaterialsBoard } from "@/components/sections/MaterialsBoard";
import { CatalogueGrid } from "@/components/sections/CatalogueGrid";
import { Gallery } from "@/components/sections/Gallery";
import { Stats } from "@/components/sections/Stats";
import { Sojourn } from "@/components/sections/Sojourn";
import { Journal } from "@/components/sections/Journal";

// Order follows the buyer's actual question sequence: what is it (hero) ->
// prove it, interactively (dome) -> what does it contain (rooms) -> what's
// it built from (materials, catalogue) -> individual proof (named pieces) ->
// credibility (stats) -> how it happens (sojourn) -> depth (journal) -> act
// (footer). Two heavy interactive beats (the 3D hero, then the dome) are
// deliberately kept close, split only by the manifesto's quiet text beat —
// the flatter browse/list sections (floor plans, materials, catalogue,
// masonry gallery) are grouped afterward as one long "browse" stretch rather
// than interrupted by another set-piece.
// Worlds moved to /the-wolf-way as anchored sections (it's the section that
// most read as abstract, and it occupied the slot the catalogue needed).
// Ticker dropped — a fourth abstract beat carrying no real information.
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
      <DomeGallery />
      <VillaSection />
      <FloorPlans />
      <MaterialsBoard />
      <CatalogueGrid />
      <Gallery />
      <Stats />
      <Sojourn />
      <Journal />
    </WorldMoodProvider>
  );
}

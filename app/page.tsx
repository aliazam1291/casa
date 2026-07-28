import { WorldMoodProvider } from "@/components/three/vase-hero/WorldMoodProvider";
import { GalleryHero } from "@/components/three/gallery/GalleryHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { CatalogueGrid } from "@/components/sections/CatalogueGrid";
import { Gallery } from "@/components/sections/Gallery";
import { Stats } from "@/components/sections/Stats";
import { Sojourn } from "@/components/sections/Sojourn";
import { Journal } from "@/components/sections/Journal";

// The landing page stays to a single scroll's worth of beats: what it is
// (hero) -> the doctrine (manifesto) -> what it's built from (catalogue) ->
// individual proof (named pieces) -> credibility (stats) -> how it happens
// (sojourn) -> depth (journal) -> act (footer).
//
// The heavier interactive set-pieces — the Dome, the exploded Villa
// section, the flat floor-plan blueprints and the materials board — moved
// to /rooms, which is where a visitor actually goes to go deep on the
// rooms themselves; the homepage's job is to get them there, not to hold
// everything at once.
//
// The immersive gallery hero is the single heavy WebGL context on this page —
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
    </WorldMoodProvider>
  );
}

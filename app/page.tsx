import { WorldMoodProvider } from "@/components/three/vase-hero/WorldMoodProvider";
import { GalleryHero } from "@/components/three/gallery/GalleryHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { FloorPlans } from "@/components/sections/FloorPlans";
import { Stats } from "@/components/sections/Stats";
import { Worlds } from "@/components/sections/Worlds";
import { Gallery } from "@/components/sections/Gallery";
import { Sojourn } from "@/components/sections/Sojourn";
import { Ticker } from "@/components/sections/Ticker";
import { Journal } from "@/components/sections/Journal";
import { Footer } from "@/components/footer/Footer";

// The immersive gallery hero is the single heavy WebGL context on the page —
// the Composed Room diorama (a second three/R3F context) was removed to avoid
// GPU context contention and to consolidate on the stronger gallery moment.
// Its components remain under components/three/composed-room if needed later.
export default function Home() {
  return (
    <WorldMoodProvider>
      <GalleryHero />
      <Manifesto />
      <FloorPlans />
      <Stats />
      <Worlds />
      <Gallery />
      <Sojourn />
      <Ticker />
      <Journal />
      <Footer />
    </WorldMoodProvider>
  );
}

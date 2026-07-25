import { WorldMoodProvider } from "@/components/three/vase-hero/WorldMoodProvider";
import { VaseHero } from "@/components/three/vase-hero/VaseHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { ComposedRoomSection } from "@/components/three/composed-room/ComposedRoomSection";
import { Stats } from "@/components/sections/Stats";
import { Worlds } from "@/components/sections/Worlds";
import { Gallery } from "@/components/sections/Gallery";
import { Sojourn } from "@/components/sections/Sojourn";
import { Ticker } from "@/components/sections/Ticker";
import { Journal } from "@/components/sections/Journal";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <WorldMoodProvider>
      <VaseHero />
      <Manifesto />
      <ComposedRoomSection />
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

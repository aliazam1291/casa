import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialExplorer } from "@/components/editorial/EditorialExplorer";
import { WayOfLightForm } from "@/components/editorial/WayOfLightForm";
import { TheWolfWay } from "@/components/editorial/TheWolfWay";
import { ExperiencesPage } from "@/components/editorial/ExperiencesPage";
import { JournalIndex } from "@/components/editorial/JournalIndex";
import { TheHouse } from "@/components/editorial/TheHouse";
import { TradeDesk } from "@/components/editorial/TradeDesk";
import { VisitPage } from "@/components/editorial/VisitPage";
import { ConsultationPage } from "@/components/editorial/ConsultationPage";
import { SojournJourney } from "@/components/editorial/SojournJourney";
import { MaterialsLibrary } from "@/components/editorial/MaterialsLibrary";
import { SITE_PAGES } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string[] }> };

const CUSTOM_LAYOUTS: Record<string, () => React.JSX.Element> = {
  "way-of-light-form": WayOfLightForm,
  "the-wolf-way": TheWolfWay,
  experiences: ExperiencesPage,
  journal: JournalIndex,
  "the-house": TheHouse,
  trade: TradeDesk,
  visit: VisitPage,
  "experiences/consultation": ConsultationPage,
  "experiences/furniture-tourism": SojournJourney,
  "experiences/materials-library": MaterialsLibrary,
};

export function generateStaticParams() {
  return Object.keys(SITE_PAGES).map((key) => ({ slug: key.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = (await params).slug.join("/");
  const page = resolvePage(key);
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${key}` }, openGraph: { title: page.title, description: page.description, images: [{ url: page.image, alt: page.imageAlt }] } };
}

export default async function EditorialRoute({ params }: Props) {
  const key = (await params).slug.join("/");
  const page = resolvePage(key);
  if (!page) notFound();
  const Layout = CUSTOM_LAYOUTS[key];
  if (Layout) return <Layout />;
  return <EditorialExplorer page={page} />;
}

// Only exact SITE_PAGES keys resolve here now. /journal/[slug], /rooms/[slug],
// /pieces/[slug] and /catalogue/** are real routes (see app/journal/[slug],
// app/rooms/[slug], app/pieces/[slug], app/catalogue/**) that Next.js matches
// before this catch-all. /the-wolf-way/{world} and /the-wolf-way/object/*
// previously fell back to this page's parent content under a duplicate,
// self-referencing canonical — next.config.ts now redirects those instead.
function resolvePage(key: string) {
  return SITE_PAGES[key];
}

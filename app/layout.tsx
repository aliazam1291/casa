import type { Metadata } from "next";
import { Cormorant, Jost } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { StageProvider } from "@/components/stage/StageProvider";
import { StageBackground } from "@/components/stage/StageBackground";
import { Spotlight } from "@/components/chrome/Spotlight";
import { Nav } from "@/components/nav/Nav";
import { CONTACT } from "@/lib/contact";

// Cormorant (display/voice — headlines, pull-quotes, italic accent) + Jost
// (system/labels — labels, captions, specs, interface): the Brand Book's
// two-role type system. ("Posterama," the book's third, display-only face
// for the wordmark and composition names, is a licensed face we don't have
// access to — dropped per the client's own call; Jost at display scale
// carries those roles instead.)
const archivo = Jost({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wolfcasa.in"),
  keywords: ["composed interiors India", "modern Indian living", "interior design Indore", "furniture sourcing", "Wolf Casa", "The Interio Mall"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_IN", siteName: "Wolf Casa", images: [{ url: "/images/editorial/villa-hero.png", width: 1800, height: 1013, alt: "Wolf Casa contemporary Indian residence" }] },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  title: "Wolf Casa — Way of Light & Form",
  description:
    "A room is not furnished. It is composed. Thirteen complete rooms, one house — Indore, India, established 2024.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HomeGoodsStore",
              name: "Wolf Casa",
              url: "https://wolfcasa.in",
              description: "The Interio Mall for composed living — furniture, materials, lighting and greenery brought together as complete rooms.",
              foundingDate: String(CONTACT.founded),
              address: {
                "@type": "PostalAddress",
                streetAddress: CONTACT.showroom.line1,
                addressLocality: CONTACT.city,
                addressRegion: CONTACT.region,
                addressCountry: "IN",
              },
              ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}),
              ...(CONTACT.email ? { email: CONTACT.email } : {}),
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <StageProvider>
          <CursorProvider>
            <StageBackground />
            <div className="grain" aria-hidden />
            <Spotlight />
            <CustomCursor />
            <Nav />
            {children}
          </CursorProvider>
        </StageProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cormorant, Jost } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { StageProvider } from "@/components/stage/StageProvider";
import { StageBackground } from "@/components/stage/StageBackground";
import { Spotlight } from "@/components/chrome/Spotlight";
import { Splash } from "@/components/splash/Splash";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { CONTACT } from "@/lib/contact";

// The Brand Book's type system: Cormorant (display/voice — headlines,
// pull-quotes, the italic accent) + Jost (system/labels — labels, captions,
// specs, interface).
//
// The book's third role is POSTERAMA 2001 — signature word only (the
// wordmark and the composition names set large), never body copy. Posterama
// is a licensed Adobe typeface and can't be fetched here, so `--font-display`
// currently falls back to Jost, which is the closest thing already in the
// stack (both are geometric/Futura-derived, so the letterforms are related).
//
// TO DROP IN THE REAL POSTERAMA 2001: put the woff2 files in app/fonts/ and
// replace the `displayFont` const below with:
//   import localFont from "next/font/local";
//   const displayFont = localFont({
//     variable: "--font-display",
//     src: [{ path: "./fonts/Posterama2001-Light.woff2", weight: "300" }],
//   });
// Nothing else needs to change — every consumer already reads var(--display).
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

// Placeholder for the Posterama 2001 slot — see note above.
const displayFont = Jost({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
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
    <html lang="en" className={`${archivo.variable} ${cormorant.variable} ${displayFont.variable}`} suppressHydrationWarning>
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
            <Splash />
            <StageBackground />
            {/* Two stacked material layers over the whole site: a pebbled
                hide, then film grain on top of it. Both are fixed, blended
                and pointer-transparent, so every section — whatever its own
                background — sits on leather rather than flat black. */}
            <div className="hide" aria-hidden />
            <div className="grain" aria-hidden />
            <Spotlight />
            <CustomCursor />
            <Nav />
            {children}
            {/* Global: the footer used to render only inside app/page.tsx, so
                /rooms, /catalogue, /pieces, /journal and every editorial route
                ended with no footer at all. */}
            <Footer />
          </CursorProvider>
        </StageProvider>
      </body>
    </html>
  );
}

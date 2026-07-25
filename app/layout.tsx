import type { Metadata } from "next";
import { Archivo, Cormorant } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { StageProvider } from "@/components/stage/StageProvider";
import { StageBackground } from "@/components/stage/StageBackground";
import { Spotlight } from "@/components/chrome/Spotlight";
import { Nav } from "@/components/nav/Nav";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wolf Casa — Way of Light & Form",
  description:
    "Luxury interiors, carefully composed. A gallery of light and form — Indore, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
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

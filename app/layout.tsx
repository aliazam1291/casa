import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { StageProvider } from "@/components/stage/StageProvider";
import { StageBackground } from "@/components/stage/StageBackground";
import { Nav } from "@/components/nav/Nav";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["200", "300", "400"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wolf Casa — Way of Light & Form",
  description: "Modern Indian living, carefully composed. Indore, Central India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plexMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body>
        <StageProvider>
          <CursorProvider>
            <StageBackground />
            <CustomCursor />
            <Nav />
            {children}
          </CursorProvider>
        </StageProvider>
      </body>
    </html>
  );
}

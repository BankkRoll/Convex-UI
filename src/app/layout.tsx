import "@/styles/globals.css";

import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "./Providers";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  applicationName: "Convex UI Library",
  title: "Convex UI Library",
  description: "A library of reactive UI components powered by Convex",
  metadataBase: new URL("https://convex-ui.vercel.app"),
  icons: BASE_PATH,
  openGraph: {
    type: "article",
    authors: "Convex",
    url: `${BASE_PATH}`,
    images: `${BASE_PATH}/convex-og-image.png`,
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    site: "@convex",
    creator: "@bankkroll_eth",
    images: `${BASE_PATH}/convex-og-image.png`,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Google Fonts URL with all theme fonts
const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?display=swap" +
  // Sans-serif fonts
  "&family=Inter:wght@400;500;600;700" +
  "&family=Roboto:wght@400;500;700" +
  "&family=Poppins:wght@400;500;600;700" +
  "&family=Montserrat:wght@400;500;600;700" +
  "&family=Plus+Jakarta+Sans:wght@400;500;600;700" +
  "&family=DM+Sans:wght@400;500;700" +
  "&family=Open+Sans:wght@400;500;600;700" +
  "&family=Quicksand:wght@400;500;600;700" +
  "&family=Outfit:wght@400;500;600;700" +
  "&family=Oxanium:wght@400;500;600;700" +
  // Serif fonts
  "&family=Source+Serif+4:wght@400;500;600;700" +
  "&family=Lora:wght@400;500;600;700" +
  "&family=Playfair+Display:wght@400;500;600;700" +
  "&family=Merriweather:wght@400;700" +
  "&family=Libre+Baskerville:wght@400;700" +
  // Monospace fonts
  "&family=JetBrains+Mono:wght@400;500;600;700" +
  "&family=Fira+Code:wght@400;500;600;700" +
  "&family=Roboto+Mono:wght@400;500;700" +
  "&family=Space+Mono:wght@400;700" +
  "&family=IBM+Plex+Mono:wght@400;500;600;700" +
  "&family=Ubuntu+Mono:wght@400;700" +
  "&family=Source+Code+Pro:wght@400;500;600;700";

export default async function Layout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

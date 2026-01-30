import "@/styles/globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "./Providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
    images: `${BASE_PATH}/img/convex-og-image.png`,
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    site: "@convaborathq",
    creator: "@convexdev",
    images: `${BASE_PATH}/img/convex-og-image.png`,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          themes={["dark", "light", "classic-dark"]}
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

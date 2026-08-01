import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { organizationSchema } from "@/lib/structured-data";
import { getGlobal } from "@/lib/strapi";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Site-wide defaults come from the Global single type, so an editor can
 * change the site name or default description without a deploy. Individual
 * pages override these with their own seo component.
 */
export async function generateMetadata(): Promise<Metadata> {
  const global = await getGlobal();

  return {
    title: {
      default: global?.defaultSeo?.metaTitle ?? global?.siteName ?? "ContentForge Studio",
      template: `%s | ${global?.siteName ?? "ContentForge Studio"}`,
    },
    description: global?.defaultSeo?.metaDescription ?? undefined,
    robots: global?.defaultSeo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const global = await getGlobal();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-neutral-900">
        {/* Keyboard users land here first and can jump past the navigation.
            It is visually hidden until focused. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>

        {/* Organization is emitted once, in the layout, because every other
            schema on the site references it by id. */}
        <JsonLd data={organizationSchema(global)} />

        <SiteHeader global={global} />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <SiteFooter global={global} />
      </body>
    </html>
  );
}

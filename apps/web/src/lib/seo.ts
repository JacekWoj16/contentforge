import type { Metadata } from "next";

import { mediaUrl } from "@/lib/media";
import type { Seo } from "@/types/cms";

/**
 * Turns the CMS seo component into Next metadata.
 *
 * The title is absolute, which bypasses the template set in the root
 * layout. Editors write the full title in the CMS, so appending the site
 * name again would duplicate it.
 */
export function metadataFromSeo(
  seo: Seo | null | undefined,
  fallbackTitle: string,
): Metadata {
  const title = seo?.metaTitle ?? fallbackTitle;
  const description = seo?.metaDescription;

  return {
    title: seo?.metaTitle ? { absolute: seo.metaTitle } : fallbackTitle,
    description,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: seo?.ogImage
        ? [
            {
              url: mediaUrl(seo.ogImage.url),
              width: seo.ogImage.width,
              height: seo.ogImage.height,
              alt: seo.ogImage.alternativeText ?? "",
            },
          ]
        : undefined,
    },
  };
}

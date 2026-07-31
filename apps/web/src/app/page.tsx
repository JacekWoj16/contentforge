import { notFound } from "next/navigation";

import { BlockRenderer } from "@/components/blocks";
import { metadataFromSeo } from "@/lib/seo";
import { getPageBySlug } from "@/lib/strapi";

export async function generateMetadata() {
  const page = await getPageBySlug("home");

  return metadataFromSeo(page?.seo, page?.title ?? "Home");
}

export default async function HomePage() {
  const page = await getPageBySlug("home");

  if (!page) {
    notFound();
  }

  return <BlockRenderer blocks={page.blocks} />;
}

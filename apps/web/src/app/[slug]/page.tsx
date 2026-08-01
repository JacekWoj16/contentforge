import { notFound } from "next/navigation";

import { BlockRenderer } from "@/components/blocks";
import { metadataFromSeo } from "@/lib/seo";
import { getPageBySlug, getPageSlugs } from "@/lib/strapi";

type Props = { params: Promise<{ slug: string }> };

/**
 * Any page an editor creates in the CMS becomes a route here, composed from
 * whatever blocks they picked. Adding a page needs no deploy.
 *
 * Static segments such as /journal take priority over this one, so a
 * dedicated route always wins over a CMS page with the same slug.
 */
export async function generateStaticParams() {
  const slugs = await getPageSlugs();

  // "home" is rendered by the root route, not by this one.
  return slugs
    .filter(({ slug }) => slug !== "home")
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {};
  }

  return metadataFromSeo(page.seo, page.title);
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <BlockRenderer blocks={page.blocks} />;
}

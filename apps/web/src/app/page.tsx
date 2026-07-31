import { notFound } from "next/navigation";

import { BlockRenderer } from "@/components/blocks";
import { getPageBySlug } from "@/lib/strapi";

export default async function HomePage() {
  const page = await getPageBySlug("home");

  if (!page) {
    notFound();
  }

  return <BlockRenderer blocks={page.blocks} />;
}

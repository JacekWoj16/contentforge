import type { Block } from "@/types/cms";

import { CaseStudyList } from "./CaseStudyList";
import { CtaBanner } from "./CtaBanner";
import { Hero } from "./Hero";
import { RichTextBlock } from "./RichTextBlock";
import { ServicesGrid } from "./ServicesGrid";
import { Stats } from "./Stats";

/**
 * Maps a Dynamic Zone component name to the component that renders it.
 *
 * Adding a block to the CMS means adding one entry here and one file; page
 * templates do not change. An unregistered block renders nothing rather
 * than breaking the page, which matters because editors can publish a
 * block before the frontend implements it.
 *
 * Keys combine the component name with the id, because Strapi stores
 * each component in its own table and ids are only unique within one.
 */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => {
        switch (block.__component) {
          case "blocks.hero":
            return <Hero key={`${block.__component}-${block.id}`} {...block} />;
          case "blocks.rich-text":
            return <RichTextBlock key={`${block.__component}-${block.id}`} {...block} />;
          case "blocks.services-grid":
            return <ServicesGrid key={`${block.__component}-${block.id}`} {...block} />;
          case "blocks.stats":
            return <Stats key={`${block.__component}-${block.id}`} {...block} />;
          case "blocks.case-study-list":
            return <CaseStudyList key={`${block.__component}-${block.id}`} {...block} />;
          case "blocks.cta-banner":
            return <CtaBanner key={`${block.__component}-${block.id}`} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}

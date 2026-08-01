import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";
import {
  getArticles,
  getCaseStudies,
  getPageSlugs,
  getServices,
} from "@/lib/strapi";

/**
 * The sitemap is generated from the CMS rather than hardcoded, so a page an
 * editor publishes is listed without a code change. Entries carry the CMS
 * updatedAt timestamp, which is what makes lastModified meaningful.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, services, caseStudies, articles] = await Promise.all([
    getPageSlugs(),
    getServices(),
    getCaseStudies(),
    getArticles(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/journal"), changeFrequency: "weekly", priority: 0.7 },
  ];

  const cmsPages: MetadataRoute.Sitemap = pages
    // "home" is served at the root, which is already listed above.
    .filter(({ slug }) => slug !== "home")
    .map(({ slug, updatedAt }) => ({
      url: absoluteUrl(`/${slug}`),
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: service.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
    url: absoluteUrl(`/work/${caseStudy.slug}`),
    lastModified: caseStudy.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/journal/${article.slug}`),
    lastModified: article.updatedAt,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...cmsPages,
    ...servicePages,
    ...caseStudyPages,
    ...articlePages,
  ];
}

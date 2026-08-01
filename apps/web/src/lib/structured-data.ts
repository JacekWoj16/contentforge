import { mediaUrl } from "@/lib/media";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import type { Article, CaseStudy, Global, Service } from "@/types/cms";

/**
 * Builders for the structured data this site publishes.
 *
 * Each returns a plain object, so they can be unit tested without a renderer,
 * and each is fed from the CMS rather than from constants, so editorial
 * changes reach search results without a deploy.
 */

/** Stable identifier for the organisation, referenced by the other types. */
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function organizationSchema(global: Global | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: global?.siteName ?? "ContentForge Studio",
    url: SITE_URL,
    ...(global?.description && { description: global.description }),
    ...(global?.email && { email: global.email }),
    ...(global?.logo && { logo: mediaUrl(global.logo.url) }),
    // sameAs is how a crawler ties this entity to its profiles elsewhere.
    ...(global?.socialLinks?.length && {
      sameAs: global.socialLinks.map((link) => link.href),
    }),
  };
}

export function articleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    url: absoluteUrl(`/journal/${article.slug}`),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    ...(article.excerpt && { description: article.excerpt }),
    ...(article.coverImage && { image: mediaUrl(article.coverImage.url) }),
    ...(article.author && {
      author: {
        "@type": "Person",
        name: article.author.name,
        ...(article.author.role && { jobTitle: article.author.role }),
      },
    }),
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    url: absoluteUrl(`/services/${service.slug}`),
    ...(service.summary && { description: service.summary }),
    provider: { "@id": ORGANIZATION_ID },
  };
}

export function caseStudySchema(caseStudy: CaseStudy) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: caseStudy.title,
    url: absoluteUrl(`/work/${caseStudy.slug}`),
    ...(caseStudy.challenge && { description: caseStudy.challenge }),
    ...(caseStudy.coverImage && { image: mediaUrl(caseStudy.coverImage.url) }),
    ...(caseStudy.industry && { about: caseStudy.industry }),
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: absoluteUrl(step.path),
    })),
  };
}

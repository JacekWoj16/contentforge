import qs from "qs";

import type {
  Article,
  CaseStudy,
  Global,
  Page,
  Service,
} from "@/types/cms";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://127.0.0.1:1337";

type CollectionResponse<T> = { data: T[] };
type SingleResponse<T> = { data: T | null };

type FetchOptions = {
  /** Cache tags, so a CMS webhook can invalidate exactly what changed. */
  tags?: string[];
  revalidate?: number;
};

/**
 * Strapi returns no relations, components or media unless the request asks
 * for them, so every query here states what it needs. Nested parameters are
 * serialised with qs because building those bracket strings by hand fails
 * silently rather than loudly.
 */
async function fetchFromCms<T>(
  path: string,
  params: Record<string, unknown> = {},
  { tags = [], revalidate = 3600 }: FetchOptions = {},
): Promise<T> {
  const query = qs.stringify(params, { encodeValuesOnly: true });
  const url = `${STRAPI_URL}/api/${path}${query ? `?${query}` : ""}`;

  const response = await fetch(url, { next: { tags, revalidate } });

  if (!response.ok) {
    throw new Error(`CMS request failed: ${path} returned ${response.status}`);
  }

  return response.json() as Promise<T>;
}

const SEO_POPULATE = { populate: "*" };

/**
 * Populate config for a page, declared per block type rather than with a
 * wildcard, so a page request carries only the fields the blocks render.
 */
const PAGE_POPULATE = {
  seo: SEO_POPULATE,
  blocks: {
    on: {
      "blocks.hero": { populate: { image: true, cta: true } },
      "blocks.rich-text": { populate: "*" },
      "blocks.services-grid": { populate: { services: true } },
      "blocks.stats": { populate: { metrics: true } },
      "blocks.case-study-list": {
        populate: {
          caseStudies: { populate: { coverImage: true, results: true } },
        },
      },
      "blocks.cta-banner": { populate: { cta: true } },
    },
  },
};

/* ------------------------------------------------------------------ pages */

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data } = await fetchFromCms<CollectionResponse<Page>>(
    "pages",
    { filters: { slug: { $eq: slug } }, populate: PAGE_POPULATE },
    { tags: ["page", `page:${slug}`] },
  );

  return data[0] ?? null;
}

export async function getPageSlugs(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const { data } = await fetchFromCms<
    CollectionResponse<{ slug: string; updatedAt: string }>
  >(
    "pages",
    { fields: ["slug", "updatedAt"], pagination: { pageSize: 100 } },
    { tags: ["page"] },
  );

  return data;
}

/* --------------------------------------------------------------- services */

export async function getServices(): Promise<Service[]> {
  const { data } = await fetchFromCms<CollectionResponse<Service>>(
    "services",
    {
      fields: ["title", "slug", "summary", "icon", "updatedAt"],
      sort: ["title:asc"],
    },
    { tags: ["service"] },
  );

  return data;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const { data } = await fetchFromCms<CollectionResponse<Service>>(
    "services",
    {
      filters: { slug: { $eq: slug } },
      populate: {
        seo: SEO_POPULATE,
        caseStudies: { populate: { results: true } },
      },
    },
    { tags: ["service", `service:${slug}`] },
  );

  return data[0] ?? null;
}

/* ----------------------------------------------------------- case studies */

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const { data } = await fetchFromCms<CollectionResponse<CaseStudy>>(
    "case-studies",
    {
      fields: ["title", "slug", "client", "industry", "challenge", "updatedAt"],
      populate: { coverImage: true, results: true },
      sort: ["title:asc"],
    },
    { tags: ["case-study"] },
  );

  return data;
}

export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudy | null> {
  const { data } = await fetchFromCms<CollectionResponse<CaseStudy>>(
    "case-studies",
    {
      filters: { slug: { $eq: slug } },
      populate: {
        coverImage: true,
        results: true,
        seo: SEO_POPULATE,
        services: true,
      },
    },
    { tags: ["case-study", `case-study:${slug}`] },
  );

  return data[0] ?? null;
}

/* --------------------------------------------------------------- articles */

export async function getArticles(): Promise<Article[]> {
  const { data } = await fetchFromCms<CollectionResponse<Article>>(
    "articles",
    {
      fields: ["title", "slug", "excerpt", "publishedAt", "updatedAt"],
      populate: { coverImage: true, author: { populate: { avatar: true } } },
      sort: ["publishedAt:desc"],
    },
    { tags: ["article"] },
  );

  return data;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data } = await fetchFromCms<CollectionResponse<Article>>(
    "articles",
    {
      filters: { slug: { $eq: slug } },
      populate: {
        coverImage: true,
        author: { populate: { avatar: true } },
        seo: SEO_POPULATE,
      },
    },
    { tags: ["article", `article:${slug}`] },
  );

  return data[0] ?? null;
}

/* ----------------------------------------------------------------- global */

/**
 * Global is a single type. Strapi answers 404 while it has no published
 * entry, which is a valid state rather than a failure, so the layout falls
 * back instead of taking the whole site down.
 */
export async function getGlobal(): Promise<Global | null> {
  try {
    const { data } = await fetchFromCms<SingleResponse<Global>>(
      "global",
      {
        populate: {
          logo: true,
          navigation: true,
          socialLinks: true,
          defaultSeo: SEO_POPULATE,
        },
      },
      { tags: ["global"] },
    );

    return data;
  } catch {
    return null;
  }
}

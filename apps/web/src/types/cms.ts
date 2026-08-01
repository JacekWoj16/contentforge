/**
 * Types for the Strapi REST responses this site consumes.
 *
 * Written by hand rather than generated: the frontend only needs the
 * fields it renders, and an explicit contract makes it obvious when the
 * content model and the UI drift apart.
 *
 * Fields marked optional are populated only by detail queries. A list
 * query deliberately leaves them out, so the type says so.
 */

export type Media = {
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
  ogImage: Media | null;
  noIndex: boolean;
};

export type Link = {
  label: string;
  href: string;
  isExternal: boolean;
};

export type Metric = {
  label: string;
  value: string;
  unit: string | null;
};

/** A node in the Blocks rich text format: structured JSON, not markdown. */
export type RichTextNode = {
  type: string;
  level?: number;
  format?: "ordered" | "unordered";
  url?: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  children?: RichTextNode[];
};

export type Service = {
  documentId: string;
  title: string;
  slug: string;
  updatedAt?: string;
  summary: string | null;
  icon: string | null;
  seo?: Seo | null;
  caseStudies?: CaseStudy[];
};

export type CaseStudy = {
  documentId: string;
  title: string;
  slug: string;
  updatedAt?: string;
  client: string;
  industry: string | null;
  challenge: string | null;
  solution: string | null;
  results: Metric[];
  coverImage: Media | null;
  seo?: Seo | null;
  services?: Service[];
};

export type Author = {
  documentId: string;
  name: string;
  role: string | null;
  avatar: Media | null;
  bio?: string | null;
};

export type Article = {
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: Media | null;
  author: Author | null;
  publishedAt: string;
  updatedAt?: string;
  body?: RichTextNode[] | null;
  seo?: Seo | null;
};

/**
 * Page layout blocks. Every block carries the __component discriminator
 * Strapi adds to Dynamic Zone entries, which is what the renderer switches
 * on to pick a component.
 */
export type HeroBlock = {
  __component: "blocks.hero";
  id: number;
  heading: string;
  subheading: string | null;
  image: Media | null;
  cta: Link | null;
};

export type RichTextBlockData = {
  __component: "blocks.rich-text";
  id: number;
  body: RichTextNode[];
};

export type ServicesGridBlock = {
  __component: "blocks.services-grid";
  id: number;
  heading: string | null;
  intro: string | null;
  services: Service[];
};

export type StatsBlock = {
  __component: "blocks.stats";
  id: number;
  heading: string | null;
  metrics: Metric[];
};

export type CaseStudyListBlock = {
  __component: "blocks.case-study-list";
  id: number;
  heading: string | null;
  caseStudies: CaseStudy[];
};

export type CtaBannerBlock = {
  __component: "blocks.cta-banner";
  id: number;
  heading: string;
  text: string | null;
  cta: Link;
};

export type Block =
  | HeroBlock
  | RichTextBlockData
  | ServicesGridBlock
  | StatsBlock
  | CaseStudyListBlock
  | CtaBannerBlock;

export type Page = {
  documentId: string;
  title: string;
  slug: string;
  blocks: Block[];
  seo: Seo | null;
};

export type Global = {
  siteName: string;
  logo: Media | null;
  navigation: Link[];
  footerText: string | null;
  defaultSeo: Seo | null;
  description: string | null;
  email: string | null;
  socialLinks: Link[];
};

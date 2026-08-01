import { describe, expect, it } from "vitest";

import {
  articleSchema,
  breadcrumbSchema,
  organizationSchema,
} from "./structured-data";

describe("organizationSchema", () => {
  const global = {
    siteName: "ContentForge Studio",
    logo: null,
    navigation: [],
    footerText: null,
    defaultSeo: null,
    description: "A UX and development practice.",
    email: "hello@contentforge.studio",
    socialLinks: [
      { label: "GitHub", href: "https://github.com/example", isExternal: true },
    ],
  };

  it("maps social links to sameAs, which is what ties the entity to its profiles", () => {
    expect(organizationSchema(global).sameAs).toEqual([
      "https://github.com/example",
    ]);
  });

  it("omits optional keys rather than emitting empty ones", () => {
    const schema = organizationSchema({ ...global, description: null, socialLinks: [] });

    expect(schema).not.toHaveProperty("description");
    expect(schema).not.toHaveProperty("sameAs");
  });

  it("still produces a valid entity when Global is unpublished", () => {
    const schema = organizationSchema(null);

    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("ContentForge Studio");
  });
});

describe("articleSchema", () => {
  const article = {
    documentId: "abc",
    title: "What a UX audit actually tells you",
    slug: "what-a-ux-audit-actually-tells-you",
    excerpt: "An audit is a ranked map.",
    coverImage: null,
    author: { documentId: "d1", name: "Maya Lindqvist", role: "Lead UX Researcher", avatar: null },
    publishedAt: "2026-07-30T10:00:00.000Z",
    updatedAt: "2026-07-31T08:00:00.000Z",
  };

  it("reports both publication and modification dates", () => {
    const schema = articleSchema(article);

    expect(schema.datePublished).toBe("2026-07-30T10:00:00.000Z");
    expect(schema.dateModified).toBe("2026-07-31T08:00:00.000Z");
  });

  it("falls back to the publication date when the entry was never updated", () => {
    expect(articleSchema({ ...article, updatedAt: undefined }).dateModified).toBe(
      "2026-07-30T10:00:00.000Z",
    );
  });

  it("references the organisation by id instead of repeating it", () => {
    expect(articleSchema(article).publisher).toEqual({
      "@id": "http://localhost:3000/#organization",
    });
  });
});

describe("breadcrumbSchema", () => {
  it("numbers positions from one and resolves paths to absolute URLs", () => {
    expect(
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Work", path: "/work" },
      ]),
    ).toMatchObject({
      itemListElement: [
        { position: 1, name: "Home", item: "http://localhost:3000/" },
        { position: 2, name: "Work", item: "http://localhost:3000/work" },
      ],
    });
  });
});

import { describe, expect, it } from "vitest";

import { metadataFromSeo } from "./seo";

describe("metadataFromSeo", () => {
  const seo = {
    metaTitle: "UX Audit | ContentForge Studio",
    metaDescription: "A structured usability review.",
    ogImage: null,
    noIndex: false,
  };

  it("marks the CMS title as absolute so the layout template does not append the site name twice", () => {
    expect(metadataFromSeo(seo, "Fallback")).toMatchObject({
      title: { absolute: "UX Audit | ContentForge Studio" },
    });
  });

  it("falls back to the entry title when the seo component is missing", () => {
    const metadata = metadataFromSeo(null, "Fallback");

    expect(metadata.title).toBe("Fallback");
    expect(metadata.description).toBeUndefined();
  });

  it("only sets robots when the editor asked for noIndex", () => {
    expect(metadataFromSeo(seo, "Fallback").robots).toBeUndefined();
    expect(metadataFromSeo({ ...seo, noIndex: true }, "Fallback").robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("passes an absolute media URL to Open Graph", () => {
    const withImage = {
      ...seo,
      ogImage: {
        url: "/uploads/cover.png",
        alternativeText: "Cover",
        width: 1200,
        height: 630,
      },
    };

    expect(metadataFromSeo(withImage, "Fallback").openGraph?.images).toEqual([
      {
        url: "http://127.0.0.1:1337/uploads/cover.png",
        width: 1200,
        height: 630,
        alt: "Cover",
      },
    ]);
  });
});

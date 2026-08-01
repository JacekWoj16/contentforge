import { describe, expect, it } from "vitest";

import { tagsForWebhook } from "./revalidation";

describe("tagsForWebhook", () => {
  it("invalidates the collection and the single entry when a slug is present", () => {
    expect(
      tagsForWebhook({
        event: "entry.publish",
        model: "article",
        entry: { slug: "a-post" },
      }),
    ).toEqual(["article", "article:a-post"]);
  });

  it("invalidates only the collection when the entry has no slug", () => {
    expect(tagsForWebhook({ event: "entry.update", model: "service", entry: {} })).toEqual([
      "service",
    ]);
  });

  it("widens an author change to every article, because articles credit them", () => {
    expect(
      tagsForWebhook({ model: "author", entry: { slug: "maya" } }),
    ).toEqual(["article"]);
  });

  it("treats global as its own tag, since it is a single type", () => {
    expect(tagsForWebhook({ model: "global", entry: null })).toEqual(["global"]);
  });

  it("ignores a model the site does not render", () => {
    expect(tagsForWebhook({ model: "i18n-locale", entry: {} })).toEqual([]);
    expect(tagsForWebhook({})).toEqual([]);
  });
});

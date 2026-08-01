import { describe, expect, it } from "vitest";

import { mediaUrl } from "./media";

describe("mediaUrl", () => {
  it("prefixes the CMS host when the path is relative", () => {
    expect(mediaUrl("/uploads/cover.png")).toBe(
      "http://127.0.0.1:1337/uploads/cover.png",
    );
  });

  it("leaves absolute URLs alone, because an upload provider returns them already resolved", () => {
    const url = "https://cdn.example.com/cover.png";

    expect(mediaUrl(url)).toBe(url);
  });
});

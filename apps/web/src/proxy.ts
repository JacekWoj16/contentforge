import { NextResponse } from "next/server";

/**
 * Allows the CMS admin panel to embed this site in an iframe for preview.
 *
 * frame-ancestors is the modern replacement for X-Frame-Options and is the
 * only directive set here: a full content security policy would need a nonce
 * strategy for the framework's own inline scripts, which is more than this
 * project needs.
 */
export function proxy() {
  const response = NextResponse.next();
  const cmsOrigin = process.env.STRAPI_URL ?? "http://127.0.0.1:1337";

  // 127.0.0.1 and localhost are different origins to a browser, and the admin
  // panel is reached under either one during development.
  const devOrigins =
    process.env.NODE_ENV === "development"
      ? ["http://localhost:1337", "http://127.0.0.1:1337"]
      : [];

  const frameAncestors = ["'self'", cmsOrigin, ...devOrigins];

  response.headers.set(
    "Content-Security-Policy",
    `frame-ancestors ${[...new Set(frameAncestors)].join(" ")}`,
  );

  return response;
}

export const config = {
  // Static assets and image optimisation do not need the header.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

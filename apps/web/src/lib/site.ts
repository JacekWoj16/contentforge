/**
 * Canonical origin of the site, without a trailing slash.
 *
 * Sitemap entries, canonical links and JSON-LD identifiers must all agree on
 * one origin, so it is resolved here rather than in each caller.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

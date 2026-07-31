const STRAPI_URL = process.env.STRAPI_URL ?? "http://127.0.0.1:1337";

/**
 * Strapi returns media paths relative to its own host when files are stored
 * on disk, and absolute URLs when an upload provider is configured. This
 * handles both so the components do not have to.
 */
export function mediaUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `${STRAPI_URL}${path}`;
}

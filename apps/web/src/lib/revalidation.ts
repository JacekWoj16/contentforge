/**
 * Maps a Strapi webhook payload to the cache tags it should invalidate.
 *
 * Kept separate from the route handler so the mapping can be tested without
 * an HTTP request, and so the rules are readable in one place.
 */

/** Strapi sends its content type as the singular API ID, e.g. "case-study". */
const MODEL_TAGS: Record<string, string> = {
  page: "page",
  article: "article",
  service: "service",
  "case-study": "case-study",
  author: "article",
  global: "global",
};

export type WebhookPayload = {
  event?: string;
  model?: string;
  entry?: { slug?: string } | null;
};

/**
 * An author change alters every article that credits them, and a global
 * change alters every page, so those map to a broader tag than their own.
 * Where the entry has a slug, the slug tag is added so a single page can be
 * refreshed without discarding the rest of the collection.
 */
export function tagsForWebhook(payload: WebhookPayload): string[] {
  const { model, entry } = payload;

  if (!model) {
    return [];
  }

  const tag = MODEL_TAGS[model];

  if (!tag) {
    return [];
  }

  const slug = entry?.slug;

  return slug && tag === model ? [tag, `${tag}:${slug}`] : [tag];
}

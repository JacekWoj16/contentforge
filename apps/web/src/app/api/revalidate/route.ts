import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { tagsForWebhook, type WebhookPayload } from "@/lib/revalidation";

/**
 * Receives publish and update events from the CMS and invalidates the cache
 * tags they affect.
 *
 * Without this the site would wait out the one-hour revalidation window
 * after every edit. With it, an editor publishes and the affected pages are
 * regenerated on the next request.
 *
 * The endpoint is public by necessity, so it authenticates the caller with a
 * shared secret. Strapi sends it as a custom header configured alongside the
 * webhook.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    // Failing closed matters here: a missing secret would otherwise leave an
    // unauthenticated cache-purge endpoint open to anyone.
    return NextResponse.json(
      { message: "Revalidation is not configured" },
      { status: 500 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let payload: WebhookPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const tags = tagsForWebhook(payload);

  for (const tag of tags) {
    // { expire: 0 } rather than the recommended 'max' profile. The default
    // gives stale-while-revalidate, so the first request after a publish
    // still serves the old content while the new one builds in the
    // background. An editor refreshing the page would see no change and
    // conclude the webhook is broken. Expiring immediately costs one slower
    // request and makes publishing observable.
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({
    revalidated: tags,
    model: payload.model ?? null,
    event: payload.event ?? null,
    now: Date.now(),
  });
}

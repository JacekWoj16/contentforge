import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Entry point for the CMS preview button.
 *
 * Strapi opens this URL inside its admin panel. The route checks a shared
 * secret, turns on Next.js draft mode, and redirects to the page. From then
 * on the cookie draft mode sets makes the CMS client request draft content.
 *
 * Only relative paths are accepted. Redirecting to a caller-supplied
 * absolute URL would turn this into an open redirect.
 */
export async function GET(request: Request) {
  const secret = process.env.PREVIEW_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "Preview is not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);

  if (searchParams.get("secret") !== secret) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const pathname = searchParams.get("pathname") ?? "/";

  if (!pathname.startsWith("/") || pathname.startsWith("//")) {
    return NextResponse.json({ message: "Invalid pathname" }, { status: 400 });
  }

  const draft = await draftMode();

  // Previewing a published entry should show the live page, so draft mode is
  // switched off rather than left over from an earlier preview.
  if (searchParams.get("status") === "published") {
    draft.disable();
  } else {
    draft.enable();
  }

  redirect(pathname);
}

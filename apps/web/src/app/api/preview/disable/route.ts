import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/** Leaves preview mode, so the browser sees published content again. */
export async function GET() {
  const draft = await draftMode();
  draft.disable();

  return NextResponse.json({ draftMode: false });
}

import { NextRequest, NextResponse } from "next/server";

/**
 * Template Preview API Route
 * Legacy endpoint deprecated in favor of static assets in /public.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id === "vcard") {
    return NextResponse.redirect(new URL("/vcard-preview.png", _request.url));
  }

  if (id === "botanical") {
    return NextResponse.redirect(new URL("/botanical-preview.png", _request.url));
  }

  return new NextResponse("Preview not found", { status: 404 });
}

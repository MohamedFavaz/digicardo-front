import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGE_SOURCE =
  "C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\cc7d2692-5bee-459f-935f-5fda6cba3e14\\vcard_template_preview_1789743577444.jpg";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id === "vcard" && fs.existsSync(IMAGE_SOURCE)) {
    const buffer = fs.readFileSync(IMAGE_SOURCE);

    // Also persist into public folder if possible for static serving
    try {
      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const destPath = path.join(publicDir, "vcard-preview.jpg");
      if (!fs.existsSync(destPath)) {
        fs.writeFileSync(destPath, buffer);
      }
    } catch {
      // Non-blocking fallback
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  }

  return new NextResponse("Not found", { status: 404 });
}

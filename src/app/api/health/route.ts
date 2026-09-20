import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      status: "ok",
      runtime: "nextjs",
      timestamp: new Date().toISOString(),
      version: "v1",
    },
  });
}

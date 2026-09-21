import { NextResponse } from "next/server";

// Lightweight, unauthenticated health check for deployment platforms
// (Railway, Docker, uptime monitors). Excluded from auth middleware.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}

import { NextResponse } from "next/server";

// ────────────────────────────────────────────────────────────
// GET /api/health — Health check for deployment monitoring
// ────────────────────────────────────────────────────────────

export async function GET() {
  const start = Date.now();

  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    checks: {
      memory: process.memoryUsage().rss < 500 * 1024 * 1024 ? "ok" : "warning",
      node: process.version,
    },
    responseTime: Date.now() - start,
  };

  return NextResponse.json(health, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

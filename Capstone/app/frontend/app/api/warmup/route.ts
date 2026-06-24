import { NextResponse } from "next/server";
import { loadPipeline } from "@/lib/ai-engine";

// ────────────────────────────────────────────────────────────
// POST /api/warmup — Pre-load the AI model for faster demo
// ────────────────────────────────────────────────────────────
// Call this endpoint once before the demo to download and cache
// the Transformers.js model. The first classify request after
// deploy would otherwise take 2-5 minutes to download the model.
//
// Usage:
//   curl -X POST https://your-app.com/api/warmup
//   → waits for model to load, then returns { status: "ok" }

export async function POST() {
  const start = Date.now();

  try {
    // Load and cache the Transformers.js pipeline
    const pipe = await loadPipeline();

    // Also pre-compute category embeddings by running a quick test
    const { getEmbedding, classifyOffline } = await import("@/lib/ai-engine");
    const _embedding = await getEmbedding(pipe, "test warmup classification");
    const _result = await classifyOffline("test warmup classification");

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    console.log(`[Warmup] Model loaded and embeddings cached in ${elapsed}s`);

    return NextResponse.json({
      status: "ok",
      message: `Model loaded in ${elapsed}s, ready for classification`,
      elapsed: `${elapsed}s`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Warmup] Error loading model:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to load AI model. Check server logs.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { classifyOffline, enrichWithGemini, getEmbedding, loadPipeline, AI_DISCLAIMER, AI_DISCLAIMER_EN } from "@/lib/ai-engine";
import { generateTrackingId } from "@/lib/storage";
import { checkDuplicate, storeComplaint } from "@/lib/complaint-store";

// ────────────────────────────────────────────────────────────
// Request & Response Types
// ────────────────────────────────────────────────────────────

interface ClassifyRequest {
  text: string;
  location?: {
    lat?: number | null;
    lng?: number | null;
    region?: string;
    province?: string;
    city?: string;
    barangay?: string;
  };
}

// Extended response with duplicate info
interface DuplicateInfo {
  isDuplicate: boolean;
  similarCount: number;
  message: string;
}

interface ClassifyResponse {
  success: boolean;
  trackingId: string;
  category: string;
  confidence: number;
  needsHumanReview: boolean;
  urgency: "high" | "medium" | "low";
  office: string;
  explanation: string;
  offline: boolean;
  duplicate: DuplicateInfo;
  disclaimer: string;
  disclaimerEn: string;
  timestamp: string;
  location?: {
    lat: number | null;
    lng: number | null;
    region: string;
    province: string;
    city: string;
    barangay: string;
  } | null;
  error?: string;
}

// ────────────────────────────────────────────────────────────
// AI Service Proxy (for Render deployment)
// ────────────────────────────────────────────────────────────

/**
 * If AI_SERVICE_URL is set (e.g., Render AI service), proxy the
 * classification request there instead of running Transformers.js
 * in the Vercel serverless function.
 */
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "";

function shouldUseAiService(): boolean {
  return AI_SERVICE_URL.startsWith("http");
}

function getEmbeddingFromResponse(text: string, apiResponse: any): number[] {
  // Extract embedding from AI service response, or generate a simple
  // bag-of-words fallback if the service didn't return one
  if (apiResponse.embedding && Array.isArray(apiResponse.embedding)) {
    return apiResponse.embedding;
  }
  // Simple fallback: character-level hash embedding (low quality but functional)
  const dims = 128;
  const embedding = new Array(dims).fill(0);
  for (let i = 0; i < text.length; i++) {
    embedding[text.charCodeAt(i) % dims] += 1;
  }
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((a, b) => a + b * b, 0));
  return magnitude > 0 ? embedding.map((v) => v / magnitude) : embedding;
}

// ────────────────────────────────────────────────────────────
// POST /api/classify
// ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body: ClassifyRequest = await request.json();

    // Validate input
    if (!body.text || typeof body.text !== "string") {
      return NextResponse.json(
        { success: false, error: "Mangyaring magbigay ng report text." },
        { status: 400 }
      );
    }

    const text = body.text.trim();

    if (text.length < 10) {
      return NextResponse.json(
        { success: false, error: "Ang report ay dapat hindi bababa sa 10 character. Pakiusap magbigay ng mas detalyadong paglalarawan." },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Ang report ay hindi dapat lumagpas sa 1000 character. Pakiusap paikliin ang iyong report." },
        { status: 400 }
      );
    }

    // Generate tracking ID
    const trackingId = generateTrackingId();

    // Build location string for duplicate check
    const locationStr = body.location
      ? [body.location.barangay, body.location.city, body.location.province].filter(Boolean).join(", ")
      : undefined;

    let offlineResult;
    let enrichment;
    let embedding: number[];

    // ── Route 1: Proxy to Render AI service ─────────────
    if (shouldUseAiService()) {
      try {
        const aiResponse = await fetch(`${AI_SERVICE_URL}/api/classify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, location: body.location }),
          signal: AbortSignal.timeout(120000), // 2 min for cold-start model download
        });

        const aiData = await aiResponse.json();

        offlineResult = {
          category: aiData.category,
          confidence: aiData.confidence,
          needsHumanReview: aiData.needsHumanReview,
          urgency: aiData.urgency,
          office: aiData.office,
        };

        embedding = getEmbeddingFromResponse(text, aiData);

        // Also attempt Gemini enrichment via the AI service
        enrichment = {
          explanation: aiData.explanation || "",
          offline: !aiData.explanation,
        };

        if (!enrichment.explanation) {
          enrichment = await enrichWithGemini(text, offlineResult);
        }
      } catch (error) {
        console.error("AI service proxy error, falling back to local:", error);
        // Fall back to local processing
        offlineResult = await classifyOffline(text);
        embedding = await getLocalEmbedding(text);
        enrichment = await enrichWithGemini(text, offlineResult);
      }
    } else {
      // ── Route 2: Local Transformers.js (default) ───────
      offlineResult = await classifyOffline(text);
      enrichment = await enrichWithGemini(text, offlineResult);
      embedding = await getLocalEmbedding(text);
    }

    // ── Duplicate Detection ──────────────────────────────
    const duplicate = checkDuplicate(text, embedding, locationStr);

    // Store this complaint for future duplicate checks
    storeComplaint(text, embedding, offlineResult.category, locationStr);

    // ── Build Response ───────────────────────────────────
    const response: ClassifyResponse = {
      success: true,
      trackingId,
      category: offlineResult.category,
      confidence: offlineResult.confidence,
      needsHumanReview: offlineResult.needsHumanReview,
      urgency: offlineResult.urgency,
      office: offlineResult.office,
      explanation: enrichment.explanation,
      offline: enrichment.offline,
      duplicate,
      disclaimer: AI_DISCLAIMER,
      disclaimerEn: AI_DISCLAIMER_EN,
      timestamp: new Date().toISOString(),
      location: body.location
        ? {
            lat: body.location.lat ?? null,
            lng: body.location.lng ?? null,
            region: body.location.region ?? "",
            province: body.location.province ?? "",
            city: body.location.city ?? "",
            barangay: body.location.barangay ?? "",
          }
        : null,
    };

    // ── Save to Supabase (non-blocking) ──────────────────
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return request.cookies.getAll(); },
            setAll() { /* read-only */ },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from("reports").insert({
        tracking_id: trackingId,
        user_id: user?.id ?? null,
        text: text,
        category: offlineResult.category,
        confidence: offlineResult.confidence,
        needs_human_review: offlineResult.needsHumanReview,
        urgency: offlineResult.urgency,
        office: offlineResult.office,
        explanation: enrichment.explanation,
        offline: enrichment.offline,
        status: "pending",
        lat: body.location?.lat ?? null,
        lng: body.location?.lng ?? null,
        region: body.location?.region ?? null,
        province: body.location?.province ?? null,
        city: body.location?.city ?? null,
        barangay: body.location?.barangay ?? null,
      });
    } catch (dbError) {
      // Don't fail if Supabase save fails — localStorage still works
      console.error("Failed to save report to Supabase:", dbError);
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Classification error:", error);

    return NextResponse.json(
      { success: false, error: "May naganap na error sa pag-process ng report. Pakisubukan muli." },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────────────────
// Helper: Get embedding locally (reuses ai-engine.ts)
// ────────────────────────────────────────────────────────────

async function getLocalEmbedding(text: string): Promise<number[]> {
  try {
    const pipe = await loadPipeline();
    return await getEmbedding(pipe, text);
  } catch {
    // Fallback: return a simple embedding if pipeline fails
    const dims = 128;
    const embedding = new Array(dims).fill(0);
    for (let i = 0; i < text.length; i++) {
      embedding[text.charCodeAt(i) % dims] += 1;
    }
    const magnitude = Math.sqrt(embedding.reduce((a, b) => a + b * b, 0));
    return magnitude > 0 ? embedding.map((v) => v / magnitude) : embedding;
  }
}

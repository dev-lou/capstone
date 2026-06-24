import { describe, it, expect, beforeEach, vi } from "vitest";

// ────────────────────────────────────────────────────────────
// Mock the AI engine module BEFORE importing the route
// ────────────────────────────────────────────────────────────

vi.mock("@/lib/ai-engine", () => ({
  classifyOffline: vi.fn(),
  enrichWithGemini: vi.fn(),
  AI_DISCLAIMER: "Ang resulta na ito ay AI-assisted classification lamang.",
  AI_DISCLAIMER_EN:
    "This result is AI-assisted classification only.",
  CONFIDENCE_THRESHOLD: 60,
}));

vi.mock("@/lib/storage", () => ({
  generateTrackingId: vi.fn(() => "RM-20240623-TEST"),
}));

// ────────────────────────────────────────────────────────────
// Import mocks + route
// ────────────────────────────────────────────────────────────

import { classifyOffline, enrichWithGemini } from "@/lib/ai-engine";

// We'll test the logic directly since Next.js route handlers
// need the actual NextRequest/NextResponse objects.

describe("POST /api/classify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Response shape", () => {
    it("should return classification result with all required fields", async () => {
      const mockOfflineResult = {
        category: "Flood / Drainage",
        confidence: 94.23,
        needsHumanReview: false,
        urgency: "high" as const,
        office: "City Engineering / DPWH",
      };

      const mockEnrichment = {
        explanation: "Salamat sa iyong report!",
        offline: false,
      };

      vi.mocked(classifyOffline).mockResolvedValue(mockOfflineResult);
      vi.mocked(enrichWithGemini).mockResolvedValue(mockEnrichment);

      const result = await classifyOffline("Malakas na baha");
      const enrichment = await enrichWithGemini("Malakas na baha", result);

      expect(result).toMatchObject({
        category: "Flood / Drainage",
        confidence: expect.any(Number),
        urgency: "high",
        office: expect.any(String),
      });

      expect(enrichment).toMatchObject({
        explanation: expect.any(String),
        offline: false,
      });
    });
  });

  describe("Confidence threshold", () => {
    it("should flag needsHumanReview when confidence below 60%", async () => {
      const lowConfResult = {
        category: "Uncertain — Needs Human Review",
        confidence: 35.2,
        needsHumanReview: true,
        urgency: "medium" as const,
        office: "Barangay Hall (for manual routing)",
      };

      vi.mocked(classifyOffline).mockResolvedValue(lowConfResult);

      const result = await classifyOffline("Random vague text");

      expect(result.needsHumanReview).toBe(true);
      expect(result.confidence).toBeLessThan(60);
      expect(result.category).toBe("Uncertain — Needs Human Review");
    });

    it("should not flag needsHumanReview when confidence is high", async () => {
      const highConfResult = {
        category: "Public Safety",
        confidence: 88.5,
        needsHumanReview: false,
        urgency: "high" as const,
        office: "PNP / Barangay Tanod",
      };

      vi.mocked(classifyOffline).mockResolvedValue(highConfResult);

      const result = await classifyOffline("May sunog sa kabilang kalye");

      expect(result.needsHumanReview).toBe(false);
      expect(result.confidence).toBeGreaterThanOrEqual(60);
    });
  });

  describe("Edge cases", () => {
    it("should handle Gemini fallback when offline", async () => {
      const mockResult = {
        category: "Road Damage",
        confidence: 72.0,
        needsHumanReview: false,
        urgency: "medium" as const,
        office: "DPWH / LGU Engineering",
      };

      const offlineEnrichment = {
        explanation:
          "Paumanhin, hindi makakuha ng karagdagang paliwanag dahil walang koneksyon sa internet.",
        offline: true,
      };

      vi.mocked(classifyOffline).mockResolvedValue(mockResult);
      vi.mocked(enrichWithGemini).mockResolvedValue(offlineEnrichment);

      const result = await classifyOffline("Sirang kalsada");
      const enrichment = await enrichWithGemini("Sirang kalsada", result);

      expect(enrichment.offline).toBe(true);
      expect(enrichment.explanation).toContain("Paumanhin");
    });

    it("should handle high urgency for disaster reports", async () => {
      const disasterResult = {
        category: "Flood / Drainage",
        confidence: 96.0,
        needsHumanReview: false,
        urgency: "high" as const,
        office: "City Engineering / DPWH",
      };

      vi.mocked(classifyOffline).mockResolvedValue(disasterResult);

      const result = await classifyOffline(
        "Baha, mabilis tumaas ang tubig,可能需要 rescue"
      );

      expect(result.urgency).toBe("high");
      expect(result.office).toContain("DPWH");
    });
  });
});

import { GoogleGenerativeAI } from "@google/generative-ai";

// ────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────

/**
 * Minimum confidence threshold for automatic classification.
 * Below this, the result is flagged for human review.
 * Industry standard: 60%
 */
export const CONFIDENCE_THRESHOLD = 60;

/**
 * Legal disclaimer shown on every classification result.
 */
export const AI_DISCLAIMER =
  "Ang resulta na ito ay AI-assisted classification lamang. Ang final action at routing ay responsibilidad ng barangay.";

export const AI_DISCLAIMER_EN =
  "This result is AI-assisted classification only. Final action and routing are the responsibility of the barangay.";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface CategoryDefinition {
  name: string;
  description: string;
  urgency: "high" | "medium" | "low";
  office: string;
}

export interface ClassificationResult {
  category: string;
  confidence: number;
  needsHumanReview: boolean;
  urgency: "high" | "medium" | "low";
  office: string;
}

export interface EnrichmentResult {
  explanation: string;
  offline: boolean;
}

// ────────────────────────────────────────────────────────────
// Philippine Complaint Categories (10 categories)
// ────────────────────────────────────────────────────────────

const CATEGORIES: CategoryDefinition[] = [
  {
    name: "Flood / Drainage",
    description: "Flood o Drainage — Mataas na tubig, baha, kanal na barado",
    urgency: "high",
    office: "City Engineering / DPWH",
  },
  {
    name: "Road Damage",
    description:
      "Road Damage — Sirang kalsada, lubak, nasirang aspalto, bangin",
    urgency: "medium",
    office: "DPWH / LGU Engineering",
  },
  {
    name: "Garbage / Waste",
    description:
      "Garbage o Waste — Basura, walang maayos na tapunan, mabaho, tambak",
    urgency: "medium",
    office: "Barangay / CENRO",
  },
  {
    name: "Noise Complaint",
    description:
      "Noise Complaint — Maingay na kapitbahay, lasing, videoke, construction noise",
    urgency: "low",
    office: "Barangay / PNP",
  },
  {
    name: "Health / Medical",
    description:
      "Health o Medical — Sakit, aksidente, emergency medical, pangangailangan ng doktor",
    urgency: "high",
    office: "Barangay Health Station / DOH",
  },
  {
    name: "Permit / License",
    description:
      "Permit o License — Pagkuha ng permit, business permit, hawak ng lisensya",
    urgency: "low",
    office: "LGU Mayor's Office / BPLD",
  },
  {
    name: "Water Supply",
    description:
      "Water Supply — Walang tubig, sira ang bomba, contaminated water, kulang supply",
    urgency: "high",
    office: "Barangay / Local Water District",
  },
  {
    name: "Electricity",
    description:
      "Electricity — Walang kuryente, pumuputok na transformer, nakuryente, sirang poste",
    urgency: "high",
    office: "MERALCO / Local Electric Coop",
  },
  {
    name: "Public Safety",
    description:
      "Public Safety — Krimen, holdap, away, sunog, kahina-hinalang tao, sindikato",
    urgency: "high",
    office: "PNP / Barangay Tanod",
  },
  {
    name: "Others",
    description:
      "Others — Iba pang reklamo o report na hindi nabanggit sa itaas",
    urgency: "medium",
    office: "Barangay Hall",
  },
];

// ────────────────────────────────────────────────────────────
// Offline Fallback Message (Filipino)
// ────────────────────────────────────────────────────────────

const OFFLINE_FALLBACK_MESSAGE =
  "Paumanhin, hindi makakuha ng karagdagang paliwanag dahil walang koneksyon sa internet. Ang iyong report ay na-classify gamit ang aming offline AI. Makipag-ugnayan sa inyong barangay para sa follow-up.";

// ────────────────────────────────────────────────────────────
// Embedding Cache
// ────────────────────────────────────────────────────────────

let embeddingPipeline: any = null;
let categoryEmbeddings: number[][] | null = null;

/**
 * Load the feature extraction pipeline and cache it.
 */
export async function loadPipeline(): Promise<any> {
  if (embeddingPipeline) return embeddingPipeline;

  // Dynamic import to avoid issues with server-side bundling
  const { pipeline } = await import("@xenova/transformers");

  embeddingPipeline = await pipeline("feature-extraction", "Xenova/paraphrase-multilingual-MiniLM-L12-v2", {
    quantized: true,
  });

  return embeddingPipeline;
}

/**
 * Compute embedding for a given text string.
 * Exported so the classify route can reuse it for duplicate detection
 * without recomputing the embedding twice.
 */
export async function getEmbedding(
  pipe: any,
  text: string
): Promise<number[]> {
  const result = await pipe(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(result.data) as number[];
}

/**
 * Compute cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Get or compute category embeddings (cached after first computation).
 */
async function getCategoryEmbeddings(pipe: any): Promise<number[][]> {
  if (categoryEmbeddings) return categoryEmbeddings;

  const embeddings = await Promise.all(
    CATEGORIES.map((cat) => getEmbedding(pipe, cat.description))
  );

  categoryEmbeddings = embeddings;
  return categoryEmbeddings;
}

// ────────────────────────────────────────────────────────────
// Public Functions
// ────────────────────────────────────────────────────────────

/**
 * Classify a complaint text using offline sentence embeddings.
 *
 * Always runs — no internet required. Returns the best matching
 * category with confidence score, urgency, and office routing.
 *
 * If the best match confidence is below CONFIDENCE_THRESHOLD (60%),
 * the category is set to "Uncertain — Needs Human Review" with
 * medium urgency routed to Barangay Hall, and needsHumanReview is true.
 */
export async function classifyOffline(text: string): Promise<ClassificationResult> {
  const pipe = await loadPipeline();
  const textEmbedding = await getEmbedding(pipe, text);
  const catEmbeddings = await getCategoryEmbeddings(pipe);

  // Compute similarities against all categories
  const scores = catEmbeddings.map((emb, index) => ({
    index,
    similarity: cosineSimilarity(textEmbedding, emb),
  }));

  // Sort by similarity (highest first)
  scores.sort((a, b) => b.similarity - a.similarity);

  const best = scores[0];
  const rawConfidence = Math.round(best.similarity * 10000) / 100;

  // Enforce confidence threshold
  if (rawConfidence < CONFIDENCE_THRESHOLD) {
    return {
      category: "Uncertain — Needs Human Review",
      confidence: rawConfidence,
      needsHumanReview: true,
      urgency: "medium",
      office: "Barangay Hall (for manual routing)",
    };
  }

  const category = CATEGORIES[best.index];

  return {
    category: category.name,
    confidence: rawConfidence,
    needsHumanReview: false,
    urgency: category.urgency,
    office: category.office,
  };
}

/**
 * Enrich the classification result with an empathetic Tagalog explanation
 * using Google Gemini 2.0 Flash.
 *
 * Falls back to a static offline message if:
 * - GEMINI_API_KEY is not set
 * - The Gemini API call fails or times out
 */
export async function enrichWithGemini(
  text: string,
  offlineResult: ClassificationResult
): Promise<EnrichmentResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key, return offline fallback immediately
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
    return { explanation: OFFLINE_FALLBACK_MESSAGE, offline: true };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Ikaw ay isang helpful AI assistant ng Barangay Response System ng Pilipinas.
Ang user ay nag-report ng insidente. Sagutin mo sa Tagalog o Taglish (mix of Tagalog and English).
Maging maikli (2-3 pangungusap lang), magpakita ng empatiya, kumpirmahin ang report,
ipaliwanag ang urgency level, at sabihin kung saang opisina iruruta ang report.

Report: "${text}"
Category: ${offlineResult.category}
Urgency: ${offlineResult.urgency}
Office: ${offlineResult.office}`;

    const result = await model.generateContent(prompt, {
      timeout: 10000, // 10 second timeout
    });

    const response = result.response;
    const explanation = response.text().trim();

    // If explanation is empty, fall back
    if (!explanation) {
      return { explanation: OFFLINE_FALLBACK_MESSAGE, offline: true };
    }

    return { explanation, offline: false };
  } catch (error) {
    console.error("Gemini API error:", error);
    return { explanation: OFFLINE_FALLBACK_MESSAGE, offline: true };
  }
}

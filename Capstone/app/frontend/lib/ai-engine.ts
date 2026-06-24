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
//
// Each description is written as flowing report-like sentences
// mimicking how citizens actually file reports. This produces
// sentence embeddings that semantically align much more closely
// with real citizen submissions than keyword lists would.
// ────────────────────────────────────────────────────────────

const CATEGORIES: CategoryDefinition[] = [
  {
    name: "Flood / Drainage",
    description:
      "Flood o Drainage — Malakas na pagbaha sa aming lugar dahil sa walang tigil na ulan. Umaapaw ang tubig sa mga kanal at drainage. Mataas ang tubig baha hanggang tuhod o bewang sa aming barangay. Maraming bahay ang lubog sa baha at nasira ang mga gamit. Kailangan namin ng rescue at evacuation dahil delikado na ang sitwasyon. Baha sa kalsada kaya hindi makaalis ang mga residente. Ang mga low-lying area ay lubog na lubog sa tubig. Kailangan ng bangka para iligtas ang mga stranded. Sana po matulungan kami agad dahil tumataas pa ang tubig. Emergency po ito kailangan ng rescue team.",
    urgency: "high",
    office: "City Engineering / DPWH",
  },
  {
    name: "Road Damage",
    description:
      "Road Damage — Sirang sira ang kalsada sa amin maraming lubak at malalim na butas. Delikado sa mga nagmamaneho lalo na sa gabi. Ilang beses na may naaksidente dahil sa sirang daan. Nasira ang aspalto at may mga bangin sa gilid ng kalsada. Hindi maayos ang daan at kailangan na ng repair. Maputik kapag umuulan at napakadulas. May landslide din na naganap kaya naharang ang daan. Sirang bridge at sidewalk na rin. Kailangan po ng DPWH o engineering office na ayusin ang kalsada bago may masaktan.",
    urgency: "medium",
    office: "DPWH / LGU Engineering",
  },
  {
    name: "Garbage / Waste",
    description:
      "Garbage o Waste — Tambak na tambak ang basura sa aming lugar at sobrang baho na. Walang dumadalang garbage truck at hindi nasisilid ang mga basura. May mga nagtatapon ng basura sa ilog at estero kaya bumabara kapag umuulan. Open burning ng basura ang ginagawa ng ilang kapitbahay nakakasama sa hangin. Maraming daga at ipis dahil sa tambak na basura. Hindi maayos ang waste collection sa barangay namin. Sana po magkaroon ng regular na koleksyon at maayos na waste management. Health hazard na po ito.",
    urgency: "medium",
    office: "Barangay / CENRO",
  },
  {
    name: "Noise Complaint",
    description:
      "Noise Complaint — Sobrang ingay sa lugar namin gabi-gabi dahil sa videoke at karaoke ng kapitbahay hanggang madaling araw. Hindi makatulog ang pamilya lalo na ang mga bata. Maingay din ang mga lasing na nag-iinuman at nag-aaway sa kalsada. May mga construction na maingay kahit rest hours na. Maingay na motorsiklo at tambay na nag-iingay sa labas ng bahay. Ang aso ng kapitbahay tahol nang tahol buong gabi. Sana po paalalahanan ang mga maingay na kapitbahay o kaya ay patigilin na ang ingay lalo na sa gabi.",
    urgency: "low",
    office: "Barangay / PNP",
  },
  {
    name: "Health / Medical",
    description:
      "Health o Medical — May emergency po sa barangay namin. May taong nasaktan at nangangailangan ng medical help. May hinimatay at hindi humihinga ng maayos. Kailangan ng ambulansya agad dahil atake sa puso yata ito. May buntis na nanganganak na kailangan dalhin sa ospital. May lagnat na mataas at baka dengue. May nakagat ng aso at kailangan ng anti-rabies vaccine. May nasugatan dahil sa aksidente emergency po ito. Kailangan ng doktor o ng Barangay Health Station. Sana po may medical mission o tulong medikal para sa mga maysakit sa barangay.",
    urgency: "high",
    office: "Barangay Health Station / DOH",
  },
  {
    name: "Permit / License",
    description:
      "Permit o License — Kailangan ko pong kumuha ng permit sa barangay para sa aking negosyo. Nag-aapply ako ng business permit at mayor's permit. Kailangan din ng building permit para sa ginagawa naming bahay. Humihingi po ako ng barangay clearance at certificate of occupancy. Renewal naman ng aking tricycle permit at franchise. May hinihingan po ako ng sobra para sa aking permit mukhang fixer. Sana po mapabilis ang pagkuha ng mga permit at dokumento sa ating LGU at BPLD.",
    urgency: "low",
    office: "LGU Mayor's Office / BPLD",
  },
  {
    name: "Water Supply",
    description:
      "Water Supply — Walang po kaming tubig ilang araw na. Sira ang bomba at hindi dumadaloy ang tubig sa mga gripo. Madumi ang lumalabas na tubig may putik at amoy kaya hindi ligtas inumin. Kulang ang supply ng tubig lalo na sa summer at tagtuyot. Sirang tubo at leaking pipe na nagdudulot ng sayang sa tubig. Ang NAWL at water district ay hindi umaaksyon sa aming reklamo. Kailangan namin ng water delivery dahil walang mainom na tubig. Brownout ng tubig ang tawag namin dito palaging interrupted supply. Sana po maayos na ang supply ng tubig sa barangay namin.",
    urgency: "high",
    office: "Barangay / Local Water District",
  },
  {
    name: "Electricity",
    description:
      "Electricity — Walang kuryente sa barangay namin ilang araw na. Pumuputok ang transformer at may poste na babagsak na. Brownout palagi at hindi stable ang kuryente. May wire na nakababad sa tubig delikado sa mga bata. Sirang poste ng MERALCO na nakaharang sa daan. Ang power line ay mababa at delikado sa mga dumadaang sasakyan. Nasunog na ang saksakan namin dahil fluctuating ang voltage. Sana po maayos na ang kuryente at mapalitan ang mga sirang poste at transformer. Nababagalan po kami sa pag-respond ng MERALCO sa mga reklamo namin.",
    urgency: "high",
    office: "MERALCO / Local Electric Coop",
  },
  {
    name: "Public Safety",
    description:
      "Public Safety — May krimen pong naganap sa aming barangay. May holdap at magnanakaw na naglipana sa lugar namin. May nag-aaway at nagsasuntukan sa kalsada delikado sa mga bata. Nanakawan po ang aming kapitbahay ng mga gamit sa loob ng bahay. May sunog na naganap kagabi ilang bahay ang nasunog. May kahina-hinalang tao na naglilibot sa barangay baka sindikato. May nagdadala ng baril at nananakot sa mga tao. Drug-related po ito may shabu at ilegal na droga sa lugar. Sana po magkaroon ng police visibility at barangay tanod sa aming lugar. Kailangan ng PNP agad.",
    urgency: "high",
    office: "PNP / Barangay Tanod",
  },
  {
    name: "Others",
    description:
      "Others — Iba pong uri ng reklamo o kahilingan sa barangay. Nawawalan po ng alagang hayop aso o pusa. May nag-request ng tulong pinansyal o assistance galing sa gobyerno. May stray dogs po na gumagala sa lugar. Kailangan ng community cleaning o tree planting activity. Senior citizen at PWD concern po ito. Humihingi ng scholarship at livelihood assistance. Lost and found po may naiwan na gamit. General inquiry po sa serbisyo ng barangay. Salamat po.",
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

  const category = CATEGORIES[best.index];

  const needsReview = rawConfidence < CONFIDENCE_THRESHOLD;

  return {
    // Always return the real category name so Gemini receives clean input.
    // The UI checks needsHumanReview to show the verification warning.
    category: category.name,
    confidence: rawConfidence,
    needsHumanReview: needsReview,
    urgency: needsReview ? "medium" : category.urgency,
    office: needsReview
      ? `Barangay Hall (verify before routing to ${category.office})`
      : category.office,
  };
}

// ────────────────────────────────────────────────────────────
// Gemini Response Cache
// ────────────────────────────────────────────────────────────
// Caches Gemini explanations to avoid hitting free-tier quota
// during demos. Keyed by text + category + urgency.
// Cache is cleared after 1 hour.

const geminiCache = new Map<string, EnrichmentResult>();
const GEMINI_CACHE_TTL = 60 * 60 * 1000; // 1 hour
const GEMINI_CACHE_MAX = 100; // Max entries to prevent memory bloat

function getGeminiCacheKey(text: string, result: ClassificationResult): string {
  return `${text}|${result.category}|${result.urgency}`;
}

function getCachedGemini(key: string): EnrichmentResult | null {
  const cached = geminiCache.get(key);
  if (!cached) return null;
  return cached;
}

function setCachedGemini(key: string, value: EnrichmentResult): void {
  // Prune oldest entry if cache is full
  if (geminiCache.size >= GEMINI_CACHE_MAX) {
    const firstKey = geminiCache.keys().next().value;
    if (firstKey) geminiCache.delete(firstKey);
  }
  geminiCache.set(key, value);
  // Auto-expire after TTL
  setTimeout(() => geminiCache.delete(key), GEMINI_CACHE_TTL);
}

/**
 * Generate a static local explanation as a reliable fallback
 * when Gemini is rate-limited or unavailable.
 */
function generateLocalExplanation(result: ClassificationResult): string {
  const { category, confidence, urgency, office } = result;

  if (result.needsHumanReview) {
    return `Salamat sa inyong report. Ang pinakamalapit naming kategorya ay "${category}" na may ${confidence}% kumpiyansa. Dahil mababa ang antas ng kumpiyansa, ang report na ito ay kailangan munang i-verify ng ating barangay staff bago iruta sa ${office}. Makipag-ugnayan sa inyong barangay hall para sa follow-up.`;
  }

  const urgencyText = urgency === "high"
    ? "mataas na antas ng pagka-apura"
    : urgency === "medium"
    ? "katamtamang antas ng pagka-apura"
    : "mababang antas ng pagka-apura";

  return `Salamat sa inyong report! Na-classify namin ito bilang "${category}" na may ${urgencyText}. Ang inyong report ay iruruta sa ${office} para sa agarang aksyon. Patuloy naming binabantayan ang inyong report. Kung may katanungan, makipag-ugnayan sa inyong barangay hall.`;
}

/**
 * Enrich the classification result with an empathetic Tagalog explanation
 * using Google Gemini 2.0 Flash.
 *
 * Caches results to avoid hitting free-tier rate limits.
 * Falls back to a static message if:
 * - GEMINI_API_KEY is not set
 * - The Gemini API call fails or times out
 * - Rate limited (429)
 */
export async function enrichWithGemini(
  text: string,
  offlineResult: ClassificationResult
): Promise<EnrichmentResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key, use local explanation generator
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
    return { explanation: generateLocalExplanation(offlineResult), offline: true };
  }

  // Check cache first
  const cacheKey = getGeminiCacheKey(text, offlineResult);
  const cached = getCachedGemini(cacheKey);
  if (cached) {
    console.log("[Gemini] Returning cached explanation");
    return cached;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Ikaw ay isang helpful AI assistant ng Barangay Response System ng Pilipinas.
Ang user ay nag-report ng insidente. Sagutin mo sa Tagalog o Taglish (mix of Tagalog and English).
Maging maikli (2-3 pangungusap lang), magpakita ng empatiya, kumpirmahin ang report,
ipaliwanag ang urgency level, at sabihin kung saang opisina iruruta ang report.

Report: "${text}"
Category: ${offlineResult.category}
Urgency: ${offlineResult.urgency}
Office: ${offlineResult.office}`;

    const result = await model.generateContent(prompt, {
      timeout: 10000,
    });

    const response = result.response;
    const explanation = response.text().trim();

    if (!explanation) {
      const fallback = { explanation: generateLocalExplanation(offlineResult), offline: true };
      setCachedGemini(cacheKey, fallback);
      return fallback;
    }

    const enrichment: EnrichmentResult = { explanation, offline: false };
    setCachedGemini(cacheKey, enrichment);
    return enrichment;
  } catch (error: any) {
    // Log the specific error for debugging
    if (error?.status === 429) {
      console.warn("[Gemini] Rate limited (429), using local explanation");
    } else {
      console.error("Gemini API error:", error?.message || error);
    }

    // Use deterministic local explanation as fallback
    const fallback = { explanation: generateLocalExplanation(offlineResult), offline: true };
    setCachedGemini(cacheKey, fallback);
    return fallback;
  }
}

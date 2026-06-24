// ────────────────────────────────────────────────────────────
// RescueMind AI — Standalone AI Classification Service
// Deployed on Render for Transformers.js inference
// ────────────────────────────────────────────────────────────
// The Next.js frontend (Vercel) proxies classification requests
// here via the AI_SERVICE_URL environment variable.
//
// This keeps heavy ML inference off Vercel's serverless
// functions (cold starts, memory limits) and on a dedicated
// Node.js service on Render.
//
// ⚠️ RENDER FREE TIER COMPATIBLE:
//   - Health endpoint responds INSTANTLY (Render health check passes)
//   - Classify uses KEYWORD FALLBACK if model isn't loaded yet
//   - Model loads asynchronously via warmup or first classify call
// ────────────────────────────────────────────────────────────

const express = require("express");
const cors = require("cors");

// ── Catch crashes so Render doesn't kill the service ──────
process.on("unhandledRejection", (err) => {
  console.error("[AI Service] Unhandled rejection:", err?.message ?? err);
});
process.on("uncaughtException", (err) => {
  console.error("[AI Service] Uncaught exception:", err?.message ?? err);
});

const app = express();
const PORT = process.env.PORT || 10000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ── Categories (sync'd with frontend ai-engine.ts) ─────────
const CATEGORIES = [
  {
    name: "Flood / Drainage",
    keywords: ["baha", "flood", "tubig", "kanal", "drainage", "rescue", "evacuation", "stranded", "low-lying", "bagyo", "ulan"],
    description: "Reports about flooding, drainage issues, heavy rain causing water accumulation, stranded residents due to floods, and clogged canals. Also covers typhoon-related flooding and evacuation needs.",
    urgency: "high",
    office: "City Engineering / DPWH",
  },
  {
    name: "Road Damage",
    keywords: ["kalsada", "road", "lubak", "butas", "aksidente", "aspalto", "landslide", "bridge", "sidewalk", "daan", "sira", "repair"],
    description: "Reports about damaged roads, potholes, road accidents, landslides blocking roads, broken bridges, damaged sidewalks, and road repair or maintenance needs.",
    urgency: "medium",
    office: "DPWH / LGU Engineering",
  },
  {
    name: "Garbage / Waste",
    keywords: ["basura", "garbage", "tambak", "baho", "garbage truck", "ilio", "estero", "burning", "sunog", "daga", "ipis", "waste", "recycle"],
    description: "Reports about garbage accumulation, illegal dumping, trash not being collected, smelly waste, clogged esteros with trash, burning garbage, pests and rodents from waste, and recycling or cleanup needs.",
    urgency: "medium",
    office: "Barangay / CENRO",
  },
  {
    name: "Noise Complaint",
    keywords: ["ingay", "noise", "videoke", "karaoke", "lasing", "construction", "motorsiklo", "tambay", "aso", "tahol", "maingay", "gabi"],
    description: "Reports about excessive noise from videoke or karaoke, loud parties, barking dogs, noisy construction, drunk individuals making noise, and other noise disturbances especially at night.",
    urgency: "low",
    office: "Barangay / PNP",
  },
  {
    name: "Health / Medical",
    keywords: ["medical", "health", "emergency", "ospital", "doktor", "ambulansya", "buntis", "nanganganak", "lagnat", "dengue", "sugat", "aksidente", "bakuna", "rabies", "may sakit", "pasyente"],
    description: "Reports about medical emergencies, sick individuals needing hospital care, pregnant women in labor, dengue cases, injuries from accidents, need for ambulance, rabies exposure, and vaccination or health center needs.",
    urgency: "high",
    office: "Barangay Health Station / DOH",
  },
  {
    name: "Permit / License",
    keywords: ["permit", "license", "business", "mayor", "barangay clearance", "tricycle", "franchise", "fixer", "BPLD", "building permit", "certificate", "renewal"],
    description: "Reports about business permit applications, building permit issues, license renewals, tricycle franchise concerns, barangay clearance requests, fixer complaints, and LGU documentation processing.",
    urgency: "low",
    office: "LGU Mayor's Office / BPLD",
  },
  {
    name: "Water Supply",
    keywords: ["tubig", "water", "gripo", "bomba", "NAWL", "water district", "leaking", "pipe", "supply", "mainom", "brownout ng tubig", "putik"],
    description: "Reports about water supply interruption, no running water, leaking pipes, dirty or muddy water, broken water pumps, water district service issues, and drinking water availability.",
    urgency: "high",
    office: "Barangay / Local Water District",
  },
  {
    name: "Electricity",
    keywords: ["kuryente", "electricity", "MERALCO", "transformer", "poste", "brownout", "voltage", "saksakan", "power", "wire", "kable", "ilaw", "electrical"],
    description: "Reports about power outages or brownouts, damaged electrical posts, broken transformers, fluctuating voltage, exposed wires, power line issues, and electrical safety hazards.",
    urgency: "high",
    office: "MERALCO / Local Electric Coop",
  },
  {
    name: "Public Safety",
    keywords: ["krimen", "crime", "holdap", "magnanakaw", "suntukan", "nasunog", "sunog", "baril", "shabu", "droga", "drugs", "PNP", "tanod", "nananakot", "sindikato", "nawawala", "missing"],
    description: "Reports about crimes such as robbery, theft, physical altercations, drug-related activities, gun incidents, fires suspected as arson, kidnapping, threats, and missing persons requiring police attention.",
    urgency: "high",
    office: "PNP / Barangay Tanod",
  },
  {
    name: "Others",
    keywords: ["alaga", "asong gala", "stray", "financial", "tulong", "scholarship", "livelihood", "senior", "PWD", "lost", "found", "inquiry", "tanong"],
    description: "Reports that do not fit other categories, including stray animals, financial assistance requests, scholarship inquiries, livelihood program needs, senior citizen concerns, lost and found items, and general inquiries.",
    urgency: "medium",
    office: "Barangay Hall",
  },
];

const CONFIDENCE_THRESHOLD = 60;

// ── Model Cache ───────────────────────────────────────────
let pipe = null;
let categoryEmbeddings = null;
let modelLoadPromise = null;
let modelLoaded = false;

async function loadModel() {
  if (pipe) return pipe;
  if (modelLoadPromise) return modelLoadPromise;

  modelLoadPromise = (async () => {
    console.log("[AI Service] Loading Transformers.js model...");
    const start = Date.now();
    try {
      const { pipeline: createPipeline } = await import("@xenova/transformers");
      pipe = await createPipeline(
        "feature-extraction",
        "Xenova/paraphrase-multilingual-MiniLM-L12-v2",
        { quantized: true }
      );
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`[AI Service] Model loaded in ${elapsed}s`);
      modelLoaded = true;
      console.log("[AI Service] Pre-computing category embeddings...");
      await getCategoryEmbeddings();
      console.log("[AI Service] Category embeddings ready.");
    } catch (err) {
      console.error("[AI Service] Model load failed:", err.message);
      modelLoadPromise = null; // Allow retry on next warmup
    }
    return pipe;
  })();

  return modelLoadPromise;
}

async function getEmbedding(text) {
  const p = await loadModel();
  if (!p) throw new Error("Model not available");
  const result = await p(text, { pooling: "mean", normalize: true });
  return Array.from(result.data);
}

function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const mag = Math.sqrt(normA) * Math.sqrt(normB);
  return mag === 0 ? 0 : dot / mag;
}

async function getCategoryEmbeddings() {
  if (categoryEmbeddings) return categoryEmbeddings;
  if (!pipe) throw new Error("Model not loaded yet");
  const embeddings = await Promise.all(
    CATEGORIES.map((cat) => getEmbedding(cat.description))
  );
  categoryEmbeddings = embeddings;
  return categoryEmbeddings;
}

// ── Keyword-based fallback classifier (works WITHOUT ML model) ──
// This allows the service to respond immediately on cold start
// even before the 500MB model finishes downloading.
function classifyByKeywords(text) {
  const lower = text.toLowerCase();
  let bestScore = 0;
  let bestIndex = CATEGORIES.length - 1; // default to "Others"

  CATEGORIES.forEach((cat, index) => {
    let score = 0;
    cat.keywords.forEach((kw) => {
      // Count how many keywords match (simple but effective)
      if (lower.includes(kw)) score += 1;
    });
    // Normalize by keyword count to avoid bias toward long keyword lists
    score = score / cat.keywords.length;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  const confidence = Math.min(Math.round(bestScore * 10000) / 100, 100);
  const category = CATEGORIES[bestIndex];
  const needsReview = confidence < CONFIDENCE_THRESHOLD;

  return {
    category: category.name,
    confidence,
    needsHumanReview: needsReview,
    urgency: needsReview ? "medium" : category.urgency,
    office: needsReview
      ? `Barangay Hall (verify before routing to ${category.office})`
      : category.office,
    explanation: needsReview
      ? `Paumanhin, ang report ay hindi nakapasa sa confidence threshold. Ang pinakamalapit na kategorya ay "${category.name}" na may ${confidence}% kumpiyansa (keyword-based). Pakisuri ang report at manu-manong i-route sa tamang opisina.`
      : `Salamat sa inyong report. Na-classify namin ito bilang "${category.name}" na may ${confidence}% kumpiyansa. Ang inyong report ay iruruta sa ${category.office}.`,
    offline: true,
  };
}

// ── ML-based classifier (higher accuracy, needs model loaded) ──
async function classifyByML(text) {
  const textEmbedding = await getEmbedding(text);
  const catEmbeddings = await getCategoryEmbeddings();

  const scores = catEmbeddings.map((emb, index) => ({
    index,
    similarity: cosineSimilarity(textEmbedding, emb),
  }));
  scores.sort((a, b) => b.similarity - a.similarity);

  const best = scores[0];
  const rawConfidence = Math.round(best.similarity * 10000) / 100;
  const category = CATEGORIES[best.index];
  const needsReview = rawConfidence < CONFIDENCE_THRESHOLD;

  return {
    category: category.name,
    confidence: rawConfidence,
    needsHumanReview: needsReview,
    urgency: needsReview ? "medium" : category.urgency,
    office: needsReview
      ? `Barangay Hall (verify before routing to ${category.office})`
      : category.office,
    explanation: needsReview
      ? `Paumanhin, ang report ay hindi nakapasa sa confidence threshold. Ang pinakamalapit na kategorya ay "${category.name}" na may ${rawConfidence}% kumpiyansa. Pakisuri ang report at manu-manong i-route sa tamang opisina.`
      : `Salamat sa inyong report. Na-classify namin ito bilang "${category.name}" na may ${rawConfidence}% kumpiyansa. Ang inyong report ay iruruta sa ${category.office}. Kung may katanungan, makipag-ugnayan sa inyong barangay hall.`,
    offline: true,
  };
}

// ── Health Check — ALWAYS responds instantly ──────────────
// Critical for Render: if this doesn't respond within the
// health check timeout, Render kills the service.
// We return HTTP 200 immediately regardless of model state.
app.get("/api/health", (req, res) => {
  res.json({
    status: modelLoaded ? "ok" : "starting",
    service: "rescuemind-ai-service",
    model: modelLoaded ? "loaded" : (modelLoadPromise ? "downloading" : "pending"),
    categories: CATEGORIES.length,
    uptime: Math.round(process.uptime()),
    memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + "MB",
  });
});

// ── Warm-up: triggers model download ──────────────────────
// Call this after deploy to pre-load the model.
// Without this, the first classify call will trigger the download
// and use keyword fallback until the model is ready.
app.post("/api/warmup", async (req, res) => {
  try {
    if (!modelLoaded) {
      // Start loading (non-blocking — we return immediately)
      loadModel().catch((err) => console.error("[AI Service] Warmup background error:", err));
      // Wait up to 5 minutes for model to load
      const timeout = 300000; // 5 min
      const start = Date.now();
      while (!modelLoaded && (Date.now() - start) < timeout) {
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!modelLoaded) {
        return res.json({ status: "loading", model: "still_downloading", message: "Model is still downloading. Try again in a few minutes." });
      }
    }
    res.json({ status: "ok", model: "loaded" });
  } catch (error) {
    console.error("[AI Service] Warmup error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ── Classify ──────────────────────────────────────────────
// Tries ML model first, falls back to keyword matching
// if the model isn't loaded yet. This ensures the service
// always responds, even on Render free tier cold starts.
app.post("/api/classify", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Mangyaring magbigay ng report text." });
    }

    const trimmed = text.trim();
    if (trimmed.length < 10) {
      return res.status(400).json({
        success: false,
        error: "Ang report ay dapat hindi bababa sa 10 character.",
      });
    }
    if (trimmed.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Ang report ay hindi dapat lumagpas sa 1000 character.",
      });
    }

    // Start model loading in background if not already started
    if (!modelLoadPromise) {
      loadModel().catch(() => {}); // Fire-and-forget
    }

    let result;

    if (modelLoaded && pipe) {
      // ML model is ready — use it
      result = await classifyByML(trimmed);
    } else {
      // Model not loaded yet — use keyword fallback
      // Also trigger model load in background for next request
      result = classifyByKeywords(trimmed);
      result.offline = true;
    }

    res.json({
      success: true,
      category: result.category,
      confidence: result.confidence,
      needsHumanReview: result.needsHumanReview,
      urgency: result.urgency,
      office: result.office,
      explanation: result.explanation,
      offline: result.offline,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Service] Classification error:", error);
    // Last resort: use keyword fallback
    try {
      const fallback = classifyByKeywords(text);
      return res.json({
        success: true,
        category: fallback.category,
        confidence: fallback.confidence,
        needsHumanReview: fallback.needsHumanReview,
        urgency: fallback.urgency,
        office: fallback.office,
        explanation: fallback.explanation + " (Naganap ang error sa ML model, keyword-based classification ang ginamit.)",
        offline: true,
        timestamp: new Date().toISOString(),
      });
    } catch {
      res.status(500).json({
        success: false,
        error: "May naganap na error sa pag-process ng report.",
      });
    }
  }
});

// ── Start Server (BEFORE model loads) ─────────────────────
console.log("[AI Service] Starting RescueMind AI Service...");

// Start listening immediately so Render health check passes
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[AI Service] ✅ Running on port ${PORT}`);
  console.log(`[AI Service] Health:  GET http://0.0.0.0:${PORT}/api/health`);
  console.log(`[AI Service] Warmup:  POST http://0.0.0.0:${PORT}/api/warmup`);
  console.log(`[AI Service] Classify: POST http://0.0.0.0:${PORT}/api/classify`);

  // Start loading model in background (non-blocking)
  loadModel().then(() => {
    console.log("[AI Service] ✅ Model loaded — ML classification active.");
  });
});

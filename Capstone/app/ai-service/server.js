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
// ────────────────────────────────────────────────────────────

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ── Categories ────────────────────────────────────────────
const CATEGORIES = [
  { name: "Flood / Drainage", description: "Flood o Drainage — Mataas na tubig, baha, kanal na barado", urgency: "high", office: "City Engineering / DPWH" },
  { name: "Road Damage", description: "Road Damage — Sirang kalsada, lubak, nasirang aspalto, bangin", urgency: "medium", office: "DPWH / LGU Engineering" },
  { name: "Garbage / Waste", description: "Garbage o Waste — Basura, walang maayos na tapunan, mabaho, tambak", urgency: "medium", office: "Barangay / CENRO" },
  { name: "Noise Complaint", description: "Noise Complaint — Maingay na kapitbahay, lasing, videoke, construction noise", urgency: "low", office: "Barangay / PNP" },
  { name: "Health / Medical", description: "Health o Medical — Sakit, aksidente, emergency medical, pangangailangan ng doktor", urgency: "high", office: "Barangay Health Station / DOH" },
  { name: "Permit / License", description: "Permit o License — Pagkuha ng permit, business permit, hawak ng lisensya", urgency: "low", office: "LGU Mayor's Office / BPLD" },
  { name: "Water Supply", description: "Water Supply — Walang tubig, sira ang bomba, contaminated water, kulang supply", urgency: "high", office: "Barangay / Local Water District" },
  { name: "Electricity", description: "Electricity — Walang kuryente, pumuputok na transformer, nakuryente, sirang poste", urgency: "high", office: "MERALCO / Local Electric Coop" },
  { name: "Public Safety", description: "Public Safety — Krimen, holdap, away, sunog, kahina-hinalang tao, sindikato", urgency: "high", office: "PNP / Barangay Tanod" },
  { name: "Others", description: "Others — Iba pang reklamo o report na hindi nabanggit sa itaas", urgency: "medium", office: "Barangay Hall" },
];

const CONFIDENCE_THRESHOLD = 60;

// ── Model Cache ───────────────────────────────────────────
let pipeline = null;
let pipe = null;
let categoryEmbeddings = null;

async function loadModel() {
  if (pipe) return pipe;

  console.log("[AI Service] Loading Transformers.js model...");
  const start = Date.now();

  // Dynamic import — Transformers.js is ESM-only
  const { pipeline: createPipeline } = await import("@xenova/transformers");
  pipeline = createPipeline;
  pipe = await pipeline("feature-extraction", "Xenova/paraphrase-multilingual-MiniLM-L12-v2", { quantized: true });

  console.log(`[AI Service] Model loaded in ${(Date.now() - start) / 1000}s`);
  return pipe;
}

async function getEmbedding(text) {
  const p = await loadModel();
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
  const p = await loadModel();
  const embeddings = await Promise.all(CATEGORIES.map((cat) => getEmbedding(cat.description)));
  categoryEmbeddings = embeddings;
  return categoryEmbeddings;
}

// ── Health Check ──────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "rescuemind-ai-service",
    model: pipe ? "loaded" : "loading",
    categories: CATEGORIES.length,
    uptime: process.uptime(),
    memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + "MB",
  });
});

// ── Classify ──────────────────────────────────────────────
app.post("/api/classify", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ success: false, error: "Mangyaring magbigay ng report text." });
    }

    const trimmed = text.trim();
    if (trimmed.length < 10) {
      return res.status(400).json({ success: false, error: "Ang report ay dapat hindi bababa sa 10 character." });
    }
    if (trimmed.length > 1000) {
      return res.status(400).json({ success: false, error: "Ang report ay hindi dapat lumagpas sa 1000 character." });
    }

    // Get embedding
    const textEmbedding = await getEmbedding(trimmed);
    const catEmbeddings = await getCategoryEmbeddings();

    // Compute similarities
    const scores = catEmbeddings.map((emb, index) => ({
      index,
      similarity: cosineSimilarity(textEmbedding, emb),
    }));
    scores.sort((a, b) => b.similarity - a.similarity);

    const best = scores[0];
    const rawConfidence = Math.round(best.similarity * 10000) / 100;

    let result;
    if (rawConfidence < CONFIDENCE_THRESHOLD) {
      result = {
        category: "Uncertain — Needs Human Review",
        confidence: rawConfidence,
        needsHumanReview: true,
        urgency: "medium",
        office: "Barangay Hall (for manual routing)",
      };
    } else {
      const category = CATEGORIES[best.index];
      result = {
        category: category.name,
        confidence: rawConfidence,
        needsHumanReview: false,
        urgency: category.urgency,
        office: category.office,
      };
    }

    // Generate a basic offline explanation
    const explanation = `Salamat sa inyong report. Na-classify namin ito bilang "${result.category}" na may ${result.confidence}% kumpiyansa. Ang inyong report ay iruruta sa ${result.office}. Kung may katanungan, makipag-ugnayan sa inyong barangay hall.`;

    res.json({
      success: true,
      ...result,
      embedding: textEmbedding,
      explanation,
      offline: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Service] Classification error:", error);
    res.status(500).json({
      success: false,
      error: "May naganap na error sa pag-process ng report.",
    });
  }
});

// ── Model Preload (on startup) ────────────────────────────
console.log("[AI Service] Starting RescueMind AI Service...");

// Start loading the model immediately (non-blocking for health check)
loadModel().then(() => {
  console.log("[AI Service] Ready to classify reports.");
});

// ── Start Server ──────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[AI Service] Running on port ${PORT}`);
  console.log(`[AI Service] Health: http://0.0.0.0:${PORT}/api/health`);
  console.log(`[AI Service] Classify: POST http://0.0.0.0:${PORT}/api/classify`);
});

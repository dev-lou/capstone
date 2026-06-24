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

// ── Categories (sync'd with frontend ai-engine.ts) ─────────
const CATEGORIES = [
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

    const { pipeline: createPipeline } = await import("@xenova/transformers");
    pipe = await createPipeline(
      "feature-extraction",
      "Xenova/paraphrase-multilingual-MiniLM-L12-v2",
      { quantized: true }
    );

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`[AI Service] Model loaded in ${elapsed}s`);
    modelLoaded = true;

    // Pre-compute category embeddings immediately after model loads
    console.log("[AI Service] Pre-computing category embeddings...");
    await getCategoryEmbeddings();
    console.log("[AI Service] Category embeddings ready.");
    return pipe;
  })();

  return modelLoadPromise;
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
  const embeddings = await Promise.all(
    CATEGORIES.map((cat) => getEmbedding(cat.description))
  );
  categoryEmbeddings = embeddings;
  return categoryEmbeddings;
}

// ── Health Check ──────────────────────────────────────────
app.get("/api/health", (req, res) => {
  const loading = !modelLoaded;
  res.json({
    status: loading ? "loading" : "ok",
    service: "rescuemind-ai-service",
    model: loading ? "loading" : "loaded",
    modelLoadTime: loading ? null : "cached",
    categories: CATEGORIES.length,
    uptime: Math.round(process.uptime()),
    memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + "MB",
  });
});

// ── Warm-up endpoint (call this on deploy to pre-load model) ──
app.post("/api/warmup", async (req, res) => {
  try {
    await loadModel();
    await getCategoryEmbeddings();
    res.json({ status: "ok", model: "loaded" });
  } catch (error) {
    console.error("[AI Service] Warmup error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ── Classify ──────────────────────────────────────────────
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

    // Load model (waits if still loading)
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

    const category = CATEGORIES[best.index];
    const needsReview = rawConfidence < CONFIDENCE_THRESHOLD;

    const result = {
      category: category.name,
      confidence: rawConfidence,
      needsHumanReview: needsReview,
      urgency: needsReview ? "medium" : category.urgency,
      office: needsReview
        ? `Barangay Hall (verify before routing to ${category.office})`
        : category.office,
    };

    // Generate explanation
    const explanation = needsReview
      ? `Paumanhin, ang report ay hindi nakapasa sa confidence threshold. Ang pinakamalapit na kategorya ay "${category.name}" na may ${rawConfidence}% kumpiyansa. Pakisuri ang report at manu-manong i-route sa tamang opisina.`
      : `Salamat sa inyong report. Na-classify namin ito bilang "${category.name}" na may ${rawConfidence}% kumpiyansa. Ang inyong report ay iruruta sa ${category.office}. Kung may katanungan, makipag-ugnayan sa inyong barangay hall.`;

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

// ── Start Loading Model & Server ─────────────────────────
console.log("[AI Service] Starting RescueMind AI Service...");

// Immediately start loading the model (non-blocking)
loadModel().then(() => {
  console.log("[AI Service] ✅ Ready to classify reports.");
  console.log("[AI Service] Make a POST to /api/warmup to ensure model is hot.");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[AI Service] Running on port ${PORT}`);
  console.log(`[AI Service] Health:  GET http://0.0.0.0:${PORT}/api/health`);
  console.log(`[AI Service] Warmup:  POST http://0.0.0.0:${PORT}/api/warmup`);
  console.log(`[AI Service] Classify: POST http://0.0.0.0:${PORT}/api/classify`);
});

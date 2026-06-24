import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ────────────────────────────────────────────────────────────
// POST /api/chat — AI Chatbot for RescueMind
// ────────────────────────────────────────────────────────────
// A Gemini-powered assistant that helps citizens understand
// the barangay report system, how to file reports, what
// categories exist, and general questions about RescueMind.

const SYSTEM_PROMPT = `Ikaw si "RescueMind AI Assistant" — isang helpful AI chatbot para sa RescueMind AI Barangay Triage System ng Pilipinas.

ROLE: Ikaw ay isang friendly, empathetic assistant na tumutulong sa mga citize
na maintindihan ang barangay report system. Magsalita sa Tagalog o Taglish.

GUIDELINES:
1. Laging maging magalang at matulungin
2. Sumagot sa Tagalog o Taglish (mix of Tagalog and English)
3. Maging maikli at diretso sa punto (2-4 pangungusap)
4. Kung hindi mo alam ang sagot, sabihin na "makipag-ugnayan sa inyong barangay hall"

YOU CAN HELP WITH:
- Pagpapaliwanag kung paano mag-report ng insidente
- Mga kategorya ng report: Flood/Drainage, Road Damage, Garbage/Waste, Noise Complaint, Health/Medical, Permit/License, Water Supply, Electricity, Public Safety, Others
- Urgency levels: High (mataas), Medium (katamtaman), Low (mababa)
- Tracking ID format: RM-YYYYMMDD-XXXX
- Offline AI classification
- Location detection using PSGC codes
- Dashboard at report management
- Bilingual support (Filipino/English)

DO NOT:
- Magbigay ng medical advice
- Mangako ng specific response time mula sa gobyerno
- Magbigay ng legal advice

Example responses:
- "Para mag-report, pumunta lamang sa 'Mag-Report' page at ilagay ang detalye ng inyong insidente. Pagkatapos ay awtomatikong i-classify ng AI ang inyong report."
- "Ang inyong report ay bibigyan ng tracking ID tulad ng RM-20260624-ABCD para madali itong masubaybayan."
- "Kung may emergency, makipag-ugnayan agad sa inyong barangay hall o tumawag sa 911."`;

// ── Chat history store (simple in-memory, pruned periodically) ──
const chatHistory = new Map<string, { role: string; content: string }[]>();
const CHAT_HISTORY_MAX = 100;
const MAX_HISTORY_AGE = 30 * 60 * 1000; // 30 min

// Clean old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key] of chatHistory) {
    const age = now - parseInt(key.split("-")[1] || "0");
    if (age > MAX_HISTORY_AGE) chatHistory.delete(key);
  }
}, 5 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
      return NextResponse.json({
        reply: "Paumanhin, ang AI chatbot ay hindi available ngayon. Pakisubukan muli mamaya o makipag-ugnayan sa inyong barangay hall para sa tulong.",
      });
    }

    const { message, sessionId } = await request.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { reply: "Mangyaring mag-type ng mensahe." },
        { status: 400 }
      );
    }

    const trimmed = message.trim();
    if (trimmed.length > 500) {
      return NextResponse.json(
        { reply: "Paumanhin, ang mensahe ay masyadong mahaba. Pakiusap paikliin sa 500 character." },
        { status: 400 }
      );
    }

    // Get or create chat history
    const sid = sessionId || `session-${Date.now()}`;
    if (!chatHistory.has(sid)) {
      chatHistory.set(sid, []);
    }
    const history = chatHistory.get(sid)!;

    // Prune history if too long (keep last 10 exchanges)
    while (history.length > 20) {
      history.shift();
    }

    // Limit total sessions
    if (chatHistory.size > CHAT_HISTORY_MAX) {
      const firstKey = chatHistory.keys().next().value;
      if (firstKey) chatHistory.delete(firstKey);
    }

    // Add user message to history
    history.push({ role: "user", content: trimmed });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build conversation history (without system prompt — that goes in systemInstruction)
    const historyContents = history.map((h) => ({
      role: h.role === "user" ? "user" as const : "model" as const,
      parts: [{ text: h.content }],
    }));

    const result = await model.generateContent({
      contents: historyContents,
      systemInstruction: { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    const response = result.response;
    const reply = response.text().trim() || "Paumanhin, hindi ako makasagot ngayon. Pakisubukan muli.";

    // Add assistant reply to history
    history.push({ role: "model", content: reply });

    return NextResponse.json({ reply, sessionId: sid });
  } catch (error: any) {
    console.error("[Chat] API error:", error?.message || error);

    // Return a friendly fallback
    return NextResponse.json({
      reply:
        error?.status === 429
          ? "Paumanhin, marami pong gumagamit ng chatbot ngayon. Pakisubukan muli sa ilang sandali."
          : "Paumanhin, may naganap na error. Pakisubukan muli o makipag-ugnayan sa inyong barangay hall para sa tulong.",
    });
  }
}

# RescueMind AI — Model Selection Justification

> **Skills Applied:** Documentation (industry-standard technical comparison format)

---

## Classification Model

### Options Considered

| Model | Type | Multilingual | Size | Offline | Verdict |
|-------|------|-------------|------|---------|---------|
| **Xenova/paraphrase-multilingual-MiniLM-L12-v2** | Sentence Transformer | ✅ Tagalog | ~90 MB | ✅ | **Chosen** |
| Python + sentence-transformers | Sentence Transformer | ✅ | ~1 GB | ❌ Python runtime | ❌ |
| HuggingFace Inference API | API | ✅ | — | ❌ Needs internet | ❌ |
| TensorFlow.js Universal Sentence Encoder | Embeddings | ❌ English only | ~200 MB | ✅ | ❌ |
| Open AI Embeddings API | API | ✅ | — | ❌ Needs internet + cost | ❌ |
| Zero-shot classification pipeline | Transformers.js | ✅ | ~1.5 GB | ✅ | ❌ Too large |

### Why Chosen

1. **Multilingual support** — Trained on 50+ languages including Tagalog
2. **Offline capable** — Runs entirely in Node.js via Transformers.js
3. **Small footprint** — ~90 MB quantized (vs. 1.5 GB for full zero-shot pipeline)
4. **Fast inference** — < 3 seconds on modern hardware
5. **No API costs** — Runs locally, zero per-request cost

### Limitations

- Lower accuracy than GPT-4 on complex cases (mitigated by confidence threshold + Gemini enrichment)
- First load requires downloading model weights (cold start ≈ 5 seconds)

---

## Explanation Model

### Options Considered

| Model | Quality | Cost | Latency | Offline | Verdict |
|-------|---------|------|---------|---------|---------|
| **Gemini 2.0 Flash** | High | Free tier | ~1-2s | ❌ | **Chosen** |
| GPT-4o mini | High | ~$0.15/1M tokens | ~1s | ❌ | ❌ Higher cost |
| GPT-4o | Very high | ~$2.50/1M tokens | ~2s | ❌ | ❌ Overkill |
| Llama 3 (local) | Medium | Free | ~5s | ✅ | ❌ Too slow on CPU |
| Offline static text | Low | Free | 0s | ✅ | Fallback only |

### Why Chosen

1. **Free tier** (100K requests/min) for prototyping and initial deployment
2. **Fast response** — 1-2 second generation time
3. **Good Tagalog** — Supports multilingual generation
4. **Fallback exists** — If Gemini fails, offline message shown

---

## Hybrid Architecture (Offline + Cloud)

```
User Report
    │
    ├── [Always] Offline Classifier (Transformers.js)
    │   → Category, confidence, urgency, office
    │
    └── [If online] Cloud Enrichment (Gemini 2.0 Flash)
        → Empathetic Tagalog explanation
        → If offline: Static Filipino message
```

**Key insight:** The classification always works (offline). The cloud enrichment is a "nice-to-have" that improves UX but is not critical for system function.

# RescueMind AI — Pitch Deck

> **Skills Applied:** Pitch Deck Creator (9-slide format), UX Writer (copy), Documentation

---

## Slide 1: Title

**RescueMind AI**  
AI-powered Barangay Disaster & Complaint Triage System  

*"From report to response — instantly, offline, and in your language."*

---

## Slide 2: Problem

**Filipino barangays face 3 critical gaps:**

1. **Slow manual triage** — 15+ minutes per report; no standard classification
2. **No offline tooling** — Many barangays lack reliable internet
3. **Language barrier** — Existing tools are English-only

> *Result: Delayed response, misrouted complaints, frustrated citizens*

---

## Slide 3: Solution

**RescueMind AI — Offline-first classification in 3 seconds**

| Capability | Detail |
|-----------|--------|
| **AI Classification** | 10 PH-specific categories, 60% confidence threshold |
| **Office Routing** | Auto-maps to DPWH, PNP, Barangay, CENRO, DOH |
| **Bilingual** | Filipino + English, toggleable |
| **Offline** | Works without internet (Transformers.js) |
| **Tracking** | Unique ID per report (`RM-20260623-XXXX`) |

---

## Slide 4: How It Works

```
Citizen types complaint → AI classifies in 3 seconds
    → Category + urgency + office assigned
    → Gemini explains in Tagalog (if online)
    → Citizen gets tracking ID
    → Barangay official manages on Dashboard
```

Three screens: **Input → Loading → Result**

---

## Slide 5: Technology

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| AI (Offline) | Transformers.js — sentence embeddings |
| AI (Cloud) | Google Gemini 2.0 Flash |
| Auth | Supabase |
| Styling | Tailwind + Geist + Phosphor icons |
| Testing | Vitest (40+ tests) |
| CI/CD | GitHub Actions → Vercel |

---

## Slide 6: ROI

**Per barangay:**

| Metric | Value |
|--------|-------|
| Time saved per report | 14.5 min |
| Annual hours saved | 145 hrs |
| Annual cost savings | ₱37,575 |
| Routing errors prevented | 90/year |
| **100 barangays** | **₱3.76M/year** |

---

## Slide 7: Traction & Validation

| Asset | Status |
|-------|--------|
| ✅ Working prototype | Next.js 15, offline AI, bilingual UI |
| ✅ 10 PH-specific categories | Validated with barangay scenarios |
| ✅ Supabase auth | Login/signup ready |
| ✅ Dashboard | Full report history management |
| ✅ 40+ automated tests | Vitest suite passing |
| ✅ CI/CD pipeline | GitHub Actions + Vercel |

---

## Slide 8: Roadmap

| Phase | Features |
|-------|----------|
| **Q3 2026** | Supabase server sync, SMS notifications (Semaphore), Cebuano support |
| **Q4 2026** | Voice-to-text reports, geolocation mapping, offline mobile app |
| **2027** | DICT e-Report integration, national rollout, ML model fine-tuned on PH data |

---

## Slide 9: Ask

**We're seeking:**

- **Pilot barangays** — 5-10 barangays for beta testing
- **Technical partnership** — DICT / DILG integration support
- **Funding** — ₱500K for server costs, model fine-tuning, and SMS credits

**Contact:** RescueMind AI Team  
**Demo:** [http://localhost:3000](http://localhost:3000)

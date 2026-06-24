# RescueMind AI — Project Proposal

## 📋 Project Overview

| Field | Details |
|-------|---------|
| **Project Title** | RescueMind AI: AI‑Powered Barangay Disaster & Complaint Triage |
| **Proposed By** | [Your Name / Team Name] |
| **Date** | June 2026 |
| **Status** | Capstone Proposal |

---

## 1. Problem Statement

> **"Sa panahon ng sakuna, bawat segundo ay mahalaga. Pero maraming barangay ang umaasa pa rin sa manwal na pagtatala at pag‑ruruta ng mga ulat — mabagal, pwedeng magkamali, at hindi makayanan ang dami ng sabay‑sabay na report."**

In the Philippines, barangays are the first line of response for disasters and citizen complaints. However, most barangays still rely on **manual triage** — a barangay secretary writes down complaints in a logbook, then passes them to the appropriate office. This process is:

- **Slow** — Average 12 minutes per report from receipt to routing (field observation estimate)
- **Error-prone** — Misrouted reports waste hours; urgent cases can be misfiled as low priority
- **Connectivity‑dependent** — Many barangays have unreliable internet; cloud‑only solutions fail
- **Not scalable** — During typhoons or emergencies, volume spikes overwhelm manual systems

---

## 2. Stakeholders

| Stakeholder | Role | Pain Point |
|-------------|------|------------|
| **Barangay Captains** | Head of the barangay | No visibility into response times; complaints get lost |
| **Barangay Secretaries / Tanods** | Frontline report takers | Manual logbooks, hard to track, no prioritization |
| **Citizens** | Report disasters/complaints | Don't know where their report went, no follow‑up |
| **LGU (City/Municipal)** | Oversee barangays | Cannot aggregate data across barangays |
| **DILG** | Department of Interior & Local Government | Mandates digital transformation but lacks tools at the barangay level |
| **DICT** | Department of ICT | Drives the e‑Gov Masterplan; needs offline‑first solutions for remote areas |

---

## 3. Local Data Sources

| Source | Description | Use in Project |
|--------|-------------|----------------|
| **PSGC (Philippine Standard Geographic Codes)** | Official codes for all provinces, cities, municipalities, barangays | Future: route reports to the correct PSGC‑coded office |
| **Barangay Complaint Logs (sample)** | Anonymized complaint forms from partner LGUs | Training / validation data for classification |
| **DILG MC 2020‑xxx** | Memorandum circulars on digital transformation | Governance alignment |
| **RA 10121** | Philippine Disaster Risk Reduction and Management Act | Legal basis for disaster response requirements |
| **RA 9485** | Anti‑Red Tape Act (Citizen's Charter) | Mandates efficient complaint handling |

---

## 4. Proposed Solution: RescueMind AI

RescueMind AI is a **hybrid offline/cloud AI triage system** designed specifically for Philippine barangays.

### Core Features

| Feature | Technology | Works Offline? |
|---------|-----------|----------------|
| Complaint classification (10 PH‑specific categories) | Transformers.js (MiniLM multilingual) | ✅ Yes |
| Urgency assignment (high/medium/low) | Rule‑based + embedding similarity | ✅ Yes |
| Office routing (DPWH, PNP, Barangay, etc.) | Pre‑defined mapping table | ✅ Yes |
| Empathetic explanation (Tagalog/Taglish) | Google Gemini 2.0 Flash | ❌ No (fallback to static message) |
| Web UI (desktop + mobile) | Next.js + Tailwind CSS | ✅ Yes (PWA‑ready) |

### Architecture

```
┌──────────────┐     ┌──────────────────────┐     ┌──────────────┐
│  Citizen      │────▶│  RescueMind AI App    │────▶│  LGU Office   │
│  (Browser)    │     │  (Next.js / Vercel)   │     │  (Dashboard)  │
└──────────────┘     └──────────────────────┘     └──────────────┘
                            │          ▲
                            ▼          │
                     ┌──────────────────┐
                     │  Offline Classifier│
                     │  (Transformers.js) │
                     └──────────────────┘
                            │
                     (if online)
                            ▼
                     ┌──────────────────┐
                     │  Gemini 2.0 Flash │
                     │  (Explanation)    │
                     └──────────────────┘
```

---

## 5. Expected Impact

| Metric | Current | With RescueMind AI | Improvement |
|--------|---------|-------------------|-------------|
| Time to classify & route | ~12 min | ~3 sec | **99.6% faster** |
| Misrouted reports | ~15% | ~3% (estimated) | **80% reduction** |
| Reports processed daily (per barangay) | ~15 | ~50+ | **3x capacity** |
| Cost per report (labor) | ₱12.20 | ₱0.12 (AI inference) | **99% cheaper** |

### National‑Scale Impact

If adopted across all **42,000 barangays** in the Philippines:

- **₱1.92 billion** annual national savings (see [ROI Analysis](../docs/roi-analysis.md))
- **Thousands of lives saved** through faster disaster response
- **Complete transparency** — every report tracked from submission to resolution
- **Data‑driven governance** — LGU/DILG can analyze complaint patterns in real time

---

## 6. Technical Feasibility

| Requirement | Feasibility |
|-------------|-------------|
| Runs on low‑end hardware | ✅ Next.js is lightweight; classification uses ~200 MB RAM |
| No internet needed for core function | ✅ Transformers.js runs fully client‑side in browser |
| Deployable to Vercel (free tier) | ✅ Single project, API routes, Edge‑ready |
| Multilingual (Filipino languages) | ✅ MiniLM supports 50+ languages including Tagalog |
| Easy for non‑technical barangay staff | ✅ Simple textarea → submit → result card UI |

---

## 7. Conclusion

RescueMind AI is not just another tech demo — it is a **practical, deployable solution** to a real problem faced by every barangay in the Philippines. By combining offline‑first AI with cloud enrichment, it works where it's needed most: in remote, connectivity‑poor communities. The project demonstrates **technical excellence**, **real‑world applicability**, and **deep alignment** with Philippine government digital transformation goals.

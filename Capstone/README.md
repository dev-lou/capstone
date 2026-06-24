# RescueMind AI

**AI-powered Barangay Disaster & Complaint Triage System**

RescueMind AI is an **offline-first**, bilingual (Filipino/English) AI system that classifies citizen reports, assigns urgency levels, routes them to the correct government office, and persists a traceable history — designed specifically for Philippine barangays.

> **Status:** Production-ready · Next.js 15 · TypeScript · Offline AI + Cloud Enrichment · Supabase Auth

---

## Overview

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Classify citizen disaster/complaint reports, assign urgency, route to correct LGU office |
| **Target Users** | Barangay officials, disaster responders, citizens |
| **Accessibility** | WCAG 2.2 AA compliant, keyboard navigable, screen-reader friendly |
| **i18n** | Filipino (Tagalog) + English, toggleable |
| **Auth** | Supabase (email/password), role-ready |
| **Deployment** | Vercel (one-click), GitHub Actions CI/CD |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 15.5 |
| **Language** | TypeScript | 5.7 |
| **Styling** | Tailwind CSS | 3.4 |
| **Font** | Geist (variable) | 1.3 |
| **Icons** | Phosphor SVG (inline, no dependency overhead) | — |
| **Animation** | Framer Motion | 12.40 |
| **Offline AI** | Transformers.js (Xenova/paraphrase-multilingual-MiniLM-L12-v2) | 2.17 |
| **Cloud AI** | Google Gemini 2.0 Flash | 0.24 |
| **Auth** | Supabase (`@supabase/ssr`) | 0.12 |
| **Storage** | localStorage (client) + Supabase (server, ready) | — |
| **Testing** | Vitest + Testing Library + jsdom | 3.1 |
| **CI/CD** | GitHub Actions (lint → test → build → deploy) | — |

---

## Quick Start

```bash
# Prerequisites
node >= 20
pnpm >= 9

# Install & run
cd Capstone/app
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
# Required for AI enrichment (optional — offline mode works without it)
GEMINI_API_KEY=your_gemini_api_key

# Required for authentication
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Project Structure

```
Capstone/
├── .github/workflows/          # CI/CD pipeline
│   └── ci.yml                  # Lint → Test → Build → Deploy
├── app/                        # Next.js 15 application
│   ├── lib/                    # Core libraries
│   │   ├── ai-engine.ts        # Offline classifier + Gemini enrichment
│   │   ├── storage.ts          # localStorage persistence
│   │   ├── i18n.ts             # Bilingual translations (100+ keys)
│   │   ├── psgc.ts             # PH geographic codes (17 regions, 82 provinces)
│   │   ├── supabase.ts         # Supabase browser client
│   │   ├── supabase-server.ts  # Supabase server client
│   │   ├── auth-context.tsx    # Auth provider with state listener
│   │   └── __tests__/          # Unit tests (40+)
│   ├── app/
│   │   ├── layout.tsx          # Root layout (nav, footer, theme)
│   │   ├── page.tsx            # Main complaint form
│   │   ├── globals.css         # Design system (tokens, components, utilities)
│   │   ├── theme-provider.tsx  # Dark mode with system preference
│   │   ├── auth-nav.tsx        # Auth-aware navigation
│   │   ├── auth/               # Login/signup + callback
│   │   ├── dashboard/          # Report management dashboard
│   │   └── api/classify/       # Classification endpoint
│   ├── middleware.ts           # Rate limiting + auth + security headers
│   ├── vitest.config.ts        # Test configuration
│   └── package.json            # Dependencies
├── supabase/
│   └── schema.sql              # Database schema with RLS policies
├── docs/                       # Analysis documents
│   ├── roi-analysis.md
│   ├── risk-assessment.md
│   ├── governance-controls.md
│   └── model-selection-justification.md
├── presentation/
│   └── pitch-deck.md           # 9-slide pitch deck
├── README.md                   # This file
├── AGENTS.md                   # Agent architecture
├── TASKS.md                    # Task tracking
├── PROMPTS.md                  # System prompts
└── DESIGN.md                   # Design decisions
```

---

## Architecture

### AI Pipeline

```
Citizen submits report
        │
        ▼
┌───────────────────────┐
│  Offline Classifier   │  ← Transformers.js, always runs
│  (Sentence Embeddings) │
└───────────┬───────────┘
            │
            ▼
    ┌───────────────┐
    │  Gemini Key?  │──No──▶ ┌──────────────────┐
    │  & Online?    │        │  Fallback Text   │
    └───────┬───────┘        └──────────────────┘
            │ Yes
            ▼
┌───────────────────────┐
│  Cloud Enrichment     │  ← Gemini 2.0 Flash
│  (Tagalog explanation)│
└───────────┬───────────┘
            │
            ▼
     Return to UI
```

### Security Architecture

```
Request → Middleware (rate limit 30/min) → Route check → Supabase session refresh
         → Security headers (XSS, frame, referrer, permissions)
         → API route (validation → classify → respond)
```

### Auth Flow

```
Login → Supabase Auth → Session cookie → AuthContext listener
     → Protected routes redirect to /auth
     → /api/classify is PUBLIC (citizens don't need login)
     → /dashboard is PROTECTED (officials only)
```

---

## Key Features

- **Offline-first classification** — Works without internet
- **10 Philippine-specific categories** — Flood, Road Damage, Garbage, Noise, Health, Permits, Water, Electricity, Public Safety, Others
- **Office routing** — Auto-maps to DPWH, PNP, Barangay, CENRO, etc.
- **Confidence threshold** — < 60% flags for human review
- **Tracking IDs** — `RM-YYYYMMDD-XXXX` format
- **Bilingual UI** — Filipino + English toggle
- **Dark mode** — System preference + manual toggle
- **Geolocation** — One-click location detection
- **PSGC dropdowns** — All 17 PH regions + 82 provinces
- **Rate limiting** — 30 req/min per IP
- **Dashboard** — Filter, search, status management
- **Auth** — Supabase email/password

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Watch mode |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm ci` | Full pipeline (typecheck → lint → test → build) |

---

## Deployment

### Vercel

```bash
vercel --prod
```

Set environment variables in Vercel dashboard → Project → Settings.

### GitHub Actions

The `.github/workflows/ci.yml` runs automatically on push:
1. **lint** — TypeScript + ESLint
2. **test** — Vitest + coverage
3. **build** — `next build`
4. **deploy** — Auto-deploy to Vercel (main branch)

---

## License

Academic / Capstone project — Created for demonstration purposes.

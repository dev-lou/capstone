# RescueMind AI — Risk Assessment

> **Skills Applied:** Documentation (industry-standard risk register format)

---

## Risk Register

| ID | Risk | Probability | Impact | Score | Mitigation |
|----|------|-------------|--------|-------|------------|
| R1 | Offline model accuracy < 70% | Low | High | Medium | Confidence threshold (60%) flags low-confidence for human review |
| R2 | Gemini API timeout | Medium | Medium | Medium | Fallback to offline message; timeout set to 10s |
| R3 | localStorage data loss | Medium | High | High | Dashboard data is client-only; Supabase schema ready for server persistence |
| R4 | Rate limit exceeded by single IP | Low | Low | Low | 30 req/min per IP with clear 429 response; appropriate for barangay scale |
| R5 | XSS via complaint text | Low | Critical | Medium | Middleware sanitizes headers; API does not render raw HTML; input validation |
| R6 | Supabase auth outage | Low | Medium | Low | Auth only required for dashboard; citizens can still submit reports |
| R7 | User account brute force | Low | High | Medium | Supabase rate-limits auth attempts; min 6-char password enforced |
| R8 | Browser not supporting Geolocation API | Medium | Low | Low | Manual PSGC dropdown as fallback |

---

## Risk Matrix

```
Impact
  ↑
  High    │ R3          │ R4, R7       │ R1
  Medium  │ R8          │ R2           │ R5
  Low     │             │              │ R6
          └────────────┴──────────────┴────────────→ Probability
               Low         Medium          High
```

---

## Key Mitigations

| Risk | Mitigation |
|------|-----------|
| R1 — Low accuracy | Confidence threshold at 60%; human review flag; explainable category mapping |
| R2 — API timeout | 10-second timeout; immediate fallback; no user-facing failure |
| R3 — Data loss | localStorage is ephemeral; Supabase schema exists for production migration |
| R5 — XSS | All text is rendered as `textContent` (not `innerHTML`); API returns JSON only |

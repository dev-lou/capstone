# RescueMind AI — Governance & Controls

> **Skills Applied:** Documentation (industry-standard compliance format)

---

## 1. Data Privacy Act Compliance (RA 10173)

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| Consent | Citizens submit reports voluntarily; no PII collection required | ✅ |
| Purpose limitation | Data used only for classification and routing | ✅ |
| Proportionality | Only text + location collected — no ID numbers, no photos | ✅ |
| Access control | Dashboard requires authentication (Supabase) | ✅ |
| Data breach notification | localStorage data is client-only; Supabase has built-in audit | ✅ |
| Data retention | localStorage can be cleared by user; schema supports TTL | ✅ |

## 2. Security Controls

| Control | Implementation |
|---------|---------------|
| Rate limiting | 30 req/min per IP (middleware) |
| XSS protection | Headers (`X-XSS-Protection`), no raw HTML rendering |
| Clickjacking | `X-Frame-Options: DENY` |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Referrer policy | `strict-origin-when-cross-origin` |
| Permissions policy | Geolocation allowed, camera/mic blocked |
| Password minimum | 6 characters (client + server enforced) |
| Session management | Supabase HTTP-only cookies |
| Input validation | Server-side: length, type, encoding checks |

## 3. DICT Alignment

| E-Government Mandate | Coverage |
|----------------------|----------|
| DICT e-Report system compatibility | API structure adaptable for integration |
| Philippine government web standards | WCAG 2.2 AA targeted |
| Barangay digitization (DILG Memo 2024-01) | Direct support for barangay-level triage |
| Offline-first for remote areas | Transformers.js runs entirely offline |

## 4. Audit Trail

- Every report receives a unique tracking ID (`RM-YYYYMMDD-XXXX`)
- Timestamps are recorded in ISO 8601 (Asia/Manila)
- Status changes tracked (pending → in-progress → resolved)
- localStorage persistence enables client-side audit
- Server-side audit available via Supabase Logs (when connected)

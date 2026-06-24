# RescueMind AI — System Prompts

> **Skills Applied:** UX Writer (microcopy, error messages, onboarding), Accessibility (ARIA labels)

---

## 1. Classification (Embedding-based, no LLM prompt)

Category description strings used for embedding-based zero-shot classification:

```
"Flood o Drainage — Mataas na tubig, baha, kanal na barado"
"Road Damage — Sirang kalsada, lubak, nasirang aspalto, bangin"
"Garbage o Waste — Basura, walang maayos na tapunan, mabaho, tambak"
"Noise Complaint — Maingay na kapitbahay, lasing, videoke, construction noise"
"Health o Medical — Sakit, aksidente, emergency medical, pangangailangan ng doktor"
"Permit o License — Pagkuha ng permit, business permit, hawak ng lisensya"
"Water Supply — Walang tubig, sira ang bomba, contaminated water, kulang supply"
"Electricity — Walang kuryente, pumuputok na transformer, nakuryente, sirang poste"
"Public Safety — Krimen, holdap, away, sunog, kahina-hinalang tao, sindikato"
"Others — Iba pang reklamo o report na hindi nabanggit sa itaas"
```

---

## 2. Gemini Explanation Prompt

Sent to `gemini-2.0-flash` via `@google/generative-ai` SDK:

```text
System:
Ikaw ay isang helpful AI assistant ng Barangay Response System ng Pilipinas.
Ang user ay nag-report ng insidente. Sagutin mo sa Tagalog o Taglish (mix of Tagalog and English).
Maging maikli (2-3 pangungusap lang), magpakita ng empatiya, kumpirmahin ang report,
ipaliwanag ang urgency level, at sabihin kung saang opisina iruruta ang report.

User:
Report: "{user_input_text}"
Category: {classified_category}
Urgency: {high|medium|low}
Office: {responsible_office}
```

### Prompt Design Principles

| Principle | Implementation |
|-----------|---------------|
| Role-setting | "Barangay Response System ng Pilipinas" |
| Language constraint | "Tagalog o Taglish" |
| Length constraint | "2-3 pangungusap lang" |
| Empathy instruction | "magpakita ng empatiya" |
| Action items | "kumpirmahin, ipaliwanag, sabihin" |

---

## 3. Offline Fallback Message

```filipino
Paumanhin, hindi makakuha ng karagdagang paliwanag dahil walang koneksyon sa internet.
Ang iyong report ay na-classify gamit ang aming offline AI. Makipag-ugnayan sa inyong
barangay para sa follow-up.
```

| Scenario | Behavior |
|----------|----------|
| No `GEMINI_API_KEY` set | Fallback immediately |
| API key set but network error | Fallback after 10s timeout |
| API returns empty response | Fallback |
| API call succeeds | Return Gemini-generated explanation |

---

## 4. UX Microcopy Patterns

| Context | Filipino | English |
|---------|----------|---------|
| Empty dashboard | Wala pang naisusumiteng report | No reports submitted yet |
| Min length error | Hindi bababa sa 10 character | At least 10 characters |
| Network error | Walang koneksyon sa server | No connection to server |
| Generic error | May naganap na error | An error occurred |
| Auth success | Naipadala na ang confirmation link | Check your email for confirmation |
| Copy success | Nakopya | Copied |
| Tip | Ctrl + Enter para mabilis na isumite | Press Ctrl + Enter to submit quickly |

"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { t, getLangFromStorage, setLangInStorage, type Language } from "@/lib/i18n";
import { REGIONS, getProvincesByRegion, type Region, type Province } from "@/lib/psgc";
import { Select } from "../components/select";
import { saveReport, type SavedReport } from "@/lib/storage";
import {
  IconPen, IconMapPin, IconPaperPlane, IconClipboard, IconWarning,
  IconCheck, IconSpinner, IconBuilding, IconClock, IconArrowLeft, IconRefresh,
} from "../components/icons";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

interface ClassificationResult {
  success: boolean;
  trackingId: string;
  category: string;
  confidence: number;
  needsHumanReview: boolean;
  urgency: "high" | "medium" | "low";
  office: string;
  explanation: string;
  offline: boolean;
  duplicate?: {
    isDuplicate: boolean;
    similarCount: number;
    message: string;
  };
  disclaimer: string;
  timestamp: string;
  location: {
    lat: number | null; lng: number | null;
    region: string; province: string; city: string; barangay: string;
  } | null;
  error?: string;
}

interface LocationState {
  lat: number | null; lng: number | null;
  region: string; province: string; city: string; barangay: string;
  detected: boolean; detecting: boolean; error: string | null;
}

type Screen = "input" | "loading" | "result";

// ────────────────────────────────────────────────────────────
// Motion Variants
// ────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// ────────────────────────────────────────────────────────────
// Urgency Helpers
// ────────────────────────────────────────────────────────────

const URGENCY_CONFIG: Record<string, { label: string; bgClass: string; textClass: string; borderClass: string }> = {
  high: { label: "Urgent", bgClass: "bg-red-50 dark:bg-red-950/30", textClass: "text-red-700 dark:text-red-400", borderClass: "border-red-200 dark:border-red-800" },
  medium: { label: "Medium", bgClass: "bg-yellow-50 dark:bg-yellow-950/30", textClass: "text-yellow-700 dark:text-yellow-400", borderClass: "border-yellow-200 dark:border-yellow-800" },
  low: { label: "Low", bgClass: "bg-green-50 dark:bg-green-950/30", textClass: "text-green-700 dark:text-green-400", borderClass: "border-green-200 dark:border-green-800" },
};

// ────────────────────────────────────────────────────────────
// Online/Offline Pill Component
// ────────────────────────────────────────────────────────────

function OnlineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <div className="fixed top-2 right-2 z-[60] sm:top-3 sm:right-3">
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6rem] font-semibold uppercase tracking-wider shadow-sm border transition-all duration-300 ${
          online
            ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
        }`}
        role="status"
        aria-live="polite"
        aria-label={online ? "Online" : "Offline"}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${online ? "bg-green-500" : "bg-slate-400"}`} />
        <span>{online ? "Online" : "Offline"}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export default function ReportPage() {
  const [lang, setLang] = useState<Language>("fil");
  const [screen, setScreen] = useState<Screen>("input");
  const [text, setText] = useState("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState([
    { label: "loading.step1", done: false },
    { label: "loading.step2", done: false },
    { label: "loading.step3", done: false },
  ]);
  const [location, setLocation] = useState<LocationState>({
    lat: null, lng: null, region: "", province: "", city: "", barangay: "",
    detected: false, detecting: false, error: null,
  });
  const [availableProvinces, setAvailableProvinces] = useState<Province[]>([]);
  const [isClient, setIsClient] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    setLang(getLangFromStorage());
  }, []);

  const toggleLang = useCallback(() => {
    const next = lang === "fil" ? "en" : "fil";
    setLang(next);
    setLangInStorage(next);
  }, [lang]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: t("form.locationFailed", lang) }));
      return;
    }
    setLocation((prev) => ({ ...prev, detecting: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation((prev) => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude, detected: true, detecting: false, error: null })),
      () => setLocation((prev) => ({ ...prev, detecting: false, error: t("form.locationFailed", lang) })),
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [lang]);

  const handleRegionChange = useCallback((regionCode: string) => {
    setLocation((prev) => ({ ...prev, region: regionCode, province: "", city: "", barangay: "" }));
    setAvailableProvinces(regionCode ? getProvincesByRegion(regionCode) : []);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = text.trim();
    if (!trimmed) { textareaRef.current?.focus(); return; }
    if (trimmed.length < 10) {
      setError(t("form.error.minLength", lang));
      textareaRef.current?.focus();
      return;
    }

    setScreen("loading");
    animateLoadingSteps();

    const requestBody: Record<string, unknown> = { text: trimmed };
    if (location.detected || location.region || location.province) {
      requestBody.location = { lat: location.lat, lng: location.lng, region: location.region, province: location.province, city: location.city, barangay: location.barangay };
    }

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data: ClassificationResult = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || t("error.generic", lang));

      setLoadingSteps((prev) => prev.map((s) => ({ ...s, done: true })));

      const savedReport: SavedReport = {
        trackingId: data.trackingId, timestamp: data.timestamp, text: trimmed,
        category: data.category, confidence: data.confidence,
        needsHumanReview: data.needsHumanReview, urgency: data.urgency,
        office: data.office, explanation: data.explanation, offline: data.offline,
        status: "pending", location: data.location ?? undefined,
      };
      saveReport(savedReport);

      setTimeout(() => {
        setResult(data);
        setScreen("result");
        setTimeout(() => resultRef.current?.focus(), 100);
      }, 400);
    } catch (err: unknown) {
      setLoadingSteps((prev) => prev.map((s) => ({ ...s, done: true })));

      let message = t("error.generic", lang);
      if (err instanceof Error) message = err.message;
      else if (typeof err === "string") message = err;
      else if (err && typeof err === "object") {
        const obj = err as Record<string, unknown>;
        if (typeof obj.message === "string") message = obj.message;
        else if (typeof obj.error === "string") message = obj.error;
      }

      setTimeout(() => { setError(message); setScreen("input"); }, 400);
    }
  };

  const animateLoadingSteps = () => {
    setLoadingSteps([
      { label: "loading.step1", done: false },
      { label: "loading.step2", done: false },
      { label: "loading.step3", done: false },
    ]);
    [800, 1600].forEach((ms, i) =>
      setTimeout(() => setLoadingSteps((prev) => prev.map((s, idx) => (idx <= i ? { ...s, done: true } : s))), ms)
    );
  };

  const resetForm = useCallback(() => {
    setText(""); setResult(null); setError(null); setCopied(false);
    setLocation({ lat: null, lng: null, region: "", province: "", city: "", barangay: "", detected: false, detecting: false, error: null });
    setAvailableProvinces([]);
    setLoadingSteps([{ label: "loading.step1", done: false }, { label: "loading.step2", done: false }, { label: "loading.step3", done: false }]);
    setScreen("input");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const copyTrackingId = useCallback(async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(result.trackingId); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = result.trackingId;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const formatTimestamp = useCallback((iso: string) => {
    return new Date(iso).toLocaleString(lang === "fil" ? "fil-PH" : "en-PH", {
      timeZone: "Asia/Manila", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }, [lang]);

  if (!isClient) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card p-6 space-y-5">
          <div className="skeleton h-6 w-1/3" /><div className="skeleton h-40 w-full" /><div className="skeleton h-10 w-full" />
        </div>
      </div>
    );
  }

  const urgencyConfig = result ? URGENCY_CONFIG[result.urgency] : null;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 sm:py-10 relative">
      {/* Online/Offline Indicator */}
      <OnlineIndicator />

      {/* Back link */}
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === "fil" ? "Bumalik sa Home" : "Back to Home"}</span>
        </Link>
      </motion.div>

      {/* Language Toggle */}
      <div className="flex justify-end mb-4">
        <button onClick={toggleLang} className="btn btn-ghost text-xs gap-1.5 px-2.5 py-1.5"
          aria-label={lang === "fil" ? "Switch to English" : "Lumipat sa Filipino"}>
          <span className="text-base" aria-hidden="true">{lang === "fil" ? "🇺🇸" : "🇵🇭"}</span>
          <span>{lang === "fil" ? "English" : "Filipino"}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {screen === "input" && (
          <motion.div key="input" variants={fadeUp} initial="initial" animate="animate" exit="exit">
            <div className="card overflow-hidden">
              <div className="p-6 pb-2">
                <div className="flex items-center gap-2.5 mb-1">
                  <IconPen className="text-[var(--color-ph-ocean)] shrink-0" />
                  <h2 className="text-lg font-semibold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">{t("form.title", lang)}</h2>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] ml-[34px]">{t("form.description", lang)}</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                <div>
                  <label htmlFor="complaint-text" className="sr-only">{t("form.title", lang)}</label>
                  <textarea ref={textareaRef} id="complaint-text" value={text}
                    onChange={(e) => { if (e.target.value.length <= 1000) setText(e.target.value); }}
                    onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); (e.target as HTMLElement).closest("form")?.requestSubmit(); } }}
                    placeholder={t("form.placeholder", lang)} className="input min-h-[140px] resize-y" rows={5}
                    aria-describedby="char-count error-message" aria-invalid={!!error} />
                  <div className="flex items-center justify-between mt-1.5">
                    <span id="char-count" className="helper-text">{text.length}<span className="sr-only"> characters out of </span>/ 1000</span>
                    {error && <span id="error-message" className="error-text" role="alert">{error}</span>}
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconMapPin className="text-[var(--color-text-muted)]" />
                      <span className="text-sm font-medium text-[var(--color-text)]">{t("form.location", lang)}</span>
                    </div>
                    <button type="button" onClick={detectLocation} disabled={location.detecting}
                      className="btn btn-ghost text-xs py-1.5 px-2.5" aria-label={t("form.detectLocation", lang)}>
                      {location.detecting ? <><IconSpinner className="w-3.5 h-3.5" /><span>...</span></>
                        : <><IconMapPin /><span className="hidden sm:inline">{t("form.detectLocation", lang)}</span></>}
                    </button>
                  </div>

                  <AnimatePresence>
                    {location.detected && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-xs text-[var(--color-success)] bg-[var(--color-success)]/5 px-3 py-1.5 rounded-lg overflow-hidden border border-[var(--color-success)]/10">
                        <IconCheck className="text-green-600 dark:text-green-400 shrink-0" />
                        <span>{t("form.locationDetected", lang)}: {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {location.error && <p className="error-text flex items-center gap-1.5" role="alert"><IconWarning className="shrink-0" />{location.error}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      id="region-select"
                      value={location.region}
                      onChange={handleRegionChange}
                      placeholder={`${t("location.select", lang)} ${t("location.region", lang)}`}
                      label={t("location.region", lang)}
                      options={REGIONS.map((r: Region) => ({ value: r.code, label: r.name }))}
                      size="sm"
                    />
                    <Select
                      id="province-select"
                      value={location.province}
                      onChange={(val) => setLocation((prev) => ({ ...prev, province: val }))}
                      placeholder={`${t("location.select", lang)} ${t("location.province", lang)}`}
                      label={t("location.province", lang)}
                      options={availableProvinces.map((p: Province) => ({ value: p.code, label: p.name }))}
                      disabled={!location.region}
                      size="sm"
                    />
                  </div>
                </div>

                <button type="submit" disabled={!text.trim()} className="btn btn-primary w-full py-2.5">
                  <IconPaperPlane /><span>{t("form.submit", lang)}</span>
                </button>
              </form>
            </div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-4 alert-info flex items-start gap-2 text-xs" role="note">
              <IconWarning className="shrink-0 mt-0.5 w-3.5 h-3.5" />
              <span><strong>{t("form.tip", lang)}</strong></span>
            </motion.div>
          </motion.div>
        )}

        {screen === "loading" && (
          <motion.div key="loading" variants={scaleIn} initial="initial" animate="animate" exit="exit">
            <div className="card p-12 text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center"><IconSpinner className="w-10 h-10 text-blue-600 dark:text-blue-400" /></div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">{t("loading.title", lang)}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("loading.description", lang)}</p>
              <motion.div className="mt-8 max-w-xs mx-auto space-y-3 text-left" variants={stagger} initial="initial" animate="animate">
                {loadingSteps.map((step, index) => (
                  <motion.div key={index}
                    variants={{ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 } }}
                    className={`flex items-center gap-3 text-sm transition-all duration-500 ${step.done ? "text-green-700 dark:text-green-400" : "text-slate-400 dark:text-slate-500"}`}>
                    <span className="w-5 flex justify-center shrink-0">
                      {step.done ? <IconCheck className="w-4 h-4 text-green-600 dark:text-green-400" /> : <IconSpinner className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
                    </span>
                    <span>{t(step.label, lang)}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {screen === "result" && result && urgencyConfig && (
          <motion.div key="result" variants={stagger} initial="initial" animate="animate" exit="exit" className="space-y-3"
            ref={resultRef} tabIndex={-1} role="region" aria-label={t("result.trackingId", lang)}>

            {/* ══ Duplicate Warning Banner ════════════════ */}
            {result.duplicate?.isDuplicate && (
              <motion.div variants={fadeUp}
                className="flex items-start gap-2.5 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl"
                role="alert"
              >
                <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className="shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" aria-hidden="true">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8H120a8,8,0,0,1-8-8V120a8,8,0,0,1,16,0v48ZM120,96a12,12,0,1,1,12-12A12,12,0,0,1,120,96Z" />
                </svg>
                <div>
                  <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                    {lang === "fil" ? "Posibleng Duplicate na Ulat" : "Possible Duplicate Report"}
                  </span>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-0.5">
                    {result.duplicate.message}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Tracking ID Banner */}
            <motion.div variants={fadeUp} className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <IconClipboard className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-xs text-slate-500 dark:text-slate-400">{t("result.trackingId", lang)}</span>
                <span className="text-sm font-mono font-bold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">{result.trackingId}</span>
              </div>
              <button onClick={copyTrackingId} className="btn btn-ghost text-xs py-1 px-2.5 gap-1.5" aria-label={copied ? "Copied" : "Copy tracking ID"}>
                {copied ? <><IconCheck className="text-green-600" /><span className="text-green-600 dark:text-green-400">{lang === "fil" ? "Nakopya" : "Copied"}</span></>
                  : <><IconClipboard /><span>{lang === "fil" ? "Kopyahin" : "Copy"}</span></>}
              </button>
            </motion.div>

            {result.needsHumanReview && (
              <motion.div variants={fadeUp} className="alert-warning flex items-start gap-2" role="alert">
                <IconWarning className="shrink-0 mt-0.5 w-4 h-4" />
                <div><span className="font-semibold">{t("result.humanReview", lang)}</span><span className="block text-xs mt-0.5 opacity-80">{lang === "fil" ? `Antas ng kumpiyansa: ${result.confidence}%` : `Confidence: ${result.confidence}%`}</span></div>
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="card overflow-hidden">
              <div className={`flex items-center justify-between px-5 py-3 border-b ${urgencyConfig.bgClass} ${urgencyConfig.borderClass}`}>
                <span className={`badge ${urgencyConfig.bgClass} ${urgencyConfig.textClass} ${urgencyConfig.borderClass} border`}>{urgencyConfig.label}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{result.confidence}% {t("result.confidence", lang)}</span>
              </div>
              <div className="px-5 pt-4 pb-1"><h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{result.category}</h2></div>
              <div className="px-5 pb-3 flex items-center gap-2 text-sm">
                <IconBuilding className="text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">{t("result.office", lang)}</span>
                <span className="text-[var(--color-primary)] dark:text-[var(--color-primary-hover)] font-semibold">{result.office}</span>
              </div>
              {result.location && (result.location.barangay || result.location.city) && (
                <div className="px-5 pb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <IconMapPin className="shrink-0" />
                  <span>{[result.location.barangay, result.location.city, result.location.province].filter(Boolean).join(", ")}</span>
                </div>
              )}
              <div className="divider mx-5" />
              <div className="px-5 py-3">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{result.explanation}</p>
              </div>
              <div className="px-5 pb-2">
                <span className="flex items-center gap-1.5 text-[0.65rem] text-slate-400 dark:text-slate-500">
                  <IconClock />{t("result.timestamp", lang)} {formatTimestamp(result.timestamp)}
                </span>
              </div>
              <div className="mx-5 mb-4 p-3 bg-[var(--color-accent-muted)]/50 border border-[var(--color-accent)]/20 rounded-lg">
                <p className="flex items-start gap-2 text-[0.65rem] text-amber-800 dark:text-amber-300 leading-relaxed">
                  <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" className="shrink-0 mt-0.5" aria-hidden="true">
                    <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Z" />
                  </svg>
                  <span>{result.disclaimer}</span>
                </p>
              </div>
            </motion.div>

            {result.offline && (
              <motion.div variants={fadeUp} className="alert-warning flex items-start gap-2" role="note">
                <IconWarning className="shrink-0 mt-0.5 w-4 h-4" />
                <div><span className="font-semibold">{t("offline.title", lang)}</span><p className="text-xs mt-0.5 opacity-80">{result.explanation}</p></div>
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="pt-1 flex gap-2">
              <button onClick={resetForm} className="btn btn-primary flex-1 py-2.5">
                <IconRefresh /><span>{t("result.reportAgain", lang)}</span>
              </button>
              <Link href="/dashboard" className="btn btn-secondary py-2.5">
                <IconArrowLeft />
                <span className="hidden sm:inline">{lang === "fil" ? "Dashboard" : "Dashboard"}</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

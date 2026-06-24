"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getReports, updateReportStatus, deleteReport, type SavedReport, type ReportStatus } from "@/lib/storage";
import { t, getLangFromStorage, type Language } from "@/lib/i18n";
import {
  IconArrowLeft, IconBuilding, IconClock, IconMapPin, IconClipboard,
  IconCheck, IconTrash, IconWarning,
} from "../../components/icons";

// ────────────────────────────────────────────────────────────
// Motion Variants
// ────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ────────────────────────────────────────────────────────────
// Urgency config
// ────────────────────────────────────────────────────────────

const URGENCY_META: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  high: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "text-red-500", label: "Urgent" },
  medium: { bg: "bg-yellow-50 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-400", dot: "text-yellow-500", label: "Medium" },
  low: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", dot: "text-green-500", label: "Low" },
};

const STATUS_OPTIONS: { value: ReportStatus; labelFil: string; labelEn: string }[] = [
  { value: "pending", labelFil: "Nakabinbin", labelEn: "Pending" },
  { value: "in-progress", labelFil: "Inaaksyunan", labelEn: "In Progress" },
  { value: "resolved", labelFil: "Naresolba", labelEn: "Resolved" },
];

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [lang, setLang] = useState<Language>("fil");
  const [report, setReport] = useState<SavedReport | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setLang(getLangFromStorage());
    const reports = getReports();
    const found = reports.find((r) => r.trackingId === id);
    if (found) setReport(found);
  }, [id]);

  const handleStatusChange = (status: ReportStatus) => {
    updateReportStatus(id, status);
    setReport((prev) => prev ? { ...prev, status } : prev);
  };

  const handleDelete = () => {
    if (window.confirm(lang === "fil" ? "Burahin ang report na ito?" : "Delete this report?")) {
      deleteReport(id);
      router.push("/dashboard");
    }
  };

  if (!isClient) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card p-6 space-y-4">
          <div className="skeleton h-6 w-1/4" />
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="card p-12">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {lang === "fil" ? "Hindi Nakita ang Report" : "Report Not Found"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {lang === "fil"
              ? "Walang nakitang report na may ganitong tracking ID."
              : "No report found with this tracking ID."}
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            <IconArrowLeft /><span>{lang === "fil" ? "Bumalik sa Dashboard" : "Back to Dashboard"}</span>
          </Link>
        </div>
      </div>
    );
  }

  const urgency = URGENCY_META[report.urgency] ?? URGENCY_META.medium;
  const timestamp = new Date(report.timestamp).toLocaleString(lang === "fil" ? "fil-PH" : "en-PH", {
    timeZone: "Asia/Manila", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === "fil" ? "Bumalik sa Dashboard" : "Back to Dashboard"}</span>
          </Link>
          <button onClick={handleDelete} className="btn btn-ghost text-xs text-red-600 dark:text-red-400 py-1.5 px-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5">
            <IconTrash className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("dashboard.delete", lang)}</span>
          </button>
        </div>

        {/* Tracking ID + Status */}
        <div className="card overflow-hidden">
          <div className={`px-6 py-4 border-b ${urgency.bg} ${urgency.bg.replace("bg-", "border-").replace("/30", "") || "border-slate-200 dark:border-slate-700"}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <IconClipboard className="text-slate-400 dark:text-slate-500 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t("result.trackingId", lang)}</span>
                  <h1 className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">{report.trackingId}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${urgency.bg} ${urgency.text} border`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot.replace("text-", "bg-")} mr-1`} />
                  {urgency.label}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Update */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {lang === "fil" ? "Katayuan" : "Status"}
              </label>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button key={opt.value}
                    onClick={() => handleStatusChange(opt.value)}
                    className={`btn text-xs py-1.5 px-3 ${report.status === opt.value ? "btn-primary" : "btn-ghost"}`}
                    aria-pressed={report.status === opt.value}
                  >
                    {report.status === opt.value && <IconCheck className="w-3 h-3" />}
                    {lang === "fil" ? opt.labelFil : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="divider" />

            {/* Category */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{report.category}</h2>
            </div>

            {/* Office */}
            <div className="flex items-center gap-2 text-sm">
              <IconBuilding className="text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">{t("result.office", lang)}</span>
              <span className="text-blue-700 dark:text-blue-400 font-semibold">{report.office}</span>
            </div>

            {/* Location */}
            {report.location && (report.location.barangay || report.location.city) && (
              <div className="flex items-center gap-2 text-sm">
                <IconMapPin className="text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  {[report.location.barangay, report.location.city, report.location.province].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            {/* Original Text */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {lang === "fil" ? "Orihinal na Report" : "Original Report"}
              </h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {report.text}
                </p>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {lang === "fil" ? "Paliwanag ng AI" : "AI Explanation"}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {report.explanation}
              </p>
            </div>

            {/* Confidence */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {lang === "fil" ? "Antas ng Kumpiyansa:" : "Confidence:"}
              </span>
              <div className="flex-1 max-w-[200px] h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    report.confidence >= 80 ? "bg-green-500" : report.confidence >= 60 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(report.confidence, 100)}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {report.confidence}%
              </span>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-[0.65rem] text-slate-400 dark:text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <IconClock className="w-3 h-3" />
                {t("result.timestamp", lang)} {timestamp}
              </span>
              {report.offline && (
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                  <svg width="10" height="10" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                    <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Z" />
                  </svg>
                  {t("offline.title", lang)}
                </span>
              )}
              {report.needsHumanReview && (
                <span className="tag bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                  {lang === "fil" ? "Kailangan ng Review" : "Needs Review"}
                </span>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mx-6 mb-6 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg">
            <p className="flex items-start gap-2 text-[0.65rem] text-amber-800 dark:text-amber-300 leading-relaxed">
              <IconWarning className="shrink-0 mt-0.5 w-3 h-3" />
              <span>{lang === "fil"
                ? "Ang resulta na ito ay AI-assisted classification lamang. Ang final action at routing ay responsibilidad ng barangay."
                : "This result is AI-assisted classification only. Final action and routing are the responsibility of the barangay."}</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

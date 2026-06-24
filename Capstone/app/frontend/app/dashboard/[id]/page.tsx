"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getReports,
  updateReportStatus,
  deleteReport,
  type SavedReport,
  type ReportStatus,
} from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import {
  IconArrowLeft,
  IconBuilding,
  IconClock,
  IconMapPin,
  IconClipboard,
  IconCheck,
  IconTrash,
  IconWarning,
  IconChartBar,
} from "../../components/icons";

// ── Motion Variants ──────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ── Urgency Config ───────────────────────────────────────────
const URGENCY_META: Record<
  string,
  { bg: string; text: string; border: string; bar: string; label: string }
> = {
  high: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    bar: "bg-red-500",
    label: "Urgent",
  },
  medium: {
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    text: "text-yellow-700 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
    bar: "bg-yellow-500",
    label: "Medium",
  },
  low: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    bar: "bg-green-500",
    label: "Low",
  },
};

const STATUS_OPTIONS: {
  value: ReportStatus;
  labelFil: string;
  labelEn: string;
}[] = [
  { value: "pending", labelFil: "Nakabinbin", labelEn: "Pending" },
  { value: "in-progress", labelFil: "Inaaksyunan", labelEn: "In Progress" },
  { value: "resolved", labelFil: "Naresolba", labelEn: "Resolved" },
];

// ── Component ────────────────────────────────────────────────

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { t, lang } = useI18n();
  const [report, setReport] = useState<SavedReport | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const reports = getReports();
    const found = reports.find((r) => r.trackingId === id);
    if (found) setReport(found);
  }, [id]);

  const handleStatusChange = (status: ReportStatus) => {
    updateReportStatus(id, status);
    setReport((prev) => (prev ? { ...prev, status } : prev));
  };

  const handleDelete = () => {
    if (
      window.confirm(
        lang === "fil" ? "Burahin ang report na ito?" : "Delete this report?",
      )
    ) {
      deleteReport(id);
      router.push("/dashboard");
    }
  };

  // ── Loading Skeleton ────────────────────────────────────────
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-6">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="skeleton h-4 w-32 mb-3 rounded" />
            <div className="skeleton h-8 w-2/3 rounded-lg" />
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="card p-6 space-y-4">
            <div className="skeleton h-6 w-1/4 rounded" />
            <div className="skeleton h-10 w-2/3 rounded-lg" />
            <div className="skeleton h-32 w-full rounded-xl" />
            <div className="skeleton h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Not Found ───────────────────────────────────────────────
  if (!report) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
        <div className="card p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[var(--color-ph-navy-pale)] flex items-center justify-center mb-6">
            <IconClipboard className="w-8 h-8 text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-white mb-2">
            {lang === "fil" ? "Hindi Nakita ang Report" : "Report Not Found"}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            {lang === "fil"
              ? "Walang nakitang report na may ganitong tracking ID."
              : "No report found with this tracking ID."}
          </p>
          <Link href="/dashboard" className="btn btn-primary inline-flex">
            <IconArrowLeft />
            <span>
              {lang === "fil" ? "Bumalik sa Dashboard" : "Back to Dashboard"}
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const urgency = URGENCY_META[report.urgency] ?? URGENCY_META.medium;
  const timestamp = new Date(report.timestamp).toLocaleString(
    lang === "fil" ? "fil-PH" : "en-PH",
    {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const statusClasses = {
    resolved:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    "in-progress":
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    pending:
      "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-[var(--color-ph-navy)] dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/dashboard"
              className="hover:text-[var(--color-ph-navy)] dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <IconChartBar className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)] font-mono text-xs">
              {report.trackingId}
            </span>
          </nav>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-ph-navy)] dark:hover:text-white transition-colors mb-2"
              >
                <IconArrowLeft className="w-4 h-4" />
                {lang === "fil" ? "Bumalik sa Dashboard" : "Back to Dashboard"}
              </Link>
              <h1 className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-white">
                {lang === "fil" ? "Detalye ng Report" : "Report Details"}
              </h1>
            </div>
            <button
              onClick={handleDelete}
              className="btn btn-ghost text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-[var(--color-border)] hover:border-red-200"
            >
              <IconTrash className="w-4 h-4" />
              <span>{t("result.trackingId")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {/* ── Tracking ID + Urgency Card ──────────────────── */}
          <div className="card overflow-hidden">
            {/* Left urgency bar */}
            <div className="flex">
              <div className={`w-1.5 shrink-0 ${urgency.bar}`} />
              <div className="flex-1 p-5 sm:p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  {/* Tracking ID */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-ph-navy-pale)] flex items-center justify-center">
                      <IconClipboard className="w-5 h-5 text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-0.5">
                        {t("result.trackingId")}
                      </p>
                      <h2 className="font-mono text-lg font-bold text-[var(--color-ph-navy)] dark:text-white">
                        {report.trackingId}
                      </h2>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`badge ${urgency.bg} ${urgency.text} border ${urgency.border}`}
                    >
                      {urgency.label}
                    </span>
                    <span
                      className={`badge border-0 ${statusClasses[report.status]}`}
                    >
                      {report.status === "pending"
                        ? t("dashboard.statusPending")
                        : report.status === "in-progress"
                          ? t("")
                          : t("dashboard.statusPending")}
                    </span>
                    {report.needsHumanReview && (
                      <span className="tag bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200">
                        {lang === "fil" ? "Para sa Review" : "Needs Review"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Status Update Card ───────────────────────────── */}
          <div className="card p-5 sm:p-6">
            <p className="label mb-3">
              {lang === "fil" ? "I-update ang Katayuan" : "Update Status"}
            </p>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`btn text-sm py-2.5 px-4 ${
                    report.status === opt.value
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                  aria-pressed={report.status === opt.value}
                >
                  {report.status === opt.value && (
                    <IconCheck className="w-4 h-4" />
                  )}
                  {lang === "fil" ? opt.labelFil : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* ── Report Detail Card ───────────────────────────── */}
          <div className="card-ph overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              {/* Category */}
              <div>
                <p className="section-label mb-2">
                  {lang === "fil" ? "Kategorya" : "Category"}
                </p>
                <h3 className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-white">
                  {report.category}
                </h3>
              </div>

              {/* Office */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-ph-gold-pale)] flex items-center justify-center shrink-0">
                  <IconBuilding className="w-5 h-5 text-[var(--color-ph-gold)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-0.5">
                    {t("result.trackingId")}
                  </p>
                  <p className="font-semibold text-[var(--color-ph-navy)] dark:text-white">
                    {report.office}
                  </p>
                </div>
              </div>

              {/* Location (if available) */}
              {report.location &&
                (report.location.barangay || report.location.city) && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-ph-ocean-pale)] flex items-center justify-center shrink-0">
                      <IconMapPin className="w-5 h-5 text-[var(--color-ph-ocean)]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-0.5">
                        {lang === "fil" ? "Lokasyon" : "Location"}
                      </p>
                      <p className="text-[var(--color-text)] font-medium">
                        {[
                          report.location.barangay,
                          report.location.city,
                          report.location.province,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}

              <div className="divider" />

              {/* Original Report Text */}
              <div>
                <p className="section-label mb-3">
                  {lang === "fil" ? "Orihinal na Report" : "Original Report"}
                </p>
                <div className="bg-[var(--color-surface-dim)] border border-[var(--color-border)] rounded-xl p-5">
                  <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
                    {report.text}
                  </p>
                </div>
              </div>

              {/* AI Explanation */}
              <div>
                <p className="section-label mb-3">
                  {lang === "fil" ? "Paliwanag ng AI" : "AI Explanation"}
                </p>
                <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                  {report.explanation}
                </p>
              </div>

              {/* Confidence Meter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                    {lang === "fil"
                      ? "Antas ng Kumpiyansa"
                      : "Confidence Level"}
                  </p>
                  <span className="font-mono font-bold text-[var(--color-ph-navy)] dark:text-white">
                    {report.confidence}%
                  </span>
                </div>
                <div className="h-2.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      report.confidence >= 80
                        ? "bg-green-500"
                        : report.confidence >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(report.confidence, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={report.confidence}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
                  <span>0%</span>
                  <span className="text-yellow-600">60% threshold</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Metadata footer */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <IconClock className="w-4 h-4" />
                  {t("result.trackingId")}: {timestamp}
                </span>
                {report.offline && (
                  <span className="flex items-center gap-1.5 text-[var(--color-warning)] font-medium">
                    <IconWarning className="w-4 h-4" />
                    {t("result.trackingId")}
                  </span>
                )}
              </div>

              {/* Disclaimer */}
              <div className="alert-warning">
                <IconWarning className="shrink-0 w-5 h-5 mt-0.5" />
                <span className="text-sm">
                  {lang === "fil"
                    ? "Ang resulta na ito ay AI-assisted classification lamang. Ang final action at routing ay responsibilidad ng barangay."
                    : "This result is AI-assisted classification only. Final action and routing are the responsibility of the barangay."}
                </span>
              </div>
            </div>
          </div>

          {/* ── Action Buttons ───────────────────────────────── */}
          <div className="flex gap-3 pt-1">
            <Link
              href="/dashboard"
              className="btn btn-secondary flex-1 py-3 text-base justify-center"
            >
              <IconArrowLeft className="w-5 h-5" />
              {lang === "fil" ? "Bumalik sa Dashboard" : "Back to Dashboard"}
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-ghost text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-[var(--color-border)] hover:border-red-200 py-3 px-5"
            >
              <IconTrash className="w-5 h-5" />
              <span className="hidden sm:inline">
                {t("result.trackingId")}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

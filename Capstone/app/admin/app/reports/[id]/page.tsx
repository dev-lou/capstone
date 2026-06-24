"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getDepartmentSlug, getDepartmentBySlug } from "@/lib/departments";

interface Report {
  id: number;
  tracking_id: string;
  user_id: string;
  text: string;
  category: string;
  confidence: number;
  needs_human_review: boolean;
  urgency: string;
  office: string;
  explanation: string;
  offline: boolean;
  status: string;
  lat: number | null;
  lng: number | null;
  region: string;
  province: string;
  city: string;
  barangay: string;
  created_at: string;
}

const URGENCY_META: Record<string, { bg: string; text: string; bar: string }> = {
  high: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", bar: "bg-red-500" },
  medium: { bg: "bg-yellow-50 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-400", bar: "bg-yellow-500" },
  low: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", bar: "bg-green-500" },
};

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reports?tracking_id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data: { report: Report | null }) => {
        setReport(data.report ?? null);
      })
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="skeleton h-8 w-48 rounded-lg mb-4" />
        <div className="skeleton h-6 w-96 rounded-lg mb-8" />
        <div className="skeleton h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-[var(--color-text-muted)] mb-6">No report found with tracking ID: {id}</p>
          <Link href="/" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const urgency = URGENCY_META[report.urgency] ?? URGENCY_META.medium;
  const timestamp = new Date(report.created_at).toLocaleString("fil-PH", { timeZone: "Asia/Manila", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const location = [report.barangay, report.city, report.province].filter(Boolean).join(", ");

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-ph-navy)] dark:hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/departments/${getDepartmentSlug(report.office)}`} className="hover:text-[var(--color-ph-navy)] dark:hover:text-white transition-colors">
          {getDepartmentBySlug(getDepartmentSlug(report.office))?.shortName ?? report.office}
        </Link>
        <span>/</span>
        <span className="font-mono text-xs text-[var(--color-text-secondary)]">{report.tracking_id}</span>
      </div>

      {/* Tracking ID Banner */}
      <div className="rounded-3xl bg-[var(--color-ph-navy)] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-ph-gold)] text-[var(--color-ph-navy)] flex items-center justify-center shrink-0 shadow-lg text-2xl">
            {getDeptIcon(report.office)}
          </div>
          <div>
            <p className="text-xs text-[var(--color-ph-gold-light)] uppercase font-bold tracking-wider mb-1">Tracking ID</p>
            <p className="font-mono font-black text-white text-xl sm:text-2xl">{report.tracking_id}</p>
          </div>
        </div>
      </div>

      {/* Main Detail Card */}
      <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Urgency header bar */}
        <div className={`flex items-center justify-between px-6 py-4 ${urgency.bg} border-b border-slate-200 dark:border-slate-800`}>
          <span className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider ${urgency.bg} ${urgency.text} border`}>{report.urgency}</span>
          <span className="text-xs font-bold text-[var(--color-text-muted)]">{report.confidence}% confidence</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Category */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Category</div>
            <h2 className="text-2xl font-black text-[var(--color-ph-navy)] dark:text-white">{report.category}</h2>
          </div>

          {/* Office routing */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-ph-navy-pale)] dark:bg-[var(--color-ph-navy)] text-[var(--color-ph-navy)] dark:text-[var(--color-ph-gold)] flex items-center justify-center shrink-0 text-lg">
              {getDeptIcon(report.office)}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-0.5">Routed Agency</p>
              <p className="font-bold text-[var(--color-text)]">{report.office}</p>
            </div>
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-ph-ocean-pale)] dark:bg-[var(--color-ph-ocean)] text-[var(--color-ph-ocean)] dark:text-white flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z" /></svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-0.5">Location</p>
                <p className="font-medium text-[var(--color-text)]">{location}</p>
              </div>
            </div>
          )}

          <div className="divider" />

          {/* Report Text */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Original Report</div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">{report.text}</p>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Explanation</div>
            <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{report.explanation}</p>
          </div>

          {/* Confidence Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Confidence Level</span>
              <span className="font-mono font-bold text-[var(--color-ph-navy)] dark:text-white">{report.confidence}%</span>
            </div>
            <div className="h-2.5 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${report.confidence >= 80 ? "bg-green-500" : report.confidence >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(report.confidence, 100)}%` }}
                role="progressbar" aria-valuenow={report.confidence} aria-valuemin={0} aria-valuemax={100} />
            </div>
          </div>

          {/* Status & Timestamp */}
          <div className="flex items-center justify-between pt-2 text-sm text-[var(--color-text-muted)] border-t border-slate-200 dark:border-slate-800">
            <span>Status: <strong className="text-[var(--color-text)]">{report.status}</strong></span>
            <span>{timestamp}</span>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 text-xs p-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className="shrink-0 w-4 h-4 mt-0.5">
              <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Z" />
            </svg>
            <span>AI-assisted classification only. Final action and routing are the responsibility of the barangay.</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Link
        href={`/departments/${getDepartmentSlug(report.office)}`}
        className="btn btn-secondary w-full justify-center"
      >
        ← Back to {(getDepartmentBySlug(getDepartmentSlug(report.office))?.shortName) ?? report.office}
      </Link>
    </motion.div>
  );
}

function getDeptIcon(office: string): string {
  const dept = getDepartmentBySlug(getDepartmentSlug(office));
  return dept?.icon ?? "📋";
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getDepartmentSlug, getDepartmentBySlug } from "@/lib/departments";

interface Note {
  text: string;
  author: string;
  created_at: string;
}

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
  internal_notes: Note[];
  lat: number | null;
  lng: number | null;
  region: string;
  province: string;
  city: string;
  barangay: string;
  created_at: string;
}

const STATUS_FLOW: Record<string, string | null> = {
  pending: "in-progress",
  "in-progress": "resolved",
  resolved: null,
};

const STATUS_META: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: "Pending", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-400" },
  "in-progress": { label: "In Progress", bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  resolved: { label: "Resolved", bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
};

const URGENCY_META: Record<string, { bg: string; text: string; bar: string }> = {
  high: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", bar: "bg-red-500" },
  medium: { bg: "bg-yellow-50 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-400", bar: "bg-yellow-500" },
  low: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", bar: "bg-green-500" },
};

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
    </svg>
  );
}

function IconNote({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M216,40V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V40A16,16,0,0,1,56,24H88a8,8,0,0,1,8-8h64a8,8,0,0,1,8,8h32A16,16,0,0,1,216,40Z" />
    </svg>
  );
}

function IconSpinner({ className = "" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");

  const fetchReport = () => {
    setLoading(true);
    fetch(`/api/reports?tracking_id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data: { report: Report | null }) => {
        setReport(data.report ?? null);
      })
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReport(); }, [id]);

  const nextStatus = report ? STATUS_FLOW[report.status] : null;

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    setUpdateError(null);

    try {
      const body: { status: string; note?: string } = { status: newStatus };
      if (noteInput.trim()) {
        body.note = noteInput.trim();
      }

      const res = await fetch(`/api/reports/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update report");
      }

      setNoteInput("");
      fetchReport();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteInput.trim()) return;
    setUpdating(true);
    setUpdateError(null);

    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add note");
      }

      setNoteInput("");
      fetchReport();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const getNextAction = () => {
    if (!report || !nextStatus) return null;
    const meta = STATUS_META[nextStatus];
    if (report.status === "pending") return { action: "Mark In Progress", status: "in-progress", ...meta };
    if (report.status === "in-progress") return { action: "Mark Resolved", status: "resolved", ...meta };
    return null;
  };

  const nextAction = getNextAction();

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
          <div className="mb-4 flex justify-center">
            <svg width="64" height="64" viewBox="0 0 256 256" fill="currentColor" className="text-slate-300 dark:text-slate-600" aria-hidden="true">
              <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,96a8,8,0,0,1,16,0v48a8,8,0,0,1-16,0Zm8,80a12,12,0,1,1,12-12A12,12,0,0,1,128,176Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-[var(--color-text-muted)] mb-6">No report found with tracking ID: {id}</p>
          <Link href="/" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const urgency = URGENCY_META[report.urgency] ?? URGENCY_META.medium;
  const statusMeta = STATUS_META[report.status] ?? STATUS_META.pending;
  const timestamp = new Date(report.created_at).toLocaleString("fil-PH", { timeZone: "Asia/Manila", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const location = [report.barangay, report.city, report.province].filter(Boolean).join(", ");
  const notes = report.internal_notes || [];

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
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-ph-gold)] text-[var(--color-ph-navy)] flex items-center justify-center shrink-0 shadow-lg text-2xl"
            dangerouslySetInnerHTML={{ __html: getDeptIcon(report.office) }} />
          <div>
            <p className="text-xs text-[var(--color-ph-gold-light)] uppercase font-bold tracking-wider mb-1">Tracking ID</p>
            <p className="font-mono font-black text-white text-xl sm:text-2xl">{report.tracking_id}</p>
          </div>
        </div>
      </div>

      {/* Status & Actions Bar */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${statusMeta.bg} ${statusMeta.text} border-current`}>
            {statusMeta.label}
          </span>
          {report.status === "resolved" && <IconCheck className="w-4 h-4 text-green-500" />}
        </div>

        <div className="flex items-center gap-3">
          {nextAction && (
            <button
              onClick={() => handleStatusUpdate(nextAction.status)}
              disabled={updating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c1f3e] hover:bg-[#162d58] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
            >
              {updating ? (
                <IconSpinner className="w-3.5 h-3.5" />
              ) : (
                <IconArrowRight className="w-3.5 h-3.5" />
              )}
              {nextAction.action}
            </button>
          )}
          <button
            onClick={async () => {
              if (!window.confirm("Delete this report? This action cannot be undone.")) return;
              setUpdating(true);
              try {
                const res = await fetch(`/api/reports/${encodeURIComponent(id)}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Failed to delete");
                router.push(`/departments/${getDepartmentSlug(report.office)}`);
                router.refresh();
              } catch (err) {
                setUpdateError(err instanceof Error ? err.message : "Failed to delete report");
              } finally {
                setUpdating(false);
              }
            }}
            disabled={updating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
          >
            <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM192,208H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/></svg>
            Delete
          </button>
        </div>
      </div>

      {updateError && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm" role="alert">
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className="shrink-0 mt-0.5 w-4 h-4" aria-hidden="true">
            <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,96a8,8,0,0,1,16,0v48a8,8,0,0,1-16,0Zm8,80a12,12,0,1,1,12-12A12,12,0,0,1,128,176Z" />
          </svg>
          <span>{updateError}</span>
        </div>
      )}

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
            <div className="w-10 h-10 rounded-xl bg-[var(--color-ph-navy-pale)] dark:bg-[var(--color-ph-navy)] text-[var(--color-ph-navy)] dark:text-[var(--color-ph-gold)] flex items-center justify-center shrink-0 text-lg"
              dangerouslySetInnerHTML={{ __html: getDeptIcon(report.office) }} />
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

          {/* Timestamp */}
          <div className="flex items-center justify-between pt-2 text-sm text-[var(--color-text-muted)] border-t border-slate-200 dark:border-slate-800">
            <span>Submitted: <strong className="text-[var(--color-text)]">{timestamp}</strong></span>
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

      {/* ── Internal Notes Section ────────────────────────────── */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IconNote className="w-4 h-4 text-[var(--color-ph-gold)]" />
            <h3 className="font-bold text-sm text-[var(--color-text)]">Internal Notes</h3>
            {notes.length > 0 && (
              <span className="text-xs font-bold text-[var(--color-text-muted)] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{notes.length}</span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Notes List */}
          {notes.length === 0 ? (
            <div className="text-center py-6">
              <svg width="32" height="32" viewBox="0 0 256 256" fill="currentColor" className="text-slate-300 dark:text-slate-600 mx-auto mb-3" aria-hidden="true">
                <path d="M216,40V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V40A16,16,0,0,1,56,24H88a8,8,0,0,1,8-8h64a8,8,0,0,1,8,8h32A16,16,0,0,1,216,40Z" />
              </svg>
              <p className="text-xs text-[var(--color-text-muted)]">No internal notes yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note, idx) => {
                const noteDate = new Date(note.created_at).toLocaleString("fil-PH", {
                  timeZone: "Asia/Manila",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-ph-navy)] text-[var(--color-ph-gold)] flex items-center justify-center shrink-0 text-xs font-black">
                      {note.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[var(--color-text)]">{note.author}</span>
                        <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                          <IconClock className="w-3 h-3" />
                          {noteDate}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{note.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {/* Add Note Form */}
          <div className="space-y-3">
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add an internal note about this report..."
              rows={3}
              disabled={updating}
              className="w-full resize-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#c8911e]/30 focus:border-[#c8911e] transition-all disabled:opacity-50"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setNoteInput("")}
                disabled={updating || !noteInput.trim()}
                className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors disabled:opacity-50 disabled:pointer-events-none px-3 py-2"
              >
                Clear
              </button>
              <button
                onClick={handleAddNote}
                disabled={updating || !noteInput.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c1f3e] hover:bg-[#162d58] text-white text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
              >
                {updating ? <IconSpinner className="w-3.5 h-3.5" /> : <IconNote className="w-3.5 h-3.5" />}
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Link
        href={`/departments/${getDepartmentSlug(report.office)}`}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-slate-300 dark:hover:border-slate-600 transition-all"
      >
        <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" /></svg>
        Back to {getDepartmentBySlug(getDepartmentSlug(report.office))?.shortName ?? report.office}
      </Link>
    </motion.div>
  );
}

function getDeptIcon(office: string): string {
  const dept = getDepartmentBySlug(getDepartmentSlug(office));
  return dept?.icon ?? `<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,40V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V40A16,16,0,0,1,56,24H88a8,8,0,0,1,8-8h64a8,8,0,0,1,8,8h32A16,16,0,0,1,216,40ZM184,40H168a8,8,0,0,1-8-8H96a8,8,0,0,1-8,8H72V216H184ZM88,112a8,8,0,0,0,16,0,8,8,0,0,1,8-8h32a8,8,0,0,1,8,8,8,8,0,0,0,16,0,24,24,0,0,0-24-24H112A24,24,0,0,0,88,112Zm80,72a8,8,0,0,0-8-8H96a8,8,0,0,0,0,16h64A8,8,0,0,0,168,184Zm0-32a8,8,0,0,0-8-8H96a8,8,0,0,0,0,16h64A8,8,0,0,0,168,152Z"/></svg>`;
}

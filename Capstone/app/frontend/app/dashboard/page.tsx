"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getReports, updateReportStatus, deleteReport, clearReports, type SavedReport, type ReportStatus } from "@/lib/storage";
import { t, getLangFromStorage, setLangInStorage, type Language } from "@/lib/i18n";
import { reportsToCsv, downloadCsv, downloadJson, generateExportFilename } from "@/lib/export";
import {
  IconChartBar, IconCircle, IconCheck, IconTrash, IconSearch,
  IconPlus, IconDownload, IconBuilding, IconClock, IconArrowRight,
} from "../components/icons";
import { Select } from "../components/select";
import { MultiSelect } from "../components/multi-select";

// ────────────────────────────────────────────────────────────
// Urgency Config
// ────────────────────────────────────────────────────────────

const URGENCY_META: Record<string, { bg: string; text: string; dot: string }> = {
  high: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "text-red-500" },
  medium: { bg: "bg-yellow-50 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-400", dot: "text-yellow-500" },
  low: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", dot: "text-green-500" },
};

// ────────────────────────────────────────────────────────────
// Motion variants
// ────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [lang, setLang] = useState<Language>("fil");
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [filter, setFilter] = useState<"all" | ReportStatus>("all");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setLang(getLangFromStorage());
    setReports(getReports());
  }, []);

  const toggleLang = useCallback(() => {
    const next = lang === "fil" ? "en" : "fil";
    setLang(next);
    setLangInStorage(next);
  }, [lang]);

  const refreshReports = useCallback(() => setReports(getReports()), []);

  const handleStatusChange = useCallback((id: string, status: ReportStatus) => {
    updateReportStatus(id, status);
    refreshReports();
  }, [refreshReports]);

  const handleDelete = useCallback((id: string) => {
    deleteReport(id);
    refreshReports();
  }, [refreshReports]);

  const handleClearAll = useCallback(() => {
    if (window.confirm(lang === "fil" ? "Burahin lahat ng reports?" : "Delete all reports?")) {
      clearReports();
      refreshReports();
    }
  }, [lang, refreshReports]);

  // ── Export Handlers ─────────────────────────────────────

  const handleExportCsv = useCallback(() => {
    const csv = reportsToCsv(reports, lang);
    downloadCsv(csv, generateExportFilename("rescuemind-reports", "csv"));
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }, [reports, lang]);

  const handleExportJson = useCallback(() => {
    downloadJson(reports, generateExportFilename("rescuemind-reports", "json"));
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }, [reports]);

  // ── Derived: unique categories from reports ────────────

  const uniqueCategories = useMemo(() => {
    const cats = new Set(reports.map((r) => r.category));
    return Array.from(cats).sort();
  }, [reports]);

  // ── Reset filters when options disappear ──────────────

  useEffect(() => {
    const valid = categoryFilter.filter((c) => uniqueCategories.includes(c));
    if (valid.length !== categoryFilter.length) {
      setCategoryFilter(valid);
    }
  }, [uniqueCategories, categoryFilter]);

  // ── Filtering & Search ────────────────────────────────

  const filtered = useMemo(() => {
    let list = reports;
    if (filter !== "all") list = list.filter((r) => r.status === filter);
    if (urgencyFilter) list = list.filter((r) => r.urgency === urgencyFilter);
    if (categoryFilter.length > 0) list = list.filter((r) => categoryFilter.includes(r.category));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) => r.text.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.trackingId.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reports, filter, search, urgencyFilter, categoryFilter]);

  // ── Stats ─────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = reports.length;
    const byUrgency = { high: 0, medium: 0, low: 0 };
    const byStatus = { pending: 0, "in-progress": 0, resolved: 0 };
    reports.forEach((r) => {
      byUrgency[r.urgency as keyof typeof byUrgency]++;
      byStatus[r.status]++;
    });
    return { total, byUrgency, byStatus };
  }, [reports]);

  // ── Render ────────────────────────────────────────────

  if (!isClient) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="card p-6 space-y-4">
          <div className="skeleton h-7 w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
          <div className="skeleton h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <IconChartBar className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{t("dashboard.title", lang)}</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-[34px]">{t("dashboard.description", lang)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="btn btn-ghost text-xs py-1.5 px-2.5"
            aria-label={lang === "fil" ? "Switch to English" : "Lumipat sa Filipino"}>
            <span className="text-base" aria-hidden="true">{lang === "fil" ? "🇺🇸" : "🇵🇭"}</span>
            <span className="hidden sm:inline">{lang === "fil" ? "English" : "Filipino"}</span>
          </button>
          <Link href="/report" className="btn btn-primary text-xs py-1.5 px-3">
            <IconPlus /><span className="hidden sm:inline">{t("form.submit", lang)}</span>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: t("dashboard.total", lang), value: stats.total, bg: "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700", textColor: "text-slate-900 dark:text-slate-100" },
          { label: t("dashboard.high", lang), value: stats.byUrgency.high, bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800", textColor: "text-red-700 dark:text-red-400", dot: "text-red-500" },
          { label: t("dashboard.medium", lang), value: stats.byUrgency.medium, bg: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800", textColor: "text-yellow-700 dark:text-yellow-400", dot: "text-yellow-500" },
          { label: t("dashboard.low", lang), value: stats.byUrgency.low, bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800", textColor: "text-green-700 dark:text-green-400", dot: "text-green-500" },
        ].map((card, i) => (
          <motion.div key={i} variants={fadeUp} className={`card border ${card.bg} p-4`}>
            <div className={`text-2xl font-bold ${card.textColor}`}>{card.value}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {card.dot && <IconCircle className={card.dot} />}
              <span className="text-xs text-slate-500 dark:text-slate-400">{card.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters + Export */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="flex flex-wrap items-center gap-2 mb-4">
        {/* Status Filter */}
        <Select
          value={filter}
          onChange={(val) => setFilter(val as "all" | ReportStatus)}
          placeholder={t("dashboard.filterStatus", lang)}
          options={[
            { value: "all", label: t("dashboard.allStatuses", lang) },
            { value: "pending", label: `${t("dashboard.filterPending", lang)} (${stats.byStatus.pending})` },
            { value: "in-progress", label: `${t("dashboard.filterInProgress", lang)} (${stats.byStatus["in-progress"]})` },
            { value: "resolved", label: `${t("dashboard.filterResolved", lang)} (${stats.byStatus.resolved})` },
          ]}
          size="sm"
          className="w-40"
        />

        {/* Urgency Filter */}
        <Select
          value={urgencyFilter}
          onChange={setUrgencyFilter}
          placeholder={t("dashboard.filterUrgency", lang)}
          options={[
            { value: "", label: t("dashboard.allUrgencies", lang) },
            { value: "high", label: `${t("dashboard.high", lang)} (${stats.byUrgency.high})` },
            { value: "medium", label: `${t("dashboard.medium", lang)} (${stats.byUrgency.medium})` },
            { value: "low", label: `${t("dashboard.low", lang)} (${stats.byUrgency.low})` },
          ]}
          size="sm"
          className="w-44"
        />

        {/* Category Filter — Multi-select */}
        <MultiSelect
          values={categoryFilter}
          onChange={setCategoryFilter}
          placeholder={t("dashboard.filterCategory", lang)}
          options={uniqueCategories.map((cat) => ({ value: cat, label: cat }))}
          selectAllLabel={lang === "fil" ? "Piliin Lahat" : "Select All"}
          deselectAllLabel={lang === "fil" ? "Alisin Lahat" : "Deselect All"}
          clearAllLabel={lang === "fil" ? "Linisin Lahat" : "Clear All"}
          size="sm"
          className="w-56"
          showSelectAll={true}
        />

        <div className="flex-1" />
        {reports.length > 0 && (
          <>
            <button onClick={handleExportCsv} className="btn btn-ghost text-xs py-1.5 px-2.5 gap-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30">
              <IconDownload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("dashboard.exportCsv", lang)}</span>
            </button>
            {exported && <span className="text-[0.6rem] text-green-600 dark:text-green-400 animate-pulse">{lang === "fil" ? "Na-export!" : "Exported!"}</span>}
          </>
        )}
        <div className="relative w-full sm:w-auto">
          <label htmlFor="search-reports" className="sr-only">{t("dashboard.search", lang)}</label>
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-3.5 h-3.5 pointer-events-none" />
          <input id="search-reports" type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dashboard.search", lang)} className="input text-xs py-1.5 pl-8 sm:w-52" />
        </div>
        {reports.length > 0 && (
          <button onClick={handleClearAll} className="btn btn-ghost text-xs text-red-600 dark:text-red-400 py-1.5 px-2.5 hover:bg-red-50 dark:hover:bg-red-950/30">
            <IconTrash /><span className="hidden sm:inline">{t("dashboard.clearAll", lang)}</span>
          </button>
        )}
      </motion.div>

      {/* Report List */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" variants={fadeUp} initial="initial" animate="animate" exit="exit" className="card p-12 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                <svg width="32" height="32" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                  <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96H72a8,8,0,0,0,0,16H184a8,8,0,0,0,0-16Zm0,32H72a8,8,0,0,0,0,16H184a8,8,0,0,0,0-16Z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t("dashboard.noReports", lang)}</p>
            <Link href="/report" className="btn btn-primary mt-4 inline-flex text-sm">
              <IconPlus /><span>{t("form.submit", lang)}</span>
            </Link>
          </motion.div>
        ) : (
          <motion.div key="list" variants={stagger} initial="initial" animate="animate" className="space-y-2">
            {filtered.map((report) => {
              const urgency = URGENCY_META[report.urgency] ?? URGENCY_META.medium;
              const timestamp = new Date(report.timestamp).toLocaleString("fil-PH", {
                timeZone: "Asia/Manila", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
              });

              const statusLabel = report.status === "pending" ? t("dashboard.statusPending", lang)
                : report.status === "in-progress" ? t("dashboard.statusInProgress", lang)
                : t("dashboard.statusResolved", lang);

              const statusClasses = report.status === "resolved"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : report.status === "in-progress"
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";

              return (
                <motion.div key={report.trackingId} variants={fadeUp} className="card overflow-hidden hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/dashboard/${report.trackingId}`} className="flex-1 min-w-0 group">
                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                          <span className={`badge ${urgency.bg} ${urgency.text} border`}>
                            <IconCircle className={`${urgency.dot} w-2 h-2`} />
                            {report.urgency === "high" ? t("dashboard.high", lang)
                              : report.urgency === "medium" ? t("dashboard.medium", lang)
                              : t("dashboard.low", lang)}
                          </span>
                          <span className="tag font-mono">{report.trackingId}</span>
                          {report.needsHumanReview && (
                            <span className="tag bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">Review</span>
                          )}
                        </div>

                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {report.category}
                          <IconArrowRight className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{report.text}</p>

                        <div className="flex items-center gap-3 mt-2 text-[0.65rem] text-slate-400 dark:text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1"><IconBuilding />{report.office}</span>
                          <span className="flex items-center gap-1"><IconClock />{timestamp}</span>
                        </div>
                      </Link>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`badge ${statusClasses} border-0`}>{statusLabel}</span>

                        <div className="flex items-center gap-1">
                          {report.status === "pending" && (
                            <button onClick={() => handleStatusChange(report.trackingId, "in-progress")}
                              className="btn btn-ghost text-[0.6rem] py-0.5 px-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                              title={t("dashboard.markInProgress", lang)} aria-label={t("dashboard.markInProgress", lang)}>
                              <IconCheck className="w-3 h-3" />
                            </button>
                          )}
                          {report.status === "in-progress" && (
                            <button onClick={() => handleStatusChange(report.trackingId, "resolved")}
                              className="btn btn-ghost text-[0.6rem] py-0.5 px-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"
                              title={t("dashboard.markResolved", lang)} aria-label={t("dashboard.markResolved", lang)}>
                              <IconCheck className="w-3 h-3" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(report.trackingId)}
                            className="btn btn-ghost text-[0.6rem] py-0.5 px-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                            title={t("dashboard.delete", lang)} aria-label={t("dashboard.delete", lang)}>
                            <IconTrash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length > 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-4 text-center text-[0.65rem] text-slate-400 dark:text-slate-500">
          {lang === "fil" ? `${filtered.length} sa ${reports.length} na report` : `${filtered.length} of ${reports.length} reports`}
          {filter !== "all" && (lang === "fil" ? " ang ipinapakita" : " shown")}
        </motion.p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Export Utilities — CSV, JSON export for government reporting
// ────────────────────────────────────────────────────────────

import { type SavedReport } from "./storage";
import type { Language } from "./i18n";

// ── CSV Export ────────────────────────────────────────────

export function reportsToCsv(reports: SavedReport[], lang: Language = "en"): string {
  const headers = [
    lang === "fil" ? "Tracking ID" : "Tracking ID",
    lang === "fil" ? "Petsa" : "Date",
    lang === "fil" ? "Kategorya" : "Category",
    lang === "fil" ? "Urgency" : "Urgency",
    lang === "fil" ? "Opisina" : "Office",
    lang === "fil" ? "Katayuan" : "Status",
    lang === "fil" ? "Kumpiyansa (%)" : "Confidence (%)",
    lang === "fil" ? "Rehiyon" : "Region",
    lang === "fil" ? "Lalawigan" : "Province",
    lang === "fil" ? "Lungsod" : "City",
    lang === "fil" ? "Barangay" : "Barangay",
    lang === "fil" ? "Kailangan ng Review" : "Needs Review",
    lang === "fil" ? "Text ng Report" : "Report Text",
    lang === "fil" ? "Paliwanag" : "Explanation",
  ];

  const rows = reports.map((r) => [
    escapeCsvField(r.trackingId),
    escapeCsvField(new Date(r.timestamp).toISOString()),
    escapeCsvField(r.category),
    escapeCsvField(r.urgency),
    escapeCsvField(r.office),
    escapeCsvField(r.status),
    String(r.confidence),
    escapeCsvField(r.location?.region ?? ""),
    escapeCsvField(r.location?.province ?? ""),
    escapeCsvField(r.location?.city ?? ""),
    escapeCsvField(r.location?.barangay ?? ""),
    r.needsHumanReview ? (lang === "fil" ? "Oo" : "Yes") : (lang === "fil" ? "Hindi" : "No"),
    escapeCsvField(r.text),
    escapeCsvField(r.explanation),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// ── Download Helpers ──────────────────────────────────────

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── Filename Generators ───────────────────────────────────

export function generateExportFilename(prefix: string, format: "csv" | "json"): string {
  const date = new Date().toISOString().split("T")[0];
  return `${prefix}-${date}.${format}`;
}

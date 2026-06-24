// ────────────────────────────────────────────────────────────
// Report Storage — Industry‑standard client‑side persistence
// Uses localStorage with typed schemas and history tracking
// ────────────────────────────────────────────────────────────

export type ReportStatus = "pending" | "in-progress" | "resolved";

export interface SavedReport {
  trackingId: string;
  timestamp: string;
  text: string;
  category: string;
  confidence: number;
  needsHumanReview: boolean;
  urgency: "high" | "medium" | "low";
  office: string;
  explanation: string;
  offline: boolean;
  status: ReportStatus;
  location?: {
    lat: number | null;
    lng: number | null;
    region: string;
    province: string;
    city: string;
    barangay: string;
  };
}

const STORAGE_KEY = "rescuemind_reports";
const MAX_REPORTS = 500; // Safety limit

// ── Read all saved reports ────────────────────────────────

export function getReports(): SavedReport[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: SavedReport[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch {
    console.warn("Failed to parse reports from localStorage");
    return [];
  }
}

// ── Save a new report ─────────────────────────────────────

export function saveReport(report: SavedReport): void {
  if (typeof window === "undefined") return;

  try {
    const reports = getReports();
    reports.unshift(report);

    // Trim to max
    const trimmed = reports.slice(0, MAX_REPORTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error("Failed to save report:", e);
  }
}

// ── Update report status ──────────────────────────────────

export function updateReportStatus(
  trackingId: string,
  status: ReportStatus
): void {
  if (typeof window === "undefined") return;

  try {
    const reports = getReports();
    const index = reports.findIndex(
      (r) => r.trackingId === trackingId
    );
    if (index === -1) return;

    reports[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error("Failed to update report status:", e);
  }
}

// ── Delete a report ───────────────────────────────────────

export function deleteReport(trackingId: string): void {
  if (typeof window === "undefined") return;

  try {
    const reports = getReports();
    const filtered = reports.filter(
      (r) => r.trackingId !== trackingId
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete report:", e);
  }
}

// ── Clear all reports ─────────────────────────────────────

export function clearReports(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear reports:", e);
  }
}

// ── Generate a tracking ID ────────────────────────────────

export function generateTrackingId(): string {
  const prefix = "RM";
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(
    date.getMonth() + 1
  ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${dateStr}-${random}`;
}

// ── Admin Export Utilities ───────────────────────────────
// Handles CSV/JSON export of reports for admin use.

export function reportsToCsv(
  reports: Array<Record<string, unknown>>,
  fieldOrder: string[]
): string {
  const header = fieldOrder.map((f) => `"${f}"`).join(",");
  const rows = reports.map((r) =>
    fieldOrder
      .map((f) => {
        const val = r[f];
        if (val === null || val === undefined) return "";
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJson(data: unknown, filename: string) {
  downloadFile(JSON.stringify(data, null, 2), filename, "application/json");
}

export function generateExportFilename(prefix: string, ext: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `${prefix}-${date}.${ext}`;
}

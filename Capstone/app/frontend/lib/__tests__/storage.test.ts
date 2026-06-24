import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getReports,
  saveReport,
  updateReportStatus,
  deleteReport,
  clearReports,
  generateTrackingId,
  type SavedReport,
} from "../storage";

// ────────────────────────────────────────────────────────────
// Mock localStorage
// ────────────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

// ────────────────────────────────────────────────────────────
// Test Factory
// ────────────────────────────────────────────────────────────

function createSampleReport(overrides?: Partial<SavedReport>): SavedReport {
  return {
    trackingId: "RM-20240623-TEST",
    timestamp: new Date("2024-06-23T10:00:00Z").toISOString(),
    text: "Malakas na baha sa may kanto",
    category: "Flood / Drainage",
    confidence: 94.23,
    needsHumanReview: false,
    urgency: "high",
    office: "City Engineering / DPWH",
    explanation: "Salamat sa report.",
    offline: false,
    status: "pending",
    ...overrides,
  };
}

// ────────────────────────────────────────────────────────────
// Tests
// ────────────────────────────────────────────────────────────

describe("storage", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("getReports", () => {
    it("returns empty array when no reports stored", () => {
      const reports = getReports();
      expect(reports).toEqual([]);
    });

    it("returns sorted reports (newest first)", () => {
      const old = createSampleReport({
        trackingId: "RM-20240623-001",
        timestamp: new Date("2024-06-23T08:00:00Z").toISOString(),
      });
      const recent = createSampleReport({
        trackingId: "RM-20240623-002",
        timestamp: new Date("2024-06-23T10:00:00Z").toISOString(),
      });

      saveReport(old);
      saveReport(recent);

      const reports = getReports();
      expect(reports).toHaveLength(2);
      expect(reports[0].trackingId).toBe("RM-20240623-002");
    });

    it("handles corrupted localStorage gracefully", () => {
      localStorageMock.getItem.mockReturnValueOnce("not-json");
      const reports = getReports();
      expect(reports).toEqual([]);
    });
  });

  describe("saveReport", () => {
    it("saves a report to localStorage", () => {
      const report = createSampleReport();
      saveReport(report);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "rescuemind_reports",
        expect.any(String)
      );

      const reports = getReports();
      expect(reports).toHaveLength(1);
      expect(reports[0].trackingId).toBe("RM-20240623-TEST");
    });

    it("limits to MAX_REPORTS (500)", () => {
      for (let i = 0; i < 510; i++) {
        saveReport(
          createSampleReport({
            trackingId: `RM-20240623-${String(i).padStart(3, "0")}`,
          })
        );
      }

      const reports = getReports();
      expect(reports.length).toBeLessThanOrEqual(500);
    });
  });

  describe("updateReportStatus", () => {
    it("updates status of an existing report", () => {
      const report = createSampleReport();
      saveReport(report);

      updateReportStatus("RM-20240623-TEST", "in-progress");

      const reports = getReports();
      expect(reports[0].status).toBe("in-progress");
    });

    it("does nothing for non-existent tracking ID", () => {
      const report = createSampleReport();
      saveReport(report);

      updateReportStatus("NONEXISTENT", "resolved");

      const reports = getReports();
      expect(reports).toHaveLength(1);
      expect(reports[0].status).toBe("pending");
    });
  });

  describe("deleteReport", () => {
    it("removes a report by tracking ID", () => {
      saveReport(createSampleReport({ trackingId: "RM-001" }));
      saveReport(createSampleReport({ trackingId: "RM-002" }));

      deleteReport("RM-001");

      const reports = getReports();
      expect(reports).toHaveLength(1);
      expect(reports[0].trackingId).toBe("RM-002");
    });
  });

  describe("clearReports", () => {
    it("removes all reports", () => {
      saveReport(createSampleReport());
      saveReport(createSampleReport());

      clearReports();

      expect(getReports()).toEqual([]);
    });
  });

  describe("generateTrackingId", () => {
    it("generates an ID in format RM-YYYYMMDD-XXXX", () => {
      const id = generateTrackingId();
      expect(id).toMatch(/^RM-\d{8}-[A-Z0-9]{4}$/);
    });

    it("generates unique IDs", () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateTrackingId()));
      expect(ids.size).toBe(100);
    });
  });
});

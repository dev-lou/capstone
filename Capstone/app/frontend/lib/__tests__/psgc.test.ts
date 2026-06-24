import { describe, it, expect } from "vitest";
import {
  REGIONS,
  PROVINCES,
  getProvincesByRegion,
  getRegionByCode,
  getProvinceByCode,
} from "../psgc";

describe("psgc", () => {
  describe("REGIONS", () => {
    it("has exactly 17 regions", () => {
      expect(REGIONS).toHaveLength(17);
    });

    it("includes NCR", () => {
      const ncr = REGIONS.find((r) => r.code === "01");
      expect(ncr).toBeDefined();
      expect(ncr!.name).toContain("NCR");
    });

    it("includes BARMM", () => {
      const barmm = REGIONS.find((r) => r.code === "17");
      expect(barmm).toBeDefined();
      expect(barmm!.name).toContain("BARMM");
    });

    it("all regions have unique codes", () => {
      const codes = REGIONS.map((r) => r.code);
      expect(new Set(codes).size).toBe(codes.length);
    });
  });

  describe("PROVINCES", () => {
    it("has at least 80 provinces", () => {
      expect(PROVINCES.length).toBeGreaterThanOrEqual(80);
    });

    it("includes Metro Manila", () => {
      const mm = PROVINCES.find((p) => p.name.includes("Metro Manila"));
      expect(mm).toBeDefined();
      expect(mm!.regionCode).toBe("01");
    });

    it("all provinces have valid region codes", () => {
      const regionCodes = new Set(REGIONS.map((r) => r.code));
      const invalid = PROVINCES.filter((p) => !regionCodes.has(p.regionCode));
      expect(invalid).toHaveLength(0);
    });

    it("all provinces have unique codes", () => {
      const codes = PROVINCES.map((p) => p.code);
      expect(new Set(codes).size).toBe(codes.length);
    });
  });

  describe("getProvincesByRegion", () => {
    it("returns provinces for a valid region code", () => {
      const ncrProvinces = getProvincesByRegion("01");
      expect(ncrProvinces).toHaveLength(1);
      expect(ncrProvinces[0].name).toContain("Metro Manila");
    });

    it("returns multiple provinces for large regions", () => {
      const calabarzon = getProvincesByRegion("06");
      expect(calabarzon.length).toBeGreaterThanOrEqual(5);
    });

    it("returns empty array for invalid region code", () => {
      expect(getProvincesByRegion("99")).toEqual([]);
    });
  });

  describe("getRegionByCode", () => {
    it("finds a region by code", () => {
      const region = getRegionByCode("06");
      expect(region).toBeDefined();
      expect(region!.name).toContain("CALABARZON");
    });

    it("returns undefined for invalid code", () => {
      expect(getRegionByCode("99")).toBeUndefined();
    });
  });

  describe("getProvinceByCode", () => {
    it("finds a province by code", () => {
      const province = getProvinceByCode("25");
      expect(province).toBeDefined();
      expect(province!.name).toBe("Cavite");
    });

    it("returns undefined for invalid code", () => {
      expect(getProvinceByCode("999")).toBeUndefined();
    });
  });
});

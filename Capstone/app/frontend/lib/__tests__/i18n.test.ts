import { describe, it, expect, beforeEach } from "vitest";
import { t, getLangFromStorage, setLangInStorage } from "../i18n";

describe("i18n", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("t (translate)", () => {
    it("returns Filipino translation when lang is 'fil'", () => {
      expect(t("form.submit", "fil")).toBe("Isumite ang Report");
    });

    it("returns English translation when lang is 'en'", () => {
      expect(t("form.submit", "en")).toBe("Submit Report");
    });

    it("returns the key itself for unknown keys", () => {
      expect(t("nonexistent.key", "fil")).toBe("nonexistent.key");
    });

    it("returns correct Filipino for all loading steps", () => {
      expect(t("loading.step1", "fil")).toBe("Ina-analyze ang text...");
      expect(t("loading.step2", "fil")).toBe("Kino-classify ang kategorya...");
      expect(t("loading.step3", "fil")).toBe("Nag-ge-generate ng paliwanag...");
    });

    it("returns correct English for all loading steps", () => {
      expect(t("loading.step1", "en")).toBe("Analyzing text...");
      expect(t("loading.step2", "en")).toBe("Classifying category...");
      expect(t("loading.step3", "en")).toBe("Generating explanation...");
    });

    it("has both languages for all keys", () => {
      // Spot-check several important keys
      const keys = [
        "form.submit",
        "form.title",
        "loading.title",
        "result.office",
        "dashboard.title",
        "disclaimer.text",
        "offline.title",
        "error.generic",
      ];

      for (const key of keys) {
        const fil = t(key, "fil");
        const en = t(key, "en");
        expect(fil).not.toBe(key);
        expect(en).not.toBe(key);
        expect(fil).toBeTruthy();
        expect(en).toBeTruthy();
      }
    });
  });

  describe("getLangFromStorage", () => {
    it("returns 'fil' when nothing is stored", () => {
      expect(getLangFromStorage()).toBe("fil");
    });

    it("returns stored language", () => {
      localStorage.setItem("rescuemind_lang", "en");
      expect(getLangFromStorage()).toBe("en");
    });
  });

  describe("setLangInStorage", () => {
    it("persists language to localStorage", () => {
      setLangInStorage("en");
      expect(localStorage.getItem("rescuemind_lang")).toBe("en");

      setLangInStorage("fil");
      expect(localStorage.getItem("rescuemind_lang")).toBe("fil");
    });
  });
});

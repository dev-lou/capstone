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

    it("falls back to English then key for unknown keys in all languages", () => {
      expect(t("nonexistent.key", "ceb")).toBe("nonexistent.key");
      expect(t("nonexistent.key", "war")).toBe("nonexistent.key");
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
  });

  describe("getLangFromStorage", () => {
    it("returns default language when nothing is stored", () => {
      expect(getLangFromStorage()).toBeDefined();
    });

    it("returns stored language", () => {
      localStorage.setItem("rescuemind_lang", "ceb");
      expect(getLangFromStorage()).toBe("ceb");
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

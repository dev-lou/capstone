// ────────────────────────────────────────────────────────────
// i18n — Multi‑language system for 12 Philippine languages
// 2026 Industry‑standard: JSON messages, React Context,
// browser auto‑detection, locale‑aware formatting
// ────────────────────────────────────────────────────────────

"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";

// ── All 12 Philippine Languages ──────────────────────────────

export const LANGUAGES = [
  { code: "fil" as const, label: "Filipino", nativeLabel: "Filipino", iso: "fil-PH", dir: "ltr" as const },
  { code: "en" as const, label: "English", nativeLabel: "English", iso: "en-PH", dir: "ltr" as const },
  { code: "ceb" as const, label: "Cebuano", nativeLabel: "Cebuano", iso: "ceb-PH", dir: "ltr" as const },
  { code: "ilo" as const, label: "Ilocano", nativeLabel: "Ilocano", iso: "ilo-PH", dir: "ltr" as const },
  { code: "hil" as const, label: "Hiligaynon", nativeLabel: "Hiligaynon", iso: "hil-PH", dir: "ltr" as const },
  { code: "war" as const, label: "Waray", nativeLabel: "Waray", iso: "war-PH", dir: "ltr" as const },
  { code: "bcl" as const, label: "Bikol", nativeLabel: "Bikol", iso: "bcl-PH", dir: "ltr" as const },
  { code: "pam" as const, label: "Kapampangan", nativeLabel: "Kapampangan", iso: "pam-PH", dir: "ltr" as const },
  { code: "pag" as const, label: "Pangasinan", nativeLabel: "Pangasinan", iso: "pag-PH", dir: "ltr" as const },
  { code: "mdh" as const, label: "Maguindanao", nativeLabel: "Maguindanao", iso: "mdh-PH", dir: "ltr" as const },
  { code: "mrw" as const, label: "Maranao", nativeLabel: "Mëranaw", iso: "mrw-PH", dir: "ltr" as const },
  { code: "tsg" as const, label: "Tausug", nativeLabel: "Bahasa Sūg", iso: "tsg-PH", dir: "ltr" as const },
] as const;

export type Language = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: Language = "fil";

export function isLanguage(code: string): code is Language {
  return LANGUAGES.some((l) => l.code === code);
}

export function getLanguageInfo(code: Language) {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function getLanguageDisplayName(code: Language): string {
  return getLanguageInfo(code).nativeLabel;
}

// ── Static JSON Imports ──────────────────────────────────────
// Webpack/RSPack will tree‑shake unused languages in production

import fil from "@/messages/fil.json";
import en from "@/messages/en.json";
import ceb from "@/messages/ceb.json";
import ilo from "@/messages/ilo.json";
import hil from "@/messages/hil.json";
import war from "@/messages/war.json";
import bcl from "@/messages/bcl.json";
import pam from "@/messages/pam.json";
import pag from "@/messages/pag.json";
import mdh from "@/messages/mdh.json";
import mrw from "@/messages/mrw.json";
import tsg from "@/messages/tsg.json";

type MessageDict = Record<string, string>;

const allMessages: Record<Language, MessageDict> = {
  fil, en, ceb, ilo, hil, war, bcl, pam, pag, mdh, mrw, tsg,
};

// ── Translation Lookup ──────────────────────────────────────

export function t(key: string, lang: Language): string {
  return allMessages[lang]?.[key] ?? allMessages["en"]?.[key] ?? key;
}

// ── Browser Language Detection ──────────────────────────────

export function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const browserLangs = navigator.languages ?? [navigator.language];
  for (const bl of browserLangs) {
    const code = bl.split("-")[0].toLowerCase();
    if (code === "fil" || code === "tl" || code === "tgl") return "fil";
    if (code === "en") return "en";
    if (code === "ceb") return "ceb";
    if (code === "ilo") return "ilo";
    if (code === "hil") return "hil";
    if (code === "war") return "war";
    if (code === "bcl") return "bcl";
    if (code === "pam") return "pam";
    if (code === "pag") return "pag";
    if (code === "mdh") return "mdh";
    if (code === "mrw") return "mrw";
    if (code === "tsg") return "tsg";
  }
  // Fallback: if browser is "fil-PH", match Filipino
  const first = browserLangs[0]?.toLowerCase() ?? "";
  if (first.startsWith("fil") || first.startsWith("tl")) return "fil";
  return DEFAULT_LANGUAGE;
}

// ── Storage ─────────────────────────────────────────────────

const STORAGE_KEY = "rescuemind_lang";

export function getLangFromStorage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && isLanguage(stored)) return stored;
  // Auto-detect if nothing stored
  return detectBrowserLanguage();
}

export function setLangInStorage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, lang);
  // Also set a cookie for SSR compatibility
  document.cookie = `${STORAGE_KEY}=${lang};path=/;max-age=31536000;SameSite=Lax`;
}

// ── Locale‑Aware Formatting ─────────────────────────────────

export function formatDate(
  date: Date | string | number,
  lang: Language,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const locale = getLanguageInfo(lang).iso;
  return d.toLocaleString(locale, {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
}

export function formatNumber(
  num: number,
  lang: Language,
  options?: Intl.NumberFormatOptions,
): string {
  const locale = getLanguageInfo(lang).iso;
  return new Intl.NumberFormat(locale, options).format(num);
}

export function formatPercentage(
  num: number,
  lang: Language,
): string {
  return formatNumber(num, lang, { style: "percent", minimumFractionDigits: 0 });
}

// ── Pluralization (simple) ─────────────────────────────────

export function pluralize(
  count: number,
  lang: Language,
  one: string,
  other: string,
): string {
  // Most Philippine languages don't have complex plural rules
  // English: 1 report, 2 reports; Filipino: 1 report, 2 (mga) report
  if (lang === "en") return count === 1 ? one : other;
  // For Philippine languages, use "mga" prefix for plurals in most cases
  return count === 1 ? one : other;
}

// ── React Context — I18nProvider ─────────────────────────────

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatPercentage: (num: number) => string;
  locale: string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: Language;
}) {
  const [lang, setLangState] = useState<Language>(initialLang ?? DEFAULT_LANGUAGE);

  // Initialize on client
  useEffect(() => {
    setLangState(getLangFromStorage());
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    setLangInStorage(next);
    // Update HTML lang attribute
    document.documentElement.lang = getLanguageInfo(next).iso;
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: string) => t(key, lang),
      formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) =>
        formatDate(date, lang, options),
      formatNumber: (num: number, options?: Intl.NumberFormatOptions) =>
        formatNumber(num, lang, options),
      formatPercentage: (num: number) => formatPercentage(num, lang),
      locale: getLanguageInfo(lang).iso,
      dir: getLanguageInfo(lang).dir,
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

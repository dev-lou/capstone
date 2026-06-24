// ────────────────────────────────────────────────────────────
// i18n — Multi‑language system for 12 Philippine languages
// Industry‑standard: JSON messages, React Context, browser detection
// ────────────────────────────────────────────────────────────

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

import msgfil from "@/messages/fil.json";
import msgen from "@/messages/en.json";
import msgceb from "@/messages/ceb.json";
import msgilo from "@/messages/ilo.json";
import msghil from "@/messages/hil.json";
import msgwar from "@/messages/war.json";
import msgbcl from "@/messages/bcl.json";
import msgpam from "@/messages/pam.json";
import msgpag from "@/messages/pag.json";
import msgmdh from "@/messages/mdh.json";
import msgmrw from "@/messages/mrw.json";
import msgtsg from "@/messages/tsg.json";

export type Language = "fil" | "en" | "ceb" | "ilo" | "hil" | "war" | "bcl" | "pam" | "pag" | "mdh" | "mrw" | "tsg";

export interface LanguageInfo {
  code: Language;
  label: string;
  nativeLabel: string;
  iso: string;
  dir: "ltr" | "rtl";
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "fil", label: "Filipino", nativeLabel: "Filipino", iso: "fil-PH", dir: "ltr" },
  { code: "en", label: "English", nativeLabel: "English", iso: "en-PH", dir: "ltr" },
  { code: "ceb", label: "Cebuano", nativeLabel: "Cebuano", iso: "ceb-PH", dir: "ltr" },
  { code: "ilo", label: "Ilocano", nativeLabel: "Ilocano", iso: "ilo-PH", dir: "ltr" },
  { code: "hil", label: "Hiligaynon", nativeLabel: "Hiligaynon", iso: "hil-PH", dir: "ltr" },
  { code: "war", label: "Waray", nativeLabel: "Waray", iso: "war-PH", dir: "ltr" },
  { code: "bcl", label: "Central Bikol", nativeLabel: "Bikol", iso: "bcl-PH", dir: "ltr" },
  { code: "pam", label: "Kapampangan", nativeLabel: "Kapampangan", iso: "pam-PH", dir: "ltr" },
  { code: "pag", label: "Pangasinan", nativeLabel: "Pangasinan", iso: "pag-PH", dir: "ltr" },
  { code: "mdh", label: "Maguindanao", nativeLabel: "Maguindanao", iso: "mdh-PH", dir: "ltr" },
  { code: "mrw", label: "Maranao", nativeLabel: "Maranao", iso: "mrw-PH", dir: "ltr" },
  { code: "tsg", label: "Tausug", nativeLabel: "Tausug", iso: "tsg-PH", dir: "ltr" }
];

export const DEFAULT_LANGUAGE: Language = "fil";

const allMessages: Record<string, Record<string, string>> = {};
allMessages["fil"] = msgfil;
allMessages["en"] = msgen;
allMessages["ceb"] = msgceb;
allMessages["ilo"] = msgilo;
allMessages["hil"] = msghil;
allMessages["war"] = msgwar;
allMessages["bcl"] = msgbcl;
allMessages["pam"] = msgpam;
allMessages["pag"] = msgpag;
allMessages["mdh"] = msgmdh;
allMessages["mrw"] = msgmrw;
allMessages["tsg"] = msgtsg;

export function t(key: string, lang: Language): string {
  return allMessages[lang]?.[key] ?? allMessages["en"]?.[key] ?? key;
}

export function getLangFromStorage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem("rescuemind_lang");
  if (stored && (LANGUAGES.some(function(l) { return l.code === stored; }))) return stored as Language;
  return DEFAULT_LANGUAGE;
}

export function setLangInStorage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rescuemind_lang", lang);
}

export function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  var browserLangs = navigator.languages || [navigator.language || ""];
  for (var i = 0; i < browserLangs.length; i++) {
    var bl = browserLangs[i].split("-")[0].toLowerCase();
    if (bl === "tl") return "fil";
    var found = LANGUAGES.find(function(l) { return l.code === bl; });
    if (found) return found.code;
  }
  return DEFAULT_LANGUAGE;
}

function getLanguageInfo(code: Language): LanguageInfo {
  return LANGUAGES.find(function(l) { return l.code === code; }) || LANGUAGES[0];
}

export function formatDate(date: Date | string | number, lang: Language): string {
  var info = getLanguageInfo(lang);
  try {
    return new Date(date).toLocaleDateString(info.iso, {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    // Fallback to en-US if the Philippine locale isn't available (e.g. Node.js without full ICU)
    return new Date(date).toLocaleDateString("en-US", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
}

export interface I18nContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  direction: "ltr" | "rtl";
  formatDate: (date: Date | string | number) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children, initialLang }: { children: React.ReactNode; initialLang?: Language }) {
  var [langState, setLangState] = useState<Language>(initialLang || DEFAULT_LANGUAGE);

  useEffect(function() {
    var stored = localStorage.getItem("rescuemind_lang");
    if (stored && LANGUAGES.some(function(l) { return l.code === stored; })) {
      setLangState(stored as Language);
      document.documentElement.lang = getLanguageInfo(stored as Language).iso;
    } else {
      var detected = detectBrowserLanguage();
      setLangState(detected);
      setLangInStorage(detected);
      document.documentElement.lang = getLanguageInfo(detected).iso;
    }
  }, []);

  var setLang = useCallback(function(next: Language) {
    setLangState(next);
    setLangInStorage(next);
    document.documentElement.lang = getLanguageInfo(next).iso;
  }, []);

  var translate = useCallback(function(key: string): string {
    return t(key, langState);
  }, [langState]);

  var fmtDate = useCallback(function(date: Date | string | number): string {
    return formatDate(date, langState);
  }, [langState]);

  var ctx: I18nContextType = {
    lang: langState,
    setLang,
    t: translate,
    direction: "ltr",
    formatDate: fmtDate,
  };

  return React.createElement(I18nContext.Provider, { value: ctx }, children);
}

export function useI18n(): I18nContextType {
  var ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

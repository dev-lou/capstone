"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANGUAGES, useI18n, type Language } from "@/lib/i18n";

function IconGlobe({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-144a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0ZM80,112a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96v16a8,8,0,0,1-16,0V112Zm96,60.79V192a8,8,0,0,1-16,0v-8.39A70.59,70.59,0,0,1,128,200a71.07,71.07,0,0,1-21.92-3.46,8,8,0,1,1,5.49-15,55.2,55.2,0,0,0,32.86,0,8,8,0,1,1,5.49,15A71.07,71.07,0,0,1,128,200a70.59,70.59,0,0,1-32-8.39V192a8,8,0,0,1-16,0v-19.21C64.36,156.66,56,139.06,56,120a72,72,0,1,1,144,0C200,139.06,191.64,156.66,176,172.79ZM128,64a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,64Z" />
    </svg>
  );
}

export function LanguageSelector() {
  const { lang, setLang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [isOpen]);

  const filtered = LANGUAGES.filter(
    (l) => l.label.toLowerCase().includes(search.toLowerCase()) || l.nativeLabel.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = useCallback(
    (code: Language) => {
      setLang(code);
      setIsOpen(false);
      setSearch("");
    },
    [setLang],
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/60 hover:bg-slate-900/80 border border-white/15 hover:border-[var(--color-ph-gold)]/50 backdrop-blur-2xl text-slate-200 hover:text-white shadow-xl shadow-black/50 transition-all group focus:outline-none text-xs font-bold"
        aria-label="Switch language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <IconGlobe className="w-3.5 h-3.5 text-[var(--color-ph-gold)]" />
        <span className="hidden sm:block">{current.nativeLabel}</span>
        <span className="sm:hidden">{current.code.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 256 256" fill="currentColor" className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-slate-800 shadow-2xl shadow-black/90 z-50 overflow-hidden"
            role="listbox"
            aria-label="Select language"
          >
            <div className="p-3 pb-2">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-[var(--color-ph-gold)]"
              />
            </div>
            <div className="max-h-64 overflow-y-auto py-1 custom-scrollbar-dark">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-slate-500">No language found</div>
              ) : (
                filtered.map((l) => {
                  const isActive = lang === l.code;
                  return (
                    <button
                      key={l.code}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSelect(l.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-[var(--color-ph-gold)]/10 text-[var(--color-ph-gold)] font-bold"
                          : "text-slate-300 hover:bg-slate-800/60 hover:text-white font-medium"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${isActive ? "border-[var(--color-ph-gold)] bg-[var(--color-ph-gold)] text-slate-950" : "border-slate-600"}`}>
                        {isActive && (
                          <svg width="10" height="10" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{l.nativeLabel}</span>
                        <span className="text-[0.6rem] text-slate-500 uppercase tracking-wider">{l.label}</span>
                      </div>
                      <span className="ml-auto text-[0.6rem] font-mono font-bold text-slate-600 uppercase bg-slate-900 px-1.5 py-0.5 rounded">{l.code}</span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

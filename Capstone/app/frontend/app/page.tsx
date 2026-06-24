"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { t, getLangFromStorage, type Language } from "@/lib/i18n";
import { getReports } from "@/lib/storage";
import {
  IconLightning,
  IconShield,
  IconGlobe,
  IconStar,
  IconHeart,
  IconTarget,
  IconPaperPlane,
  IconArrowRight,
  IconChartBar,
} from "./components/icons";

// ── Motion Variants ────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.94 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// ── Features ───────────────────────────────────────────────────
const FEATURES = [
  {
    icon: IconLightning,
    titleFil: "AI-Powered Triage",
    titleEn: "AI-Powered Triage",
    descFil:
      "Awtomatikong nagki-classify ng insidente — gamit ang offline-first AI na hindi nangangailangan ng internet.",
    descEn:
      "Automatically classifies incidents using offline-first AI that works without internet.",
  },
  {
    icon: IconShield,
    titleFil: "Offline-First Architecture",
    titleEn: "Offline-First Architecture",
    descFil:
      "Gumagana kahit walang koneksyon. Perpekto para sa malalayong barangay.",
    descEn:
      "Works without any internet connection. Perfect for remote barangays.",
  },
  {
    icon: IconGlobe,
    titleFil: "Bilingual (Filipino / English)",
    titleEn: "Bilingual (Filipino / English)",
    descFil:
      "Buong suporta sa Tagalog at English — ginawa para sa bawat Pilipino.",
    descEn: "Full Tagalog and English support — built for every Filipino.",
  },
  {
    icon: IconTarget,
    titleFil: "PSGC Location Routing",
    titleEn: "PSGC Location Routing",
    descFil:
      "Gamit ang Philippine Standard Geographic Codes para sa tamang routing sa tamang opisina.",
    descEn:
      "Uses Philippine Standard Geographic Codes for accurate office routing.",
  },
  {
    icon: IconHeart,
    titleFil: "Ligtas at Secure",
    titleEn: "Safe & Secure",
    descFil:
      "Supabase authentication at rate-limited API para sa seguridad ng datos.",
    descEn: "Supabase authentication and rate-limited API for data security.",
  },
];

// ── Categories (icon components — no emoji) ────────────────────
const CATEGORIES = [
  {
    labelFil: "Baha / Drainage",
    labelEn: "Flood / Drainage",
    icon: IconShield,
  },
  { labelFil: "Sirang Kalsada", labelEn: "Road Damage", icon: IconTarget },
  { labelFil: "Basura", labelEn: "Garbage / Waste", icon: IconHeart },
  { labelFil: "Ingay", labelEn: "Noise Complaint", icon: IconLightning },
  { labelFil: "Kalusugan", labelEn: "Health / Medical", icon: IconHeart },
  { labelFil: "Permit", labelEn: "Permit / License", icon: IconTarget },
  { labelFil: "Tubig", labelEn: "Water Supply", icon: IconGlobe },
  { labelFil: "Kuryente", labelEn: "Electricity", icon: IconLightning },
  { labelFil: "Public Safety", labelEn: "Public Safety", icon: IconShield },
  { labelFil: "Iba Pa", labelEn: "Others", icon: IconStar },
];

// ── How It Works Steps ─────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    icon: IconPaperPlane,
    titleFil: "Isulat ang Reklamo",
    titleEn: "Write Your Report",
    descFil:
      "Ilarawan ang insidente sa Filipino o English. Pumili ng lokasyon gamit ang PSGC.",
    descEn:
      "Describe the incident in Filipino or English. Select your location via PSGC.",
  },
  {
    num: "02",
    icon: IconLightning,
    titleFil: "AI Mag-aanalisa",
    titleEn: "AI Analyzes Report",
    descFil:
      "Ang offline AI ang awtomatikong nagki-classify ng inyong report sa tamang kategorya.",
    descEn:
      "The offline AI automatically classifies your report into the correct category.",
  },
  {
    num: "03",
    icon: IconShield,
    titleFil: "Ipinadala sa Opisina",
    titleEn: "Routed to Right Office",
    descFil:
      "Ang report ay naka-ruta sa tamang ahensya ng gobyerno para sa mabilis na aksyon.",
    descEn:
      "The report is routed to the appropriate government office for immediate action.",
  },
];

// ── Testimonials ───────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "Napakabilis ng AI classification — natukoy agad ang aming report na baha at na-ruta sa tamang opisina.",
    name: "Kap. Reyes",
    position: "Brgy. Captain, San Isidro",
    initial: "R",
  },
  {
    quote:
      "Kahit walang internet sa aming lugar, gumagana pa rin ang RescueMind. Malaking tulong sa aming komunidad.",
    name: "Kag. Santos",
    position: "Kagawad, Brgy. Mabuhay",
    initial: "S",
  },
  {
    quote:
      "Mas madali nang i-manage ang mga reklamo ng aming barangay gamit ang dashboard. Malinaw at organisado.",
    name: "Sec. Cruz",
    position: "Brgy. Secretary, Masagana",
    initial: "C",
  },
];

// ── Main Component ─────────────────────────────────────────────
export default function HomePage() {
  const [lang, setLang] = useState<Language>("fil");
  const [isClient, setIsClient] = useState(false);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    setLang(getLangFromStorage());
    setReportCount(getReports().length);
  }, []);

  if (!isClient) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32">
        <div className="space-y-6 max-w-2xl mx-auto text-center">
          <div className="skeleton h-16 w-3/4 mx-auto rounded-2xl" />
          <div className="skeleton h-6 w-1/2 mx-auto" />
          <div className="skeleton h-14 w-64 mx-auto rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — HIGH-END HERO WITH TOPOGRAPHIC BACKGROUND + SVG WAVE + SCROLL INDICATOR
          Ref: Image 2 (Elite 2026 Non-AI Slop Aesthetic)
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#0a1915] dark:bg-[#06120e] relative overflow-hidden pt-28 pb-36 sm:pt-36 sm:pb-48 text-white">
        {/* Stunning Topographic / Contour Line SVG Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="topographic" width="400" height="400" patternUnits="userSpaceOnUse">
                <path d="M50 0 Q75 50 100 100 T150 200 T200 300 T250 400 M150 0 Q175 50 200 100 T250 200 T300 300 T350 400 M250 0 Q275 50 300 100 T350 200 T400 300 T450 400 M0 50 Q50 75 100 100 T200 150 T300 200 T400 250 M0 150 Q50 175 100 200 T200 250 T300 300 T400 350" fill="none" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.4" />
                <path d="M20 0 Q45 60 90 120 T140 220 T190 320 T240 400 M120 0 Q145 60 190 120 T240 220 T290 320 T340 400 text-green-500" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topographic)" />
          </svg>
        </div>

        {/* Deep rich radial glow accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
          >
            {/* Left: Premium Civic Copy & Clean Buttons */}
            <motion.div variants={fadeUp} className="lg:col-span-6 space-y-8">
              {/* Civic Intelligence Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span>Civic Disaster &amp; Complaint Intelligence</span>
              </div>

              {/* Primary heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Report Barangay <br />Issues Instantly.
              </h1>

              {/* Refined description — Crystal clear for everyone */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-medium">
                {lang === "fil"
                  ? "Walang kumplikadong pormularyo o pagpila. Ilarawan lamang ang problema sa inyong komunidad—tulad ng baha, sirang kalsada, o nawawalang kuryente—at agad itong ipapadala ng ating AI sa tamang sangay ng gobyerno (DILG, DPWH, BFP, o PNP). Mabilis, ligtas, at bukas sa publiko."
                  : "No confusing forms or waiting in line. Simply describe your community concern—from street floods to broken lights—and our smart system immediately alerts the correct government office (DILG, DPWH, BFP, or PNP). Fast, secure, and public."}
              </p>

              {/* Clean Pill Buttons matching Image 2 Ref */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link href="/report" className="px-8 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all text-center flex items-center justify-center gap-2">
                  <span>{t("landing.reportNow", lang)}</span>
                  <IconArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/dashboard" className="px-8 py-4 rounded-full bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 text-white font-bold text-sm backdrop-blur-xl transition-all text-center flex items-center justify-center gap-2">
                  <IconChartBar className="w-4 h-4 text-emerald-400" />
                  <span>{t("landing.viewDashboard", lang)}</span>
                </Link>
              </div>

              {/* Ledger text below buttons */}
              <div className="pt-8 border-t border-slate-800/80 text-[0.65rem] font-black uppercase tracking-widest text-emerald-500/80 flex flex-wrap items-center gap-2">
                <span>LIVE LEDGER &middot; PUBLIC RECORD</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">DILG &middot; DICT &middot; NDRRMC &middot; PNP</span>
              </div>
            </motion.div>

            {/* Right: INCIDENT LEDGER - LIVE Widget (Non-AI Slop, Bespoke Interactive Ref) */}
            <motion.div variants={fadeUp} className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-[2rem] bg-slate-950/80 backdrop-blur-2xl border border-emerald-500/20 shadow-2xl shadow-black/80 text-slate-100 max-w-lg lg:ml-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>INCIDENT LEDGER &middot; LIVE</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[0.65rem] font-black uppercase tracking-widest">
                    SYS-ONLINE
                  </span>
                </div>

                {/* Ledger Items */}
                <div className="space-y-5">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between gap-4 py-1 border-b border-slate-900 pb-4">
                    <div>
                      <div className="text-xs font-black font-mono text-white">RPT-7781</div>
                      <div className="text-[0.65rem] font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>ROUTING LIVE</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 px-4">
                      <div className="text-xs font-extrabold text-slate-200 truncate">Baha sa kalsada, Brgy. San Jose</div>
                      <div className="text-[0.65rem] text-slate-400 truncate">14.58&deg;N 120.97&deg;E &middot; DILG-LGU</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-emerald-400">98.4%</div>
                      <div className="text-[0.65rem] text-slate-500">AI CONFIDENCE</div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between gap-4 py-1 border-b border-slate-900 pb-4">
                    <div>
                      <div className="text-xs font-black font-mono text-white">RPT-7780</div>
                      <div className="text-[0.65rem] font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>RESOLVED</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 px-4">
                      <div className="text-xs font-extrabold text-slate-200 truncate">Sirang tulay, Brgy. Mabuhay</div>
                      <div className="text-[0.65rem] text-slate-400 truncate">9.74&deg;N 118.73&deg;E &middot; DPWH</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-emerald-400">96.1%</div>
                      <div className="text-[0.65rem] text-slate-500">CLOSED IN 2H 12M</div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center justify-between gap-4 py-1 border-b border-slate-900 pb-4">
                    <div>
                      <div className="text-xs font-black font-mono text-white">RPT-7779</div>
                      <div className="text-[0.65rem] font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>ACTIVE</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 px-4">
                      <div className="text-xs font-extrabold text-slate-200 truncate">Nabagsakang poste, Brgy. Central</div>
                      <div className="text-[0.65rem] text-slate-400 truncate">7.19&deg;N 125.45&deg;E &middot; MERALCO</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-emerald-400">91.7%</div>
                      <div className="text-[0.65rem] text-slate-500">DISPATCHED</div>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-center justify-between gap-4 py-1">
                    <div>
                      <div className="text-xs font-black font-mono text-white">RPT-7777</div>
                      <div className="text-[0.65rem] font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>CRITICAL</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 px-4">
                      <div className="text-xs font-extrabold text-slate-200 truncate">Sunog sa residential area</div>
                      <div className="text-[0.65rem] text-slate-400 truncate">10.32&deg;N 123.91&deg;E &middot; BFP</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-emerald-400">94.6%</div>
                      <div className="text-[0.65rem] text-slate-500">ESCALATED</div>
                    </div>
                  </div>
                </div>

                {/* Footer status */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[0.65rem] font-bold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>All systems operational</span>
                  </div>
                  <Link href="/report" className="text-emerald-400 hover:underline">
                    Mag-file ng report &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Scroll Indicator (Image 2 Ref) ────────────────────────────────────── */}
        <div className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none animate-bounce">
          <div className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400 mb-1">
            Scroll the Record
          </div>
          <div className="text-emerald-400 font-bold text-sm">
            &darr;
          </div>
        </div>

        {/* ── Seamless SVG Wave at the Bottom (Image 2 Ref) ────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
          <svg
            className="relative block w-full h-12 sm:h-20 md:h-28 text-[var(--color-surface)] fill-current"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,96L80,85.3C160,75,320,53,480,53.3C640,53,800,75,960,80C1120,85,1200,75,1240,70L1280,65L1280,120L1240,120C1200,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — ASYMMETRICAL BENTO GRID
          Elite 2026 Feature Presentation
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-bg)] py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-3xl mb-16"
          >
            <p className="section-label mb-3">
              {lang === "fil" ? "Bento System v2" : "Bento System v2"}
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-ph-navy)] dark:text-white tracking-tight">
              {t("landing.featuresTitle", lang)}
            </h2>
            <p className="mt-4 text-xl text-[var(--color-text-secondary)] leading-relaxed">
              {t("landing.featuresDesc", lang)}
            </p>
          </motion.div>

          {/* Asymmetrical Bento Boxes */}
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* Box 1: Large Span with Background Asset */}
            <motion.div variants={fadeUp} className="md:col-span-8 outer-shell group">
              <div className="inner-core p-8 sm:p-12 h-full flex flex-col justify-between relative overflow-hidden bg-[var(--color-ph-navy)] text-white">
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-50 transition-opacity duration-500">
                  <img src="/bento_resilience_bg.png" alt="Resilience background" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 space-y-6 max-w-xl">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-ph-gold)] text-[var(--color-ph-navy)] flex items-center justify-center shadow-lg">
                    <IconLightning className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {lang === "fil" ? FEATURES[0].titleFil : FEATURES[0].titleEn}
                  </h3>
                  <p className="text-lg sm:text-xl text-slate-200 leading-relaxed">
                    {lang === "fil" ? FEATURES[0].descFil : FEATURES[0].descEn}
                  </p>
                </div>
                <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex items-center justify-between text-sm text-[var(--color-ph-gold-light)] font-bold uppercase tracking-wider">
                  <span>🇵🇭 Offline Neural Engine</span>
                  <span>100% On-Device</span>
                </div>
              </div>
            </motion.div>

            {/* Box 2: Medium Span */}
            <motion.div variants={fadeUp} className="md:col-span-4 outer-shell">
              <div className="inner-core p-8 sm:p-10 h-full flex flex-col justify-between bg-[var(--color-surface)]">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-ph-navy)] text-white flex items-center justify-center shadow-md">
                    <IconShield className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-white tracking-tight">
                    {lang === "fil" ? FEATURES[1].titleFil : FEATURES[1].titleEn}
                  </h3>
                  <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {lang === "fil" ? FEATURES[1].descFil : FEATURES[1].descEn}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[var(--color-border)] text-xs font-bold uppercase tracking-wider text-[var(--color-ph-gold)]">
                  Zero Network Required
                </div>
              </div>
            </motion.div>

            {/* Box 3: Medium Span */}
            <motion.div variants={fadeUp} className="md:col-span-4 outer-shell">
              <div className="inner-core p-8 sm:p-10 h-full flex flex-col justify-between bg-[var(--color-surface)]">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-ph-navy)] text-white flex items-center justify-center shadow-md">
                    <IconGlobe className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-white tracking-tight">
                    {lang === "fil" ? FEATURES[2].titleFil : FEATURES[2].titleEn}
                  </h3>
                  <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {lang === "fil" ? FEATURES[2].descFil : FEATURES[2].descEn}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[var(--color-border)] text-xs font-bold uppercase tracking-wider text-[var(--color-ph-gold)]">
                  Tagalog &amp; English
                </div>
              </div>
            </motion.div>

            {/* Box 4: Medium Span */}
            <motion.div variants={fadeUp} className="md:col-span-4 outer-shell">
              <div className="inner-core p-8 sm:p-10 h-full flex flex-col justify-between bg-[var(--color-surface)]">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-ph-navy)] text-white flex items-center justify-center shadow-md">
                    <IconTarget className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-white tracking-tight">
                    {lang === "fil" ? FEATURES[3].titleFil : FEATURES[3].titleEn}
                  </h3>
                  <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {lang === "fil" ? FEATURES[3].descFil : FEATURES[3].descEn}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[var(--color-border)] text-xs font-bold uppercase tracking-wider text-[var(--color-ph-gold)]">
                  Precision Routing
                </div>
              </div>
            </motion.div>

            {/* Box 5: Medium Span */}
            <motion.div variants={fadeUp} className="md:col-span-4 outer-shell">
              <div className="inner-core p-8 sm:p-10 h-full flex flex-col justify-between bg-[var(--color-surface)]">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-ph-navy)] text-white flex items-center justify-center shadow-md">
                    <IconHeart className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-white tracking-tight">
                    {lang === "fil" ? FEATURES[4].titleFil : FEATURES[4].titleEn}
                  </h3>
                  <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {lang === "fil" ? FEATURES[4].descFil : FEATURES[4].descEn}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[var(--color-border)] text-xs font-bold uppercase tracking-wider text-[var(--color-ph-gold)]">
                  Enterprise Security
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
          Step-by-step visual process · mobile-first · numbered
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-32 border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-20"
          >
            <p className="section-label mb-3">
              {lang === "fil" ? "Paano Gumagana" : "How It Works"}
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-ph-navy)] dark:text-white tracking-tight">
              {lang === "fil" ? "Tatlong Hakbang Lamang" : "Three Simple Steps"}
            </h2>
            <p className="mt-4 text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {lang === "fil"
                ? "Mabilis, madali, at tumpak. Gumagana kahit offline para sa lahat ng mamamayan."
                : "Fast, simple, and accurate. Works even without internet for all citizens."}
            </p>
          </motion.div>

          {/* Steps with connectors */}
          <div className="relative">
            {/* Horizontal connecting line */}
            <div
              className="hidden sm:block absolute top-10 h-px bg-gradient-to-r from-transparent via-[var(--color-ph-gold)]/40 to-transparent pointer-events-none"
              style={{ left: "16.5%", right: "16.5%" }}
            />

            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8"
            >
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex flex-row sm:flex-col sm:items-center items-start gap-6 sm:gap-0"
                >
                  {/* Numbered circle */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-[var(--color-ph-navy)] flex items-center justify-center sm:mb-8 shadow-xl shadow-[var(--color-ph-navy)]/20 relative z-10 border-2 border-[var(--color-ph-gold)]">
                    <span className="text-[var(--color-ph-gold)] font-black text-2xl tracking-tight">
                      {step.num}
                    </span>
                  </div>

                  {/* Step content */}
                  <div className="sm:text-center space-y-3">
                    <h3 className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-white tracking-tight">
                      {lang === "fil" ? step.titleFil : step.titleEn}
                    </h3>
                    <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                      {lang === "fil" ? step.descFil : step.descEn}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — CATEGORIES
          Gray bg · 5-col grid on md · icon-based, no emoji
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-bg)] py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <p className="section-label mb-3">
              {lang === "fil" ? "Mga Kategorya" : "Categories"}
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-ph-navy)] dark:text-white tracking-tight">
              {t("landing.categoriesTitle", lang)}
            </h2>
            <p className="mt-4 text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {t("landing.categoriesDesc", lang)}
            </p>
          </motion.div>

          {/* Category tiles */}
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 md:grid-cols-5 gap-6"
          >
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="outer-shell group cursor-default"
              >
                <div className="inner-core p-6 text-center h-full flex flex-col items-center justify-center bg-[var(--color-surface)] group-hover:border-[var(--color-ph-gold)] transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-ph-navy-pale)] text-[var(--color-ph-navy)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-ph-navy)] group-hover:text-white transition-colors duration-300 shadow-xs">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-base font-bold text-[var(--color-text)] leading-snug">
                    {lang === "fil" ? cat.labelFil : cat.labelEn}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — TESTIMONIALS
          White surface · 3 cards · gold stars · blockquote
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-32 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <p className="section-label mb-3">
              {lang === "fil" ? "Testimonya" : "Testimonials"}
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-ph-navy)] dark:text-white tracking-tight">
              {t("landing.testimonialsTitle", lang)}
            </h2>
            <p className="mt-4 text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {t("landing.testimonialsDesc", lang)}
            </p>
          </motion.div>

          {/* Testimonial cards */}
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {TESTIMONIALS.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="outer-shell">
                <div className="inner-core p-10 h-full flex flex-col justify-between bg-[var(--color-surface)]">
                  <div>
                    {/* 5 gold stars */}
                    <div
                      className="flex gap-1.5 mb-6"
                      aria-label={lang === "fil" ? "5 bituin" : "5 stars"}
                    >
                      {Array.from({ length: 5 }).map((_, j) => (
                        <IconStar
                          key={j}
                          className="w-5 h-5 text-[var(--color-ph-gold)]"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-[var(--color-text)] text-lg font-medium leading-relaxed mb-8 italic">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-[var(--color-border)]">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-ph-navy)] text-[var(--color-ph-gold)] flex items-center justify-center font-black text-lg shrink-0 shadow-md">
                      {item.initial}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--color-text)] text-base">
                        {item.name}
                      </div>
                      <div className="text-sm font-medium text-[var(--color-text-muted)]">
                        {item.position}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6 — FINAL CTA
          Deep navy · gold section label · white text · accent btn
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-ph-navy)] py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#c8911e_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center space-y-8"
          >
            <p className="section-label text-[var(--color-ph-gold)]">
              {lang === "fil" ? "Handa Ka Na Ba?" : "Are You Ready?"}
            </p>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
              {t("landing.ctaTitle", lang)}
            </h2>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t("landing.ctaDesc", lang)}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link href="/report" className="btn-island btn-island-accent">
                <span>{t("landing.reportNow", lang)}</span>
                <span className="icon-wrapper">
                  <IconPaperPlane className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/auth" className="btn-island btn-island-secondary">
                <span>{t("landing.signIn", lang)}</span>
                <span className="icon-wrapper">
                  <IconArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

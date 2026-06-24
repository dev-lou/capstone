"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getReports } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
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
import {
  DILGLogo,
  DICTLogo,
  NDRRMCLogo,
  DPWHLogo,
  DataPrivacyLogo,
} from "./components/agency-logos";

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
// ── Features ───────────────────────────────────────────────────
const FEATURES = [
  {
    icon: IconLightning,
    titleFil: "AI-Powered Triage",
    titleEn: "AI-Powered Triage",
    titleCeb: "AI-Powered Triage",
    titleIlo: "AI-Powered Triage",
    descFil:
      "Awtomatikong nagki-classify ng insidente — gamit ang offline-first AI na hindi nangangailangan ng internet.",
    descEn:
      "Automatically classifies incidents using offline-first AI that works without internet.",
    descCeb:
      "Awtomatikong mag-classify sa insidente — gamit ang offline-first AI nga wala kinahanglana ang internet.",
    descIlo:
      "Awtomatiko nga ag-classify ti pasamak — babaen ti offline-first AI nga saan a masapul ti internet.",
  },
  {
    icon: IconShield,
    titleFil: "Offline-First Architecture",
    titleEn: "Offline-First Architecture",
    titleCeb: "Offline-First Architecture",
    titleIlo: "Offline-First Architecture",
    descFil:
      "Gumagana kahit walang koneksyon. Perpekto para sa malalayong barangay.",
    descEn:
      "Works without any internet connection. Perfect for remote barangays.",
    descCeb:
      "Mogana bisan walay koneksyon. Hingpit alang sa mga hilit nga barangay.",
    descIlo:
      "Agandar uray awan ti koneksion. Mayat para kadagiti adayo a barangay.",
  },
  {
    icon: IconGlobe,
    titleFil: "Bilingual (Filipino / English)",
    titleEn: "Bilingual (Filipino / English)",
    titleCeb: "Daghan ug Pinulongan (Cebuano / English / Filipino)",
    titleIlo: "Nadumaduma a Pagsasao (Ilocano / English / Filipino)",
    descFil:
      "Buong suporta sa Tagalog at English — ginawa para sa bawat Pilipino.",
    descEn: "Full Tagalog and English support — built for every Filipino.",
    descCeb:
      "Bug-os nga suporta sa Cebuano, Tagalog, ug Ingles — gihimo alang sa matag Pilipino.",
    descIlo:
      "Adda suporta ti Ilocano, Tagalog, ken Ingles — nadisenio para iti tunggal Pilipino.",
  },
  {
    icon: IconTarget,
    titleFil: "PSGC Location Routing",
    titleEn: "PSGC Location Routing",
    titleCeb: "PSGC Location Routing",
    titleIlo: "PSGC Location Routing",
    descFil:
      "Gamit ang Philippine Standard Geographic Codes para sa tamang routing sa tamang opisina.",
    descEn:
      "Uses Philippine Standard Geographic Codes for accurate office routing.",
    descCeb:
      "Gamit ang Philippine Standard Geographic Codes alang sa saktong pag-ruta sa saktong opisina.",
    descIlo:
      "Usaren ti Philippine Standard Geographic Codes para iti husto a panangipatulod iti husto nga opisina.",
  },
  {
    icon: IconHeart,
    titleFil: "Ligtas at Secure",
    titleEn: "Safe & Secure",
    titleCeb: "Luwas ug Sigurado",
    titleIlo: "Salbar ken Sigurado",
    descFil:
      "Supabase authentication at rate-limited API para sa seguridad ng datos.",
    descEn: "Supabase authentication and rate-limited API for data security.",
    descCeb:
      "Supabase authentication ug rate-limited API alang sa kasigurohan sa datos.",
    descIlo:
      "Supabase authentication ken rate-limited API para iti seguridad ti datos.",
  },
];

// ── Categories (icon components — no emoji) ────────────────────
const CATEGORIES = [
  {
    labelFil: "Baha / Drainage",
    labelEn: "Flood / Drainage",
    labelCeb: "Baha / Drainage",
    labelIlo: "Layus / Drainage",
    icon: IconShield,
  },
  { labelFil: "Sirang Kalsada", labelEn: "Road Damage", labelCeb: "Guba nga Kalsada", labelIlo: "Dadael a Kalsada", icon: IconTarget },
  { labelFil: "Basura", labelEn: "Garbage / Waste", labelCeb: "Basura", labelIlo: "Basura", icon: IconHeart },
  { labelFil: "Ingay", labelEn: "Noise Complaint", labelCeb: "Kasaba", labelIlo: "Riribok / Singasing", icon: IconLightning },
  { labelFil: "Kalusugan", labelEn: "Health / Medical", labelCeb: "Panglawas / Medikal", labelIlo: "Salun-at / Medikal", icon: IconHeart },
  { labelFil: "Permit", labelEn: "Permit / License", labelCeb: "Permit / Lisensya", labelIlo: "Permit / Lisensia", icon: IconTarget },
  { labelFil: "Tubig", labelEn: "Water Supply", labelCeb: "Suplay sa Tubig", labelIlo: "Suplay ti Danum", icon: IconGlobe },
  { labelFil: "Kuryente", labelEn: "Electricity", labelCeb: "Kuryente", labelIlo: "Kuryente", icon: IconLightning },
  { labelFil: "Public Safety", labelEn: "Public Safety", labelCeb: "Kaluwasan sa Publiko", labelIlo: "Katalgedan ti Publiko", icon: IconShield },
  { labelFil: "Iba Pa", labelEn: "Others", labelCeb: "Uban pa", labelIlo: "Dadduma pa", icon: IconStar },
];

// ── How It Works Steps ─────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    icon: IconPaperPlane,
    titleFil: "Isulat ang Reklamo",
    titleEn: "Write Your Report",
    titleCeb: "Isulat ang Reklamo",
    titleIlo: "Isurat ti Reklamo",
    descFil:
      "Ilarawan ang insidente sa Filipino o English. Pumili ng lokasyon gamit ang PSGC.",
    descEn:
      "Describe the incident in Filipino or English. Select your location via PSGC.",
    descCeb:
      "Ilarawan ang insidente sa inyong kaugalingong pinulongan. Pilia ang lokasyon gamit ang PSGC.",
    descIlo:
      "Iladawan ti pasamak iti bukodyo a pagsasao. Pilien ti lokasion babaen ti PSGC.",
  },
  {
    num: "02",
    icon: IconLightning,
    titleFil: "AI Mag-aanalisa",
    titleEn: "AI Analyzes Report",
    titleCeb: "AI Mag-analisa",
    titleIlo: "AI ti Ag-analisa",
    descFil:
      "Ang offline AI ang awtomatikong nagki-classify ng inyong report sa tamang kategorya.",
    descEn:
      "The offline AI automatically classifies your report into the correct category.",
    descCeb:
      "Ang offline AI ang awtomatikong mag-classify sa inyong report sa saktong kategorya.",
    descIlo:
      "Ti offline AI ti awtomatiko nga ag-classify iti reportyo iti husto nga kategoria.",
  },
  {
    num: "03",
    icon: IconShield,
    titleFil: "Ipinadala sa Opisina",
    titleEn: "Routed to Right Office",
    titleCeb: "Ipadala sa Saktong Opisina",
    titleIlo: "Maipatulod iti Husto nga Opisina",
    descFil:
      "Ang report ay naka-ruta sa tamang ahensya ng gobyerno para sa mabilis na aksyon.",
    descEn:
      "The report is routed to the appropriate government office for immediate action.",
    descCeb:
      "Ang report i-ruta sa saktong ahensya sa gobyerno para sa paspas nga aksyon.",
    descIlo:
      "Ti report ket maipatulod iti husto nga opisina ti gobyerno para iti napardas nga aksion.",
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
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const [isClient, setIsClient] = useState(false);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    setReportCount(getReports().length);
  }, []);

  const getLabel = (item: any) => {
    if (lang === "ceb" && item.labelCeb) return item.labelCeb;
    if (lang === "ilo" && item.labelIlo) return item.labelIlo;
    if (lang !== "en" && item.labelFil) return item.labelFil;
    return item.labelEn;
  };

  const getTitle = (item: any) => {
    if (lang === "ceb" && item.titleCeb) return item.titleCeb;
    if (lang === "ilo" && item.titleIlo) return item.titleIlo;
    if (lang !== "en" && item.titleFil) return item.titleFil;
    return item.titleEn;
  };

  const getDesc = (item: any) => {
    if (lang === "ceb" && item.descCeb) return item.descCeb;
    if (lang === "ilo" && item.descIlo) return item.descIlo;
    if (lang !== "en" && item.descFil) return item.descFil;
    return item.descEn;
  };

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
      <section className="bg-[#08101a] dark:bg-[#050b12] bg-[url('/rescuemind_hero_flood.jpg')] bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-[100dvh] flex flex-col justify-center pt-28 pb-32 sm:pt-32 sm:pb-36 text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10 w-full mt-8 sm:mt-0">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-28 items-center relative"
          >
            {/* Left: Premium Civic Copy & Clean Buttons */}
            <motion.div variants={fadeUp} className="lg:col-span-6 flex flex-col items-start space-y-8 lg:space-y-10 relative">
              {/* Architectural Grounding Left-Border */}
              <div className="hidden lg:block absolute -left-8 lg:-left-12 top-2 bottom-2 w-[2px] bg-gradient-to-b from-transparent via-[var(--color-ph-gold)]/50 to-transparent rounded-full shadow-[0_0_15px_rgba(200,145,30,0.5)]" />

              {/* Civic Intelligence Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 backdrop-blur-xl text-blue-400 text-xs font-black tracking-widest uppercase shadow-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                <span>Civic Intelligence</span>
              </div>

              {/* Primary heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-tighter leading-[1.05] text-white">
                {lang === "ceb" ? (
                  <>
                    I-report Agad ang mga <br />Isyu sa Barangay.
                  </>
                ) : lang === "ilo" ? (
                  <>
                    I-report Dagus dagiti <br />Pansamak iti Barangay.
                  </>
                ) : lang !== "en" ? (
                  <>
                    Iulat Agad ang mga <br />Isyu sa Barangay.
                  </>
                ) : (
                  <>
                    Report Barangay <br />Issues Instantly.
                  </>
                )}
              </h1>

              {/* Refined description */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl font-medium tracking-wide">
                {lang === "ceb"
                  ? "Walang komplikadong porma o linya sa paghulat. I-describe lang ang problema sa inyong komunidad—sama sa baha, guba nga kalsada, o pagkapalong sa kuryente—ug ipadala dayon kini sa atong AI sa saktong opisina."
                  : lang === "ilo"
                  ? "Awan ti nariribok a porma wenno panagpipila. Iladawan laeng ti problema iti komunidaddatayo—kas iti layus, dadael a kalsada, wenno awan kuryente—ken ipatulod dayta ti AI iti husto nga opisina."
                  : lang !== "en"
                  ? "Walang kumplikadong pormularyo o pagpila. Ilarawan lamang ang problema sa inyong komunidad—tulad ng baha, sirang kalsada, o nawawalang kuryente—at agad itong ipapadala ng ating AI sa tamang sangay."
                  : "No confusing forms or waiting in line. Simply describe your community concern—from street floods to broken lights—and our smart system immediately alerts the correct government office."}
              </p>

              {/* Clean Pill Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
                <Link href="/report" className="px-8 py-4 lg:py-5 lg:px-10 rounded-full bg-[var(--color-ph-gold)] hover:bg-yellow-400 text-slate-950 font-black text-sm lg:text-base tracking-wide shadow-xl shadow-black/50 hover:shadow-[var(--color-ph-gold)]/20 transition-all text-center flex items-center justify-center gap-2">
                  <span>{t("landing.reportNow")}</span>
                  <IconArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/dashboard" className="px-8 py-4 lg:py-5 lg:px-10 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-white/15 text-white font-bold text-sm lg:text-base tracking-wide backdrop-blur-2xl transition-all text-center flex items-center justify-center gap-2">
                  <IconChartBar className="w-5 h-5 text-[var(--color-ph-gold)]" />
                  <span>{t("landing.viewDashboard")}</span>
                </Link>
              </div>

              {/* Ledger text below buttons */}
              <div className="pt-8 border-t border-white/10 w-full max-w-sm text-[0.65rem] font-black uppercase tracking-widest text-[var(--color-ph-gold)] flex flex-wrap items-center gap-2 opacity-90">
                <span>LIVE LEDGER &middot; PUBLIC RECORD</span>
              </div>
            </motion.div>

            {/* Right: INCIDENT LEDGER - LIVE Widget */}
            <motion.div variants={fadeUp} className="lg:col-span-6 relative">
              {/* Decorative floating aura behind ledger */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--color-ph-gold)]/20 to-blue-500/20 blur-3xl opacity-50 rounded-full pointer-events-none" />
              
              <div className="relative p-6 sm:p-8 rounded-[2rem] bg-slate-950/50 border border-white/15 backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] text-slate-100 max-w-lg lg:ml-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--color-ph-gold)]">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>INCIDENT LEDGER &middot; LIVE</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-[0.65rem] font-black uppercase tracking-widest">
                    SYS-ONLINE
                  </span>
                </div>

                {/* Ledger Items */}
                <div className="space-y-5">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between gap-4 py-1 border-b border-slate-900 pb-4">
                    <div>
                      <div className="text-xs font-black font-mono text-white">RPT-7781</div>
                      <div className="text-[0.65rem] font-bold text-blue-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-50" />
                        <span>ROUTING LIVE</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 px-4">
                      <div className="text-xs font-extrabold text-slate-200 truncate">Baha sa kalsada, Brgy. San Jose</div>
                      <div className="text-[0.65rem] text-slate-400 truncate">14.58&deg;N 120.97&deg;E &middot; DILG-LGU</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-blue-400">98.4%</div>
                      <div className="text-[0.65rem] text-slate-500">AI CONFIDENCE</div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between gap-4 py-1 border-b border-slate-900 pb-4">
                    <div>
                      <div className="text-xs font-black font-mono text-white">RPT-7780</div>
                      <div className="text-[0.65rem] font-bold text-green-500 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span>RESOLVED</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 px-4">
                      <div className="text-xs font-extrabold text-slate-200 truncate">Sirang tulay, Brgy. Mabuhay</div>
                      <div className="text-[0.65rem] text-slate-400 truncate">9.74&deg;N 118.73&deg;E &middot; DPWH</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-green-400">96.1%</div>
                      <div className="text-[0.65rem] text-slate-500">CLOSED IN 2H 12M</div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center justify-between gap-4 py-1 border-b border-slate-900 pb-4">
                    <div>
                      <div className="text-xs font-black font-mono text-white">RPT-7779</div>
                      <div className="text-[0.65rem] font-bold text-blue-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>ACTIVE</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 px-4">
                      <div className="text-xs font-extrabold text-slate-200 truncate">Nabagsakang poste, Brgy. Central</div>
                      <div className="text-[0.65rem] text-slate-400 truncate">7.19&deg;N 125.45&deg;E &middot; MERALCO</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-blue-400">91.7%</div>
                      <div className="text-[0.65rem] text-slate-500">DISPATCHED</div>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-center justify-between gap-4 py-1">
                    <div>
                      <div className="text-xs font-black font-mono text-white">RPT-7777</div>
                      <div className="text-[0.65rem] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>CRITICAL</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 px-4">
                      <div className="text-xs font-extrabold text-slate-200 truncate">Sunog sa residential area</div>
                      <div className="text-[0.65rem] text-slate-400 truncate">10.32&deg;N 123.91&deg;E &middot; BFP</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-red-400">94.6%</div>
                      <div className="text-[0.65rem] text-slate-500">ESCALATED</div>
                    </div>
                  </div>
                </div>

                {/* Footer status */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[0.65rem] font-bold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{lang !== "en" ? "Lahat ng sistema ay gumagana" : "All systems operational"}</span>
                  </div>
                  <Link href="/report" className="text-blue-400 hover:underline">
                    {lang !== "en" ? "Mag-file ng report" : "File a report"} &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Scroll Indicator (Image 2 Ref) ────────────────────────────────────── */}
        <div className="absolute bottom-16 sm:bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none animate-bounce">
          <div className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400 mb-1">
            {lang !== "en" ? "I-scroll ang Tala" : "Scroll the Record"}
          </div>
          <div className="text-[var(--color-ph-gold)] font-bold text-sm">
            &darr;
          </div>
        </div>

        {/* ── Seamless Layered Multi-Wave at the Bottom (Image 2 Ref) ────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
          <svg
            className="relative block w-full h-10 sm:h-16 md:h-20 text-[var(--color-bg)] fill-current"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,60 C300,120 600,0 1200,60 L1200,120 L0,120 Z" className="opacity-30" />
            <path d="M0,80 C400,0 800,120 1200,40 L1200,120 L0,120 Z" className="opacity-60" />
            <path d="M0,96 C320,40 640,120 1200,70 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 1.5 — TRUST & COMPLIANCE STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-bg)] py-10 sm:py-12 border-b border-[var(--color-border)] dark:border-white/5 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.25em] text-[var(--color-text-secondary)] mb-8">
            {lang !== "en" ? "Dinisenyo para sa Local Government Units" : "Engineered for Philippine Local Government Units"}
          </p>
          
          <div className="flex overflow-hidden relative w-full [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="animate-marquee-css">
              
              {/* Loop 1 */}
              <div className="flex items-center space-x-12 sm:space-x-20 lg:space-x-32 px-6 sm:px-10 lg:px-16 opacity-95 hover:opacity-100 transition-opacity duration-500">
                {/* DILG */}
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:border-[var(--color-ph-gold)] group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-all">
                    <DILGLogo className="w-9 h-9" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-black text-[var(--color-text)] tracking-tight leading-none group-hover:text-[var(--color-ph-gold)] transition-colors">DILG</span>
                    <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[var(--color-text-secondary)] tracking-widest uppercase mt-0.5">Routing Standard</span>
                  </div>
                </div>
                
                {/* DICT */}
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:border-blue-600 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-all">
                    <DICTLogo className="w-9 h-9" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-black text-[var(--color-text)] tracking-tight leading-none group-hover:text-blue-600 transition-colors">DICT</span>
                    <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[var(--color-text-secondary)] tracking-widest uppercase mt-0.5">E-Gov Framework</span>
                  </div>
                </div>

                {/* NDRRMC */}
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:border-red-600 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-all">
                    <NDRRMCLogo className="w-9 h-9" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-black text-[var(--color-text)] tracking-tight leading-none group-hover:text-red-600 transition-colors">NDRRMC</span>
                    <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[var(--color-text-secondary)] tracking-widest uppercase mt-0.5">Disaster Ready</span>
                  </div>
                </div>

                {/* DPA 2012 */}
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:border-emerald-600 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-all">
                    <DataPrivacyLogo className="w-9 h-9" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-black text-[var(--color-text)] tracking-tight leading-none group-hover:text-emerald-600 transition-colors">RA 10173</span>
                    <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[var(--color-text-secondary)] tracking-widest uppercase mt-0.5">Data Privacy Act</span>
                  </div>
                </div>
              </div>

              {/* Loop 2 (Duplicate for seamless scrolling) */}
              <div className="flex items-center space-x-12 sm:space-x-20 lg:space-x-32 px-6 sm:px-10 lg:px-16 opacity-95 hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
                {/* DILG */}
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:border-[var(--color-ph-gold)] group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-all">
                    <DILGLogo className="w-9 h-9" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-black text-[var(--color-text)] tracking-tight leading-none group-hover:text-[var(--color-ph-gold)] transition-colors">DILG</span>
                    <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[var(--color-text-secondary)] tracking-widest uppercase mt-0.5">Routing Standard</span>
                  </div>
                </div>
                
                {/* DICT */}
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:border-blue-600 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-all">
                    <DICTLogo className="w-9 h-9" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-black text-[var(--color-text)] tracking-tight leading-none group-hover:text-blue-600 transition-colors">DICT</span>
                    <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[var(--color-text-secondary)] tracking-widest uppercase mt-0.5">E-Gov Framework</span>
                  </div>
                </div>

                {/* NDRRMC */}
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:border-red-600 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-all">
                    <NDRRMCLogo className="w-9 h-9" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-black text-[var(--color-text)] tracking-tight leading-none group-hover:text-red-600 transition-colors">NDRRMC</span>
                    <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[var(--color-text-secondary)] tracking-widest uppercase mt-0.5">Disaster Ready</span>
                  </div>
                </div>

                {/* DPA 2012 */}
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:border-emerald-600 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-all">
                    <DataPrivacyLogo className="w-9 h-9" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-black text-[var(--color-text)] tracking-tight leading-none group-hover:text-emerald-600 transition-colors">RA 10173</span>
                    <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[var(--color-text-secondary)] tracking-widest uppercase mt-0.5">Data Privacy Act</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — ASYMMETRICAL BENTO GRID
          Elite 2026 Feature Presentation
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-bg)] pt-12 pb-24 sm:pt-20 sm:pb-32 relative">
        {/* Global Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-3xl mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[var(--color-ph-gold)]/30 text-[var(--color-ph-gold)] text-xs font-black uppercase tracking-widest bg-[var(--color-ph-gold)]/5">
              <IconTarget className="w-3.5 h-3.5" />
              <span>{lang !== "en" ? "Bento System v2" : "Bento System v2"}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--color-text)] tracking-tight leading-[1.1]">
              {t("landing.featuresTitle")}
            </h2>
            <p className="mt-6 text-xl text-[var(--color-text-secondary)] leading-relaxed font-medium">
              {t("landing.featuresDesc")}
            </p>
          </motion.div>

          {/* Asymmetrical Bento Boxes */}
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8"
          >
            {/* Box 1: Large Span with Background Asset */}
            <motion.div variants={fadeUp} className="md:col-span-8 group">
              <div className="h-full rounded-[2rem] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden bg-slate-900 border border-slate-800 dark:bg-[#080d14] dark:border-white/10 shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] text-white hover:border-[var(--color-ph-gold)]/50 transition-colors duration-500">
                <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40 bg-[url('/bento_resilience_bg.png')] bg-cover bg-center mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
                <div className="relative z-10 space-y-8 max-w-xl">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-ph-gold)] text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(200,145,30,0.4)]">
                    <IconLightning className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                    {getTitle(FEATURES[0])}
                  </h3>
                  <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-medium">
                    {getDesc(FEATURES[0])}
                  </p>
                </div>
                <div className="relative z-10 pt-8 mt-12 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs font-black uppercase tracking-widest text-[var(--color-ph-gold-light)]">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> 🇵🇭 Offline Neural Engine</span>
                  <span className="opacity-70">100% On-Device</span>
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
                    {getTitle(FEATURES[1])}
                  </h3>
                  <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {getDesc(FEATURES[1])}
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
                    {getTitle(FEATURES[2])}
                  </h3>
                  <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {getDesc(FEATURES[2])}
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
                    {getTitle(FEATURES[3])}
                  </h3>
                  <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {getDesc(FEATURES[3])}
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
                    {getTitle(FEATURES[4])}
                  </h3>
                  <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {getDesc(FEATURES[4])}
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
          SECTION 3 — HOW IT WORKS (Architectural Timeline)
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-surface)] py-24 sm:py-32 relative border-y border-[var(--color-border)] dark:border-white/5">
        {/* Global Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest bg-blue-500/5">
              <IconChartBar className="w-3.5 h-3.5" />
              <span>{lang !== "en" ? "Paano Gumagana" : "How It Works"}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--color-text)] tracking-tight">
              {lang !== "en" ? "Tatlong Hakbang Lamang" : "Three Simple Steps"}
            </h2>
            <p className="mt-6 text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed font-medium">
              {lang !== "en"
                ? "Mabilis, madali, at tumpak. Gumagana kahit offline para sa lahat ng mamamayan."
                : "Fast, simple, and accurate. Works even without internet for all citizens."}
            </p>
          </motion.div>

          {/* Architectural Timeline Grid */}
          <div className="relative">
            {/* Glowing connecting track line hidden on mobile */}
            <div
              className="hidden md:block absolute top-12 h-1 bg-gradient-to-r from-transparent via-[var(--color-ph-gold)]/30 to-transparent shadow-[0_0_15px_rgba(200,145,30,0.5)] rounded-full"
              style={{ left: "16.5%", right: "16.5%" }}
            />

            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative z-10"
            >
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center relative group"
                >
                  {/* Premium Numbered Node */}
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-2 border-[var(--color-ph-gold)] text-[var(--color-text)] flex items-center justify-center mb-10 shadow-2xl shadow-[var(--color-ph-gold)]/10 group-hover:scale-110 transition-transform duration-500 relative">
                    <div className="absolute inset-2 rounded-full border border-[var(--color-ph-gold)]/30 border-dashed animate-spin-slow" />
                    <span className="font-space font-black text-3xl tracking-tighter text-[var(--color-ph-navy)] dark:text-white">
                      {step.num}
                    </span>
                  </div>

                  {/* Node Content */}
                  <div className="space-y-4 max-w-sm">
                    <h3 className="text-2xl font-black text-[var(--color-text)] tracking-tight">
                      {getTitle(step)}
                    </h3>
                    <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed font-medium">
                      {getDesc(step)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — CATEGORIES (Architectural Tiles)
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-bg)] py-24 sm:py-32 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest bg-blue-500/5">
              <IconChartBar className="w-3.5 h-3.5" />
              <span>{lang !== "en" ? "Mga Kategorya" : "Categories"}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--color-text)] tracking-tight">
              {t("landing.categoriesTitle")}
            </h2>
            <p className="mt-6 text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed font-medium">
              {t("landing.categoriesDesc")}
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
                className="group cursor-default"
              >
                <div className="p-8 text-center h-full flex flex-col items-center justify-center bg-white dark:bg-[#0a111a] border border-slate-200 dark:border-white/5 rounded-3xl shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[var(--color-ph-gold)]/40 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-ph-gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-[var(--color-ph-navy)] dark:text-slate-300 flex items-center justify-center mb-6 group-hover:bg-[var(--color-ph-gold)] group-hover:text-slate-950 transition-colors duration-300 shadow-inner relative z-10">
                    <cat.icon className="w-7 h-7" />
                  </div>
                  <div className="text-base font-black text-[var(--color-text)] leading-snug tracking-wide relative z-10">
                    {getLabel(cat)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — TESTIMONIALS (Glassmorphic Blocks)
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-surface)] py-24 sm:py-32 border-t border-[var(--color-border)] dark:border-white/5 relative overflow-hidden">
        {/* Global Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Decorative blur orb */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-ph-gold)]/10 dark:bg-[var(--color-ph-gold)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest bg-blue-500/5">
              <IconStar className="w-3.5 h-3.5" />
              <span>{lang !== "en" ? "Testimonya" : "Testimonials"}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--color-text)] tracking-tight">
              {t("landing.testimonialsTitle")}
            </h2>
            <p className="mt-6 text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed font-medium">
              {t("landing.testimonialsDesc")}
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
              <motion.div key={i} variants={fadeUp} className="group">
                <div className="h-full rounded-3xl p-10 flex flex-col justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 shadow-xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[var(--color-ph-gold)]/30 transition-all duration-300">
                  <div>
                    {/* 5 gold stars */}
                    <div
                      className="flex gap-1.5 mb-8"
                      aria-label={lang !== "en" ? "5 bituin" : "5 stars"}
                    >
                      {Array.from({ length: 5 }).map((_, j) => (
                        <IconStar
                          key={j}
                          className="w-5 h-5 text-[var(--color-ph-gold)] fill-[var(--color-ph-gold)]"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-[var(--color-text)] text-lg lg:text-xl font-medium leading-relaxed mb-10 tracking-wide">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[var(--color-text)] flex items-center justify-center font-black text-lg shrink-0 shadow-inner group-hover:bg-[var(--color-ph-gold)] group-hover:text-slate-950 group-hover:border-[var(--color-ph-gold)] transition-colors duration-300">
                      {item.initial}
                    </div>
                    <div>
                      <div className="font-black text-[var(--color-text)] text-base tracking-wide">
                        {item.name}
                      </div>
                      <div className="text-sm font-bold tracking-widest uppercase text-[var(--color-text-muted)]">
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
          SECTION 6 — FINAL CTA (Premium Floating Card)
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-bg)] px-4 sm:px-6 pb-24 sm:pb-32 pt-12 relative overflow-hidden">
        {/* Global Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Decorative background glow behind the card */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[60%] bg-[var(--color-ph-gold)]/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="bg-gradient-to-br from-slate-900 via-[#0a111a] to-[#04080f] rounded-[2rem] sm:rounded-[2.5rem] py-20 sm:py-28 relative overflow-hidden shadow-2xl shadow-black/50 dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-slate-800 dark:border-white/10 group"
          >
            {/* Top architectural glow line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-ph-gold)]/60 to-transparent shadow-[0_0_20px_rgba(200,145,30,0.6)]" />

            {/* High-End Technical Grid Layer */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none group-hover:scale-105 transition-transform duration-1000 ease-out [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
            
            {/* Dramatic Inner Glow */}
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_center,_var(--color-ph-gold)_0%,_transparent_70%)] mix-blend-overlay pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-ph-gold)]/30 text-[var(--color-ph-gold)] text-xs font-black uppercase tracking-widest bg-slate-950/80 shadow-[0_0_20px_rgba(200,145,30,0.15)] backdrop-blur-md">
                <IconTarget className="w-3.5 h-3.5" />
                <span>{lang !== "en" ? "Handa Ka Na Ba?" : "Are You Ready?"}</span>
              </div>

              <h2 className="text-5xl sm:text-6xl md:text-[4.5rem] font-black text-white tracking-tighter leading-[1.05]">
                {t("landing.ctaTitle")}
              </h2>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium tracking-wide">
                {t("landing.ctaDesc")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link href="/report" className="w-full sm:w-auto px-8 py-4 sm:py-4.5 rounded-full bg-[var(--color-ph-gold)] hover:bg-[var(--color-ph-gold-light)] text-slate-950 font-black text-base tracking-wide shadow-xl shadow-[var(--color-ph-gold)]/20 hover:shadow-[var(--color-ph-gold)]/40 hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2.5">
                  <span>{t("landing.reportNow")}</span>
                  <IconArrowRight className="w-5 h-5" />
                </Link>
                <Link href={user ? "/dashboard" : "/auth"} className="w-full sm:w-auto px-8 py-4 sm:py-4.5 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-white font-bold text-base tracking-wide shadow-lg hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2.5 backdrop-blur-xl">
                  <span>{user ? (lang !== "en" ? "Pumunta sa Dashboard" : "Go to Dashboard") : t("landing.signIn")}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

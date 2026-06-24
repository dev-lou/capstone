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
  IconUsers,
  IconHeart,
  IconTarget,
  IconPaperPlane,
  IconArrowRight,
  IconChartBar,
} from "./components/icons";

// ── Motion Variants ────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// ── Features ──────────────────────────────────────
const FEATURES = [
  {
    icon: IconLightning, titleFil: "AI-Powered Triage", titleEn: "AI-Powered Triage",
    descFil: "Awtomatikong nagki-classify ng insidente — gamit ang offline-first AI na hindi nangangailangan ng internet.",
    descEn: "Automatically classifies incidents using offline-first AI that works without internet.",
  },
  {
    icon: IconShield, titleFil: "Offline-First", titleEn: "Offline-First",
    descFil: "Gumagana kahit walang koneksyon. Perpekto para sa malalayong barangay.",
    descEn: "Works without any internet connection. Perfect for remote barangays.",
  },
  {
    icon: IconGlobe, titleFil: "Bilingual (Filipino / English)", titleEn: "Bilingual (Filipino / English)",
    descFil: "Buong suporta sa Tagalog at English — ginawa para sa bawat Pilipino.",
    descEn: "Full Tagalog and English support — built for every Filipino.",
  },
  {
    icon: IconTarget, titleFil: "PSGC Location Routing", titleEn: "PSGC Location Routing",
    descFil: "Gamit ang Philippine Standard Geographic Codes para sa tamang routing sa tamang opisina.",
    descEn: "Uses Philippine Standard Geographic Codes for accurate office routing.",
  },
  {
    icon: IconUsers, titleFil: "Barangay Dashboard", titleEn: "Barangay Dashboard",
    descFil: "I-manage ang lahat ng report — i-filter, i-search, i-export sa CSV.",
    descEn: "Manage all reports — filter, search, export to CSV.",
  },
  {
    icon: IconHeart, titleFil: "Ligtas at Secure", titleEn: "Safe & Secure",
    descFil: "Supabase authentication at rate-limited API para sa seguridad ng datos.",
    descEn: "Supabase authentication and rate-limited API for data security.",
  },
];

const CATEGORIES = [
  { labelFil: "Baha / Drainage", labelEn: "Flood / Drainage", icon: "🌊" },
  { labelFil: "Sirang Kalsada", labelEn: "Road Damage", icon: "🛣️" },
  { labelFil: "Basura", labelEn: "Garbage / Waste", icon: "🗑️" },
  { labelFil: "Ingay", labelEn: "Noise Complaint", icon: "🔊" },
  { labelFil: "Kalusugan", labelEn: "Health / Medical", icon: "🏥" },
  { labelFil: "Permit", labelEn: "Permit / License", icon: "📋" },
  { labelFil: "Tubig", labelEn: "Water Supply", icon: "💧" },
  { labelFil: "Kuryente", labelEn: "Electricity", icon: "⚡" },
  { labelFil: "Public Safety", labelEn: "Public Safety", icon: "🛡️" },
  { labelFil: "Iba Pa", labelEn: "Others", icon: "📌" },
];

// ── Main Component ───────────────────────────────
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
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="space-y-6">
          <div className="skeleton h-12 w-2/3 mx-auto" />
          <div className="skeleton h-6 w-1/2 mx-auto" />
          <div className="skeleton h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ══ Hero ════════════════════════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24 sm:pb-28">
        {/* Warm organic background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ph-navy)]/3 via-transparent to-transparent dark:from-[var(--color-accent-muted)]/10 dark:via-transparent" />
        <div className="absolute top-[-30%] right-[-15%] w-[60%] h-[60%] bg-gradient-to-br from-[var(--color-ph-gold)]/8 to-[var(--color-ph-navy)]/5 dark:from-[var(--color-ph-gold)]/5 dark:to-[var(--color-ph-navy)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-ph-gold)]/20 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="initial" animate="animate" className="text-center max-w-4xl mx-auto">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary-muted)] dark:bg-[var(--color-primary-muted)]/20 text-[var(--color-ph-navy)] dark:text-[var(--color-primary)] rounded-full text-[0.65rem] font-medium mb-6 border border-[var(--color-ph-gold)]/20">
              <IconStar className="w-3 h-3" />
              <span>Barangay Triage System · 2026</span>
            </div>

            <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-bold tracking-tight leading-[1.05] text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">
              RescueMind AI
              <span className="block mt-2 text-[var(--color-ph-gold)] dark:text-[var(--color-accent)]">
                {lang === "fil" ? "Para sa Bawat Barangay" : "For Every Barangay"}
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {lang === "fil"
                ? "AI-powered na sistema para sa mabilis at tamang pag-ruta ng disaster at complaint reports sa tamang ahensya ng gobyerno — kahit walang internet."
                : "AI-powered system for fast and accurate routing of disaster and complaint reports to the right government agency — even without internet."}
            </p>

            <motion.div variants={stagger} initial="initial" animate="animate" className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.div variants={fadeUp}>
                <Link href="/report" className="btn btn-primary text-base px-8 py-3 gap-2.5 shadow-lg shadow-[var(--color-ph-navy)]/20 dark:shadow-[var(--color-ph-gold)]/10">
                  <IconPaperPlane />
                  <span>{t("landing.reportNow", lang)}</span>
                </Link>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link href="/dashboard" className="btn btn-secondary text-base px-8 py-3 gap-2.5">
                  <IconChartBar />
                  <span>{t("landing.viewDashboard", lang)}</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} initial="initial" animate="animate" className="mt-12 flex items-center justify-center gap-8 sm:gap-12 text-sm text-[var(--color-text-muted)]">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">10</div>
                <div className="mt-0.5 text-xs">{t("landing.statsCategories", lang)}</div>
              </div>
              <div className="w-px h-10 bg-[var(--color-border)]" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">17</div>
                <div className="mt-0.5 text-xs">{t("landing.statsRegions", lang)}</div>
              </div>
              <div className="w-px h-10 bg-[var(--color-border)]" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">{reportCount}</div>
                <div className="mt-0.5 text-xs">{t("landing.statsReports", lang)}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ Features ═════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">{t("landing.featuresTitle", lang)}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-xl mx-auto">{t("landing.featuresDesc", lang)}</p>
          </motion.div>

          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="card-ph p-6 cursor-default hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-ph-gold)]/10 text-[var(--color-ph-gold)] dark:text-[var(--color-accent)] mb-4">
                  <feature.icon />
                </div>
                <h3 className="font-semibold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)] text-sm mb-1.5">
                  {lang === "fil" ? feature.titleFil : feature.titleEn}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {lang === "fil" ? feature.descFil : feature.descEn}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ Categories ══════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">{t("landing.categoriesTitle", lang)}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-xl mx-auto">{t("landing.categoriesDesc", lang)}</p>
          </motion.div>

          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={i} variants={scaleIn} className="card p-4 text-center hover:border-[var(--color-accent)] transition-all hover:-translate-y-0.5 cursor-default">
                <div className="text-2xl mb-2" aria-hidden="true">{cat.icon}</div>
                <div className="text-xs font-medium text-[var(--color-text)]">
                  {lang === "fil" ? cat.labelFil : cat.labelEn}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ Testimonials ═══════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">{t("landing.testimonialsTitle", lang)}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-xl mx-auto">{t("landing.testimonialsDesc", lang)}</p>
          </motion.div>

          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-3 gap-4">
            {[
              { quote: "Napakabilis ng AI classification — natukoy agad ang aming report na baha at na-ruta sa tamang opisina.", author: "Kap. Reyes, Brgy. San Isidro" },
              { quote: "Kahit walang internet sa aming lugar, gumagana pa rin ang RescueMind. Malaking tulong!", author: "Kag. Santos, Brgy. Mabuhay" },
              { quote: "Mas madali nang i-manage ang mga reklamo ng aming barangay gamit ang dashboard.", author: "Sec. Cruz, Brgy. Masagana" },
            ].map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="card-ph p-6">
                <div className="flex gap-1 mb-3" aria-hidden="true">
                  {[...Array(5)].map((_, j) => <IconStar key={j} className="w-3.5 h-3.5 text-[var(--color-ph-gold)]" />)}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-ph-navy)]/10 dark:bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-ph-navy)] dark:text-[var(--color-primary)] font-bold text-[0.6rem] shrink-0">
                    {t.author.charAt(0)}
                  </div>
                  <span>{t.author}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ Final CTA ══════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }}>
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-[var(--color-ph-gold)]/10 dark:bg-[var(--color-accent-muted)]/20 text-[var(--color-ph-gold)] dark:text-[var(--color-accent)] mb-6">
              <IconPaperPlane className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">
              {t("landing.ctaTitle", lang)}
            </h2>
            <p className="mt-3 text-sm text-[var(--color-text-muted)] max-w-lg mx-auto">
              {t("landing.ctaDesc", lang)}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/report" className="btn btn-primary text-base px-8 py-3 gap-2.5">
                <IconPaperPlane />
                <span>{t("landing.reportNow", lang)}</span>
              </Link>
              <Link href="/auth" className="btn btn-secondary text-base px-8 py-3 gap-2.5">
                <IconArrowRight />
                <span>{t("landing.signIn", lang)}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

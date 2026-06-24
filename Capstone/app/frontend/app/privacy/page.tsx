import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — RescueMind AI",
  description: "RescueMind AI privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="card p-8 sm:p-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Privacy Policy</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">1. Data We Collect</h2>
            <p>RescueMind AI collects the following information when you submit a report:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Incident description text you provide</li>
              <li>Location data (region, province, city/municipality, barangay)</li>
              <li>Optional GPS coordinates if you enable location detection</li>
              <li>Email address (if you create an account)</li>
              <li>Tracking ID and classification results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">2. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>To classify and route incident reports to the appropriate government office</li>
              <li>To generate analytics and statistics for barangay governance</li>
              <li>To improve the AI classification model</li>
              <li>To comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">3. Data Storage & Security</h2>
            <p>Report data is stored locally in your browser using localStorage. If you create an account, data is stored securely on Supabase servers. We implement industry-standard security measures including encryption in transit (TLS) and rate-limited API access.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">4. Data Retention</h2>
            <p>Reports are retained for the duration of the capstone project. You may delete individual reports or clear all data at any time through the dashboard. Account deletion is available upon request.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">5. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-400">
              <li><strong>Supabase</strong> — Authentication and database (if you create an account)</li>
              <li><strong>Google Gemini</strong> — AI enrichment for classification explanations</li>
              <li><strong>Xenova Transformers</strong> — Offline AI classification (runs locally, no data sent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">6. Contact</h2>
            <p>For questions about this privacy policy, please contact the RescueMind AI team through your barangay&apos;s designated representative.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Link href="/" className="btn btn-secondary text-sm">Bumalik sa Home</Link>
        </div>
      </div>
    </div>
  );
}

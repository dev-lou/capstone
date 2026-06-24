import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — RescueMind AI",
  description: "RescueMind AI terms of service — guidelines for using the barangay triage system.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="card p-8 sm:p-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Terms of Service</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">1. Acceptance of Terms</h2>
            <p>By using RescueMind AI, you agree to these terms of service. If you do not agree, please do not use the system.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">2. Description of Service</h2>
            <p>RescueMind AI is an AI-powered barangay disaster and complaint triage system. It classifies incident reports and routes them to the appropriate government office. The system provides AI-assisted classification only — final action and routing remain the responsibility of the barangay.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">3. User Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Provide accurate and truthful information in your reports</li>
              <li>Not use the system for false or malicious reports</li>
              <li>Not attempt to bypass rate limits or security measures</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">4. Limitation of Liability</h2>
            <p>RescueMind AI is a capstone project and is provided &ldquo;as is&rdquo; without warranty of any kind. The developers are not liable for any damages arising from the use of this system. Emergency situations should always be reported directly to relevant authorities (e.g., 911, PNP, NDRRMC).</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">5. Emergency Disclaimer</h2>
            <p className="font-semibold text-amber-700 dark:text-amber-400">If you are experiencing a life-threatening emergency, please call 911 or your local emergency number immediately. Do not rely solely on this system for emergency response.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">6. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Users will be notified of material changes through the system.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Link href="/" className="btn btn-secondary text-sm">Bumalik sa Home</Link>
        </div>
      </div>
    </div>
  );
}

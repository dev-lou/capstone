// ────────────────────────────────────────────────────────────
// i18n — Simple translation system for Tagalog / English
// Industry‑standard pattern: no dependency, typed keys
// ────────────────────────────────────────────────────────────

export type Language = "fil" | "en";

const translations: Record<string, Record<Language, string>> = {
  // App
  "app.title": { fil: "RescueMind AI", en: "RescueMind AI" },
  "app.subtitle": { fil: "Barangay Disaster & Complaint Triage", en: "Barangay Disaster & Complaint Triage" },

  // Navigation
  "nav.home": { fil: "Home", en: "Home" },
  "nav.report": { fil: "Mag-Report", en: "Report" },
  "nav.dashboard": { fil: "Dashboard", en: "Dashboard" },

  // Landing Hero
  "landing.badge": { fil: "Capstone Project 2026", en: "Capstone Project 2026" },
  "landing.title": { fil: "Barangay Triage System", en: "Barangay Triage System" },
  "landing.subtitle": {
    fil: "AI-powered na sistema para sa mabilis at tamang pag-ruta ng disaster at complaint reports sa tamang ahensya ng gobyerno.",
    en: "AI-powered system for fast and accurate routing of disaster and complaint reports to the right government agency.",
  },
  "landing.reportNow": { fil: "Mag-Report Ngayon", en: "Report Now" },
  "landing.viewDashboard": { fil: "Tingnan ang Dashboard", en: "View Dashboard" },
  "landing.statsCategories": { fil: "Kategorya", en: "Categories" },
  "landing.statsRegions": { fil: "Rehiyon", en: "Regions" },
  "landing.statsReports": { fil: "Reports Naisumite", en: "Reports Submitted" },
  "landing.featuresTitle": { fil: "Mga Tampok na Kakayahan", en: "Key Features" },
  "landing.featuresDesc": {
    fil: "Disenyo para sa modernong barangay governance na may AI at offline capability.",
    en: "Designed for modern barangay governance with AI and offline capability.",
  },
  "landing.categoriesTitle": { fil: "Mga Kategorya ng Report", en: "Report Categories" },
  "landing.categoriesDesc": {
    fil: "Sinusuportahan ang lahat ng karaniwang report ng barangay.",
    en: "Supports all common barangay report types.",
  },
  "landing.testimonialsTitle": { fil: "Sinabi ng Barangay", en: "What Barangays Say" },
  "landing.testimonialsDesc": {
    fil: "Feedback mula sa aming mga gumagamit sa iba't ibang barangay.",
    en: "Feedback from our users across different barangays.",
  },
  "landing.ctaTitle": { fil: "Handa nang Mag-report?", en: "Ready to Report?" },
  "landing.ctaDesc": {
    fil: "Simulan na ang pag-report ng insidente sa inyong barangay. Libre at madaling gamitin.",
    en: "Start reporting incidents in your barangay. Free and easy to use.",
  },
  "landing.signIn": { fil: "Mag-sign In", en: "Sign In" },

  // Form
  "form.title": { fil: "Mag-report ng Insidente", en: "Report an Incident" },
  "form.description": { fil: "Ilarawan ang insidente o reklamo sa inyong barangay.", en: "Describe the incident or complaint in your barangay." },
  "form.placeholder": { fil: "Halimbawa: Malakas na baha sa may kanto ng Mabini St. at Rizal Ave., hanggang tuhod ang tubig, kailangan ng rescue.", en: "Example: Strong flood at the corner of Mabini St. and Rizal Ave., waist-deep water, need rescue." },
  "form.submit": { fil: "Isumite ang Report", en: "Submit Report" },
  "form.charCount": { fil: " / 1000", en: " / 1000" },
  "form.error.minLength": { fil: "Mangyaring magbigay ng mas detalyadong paglalarawan (hindi bababa sa 10 character).", en: "Please provide a more detailed description (at least 10 characters)." },
  "form.tip": { fil: "Tip: Pindutin ang Ctrl + Enter para mabilis na isumite.", en: "Tip: Press Ctrl + Enter to submit quickly." },
  "form.location": { fil: "Lokasyon", en: "Location" },
  "form.detectLocation": { fil: "Tuklasin ang Lokasyon", en: "Detect My Location" },
  "form.locationDetected": { fil: "Natuklasan ang lokasyon", en: "Location detected" },
  "form.locationFailed": { fil: "Hindi matuklasan ang lokasyon. Pumili nang manu-mano sa ibaba.", en: "Could not detect location. Select manually below." },

  // Location labels
  "location.region": { fil: "Rehiyon", en: "Region" },
  "location.province": { fil: "Lalawigan", en: "Province" },
  "location.city": { fil: "Lungsod / Bayan", en: "City / Municipality" },
  "location.barangay": { fil: "Barangay", en: "Barangay" },
  "location.select": { fil: "Pumili...", en: "Select..." },

  // Loading
  "loading.title": { fil: "Sinusuri ang report...", en: "Analyzing report..." },
  "loading.description": { fil: "Pinoproseso ng AI ang iyong report.", en: "AI is processing your report." },
  "loading.step1": { fil: "Ina-analyze ang text...", en: "Analyzing text..." },
  "loading.step2": { fil: "Kino-classify ang kategorya...", en: "Classifying category..." },
  "loading.step3": { fil: "Nag-ge-generate ng paliwanag...", en: "Generating explanation..." },

  // Result
  "result.office": { fil: "Opisina", en: "Office" },
  "result.confidence": { fil: "kumpiyansa", en: "confidence" },
  "result.timestamp": { fil: "Na-classify noong", en: "Classified on" },
  "result.trackingId": { fil: "Tracking ID", en: "Tracking ID" },
  "result.reportAgain": { fil: "Mag-report Muli", en: "Report Again" },
  "result.humanReview": { fil: "Kailangan ng manual review — mababa ang antas ng kumpiyansa.", en: "Needs manual review — low confidence score." },
  "result.newReport": { fil: "Bago Ulit", en: "New Report" },

  // Disclaimer
  "disclaimer.text": { fil: "Ang resulta na ito ay AI-assisted classification lamang. Ang final action at routing ay responsibilidad ng barangay.", en: "This result is AI-assisted classification only. Final action and routing are the responsibility of the barangay." },

  // Offline
  "offline.title": { fil: "Offline Mode", en: "Offline Mode" },

  // Dashboard
  "dashboard.title": { fil: "Report Dashboard", en: "Report Dashboard" },
  "dashboard.description": { fil: "Kasaysayan ng lahat ng nai-submit na report.", en: "History of all submitted reports." },
  "dashboard.noReports": { fil: "Wala pang naisusumiteng report.", en: "No reports submitted yet." },
  "dashboard.filterAll": { fil: "Lahat", en: "All" },
  "dashboard.filterPending": { fil: "Nakabinbin", en: "Pending" },
  "dashboard.filterInProgress": { fil: "Inaaksyunan", en: "In Progress" },
  "dashboard.filterResolved": { fil: "Naresolba", en: "Resolved" },
  "dashboard.statusPending": { fil: "Nakabinbin", en: "Pending" },
  "dashboard.statusInProgress": { fil: "Inaaksyunan", en: "In Progress" },
  "dashboard.statusResolved": { fil: "Naresolba", en: "Resolved" },
  "dashboard.markInProgress": { fil: "Markahan bilang Inaaksyunan", en: "Mark as In Progress" },
  "dashboard.markResolved": { fil: "Markahan bilang Naresolba", en: "Mark as Resolved" },
  "dashboard.delete": { fil: "Burahin", en: "Delete" },
  "dashboard.clearAll": { fil: "Burahin Lahat", en: "Clear All" },
  "dashboard.search": { fil: "Maghanap ng report...", en: "Search reports..." },
  "dashboard.total": { fil: "Kabuuang Report", en: "Total Reports" },
  "dashboard.byCategory": { fil: "Ayon sa Kategorya", en: "By Category" },
  "dashboard.byUrgency": { fil: "Ayon sa Urgency", en: "By Urgency" },
  "dashboard.high": { fil: "Mataas", en: "High" },
  "dashboard.medium": { fil: "Katamtaman", en: "Medium" },
  "dashboard.low": { fil: "Mababa", en: "Low" },
  "dashboard.exportCsv": { fil: "I-export bilang CSV", en: "Export as CSV" },
  "dashboard.exportJson": { fil: "I-export bilang JSON", en: "Export as JSON" },
  "dashboard.exportSuccess": { fil: "Na-export ang mga report!", en: "Reports exported!" },
  "dashboard.viewDetail": { fil: "Tingnan ang Detalye", en: "View Details" },
  "dashboard.allUrgencies": { fil: "Lahat ng Urgency", en: "All Urgencies" },
  "dashboard.allStatuses": { fil: "Lahat ng Status", en: "All Statuses" },
  "dashboard.filterUrgency": { fil: "Urgency", en: "Urgency" },
  "dashboard.filterCategory": { fil: "Kategorya", en: "Category" },
  "dashboard.filterStatus": { fil: "Status", en: "Status" },

  // Errors
  "error.generic": { fil: "May naganap na error sa pag-process ng report. Pakisubukan muli.", en: "An error occurred while processing your report. Please try again." },
  "error.network": { fil: "Walang koneksyon sa server. Pakisubukan muli.", en: "No connection to server. Please try again." },

  // Accessibility
  "a11y.skipLink": { fil: "Laktawan sa pangunahing nilalaman", en: "Skip to main content" },
  "a11y.themeToggle": { fil: "Palitan ang dark mode", en: "Toggle dark mode" },
  "a11y.langToggle": { fil: "Lumipat sa English", en: "Lumipat sa Filipino" },
  "a11y.copyId": { fil: "Kopyahin ang tracking ID", en: "Copy tracking ID" },
  "a11y.copied": { fil: "Nakopya", en: "Copied" },

  // Auth
  "auth.signIn": { fil: "Pumasok", en: "Sign In" },
  "auth.signOut": { fil: "Lumabas", en: "Sign Out" },
  "auth.createAccount": { fil: "Gumawa ng Account", en: "Create Account" },
  "auth.email": { fil: "Email address", en: "Email address" },
  "auth.password": { fil: "Password", en: "Password" },
  "auth.passwordHint": { fil: "Dapat hindi bababa sa 6 na character ang password", en: "Password must be at least 6 characters" },
  "auth.signingIn": { fil: "Pumapasok...", en: "Signing in..." },
  "auth.creating": { fil: "Gumagawa ng account...", en: "Creating account..." },
  "auth.noAccount": { fil: "Wala pang account?", en: "Don't have an account?" },
  "auth.hasAccount": { fil: "May account na?", en: "Already have an account?" },
  "auth.signUpLink": { fil: "Gumawa ng account", en: "Sign up" },
  "auth.signInLink": { fil: "Pumasok", en: "Sign in" },
  "auth.successMsg": { fil: "Naipadala na ang confirmation link sa iyong email. Pakitingnan ang inbox (at spam folder).", en: "Check your email for the confirmation link! Please also check your spam folder." },
  "auth.demoInfo": { fil: "Demo: Gumawa muna ng account, pagkatapos suriin ang email (o huwag paganahin ang email confirmation sa Supabase Dashboard).", en: "Demo: Create an account first, then check your email (or disable email confirmation in Supabase Dashboard)." },
  "auth.loginDescription": { fil: "Mamahala ng mga report ng barangay", en: "Manage barangay reports" },
  "auth.signupDescription": { fil: "Gumawa ng account para makapagsimula", en: "Create an account to get started" },
  "auth.backHome": { fil: "Bumalik sa Home", en: "Return to Home" },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}

export function getLangFromStorage(): Language {
  if (typeof window === "undefined") return "fil";
  return (localStorage.getItem("rescuemind_lang") as Language) ?? "fil";
}

export function setLangInStorage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rescuemind_lang", lang);
}

const fs = require("fs");

const keys = [
  "app.title","app.subtitle","nav.home","nav.report","nav.dashboard",
  "landing.badge","landing.title","landing.subtitle","landing.reportNow","landing.viewDashboard",
  "landing.statsCategories","landing.statsRegions","landing.statsReports",
  "landing.featuresTitle","landing.featuresDesc","landing.categoriesTitle","landing.categoriesDesc",
  "landing.testimonialsTitle","landing.testimonialsDesc","landing.ctaTitle","landing.ctaDesc","landing.signIn",
  "form.title","form.description","form.placeholder","form.submit","form.charCount",
  "form.error.minLength","form.tip","form.location","form.detectLocation","form.locationDetected","form.locationFailed",
  "location.region","location.province","location.city","location.barangay","location.select",
  "loading.title","loading.description","loading.step1","loading.step2","loading.step3",
  "result.office","result.confidence","result.timestamp","result.trackingId","result.reportAgain","result.humanReview","result.newReport",
  "disclaimer.text","offline.title",
  "dashboard.title","dashboard.description","dashboard.noReports","dashboard.filterAll",
  "dashboard.filterPending","dashboard.filterInProgress","dashboard.filterResolved",
  "dashboard.statusPending","dashboard.statusInProgress","dashboard.statusResolved",
  "dashboard.markInProgress","dashboard.markResolved","dashboard.delete","dashboard.clearAll",
  "dashboard.search","dashboard.total","dashboard.byCategory","dashboard.byUrgency",
  "dashboard.high","dashboard.medium","dashboard.low",
  "dashboard.exportCsv","dashboard.exportJson","dashboard.exportSuccess","dashboard.viewDetail",
  "dashboard.allUrgencies","dashboard.allStatuses","dashboard.filterUrgency","dashboard.filterCategory","dashboard.filterStatus",
  "error.generic","error.network",
  "a11y.skipLink","a11y.themeToggle","a11y.langToggle","a11y.copyId","a11y.copied",
  "auth.signIn","auth.signOut","auth.createAccount","auth.email","auth.password","auth.passwordHint",
  "auth.signingIn","auth.creating","auth.noAccount","auth.hasAccount","auth.signUpLink","auth.signInLink",
  "auth.successMsg","auth.demoInfo","auth.loginDescription","auth.signupDescription","auth.backHome",
  "locale.label","locale.auto"
];

// Filipino translations
const fil = {
  "app.title":"RescueMind AI","app.subtitle":"Barangay Disaster & Complaint Triage",
  "nav.home":"Home","nav.report":"Mag-Report","nav.dashboard":"Dashboard",
  "landing.badge":"Capstone Project 2026","landing.title":"Barangay Triage System",
  "landing.subtitle":"AI-powered na sistema para sa mabilis at tamang pag-ruta ng disaster at complaint reports sa tamang ahensya ng gobyerno.",
  "landing.reportNow":"Mag-Report Ngayon","landing.viewDashboard":"Tingnan ang Dashboard",
  "landing.statsCategories":"Kategorya","landing.statsRegions":"Rehiyon","landing.statsReports":"Reports Naisumite",
  "landing.featuresTitle":"Mga Tampok na Kakayahan","landing.featuresDesc":"Disenyo para sa modernong barangay governance na may AI at offline capability.",
  "landing.categoriesTitle":"Mga Kategorya ng Report","landing.categoriesDesc":"Sinusuportahan ang lahat ng karaniwang report ng barangay.",
  "landing.testimonialsTitle":"Sinabi ng Barangay","landing.testimonialsDesc":"Feedback mula sa aming mga gumagamit sa iba't ibang barangay.",
  "landing.ctaTitle":"Handa nang Mag-report?","landing.ctaDesc":"Simulan na ang pag-report ng insidente sa inyong barangay. Libre at madaling gamitin.",
  "landing.signIn":"Mag-sign In",
  "form.title":"Mag-report ng Insidente","form.description":"Ilarawan ang insidente o reklamo sa inyong barangay.",
  "form.placeholder":"Halimbawa: Malakas na baha sa may kanto ng Mabini St. at Rizal Ave., hanggang tuhod ang tubig, kailangan ng rescue.",
  "form.submit":"Isumite ang Report","form.charCount":" / 1000",
  "form.error.minLength":"Mangyaring magbigay ng mas detalyadong paglalarawan (hindi bababa sa 10 character).",
  "form.tip":"Tip: Pindutin ang Ctrl + Enter para mabilis na isumite.",
  "form.location":"Lokasyon","form.detectLocation":"Tuklasin ang Lokasyon","form.locationDetected":"Natuklasan ang lokasyon",
  "form.locationFailed":"Hindi matuklasan ang lokasyon. Pumili nang manu-mano sa ibaba.",
  "location.region":"Rehiyon","location.province":"Lalawigan","location.city":"Lungsod / Bayan","location.barangay":"Barangay","location.select":"Pumili...",
  "loading.title":"Sinusuri ang report...","loading.description":"Pinoproseso ng AI ang iyong report.",
  "loading.step1":"Ina-analyze ang text...","loading.step2":"Kino-classify ang kategorya...","loading.step3":"Nag-ge-generate ng paliwanag...",
  "result.office":"Opisina","result.confidence":"kumpiyansa","result.timestamp":"Na-classify noong","result.trackingId":"Tracking ID",
  "result.reportAgain":"Mag-report Muli","result.humanReview":"Kailangan ng manual review --- mababa ang antas ng kumpiyansa.","result.newReport":"Bago Ulit",
  "disclaimer.text":"Ang resulta na ito ay AI-assisted classification lamang. Ang final action at routing ay responsibilidad ng barangay.",
  "offline.title":"Offline Mode",
  "dashboard.title":"Report Dashboard","dashboard.description":"Kasaysayan ng lahat ng nai-submit na report.","dashboard.noReports":"Wala pang naisusumiteng report.",
  "dashboard.filterAll":"Lahat","dashboard.filterPending":"Nakabinbin","dashboard.filterInProgress":"Inaaksyunan","dashboard.filterResolved":"Naresolba",
  "dashboard.statusPending":"Nakabinbin","dashboard.statusInProgress":"Inaaksyunan","dashboard.statusResolved":"Naresolba",
  "dashboard.markInProgress":"Markahan bilang Inaaksyunan","dashboard.markResolved":"Markahan bilang Naresolba",
  "dashboard.delete":"Burahin","dashboard.clearAll":"Burahin Lahat","dashboard.search":"Maghanap ng report...",
  "dashboard.total":"Kabuuang Report","dashboard.byCategory":"Ayon sa Kategorya","dashboard.byUrgency":"Ayon sa Urgency",
  "dashboard.high":"Mataas","dashboard.medium":"Katamtaman","dashboard.low":"Mababa",
  "dashboard.exportCsv":"I-export bilang CSV","dashboard.exportJson":"I-export bilang JSON",
  "dashboard.exportSuccess":"Na-export ang mga report!","dashboard.viewDetail":"Tingnan ang Detalye",
  "dashboard.allUrgencies":"Lahat ng Urgency","dashboard.allStatuses":"Lahat ng Status",
  "dashboard.filterUrgency":"Urgency","dashboard.filterCategory":"Kategorya","dashboard.filterStatus":"Status",
  "error.generic":"May naganap na error sa pag-process ng report. Pakisubukan muli.",
  "error.network":"Walang koneksyon sa server. Pakisubukan muli.",
  "a11y.skipLink":"Laktawan sa pangunahing nilalaman","a11y.themeToggle":"Palitan ang dark mode","a11y.langToggle":"Lumipat ng wika",
  "a11y.copyId":"Kopyahin ang tracking ID","a11y.copied":"Nakopya",
  "auth.signIn":"Pumasok","auth.signOut":"Lumabas","auth.createAccount":"Gumawa ng Account","auth.email":"Email address",
  "auth.password":"Password","auth.passwordHint":"Dapat hindi bababa sa 6 na character ang password",
  "auth.signingIn":"Pumapasok...","auth.creating":"Gumagawa ng account...",
  "auth.noAccount":"Wala pang account?","auth.hasAccount":"May account na?",
  "auth.signUpLink":"Gumawa ng account","auth.signInLink":"Pumasok",
  "auth.successMsg":"Naipadala na ang confirmation link sa iyong email. Pakitingnan ang inbox (at spam folder).",
  "auth.demoInfo":"Demo: Gumawa muna ng account, pagkatapos suriin ang email (o huwag paganahin ang email confirmation sa Supabase Dashboard).",
  "auth.loginDescription":"Mamahala ng mga report ng barangay","auth.signupDescription":"Gumawa ng account para makapagsimula",
  "auth.backHome":"Bumalik sa Home",
  "locale.label":"Filipino","locale.auto":"Auto-detect"
};

// English translations
const en = {};
keys.forEach(k => { en[k] = fil[k]; });
en["nav.home"] = "Home"; en["nav.report"] = "Report";
en["landing.subtitle"] = "AI-powered system for fast and accurate routing of disaster and complaint reports to the right government agency.";
en["landing.reportNow"] = "Report Now"; en["landing.viewDashboard"] = "View Dashboard";
en["landing.statsCategories"] = "Categories"; en["landing.statsRegions"] = "Regions"; en["landing.statsReports"] = "Reports Submitted";
en["landing.featuresTitle"] = "Key Features"; en["landing.featuresDesc"] = "Designed for modern barangay governance with AI and offline capability.";
en["landing.categoriesTitle"] = "Report Categories"; en["landing.categoriesDesc"] = "Supports all common barangay report types.";
en["landing.testimonialsTitle"] = "What Barangays Say"; en["landing.testimonialsDesc"] = "Feedback from our users across different barangays.";
en["landing.ctaTitle"] = "Ready to Report?"; en["landing.ctaDesc"] = "Start reporting incidents in your barangay. Free and easy to use.";
en["landing.signIn"] = "Sign In";
en["form.title"] = "Report an Incident"; en["form.description"] = "Describe the incident or complaint in your barangay.";
en["form.placeholder"] = "Example: Strong flood at the corner of Mabini St. and Rizal Ave., waist-deep water, need rescue.";
en["form.submit"] = "Submit Report"; en["form.charCount"] = " / 1000";
en["form.error.minLength"] = "Please provide a more detailed description (at least 10 characters).";
en["form.tip"] = "Tip: Press Ctrl + Enter to submit quickly.";
en["form.location"] = "Location"; en["form.detectLocation"] = "Detect My Location"; en["form.locationDetected"] = "Location detected";
en["form.locationFailed"] = "Could not detect location. Select manually below.";
en["location.region"] = "Region"; en["location.province"] = "Province"; en["location.city"] = "City / Municipality"; en["location.barangay"] = "Barangay"; en["location.select"] = "Select...";
en["loading.title"] = "Analyzing report..."; en["loading.description"] = "AI is processing your report.";
en["loading.step1"] = "Analyzing text..."; en["loading.step2"] = "Classifying category..."; en["loading.step3"] = "Generating explanation...";
en["result.office"] = "Office"; en["result.confidence"] = "confidence"; en["result.timestamp"] = "Classified on"; en["result.trackingId"] = "Tracking ID";
en["result.reportAgain"] = "Report Again"; en["result.humanReview"] = "Needs manual review --- low confidence score."; en["result.newReport"] = "New Report";
en["disclaimer.text"] = "This result is AI-assisted classification only. Final action and routing are the responsibility of the barangay.";
en["offline.title"] = "Offline Mode";
en["dashboard.title"] = "Report Dashboard"; en["dashboard.description"] = "History of all submitted reports."; en["dashboard.noReports"] = "No reports submitted yet.";
en["dashboard.filterAll"] = "All"; en["dashboard.filterPending"] = "Pending"; en["dashboard.filterInProgress"] = "In Progress"; en["dashboard.filterResolved"] = "Resolved";
en["dashboard.statusPending"] = "Pending"; en["dashboard.statusInProgress"] = "In Progress"; en["dashboard.statusResolved"] = "Resolved";
en["dashboard.markInProgress"] = "Mark as In Progress"; en["dashboard.markResolved"] = "Mark as Resolved";
en["dashboard.delete"] = "Delete"; en["dashboard.clearAll"] = "Clear All"; en["dashboard.search"] = "Search reports...";
en["dashboard.total"] = "Total Reports"; en["dashboard.byCategory"] = "By Category"; en["dashboard.byUrgency"] = "By Urgency";
en["dashboard.high"] = "High"; en["dashboard.medium"] = "Medium"; en["dashboard.low"] = "Low";
en["dashboard.exportCsv"] = "Export as CSV"; en["dashboard.exportJson"] = "Export as JSON";
en["dashboard.exportSuccess"] = "Reports exported!"; en["dashboard.viewDetail"] = "View Details";
en["dashboard.allUrgencies"] = "All Urgencies"; en["dashboard.allStatuses"] = "All Statuses";
en["dashboard.filterUrgency"] = "Urgency"; en["dashboard.filterCategory"] = "Category"; en["dashboard.filterStatus"] = "Status";
en["error.generic"] = "An error occurred while processing your report. Please try again.";
en["error.network"] = "No connection to server. Please try again.";
en["a11y.skipLink"] = "Skip to main content"; en["a11y.themeToggle"] = "Toggle dark mode"; en["a11y.langToggle"] = "Switch language";
en["a11y.copyId"] = "Copy tracking ID"; en["a11y.copied"] = "Copied";
en["auth.signIn"] = "Sign In"; en["auth.signOut"] = "Sign Out"; en["auth.createAccount"] = "Create Account"; en["auth.email"] = "Email address";
en["auth.password"] = "Password"; en["auth.passwordHint"] = "Password must be at least 6 characters";
en["auth.signingIn"] = "Signing in..."; en["auth.creating"] = "Creating account...";
en["auth.noAccount"] = "Don't have an account?"; en["auth.hasAccount"] = "Already have an account?";
en["auth.signUpLink"] = "Sign up"; en["auth.signInLink"] = "Sign in";
en["auth.successMsg"] = "Check your email for the confirmation link! Please also check your spam folder.";
en["auth.demoInfo"] = "Demo: Create an account first, then check your email (or disable email confirmation in Supabase Dashboard).";
en["auth.loginDescription"] = "Manage barangay reports"; en["auth.signupDescription"] = "Create an account to get started";
en["auth.backHome"] = "Return to Home";
en["locale.label"] = "English"; en["locale.auto"] = "Auto-detect";

// Language-specific overrides for non-fil/en
const overrides = {
  ceb: { "nav.home":"Balay", "nav.report":"Pag-Report", "form.submit":"Isumiter ang Report", "locale.label":"Cebuano" },
  ilo: { "nav.home":"Balay", "nav.report":"Ag-Report", "form.submit":"Isumitir ti Report", "locale.label":"Ilocano" },
  hil: { "nav.home":"Balay", "nav.report":"Mag-Report", "form.submit":"Isumiter ang Report", "locale.label":"Hiligaynon" },
  war: { "nav.home":"Balay", "nav.report":"Mag-report", "form.submit":"Isumiter an Report", "locale.label":"Waray" },
  bcl: { "nav.home":"Harong", "nav.report":"Mag-Report", "form.submit":"Isumitir an Report", "locale.label":"Bikol" },
  pam: { "nav.home":"Bale", "nav.report":"Mag-Report", "form.submit":"Isumitir ing Report", "locale.label":"Kapampangan" },
  pag: { "nav.home":"Abong", "nav.report":"Mag-report", "form.submit":"Isumiter so Report", "locale.label":"Pangasinan" },
  mdh: { "nav.home":"Walay", "nav.report":"Mag-report", "form.submit":"Isumitir iyan Report", "locale.label":"Maguindanao" },
  mrw: { "nav.home":"Walay", "nav.report":"Phag-report", "form.submit":"Isumitir iyan Report", "locale.label":"Maranao" },
  tsg: { "nav.home":"B\u00e2y", "nav.report":"Mag-report", "form.submit":"Isumitir in Report", "locale.label":"Tausug" }
};

const allLangs = { fil, en, ceb: {}, ilo: {}, hil: {}, war: {}, bcl: {}, pam: {}, pag: {}, mdh: {}, mrw: {}, tsg: {} };

Object.keys(allLangs).forEach(lang => {
  if (lang === "fil" || lang === "en") return;
  const o = overrides[lang] || {};
  const obj = {};
  keys.forEach(k => { obj[k] = o[k] || fil[k]; });
  allLangs[lang] = obj;
});

const dir = "messages";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

Object.entries(allLangs).forEach(([lang, data]) => {
  const path = dir + "/" + lang + ".json";
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log("Created " + path + " (" + Object.keys(data).length + " keys)");
});

console.log("\nAll 12 message files created successfully!");

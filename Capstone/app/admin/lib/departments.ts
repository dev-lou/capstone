// ── Department Definitions ─────────────────────────────────
// Matches the `office` field in classified reports.
// These are the government agencies that reports get routed to.

export interface Department {
  slug: string;
  name: string;
  shortName: string;
  acronym: string;
  description: string;
  descriptionFil: string;
  color: string; // tailwind color class
  icon: string;  // inline SVG markup
}

export const DEPARTMENTS: Department[] = [
  {
    slug: "bfp",
    name: "Bureau of Fire Protection",
    shortName: "Fire Protection",
    acronym: "BFP",
    description: "Fire incidents, structural hazards, and fire safety violations",
    descriptionFil: "Insidente ng sunog, hazard sa istruktura, at paglabag sa kaligtasan",
    color: "red",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M190.49,99.41a8,8,0,0,0-13.73-5.72c-9.33,9.56-18.61,28.26-31.77,59.9a8,8,0,0,0,14.6,6.56c9.21-20.44,16.57-33.86,23.63-42.74A8,8,0,0,0,190.49,99.41ZM219.11,72A119.07,119.07,0,0,1,191.14,157c-13.7,26.58-31.77,50-53.51,69.32a8,8,0,0,1-10.91,0A151.69,151.69,0,0,1,73.31,180.2C42.09,148.88,24,114.07,24,80.44,24,55.11,31.09,35.76,44.82,24c12.44-10.64,27.78-12.63,39.35-5.07C93.3,24.18,98,33.35,99.09,45.47a20.39,20.39,0,0,0,2.27,7.34A50.82,50.82,0,0,1,99.4,35.29c-2.06-13.59,5.07-26.09,17-29.8a20.37,20.37,0,0,1,13.8.47c19.55,7.08,34,27.05,42.08,58.07A90.78,90.78,0,0,0,160.54,52C149.25,40.6,143.33,26,143.33,10a8,8,0,0,1,16,0c0,9.49,3.43,17.35,10.24,23.5C183,46,192,68.42,192,86.44c0,3.51,0,7-.14,10.49a8,8,0,0,0,14.77-2.2,8.08,8.08,0,0,0,.47-3.35,132.05,132.05,0,0,0,11.9-23.26,8,8,0,1,0-15.16-5.14Z"/></svg>`
  },
  {
    slug: "pnp",
    name: "Philippine National Police",
    shortName: "Public Safety",
    acronym: "PNP",
    description: "Crime, public disorder, theft, and security concerns",
    descriptionFil: "Krimen, kaguluhan, pagnanakaw, at seguridad",
    color: "blue",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,152a8,8,0,0,1-8,8H192v16a40,40,0,0,1-40,40H152v16a8,8,0,0,1-16,0V216H104a40,40,0,0,1-40-40V160H40a8,8,0,0,1,0-16H64V112a95.24,95.24,0,0,1,12.06-37.68,137.28,137.28,0,0,1-20.52-6.63,8,8,0,0,1,6.13-14.78C84.1,59.32,108.21,64,128,64s43.9-4.68,66.33-11.09a8,8,0,0,1,6.13,14.78,137.28,137.28,0,0,1-20.52,6.63A95.24,95.24,0,0,1,192,112v32h24A8,8,0,0,1,224,152ZM80,152v16a24,24,0,0,0,24,24h48a24,24,0,0,0,24-24V152Z"/></svg>`
  },
  {
    slug: "dpwh",
    name: "Department of Public Works and Highways",
    shortName: "Infrastructure",
    acronym: "DPWH",
    description: "Road damage, infrastructure issues, drainage problems",
    descriptionFil: "Sirang kalsada, imprastraktura, at problema sa drainage",
    color: "yellow",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M248,208H224V40a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8V208H8a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16ZM56,80V64h32V80Zm48,0V64h32V80Zm0,48V112h32v16ZM56,128V112h32v16Zm96-48V64h32V80Zm32,16v16H152V112ZM72,208V176h40v32Zm72,0V176h40v32Z"/></svg>`
  },
  {
    slug: "barangay",
    name: "Barangay Hall",
    shortName: "Barangay",
    acronym: "BRGY",
    description: "Local concerns, noise complaints, stray animals, neighborhood issues",
    descriptionFil: "Alegasyon sa barangay, ingay, ligaw na hayop, at kapitbahay",
    color: "green",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M240,208H216V120h16a8,8,0,0,0,4.25-14.78l-96-64a8,8,0,0,0-8.5,0l-96,64A8,8,0,0,0,40,120H56v88H32a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16Zm-40,0H128V152h72ZM112,208H72V120h40ZM128,75l75.42,50.28L155.85,152H116.15L68.58,125.28ZM184,96a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"/></svg>`
  },
  {
    slug: "denr",
    name: "Department of Environment and Natural Resources",
    shortName: "Environment",
    acronym: "DENR",
    description: "Environmental violations, illegal logging, waste management",
    descriptionFil: "Paglabag sa kalikasan, iligal na pagputol ng puno, basura",
    color: "emerald",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M198.13,183.29A72,72,0,0,0,185.21,56.18,80,80,0,0,0,32,88a79.26,79.26,0,0,0,25,57.87,8,8,0,0,0,4.31,13.65C81.07,161.91,104,175.55,120,191.06V224a8,8,0,0,0,16,0V191.06c16-15.51,38.93-29.15,58.65-31.54a8,8,0,0,0,4.31-13.65A72.11,72.11,0,0,0,198.13,183.29ZM128,128.54c-16.07,15-37.53,27.5-56,34.66a67.86,67.86,0,0,1-9.06-35.72,64,64,0,0,1,122.23-24.08q.42.95.83,1.93A64.44,64.44,0,0,1,184,128c0,12.33-3.24,23.83-8.08,34.71C165.51,156,144.07,143.56,128,128.54Z"/></svg>`
  },
  {
    slug: "doh",
    name: "Department of Health",
    shortName: "Health",
    acronym: "DOH",
    description: "Health concerns, disease outbreaks, medical emergencies",
    descriptionFil: "Usaping pangkalusugan, pagkalat ng sakit, medikal na emergency",
    color: "teal",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM160,88v16h16a8,8,0,0,1,0,16H160v16a8,8,0,0,1-16,0V120H128a8,8,0,0,1,0-16h16V88a8,8,0,0,1,16,0Z"/></svg>`
  },
  {
    slug: "other",
    name: "Other Agencies",
    shortName: "Other",
    acronym: "OTHER",
    description: "Reports routed to other government agencies",
    descriptionFil: "Mga ulat na irinuta sa ibang ahensya ng gobyerno",
    color: "slate",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,40V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V40A16,16,0,0,1,56,24H88a8,8,0,0,1,8-8h64a8,8,0,0,1,8,8h32A16,16,0,0,1,216,40ZM184,40H168a8,8,0,0,1-8-8H96a8,8,0,0,1-8,8H72V216H184ZM88,112a8,8,0,0,0,16,0,8,8,0,0,1,8-8h32a8,8,0,0,1,8,8,8,8,0,0,0,16,0,24,24,0,0,0-24-24H112A24,24,0,0,0,88,112Zm80,72a8,8,0,0,0-8-8H96a8,8,0,0,0,0,16h64A8,8,0,0,0,168,184Zm0-32a8,8,0,0,0-8-8H96a8,8,0,0,0,0,16h64A8,8,0,0,0,168,152Z"/></svg>`
  },
];

export function getDepartmentByOffice(office: string): Department | undefined {
  const lower = office.toLowerCase();
  if (lower.includes("bfp") || lower.includes("fire")) return DEPARTMENTS[0];
  if (lower.includes("pnp") || lower.includes("police")) return DEPARTMENTS[1];
  if (lower.includes("dpwh") || lower.includes("public works") || lower.includes("infrastructure")) return DEPARTMENTS[2];
  if (lower.includes("barangay")) return DEPARTMENTS[3];
  if (lower.includes("denr") || lower.includes("environment")) return DEPARTMENTS[4];
  if (lower.includes("doh") || lower.includes("health")) return DEPARTMENTS[5];
  return DEPARTMENTS[6]; // other
}

export function getDepartmentBySlug(slug: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.slug === slug);
}

export function getDepartmentSlug(office: string): string {
  return getDepartmentByOffice(office)?.slug ?? "other";
}

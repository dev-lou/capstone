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
  icon: string;  // emoji icon
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
    icon: "🔥",
  },
  {
    slug: "pnp",
    name: "Philippine National Police",
    shortName: "Public Safety",
    acronym: "PNP",
    description: "Crime, public disorder, theft, and security concerns",
    descriptionFil: "Krimen, kaguluhan, pagnanakaw, at seguridad",
    color: "blue",
    icon: "👮",
  },
  {
    slug: "dpwh",
    name: "Department of Public Works and Highways",
    shortName: "Infrastructure",
    acronym: "DPWH",
    description: "Road damage, infrastructure issues, drainage problems",
    descriptionFil: "Sirang kalsada, imprastraktura, at problema sa drainage",
    color: "yellow",
    icon: "🏗️",
  },
  {
    slug: "barangay",
    name: "Barangay Hall",
    shortName: "Barangay",
    acronym: "BRGY",
    description: "Local concerns, noise complaints, stray animals, neighborhood issues",
    descriptionFil: "Alegasyon sa barangay, ingay, ligaw na hayop, at kapitbahay",
    color: "green",
    icon: "🏛️",
  },
  {
    slug: "denr",
    name: "Department of Environment and Natural Resources",
    shortName: "Environment",
    acronym: "DENR",
    description: "Environmental violations, illegal logging, waste management",
    descriptionFil: "Paglabag sa kalikasan, iligal na pagputol ng puno, basura",
    color: "emerald",
    icon: "🌳",
  },
  {
    slug: "doh",
    name: "Department of Health",
    shortName: "Health",
    acronym: "DOH",
    description: "Health concerns, disease outbreaks, medical emergencies",
    descriptionFil: "Usaping pangkalusugan, pagkalat ng sakit, medikal na emergency",
    color: "teal",
    icon: "🏥",
  },
  {
    slug: "other",
    name: "Other Agencies",
    shortName: "Other",
    acronym: "OTHER",
    description: "Reports routed to other government agencies",
    descriptionFil: "Mga ulat na irinuta sa ibang ahensya ng gobyerno",
    color: "slate",
    icon: "📋",
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

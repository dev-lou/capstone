// ────────────────────────────────────────────────────────────
// PSGC — Philippine Standard Geographic Codes (simplified)
// All 17 regions + major provinces for location dropdowns
// Source: PSA (Philippine Statistics Authority)
// ────────────────────────────────────────────────────────────

export interface Region {
  code: string;
  name: string;
}

export interface Province {
  code: string;
  regionCode: string;
  name: string;
}

export interface City {
  code: string;
  provinceCode: string;
  name: string;
}

export const REGIONS: Region[] = [
  { code: "01", name: "NCR — National Capital Region" },
  { code: "02", name: "CAR — Cordillera Administrative Region" },
  { code: "03", name: "Region I — Ilocos Region" },
  { code: "04", name: "Region II — Cagayan Valley" },
  { code: "05", name: "Region III — Central Luzon" },
  { code: "06", name: "Region IV-A — CALABARZON" },
  { code: "07", name: "Region IV-B — MIMAROPA" },
  { code: "08", name: "Region V — Bicol Region" },
  { code: "09", name: "Region VI — Western Visayas" },
  { code: "10", name: "Region VII — Central Visayas" },
  { code: "11", name: "Region VIII — Eastern Visayas" },
  { code: "12", name: "Region IX — Zamboanga Peninsula" },
  { code: "13", name: "Region X — Northern Mindanao" },
  { code: "14", name: "Region XI — Davao Region" },
  { code: "15", name: "Region XII — SOCCSKSARGEN" },
  { code: "16", name: "Region XIII — Caraga" },
  { code: "17", name: "BARMM — Bangsamoro Autonomous Region" },
];

export const PROVINCES: Province[] = [
  // NCR
  { code: "01", regionCode: "01", name: "Metro Manila (National Capital Region)" },
  // CAR
  { code: "02", regionCode: "02", name: "Abra" },
  { code: "03", regionCode: "02", name: "Apayao" },
  { code: "04", regionCode: "02", name: "Benguet" },
  { code: "05", regionCode: "02", name: "Ifugao" },
  { code: "06", regionCode: "02", name: "Kalinga" },
  { code: "07", regionCode: "02", name: "Mountain Province" },
  // Region I
  { code: "08", regionCode: "03", name: "Ilocos Norte" },
  { code: "09", regionCode: "03", name: "Ilocos Sur" },
  { code: "10", regionCode: "03", name: "La Union" },
  { code: "11", regionCode: "03", name: "Pangasinan" },
  // Region II
  { code: "12", regionCode: "04", name: "Batanes" },
  { code: "13", regionCode: "04", name: "Cagayan" },
  { code: "14", regionCode: "04", name: "Isabela" },
  { code: "15", regionCode: "04", name: "Nueva Vizcaya" },
  { code: "16", regionCode: "04", name: "Quirino" },
  // Region III
  { code: "17", regionCode: "05", name: "Aurora" },
  { code: "18", regionCode: "05", name: "Bataan" },
  { code: "19", regionCode: "05", name: "Bulacan" },
  { code: "20", regionCode: "05", name: "Nueva Ecija" },
  { code: "21", regionCode: "05", name: "Pampanga" },
  { code: "22", regionCode: "05", name: "Tarlac" },
  { code: "23", regionCode: "05", name: "Zambales" },
  // CALABARZON
  { code: "24", regionCode: "06", name: "Batangas" },
  { code: "25", regionCode: "06", name: "Cavite" },
  { code: "26", regionCode: "06", name: "Laguna" },
  { code: "27", regionCode: "06", name: "Quezon" },
  { code: "28", regionCode: "06", name: "Rizal" },
  // MIMAROPA
  { code: "29", regionCode: "07", name: "Marinduque" },
  { code: "30", regionCode: "07", name: "Occidental Mindoro" },
  { code: "31", regionCode: "07", name: "Oriental Mindoro" },
  { code: "32", regionCode: "07", name: "Palawan" },
  { code: "33", regionCode: "07", name: "Romblon" },
  // Region V
  { code: "34", regionCode: "08", name: "Albay" },
  { code: "35", regionCode: "08", name: "Camarines Norte" },
  { code: "36", regionCode: "08", name: "Camarines Sur" },
  { code: "37", regionCode: "08", name: "Catanduanes" },
  { code: "38", regionCode: "08", name: "Masbate" },
  { code: "39", regionCode: "08", name: "Sorsogon" },
  // Region VI
  { code: "40", regionCode: "09", name: "Aklan" },
  { code: "41", regionCode: "09", name: "Antique" },
  { code: "42", regionCode: "09", name: "Capiz" },
  { code: "43", regionCode: "09", name: "Guimaras" },
  { code: "44", regionCode: "09", name: "Iloilo" },
  { code: "45", regionCode: "09", name: "Negros Occidental" },
  // Region VII
  { code: "46", regionCode: "10", name: "Bohol" },
  { code: "47", regionCode: "10", name: "Cebu" },
  { code: "48", regionCode: "10", name: "Negros Oriental" },
  { code: "49", regionCode: "10", name: "Siquijor" },
  // Region VIII
  { code: "50", regionCode: "11", name: "Biliran" },
  { code: "51", regionCode: "11", name: "Eastern Samar" },
  { code: "52", regionCode: "11", name: "Leyte" },
  { code: "53", regionCode: "11", name: "Northern Samar" },
  { code: "54", regionCode: "11", name: "Samar" },
  { code: "55", regionCode: "11", name: "Southern Leyte" },
  // Region IX
  { code: "56", regionCode: "12", name: "Zamboanga del Norte" },
  { code: "57", regionCode: "12", name: "Zamboanga del Sur" },
  { code: "58", regionCode: "12", name: "Zamboanga Sibugay" },
  // Region X
  { code: "59", regionCode: "13", name: "Bukidnon" },
  { code: "60", regionCode: "13", name: "Camiguin" },
  { code: "61", regionCode: "13", name: "Lanao del Norte" },
  { code: "62", regionCode: "13", name: "Misamis Occidental" },
  { code: "63", regionCode: "13", name: "Misamis Oriental" },
  // Region XI
  { code: "64", regionCode: "14", name: "Davao de Oro" },
  { code: "65", regionCode: "14", name: "Davao del Norte" },
  { code: "66", regionCode: "14", name: "Davao del Sur" },
  { code: "67", regionCode: "14", name: "Davao Occidental" },
  { code: "68", regionCode: "14", name: "Davao Oriental" },
  // Region XII
  { code: "69", regionCode: "15", name: "Cotabato" },
  { code: "70", regionCode: "15", name: "Sarangani" },
  { code: "71", regionCode: "15", name: "South Cotabato" },
  { code: "72", regionCode: "15", name: "Sultan Kudarat" },
  // Region XIII
  { code: "73", regionCode: "16", name: "Agusan del Norte" },
  { code: "74", regionCode: "16", name: "Agusan del Sur" },
  { code: "75", regionCode: "16", name: "Dinagat Islands" },
  { code: "76", regionCode: "16", name: "Surigao del Norte" },
  { code: "77", regionCode: "16", name: "Surigao del Sur" },
  // BARMM
  { code: "78", regionCode: "17", name: "Basilan" },
  { code: "79", regionCode: "17", name: "Lanao del Sur" },
  { code: "80", regionCode: "17", name: "Maguindanao" },
  { code: "81", regionCode: "17", name: "Sulu" },
  { code: "82", regionCode: "17", name: "Tawi-Tawi" },
];

export function getProvincesByRegion(regionCode: string): Province[] {
  return PROVINCES.filter((p) => p.regionCode === regionCode);
}

export function getRegionByCode(code: string): Region | undefined {
  return REGIONS.find((r) => r.code === code);
}

export function getProvinceByCode(code: string): Province | undefined {
  return PROVINCES.find((p) => p.code === code);
}

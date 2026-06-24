// ────────────────────────────────────────────────────────────
// Agency Logos — SVG wordmarks & seals for PH government depts
// Usage: <DILGLogo className="w-10 h-10" />
// ────────────────────────────────────────────────────────────

type LogoProps = { className?: string };

// ── DILG — Department of the Interior and Local Government ──
// Shield with tricolor bar (blue/red/gold) + 3 stars
export function DILGLogo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className} aria-label="DILG">
      {/* Shield body */}
      <path d="M20 2L6 10v10c0 8.84 6.27 16.34 14 18 7.73-1.66 14-9.16 14-18V10L20 2z" fill="#1a365d" />
      {/* Philippine flag colors bar */}
      <rect x="10" y="12" width="20" height="4" rx="1" fill="#0038a8" />
      <rect x="10" y="17" width="20" height="4" rx="1" fill="#ce1126" />
      <rect x="10" y="22" width="20" height="4" rx="1" fill="#fcd116" />
      {/* Three stars */}
      <circle cx="20" cy="10" r="1.5" fill="#fcd116" />
      <circle cx="13" cy="30" r="1.5" fill="#fcd116" />
      <circle cx="27" cy="30" r="1.5" fill="#fcd116" />
      {/* Sun */}
      <circle cx="20" cy="24" r="2.5" fill="#fcd116" opacity="0.9" />
      <path d="M20 20v8M16 22l8 4M16 26l8-4" stroke="#fcd116" strokeWidth="0.5" opacity="0.6" />
      {/* DILG text */}
      <text x="20" y="36" textAnchor="middle" fill="white" fontSize="4" fontWeight="900" fontFamily="sans-serif">DILG</text>
    </svg>
  );
}

// ── DICT — Department of Information and Communications Technology ──
// Globe with digital grid lines
export function DICTLogo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className} aria-label="DICT">
      {/* Globe */}
      <circle cx="20" cy="20" r="14" fill="#0f4b8a" stroke="#1a6bc4" strokeWidth="1.5" />
      <ellipse cx="20" cy="20" rx="8" ry="14" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.6" />
      <path d="M6 20h28M20 6v28" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4" />
      {/* Digital grid dots */}
      <circle cx="20" cy="14" r="1.5" fill="#60a5fa" />
      <circle cx="20" cy="26" r="1.5" fill="#60a5fa" />
      <circle cx="14" cy="20" r="1.5" fill="#60a5fa" />
      <circle cx="26" cy="20" r="1.5" fill="#60a5fa" />
      <circle cx="14" cy="14" r="1" fill="#60a5fa" opacity="0.6" />
      <circle cx="26" cy="14" r="1" fill="#60a5fa" opacity="0.6" />
      <circle cx="14" cy="26" r="1" fill="#60a5fa" opacity="0.6" />
      <circle cx="26" cy="26" r="1" fill="#60a5fa" opacity="0.6" />
      {/* Orbit ring */}
      <ellipse cx="20" cy="20" rx="12" ry="4" fill="none" stroke="#93c5fd" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  );
}

// ── NDRRMC — National Disaster Risk Reduction and Management Council ──
// Alert/triangle emblem
export function NDRRMCLogo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className} aria-label="NDRRMC">
      {/* Outer circle */}
      <circle cx="20" cy="20" r="16" fill="#991b1b" stroke="#dc2626" strokeWidth="1.5" />
      {/* Warning triangle */}
      <polygon points="20,8 30,30 10,30" fill="none" stroke="#fcd34d" strokeWidth="1.5" />
      {/* Exclamation */}
      <rect x="19" y="16" width="2" height="8" rx="1" fill="#fcd34d" />
      <circle cx="20" cy="27" r="1.5" fill="#fcd34d" />
      {/* Inner ring */}
      <circle cx="20" cy="20" r="10" fill="none" stroke="#fca5a5" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

// ── DPWH — Department of Public Works and Highways ──
// Gear + road bridge symbol
export function DPWHLogo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className} aria-label="DPWH">
      <circle cx="20" cy="20" r="15" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Gear */}
      <circle cx="20" cy="20" r="6" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="3" fill="#93c5fd" />
      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="19"
          y="11"
          width="2"
          height="3"
          rx="0.5"
          fill="#93c5fd"
          transform={`rotate(${angle} 20 20)`}
        />
      ))}
      {/* Road/bridge line */}
      <line x1="12" y1="30" x2="28" y2="30" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="30" x2="14" y2="34" stroke="#60a5fa" strokeWidth="0.8" />
      <line x1="26" y1="30" x2="26" y2="34" stroke="#60a5fa" strokeWidth="0.8" />
    </svg>
  );
}

// ── BFP — Bureau of Fire Protection ──
// Shield with flame
export function BFPLogo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className} aria-label="BFP">
      <path d="M20 3L7 12v8c0 7.73 5.73 14.33 13 16 7.27-1.67 13-8.27 13-16v-8L20 3z" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
      {/* Flame */}
      <path d="M20 12c-2 4-4 6-4 9 0 2.21 1.79 4 4 4s4-1.79 4-4c0-3-2-5-4-9z" fill="#f97316" />
      <path d="M20 15c-1 2-2 3-2 5 0 1.1.9 2 2 2s2-.9 2-2c0-2-1-3-2-5z" fill="#fcd34d" />
      {/* Cross */}
      <line x1="20" y1="28" x2="20" y2="31" stroke="#fca5a5" strokeWidth="1" />
      <line x1="18.5" y1="29.5" x2="21.5" y2="29.5" stroke="#fca5a5" strokeWidth="1" />
    </svg>
  );
}

// ── PNP — Philippine National Police ──
// Badge/shield with stars
export function PNPLogo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className} aria-label="PNP">
      {/* Badge shape */}
      <path d="M20 2l8 6v6l4 2v6l-12 12L8 22v-6l4-2V8l8-6z" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.2" />
      {/* Badge inner */}
      <path d="M20 6l6 4.5v4.5l3 1.5v4.5L20 27l-9-6v-4.5l3-1.5V10.5L20 6z" fill="#1e4976" />
      {/* Shield */}
      <path d="M20 12l-3 3v5l3 3 3-3v-5l-3-3z" fill="none" stroke="#93c5fd" strokeWidth="0.8" />
      <circle cx="20" cy="17" r="2" fill="#93c5fd" opacity="0.8" />
      {/* Three stars */}
      <circle cx="14" cy="23" r="1" fill="#fcd34d" />
      <circle cx="20" cy="24" r="1" fill="#fcd34d" />
      <circle cx="26" cy="23" r="1" fill="#fcd34d" />
    </svg>
  );
}

// ── MERALCO — Manila Electric Company ──
// Lightning bolt in circle (iconic logo)
export function MERALCOLogo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className} aria-label="MERALCO">
      <circle cx="20" cy="20" r="16" fill="#1a3a5c" stroke="#fbbf24" strokeWidth="1.5" />
      {/* Lightning bolt */}
      <polygon points="22,8 14,22 19,22 17,32 27,18 21,18 23,8" fill="#fbbf24" />
      {/* Inner glow ring */}
      <circle cx="20" cy="20" r="12" fill="none" stroke="#fcd34d" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

// ── RA 10173 — Data Privacy Act ──
// Shield with lock
export function DataPrivacyLogo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className} aria-label="Data Privacy Act">
      <circle cx="20" cy="20" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
      {/* Shield */}
      <path d="M20 10l-6 3.5v5.5c0 4.42 2.69 8.17 6 9.5 3.31-1.33 6-5.08 6-9.5v-5.5L20 10z" fill="#065f46" stroke="#34d399" strokeWidth="0.8" />
      {/* Lock */}
      <rect x="17" y="18" width="6" height="5" rx="1" fill="#34d399" />
      <path d="M17 18v-2a3 3 0 016 0v2" stroke="#34d399" strokeWidth="1" fill="none" />
      <circle cx="20" cy="21" r="1" fill="#064e3b" />
      <line x1="20" y1="21" x2="20" y2="23" stroke="#064e3b" strokeWidth="0.8" />
    </svg>
  );
}

// ── DILG-LGU Routing Badge ──
// Small combined badge for routing display
export function RoutingBadge({ className = "w-5 h-5" }: LogoProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
      <path d="M10 4l-3 3v4l3 3 3-3V7l-3-3z" fill="none" stroke="#93c5fd" strokeWidth="0.8" />
      <circle cx="10" cy="9" r="1.5" fill="#fcd34d" />
    </svg>
  );
}

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // ── Typography ─────────────────────────────────────────────
      fontFamily: {
        sans: [
          "var(--font-outfit)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "var(--font-space)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },

      // ── Philippine Brand Colors ────────────────────────────────
      colors: {
        ph: {
          navy: {
            DEFAULT: "#0C1F3E",
            light: "#162D58",
            pale: "#EEF1F7",
          },
          gold: {
            DEFAULT: "#C8911E",
            light: "#F5D99A",
            pale: "#FEF8EC",
          },
          red: {
            DEFAULT: "#B8192D",
            pale: "#FDEAEA",
          },
          ocean: {
            DEFAULT: "#0D5C6E",
            pale: "#EAF4F6",
          },
        },
      },

      // ── Spacing Extensions ─────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // ── Border Radii ───────────────────────────────────────────
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      // ── Box Shadows ────────────────────────────────────────────
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        card: "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
        elevated:
          "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
        focus: "0 0 0 3px rgb(200 145 30 / 0.35)",
      },

      // ── Keyframes ──────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400% 0" },
          "100%": { backgroundPosition: "400% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      // ── Animation Utilities ────────────────────────────────────
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.35s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

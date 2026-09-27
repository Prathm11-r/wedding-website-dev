import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── EverAfter Brand Colours ─────────────────────────────────────────
      colors: {
        primary: {
          DEFAULT: "#C9A96E", // warm gold
          dark: "#A07840",    // deeper gold for hover / active states
          light: "#E2CAAA",   // tinted gold for backgrounds
          champagne: "#F4EBD9",
          foil: "#DFB76C",
          deep: "#7A5C28",    // accessible contrast gold (7.1:1)
        },
        neutral: {
          dark: "#1C1C1C",    // near-black for headings / body text
          mid: "#6B6B6B",     // secondary text, placeholders
          light: "#F7F4F0",   // page background, cards
          surface: "#FBF9F5", // warm paper ivory
        },
        accent: {
          DEFAULT: "#E8D5C4", // blush / rose tone for decorative elements
          dark: "#C9A898",    // deeper blush
        },
        // Semantic aliases used throughout components
        background: "#F7F4F0",
        foreground: "#1C1C1C",
        border: "#E4DEDA",
        ring: "#C9A96E",
      },

      // ─── Typography ──────────────────────────────────────────────────────
      fontFamily: {
        display: ["var(--font-playfair)", ...fontFamily.serif],
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl":  ["3.75rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-lg":  ["3rem",   { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
        "display-md":  ["2.25rem", { lineHeight: "1.25" }],
        "display-sm":  ["1.875rem", { lineHeight: "1.3" }],
      },

      // ─── Border Radius ───────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ─── Shadows ─────────────────────────────────────────────────────────
      boxShadow: {
        "soft-sm": "0 1px 3px rgba(28, 28, 28, 0.06), 0 1px 2px rgba(28, 28, 28, 0.04)",
        "soft-md": "0 4px 12px rgba(28, 28, 28, 0.08), 0 2px 4px rgba(28, 28, 28, 0.04)",
        "soft-lg": "0 10px 30px rgba(28, 28, 28, 0.10), 0 4px 8px rgba(28, 28, 28, 0.04)",
        "soft-xl": "0 20px 50px rgba(28, 28, 28, 0.12), 0 8px 16px rgba(28, 28, 28, 0.06)",
        "glow-primary": "0 0 25px rgba(201, 169, 110, 0.40)",
        "glow-gold": "0 0 35px rgba(218, 183, 110, 0.5)",
        "3d-card": "0 20px 40px -15px rgba(28, 28, 28, 0.08), 0 0 0 1px rgba(28, 28, 28, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
        "3d-floating": "0 30px 60px -12px rgba(160, 120, 64, 0.22), 0 18px 36px -18px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.95)",
        "wax-seal": "0 8px 16px -2px rgba(160, 120, 64, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.25)",
      },

      // ─── Spacing ─────────────────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "128": "32rem",
        "144": "36rem",
      },

      // ─── Animation ───────────────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(0.6deg)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(10px) rotate(-0.6deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
      },
      animation: {
        "fade-in":        "fade-in 0.4s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        shimmer:          "shimmer 2.5s linear infinite",
        "float-slow":     "float-slow 6s ease-in-out infinite",
        "float-reverse":  "float-reverse 7s ease-in-out infinite",
        "pulse-glow":     "pulse-glow 5s ease-in-out infinite",
      },

      // ─── Typography plugin customisation ─────────────────────────────────
      typography: (theme: (path: string) => string) => ({
        everafter: {
          css: {
            "--tw-prose-body":        theme("colors.neutral.dark"),
            "--tw-prose-headings":    theme("colors.neutral.dark"),
            "--tw-prose-links":       theme("colors.primary.DEFAULT"),
            "--tw-prose-bold":        theme("colors.neutral.dark"),
            "--tw-prose-counters":    theme("colors.primary.DEFAULT"),
            "--tw-prose-bullets":     theme("colors.primary.DEFAULT"),
            "--tw-prose-quotes":      theme("colors.neutral.mid"),
            "--tw-prose-quote-borders": theme("colors.primary.DEFAULT"),
            fontFamily:               theme("fontFamily.sans"),
            h1: { fontFamily: theme("fontFamily.display") },
            h2: { fontFamily: theme("fontFamily.display") },
            h3: { fontFamily: theme("fontFamily.display") },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;

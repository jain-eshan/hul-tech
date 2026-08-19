import type { Config } from "tailwindcss";

// Tokens are the single source of truth for colour. PRD §11.1.
// Verdict colours are sacred: green/amber/red appear only on verdicts, never decoratively.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAF9",
        surface: "#FFFFFF",
        border: "#E7E5E4",
        text: "#1C1917",
        muted: "#78716C",
        verdict: { green: "#15803D", amber: "#B45309", red: "#B91C1C" },
        vbg: { green: "#F0FDF4", amber: "#FFFBEB", red: "#FEF2F2" },
        accent: { DEFAULT: "#1E3A8A", soft: "#EFF6FF" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: { DEFAULT: "8px" },
      transitionDuration: { DEFAULT: "180ms" },
    },
  },
  plugins: [],
};
export default config;

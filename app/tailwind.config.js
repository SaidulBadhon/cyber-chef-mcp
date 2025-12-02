/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        foreground: "#e2e8f0",
        accent: {
          DEFAULT: "#22c55e",
          soft: "rgba(34, 197, 94, 0.2)",
          glow: "rgba(34, 197, 94, 0.4)",
        },
        muted: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8",
        },
        card: {
          DEFAULT: "#0f172a",
          foreground: "#e2e8f0",
        },
        border: "#1e293b",
        input: "#1e293b",
        ring: "#22c55e",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(34, 197, 94, 0.3)",
        "glow-sm": "0 0 10px rgba(34, 197, 94, 0.2)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        pulse: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neon green hacker theme
        neon: {
          50: "#f0fff4",
          100: "#c6f6d5",
          200: "#9ae6b4",
          300: "#68d391",
          400: "#48bb78",
          500: "#39ff14", // Primary neon green
          600: "#25c00a",
          700: "#1a9606",
          800: "#156b05",
          900: "#0a4203",
        },
        terminal: {
          bg: "#0a0a0a",
          surface: "#121212",
          border: "#1e1e1e",
          muted: "#2a2a2a",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 15px #39ff14",
          },
          "50%": {
            boxShadow: "0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 30px #39ff14",
          },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      boxShadow: {
        neon: "0 0 5px #39ff14, 0 0 10px #39ff14",
        "neon-lg": "0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 30px #39ff14",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};


// tailwind.config.mjs
import { join } from "path";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["src/**/*.{js,jsx,ts,tsx}", "components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7c3aed", // purple
          light: "#a78bfa",
          dark: "#5b21b6",
        },
        accent: {
          DEFAULT: "#a21caf", // fuchsia
          light: "#f0abfc",
          dark: "#701a75",
        },
        indigo: {
          DEFAULT: "#312e81",
          light: "#818cf8",
          dark: "#1e1b4b",
        },
        bgMain: "#fff",
        bgGradient: "#f5f3ff",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "1.5rem",
      },
      container: {
        center: true,
        padding: "1.5rem",
      },
      boxShadow: {
        card: "0 8px 32px 0 rgba(60, 0, 120, 0.12)",
      },
    },
  },
  plugins: [],
};

module.exports = config;

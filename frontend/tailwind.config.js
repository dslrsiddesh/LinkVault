/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 1. Base: The "Slate" Foundation
        background: "#f8fafc", // Slate-50
        surface: "#ffffff", // White
        surfaceHighlight: "#f1f5f9", // Slate-100
        border: "#cbd5e1", // Slate-300

        // 2. Color 1: Deep Indigo (Grand, Royal)
        primary: {
          DEFAULT: "#4f46e5", // Indigo-600
          hover: "#4338ca", // Indigo-700
          light: "#e0e7ff", // Indigo-100
        },

        // 3. Color 2: Soft Rose (Distinct, but doesn't clash)
        accent: {
          DEFAULT: "#e11d48", // Rose-600
          hover: "#be123c", // Rose-700
          light: "#ffe4e6", // Rose-100
        },

        // Typography
        text: {
          main: "#0f172a", // Slate-900 (Deepest Navy/Black)
          muted: "#64748b", // Slate-500
        },
      },
      boxShadow: {
        grand:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
        "grand-hover": "0 25px 50px -12px rgba(79, 70, 229, 0.25)", // Glowy Indigo shadow
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

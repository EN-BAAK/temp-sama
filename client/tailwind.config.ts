import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      gridTemplateColumns: {
        "5": "repeat(5, minmax(0, 1fr))",
        "6": "repeat(6, minmax(0, 1fr))",
      },

      colors: {
        primary: "#4338CA",
        accent: "#6366F1",
        second: "#0F172A",

        background: "#F8FAFC",
        background2: "#F1F5F9",

        card: "#ffffff",
        reversed: "#ffffff",

        text: "#1E293B",
        muted: "#262626",

        border: "#D8E1EB",

        success: "#16A34A",
        danger: "#DC2626",
        warning: "#F59E0B",
        info: "#0284C7",
      },

      fontFamily: {
        sans: [
          "var(--font-cairo)",
          "sans-serif",
        ],

        heading: [
          "var(--font-ibm-plex-arabic)",
          "sans-serif",
        ],
      },
    },
  },

  darkMode: "class",
}

export default config
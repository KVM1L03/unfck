/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#000000",
          surface: "#0A0A0A",
          card: "#111111",
          border: "#1C1C1C",
          muted: "#3A3A3A",
          subtle: "#6B6B6B",
          accent: "#39D98A",
          "accent-dim": "#1A5C3A",
          white: "#FFFFFF",
          "off-white": "#E8E8E8",
          "text-secondary": "#A0A0A0",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      fontFamily: {
        sans: ["SF Pro Display", "Inter", "System"],
        rounded: ["SF Pro Rounded", "System"],
      },
    },
  },
  plugins: [],
};

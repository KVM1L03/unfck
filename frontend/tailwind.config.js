/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ── Original brand palette ───────────────────────────────────────
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

        // ── OmniCoach design tokens (extracted from OmniCoach Dashboard.dc.html) ─
        oc: {
          // Backgrounds — layered depth system
          void:    "#050506", // body / deepest background
          deep:    "#0e0e10", // bottom sheet / modal surface
          card:    "#141416", // data cards (Body Battery, HR, Sleep, Protein)
          surface: "#1a1a1c", // AI Report card, pillars group (rgba 26,26,28)
          bubble:  "#262628", // AI chat bubbles

          // Frame / bezel (device chrome reference — not used in app UI)
          bezel:   "#1b1b1e",
          rim:     "#2c2c2f",

          // Apple system accent palette — exact values from the design
          green:   "#30D158", // strength, success, live dot, today tab
          "green-alt": "#34C759", // gradient pair for green progress bars
          blue:    "#32ADE6", // LISS, log tab, quick actions
          aqua:    "#5AC8FA", // "last used" labels
          indigo:  "#5E5CE6", // coach tab, send button, sheet CTA
          purple:  "#7D7AFF", // sleep icon, suggestion pills
          "purple-light": "#B7B5FF", // pill chip text
          teal:    "#64D2FF", // VO₂ max chart, balance pillar
          orange:  "#FF9F0A", // HIIT, protein, insights tab
          "orange-alt": "#FFB340", // gradient pair for orange bars
          red:     "#FF453A", // resting heart rate
          ios:     "#0A84FF", // own (user) chat bubbles

          // Text — Apple label hierarchy (base is rgba(235,235,245,x))
          label:   "#EBEBF5", // base label color before opacity
          "text-on-green": "#04210d", // dark text on #30D158 CTA buttons
        },
      },

      borderRadius: {
        // Original custom radii
        "4xl": "2rem",
        "5xl": "2.5rem",

        // OmniCoach card-specific radii (exact pixel values from the design)
        "oc-hero":   "28px", // AI Report hero card
        "oc-score":  "26px", // Blueprint Score card (Insights)
        "oc-panel":  "22px", // Pillars group, device data cards
        "oc-action": "20px", // Activity type rows, stepper buttons
        "oc-sheet":  "30px", // Bottom sheet top corners
        "oc-chip":   "14px", // Driver mini-pills, quick-action chips
        "oc-badge":  "11px", // Small status badges, last-used label
        "oc-icon":   "10px", // Icon container squares (32×32)
        "oc-dot":    "9px",  // Live indicator dot
      },

      fontFamily: {
        sans: ["SF Pro Display", "Inter", "System"],
        rounded: ["SF Pro Rounded", "System"],
      },
    },
  },
  plugins: [],
};

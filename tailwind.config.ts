import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bg: "#0A0A0B",
      surface: "#141416",
      "surface-hover": "#1B1B1E",
      border: "rgba(255,255,255,.08)",
      "border-strong": "rgba(255,255,255,.16)",
      accent: "#22D3EE",
      "accent-dim": "rgba(34,211,238,.15)",
      "accent-soft": "rgba(34,211,238,.4)",
      white: "#FFFFFF",
      black: "#000000",
      text: {
        primary: "#F5F5F7",
        secondary: "#A1A1AA",
        tertiary: "#6B6B70",
      },
      success: "#34D399",
      error: "#FB7185",
    },
    fontFamily: {
      display: ["var(--font-display)", "sans-serif"],
      sans: ["var(--font-sans)", "sans-serif"],
      mono: ["var(--font-mono)", "monospace"],
    },
    extend: {
      fontSize: {
        hero: ["clamp(3.5rem, 9vw, 9rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "h2": ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "h3": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      maxWidth: {
        content: "1400px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-10%)" },
          "20%": { transform: "translate(-15%,5%)" },
          "30%": { transform: "translate(7%,-25%)" },
          "40%": { transform: "translate(-5%,25%)" },
          "50%": { transform: "translate(-15%,10%)" },
          "60%": { transform: "translate(15%,0%)" },
          "70%": { transform: "translate(0%,15%)" },
          "80%": { transform: "translate(3%,35%)" },
          "90%": { transform: "translate(-10%,10%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 40s linear infinite",
        grain: "grain 8s steps(10) infinite",
        "spin-slow": "spin-slow 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

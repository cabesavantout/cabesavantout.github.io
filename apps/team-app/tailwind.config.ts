import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        sand: "rgb(var(--color-sand) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        pine: "rgb(var(--color-pine) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        soft: "rgb(var(--color-line) / <alpha-value>)",
      },
      boxShadow: {
        panel: "0 24px 80px rgba(15, 23, 42, 0.16)",
        "panel-sm": "0 12px 36px rgba(15, 23, 42, 0.1)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top, 0px)",
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
        "safe-left": "env(safe-area-inset-left, 0px)",
        "safe-right": "env(safe-area-inset-right, 0px)",
      },
      minHeight: {
        "screen-dynamic": "100dvh",
      },
      maxWidth: {
        app: "1600px",
        readable: "72ch",
      },
    },
  },
  plugins: [],
};

export default config;

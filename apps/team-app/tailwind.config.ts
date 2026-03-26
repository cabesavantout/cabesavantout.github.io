import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        sand: "#f5efe4",
        accent: "#c84c09",
        pine: "#335c4b",
        line: "#d8cfbf",
      },
      boxShadow: {
        panel: "0 18px 40px rgba(20, 33, 61, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;

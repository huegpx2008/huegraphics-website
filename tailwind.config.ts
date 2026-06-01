import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#08111F",
        card: "#111B2E",
        accent: "#1F73BE",
      },
      boxShadow: {
        glow: "0 0 30px rgba(31, 115, 190, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;

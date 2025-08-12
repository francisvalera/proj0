import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3C50E0",
        stroke: "#E2E8F0",
        strokedark: "#2E3A47",
        boxdark: "#1C2434",
        whiter: "#F7F9FC",
        "meta-4": "#1F2937",
        // support both notations: bg-gray-2 & bg-[#F6F8FB]
        gray: { 2: "#F6F8FB" },
        "gray-2": "#F6F8FB",
      },
      boxShadow: {
        default: "0 10px 20px 0 rgba(22, 30, 45, 0.08)",
      },
      borderRadius: {
        sm: "8px",
      },
    },
  },
  plugins: [],
};

export default config;

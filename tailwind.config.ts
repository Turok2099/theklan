import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#f20d0d",
        "background-light": "#f8f5f5",
        "background-dark": "#0a0a0a",
        "pure-black": "#000000",
      },
      fontFamily: {
        display: ["var(--font-lexend)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.15rem",
        lg: "0.3rem",
        xl: "0.5rem",
      },
    },
  },
  plugins: [],
};
export default config;

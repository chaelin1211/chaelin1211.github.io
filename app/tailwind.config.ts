import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg_dark: "#282828",
        bg_light: "#e7e7e7",
        bt_dark: "#111111",
        bt_light: "#ffffff",
      },
    },
  },
  plugins: [],
};
module.exports = config;

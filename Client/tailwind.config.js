/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E8453C",
          dark: "#C0392B",
          light: "#FFF0EF",
        },
        secondary: {
          DEFAULT: "#1A1A2E",
          light: "#4A4A6A",
          muted: "#9B9BB4",
        },
        bg: {
          light: "#FAFAFA",
          white: "#FFFFFF",
        },
        border: {
          light: "#E8E8F0",
        },
      },
    },
  },
  plugins: [],
};

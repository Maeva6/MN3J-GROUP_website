/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B3A63",
          dark: "#12233D",
          light: "#3F6690",
        },
        blue: {
          DEFAULT: "#2B5AA0",
        },
        green: {
          DEFAULT: "#7DBF3F",
          light: "#A9D46E",
          dark: "#4C8420",
        },
        teal: {
          DEFAULT: "#1C8C82",
          light: "#4FB3A9",
          dark: "#136359",
        },
        surface: "#F4F6F8",
        ink: "#1B2530",
        muted: "#5C6773",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 30px rgba(10, 25, 45, 0.12)",
        soft: "0 4px 16px rgba(10, 25, 45, 0.06)",
      },
    },
  },
  plugins: [],
};

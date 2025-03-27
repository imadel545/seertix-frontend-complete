/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Active le mode sombre avec la classe "dark"
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // indigo-500
        secondary: "#8b5cf6", // violet-500
        accent: "#ec4899", // pink-500
        background: "#f9fafb",
        dark: "#0f172a",
      },
      boxShadow: {
        "soft-xl": "0 10px 25px rgba(0, 0, 0, 0.08)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      animation: {
        fade: "fadeIn 0.6s ease-out",
        slideUp: "slideUp 0.5s ease-in-out",
        zoom: "zoomIn 0.4s ease-in-out",
        bounceOnce: "bounceOnce 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        zoomIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        bounceOnce: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
      typography: (theme) => ({
        dark: {
          css: {
            color: theme("colors.gray.300"),
            a: { color: theme("colors.indigo.400") },
            strong: { color: theme("colors.white") },
            code: { color: theme("colors.pink.400") },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};

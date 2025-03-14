/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBlue: "rgb(17 24 39)", // Footer color
        primary: "#1E40AF", // Deep blue (Primary button color)
        accent: "#F59E0B", // Warm gold (Accent elements)
        background: "#ffffff", // White background
        textDark: "#111827", // Dark text color
        textLight: "#6B7280", // Lighter gray text
        warningLight: "#EF4444", //Light warning
        warningDark: "#DC2626" // Dark warning
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', 
        secondary: '#F59E0B', 
        bgLight: '#F3F4F6',
        bgDark: '#1F2937',
        textLight: '#D1D5DB',
        textDark: '#111827'
      }
    }
  },
  plugins: []
};
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'brand': ['"SF Pro Display"', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
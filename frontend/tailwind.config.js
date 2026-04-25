/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This maps the 'font-brand' class to your chosen font
        'brand': ['"SF Pro Display"', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../bndy-ui/dist/**/*.{js,ts,jsx,tsx}", // Include bndy-ui components
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#f97316', // BNDY orange
          600: '#ea580c',
        },
        cyan: {
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
    },
  },
  plugins: [],
}
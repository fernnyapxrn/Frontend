/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      fontFamily: {
        mitr: ['Mitr', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


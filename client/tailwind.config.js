/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {}
  },
  plugins: [require('tailwindcss-primeui')],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
}

import twPlugin from 'tailwindcss-primeui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {}
  },
  plugins: [twPlugin],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
}

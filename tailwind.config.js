/** @type {import('tailwindcss').Config} **/
module.exports = {
  content: ["./index.html"],
  darkMode: 'class',
  theme: {
    variants: {
      transitions: ['responsive', 'before', 'after', 'hover', 'focus']
  },
    extend: {
  },
  fontFamily: {
    Raleway: ["Raleway, sans-serif"]
  },
  plugins: [
      require('tailwind-scrollbar'),
  ],
  }
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        'xs': '2px',
      },
      borderWidth: {
        '3': '3px',
      },
      transitionDuration: {
        '600': '600ms',
      },
    },
  },
  plugins: [],
}
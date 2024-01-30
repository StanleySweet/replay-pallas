/** @type {import('tailwindcss').Config} */

import nightwind from 'nightwind'


export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wfg':'rgb(154, 51, 52)',
      },
      fontFamily: {
        roboto: ["ROBOTO", "sans-serif"],
      },
    },
  },
  plugins: [nightwind],
}

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
      fontFamily: {
        roboto: ["ROBOTO", "sans-serif"],
      },
    },
  },
  plugins: [nightwind],
}

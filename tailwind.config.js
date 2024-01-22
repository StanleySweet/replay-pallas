/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brokenWhite:"#F5F5FA",
        wfg:"rgb(154, 51, 52)",
      },
      fontFamily: {
        roboto: ["ROBOTO", "sans-serif"],
      },
    },
  },
  plugins: [],
}

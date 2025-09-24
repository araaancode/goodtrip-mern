/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4756b3',
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [{
      light: {
        ...require("daisyui/src/theming/themes")["light"],
        "primary": "#4756b3",
        "primary-content": "#ffffff",
        "base-100": "#ffffff",
        "base-200": "#f5f5f5", 
        "base-300": "#e5e5e5",
        "--rounded-btn": "0.5rem",
      }
    }],
  },
}
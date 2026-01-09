/** @type {import('tailwindcss').Config} */
module.exports = {

  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter-Regular'],
        alexandria: ['Alexandria-Regular'],
        'alexandria-medium': ['Alexandria-Medium'],
        'alexandria-bold': ['Alexandria-Bold'],
      },
    },
  },
  plugins: [],
}

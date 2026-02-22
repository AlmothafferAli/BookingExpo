/** @type {import('tailwindcss').Config} */
module.exports = {

  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}", "./Features/**/*.{js,ts,tsx}", "./Base/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-light": "var(--primary-light)",
        background: "var(--background)",
        card: "var(--card)",
        border: "var(--border)",
        "border-light": "var(--border-light)",
        text: {
          main: "var(--text-main)",
          muted: "var(--text-muted)",
          dim: "var(--text-dim)",
          content: "var(--text-content)",
          gray: "var(--text-gray)",
        },
        success: {
          bg: "var(--success-bg)",
          text: "var(--success-text)",
        },
        error: {
          bg: "var(--error-bg)",
          text: "var(--error-text)",
        },
        info: {
          bg: "var(--info-bg)",
          text: "var(--info-text)",
          border: "var(--info-border)",
        },
      },
      fontFamily: {
        sans: ['Alexandria-Regular'],
        inter: ['Inter-Regular'],
        alexandria: ['Alexandria-Regular'],
        'alexandria-medium': ['Alexandria-Medium'],
        'alexandria-bold': ['Alexandria-Bold'],
      },
    },
  },
  plugins: [],
}

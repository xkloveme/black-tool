import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "primary": "#1677ff",
          "primary-focus": "#0958d9",
          "base-100": "#ffffff",
          "base-200": "#f8f9fa",
          "base-300": "#f1f3f5",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "primary": "#1668dc",
          "primary-focus": "#1554ad",
          "base-100": "#1a1b1e",
          "base-200": "#141517",
          "base-300": "#0c0d0e",
        },
      },
      {
        corporate: {
          ...require("daisyui/src/theming/themes")["corporate"],
          "primary": "#4b6bfb",
          "base-100": "#f8fafc",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
        },
      },
      {
        bumblebee: {
          ...require("daisyui/src/theming/themes")["bumblebee"],
          "primary": "#e0a82e",
          "base-100": "#fef9c3",
          "base-200": "#fef08a",
          "base-300": "#fde047",
        },
      },
      {
        cupcake: {
          ...require("daisyui/src/theming/themes")["cupcake"],
          "primary": "#1677ff",
        },
      },
      {
        emerald: {
          ...require("daisyui/src/theming/themes")["emerald"],
          "primary": "#059669",
        }
      },
    ],
    darkTheme: "dark",
  },
  plugins: [daisyui],
  darkMode: 'class',
} 
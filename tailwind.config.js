/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [import("flowbite/plugin"), import("tw-elements-react/dist/plugin.cjs")],
};

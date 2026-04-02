import { tailwindPreset } from "./src/styles/tailwind.preset.js";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      ...tailwindPreset.theme?.extend,
    },
  },
  plugins: [],
};

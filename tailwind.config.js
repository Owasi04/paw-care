/** @type {import('tailwindcss').Config} */
// All Tailwind v4 theme configuration is defined in src/app/globals.css via @theme directives.
// This file is kept for legacy compatibility and IDEs that read v3 config format.
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-jakarta)"],
        inter: ["var(--font-inter)"],
        jakarta: ["var(--font-jakarta)"],
      },
    },
  },
};
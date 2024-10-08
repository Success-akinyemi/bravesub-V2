/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-bg': '#e5e7eb',
        'main-bg-2': '#f4f5f8',
        'main-color': 'purple',
        'main-color-hover': 'rgba(172, 1, 172, 0.911)',
        'light-bg': '#d8b4fe',
      },
      screens: {
        'phone': {'max': '500px'},
        'small-phone': {'max': '450px'},
      },
      boxShadow: {
        'shadow': '0px -1px 8px 0px rgba(0,0,0,0.55)',
        'shadow2': '0px 0px 7px 1px rgba(0,0,0,0.75)'
      },
    },
  },
  variants: {
    extend: {
      borderColor: ['focus', 'peer-focus'],
      borderWidth: ['focus', 'peer-focus'],
    },
  },
  plugins: [],
};

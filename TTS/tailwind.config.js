/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
    'orange': '#ef7d00',
    'white': '#ffffff',
    'black': '#000000',
    'light-grey': '#c5c6c8',
    'dark-grey': '#6f7072',
    'ligth-blue': '#7bafd2',
    'dark-blue': '#002259',
    'ligth-green': '#b4cdbe',
    'dark-green': '#1e5a41',
    },
    extend: {
      fontFamily: {
        
      }
    },
  },
  plugins: [],
}


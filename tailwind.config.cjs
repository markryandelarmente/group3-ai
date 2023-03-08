/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'sample-animation': 'sample 2s ease',
      },
      keyframes: {
        sample: {
          '0%' :{
            'opacity': '0'
          },
          '100%': {
            'opacity': '1',
          }
        }
      }
    },
  },
  plugins: [],
};

module.exports = config;

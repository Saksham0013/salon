/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#11100e',
        linen: '#f7f0e8',
        pearl: '#fffaf4',
        champagne: '#d7b46a',
        moss: '#59614a',
        clay: '#9b6f5a',
        blush: '#e4b7a7'
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 24px 70px rgba(17, 16, 14, 0.12)'
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, calming palette
        brand: {
          50: '#fdf4f3',
          100: '#fce7e4',
          200: '#fad3cd',
          300: '#f5b3a9',
          400: '#ec8576',
          500: '#df5e4b',
          600: '#cb442f',
          700: '#aa3624',
          800: '#8d3022',
          900: '#752c21',
        },
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

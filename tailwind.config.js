/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Nunito', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdf3f1',
          100: '#fbe7e2',
          200: '#f7cfc4',
          300: '#f3b7a6',
          400: '#ef9f88',
          500: '#eb876a',
          600: '#eb5e28',
          700: '#d54516',
          800: '#b03712',
          900: '#8c2c0e',
        }
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        }
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

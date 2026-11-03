/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#09251C',
          900: '#0E3B2D',
          850: '#124C3A', // Deep emerald brand
          800: '#155642',
          700: '#1D6A50', // Forest green
          600: '#278867',
          500: '#32A27C',
          100: '#E4F2EC',
          50: '#F0F7F4',
        },
        ivory: {
          50: '#FDFCF9',
          100: '#FAF8F1', // Warm ivory
          200: '#F4EEDB',
          300: '#EFE5CC',
        },
        sand: {
          50: '#FAF7F0',
          100: '#F5EFE1',
          200: '#E9DFC9', // Soft sand
          300: '#DACDB0',
          400: '#C7B692',
        },
        teal: {
          DEFAULT: '#55A99B', // Ocean teal
          400: '#6CB5A9',
          500: '#55A99B',
          600: '#428F83',
          100: '#E5F3F1',
        },
        charcoal: {
          DEFAULT: '#202B28', // Charcoal
          700: '#2B3835',
          800: '#202B28',
          900: '#161D1B',
        },
        muted: {
          DEFAULT: '#7C8781', // Muted gray
          400: '#9CA5A0',
          500: '#7C8781',
          600: '#616C66',
        },
        coral: {
          DEFAULT: '#E58A72', // Soft coral
          400: '#EB9E8B',
          500: '#E58A72',
          600: '#D67258',
          100: '#FBECE8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(18, 76, 58, 0.08), 0 2px 6px -1px rgba(18, 76, 58, 0.04)',
        'card': '0 8px 30px -4px rgba(32, 43, 40, 0.08)',
        'elevated': '0 20px 40px -10px rgba(18, 76, 58, 0.16)',
      }
    },
  },
  plugins: [],
}

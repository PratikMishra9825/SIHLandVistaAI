/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#F8FBF9',
          100: '#EAF7EF',
          200: '#D6E2DA',
          300: '#BDE3CC',
          400: '#86EFAC',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#17211B',
        },
        brand: {
          bg: '#F8FBF9',
          surface: '#FFFFFF',
          soft: '#EAF7EF',
          border: '#D6E2DA',
          borderStrong: '#BDE3CC',
          primary: '#15803D',
          dark: '#166534',
          text: '#17211B',
          secondary: '#4B5D52',
          muted: '#66756C',
        },
        command: {
          bg: '#F8FBF9',
          surface: '#FFFFFF',
          panel: '#EAF7EF',
          elevated: '#FFFFFF',
          border: '#D6E2DA',
          borderBright: '#BDE3CC',
          text: '#17211B',
          muted: '#4B5D52',
          dim: '#66756C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Inter', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 33, 27, 0.05), 0 1px 2px 0 rgba(23, 33, 27, 0.03)',
        'card': '0 4px 20px -2px rgba(23, 33, 27, 0.06), 0 2px 6px -1px rgba(23, 33, 27, 0.03)',
        'elevated': '0 12px 32px -4px rgba(23, 33, 27, 0.08), 0 4px 12px -2px rgba(23, 33, 27, 0.04)',
      }
    },
  },
  plugins: [],
}

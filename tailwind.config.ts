import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/components/**/*.{vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{ts,js}',
    './app/composables/**/*.{ts,js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter var"', 'Inter', 'Manrope', 'system-ui']
      },
      colors: {
        primary: {
          50: '#e6efff',
          100: '#ccd9ff',
          200: '#99b3ff',
          300: '#668cff',
          400: '#3366ff',
          500: '#0044ff',
          600: '#0034c7',
          700: '#00238f',
          800: '#001258',
          900: '#000a36'
        }
      },
      boxShadow: {
        glass: '0 20px 60px rgba(15, 23, 42, 0.2)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
} satisfies Config

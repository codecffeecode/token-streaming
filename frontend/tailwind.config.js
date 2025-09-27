/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          // Light theme - #0067e5
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da7ff',
          400: '#1a8eff',
          500: '#0067e5',
          600: '#0052b8',
          700: '#003d8a',
          800: '#00285c',
          900: '#00132e',
        },
        'primary-dark': {
          // Dark theme - #006aff
          50: '#e6f2ff',
          100: '#b3daff',
          200: '#80c1ff',
          300: '#4da8ff',
          400: '#1a8fff',
          500: '#006aff',
          600: '#0055cc',
          700: '#004099',
          800: '#002b66',
          900: '#001533',
        },
        // Theme-aware backgrounds and text
        background: {
          light: '#ffffff',
          dark: '#0f0f0f',
        },
        surface: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        text: {
          primary: {
            light: '#1f2937',
            dark: '#f9fafb',
          },
          secondary: {
            light: '#6b7280',
            dark: '#d1d5db',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

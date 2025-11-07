/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563eb', // blue-600
          primaryLight: '#dbeafe', // blue-100
          accent: '#10b981', // emerald-500
        },
        surface: {
          bg: '#f8fafc', // slate-50
          card: '#ffffff',
          border: '#e2e8f0', // slate-200
        },
        text: {
          primary: '#0f172a', // slate-900
          secondary: '#475569', // slate-600
        },
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}


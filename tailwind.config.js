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
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          teal: '#0d9488',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        },
        dark: {
          bg: '#0b0f19',
          card: '#131b2e',
          border: '#1e293b',
          muted: '#334155',
          text: '#f8fafc',
          subtext: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'float-xp': 'floatXP 1.5s ease-out forwards',
        'glow-pulse': 'glowPulse 2s infinite alternate',
      },
      keyframes: {
        floatXP: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '50%': { opacity: '1', transform: 'translateY(-20px) scale(1.1)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(1)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(79, 70, 229, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(79, 70, 229, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}

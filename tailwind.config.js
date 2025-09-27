/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app/app.vue"
  ],
  theme: {
    extend: {
      boxShadow: {
        elegant: '0 10px 30px -10px rgba(0,0,0,0.25)',
        glow: '0 0 0 3px rgba(58,79,46,0.25), 0 10px 30px -10px rgba(58,79,46,0.45)'
      },
      dropShadow: {
        glow: '0 0 10px rgba(58,79,46,0.65)'
      },
      colors: {
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: 'var(--brand-accent)',
          600: 'var(--brand-primary)',
          700: 'var(--brand-primary-700)',
          800: '#27351f',
          900: '#1f2a19',
        }
      },
      fontFamily: {
        'inter': ['Montserrat', 'sans-serif'],
        'playfair': ['Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'radial-faded': 'radial-gradient(ellipse at center, rgba(58,79,46,0.15), transparent 60%)',
        'grid': 'linear-gradient(to right, rgba(31,41,55,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(31,41,55,0.08) 1px, transparent 1px)'
      },
      backgroundSize: {
        grid: '32px 32px'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(20px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-10px, 10px) scale(0.98)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        },
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        blob: 'blob 12s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in-up': 'fadeInUp .6s ease-out both'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      ringOffsetWidth: {
        6: '6px'
      }
    },
  },
  plugins: [],
}
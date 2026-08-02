/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Inter"', '"Be Vietnam Pro"', 'system-ui', 'sans-serif']
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#FF87BA',
          50: '#FFF8FB',
          100: '#FFEEF5',
          200: '#FFDCEC',
          300: '#FFC2DD',
          400: '#FFA3CB',
          500: '#FF87BA',
          600: '#F5629A',
          700: '#DB4A81',
          800: '#B93A69',
          900: '#8F2E54',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#C7A8EE',
          50: '#FBF9FE',
          100: '#F5EFFC',
          200: '#E9DBF8',
          300: '#D8BFF2',
          400: '#C7A8EE',
          500: '#A883D6',
          600: '#9169C2',
          foreground: '#FFFFFF'
        },
        accent: {
          DEFAULT: '#FFB37A',
          50: '#FFFAF3',
          100: '#FFF1E1',
          200: '#FFE0BE',
          300: '#FFCC9B',
          400: '#FFB37A',
          500: '#FF9D57',
          600: '#F2823A',
          foreground: '#FFFFFF'
        },
        success: { DEFAULT: '#22C55E', foreground: '#FFFFFF' },
        error: { DEFAULT: '#EF4444', foreground: '#FFFFFF' },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 12px)',
        '3xl': 'calc(var(--radius) + 20px)'
      },
      boxShadow: {
        soft: '0 2px 8px rgba(15, 23, 42, 0.06)',
        card: '0 4px 16px rgba(15, 23, 42, 0.08)',
        elevated: '0 8px 30px rgba(15, 23, 42, 0.12)',
        glow: '0 0 0 4px rgba(255, 135, 186, 0.20)'
      },
      backdropBlur: {
        xs: '2px'
      },
      keyframes: {
        'accordion-down': { from: { height: 0 }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: 0 } },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'slide-up': { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.5s infinite'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

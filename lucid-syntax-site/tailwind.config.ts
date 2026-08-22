import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep near-black base — most of the page lives here.
        ink: {
          950: '#07080A',
          900: '#0C0D10',
          800: '#131418',
          700: '#1C1D22',
        },
        // Oxidized crimson — a weapon, not a wash.
        crimson: {
          800: '#3D0A13',
          700: '#59101C',
          600: '#7A1524',
          500: '#9C1A2C',
          400: '#C22A3F',
          300: '#E14A5C',
        },
        // Bone white — the light in the cathedral.
        bone: {
          500: '#8A8477',
          300: '#C9C1AE',
          200: '#DDD5C2',
          100: '#EDE6D8',
          50: '#F6F2E9',
        },
        // Thin gold-leaf accents. Use sparingly, at low weight.
        gold: {
          600: '#8A6A28',
          500: '#B08D3E',
          400: '#C9A85B',
          300: '#DCC184',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-1': ['clamp(3.5rem, 3rem + 6vw, 11rem)', { lineHeight: '0.86', letterSpacing: '-0.03em' }],
        'display-2': ['clamp(2.5rem, 2rem + 4.5vw, 7rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-3': ['clamp(1.75rem, 1.4rem + 2.5vw, 3.75rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-4': ['clamp(1.375rem, 1.2rem + 1vw, 2rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        tightest: '-0.03em',
        widest2: '0.32em',
      },
      spacing: {
        gutter: 'var(--gutter)',
      },
      transitionTimingFunction: {
        decay: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backgroundImage: {
        'crimson-bloom': 'radial-gradient(60% 60% at 50% 40%, rgba(156,26,44,0.35), transparent 70%)',
      },
    },
  },
  plugins: [],
};

export default config;

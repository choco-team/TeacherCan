import theme from './src/style/theme';

const { colors } = theme;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ...colors,
        border: colors.gray[200],
        input: colors.gray[200],
        ring: colors.gray[400],
        background: colors.beige[100],
        foreground: colors.gray[900],
        destructive: colors.red,
        muted: {
          DEFAULT: colors.gray[100],
          foreground: colors.gray[500],
        },
        accent: {
          DEFAULT: colors.primary[100],
          foreground: colors.gray[900],
        },
        popover: {
          DEFAULT: colors.white,
          foreground: colors.gray[900],
        },
        card: {
          DEFAULT: colors.white,
          foreground: colors.gray[900],
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: { sans: ['var(--font-pretendard)'] },
      fontSize: { '2.5xl': '1.75rem', '3.5xl': '2rem' },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

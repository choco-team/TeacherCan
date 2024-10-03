import theme from './src/styles/theme';

const { colors, keyframes } = theme;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/containers/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        border: colors.gray[200],
        input: colors.gray[200],
        ring: colors.gray[400],
        background: colors.beige[100],
        foreground: colors.gray[900],
        text: colors.gray[700],
        disabled: colors.gray[300],
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
      fontFamily: {
        sans: ['var(--font-pretendard)'],
        point: ['var(--font-byeolbichhaneul)'],
        number: ['var(--font-pyeongtaek-anbo)'],
      },
      fontSize: { '2.5xl': '1.75rem', '3.5xl': '2rem' },
      keyframes: {
        ...keyframes,
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-content-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height' },
        },
        'collapsible-content-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-content-down': 'collapsible-content-down 0.3s ease-out',
        'collapsible-content-up': 'collapsible-content-up 0.3s ease-out',
        'bounce-in-top': 'bounce-in-top 1.2s both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

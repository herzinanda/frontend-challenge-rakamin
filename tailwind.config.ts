import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // This is the HEX-based format that works for you
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          main: 'var(--color-primary-main)',
          surface: 'var(--color-primary-surface)',
          border: 'var(--color-primary-border)',
          hover: 'var(--color-primary-hover)',
          pressed: 'var(--color-primary-pressed)',
        },
        secondary: {
          main: 'var(--color-secondary-main)',
          surface: 'var(--color-secondary-surface)',
          border: 'var(--color-secondary-border)',
          hover: 'var(--color-secondary-hover)',
          pressed: 'var(--color-secondary-pressed)',
        },
        danger: {
          main: 'var(--color-danger-main)',
          surface: 'var(--color-danger-surface)',
          border: 'var(--color-danger-border)',
          hover: 'var(--color-danger-hover)',
          pressed: 'var(--color-danger-pressed)',
        },
        warning: {
          main: 'var(--color-warning-main)',
          surface: 'var(--color-warning-surface)',
          border: 'var(--color-warning-border)',
          hover: 'var(--color-warning-hover)',
          pressed: 'var(--color-warning-pressed)',
        },
        success: {
          main: 'var(--color-success-main)',
          surface: 'var(--color-success-surface)',
          border: 'var(--color-success-border)',
          hover: 'var(--color-success-hover)',
          pressed: 'var(--color-success-pressed)',
        },
        neutral: {
          10: 'var(--color-neutral-10)',
          20: 'var(--color-neutral-20)',
          30: 'var(--color-neutral-30)',
          40: 'var(--color-neutral-40)',
          50: 'var(--color-neutral-50)',
          60: 'var(--color-neutral-60)',
          70: 'var(--color-neutral-70)',
          80: 'var(--color-neutral-80)',
          90: 'var(--color-neutral-90)',
          100: 'var(--color-neutral-100)',
        },
      },
    },
  },
  plugins: [],
}
export default config
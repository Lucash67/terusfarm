import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          base: "rgb(var(--surface-base-rgb) / <alpha-value>)",
          "elevated-1": "rgb(var(--surface-elevated-1-rgb) / <alpha-value>)",
          "elevated-2": "rgb(var(--surface-elevated-2-rgb) / <alpha-value>)",
          "elevated-3": "rgb(var(--surface-elevated-3-rgb) / <alpha-value>)",
          overlay: "var(--surface-overlay)",
          border: "rgb(var(--surface-border-rgb) / <alpha-value>)",
          "border-subtle": "rgb(var(--surface-border-subtle-rgb) / <alpha-value>)",
        },
        brand: {
          primary: "rgb(var(--brand-primary-rgb) / <alpha-value>)",
          "primary-hover": "rgb(var(--brand-primary-hover-rgb) / <alpha-value>)",
          "primary-dim": "var(--brand-primary-dim)",
          secondary: "rgb(var(--brand-secondary-rgb) / <alpha-value>)",
          dark: "rgb(var(--brand-dark-rgb) / <alpha-value>)",
        },
        status: {
          success: "rgb(var(--status-success-rgb) / <alpha-value>)",
          warning: "rgb(var(--status-warning-rgb) / <alpha-value>)",
          error: "rgb(var(--status-error-rgb) / <alpha-value>)",
          neutral: "rgb(var(--status-neutral-rgb) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--text-primary-rgb) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary-rgb) / <alpha-value>)",
          tertiary: "rgb(var(--text-tertiary-rgb) / <alpha-value>)",
          disabled: "rgb(var(--text-disabled-rgb) / <alpha-value>)",
          link: "rgb(var(--text-link-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
        floating: "var(--shadow-floating)",
        premium: "var(--shadow-premium)",
        "glow-sm": "var(--glow-sm)",
        glow: "var(--glow)",
        "glow-lg": "var(--glow-lg)",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "180ms",
        normal: "380ms",
        slow: "720ms",
      },
    },
  },
  plugins: [],
};

export default config;

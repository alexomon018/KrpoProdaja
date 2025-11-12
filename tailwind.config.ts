import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      "2xs": ["0.75rem", { lineHeight: "1.125rem" }],
      "xs": ["0.875rem", { lineHeight: "1.313rem" }],
      "sm": ["1rem", { lineHeight: "1.5rem" }],
      "base": ["1rem", { lineHeight: "1.5rem" }],
      "md": ["1.125rem", { lineHeight: "1.688rem" }],
      "lg": ["1.25rem", { lineHeight: "1.875rem" }],
      "xl": ["1.625rem", { lineHeight: "2.438rem" }],
      "2xl": ["1.875rem", { lineHeight: "2.813rem" }],
      "3xl": ["2rem", { lineHeight: "3rem" }],
      "4xl": ["2.25rem", { lineHeight: "3.375rem" }],
      "5xl": ["2.375rem", { lineHeight: "3.563rem" }],
      "6xl": ["3rem", { lineHeight: "4.5rem" }],
      "7xl": ["3.875rem", { lineHeight: "5.8125rem" }],
      "8xl": ["7.5rem", { lineHeight: "11.25rem" }]
    },
    screens: {
      "2xs": "375px",
      "xs": "425px",
      "sm": "640px",
      "md": "834px",
      "lg": "1024px",
      "xl": "1440px",
      "2xl": "2000px"
    },
    containers: {
      "2xs": "375px",
      "xs": "425px",
      "sm": "640px",
      "md": "834px",
      "lg": "1024px",
      "xl": "1440px",
      "2xl": "2000px"
    },
    borderRadius: {
      "none": "0",
      "2xs": ".25rem",
      "xs": ".5rem",
      "sm": "1rem",
      "md": "1.5rem",
      "lg": "2rem",
      "xl": "3rem",
      "full": "9999px"
    },
    boxShadow: {
      "low": "2px 2px 4px 0px rgba(0, 0, 0, 0.2)",
      "medium": "0px 4px 10px 0px rgba(0, 0, 0, 0.24)",
      "high": "0px 4px 30px 0px rgba(0, 0, 0, 0.15)",
      "high-lighter": "0px 4px 48px 0px rgba(0, 0, 0, 0.07)",
      "light": "0px 2px 6px 0px rgba(0, 0, 0, 0.08)",
      "none": "none"
    },
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: '#E63946',
          dark: '#C52839',
          light: '#FF6B75',
        },
        // Neutrals
        background: '#F8F9FA',
        surface: '#FFFFFF',
        border: '#E9ECEF',
        // Text Hierarchy
        text: {
          primary: '#212529',
          secondary: '#6C757D',
          tertiary: '#ADB5BD',
        },
        // Semantic Colors
        semantic: {
          success: '#28A745',
          warning: '#FFC107',
          info: '#17A2B8',
          error: '#DC3545',
        },
        // Condition-Specific
        condition: {
          new: '#28A745',
          veryGood: '#5CB85C',
          good: '#FFC107',
          satisfactory: '#FF9800',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      transitionTimingFunction: {
        easeInExpo: "cubic-bezier(1.000, 0.000, 0.000, 1.000)"
      },
      transitionProperty: {
        "height": "height",
        "max-h": "max-h"
      },
      borderWidth: {
        "3": "3px"
      },
      maxWidth: {
        "8xl": "90rem"
      },
      padding: {
        "30": "7.5rem"
      },
      margin: {
        "30": "7.5rem",
        "1/2": "50%"
      },
      lineHeight: {
        "heading": "1.2",
        "body": "1.5",
        "inline-link": "1.5",
        "isolated-link": "1.3",
        "150": "1.5",
        "130": "1.3",
        "120": "1.2"
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
};

export default config;

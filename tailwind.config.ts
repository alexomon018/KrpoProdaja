import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '24px',
        '2xl': '32px',
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

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      "2xs": ["0.75rem", { lineHeight: "1.125rem" }],
      xs: ["0.875rem", { lineHeight: "1.313rem" }],
      sm: ["1rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      md: ["1.125rem", { lineHeight: "1.688rem" }],
      lg: ["1.25rem", { lineHeight: "1.875rem" }],
      xl: ["1.625rem", { lineHeight: "2.438rem" }],
      "2xl": ["1.875rem", { lineHeight: "2.813rem" }],
      "3xl": ["2rem", { lineHeight: "3rem" }],
      "4xl": ["2.25rem", { lineHeight: "3.375rem" }],
      "5xl": ["2.375rem", { lineHeight: "3.563rem" }],
      "6xl": ["3rem", { lineHeight: "4.5rem" }],
      "7xl": ["3.875rem", { lineHeight: "5.8125rem" }],
      "8xl": ["7.5rem", { lineHeight: "11.25rem" }],
    },
    screens: {
      "2xs": "375px",
      xs: "425px",
      sm: "640px",
      md: "834px",
      lg: "1024px",
      xl: "1440px",
      "2xl": "2000px",
    },
    containers: {
      "2xs": "375px",
      xs: "425px",
      sm: "640px",
      md: "834px",
      lg: "1024px",
      xl: "1440px",
      "2xl": "2000px",
    },
    borderRadius: {
      none: "0",
      "2xs": ".25rem",
      xs: ".5rem",
      base: ".75rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
      full: "9999px",
    },
    boxShadow: {
      low: "2px 2px 4px 0px rgba(0, 0, 0, 0.2)",
      medium: "0px 4px 10px 0px rgba(0, 0, 0, 0.24)",
      high: "0px 4px 30px 0px rgba(0, 0, 0, 0.15)",
      "high-lighter": "0px 4px 48px 0px rgba(0, 0, 0, 0.07)",
      light: "0px 2px 6px 0px rgba(0, 0, 0, 0.08)",
      none: "none",
    },
    extend: {
      colors: {
        red: {
          100: "#CE492C",
          90: "#D45C3D",
          80: "#DA7761",
          75: "#DD8370",
          70: "#E18F7F",
          60: "#E7A495",
          50: "#ECB9AB",
          40: "#F0CCC2",
          30: "#F3D2CA",
          25: "#F5DAD4",
          20: "#F7E3DE",
          10: "#FBF1EF",
        },
        charcoal: {
          100: "#2F2F2F",
          90: "#444444",
          80: "#585858",
          75: "#666666",
          70: "#6D6D6D",
          60: "#828282",
          50: "#989898",
          40: "#ACACAC",
          30: "#C1C1C1",
          25: "#CBCBCB",
          20: "#D5D5D5",
          10: "#EAEAEA",
        },
        white: {
          100: "#FFFFFF",
          "80T": "#ffffffcc",
        },
        teal: {
          100: "#62BAB7",
          90: "#72C1BE",
          80: "#81C8C5",
          75: "#89CBC9",
          70: "#91CFCD",
          60: "#A1D6D4",
          50: "#B0DCDB",
          40: "#C0E3E2",
          30: "#D0EAE9",
          25: "#D7EEED",
          20: "#E0F1F1",
          10: "#EFF8F8",
        },
        steel: {
          100: "#CFD1D4",
          90: "#D4D6D8",
          80: "#D8DADD",
          75: "#DBDDDF",
          70: "#DDDFE1",
          60: "#E2E3E5",
          50: "#E7E8EA",
          40: "#ECEDEE",
          30: "#F1F1F2",
          25: "#F3F4F4",
          20: "#F5F6F6",
          10: "#FAFAFB",
        },
        orange: {
          100: "#F7A71B",
          75: "#F8BD54",
          50: "#FAD38C",
          25: "#FDE9C5",
        },
        purple: {
          100: "#B58BBA",
          75: "#C7A8CB",
          50: "#DAC5DC",
          25: "#ECE2EE",
        },
        yellow: {
          100: "#FFDC00",
          90: "#FFDF1A",
          80: "#FFE333",
          75: "#FFE540",
          70: "#FFE74D",
          60: "#FFEA66",
          50: "#FFED7F",
          40: "#FFF199",
          30: "#FFF5B3",
          25: "#FFF6BF",
          20: "#FFF8CC",
          10: "#FFFBE6",
        },
        green: {
          100: "#3C7D1A",
          75: "#429715",
          20: "#CAE5BC",
        },
        warning: {
          100: "#C51315",
          20: "#F4D0D0",
        },
        success: {
          100: "#5ABC27",
          20: "#DEF1D4",
        },
        moustache: {
          100: "#181818",
        },
        black: {
          100: "#000000",
        },
        transparent: "transparent",
        current: "currentColor",
        // Semantic tokens (auto-adapt to theme)
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        foreground: {
          DEFAULT: "var(--color-foreground)",
          muted: "var(--color-foreground-muted)",
          subtle: "var(--color-foreground-subtle)",
        },
        // Legacy aliases (for backward compatibility)
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },
        text: {
          primary: "var(--color-foreground)",
          secondary: "var(--color-foreground-muted)",
          tertiary: "var(--color-foreground-subtle)",
        },
        semantic: {
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          info: "var(--color-info)",
          error: "var(--color-error)",
        },
        condition: {
          new: "var(--color-success)",
          veryGood: "#5CB85C",
          good: "var(--color-warning)",
          satisfactory: "#FF9800",
        },
      },
      fontFamily: {
        sans: ["var(--font-source-sans)", "sans-serif"],
        lato: ["var(--font-lato)", "sans-serif"],
      },
      transitionTimingFunction: {
        easeInExpo: "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
      },
      transitionProperty: {
        height: "height",
        "max-h": "max-h",
      },
      borderWidth: {
        "3": "3px",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      padding: {
        "30": "7.5rem",
      },
      margin: {
        "30": "7.5rem",
        "1/2": "50%",
      },
      lineHeight: {
        heading: "1.2",
        body: "1.5",
        "inline-link": "1.5",
        "isolated-link": "1.3",
        "150": "1.5",
        "130": "1.3",
        "120": "1.2",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        ".touch-target": {
          minHeight: "44px",
          minWidth: "44px",
        },
        ".safe-area-inset-bottom": {
          paddingBottom: "env(safe-area-inset-bottom)",
        },
        ".safe-area-inset-top": {
          paddingTop: "env(safe-area-inset-top)",
        },
      });
    },
  ],
};

export default config;

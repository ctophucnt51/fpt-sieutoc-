/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fpt: {
          orange: "#F37021",
          hover: "#E05D10",
          light: "#FFF4ED",
          dark: "#C65310",
          navy: "#0F172A",
          blue: "#0284C7",
          green: "#059669",
        },
        lc: {
          primary: "#F37021", // Long Chau primary adapted to FPT orange
          primaryHover: "#E05D10",
          light: "#FFF4ED",
          bgLayer: "#F4F6FB", // Long Chau signature bg-layer-gray
          cardBorder: "#E4E8ED", // Long Chau card border
          title: "#20283D", // Long Chau dark heading
          text: "#2F364A", // Long Chau body text
          muted: "#657384", // Long Chau secondary text
          placeholder: "#C1C8D1",
        },
        surface: {
          primary: "#FFFFFF",
          secondary: "#F4F6FB",
          tertiary: "#F1F5F9",
        },
        ink: {
          primary: "#20283D",
          secondary: "#657384",
          tertiary: "#94A3B8",
          border: "#E4E8ED",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "Be Vietnam Pro",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.03)",
        card: "0 0 8px -2px rgba(243, 112, 33, 0.06)",
        "lc-card": "0 0 8px -2px rgba(243, 112, 33, 0.06), 0 0 4px -2px rgba(243, 112, 33, 0.04)",
        "lc-hover": "0 4px 16px rgba(243, 112, 33, 0.12)",
        "lc-dropdown": "0 8px 32px -4px rgba(243, 112, 33, 0.12)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
    },
  },
  plugins: [],
};

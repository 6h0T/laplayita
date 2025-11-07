import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5bbfc',
          400: '#8196f8',
          500: '#7986cb',
          600: '#5c6bc0',
          700: '#4a5ab3',
          800: '#3d4a92',
          900: '#363f74',
        },
        pastel: {
          blue: '#7986cb',
          purple: '#9575cd',
          pink: '#f48fb1',
          orange: '#ffab91',
          yellow: '#fff59d',
          green: '#a5d6a7',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

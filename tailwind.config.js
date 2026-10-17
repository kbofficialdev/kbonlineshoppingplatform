/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        // Official KB FASHIONS Brand Design Tokens
        kb: {
          black: "#08090C",
          white: "#FFFFFF",
          blue: "#3478F6",
          violet: "#9333EA",
          gold: "#D6AC55",
          gray: "#E8EAF0",
          slate: "#555963",
          success: "#16805D",
          error: "#C62828",
        },
        // Legacy compatibility mappings
        kbBlack: '#08090C',
        kbDark: '#181818',
        kbMuted: '#555963',
        kbLight: '#F8F9FA',
        kbSurfaceAlt: '#FAFAFB',
        kbCardBg: '#FFFFFF',
        kbBorder: '#E8EAF0',
        kbEmerald: '#16805D',
        kbEmeraldBg: '#ecfdf5',
        kbTrustBlue: '#3478F6',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Telugu', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'kb-card': '14px',
        'kb-panel': '20px',
        'kb-xl': '30px',
        'kb-lg': '20px',
        'kb-md': '14px',
        'kb-sm': '10px',
        'kb-xs': '6px',
        'kb-pill': '999px',
      },
      maxWidth: {
        'kb-content': '1280px',
      }
    },
  },
  plugins: [],
};

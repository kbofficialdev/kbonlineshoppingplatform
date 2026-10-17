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
        kbBlack: '#111111',
        kbDark: '#181818',
        kbMuted: '#737373',
        kbLight: '#f7f7f5',
        kbSurfaceAlt: '#f4f4f1',
        kbCardBg: '#f2f2f0',
        kbBorder: '#e8e8e8',
        kbEmerald: '#047857',
        kbEmeraldBg: '#ecfdf5',
        kbTrustBlue: '#1e3a8a',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'kb-xl': '30px',
        'kb-lg': '28px',
        'kb-md': '20px',
        'kb-sm': '18px',
        'kb-xs': '12px',
        'kb-pill': '999px',
      }
    },
  },
  plugins: [],
}

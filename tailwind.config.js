/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#07070f',
        surface: '#0d0d1e',
        card: '#12122a',
        border: '#1e1e40',
        accent: '#5eff9e',
        warn: '#ff8c42',
        water: '#38bdf8',
        protein: '#c084fc',
        danger: '#ff4466',
        muted: '#6b6b9a',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

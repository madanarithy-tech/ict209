/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      // The original Digital Researching Lab palette: teal on warm paper, with gold and violet accents.
      colors: {
        brand: { 50: '#f0fdfa', 100: '#ccfbf1', 600: '#0d9488', 700: '#0f766e', 800: '#115e59' },
        gold: { 50: '#faf5ea', 200: '#e4d8bd', 500: '#b8975a', 700: '#8a6d36' },
        paper: '#fffdf9', cream: '#faf8f3', sand: '#f3eee3', line: '#e8dfcc',
      },
      fontFamily: { mono: ['var(--font-mono)', 'ui-monospace', 'monospace'] },
    },
  },
  plugins: [],
};

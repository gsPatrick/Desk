/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './componentsDesk/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0a', 'dark-surface': '#1c1c1c', 'dark-text': '#f0f0f0', 'dark-subtle': '#a0a0a0', 'dark-accent': '#3b82f6', 'glow-start': 'rgba(59, 130, 246, 0.4)', 'glow-end': 'rgba(59, 130, 246, 0.0)',
        'light-bg': '#f5f5f5', 'light-surface': '#ffffff', 'light-text': '#1c1c1c', 'light-subtle': '#525252', 'light-accent': '#2563eb', 'beige-100': '#F5F5DC', // Ou um tom de sua preferência
      },
      fontFamily: { sans: ['"Inter"', 'sans-serif'], mono: ['"Source Code Pro"', 'monospace'] },
    },
  },
  plugins: [],
};
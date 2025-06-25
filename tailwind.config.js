// tailwind.config.js (VERSÃO COMPLETA E CORRIGIDA)

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  // IMPORTANTE: Adicionamos a pasta 'componentsFinance' aqui.
  // O Tailwind agora vai escanear esta pasta em busca de classes.
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './componentsDesk/**/*.{js,ts,jsx,tsx}',
    './componentsFinance/**/*.{js,ts,jsx,tsx}', 
  ],

  theme: {
    extend: {
      colors: {
        // --- CORES DO PORTFÓLIO PRINCIPAL ---
        'dark-bg': '#0a0a0a',
        'dark-surface': '#1c1c1c',
        'dark-text': '#f0f0f0',
        'dark-subtle': '#a0a0a0',
        'dark-accent': '#3b82f6',
        'glow-start': 'rgba(59, 130, 246, 0.4)',
        'glow-end': 'rgba(59, 130, 246, 0.0)',
        
        'light-bg': '#f5f5f5',
        'light-surface': '#ffffff',
        'light-text': '#1c1c1c',
        'light-subtle': '#525252',
        'light-accent': '#2563eb',

        // --- CORES DO SISTEMA FINANCEIRO ---
        'finance-black': '#131312',
        'finance-cream': '#f8f6eb',
        'finance-lime': '#a7cc1a',
        'finance-pink': '#f6339a',
        
        // --- CORES SEMÂNTICAS (para componentes do sistema financeiro) ---
        // Tema Escuro
        'text-primary-dark': '#f8f6eb',
        'text-secondary-dark': '#8a8a83',
        // 'surface-dark' já está definido acima

        // Tema Claro
        'text-primary-light': '#131312',
        'text-secondary-light': '#6b6b66',
        // 'surface-light' já está definido acima
        
        // --- CORES DE BORDA ---
        'border-light': '#EAEAEA', // Borda para o tema claro
      },
      fontFamily: { 
        sans: ['"Inter"', 'sans-serif'], 
        mono: ['"Source Code Pro"', 'monospace'] 
      },
    },
  },
  plugins: [],
};
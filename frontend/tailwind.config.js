/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Theme Colors
        'dark-bg': '#0f172a', // Slate 900
        'dark-card': '#1e293b', // Slate 800
        'dark-border': '#334155', // Slate 700
        
        // Light Theme Colors
        'light-bg': '#f1f5f9', // Slate 100
        'light-card': '#ffffff', // White
        'light-border': '#e2e8f0', // Slate 200

        // Brand Colors
        'brand-blue': '#0d244a', // MCA ka Dark Blue
        'brand-accent': '#2563eb', // Ek sundar, professional blue
      }
    },
  },
  plugins: [],
}
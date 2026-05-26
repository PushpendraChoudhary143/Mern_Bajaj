/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        border: '#e2e8f0',
        textMain: '#0f172a',
        textMuted: '#64748b',
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
      }
    },
  },
  plugins: [],
}

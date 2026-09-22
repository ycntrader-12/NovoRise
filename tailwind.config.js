/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./novorise_job_board.tsx"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B132B',
          orange: '#FF9F1C',
          coral: '#FF5E36',
          bg: '#F8F9FA'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Definición de colores
        brand: {
          primary: '#9e1c22',   
          secondary: '#7f151b', 
          accent: '#2563eb',   
          dark: '#1e293b',    
          light: '#f1f5f9',     
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
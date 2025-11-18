/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5A5F',
        secondary: '#00A699',
        accent: '#FC642D',
        success: '#00A699',
        warning: '#FFB400',
        error: '#D93900',
        info: '#008489',
        surface: '#FFFFFF',
        background: '#F7F7F7'
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-subtle': 'bounce 0.5s ease-in-out',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
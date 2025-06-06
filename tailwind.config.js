/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        admin: '0 0 0 4px rgba(255, 230, 0, 0.7)', // Yellow aura for admin
      },
      colors: {
        ring: '#FFD700', // Gold ring color
      },
      zIndex: {
        overlay: '9999'
      },
    },
  },
  plugins: [],
};

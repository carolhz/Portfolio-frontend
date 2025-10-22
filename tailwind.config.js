/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Pindai semua file React
  ],
  // Aktifkan dark mode menggunakan 'class'
  // Nanti kita akan toggle class 'dark' di <html>
  darkMode: "class", 
  theme: {
    extend: {
      colors: {
        // Definisikan palet warna Anda di sini
        // Sesuaikan kode hex ini sesuai selera Anda
        'primary-pink': '#FF69B4', // (Hot Pink)

        'light-bg': '#FFFFFF',
        'light-text': '#111111',
        'light-card': '#F5F5F5',

        'dark-bg': '#111111',
        'dark-text': '#FFFFFF',
        'dark-card': '#222222',
      }
    },
  },
  plugins: [],
}
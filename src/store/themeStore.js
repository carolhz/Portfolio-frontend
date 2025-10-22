// src/store/themeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Fungsi helper untuk menerapkan tema ke elemen <html>
const applyTheme = (theme) => {
  const root = document.documentElement; // Ambil tag <html>
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create(
  persist(
    (set) => ({
      // State Awal: 'light'
      theme: 'light',

      // Aksi untuk mengganti tema
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          applyTheme(newTheme); // Langsung terapkan tema ke HTML
          return { theme: newTheme };
        });
      },

      // Aksi untuk set tema (misal: saat awal load)
      initTheme: () => {
        const currentTheme = useThemeStore.getState().theme;
        applyTheme(currentTheme);
      },
    }),
    {
      name: 'theme-storage', // nama key di localStorage
    }
  )
);

// Panggil initTheme() saat aplikasi pertama kali load
// Ini untuk menerapkan tema yang tersimpan di localStorage saat reload halaman
useThemeStore.getState().initTheme();
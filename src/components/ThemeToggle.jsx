// src/components/ThemeToggle.jsx
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useThemeStore } from '../store/themeStore';

const ThemeToggle = () => {
  // Ambil state 'theme' dan aksi 'toggleTheme' dari store
  const { theme, toggleTheme } = useThemeStore((state) => state);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-white bg-primary-pink hover:bg-opacity-80 transition-colors"
    >
      {theme === 'light' ? (
        <FaMoon size={20} /> // Tampilkan bulan jika mode light
      ) : (
        <FaSun size={20} /> // Tampilkan matahari jika mode dark
      )}
    </button>
  );
};

export default ThemeToggle;
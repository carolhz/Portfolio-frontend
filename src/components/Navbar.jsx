// src/components/Navbar.jsx
import React, { useState } from 'react'; // <-- 1. Import useState
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { FaBars, FaTimes } from 'react-icons/fa'; // <-- 2. Import ikon hamburger

const Navbar = () => {
  // 3. Tambahkan state untuk melacak status menu mobile
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    // Kita tambahkan 'relative' agar menu mobile bisa diposisikan
    <nav className="sticky top-0 z-50 w-full p-4 shadow-md 
                    bg-light-card text-light-text 
                    dark:bg-dark-card dark:text-dark-text
                    transition-colors duration-300 relative">

      <div className="container mx-auto flex justify-between items-center">

        {/* Logo atau Nama Anda */}
        <Link to="/" className="text-2xl font-bold text-primary-pink" onClick={closeMenu}>
          CHZ
        </Link>

        {/* Navigasi Desktop (yang sudah ada) */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-primary-pink">Home</Link>
          <Link to="/projects" className="hover:text-primary-pink">Projects</Link>
          <Link to="/about" className="hover:text-primary-pink">About</Link>
          <Link to="/contact" className="hover:text-primary-pink">Contact</Link>
          <ThemeToggle />
        </div>

        {/* 4. Tombol Hamburger & Theme Toggle untuk Mobile */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="z-50">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

      </div>

      {/* 5. Menu Mobile (Dropdown) */}
      <div 
        className={`
          md:hidden absolute top-full left-0 right-0 w-full 
          bg-light-card dark:bg-dark-card 
          shadow-lg transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} 
        `}
        style={{ 
          // Ini untuk transisi yang lebih mulus (slide down)
          maxHeight: isOpen ? '300px' : '0', 
          overflow: 'hidden' 
        }}
      >
        <div className="flex flex-col items-center p-6 space-y-4">
          <Link to="/" className="hover:text-primary-pink text-lg" onClick={closeMenu}>Home</Link>
          <Link to="/about" className="hover:text-primary-pink text-lg" onClick={closeMenu}>About</Link>
          <Link to="/projects" className="hover:text-primary-pink text-lg" onClick={closeMenu}>Projects</Link>
          <Link to="/contact" className="hover:text-primary-pink text-lg" onClick={closeMenu}>Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
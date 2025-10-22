// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="p-8 text-center 
                     bg-light-card text-light-text 
                     dark:bg-dark-card dark:text-dark-text
                     transition-colors duration-300">
      <div className="container mx-auto">
        {/* Nanti kita tambahkan ikon sosmed di sini */}
        <p className="mt-4 text-sm">
          &copy; {new Date().getFullYear()} Olin. Dibuat dengan Django & React.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
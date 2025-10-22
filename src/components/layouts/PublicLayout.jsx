// src/components/layouts/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const PublicLayout = () => {
  return (
    // 1. TAMBAHKAN 'flex' dan 'flex-col' di sini
    <div className="bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text min-h-screen flex flex-col">
      <Navbar />
      
      {/* 2. TAMBAHKAN 'flex-grow' di sini */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;
// src/pages/public/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api'; 
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

// --- HAPUS baseURL DARI SINI ---
// const baseURL = import.meta.env.VITE_API_URL || ''; 

const HomePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Panggilan ke /profile/1/ sudah benar
        const response = await api.get('/profile/1/'); 
        setProfile(response.data);
        
      } catch (error) {
        console.error("Gagal mengambil data profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); 

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center text-center px-4">
        Gagal memuat data profile. (Pastikan ada data profil dengan ID=1 di database Anda).
      </div>
    );
  }

  
  return (
    <section className="container mx-auto min-h-screen flex items-center px-6 py-12 overflow-hidden"> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }}   
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-lg text-primary-pink">Halo, nama saya</span>
          <h1 className="text-5xl md:text-7xl font-bold my-4 text-light-text dark:text-dark-text">
            {profile.nama}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            {profile.deskripsi_singkat}
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Link 
              to="/projects" 
              className="px-6 py-3 bg-primary-pink text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              Lihat Proyek Saya
            </Link>
            <Link 
              to="/contact" 
              className="px-6 py-3 bg-light-card dark:bg-dark-card border border-primary-pink text-primary-pink font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              Hubungi Saya
            </Link>
          </div>

          <div className="flex space-x-6">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-light-text dark:text-dark-text hover:text-primary-pink transition-colors">
              <FaGithub size={30} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-light-text dark:text-dark-text hover:text-primary-pink transition-colors">
              <FaLinkedin size={30} />
            </a>
          </div>
        </motion.div>

        <motion.div 
          className="w-full flex justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.5 }} 
          animate={{ opacity: 1, scale: 1 }}   
          transition={{ duration: 0.5 }}
        >
          {profile.foto ? ( 
            <motion.img 
              // --- PERBAIKAN: HAPUS baseURL dari sini ---
              src={profile.foto} 
              alt={profile.nama} 
              className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl border-4 border-primary-pink" 
              whileHover={{ scale: 1.05 }} 
              transition={{ type: 'spring', stiffness: 300 }} 
            />
          ) : (
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              Tidak ada foto
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default HomePage;

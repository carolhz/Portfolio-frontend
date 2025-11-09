// src/pages/public/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api'; 
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile/4/'); 
        
        // Debugging logs
        console.log('✅ Profile API Response:', response.data);
        console.log('📸 Foto URL:', response.data.foto);
        console.log('🌐 Foto URL Type:', typeof response.data.foto);
        
        setProfile(response.data);
        setError(null);
      } catch (error) {
        console.error("❌ Gagal mengambil data profile:", error);
        console.error("❌ Error details:", error.response?.data);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); 

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-pink mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-center px-4">
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Gagal memuat data profile: {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-primary-pink text-white rounded-lg hover:scale-105 transition-transform"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center text-center px-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Data Tidak Ditemukan</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Pastikan ada data profil dengan ID=4 di database Anda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto min-h-screen flex items-center px-6 py-12 overflow-hidden"> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Section */}
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
            {profile.github && (
              <a 
                href={profile.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-light-text dark:text-dark-text hover:text-primary-pink transition-colors"
              >
                <FaGithub size={30} />
              </a>
            )}
            {profile.linkedin && (
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-light-text dark:text-dark-text hover:text-primary-pink transition-colors"
              >
                <FaLinkedin size={30} />
              </a>
            )}
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div 
          className="w-full flex justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.5 }} 
          animate={{ opacity: 1, scale: 1 }}   
          transition={{ duration: 0.5 }}
        >
          {profile.foto ? (
            <motion.img 
              src={profile.? `${profile.foto.replace('http://', 'https://')}?t=${Date.now()}`: null}
              alt={profile.nama} 
              className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl border-4 border-primary-pink" 
              whileHover={{ scale: 1.05 }} 
              transition={{ type: 'spring', stiffness: 300 }}
              onLoad={() => console.log('✅ Image loaded successfully:', profile.foto)}
              onError={(e) => {
                console.error('❌ Image failed to load:', profile.foto);
                console.error('❌ Image error event:', e);
                // Fallback ke avatar dengan initial
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.nama)}&size=300&background=EC4899&color=fff&bold=true`;
              }}
            />
          ) : (
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-primary-pink flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
              {profile.nama?.charAt(0) || '?'}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HomePage;

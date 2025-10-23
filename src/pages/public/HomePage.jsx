// src/pages/public/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api'; 
// import Hero3D from '../../components/Hero3D'; // Hero3D tidak lagi digunakan
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Impor framer-motion untuk animasi

const HomePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // PERHATIAN: Ini adalah sumber error 401 Anda
        // Endpoint '/profile/' kemungkinan besar adalah ENDPOINT PRIVAT (butuh login).
        // Halaman Home adalah HALAMAN PUBLIK (tidak ada login).
        // Request ini kemungkinan besar akan GAGAL (401) untuk pengunjung biasa.
        const response = await api.get('/profile/'); 
        if (response.data && response.data.length > 0) {
          setProfile(response.data[0]);
        }
      } catch (error) {
        // Anda akan melihat error 401 Unauthorized di sini di konsol browser
        console.error("Gagal mengambil data profile (kemungkinan 401):", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // [] berarti 'jalankan sekali saat mount'

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!profile) {
    // Pesan ini akan muncul jika request gagal (misalnya karena 401)
    return (
      <div className="min-h-screen flex justify-center items-center text-center px-4">
        Gagal memuat data profile. (Jika Anda developer, cek konsol. Kemungkinan besar ini error 401 Unauthorized karena endpoint /profile/ memerlukan login).
      </div>
    );
  }

  // Jika data ada, tampilkan Hero Section
  return (
    // overflow-hidden ditambahkan untuk mencegah scrollbar saat animasi slide-in
    <section className="container mx-auto min-h-screen flex items-center px-6 py-12 overflow-hidden"> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Bagian Kiri: Teks & Info (Dengan Animasi) */}
        <motion.div 
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }} // Mulai dari kiri & transparan
          animate={{ opacity: 1, x: 0 }}   // Masuk ke posisi normal
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-lg text-primary-pink">Halo, nama saya</span>
          <h1 className="text-5xl md:text-7xl font-bold my-4 text-light-text dark:text-dark-text">
            {profile.nama}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            {profile.deskripsi_singkat}
          </p>

          {/* Tombol Aksi */}
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

          {/* Ikon Sosmed */}
          <div className="flex space-x-6">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-light-text dark:text-dark-text hover:text-primary-pink transition-colors">
              <FaGithub size={30} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-light-text dark:text-dark-text hover:text-primary-pink transition-colors">
              <FaLinkedin size={30} />
            </a>
          </div>
        </motion.div>

        {/* Bagian Kanan: Foto Profil Bulat (Pengganti Hero3D) */}
        <motion.div 
          className="w-full flex justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.5 }} // Mulai dari kecil & transparan
          animate={{ opacity: 1, scale: 1 }}   // Tampil ke ukuran normal
          transition={{ duration: 0.5 }}
        >
          {profile.foto ? ( // Menggunakan profile.foto (sesuai AboutPage.jsx)
            <motion.img 
              src={profile.foto} 
              alt={profile.nama} 
              className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl border-4 border-primary-pink" 
              whileHover={{ scale: 1.05 }} // Efek hover dari AboutPage
              transition={{ type: 'spring', stiffness: 300 }} // Transisi pegas untuk hover
            />
          ) : (
            // Fallback jika tidak ada foto
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

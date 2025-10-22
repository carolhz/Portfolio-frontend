// src/pages/public/AboutPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { motion } from 'framer-motion'; // Kita akan pakai untuk animasi

// Definisikan base URL backend kita untuk mengambil gambar
const BACKEND_URL = 'http://127.0.0.1:8000';

const AboutPage = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil 3 data sekaligus secara paralel
        const [profileRes, skillsRes, toolsRes] = await Promise.all([
          api.get('/profile/'),
          api.get('/skills/'),
          api.get('/tools/')
        ]);

        // Set profile (ambil data pertama)
        if (profileRes.data && profileRes.data.length > 0) {
          setProfile(profileRes.data[0]);
        }
        // Set skills & tools
        setSkills(skillsRes.data);
        setTools(toolsRes.data);

      } catch (error) {
        console.error("Gagal mengambil data 'about':", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex justify-center items-center">Data profile tidak ditemukan. (Pastikan Anda sudah mengisinya di Admin).</div>;
  }

  // Varian animasi untuk 'card' skill/tool
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.1, y: -5, transition: { type: 'spring', stiffness: 300 } }
  };

  return (
    <div className="container mx-auto px-6 py-16">

      {/* --- BAGIAN 1: PROFILE & FOTO --- */}
      <section className="flex flex-col md:flex-row items-center gap-12 mb-20">
        {/* Foto Profile */}
        <motion.img
          src={profile.foto}
          alt={profile.nama}
          className="w-64 h-64 rounded-full object-cover shadow-2xl border-4 border-primary-pink"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        />
        {/* Deskripsi Lengkap */}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tentang <span className="text-primary-pink">Saya</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {profile.deskripsi_lengkap}
          </p>
        </motion.div>
      </section>

      {/* --- BAGIAN 2: VISI & MISI --- */}
      <section className="grid md:grid-cols-2 gap-8 mb-20">
        <motion.div 
          className="p-8 bg-light-card dark:bg-dark-card rounded-lg shadow-lg"
          initial="hidden" animate="visible" variants={cardVariants}
        >
          <h2 className="text-3xl font-bold mb-4 text-primary-pink">Visi</h2>
          <p className="text-gray-700 dark:text-gray-300">{profile.visi}</p>
        </motion.div>
        <motion.div 
          className="p-8 bg-light-card dark:bg-dark-card rounded-lg shadow-lg"
          initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-primary-pink">Misi</h2>
          <p className="text-gray-700 dark:text-gray-300">{profile.misi}</p>
        </motion.div>
      </section>

      {/* --- BAGIAN 3: SKILLS --- */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold text-center mb-10">Keahlian (Skills)</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              className="py-3 px-6 bg-light-card dark:bg-dark-card rounded-full shadow-md cursor-default"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.1 }} // Efek stagger
            >
              <span className="font-semibold">{skill.nama}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- BAGIAN 4: TOOLS --- */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-10">Tools yang Digunakan</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              className="py-3 px-6 bg-light-card dark:bg-dark-card rounded-full shadow-md cursor-default"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.1 }} // Efek stagger
            >
              <span className="font-semibold">{tool.nama}</span>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
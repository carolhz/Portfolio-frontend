// src/pages/public/ProjectDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';
import { motion } from 'framer-motion';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 

// 1. IMPORT IKON PANAH
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProjectDetailPage = () => {
  const { id } = useParams(); 
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (kode fetchProject Anda) ...
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/${id}/`);
        setProject(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail proyek:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // 2. BUAT FUNGSI RENDER PANAH KUSTOM
  // Ini fungsi untuk panah KIRI
  const customRenderArrowPrev = (onClickHandler, hasPrev, label) =>
    hasPrev && (
      <button
        type="button"
        onClick={onClickHandler}
        title={label}
        className="absolute z-10 left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/60 transition-all opacity-80 hover:opacity-100"
      >
        <FaChevronLeft size={20} />
      </button>
    );

  // Ini fungsi untuk panah KANAN
  const customRenderArrowNext = (onClickHandler, hasNext, label) =>
    hasNext && (
      <button
        type="button"
        onClick={onClickHandler}
        title={label}
        className="absolute z-10 right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/60 transition-all opacity-80 hover:opacity-100"
      >
        <FaChevronRight size={20} />
      </button>
    );


  if (loading) {
    // ... (return loading) ...
  }
  if (!project) {
    // ... (return not found) ...
  }

  return (
    <div className="container mx-auto px-6 py-16">
      {/* --- JUDUL & ROLE --- */}
      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {project.judul}
      </motion.h1>
      
      <motion.h2 
        className="text-2xl text-primary-pink text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {project.role}
      </motion.h2>

      {/* --- GAMBAR (CAROUSEL) --- */}
      <motion.div 
        className="mb-12 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Carousel 
          // 3. GUNAKAN FUNGSI RENDER KUSTOM DI SINI
          renderArrowPrev={customRenderArrowPrev}
          renderArrowNext={customRenderArrowNext}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false} 
          showStatus={false} // Sembunyikan "1 of 3"
          className="shadow-2xl rounded-lg overflow-hidden" // Pindahkan styling ke sini
        >
          {/* Gambar Thumbnail */}
          <div>
            <img 
              src={project.gambar_thumbnail} 
              alt={project.judul}
              className="w-full h-auto object-contain"
            />
          </div>
          {/* Gambar Galeri */}
          {project.images.map((img) => (
            <div key={img.id}>
              <img 
                src={img.image} 
                alt={project.judul}
                className="w-full h-auto object-contain"
              />
            </div>
          ))}
        </Carousel>
      </motion.div>

      {/* --- LAYOUT KONTEN (GRID) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
        {/* Kolom Kiri: Deskripsi */}
        <motion.div 
          className="lg:col-span-2 bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-4">Deskripsi</h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {project.deskripsi}
          </p>
        </motion.div>

        {/* Kolom Kanan: Skills & Tools */}
        <motion.div 
          className="lg:col-span-1 bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold mb-6">Teknologi</h3>
          
          <h4 className="text-xl font-semibold mb-3 text-primary-pink">Skills</h4>
          <div className="flex flex-wrap gap-3 mb-6">
            {project.skills.map((skill) => (
              <span key={skill.id} className="py-2 px-4 bg-light-bg dark:bg-dark-bg rounded-full shadow-sm text-sm font-medium">
                {skill.nama}
              </span>
            ))}
          </div>
          
          <h4 className="text-xl font-semibold mb-3 text-primary-pink">Tools</h4>
          <div className="flex flex-wrap gap-3">
            {project.tools.map((tool) => (
              <span key={tool.id} className="py-2 px-4 bg-light-bg dark:bg-dark-bg rounded-full shadow-sm text-sm font-medium">
                {tool.nama}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default ProjectDetailPage;
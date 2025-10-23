// src/pages/public/ProjectsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import ProjectCard from '../../components/ProjectCard'; 
import { motion } from 'framer-motion';

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, 
    },
  },
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]); // ✅ Default value array kosong
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ Tambah state error

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects/');
        
        // ✅ Pengecekan yang lebih aman
        console.log('Response data:', response.data); // Debug: lihat struktur data
        
        if (response.data.results && Array.isArray(response.data.results)) {
          setProjects(response.data.results);
        } else if (Array.isArray(response.data)) {
          setProjects(response.data); // Kalau langsung array
        } else {
          setProjects([]); // Fallback ke array kosong
          console.warn('Format data tidak sesuai:', response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data proyek:", error);
        setError(error.message); // ✅ Simpan error message
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  // ✅ Tampilkan error jika ada
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary-pink text-white rounded">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // ✅ Tampilkan pesan jika tidak ada proyek
  if (projects.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Proyek <span className="text-primary-pink">Saya</span>
        </h1>
        <p className="text-center text-gray-500">Belum ada proyek untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Proyek <span className="text-primary-pink">Saya</span>
      </h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </div>
  );
};

export default ProjectsPage;

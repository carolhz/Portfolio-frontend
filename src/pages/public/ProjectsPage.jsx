// src/pages/public/ProjectsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import ProjectCard from '../../components/ProjectCard'; // Impor card kita
import { motion } from 'framer-motion';

// Varian animasi untuk 'pembungkus' grid
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Animasi 'stagger' (muncul satu per satu)
    },
  },
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Ambil data dari /api/projects/ (sudah diurutkan by ID di Django)
        const response = await api.get('/projects/');
        setProjects(response.data);
      } catch (error) {
        console.error("Gagal mengambil data proyek:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Proyek <span className="text-primary-pink">Saya</span>
      </h1>

      {/* Grid Container dengan Animasi */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Setiap ProjectCard adalah 'child' dari motion.div.
          Karena parent-nya punya 'staggerChildren', 
          dan ProjectCard punya varian 'hidden' & 'visible' (dari file-nya sendiri),
          mereka akan otomatis muncul satu per satu.
        */}
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
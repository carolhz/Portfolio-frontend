import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const baseURL = import.meta.env.VITE_API_URL || '';

const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project.id}`}>
      <motion.div
        className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl overflow-hidden flex flex-col h-full"
        variants={cardItemVariants}
        whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
      >
        <img
          src={baseURL + project.gambar_thumbnail}
          alt={project.judul}
          className="w-full h-48 object-cover"
        />
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-2xl font-bold mb-2 text-primary-pink">{project.judul}</h3>
          <p className="text-light-text dark:text-dark-text mb-4 flex-grow">
            {project.deskripsi}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.map((skill) => (
              <span
                key={skill.id}
                className="text-xs font-semibold bg-primary-pink/10 text-primary-pink px-2 py-1 rounded-full"
              >
                {skill.nama}
              </span>
            ))}
            {project.tools.map((tool) => (
              <span
                key={tool.id}
                className="text-xs font-semibold bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full"
              >
                {tool.nama}
              </span>
            ))}
          </div>
        </div>
        <div className="flex space-x-4 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 p-6">
          {project.link_repo && (
            <a
              href={project.link_repo}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-pink transition-colors z-10 relative"
              aria-label="GitHub Repository"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub size={24} />
            </a>
          )}
          {project.link_demo && (
            <a
              href={project.link_demo}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-pink transition-colors z-10 relative"
              aria-label="Live Demo"
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt size={22} />
            </a>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default ProjectCard;
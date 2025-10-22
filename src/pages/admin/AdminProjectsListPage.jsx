// src/pages/admin/AdminProjectsListPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects/');
      setProjects(response.data);
    } catch (error) {
      console.error("Gagal fetch projects:", error);
      setMessage("Gagal memuat data proyek.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId, projectJudul) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus proyek: "${projectJudul}"?`)) {
      return;
    }

    try {
      await api.delete(`/projects/${projectId}/`);
      setMessage(`Proyek "${projectJudul}" berhasil dihapus.`);
      // Refresh daftar proyek setelah hapus
      fetchProjects();
    } catch (error) {
      console.error("Gagal delete project:", error);
      setMessage("Gagal menghapus proyek.");
    }
  };

  if (loading) {
    return <div>Loading data proyek...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

      {/* Tombol Tambah Proyek Baru */}
      <Link
        to="/admin/projects/new"
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary-pink text-white font-semibold rounded shadow hover:scale-105"
      >
        <FaPlus /> Tambah Proyek Baru
      </Link>

      {message && (
        <div className={`p-3 mb-4 rounded text-sm ${message.includes('Gagal') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {message}
        </div>
      )}

      {/* Tabel Daftar Proyek */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Thumbnail</th>
              <th className="p-2 text-left">Judul</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <img 
                    src={'http://127.0.0.1:8000' + project.gambar_thumbnail} 
                    alt={project.judul}
                    className="w-20 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-2 font-medium">{project.judul}</td>
                <td className="p-2">
                  <div className="flex gap-4">
                    <Link
                      to={`/admin/projects/edit/${project.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id, project.judul)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <p className="p-4 text-center text-gray-500">Belum ada proyek.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProjectsPage;
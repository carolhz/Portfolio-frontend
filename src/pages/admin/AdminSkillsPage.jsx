// src/pages/admin/AdminSkillsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { FaTrash } from 'react-icons/fa';

const AdminSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 1. Fungsi untuk mengambil semua skills
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await api.get('/skills/');
      setSkills(response.data);
    } catch (error) {
      console.error("Gagal fetch skills:", error);
      setMessage("Gagal memuat data skills.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Panggil fetchSkills() saat halaman di-load
  useEffect(() => {
    fetchSkills();
  }, []);

  // 3. Handle submit form untuk skill BARU
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return; // Jangan kirim jika kosong

    try {
      // Kirim data skill baru ke API
      const response = await api.post('/skills/', { nama: newSkillName });
      
      // Update state di React tanpa perlu fetch ulang
      setSkills([...skills, response.data]);
      setNewSkillName(''); // Kosongkan form
      setMessage(`Skill "${response.data.nama}" berhasil ditambahkan!`);

    } catch (error) {
      console.error("Gagal create skill:", error);
      setMessage("Gagal menambahkan skill.");
    }
  };

  // 4. Handle hapus skill
  const handleDelete = async (skillId) => {
    // Konfirmasi sebelum hapus
    if (!window.confirm("Apakah Anda yakin ingin menghapus skill ini?")) {
      return;
    }

    try {
      // Panggil API untuk hapus
      await api.delete(`/skills/${skillId}/`);
      
      // Update state di React
      setSkills(skills.filter(skill => skill.id !== skillId));
      setMessage("Skill berhasil dihapus.");

    } catch (error) {
      console.error("Gagal delete skill:", error);
      setMessage("Gagal menghapus skill.");
    }
  };

  if (loading) {
    return <div>Loading data skills...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Skills</h1>

      {/* Form untuk menambah skill baru */}
      <form onSubmit={handleCreate} className="mb-8 flex gap-4">
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Nama skill baru (misal: React)"
          className="flex-grow p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary-pink text-white font-semibold rounded shadow hover:scale-105"
        >
          Tambah
        </button>
      </form>

      {/* Pesan status */}
      {message && (
        <div className={`p-3 mb-4 rounded text-sm ${message.includes('Gagal') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {message}
        </div>
      )}

      {/* Daftar Skill yang Sudah Ada */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Daftar Skill Saat Ini</h2>
        <ul className="space-y-2">
          {skills.map(skill => (
            <li
              key={skill.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded"
            >
              <span className="font-medium">{skill.nama}</span>
              <button
                onClick={() => handleDelete(skill.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Hapus skill"
              >
                <FaTrash />
              </button>
            </li>
          ))}
          {skills.length === 0 && (
            <li className="text-gray-500">Belum ada skill yang ditambahkan.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminSkillsPage;
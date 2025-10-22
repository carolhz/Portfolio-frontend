// src/pages/admin/AdminToolsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { FaTrash } from 'react-icons/fa';

const AdminToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [newToolName, setNewToolName] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchTools = async () => { 
    try {
      setLoading(true);
      const response = await api.get('/tools/'); 
      setTools(response.data);
    } catch (error) {
      console.error("Gagal fetch tools:", error);
      setMessage("Gagal memuat data tools."); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools(); 
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newToolName.trim()) return; 

    try {
      const response = await api.post('/tools/', { nama: newToolName }); 
      
      setTools([...tools, response.data]); 
      setNewToolName('');
      setMessage(`Tool "${response.data.nama}" berhasil ditambahkan!`);

    } catch (error) {
      console.error("Gagal create tool:", error); 
      setMessage("Gagal menambahkan tool."); 
    }
  };

  // 4. Handle hapus tool
  const handleDelete = async (toolId) => { 
    // Konfirmasi sebelum hapus
    if (!window.confirm("Apakah Anda yakin ingin menghapus tool ini?")) { 
      return;
    }

    try {
      // Panggil API untuk hapus
      await api.delete(`/tools/${toolId}/`); 
      
      // Update state di React
      setTools(tools.filter(tool => tool.id !== toolId));
      setMessage("Tool berhasil dihapus."); 

    } catch (error) {
      console.error("Gagal delete tool:", error); 
      setMessage("Gagal menghapus tool."); 
    }
  };

  if (loading) {
    return <div>Loading data tools...</div>; 
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Tools</h1>

      {/* Form untuk menambah tool baru */}
      <form onSubmit={handleCreate} className="mb-8 flex gap-4">
        <input
          type="text"
          value={newToolName} 
          onChange={(e) => setNewToolName(e.target.value)} 
          placeholder="Nama tool baru (misal: VS Code)"
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

      {/* Daftar Tool yang Sudah Ada */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Daftar Tool Saat Ini</h2> {/* Ganti 'Skill' */}
        <ul className="space-y-2">
          {tools.map(tool => ( 
            <li
              key={tool.id} 
              className="flex justify-between items-center p-3 bg-gray-50 rounded"
            >
              <span className="font-medium">{tool.nama}</span> 
              <button
                onClick={() => handleDelete(tool.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Hapus tool" 
              >
                <FaTrash />
              </button>
            </li>
          ))}
          {tools.length === 0 && ( 
            <li className="text-gray-500">Belum ada tool yang ditambahkan.</li> 
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminToolsPage;
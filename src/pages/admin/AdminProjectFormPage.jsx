// src/pages/admin/AdminProjectFormPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useNavigate, useParams } from 'react-router-dom';

const AdminProjectFormPage = () => {
  const { id } = useParams(); // Ambil 'id' dari URL. Jika 'new', id akan undefined
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  // State untuk form teks
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    link_demo: '',
    link_repo: '',
    role: '', 
  });
  
  // State untuk file
  const [gambarThumbnail, setGambarThumbnail] = useState(null); 
  const [gambarPreview, setGambarPreview] = useState(''); 
  const [detailImages, setDetailImages] = useState(null); 
  const [existingImages, setExistingImages] = useState([]); 

  // State untuk relasi
  const [allSkills, setAllSkills] = useState([]);
  const [allTools, setAllTools] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  // State UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Fetch data yang dibutuhkan (Skills, Tools, dan Project jika Edit)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Selalu fetch skills & tools
        const [skillsRes, toolsRes] = await Promise.all([
          api.get('/skills/'),
          api.get('/tools/')
        ]);
        setAllSkills(skillsRes.data);
        setAllTools(toolsRes.data);

        // Jika mode Edit, fetch data project
        if (isEditMode) {
          const projectRes = await api.get(`/projects/${id}/`);
          const project = projectRes.data;
          setFormData({
            judul: project.judul,
            deskripsi: project.deskripsi,
            link_demo: project.link_demo || '',
            link_repo: project.link_repo || '',
            role: project.role || '',
          });
          setGambarPreview(project.gambar_thumbnail); // (Menggunakan proxy Anda)
          setSelectedSkills(project.skills.map(s => s.id));
          setSelectedTools(project.tools.map(t => t.id));
          setExistingImages(project.images); 
        }
      } catch (error) {
        console.error("Gagal fetch data form:", error);
        setMessage("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  // 2. Kumpulan Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambarThumbnail(file);
      setGambarPreview(URL.createObjectURL(file));
    }
  };
  
  const handleDetailImagesChange = (e) => {
    setDetailImages(e.target.files); // e.target.files adalah FileList
  };

  const handleSkillChange = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(option => parseInt(option.value));
    setSelectedSkills(values);
  };

  const handleToolChange = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(option => parseInt(option.value));
    setSelectedTools(values);
  };

  const handleDeleteImage = async (imageId) => {
    // Fungsionalitas hapus via API belum dibuat.
    // Kita tampilkan alert sebagai workaround.
    alert("Untuk menghapus gambar, silakan gunakan Admin Panel Django di /admin");
    // Jika API sudah siap, kodenya akan seperti ini:
    // try {
    //   await api.delete(`/project-images/${imageId}/`);
    //   setExistingImages(existingImages.filter(img => img.id !== imageId));
    // } catch (error) {
    //   alert("Gagal menghapus gambar.");
    // }
  };

  // 3. Handler untuk Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const data = new FormData();
    
    // Append data teks
    data.append('judul', formData.judul);
    data.append('deskripsi', formData.deskripsi);
    data.append('link_demo', formData.link_demo);
    data.append('link_repo', formData.link_repo);
    data.append('role', formData.role);

    // Append file thumbnail (jika ada)
    if (gambarThumbnail) {
      data.append('gambar_thumbnail', gambarThumbnail);
    }

    // Append relasi many-to-many
    selectedSkills.forEach(id => data.append('skills', id));
    selectedTools.forEach(id => data.append('tools', id));
    
    // Append file gambar detail (jika ada)
    if (detailImages) {
      Array.from(detailImages).forEach((file) => {
        data.append('images', file); // 'images' harus cocok dengan key di views.py
      });
    }

    try {
      if (isEditMode) {
        // Mode EDIT (PATCH)
        await api.patch(`/projects/${id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage("Proyek berhasil di-update!");
      } else {
        // Mode CREATE (POST)
        await api.post('/projects/', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage("Proyek baru berhasil dibuat!");
      }
      // Setelah sukses, kembali ke halaman daftar
      setTimeout(() => navigate('/admin/projects'), 1500);
      
    } catch (error) {
      console.error("Gagal simpan proyek:", error.response?.data);
      setMessage("Gagal menyimpan proyek. Cek konsol.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading form...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? 'Edit Proyek' : 'Tambah Proyek Baru'}
      </h1>

      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Gagal') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Judul, Role, & Deskripsi */}
        <div className="p-4 bg-white rounded shadow space-y-4">
          <div>
            <label className="block font-medium">Judul Proyek</label>
            <input type="text" name="judul" value={formData.judul} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block font-medium">Role Anda</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Misal: Fullstack Developer, UI/UX Designer"/>
          </div>
          <div>
            <label className="block font-medium">Deskripsi</label>
            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="5" className="w-full p-2 border rounded" required />
          </div>
        </div>

        {/* Gambar Thumbnail */}
        <div className="p-4 bg-white rounded shadow">
          <label className="block font-medium">Gambar Thumbnail</label>
          {gambarPreview && (
            <img src={gambarPreview} alt="Preview" className="w-1/2 h-auto rounded object-cover my-2"/>
          )}
          <input type="file" onChange={handleFileChange} className="w-full text-sm" accept="image/*" />
          {!isEditMode && <small>Wajib diisi untuk proyek baru.</small>}
        </div>

        {/* Gambar Detail (Multi-upload) */}
        <div className="p-4 bg-white rounded shadow">
          <label className="block font-medium">Tambah Gambar Detail (Opsional)</label>
          <input 
            type="file" 
            onChange={handleDetailImagesChange} 
            multiple 
            className="w-full text-sm" 
            accept="image/*" 
          />
          <p className="text-xs text-gray-500 mt-1">Anda bisa memilih banyak gambar sekaligus.</p>

          {isEditMode && existingImages.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Gambar yang sudah ada:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {existingImages.map(img => (
                  <div key={img.id} className="relative">
                    <img 
                      src={img.image} 
                      alt="detail" 
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button 
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs -mt-1 -mr-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills & Tools (Multi-select) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded shadow">
            <label className="block font-medium mb-2">Skills (tahan Ctrl/Cmd untuk memilih banyak)</label>
            <select 
              multiple 
              value={selectedSkills}
              onChange={handleSkillChange}
              className="w-full h-40 p-2 border rounded"
            >
              {allSkills.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.nama}</option>
              ))}
            </select>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <label className="block font-medium mb-2">Tools (tahan Ctrl/Cmd untuk memilih banyak)</label>
            <select 
              multiple 
              value={selectedTools}
              onChange={handleToolChange}
              className="w-full h-40 p-2 border rounded"
            >
              {allTools.map(tool => (
                <option key={tool.id} value={tool.id}>{tool.nama}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Links */}
        <div className="p-4 bg-white rounded shadow grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Link Demo (opsional)</label>
            <input type="url" name="link_demo" value={formData.link_demo} onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://..."/>
          </div>
          <div>
            <label className="block font-medium">Link Repo (opsional)</label>
            <input type="url" name="link_repo" value={formData.link_repo} onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://github.com/..."/>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-primary-pink text-white font-bold rounded-lg shadow hover:scale-105 transition-transform disabled:opacity-50"
        >
          {saving ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Buat Proyek')}
        </button>
      </form>
    </div>
  );
};

export default AdminProjectFormPage;
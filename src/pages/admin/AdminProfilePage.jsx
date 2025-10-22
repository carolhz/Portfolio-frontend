// src/pages/admin/AdminProfilePage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const AdminProfilePage = () => {
  const [profileId, setProfileId] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi_singkat: '',
    deskripsi_lengkap: '',
    visi: '',
    misi: '',
    linkedin: '',
    github: '',
    email: '',
  });
  const [foto, setFoto] = useState(null); // Untuk file foto baru
  const [fotoPreview, setFotoPreview] = useState(''); // Untuk preview foto
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Ambil data profile yang ada saat halaman di-load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/profile/');
        if (response.data && response.data.length > 0) {
          const profile = response.data[0];
          setFormData({
            nama: profile.nama,
            deskripsi_singkat: profile.deskripsi_singkat,
            deskripsi_lengkap: profile.deskripsi_lengkap,
            visi: profile.visi,
            misi: profile.misi,
            linkedin: profile.linkedin,
            github: profile.github,
            email: profile.email,
          });
          setProfileId(profile.id); // Simpan ID untuk update
          setFotoPreview('http://127.0.0.1:8000' + profile.foto); // Tampilkan foto yg ada
        }
      } catch (error) {
        console.error("Gagal fetch profile:", error);
        setMessage("Gagal memuat data profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. Handle perubahan di form input teks
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle perubahan di input file (foto)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      // Buat preview lokal untuk file yg baru dipilih
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // 4. Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileId) {
      setMessage("Profile ID tidak ditemukan.");
      return;
    }
    
    setSaving(true);
    setMessage('');

    // Kita harus pakai FormData karena kita mengirim file (foto)
    const data = new FormData();
    
    // Tambahkan semua data teks ke FormData
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    // Tambahkan file foto HANYA JIKA user memilih file baru
    if (foto) {
      data.append('foto', foto);
    }
    
    // Header Authorization sudah di-set global oleh Zustand/Axios
    // Tapi kita perlu set Content-Type ke 'multipart/form-data'
    try {
      await api.patch(`/profile/${profileId}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage("Profile berhasil di-update!");
    } catch (error) {
      console.error("Gagal update profile:", error.response?.data);
      setMessage("Gagal update profile. Cek konsol untuk detail.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading data profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Gagal') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri: Input Teks */}
          <div className="md:col-span-2 space-y-4">
            {/* Nama */}
            <div>
              <label className="block font-medium">Nama</label>
              <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full p-2 border rounded"/>
            </div>
            {/* Email */}
            <div>
              <label className="block font-medium">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded"/>
            </div>
            {/* Deskripsi Singkat (Homepage) */}
            <div>
              <label className="block font-medium">Deskripsi Singkat (Homepage)</label>
              <textarea name="deskripsi_singkat" value={formData.deskripsi_singkat} onChange={handleChange} rows="3" className="w-full p-2 border rounded"/>
            </div>
          </div>

          {/* Kolom Kanan: Foto */}
          <div className="space-y-2">
            <label className="block font-medium">Foto Profile</label>
            {fotoPreview && (
              <img src={fotoPreview} alt="Preview" className="w-full h-auto rounded object-cover aspect-square"/>
            )}
            <input type="file" onChange={handleFileChange} className="w-full text-sm"/>
          </div>
        </div>

        {/* Bagian Bawah: Input Teks Panjang & Sosmed */}
        <hr/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Deskripsi Lengkap (About Page)</label>
            <textarea name="deskripsi_lengkap" value={formData.deskripsi_lengkap} onChange={handleChange} rows="5" className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block font-medium">Visi</label>
            <textarea name="visi" value={formData.visi} onChange={handleChange} rows="5" className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block font-medium">Misi</label>
            <textarea name="misi" value={formData.misi} onChange={handleChange} rows="5" className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block font-medium">Link LinkedIn</label>
            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://linkedin.com/in/..."/>
            <label className="block font-medium mt-4">Link GitHub</label>
            <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://github.com/..."/>
          </div>
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-primary-pink text-white font-bold rounded-lg shadow hover:scale-105 transition-transform disabled:opacity-50"
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
};

export default AdminProfilePage;
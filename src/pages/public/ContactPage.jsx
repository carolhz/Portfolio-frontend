// src/pages/public/ContactPage.jsx
import React, { useState } from 'react';
import api from '../../lib/api';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      // Kirim data ke API Django '/api/contact/'
      const response = await api.post('/contact/', formData);

      setStatus({ loading: false, success: response.data.success, error: null });
      // Kosongkan form setelah berhasil
      setFormData({ nama: '', email: '', pesan: '' });

    } catch (error) {
      setStatus({
        loading: false,
        success: null,
        error: error.response?.data?.error || "Terjadi kesalahan saat mengirim pesan.",
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-16 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Hubungi <span className="text-primary-pink">Saya</span>
      </h1>
      <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Punya pertanyaan atau tawaran proyek? Jangan ragu untuk mengirim pesan. 
        Saya akan segera membalasnya.
      </p>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-8 bg-light-card dark:bg-dark-card rounded-lg shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <label htmlFor="nama" className="block mb-2 font-semibold">Nama</label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded border bg-light-bg dark:bg-dark-bg border-gray-300 dark:border-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded border bg-light-bg dark:bg-dark-bg border-gray-300 dark:border-gray-700"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="pesan" className="block mb-2 font-semibold">Pesan</label>
          <textarea
            id="pesan"
            name="pesan"
            rows="5"
            value={formData.pesan}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded border bg-light-bg dark:bg-dark-bg border-gray-300 dark:border-gray-700"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className="w-full py-3 bg-primary-pink text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
        >
          {status.loading ? 'Mengirim...' : 'Kirim Pesan'}
        </button>

        {/* Tampilkan pesan status */}
        {status.success && (
          <p className="text-green-500 mt-4 text-center">{status.success}</p>
        )}
        {status.error && (
          <p className="text-red-500 mt-4 text-center">{status.error}</p>
        )}
      </motion.form>

      {/* Nanti kita tambahkan sosmed di bawah sini */}

    </div>
  );
};

export default ContactPage;
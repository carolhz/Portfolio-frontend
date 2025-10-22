// src/lib/api.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// 1. Tentukan baseURL
// import.meta.env.VITE_API_URL adalah variabel yang akan kita set di Vercel/Netlify
// Jika tidak ada (saat 'npm run dev'), gunakan string kosong agar proxy bekerja
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: baseURL + '/api', // Ini akan menjadi 'https://...railway.app/api'
});

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
// src/lib/api.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Ambil baseURL dari env (Vercel/Production) atau fallback lokal
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Hapus trailing slash biar gak dobel
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

const api = axios.create({
  baseURL, // udah langsung aman
});

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

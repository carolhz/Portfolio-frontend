// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api'; // Impor instance axios kita

// 'persist' akan menyimpan state ke localStorage
// Jadi, admin tetap login walaupun browser di-refresh

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State Awal
      accessToken: null,
      refreshToken: null,
      isAdmin: false,

      // Aksi untuk login
      login: async (username, password) => {
        try {
          // 1. Minta token ke Django
          const response = await api.post('/token/', {
            username,
            password,
          });

          const { access, refresh } = response.data;

          // 2. Simpan token ke state
          set({
            accessToken: access,
            refreshToken: refresh,
            isAdmin: true,
          });

          // 3. Panggil aksi untuk setup header axios
          get().setupAxiosHeaders();
          
          return { success: true };
        } catch (error) {
          console.error("Login gagal:", error);
          return { success: false, error };
        }
      },

      // Aksi untuk logout
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          isAdmin: false,
        });
        // Hapus juga header axios
        get().clearAxiosHeaders();
      },
      
      // Fungsi internal untuk otomatis menambahkan token ke request API
      setupAxiosHeaders: () => {
        const { accessToken } = get();
        if (accessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
      },
      
      // Fungsi internal untuk menghapus token dari request API
      clearAxiosHeaders: () => {
        delete api.defaults.headers.common['Authorization'];
      },
      
      // TODO NANTI: Kita perlu tambahkan fungsi untuk 'refresh token'
      // agar login admin bisa bertahan lama
    }),
    {
      name: 'auth-storage', // nama key di localStorage
    }
  )
);

// PENTING: Panggil setupAxiosHeaders() saat aplikasi pertama kali load
// Ini agar header axios langsung ter-setup jika user sudah login (dari localStorage)
useAuthStore.getState().setupAxiosHeaders();
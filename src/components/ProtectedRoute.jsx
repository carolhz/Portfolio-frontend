// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = () => {
  // Ambil state 'isAdmin' dari Zustand store
  const { isAdmin } = useAuthStore((state) => state);

  if (!isAdmin) {
    // Jika BUKAN admin, lempar/redirect ke halaman /login
    return <Navigate to="/login" replace />;
  }

  // Jika admin, izinkan akses ke halaman yang diminta
  // <Outlet /> akan merender layout/halaman admin
  return <Outlet />;
};

export default ProtectedRoute;
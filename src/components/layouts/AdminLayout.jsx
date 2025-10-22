// src/components/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminLayout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li><Link to="/admin" className="block py-2">Dashboard</Link></li>
            <li><Link to="/admin/profile" className="block py-2">Edit Profile</Link></li>
            <li><Link to="/admin/projects" className="block py-2">Manage Projects</Link></li>
            <li><Link to="/admin/skills" className="block py-2">Manage Skills</Link></li>
            <li><Link to="/admin/tools" className="block py-2">Manage Tools</Link></li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-primary-pink text-white py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Konten Utama Admin */}
      <main className="flex-1 p-8">
        <Outlet /> {/* Halaman admin (misal: Dashboard) akan dirender di sini */}
      </main>
    </div>
  );
};

export default AdminLayout;
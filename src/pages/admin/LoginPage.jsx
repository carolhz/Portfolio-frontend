// src/pages/admin/LoginPage.jsx
import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Navigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  // Jika sudah login, redirect ke dashboard
  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { success } = await login(username, password);

    if (success) {
      // Jika sukses, redirect ke dashboard admin
      navigate('/admin');
    } else {
      // Jika gagal, tampilkan error
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
      <form 
        onSubmit={handleSubmit} 
        className="p-8 bg-light-card dark:bg-dark-card rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-primary-pink">
          Admin Login
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-2 text-light-text dark:text-dark-text">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-light-text dark:text-dark-text">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary-pink text-white py-2 rounded hover:bg-opacity-80"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
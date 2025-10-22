// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Halaman Publik
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ProjectsPage from './pages/public/ProjectsPage';
import ContactPage from './pages/public/ContactPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';

// Halaman Admin
import LoginPage from './pages/admin/LoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProfilePage from './pages/admin/AdminProfilePage'; 
import AdminProjectsPage from './pages/admin/AdminProjectsListPage'; 
import AdminProjectFormPage from './pages/admin/AdminProjectFormPage';
import AdminSkillsPage from './pages/admin/AdminSkillsPage';
import AdminToolsPage from './pages/admin/AdminToolsPage';

const router = createBrowserRouter([
  {

    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> }, 
      { path: 'about', element: <AboutPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'projects/:id', element: <ProjectDetailPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  { 
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'profile', element: <AdminProfilePage /> }, 
          { path: 'skills', element: <AdminSkillsPage /> },
          { path: 'tools', element: <AdminToolsPage /> },
          { path: 'projects', element: <AdminProjectsPage /> },
          { path: 'projects/new', element: <AdminProjectFormPage /> }, 
          { path: 'projects/edit/:id', element: <AdminProjectFormPage /> },
        ],
      },
    ],
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;

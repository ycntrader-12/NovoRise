import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { AdminDashboardPortal } from './components/dashboard/AdminDashboardPortal';
import './index.css';

ReactDOM.createRoot(document.getElementById('admin-root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AdminDashboardPortal />
    </AuthProvider>
  </React.StrictMode>
);

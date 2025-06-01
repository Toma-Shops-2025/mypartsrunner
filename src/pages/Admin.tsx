import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminPanel } from '@/components/AdminPanel';
import { Navigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPanel />
    </div>
  );
};

export default Admin;
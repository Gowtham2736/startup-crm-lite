import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

// Lazy loading pages for better performance
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Leads = React.lazy(() => import('../pages/Leads'));
const Analytics = React.lazy(() => import('../pages/Analytics'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Protected Layout that injects the sidebar and enforces token access
const ProtectedLayout = () => {
  const { user, isLoading } = useAuth();
  const token = localStorage.getItem('crm-token');
  
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading && token) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background w-full">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy loading pages for better performance
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Leads = React.lazy(() => import('../pages/Leads'));
const Analytics = React.lazy(() => import('../pages/Analytics'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
          <AppRoutes />
        </main>
        
        {/* Global Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;

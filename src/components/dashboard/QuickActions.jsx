import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Download } from 'lucide-react';

/**
 * QuickActions component for common tasks
 */
export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">Quick Actions</h3>
      <div className="flex flex-col space-y-3">
        <Link 
          to="/leads" 
          className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          <span>Add New Lead</span>
        </Link>
        <Link 
          to="/leads" 
          className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:bg-gray-800 transition"
        >
          <Users size={18} />
          <span>View All Leads</span>
        </Link>
        <button 
          className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:bg-gray-800 transition"
          onClick={() => alert("Export functionality coming soon!")}
        >
          <Download size={18} />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
}

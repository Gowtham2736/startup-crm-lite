import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyAnalyticsState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[400px]">
      <div className="w-16 h-16 bg-blue-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
        <BarChart3 size={32} className="text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
        No analytics available yet
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-8">
        Add your first lead to start tracking business performance and unlock actionable insights.
      </p>
      <Link 
        to="/leads" 
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Add Lead
      </Link>
    </div>
  );
}

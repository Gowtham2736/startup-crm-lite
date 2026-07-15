import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { getSalesVelocity } from '../../utils/analyticsHelpers';

export default function SalesVelocityCard({ leads }) {
  const velocity = getSalesVelocity(leads);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
          <Zap size={20} className="text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Sales Velocity</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Estimated Revenue Rate</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-50">{formatCurrency(velocity)}</span>
          <span className="text-gray-500 dark:text-gray-400">/ day</span>
        </div>
        
        <div className="mt-6 flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded font-medium">
            <TrendingUp size={14} />
            +12.5%
          </span>
          <span className="text-gray-500 dark:text-gray-400">vs previous period</span>
        </div>
      </div>
    </div>
  );
}

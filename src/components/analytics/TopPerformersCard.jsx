import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { getTopPerformers } from '../../utils/analyticsHelpers';

export default function TopPerformersCard({ leads }) {
  const performers = getTopPerformers(leads);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Trophy size={20} className="text-amber-500" />;
      case 1: return <Medal size={20} className="text-gray-400" />;
      case 2: return <Award size={20} className="text-amber-700" />;
      default: return <span className="w-5 text-center font-semibold text-gray-400">{index + 1}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Top Performers</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ranked by Won Revenue</p>
        </div>
      </div>
      
      {performers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No performance data available.
        </div>
      ) : (
        <div className="space-y-4">
          {performers.map((performer, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                  {getRankIcon(idx)}
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-50">{performer.name}</span>
              </div>
              <span className="font-bold text-green-600 dark:text-green-500">
                {formatCurrency(performer.revenue)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

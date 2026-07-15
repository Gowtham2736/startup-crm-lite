import React from 'react';
import { Calendar } from 'lucide-react';
import { FILTER_OPTIONS } from '../../hooks/useAnalytics';

export default function AnalyticsFilters({ currentFilter, onFilterChange }) {
  const options = [
    { value: FILTER_OPTIONS.LAST_7_DAYS, label: 'Last 7 Days' },
    { value: FILTER_OPTIONS.LAST_30_DAYS, label: 'Last 30 Days' },
    { value: FILTER_OPTIONS.LAST_90_DAYS, label: 'Last 90 Days' },
    { value: FILTER_OPTIONS.THIS_YEAR, label: 'This Year' },
    { value: FILTER_OPTIONS.ALL_TIME, label: 'All Time' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 p-3 bg-white dark:bg-[#111827]/60 border border-gray-150 dark:border-gray-800 rounded-2xl w-full shadow-sm">
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2 px-2">
        <Calendar size={14} />
        Filter Period:
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentFilter === opt.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

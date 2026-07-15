import React from 'react';

const FILTERS = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

export default function FilterBar({ activeFilter, onFilterChange, leads }) {
  const getCount = (status) => {
    if (status === 'All') return leads.length;
    return leads.filter(l => l.status === status).length;
  };

  return (
    <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
      {FILTERS.map(filter => {
        const count = getCount(filter);
        const isActive = activeFilter === filter;
        
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-900'
            }`}
          >
            {filter} <span className={`ml-1 opacity-80 ${isActive ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'}`}>({count})</span>
          </button>
        );
      })}
    </div>
  );
}

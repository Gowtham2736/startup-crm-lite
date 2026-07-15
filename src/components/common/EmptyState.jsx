import React from 'react';
import { SearchX } from 'lucide-react';

export default function EmptyState({ message = "No leads found", suggestion, onClear }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-full mb-4">
        <SearchX size={32} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-1">{message}</h3>
      {suggestion && <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-6">{suggestion}</p>}
      
      {onClear && (
        <button
          onClick={onClear}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-900 transition font-medium"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

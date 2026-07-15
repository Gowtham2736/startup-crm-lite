import React from 'react';

export default function StatusBadge({ status }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Won': return 'bg-green-100 text-green-800 border-green-200';
      case 'Lost': return 'bg-red-100 text-red-800 border-red-200';
      case 'New': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700';
      case 'Meeting Scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Proposal Sent': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
}

import React from 'react';

/**
 * Visual horizontal bar showing lead status distribution
 * @param {Object} props
 * @param {Array} props.leads - Array of lead objects
 */
export default function PipelineOverview({ leads = [] }) {
  // Calculate distribution
  const total = leads.length || 1; // Prevent division by zero
  const won = leads.filter(l => l.status === 'Won').length;
  const inProgress = leads.filter(l => ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent'].includes(l.status)).length;
  const lost = leads.filter(l => l.status === 'Lost').length;
  
  const wonPct = Math.round((won / total) * 100);
  const inProgressPct = Math.round((inProgress / total) * 100);
  const lostPct = 100 - wonPct - inProgressPct; // Ensure it adds to 100%
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">Pipeline Overview</h3>
      
      {/* Visual Bar */}
      <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex mb-4">
        <div style={{ width: `${wonPct}%` }} className="bg-green-500 h-full transition-all duration-500"></div>
        <div style={{ width: `${inProgressPct}%` }} className="bg-blue-500 h-full transition-all duration-500"></div>
        <div style={{ width: `${lostPct}%` }} className="bg-red-500 h-full transition-all duration-500"></div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">Won ({won})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">In Progress ({inProgress})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">Lost ({lost})</span>
        </div>
      </div>
    </div>
  );
}

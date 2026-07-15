import React from 'react';

/**
 * StatsCard component for the dashboard
 * @param {Object} props
 * @param {string} props.title - The title of the metric
 * @param {string|number} props.value - The main value to display
 * @param {React.ReactNode} props.icon - The icon component
 * @param {string} props.change - Percentage change (e.g., '+12%', '-5%')
 * @param {string} props.color - Tailwind text color class for the icon (e.g., 'text-blue-600')
 */
export default function StatsCard({ title, value, icon, change, color }) {
  const isPositive = change?.startsWith('+');
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-900 ${color}`}>
          {icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-auto">
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-gray-400 dark:text-gray-500 text-sm ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}

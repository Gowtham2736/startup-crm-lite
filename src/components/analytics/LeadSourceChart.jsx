import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getLeadSourceStats } from '../../utils/analyticsHelpers';

export default function LeadSourceChart({ leads }) {
  const data = getLeadSourceStats(leads);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-50 mb-1">{label}</p>
          <p className="text-purple-600 dark:text-purple-400 font-medium">
            {payload[0].value} Leads
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Lead Source Analytics</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Where leads are coming from</p>
      </div>
      
      <div className="flex-1 min-h-[300px] w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            No source data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.5} className="dark:stroke-gray-700" />
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                allowDecimals={false}
              />
              <YAxis 
                dataKey="source" 
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9', opacity: 0.5 }} />
              <Bar 
                dataKey="count" 
                fill="#8B5CF6" 
                radius={[0, 4, 4, 0]}
                animationDuration={1500}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

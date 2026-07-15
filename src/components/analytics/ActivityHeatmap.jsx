import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { getActivityHeatmapData } from '../../utils/analyticsHelpers';
import { CHART_COLORS } from '../../constants/analyticsColors';

const getColorForCount = (count) => {
  if (count === 0) return CHART_COLORS.heatmap.empty;
  if (count <= 2) return CHART_COLORS.heatmap.low;
  if (count <= 5) return CHART_COLORS.heatmap.medium;
  if (count <= 10) return CHART_COLORS.heatmap.high;
  return CHART_COLORS.heatmap.max;
};

export default function ActivityHeatmap({ leads }) {
  const data = useMemo(() => getActivityHeatmapData(leads), [leads]);
  
  const gridData = useMemo(() => {
    // Create a 30-day view for simplicity, grouped into weeks (columns) and days (rows)
    const grid = [];
    const today = new Date();
    
    // We want to show the last 35 days (5 weeks x 7 days)
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const activityRecord = data.find(item => item.date === dateStr);
      const count = activityRecord ? activityRecord.count : 0;
      
      grid.push({
        date: dateStr,
        count,
        color: getColorForCount(count)
      });
    }
    
    return grid;
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
          <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Activity Heatmap</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Team activity over the last 35 days</p>
        </div>
      </div>
      
      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-[400px]">
          <div className="grid grid-cols-[repeat(5,_minmax(0,_1fr))] gap-2 grid-flow-col">
            {gridData.map((cell, idx) => (
              <div 
                key={idx} 
                className="group relative"
              >
                <div 
                  className="w-full aspect-square rounded-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: cell.color }}
                />
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-max bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  {cell.count} activities on {cell.date}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end items-center mt-4 gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.heatmap.empty }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.heatmap.low }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.heatmap.medium }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.heatmap.high }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.heatmap.max }} />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

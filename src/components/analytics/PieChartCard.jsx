import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function PieChartCard({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const totalLeads = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  // Define complete static list of statuses to match the screenshot legend layout (including 0 count items)
  const legendItems = useMemo(() => {
    const statuses = ['New', 'Contacted', 'Meeting', 'Proposal', 'Won', 'Lost'];
    return statuses.map(status => {
      const match = data.find(item => item.name === status);
      const value = match ? match.value : 0;
      const percent = totalLeads > 0 ? Math.round((value / totalLeads) * 100) : 0;
      return {
        name: status,
        value,
        percent,
        color: STATUS_COLORS[status] || '#94A3B8'
      };
    });
  }, [data, totalLeads]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      const percent = totalLeads > 0 ? Math.round((dataItem.value / totalLeads) * 100) : 0;
      return (
        <div className="bg-white dark:bg-[#111827] p-3 rounded-xl shadow-lg border border-gray-150 dark:border-gray-800">
          <p className="font-bold text-gray-900 dark:text-gray-50 text-xs">{dataItem.name}</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{dataItem.value} Leads</p>
          <p className="text-xs text-blue-500 font-semibold mt-0.5">{percent}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#111827]/60 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-xs font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">LEAD STATUS DISTRIBUTION</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Proportion of leads by pipeline stage</p>
      </div>
      
      <div className="flex-1 relative min-h-[220px] flex items-center justify-center">
        {data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-medium">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94A3B8'} className="outline-none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
        
        {data.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">{totalLeads}</span>
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">Total Leads</span>
          </div>
        )}
      </div>

      {/* Manual Legend to show 0 count items */}
      {data.length > 0 && (
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 border-t border-gray-100 dark:border-gray-800/80 pt-4">
          {legendItems.map((item, idx) => (
            <li key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-700 dark:text-gray-300 font-semibold">{item.name}</span>
              </div>
              <span className="text-gray-400 dark:text-gray-500 font-bold">{item.value} ({item.percent}%)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React, { useMemo } from 'react';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getFunnelData } from '../../utils/analyticsHelpers';

export default function FunnelChartCard({ leads }) {
  const data = getFunnelData(leads);

  const calculatedStages = useMemo(() => {
    return data.map((stage, idx) => {
      const value = stage.value;
      let conversionText = '';
      
      if (idx === 0) {
        conversionText = '(100% conversion)';
      } else {
        const prevValue = data[idx - 1].value;
        if (prevValue > 0) {
          const convRate = Math.round((value / prevValue) * 100);
          const dropOff = 100 - convRate;
          if (dropOff > 0) {
            conversionText = `${dropOff}% drop-off (${convRate}% conversion)`;
          } else {
            conversionText = `(${convRate}% conversion)`;
          }
        } else {
          conversionText = '0% drop-off (0% conversion)';
        }
      }
      
      return {
        ...stage,
        conversionText
      };
    });
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className="bg-white dark:bg-[#111827] p-3 rounded-xl shadow-lg border border-gray-150 dark:border-gray-800">
          <p className="font-bold text-gray-900 dark:text-gray-50 text-xs">{name}</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{value} Leads</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#111827]/60 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-xs font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">SALES FUNNEL VISUALIZATION</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Conversion rates and drop-offs across sales stages</p>
      </div>
      
      <div className="flex-1 min-h-[220px] flex items-center justify-center">
        {data.length === 0 || data[0].value === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-medium">
            No funnel data available
          </div>
        ) : (
          <ResponsiveContainer width="90%" height={180}>
            <FunnelChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill} 
                    fillOpacity={0.8}
                    stroke={entry.fill}
                    strokeWidth={1}
                  />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Funnel detailed conversion logs */}
      {data.length > 0 && data[0].value > 0 && (
        <ul className="space-y-2 mt-4 border-t border-gray-100 dark:border-gray-800/80 pt-4">
          {calculatedStages.map((stage, idx) => {
            const hasDropOff = stage.conversionText.includes('drop-off') && !stage.conversionText.startsWith('0% drop-off');
            const dropOffPart = hasDropOff ? stage.conversionText.split('drop-off')[0] + 'drop-off' : '';
            const conversionPart = hasDropOff ? stage.conversionText.split('drop-off')[1] : stage.conversionText;

            return (
              <li key={idx} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.fill }} />
                  <span className="text-gray-700 dark:text-gray-300 font-bold">{stage.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-right font-semibold">
                  <span className="text-gray-800 dark:text-gray-200">{stage.value} Leads</span>
                  {hasDropOff ? (
                    <>
                      <span className="text-red-500 font-bold">{dropOffPart}</span>
                      <span className="text-gray-400 dark:text-gray-500">{conversionPart}</span>
                    </>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">{conversionPart}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

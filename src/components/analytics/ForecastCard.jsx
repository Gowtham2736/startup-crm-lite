import React from 'react';
import { LineChart, Sparkles } from 'lucide-react';
import { getForecastRevenue } from '../../utils/analyticsHelpers';

export default function ForecastCard({ leads }) {
  const forecast = getForecastRevenue(leads);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <LineChart size={80} />
      </div>
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
          <Sparkles size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Revenue Forecast</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Predicted Next Month</p>
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-50">{formatCurrency(forecast)}</span>
        
        <div className="mt-6 flex items-center justify-between text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 text-xs">Confidence Score</span>
            <span className="font-medium text-gray-900 dark:text-gray-50">84% (High)</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-gray-500 dark:text-gray-400 text-xs">Growth Trend</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">Positive</span>
          </div>
        </div>
      </div>
    </div>
  );
}

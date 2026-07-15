import React, { useMemo } from 'react';
import { Users, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import { useLeads } from '../context/LeadContext';

export default function Dashboard() {
  const { leads } = useLeads();

  // Calculate metrics
  const { totalLeads, wonLeads, lostLeads, conversionRate } = useMemo(() => {
    const total = leads.length;
    const won = leads.filter(l => l.status === 'Won').length;
    const lost = leads.filter(l => l.status === 'Lost').length;
    const rate = total > 0 ? Math.round((won / total) * 100) : 0;
    return {
      totalLeads: total,
      wonLeads: won,
      lostLeads: lost,
      conversionRate: rate
    };
  }, [leads]);

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Good morning!</h1>
        <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">Here's your pipeline overview for today.</p>
      </div>

      {/* Stats Cards (4 in a row on desktop, 1 on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Leads" 
          value={totalLeads} 
          icon={<Users size={24} />} 
          change="+12%" 
          color="text-blue-600" 
        />
        <StatsCard 
          title="Won Leads" 
          value={wonLeads} 
          icon={<CheckCircle size={24} />} 
          change="+5%" 
          color="text-green-600" 
        />
        <StatsCard 
          title="Lost Leads" 
          value={lostLeads} 
          icon={<XCircle size={24} />} 
          change="-2%" 
          color="text-red-600" 
        />
        <StatsCard 
          title="Conversion Rate" 
          value={`${conversionRate}%`} 
          icon={<TrendingUp size={24} />} 
          change="+1.5%" 
          color="text-yellow-600" 
        />
      </div>

      {/* Pipeline Overview */}
      <div className="mb-8">
        <PipelineOverview leads={leads} />
      </div>

      {/* Bottom Row: Recent Leads and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentLeads leads={leads} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

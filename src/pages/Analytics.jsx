import React from 'react';
import { useLeads } from '../context/LeadContext';
import { useAnalytics } from '../hooks/useAnalytics';

// Core
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';

// Charts
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';

// Widgets
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';

// Utils
import { getStatusDistribution, getMonthlyLeads, getConversionByMonth } from '../utils/analyticsHelpers';

export default function Analytics() {
  const { leads, loading } = useLeads();
  const { filter, setFilter, filteredLeads } = useAnalytics(leads);

  if (loading) {
    return (
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
        <LoadingSkeleton />
      </div>
    );
  }

  const hasLeads = leads && leads.length > 0;

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Header and Filters */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track sales performance, pipeline health, and growth trends.</p>
          </div>
          
          {hasLeads && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 text-xs font-semibold self-start md:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {filteredLeads.length} leads in selected period
            </div>
          )}
        </div>
        
        {hasLeads && (
          <AnalyticsFilters currentFilter={filter} onFilterChange={setFilter} />
        )}
      </div>

      {!hasLeads ? (
        <EmptyAnalyticsState />
      ) : (
        <>
          {/* KPI Summary Section */}
          <div className="mb-8">
            <StatsCards leads={filteredLeads} />
          </div>

          {/* Grid Layout Row 1: Pie and Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PieChartCard data={getStatusDistribution(filteredLeads)} />
            <FunnelChartCard leads={filteredLeads} />
          </div>

          {/* Grid Layout Row 2: Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BarChartCard data={getMonthlyLeads(filteredLeads)} />
            <LineChartCard data={getConversionByMonth(filteredLeads)} />
          </div>

          {/* Grid Layout Row 3: Revenue & Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RevenueChartCard leads={filteredLeads} />
            <LeadSourceChart leads={filteredLeads} />
          </div>

          {/* Grid Layout Row 4: Heatmap & Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ActivityHeatmap leads={filteredLeads} />
            <TopPerformersCard leads={filteredLeads} />
          </div>

          {/* Grid Layout Row 5: Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ForecastCard leads={filteredLeads} />
            <SalesVelocityCard leads={filteredLeads} />
          </div>
        </>
      )}
    </div>
  );
}

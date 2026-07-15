import { useState, useMemo } from 'react';

export const FILTER_OPTIONS = {
  LAST_7_DAYS: 'last7',
  LAST_30_DAYS: 'last30',
  LAST_90_DAYS: 'last90',
  THIS_YEAR: 'thisYear',
  ALL_TIME: 'allTime'
};

export function useAnalytics(leads) {
  const [filter, setFilter] = useState(FILTER_OPTIONS.ALL_TIME);

  const filteredLeads = useMemo(() => {
    if (!leads || leads.length === 0) return [];
    
    if (filter === FILTER_OPTIONS.ALL_TIME) return leads;

    const today = new Date();
    const filterDate = new Date();

    switch (filter) {
      case FILTER_OPTIONS.LAST_7_DAYS:
        filterDate.setDate(today.getDate() - 7);
        break;
      case FILTER_OPTIONS.LAST_30_DAYS:
        filterDate.setDate(today.getDate() - 30);
        break;
      case FILTER_OPTIONS.LAST_90_DAYS:
        filterDate.setDate(today.getDate() - 90);
        break;
      case FILTER_OPTIONS.THIS_YEAR:
        filterDate.setFullYear(today.getFullYear(), 0, 1);
        break;
      default:
        filterDate.setDate(today.getDate() - 30);
    }

    return leads.filter(l => {
      if (!l.createdAt) return false;
      const createdAt = new Date(l.createdAt);
      return createdAt >= filterDate;
    });
  }, [leads, filter]);

  return {
    filter,
    setFilter,
    filteredLeads
  };
}

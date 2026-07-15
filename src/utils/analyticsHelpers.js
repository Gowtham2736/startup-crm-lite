// analyticsHelpers.js
// Pure functions for analytics calculations

const getMonthsArray = (numMonths) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const result = [];
  for (let i = numMonths - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    result.push({
      monthIdx: d.getMonth(),
      year: d.getFullYear(),
      name: months[d.getMonth()],
      fullName: `${months[d.getMonth()]} ${d.getFullYear()}`
    });
  }
  return result;
};

export const getStatusDistribution = (leads) => {
  if (!leads || leads.length === 0) return [];
  const counts = leads.reduce((acc, lead) => {
    let status = lead.status || 'New';
    if (status === 'Meeting Scheduled') status = 'Meeting';
    if (status === 'Proposal Sent') status = 'Proposal';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(counts).map(status => ({
    name: status,
    value: counts[status]
  }));
};

export const getMonthlyLeads = (leads) => {
  if (!leads || leads.length === 0) return [];
  const last6Months = getMonthsArray(6);
  return last6Months.map(m => {
    const count = leads.filter(l => {
      if (!l.createdAt) return false;
      const leadDate = new Date(l.createdAt);
      return leadDate.getMonth() === m.monthIdx && leadDate.getFullYear() === m.year;
    }).length;
    return { name: m.name, leads: count };
  });
};

export const getConversionByMonth = (leads) => {
  if (!leads || leads.length === 0) return [];
  const last6Months = getMonthsArray(6);
  return last6Months.map(m => {
    const monthLeads = leads.filter(l => {
      if (!l.createdAt) return false;
      const leadDate = new Date(l.createdAt);
      return leadDate.getMonth() === m.monthIdx && leadDate.getFullYear() === m.year;
    });
    const total = monthLeads.length;
    const won = monthLeads.filter(l => l.status === 'Won').length;
    const rate = total > 0 ? Math.round((won / total) * 100) : 0;
    return { name: m.name, rate };
  });
};

export const getRevenueByMonth = (leads) => {
  if (!leads || leads.length === 0) return [];
  const last6Months = getMonthsArray(6);
  return last6Months.map(m => {
    const wonLeads = leads.filter(l => {
      if (l.status !== 'Won' || !l.wonAt) return false;
      const wonDate = new Date(l.wonAt);
      return wonDate.getMonth() === m.monthIdx && wonDate.getFullYear() === m.year;
    });
    const revenue = wonLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
    return { name: m.name, revenue };
  });
};

export const getPipelineValue = (leads) => {
  if (!leads || leads.length === 0) return 0;
  return leads
    .filter(l => l.status !== 'Won' && l.status !== 'Lost')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
};

export const getWonRevenue = (leads) => {
  if (!leads || leads.length === 0) return 0;
  return leads
    .filter(l => l.status === 'Won')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
};

export const getAverageSalesCycle = (leads) => {
  if (!leads || leads.length === 0) return 0;
  const wonLeads = leads.filter(l => l.status === 'Won' && l.createdAt && l.wonAt);
  if (wonLeads.length === 0) return 0;
  const totalDays = wonLeads.reduce((sum, l) => {
    const start = new Date(l.createdAt);
    const end = new Date(l.wonAt);
    const diffTime = Math.abs(end - start);
    return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, 0);
  return Math.round(totalDays / wonLeads.length);
};

export const getLostRate = (leads) => {
  if (!leads || leads.length === 0) return 0;
  const lost = leads.filter(l => l.status === 'Lost').length;
  return Math.round((lost / leads.length) * 100);
};

export const getLeadSourceStats = (leads) => {
  if (!leads || leads.length === 0) return [];
  const sourceCounts = leads.reduce((acc, l) => {
    const source = l.source || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(sourceCounts)
    .map(source => ({ source, count: sourceCounts[source] }))
    .sort((a, b) => b.count - a.count);
};

export const getFunnelData = (leads) => {
  if (!leads || leads.length === 0) return [];
  
  // A simple representation of funnel. 
  // Everyone is a 'New' lead initially, so total = leads.length.
  // We approximate the funnel size by seeing who has progressed.
  // For a real funnel, we'd check timestamps.
  // Here, we'll assume status hierarchy: New -> Contacted -> Meeting -> Proposal -> Won
  
  const total = leads.length;
  const hasContacted = leads.filter(l => l.contactedAt || l.meetingAt || l.proposalAt || l.wonAt || ['Contacted', 'Meeting', 'Proposal', 'Won'].includes(l.status)).length;
  const hasMeeting = leads.filter(l => l.meetingAt || l.proposalAt || l.wonAt || ['Meeting', 'Proposal', 'Won'].includes(l.status)).length;
  const hasProposal = leads.filter(l => l.proposalAt || l.wonAt || ['Proposal', 'Won'].includes(l.status)).length;
  const won = leads.filter(l => l.wonAt || l.status === 'Won').length;

  return [
    { name: 'New', value: total, fill: '#94A3B8' },
    { name: 'Contacted', value: hasContacted, fill: '#2563EB' },
    { name: 'Meeting', value: hasMeeting, fill: '#F59E0B' },
    { name: 'Proposal', value: hasProposal, fill: '#7C3AED' },
    { name: 'Won', value: won, fill: '#22C55E' }
  ];
};

export const getSalesVelocity = (leads) => {
  if (!leads || leads.length === 0) return 0;
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === 'Won');
  const winRate = wonLeads.length / totalLeads;
  const avgDealSize = wonLeads.length > 0 ? getWonRevenue(wonLeads) / wonLeads.length : 0;
  const salesCycle = getAverageSalesCycle(leads) || 1; // avoid division by zero
  
  // (Opportunities * Win Rate * Avg Deal Size) / Sales Cycle
  const velocity = (totalLeads * winRate * avgDealSize) / salesCycle;
  return Math.round(velocity);
};

export const getForecastRevenue = (leads) => {
  if (!leads || leads.length === 0) return 0;
  const revenueData = getRevenueByMonth(leads);
  // Avg of last 6 months
  const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0);
  return Math.round(totalRevenue / revenueData.length);
};

export const getTopPerformers = (leads) => {
  if (!leads || leads.length === 0) return [];
  const performance = leads
    .filter(l => l.status === 'Won')
    .reduce((acc, l) => {
      const owner = l.owner || 'Unassigned';
      acc[owner] = (acc[owner] || 0) + (Number(l.value) || 0);
      return acc;
    }, {});
    
  return Object.keys(performance)
    .map(owner => ({ name: owner, revenue: performance[owner] }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // top 5
};

export const getActivityHeatmapData = (leads) => {
  if (!leads || leads.length === 0) return [];
  // For a Github style heatmap, we need array of { date: 'YYYY-MM-DD', count: N }
  const activities = {};
  
  leads.forEach(l => {
    // Add created
    if (l.createdAt) {
      const d = l.createdAt.split('T')[0];
      activities[d] = (activities[d] || 0) + 1;
    }
    // Add contacted
    if (l.contactedAt) {
      const d = l.contactedAt.split('T')[0];
      activities[d] = (activities[d] || 0) + 1;
    }
    // Add meeting
    if (l.meetingAt) {
      const d = l.meetingAt.split('T')[0];
      activities[d] = (activities[d] || 0) + 1;
    }
  });

  return Object.keys(activities).map(date => ({
    date,
    count: activities[date]
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

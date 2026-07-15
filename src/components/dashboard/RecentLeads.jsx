import React from 'react';

/**
 * RecentLeads component showing the latest added leads
 * @param {Object} props
 * @param {Array} props.leads - Array of lead objects
 */
export default function RecentLeads({ leads = [] }) {
  // Get last 5 leads (assuming they are appended to the end or start, we'll slice the first 5 for now)
  const recentLeads = leads.slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Won': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      case 'New': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100';
      case 'Meeting Scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800'; // Contacted, Proposal Sent
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Recent Leads</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm">
              <th className="py-3 px-6 font-medium">Name</th>
              <th className="py-3 px-6 font-medium">Company</th>
              <th className="py-3 px-6 font-medium">Status</th>
              <th className="py-3 px-6 font-medium">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:bg-gray-900 transition">
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-50">{lead.name}</td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400 dark:text-gray-500">{lead.company}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 dark:text-gray-400 dark:text-gray-500">{new Date(lead.createdAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  No recent leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

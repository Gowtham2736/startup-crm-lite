import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function LeadTable({ leads, onEdit, onDelete }) {
  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
        No leads found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm border-b border-gray-100 dark:border-gray-800">
              <th className="py-3 px-6 font-medium">Name</th>
              <th className="py-3 px-6 font-medium">Company</th>
              <th className="py-3 px-6 font-medium">Contact</th>
              <th className="py-3 px-6 font-medium">Status</th>
              <th className="py-3 px-6 font-medium">Source</th>
              <th className="py-3 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 dark:bg-gray-900 transition">
                <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-50">{lead.name}</td>
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400 dark:text-gray-500">{lead.company}</td>
                <td className="py-4 px-6 text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  <div className="truncate w-40">{lead.email}</div>
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="py-4 px-6 text-gray-500 dark:text-gray-400 dark:text-gray-500">{lead.source}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(lead)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-blue-50 rounded-md transition"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(lead.id)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import { Mail, Phone, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function LeadCard({ lead, onEdit, onDelete }) {
  const leadId = lead?.id ?? lead?._id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{lead.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm">{lead.company}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>
      
      <div className="space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-gray-400 dark:text-gray-500" />
          <a href={`mailto:${lead.email}`} className="hover:text-primary truncate">{lead.email}</a>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400 dark:text-gray-500" />
            <a href={`tel:${lead.phone}`} className="hover:text-primary">{lead.phone}</a>
          </div>
        )}
        {lead.status === 'Won' && lead.value && (
          <div className="flex items-center gap-2 font-medium text-green-600 dark:text-green-400 mt-1">
            <span>Deal Value: ${lead.value}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 border-t border-gray-50 pt-3 mt-auto">
        <button 
          onClick={() => onEdit(lead)}
          className="p-1.5 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-blue-50 rounded-md transition"
          aria-label="Edit Lead"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(leadId)}
          className="p-1.5 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition"
          aria-label="Delete Lead"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

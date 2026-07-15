import React, { useState, useMemo } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLeads } from '../context/LeadContext';
import LeadTable from '../components/leads/LeadTable';
import LeadCard from '../components/leads/LeadCard';
import LeadForm from '../components/leads/LeadForm';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Phase 7: Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // View toggle (table vs cards)
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Derived state: Filtered leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => activeFilter === 'All' || lead.status === activeFilter)
      .filter(lead => {
        const q = searchQuery.toLowerCase();
        return (
          lead.name.toLowerCase().includes(q) ||
          lead.company.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q)
        );
      });
  }, [leads, activeFilter, searchQuery]);

  // Handlers
  const handleOpenModal = (lead = null) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
    setIsModalOpen(false);
  };

  const handleSaveLead = (leadData) => {
    if (selectedLead) {
      updateLead(selectedLead.id, leadData);
      toast.success('Lead updated successfully!');
    } else {
      addLead(leadData);
      toast.success('New lead added!');
    }
    handleCloseModal();
  };

  const handleDeleteLead = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
      toast.error('Lead deleted', { icon: '🗑️' });
    }
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Leads</h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">Manage your potential customers</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          <div className="hidden md:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-gray-50'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-md ${viewMode === 'card' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-gray-50'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
        
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} leads={leads} />
      </div>

      {/* Content Area */}
      {filteredLeads.length > 0 ? (
        <>
          {/* Mobile always uses cards, desktop uses selected view */}
          <div className={`md:hidden space-y-4`}>
            {filteredLeads.map(lead => (
              <LeadCard key={lead.id} lead={lead} onEdit={handleOpenModal} onDelete={handleDeleteLead} />
            ))}
          </div>
          
          <div className="hidden md:block">
            {viewMode === 'table' ? (
              <LeadTable leads={filteredLeads} onEdit={handleOpenModal} onDelete={handleDeleteLead} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredLeads.map(lead => (
                  <LeadCard key={lead.id} lead={lead} onEdit={handleOpenModal} onDelete={handleDeleteLead} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <EmptyState 
          message={leads.length === 0 ? "You don't have any leads yet." : "No leads match your search criteria."}
          suggestion={leads.length === 0 ? "Click 'Add Lead' to get started." : "Try clearing your filters or search term."}
          onClear={leads.length > 0 ? () => { setSearchQuery(''); setActiveFilter('All'); } : null}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <LeadForm 
          initialData={selectedLead}
          onSubmit={handleSaveLead}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
}

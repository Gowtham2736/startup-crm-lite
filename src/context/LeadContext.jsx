/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { sampleLeads } from '../data/sampleLeads';
const LeadContext = createContext(undefined);

export function LeadProvider({ children }) {
  // Use sampleLeads as initial data if local storage is empty
  const [leads, setLeads] = useLocalStorage('startup-crm-leads', sampleLeads);

  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setLeads([newLead, ...leads]);
  };

  const updateLead = (id, updatedData) => {
    setLeads(leads.map(lead => lead.id === id ? { ...updatedData, id, createdAt: lead.createdAt } : lead));
  };

  const deleteLead = (id) => {
    setLeads(leads.filter(lead => lead.id !== id));
  };

  const getLeadById = (id) => {
    return leads.find(lead => lead.id === id);
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLead, deleteLead, getLeadById }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}

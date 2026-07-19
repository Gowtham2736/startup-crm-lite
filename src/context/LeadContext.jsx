/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import leadService from '../services/leadService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const LeadContext = createContext(undefined);

const normalizeLead = (lead) => {
  if (!lead) return lead;
  return {
    ...lead,
    id: lead.id ?? lead._id ?? null,
  };
};

export function LeadProvider({ children }) {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });

  // Fetch all leads from API
  const fetchLeads = async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await leadService.getLeads(params);
      if (res.success) {
        const normalizedLeads = (res.data || []).map(normalizeLead);
        setLeads(normalizedLeads);
        setPagination(res.pagination || { total: normalizedLeads.length, page: 1, limit: 20, pages: 1 });
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Failed to load leads from server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically fetch leads when user logs in
  useEffect(() => {
    if (user) {
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [user]);

  const addLead = async (leadData) => {
    try {
      const res = await leadService.createLead(leadData);
      if (res.success) {
        const normalizedLead = normalizeLead(res.data);
        setLeads((prev) => [normalizedLead, ...prev]);
        toast.success('Lead created successfully!');
        return normalizedLead;
      }
    } catch (error) {
      console.error('Failed to add lead:', error);
      const errMsg = error.response?.data?.errors?.[0] || error.response?.data?.message || 'Failed to create lead.';
      toast.error(errMsg);
      throw error;
    }
  };

  const updateLead = async (id, updatedData) => {
    try {
      const res = await leadService.updateLead(id, updatedData);
      if (res.success) {
        const normalizedLead = normalizeLead(res.data);
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id || lead._id === id ? normalizedLead : lead))
        );
        toast.success('Lead updated successfully!');
        return normalizedLead;
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
      const errMsg = error.response?.data?.errors?.[0] || error.response?.data?.message || 'Failed to update lead.';
      toast.error(errMsg);
      throw error;
    }
  };

  const deleteLead = async (id) => {
    try {
      const res = await leadService.deleteLead(id);
      if (res.success) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id && lead._id !== id));
        toast.success('Lead deleted successfully.');
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
      toast.error('Failed to delete lead.');
      throw error;
    }
  };

  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id || lead._id === id);
  };

  return (
    <LeadContext.Provider value={{ leads, loading: isLoading, isLoading, pagination, fetchLeads, addLead, updateLead, deleteLead, getLeadById }}>
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

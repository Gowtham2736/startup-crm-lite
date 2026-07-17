import api from './api';

const leadService = {
  /**
   * Get all leads for the logged-in user
   */
  getLeads: async (params = {}) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  /**
   * Create a new lead
   */
  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  /**
   * Update one lead completely
   */
  updateLead: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  /**
   * Update lead status only
   */
  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete a lead permanently
   */
  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  /**
   * Get analytics dashboard stats summary
   */
  getLeadStats: async () => {
    const response = await api.get('/leads/stats/summary');
    return response.data;
  },

  /**
   * Get monthly lead aggregate stats for Recharts
   */
  getMonthlyStats: async () => {
    const response = await api.get('/leads/stats/monthly');
    return response.data;
  }
};

export default leadService;

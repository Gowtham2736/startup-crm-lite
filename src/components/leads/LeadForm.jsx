import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

import { STATUS_OPTIONS, SOURCE_OPTIONS } from '../../constants';


/**
 * Form for creating or editing a lead
 */
export default function LeadForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
    value: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.status === 'Won' && (!formData.value || isNaN(formData.value) || Number(formData.value) < 0)) {
      newErrors.value = 'Valid deal amount is required for won leads';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.value === '') {
        delete dataToSubmit.value;
      } else {
        dataToSubmit.value = Number(dataToSubmit.value);
      }
      onSubmit(dataToSubmit);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 md:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-none md:rounded-xl shadow-lg w-full max-w-lg h-full md:h-auto max-h-screen md:max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {initialData ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500 transition">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name *</label>
            <input 
              id="name"
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="e.g. John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Company *</label>
            <input 
              id="company"
              type="text" 
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none ${errors.company ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="e.g. Acme Corp"
            />
            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email *</label>
            <input 
              id="email"
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="e.g. john@acme.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone</label>
            <input 
              id="phone"
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-transparent"
              placeholder="e.g. +1 234 567 890"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
              <select 
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white dark:bg-gray-800"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Source</label>
              <select 
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white dark:bg-gray-800"
              >
                {SOURCE_OPTIONS.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>

          {formData.status === 'Won' && (
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Deal Value ($)</label>
              <input 
                id="value"
                type="number" 
                name="value"
                value={formData.value}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none ${errors.value ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800`}
                placeholder="e.g. 5000"
              />
              {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-6 md:mt-auto">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-blue-700 transition"
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

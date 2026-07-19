import React, { useState } from 'react';
import { User, Mail, Shield, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setIsLoading(true);
    try {
      const updateData = { name: formData.name };
      if (formData.oldPassword && formData.newPassword) {
        updateData.oldPassword = formData.oldPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      await authService.updateProfile(updateData);
      toast.success("Profile updated successfully");
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">Your Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="space-y-8">
            
            {/* General Info Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
                <User size={20} className="text-primary" />
                General Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Email cannot be changed.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Security Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
                <Shield size={20} className="text-primary" />
                Security
              </h2>
              
              <div className="space-y-5 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    name="oldPassword"
                    value={formData.oldPassword} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-transparent text-gray-900 dark:text-white"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    value={formData.newPassword} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-transparent text-gray-900 dark:text-white"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-transparent text-gray-900 dark:text-white"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

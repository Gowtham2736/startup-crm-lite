import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle, CheckCheck } from 'lucide-react';
import notificationService from '../services/notificationService';
import toast from 'react-hot-toast';
import EmptyState from '../components/common/EmptyState';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={24} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={24} />;
      case 'error': return <AlertCircle className="text-red-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto h-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Stay updated with your latest alerts.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition text-sm font-medium"
          >
            <CheckCheck size={18} />
            Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState 
          icon={<Bell size={48} className="text-gray-300 dark:text-gray-600" />}
          title="No notifications yet"
          message="When you get notifications, they will appear here."
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`p-6 flex items-start gap-4 transition ${notification.read ? 'bg-transparent' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm md:text-base ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button 
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-primary transition"
                    title="Mark as read"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

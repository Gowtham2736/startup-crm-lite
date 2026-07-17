import axios from 'axios';
import toast from 'react-hot-toast';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
  if (url.endsWith('/')) url = url.slice(0, -1);
  if (!url.endsWith('/api')) url = `${url}/api`;
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Request Interceptor: inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: handle auth expiries and network outages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Token Expired or Invalid Session
      if (status === 401) {
        localStorage.removeItem('crm-token');
        // Avoid redirect loop if already on login/register
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
          toast.error('Session expired, please login again.');
        }
      }
    } else {
      // Network Failure
      toast.error('Cannot connect to server. Check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;

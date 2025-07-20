import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to handle authentication
api.interceptors.request.use(
  (config) => {
    // You can add additional auth logic here if needed
    // For example, adding JWT tokens from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      console.warn('Unauthorized request detected. User needs to log in.');
      
      // Only redirect if we're not already on login/auth pages
      const currentPath = window.location.pathname;
      const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/'];
      
      if (!authPaths.includes(currentPath)) {
        // Redirect to login with return path
        window.location.href = `/login?returnTo=${encodeURIComponent(currentPath)}`;
      }
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status, error.response.data);
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.error('Network error - server may be down');
    }
    return Promise.reject(error);
  }
);

export default api;

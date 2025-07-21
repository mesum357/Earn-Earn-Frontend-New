import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // Important for cross-domain cookie handling
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Ensure XMLHttpRequest uses withCredentials
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Request interceptor for session-based authentication
api.interceptors.request.use(
  (config) => {
    // Session-based auth relies on cookies, no need for Authorization headers
    // Just ensure credentials are included (already configured globally)
    
    // Debugging information
    if (import.meta.env.DEV) {
      console.debug(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    }
    
    // Ensure withCredentials is always true
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development mode
    if (import.meta.env.DEV) {
      console.debug(`Response from ${response.config.url}:`, response.status);
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.response) {
      console.error(`Error ${error.response.status} from ${error.config?.url}:`, error.response.data);
      
      if (error.response.status === 401) {
        // Handle unauthorized access - session expired or not authenticated
        console.warn('Unauthorized request detected. Session may be expired.');
        
        // Check for specific error message from server
        const errorMessage = error.response.data?.error || 'Authentication failed';
        console.warn(`Auth error details: ${errorMessage}`);
        
        // Only redirect if we're not already on login/auth pages
        const currentPath = window.location.pathname;
        const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/'];
        
        if (!authPaths.includes(currentPath)) {
          console.log(`Redirecting from ${currentPath} to login page`);
          // Redirect to login with return path
          window.location.href = `/login?returnTo=${encodeURIComponent(currentPath)}`;
        }
      } else if (error.response.status >= 500) {
        console.error('Server error:', error.response.status, error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received:', error.request);
    } else {
      // Something else caused the error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

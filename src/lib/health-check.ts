import api from './axios';

// Check if the backend is reachable and responding
export const checkBackendHealth = async () => {
  try {
    console.log('Checking backend health...');
    // Try to reach a simple health endpoint - this should exist on the backend
    const response = await api.get('/health', { 
      timeout: 5000,
      withCredentials: true 
    });
    
    console.log('Backend health response:', response.status, response.data);
    return {
      status: 'online',
      message: 'Backend is online and responding',
      details: response.data
    };
  } catch (error: any) {
    // Check for specific error conditions
    if (!error.response) {
      // No response received - network error
      console.error('Backend health check failed - no response:', error.message);
      return {
        status: 'offline',
        message: 'Cannot reach the backend server. Please check your connection.',
        error
      };
    } else if (error.response.status === 404) {
      // Health endpoint not found - backend might be running but no health endpoint
      console.warn('Health endpoint not found. Backend may be online but missing health endpoint.');
      
      // Try a fallback check to the base URL
      try {
        const fallbackResponse = await api.get('/', { timeout: 3000 });
        return {
          status: 'partial',
          message: 'Backend is online but health endpoint not found',
          details: fallbackResponse.data
        };
      } catch (fallbackError) {
        console.error('Fallback health check also failed');
        return {
          status: 'offline',
          message: 'Backend appears to be unavailable',
          error: fallbackError
        };
      }
    } else {
      // Other error cases
      console.error(`Backend health check failed with status ${error.response?.status}:`, 
        error.response?.data);
      return {
        status: 'error',
        message: `Backend returned an error: ${error.response?.status}`,
        error
      };
    }
  }
};

// Check connection and authentication status
export const checkAuthStatus = async () => {
  try {
    console.log('Checking authentication status...');
    const response = await api.get('/me', { 
      timeout: 5000,
      withCredentials: true 
    });
    
    return {
      status: 'authenticated',
      user: response.data.user,
      details: response.data
    };
  } catch (error: any) {
    if (!error.response) {
      return {
        status: 'connection_error',
        message: 'Cannot reach the authentication server',
        error
      };
    } else if (error.response.status === 401) {
      return {
        status: 'unauthenticated',
        message: 'Not authenticated or session expired',
        details: error.response.data
      };
    } else {
      return {
        status: 'error',
        message: `Authentication check failed with status ${error.response.status}`,
        details: error.response.data,
        error
      };
    }
  }
};

// Run a diagnostic test on the authentication flow
export const runAuthDiagnostic = async () => {
  console.group('Authentication System Diagnostic');
  
  // Step 1: Check basic connectivity
  console.log('Step 1: Checking backend connectivity...');
  const healthResult = await checkBackendHealth();
  console.log('Health check result:', healthResult.status);
  
  // Step 2: Check current auth status
  console.log('Step 2: Checking current authentication status...');
  const authResult = await checkAuthStatus();
  console.log('Auth status:', authResult.status);
  
  // Step 3: Check CORS configuration
  console.log('Step 3: Checking CORS configuration...');
  const corsCheck = await checkCorsConfiguration();
  
  console.groupEnd();
  
  return {
    health: healthResult,
    auth: authResult,
    cors: corsCheck,
    timestamp: new Date().toISOString()
  };
};

// Check if CORS is properly configured
const checkCorsConfiguration = async () => {
  try {
    // Make a preflight OPTIONS request to check CORS using axios
    const response = await api.request({
      method: 'OPTIONS',
      url: '/me',
      withCredentials: true,
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    // Check if CORS headers are present
    const corsHeaders = {
      allowOrigin: response.headers.get('Access-Control-Allow-Origin'),
      allowMethods: response.headers.get('Access-Control-Allow-Methods'),
      allowHeaders: response.headers.get('Access-Control-Allow-Headers'),
      allowCredentials: response.headers.get('Access-Control-Allow-Credentials')
    };
    
    const corsSuccess = corsHeaders.allowOrigin && 
                        corsHeaders.allowCredentials === 'true';
    
    return {
      status: corsSuccess ? 'success' : 'partial',
      message: corsSuccess ? 'CORS properly configured' : 'CORS partially configured',
      headers: corsHeaders
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'CORS check failed',
      error
    };
  }
};

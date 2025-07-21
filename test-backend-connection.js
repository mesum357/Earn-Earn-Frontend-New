// Simple script to test backend connection
// Run with: node test-backend-connection.js

const https = require('https');
const http = require('http');

const BACKEND_URL = 'https://easyearn-backend-4.onrender.com';

console.log(`Testing connection to backend: ${BACKEND_URL}`);

// Determine which protocol to use
const client = BACKEND_URL.startsWith('https') ? https : http;

// Simple health check
const healthCheck = () => {
  return new Promise((resolve, reject) => {
    console.log(`\nAttempting to reach ${BACKEND_URL}/health...`);
    
    const req = client.get(`${BACKEND_URL}/health`, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          console.log(`Response body:`, data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, data, statusCode: res.statusCode });
          } else {
            resolve({ success: false, data, statusCode: res.statusCode });
          }
        } catch (e) {
          console.error('Error parsing response:', e);
          reject(e);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`Connection error: ${error.message}`);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.abort();
      console.error('Request timeout after 5 seconds');
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
};

// Test CORS preflight
const testCorsOptions = () => {
  return new Promise((resolve, reject) => {
    console.log(`\nTesting CORS preflight to ${BACKEND_URL}/me...`);
    
    const options = {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    };
    
    const req = client.request(`${BACKEND_URL}/me`, options, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`CORS Headers:`);
      
      // Check for CORS headers
      const corsHeaders = {
        'access-control-allow-origin': res.headers['access-control-allow-origin'],
        'access-control-allow-methods': res.headers['access-control-allow-methods'],
        'access-control-allow-headers': res.headers['access-control-allow-headers'],
        'access-control-allow-credentials': res.headers['access-control-allow-credentials'],
        'access-control-max-age': res.headers['access-control-max-age']
      };
      
      Object.entries(corsHeaders).forEach(([key, value]) => {
        console.log(`  ${key}: ${value || 'Not set'}`);
      });
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (data) {
          console.log(`Response body:`, data);
        }
        
        const corsSuccess = corsHeaders['access-control-allow-origin'] && 
                          corsHeaders['access-control-allow-credentials'] === 'true';
        
        resolve({ 
          success: corsSuccess, 
          statusCode: res.statusCode,
          corsHeaders
        });
      });
    });
    
    req.on('error', (error) => {
      console.error(`Connection error: ${error.message}`);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.abort();
      console.error('Request timeout after 5 seconds');
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
};

// Run tests
const runTests = async () => {
  console.log('=== BACKEND CONNECTION TEST ===');
  
  try {
    // Health check
    console.log('\n1. Testing backend health endpoint');
    const healthResult = await healthCheck();
    console.log(`Health check ${healthResult.success ? 'PASSED' : 'FAILED'}`);
    
    // CORS check
    console.log('\n2. Testing CORS configuration');
    const corsResult = await testCorsOptions();
    console.log(`CORS check ${corsResult.success ? 'PASSED' : 'FAILED'}`);
    
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Backend health: ${healthResult.success ? 'ONLINE' : 'OFFLINE'}`);
    console.log(`CORS configuration: ${corsResult.success ? 'CONFIGURED' : 'MISCONFIGURED'}`);
    
  } catch (error) {
    console.error('\nTest failed with error:', error.message);
  }
  
  console.log('\nTests completed.');
};

runTests();

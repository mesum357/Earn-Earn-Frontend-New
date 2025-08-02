const axios = require('axios');

const BASE_URL = 'http://localhost:3005';

// Create axios instance similar to frontend
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

async function testWithdrawPageConnection() {
  console.log('🔍 Testing WithdrawPage API connections...\n');

  try {
    // Step 1: Test basic connectivity
    console.log('1. Testing basic connectivity...');
    const healthResponse = await api.get('/health');
    console.log('✅ Backend health:', healthResponse.data.status);

    // Step 2: Test /me endpoint (authentication check)
    console.log('\n2. Testing /me endpoint...');
    try {
      const meResponse = await api.get('/me');
      console.log('✅ /me endpoint working:', meResponse.data);
    } catch (error) {
      console.log('⚠️ /me endpoint failed (expected if not logged in):', error.response?.data?.error || error.message);
    }

    // Step 3: Test withdrawal requirements endpoint
    console.log('\n3. Testing /api/withdrawal-requirements...');
    try {
      const requirementsResponse = await api.get('/api/withdrawal-requirements');
      console.log('✅ Requirements endpoint working:', requirementsResponse.data);
    } catch (error) {
      console.log('❌ Requirements endpoint failed:');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data?.error || error.message);
    }

    // Step 4: Test withdrawal history endpoint
    console.log('\n4. Testing /api/withdrawal-history...');
    try {
      const historyResponse = await api.get('/api/withdrawal-history');
      console.log('✅ History endpoint working:', historyResponse.data);
    } catch (error) {
      console.log('❌ History endpoint failed:');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data?.error || error.message);
    }

    console.log('\n🎉 WithdrawPage connection test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status:', error.response.status);
    }
  }
}

testWithdrawPageConnection(); 
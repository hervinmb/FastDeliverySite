const http = require('http');

console.log('🔍 Testing API endpoints...\n');

// Test function
function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        console.log(`✅ ${method} ${path} - Status: ${res.statusCode}`);
        try {
          const jsonBody = JSON.parse(body);
          console.log(`   Response:`, JSON.stringify(jsonBody, null, 2));
        } catch (e) {
          console.log(`   Response:`, body);
        }
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${method} ${path} - Error:`, err.message);
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    console.log('Testing basic endpoints...\n');
    
    await testEndpoint('/api/health');
    await testEndpoint('/api/test');
    
    console.log('\nTesting deliveries endpoints...\n');
    
    await testEndpoint('/api/deliveries');
    await testEndpoint('/api/deliveries?page=1&limit=5');
    await testEndpoint('/api/deliveries?status=pending');
    
    console.log('\nTesting clients and deliverers...\n');
    
    await testEndpoint('/api/clients');
    await testEndpoint('/api/deliverers');
    
    console.log('\nTesting POST delivery...\n');
    
    const newDelivery = {
      clientId: '1',
      clientName: 'Test Client',
      delivererId: '1',
      delivererName: 'Test Deliverer',
      destination: 'Test Address',
      totalGoodsPrice: 100.00,
      deliveryFees: 20.00,
      numberOfItems: 1,
      status: 'pending',
      notes: 'Test delivery'
    };
    
    await testEndpoint('/api/deliveries', 'POST', newDelivery);
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if server is running first
const checkServer = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
}, (res) => {
  console.log('✅ Server is running, starting tests...\n');
  runTests();
});

checkServer.on('error', (err) => {
  console.log('❌ Server is not running. Please start it first:');
  console.log('   cd Backend && node simple-server.js');
  console.log('   Error:', err.message);
});

checkServer.end();

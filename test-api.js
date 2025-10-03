const http = require('http');

console.log('🔍 Testing API endpoints...\n');

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
      console.log(`❌ ${method} ${path} - Error: ${err.message}`);
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  try {
    console.log('Testing basic endpoints...\n');
    
    await testEndpoint('/api/health');
    await testEndpoint('/api/test');
    
    console.log('\nTesting deliveries endpoints...\n');
    
    await testEndpoint('/api/deliveries');
    await testEndpoint('/api/deliveries?page=1&limit=5');
    
    console.log('\nTesting clients and deliverers...\n');
    
    await testEndpoint('/api/clients');
    await testEndpoint('/api/deliverers');
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
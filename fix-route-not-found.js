const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing "Route not found" error...\n');

// 1. Update the simple server to be more robust
const serverPath = path.join(__dirname, 'Backend', 'simple-server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Add better error handling and logging
const improvedServer = `const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(\`\${new Date().toISOString()} - \${req.method} \${req.path}\`);
  next();
});

// Mock data
let mockDeliveries = [
  {
    id: '1',
    clientId: '1',
    clientName: 'John Doe',
    delivererId: '1',
    delivererName: 'Mike Smith',
    destination: '123 Main St, City',
    totalGoodsPrice: 150.00,
    deliveryFees: 25.00,
    numberOfItems: 3,
    status: 'pending',
    notes: 'Fragile items',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Jane Smith',
    delivererId: '2',
    delivererName: 'Sarah Johnson',
    destination: '456 Oak Ave, Town',
    totalGoodsPrice: 89.50,
    deliveryFees: 15.00,
    numberOfItems: 2,
    status: 'in-transit',
    notes: 'Leave at door',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockClients = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com' }
];

let mockDeliverers = [
  { id: '1', name: 'Mike Smith', email: 'mike@example.com' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com' },
  { id: '3', name: 'Tom Brown', email: 'tom@example.com' }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint requested');
  res.json({ 
    message: 'Test endpoint working!',
    data: {
      server: 'LIVRAISON RAPIDE Backend',
      version: '1.0.0',
      status: 'running'
    }
  });
});

// Auth endpoints (mock)
app.post('/api/auth/register', (req, res) => {
  console.log('Register endpoint requested:', req.body);
  res.json({
    message: 'Registration endpoint working!',
    user: {
      email: req.body.email,
      displayName: req.body.displayName,
      role: req.body.role
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login endpoint requested:', req.body);
  res.json({
    message: 'Login endpoint working!',
    user: {
      email: req.body.email,
      displayName: 'Test User',
      role: 'admin'
    }
  });
});

// Deliveries API endpoints
app.get('/api/deliveries', (req, res) => {
  console.log('Deliveries GET requested:', req.query);
  const { page = 1, limit = 10, status, search } = req.query;
  
  let filteredDeliveries = [...mockDeliveries];
  
  // Filter by status
  if (status && status !== 'all') {
    filteredDeliveries = filteredDeliveries.filter(d => d.status === status);
  }
  
  // Filter by search term
  if (search) {
    filteredDeliveries = filteredDeliveries.filter(d => 
      d.clientName.toLowerCase().includes(search.toLowerCase()) ||
      d.destination.toLowerCase().includes(search.toLowerCase()) ||
      d.delivererName.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex);
  
  res.json({
    deliveries: paginatedDeliveries,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredDeliveries.length,
      pages: Math.ceil(filteredDeliveries.length / limit)
    }
  });
});

app.post('/api/deliveries', (req, res) => {
  console.log('Deliveries POST requested:', req.body);
  const newDelivery = {
    id: (mockDeliveries.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockDeliveries.push(newDelivery);
  
  res.status(201).json({
    message: 'Delivery created successfully',
    delivery: newDelivery
  });
});

app.put('/api/deliveries/:id', (req, res) => {
  console.log('Deliveries PUT requested:', req.params.id, req.body);
  const { id } = req.params;
  const deliveryIndex = mockDeliveries.findIndex(d => d.id === id);
  
  if (deliveryIndex === -1) {
    return res.status(404).json({ error: 'Delivery not found' });
  }
  
  mockDeliveries[deliveryIndex] = {
    ...mockDeliveries[deliveryIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    message: 'Delivery updated successfully',
    delivery: mockDeliveries[deliveryIndex]
  });
});

app.delete('/api/deliveries/:id', (req, res) => {
  console.log('Deliveries DELETE requested:', req.params.id);
  const { id } = req.params;
  const deliveryIndex = mockDeliveries.findIndex(d => d.id === id);
  
  if (deliveryIndex === -1) {
    return res.status(404).json({ error: 'Delivery not found' });
  }
  
  mockDeliveries.splice(deliveryIndex, 1);
  
  res.json({
    message: 'Delivery deleted successfully'
  });
});

// Clients API endpoints
app.get('/api/clients', (req, res) => {
  console.log('Clients GET requested');
  const { limit = 100 } = req.query;
  res.json({
    clients: mockClients.slice(0, parseInt(limit))
  });
});

// Deliverers API endpoints
app.get('/api/deliverers', (req, res) => {
  console.log('Deliverers GET requested');
  const { limit = 100 } = req.query;
  res.json({
    deliverers: mockDeliverers.slice(0, parseInt(limit))
  });
});

// 404 handler - this should be LAST
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      'GET /api/health',
      'GET /api/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/deliveries',
      'POST /api/deliveries',
      'PUT /api/deliveries/:id',
      'DELETE /api/deliveries/:id',
      'GET /api/clients',
      'GET /api/deliverers'
    ]
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Simple server running on port \${PORT}\`);
  console.log(\`📊 Health check: http://localhost:\${PORT}/api/health\`);
  console.log(\`🧪 Test endpoint: http://localhost:\${PORT}/api/test\`);
  console.log(\`🌐 Server listening on all interfaces\`);
  console.log(\`📝 Available routes:\`);
  console.log(\`   GET  /api/health\`);
  console.log(\`   GET  /api/test\`);
  console.log(\`   POST /api/auth/register\`);
  console.log(\`   POST /api/auth/login\`);
  console.log(\`   GET  /api/deliveries\`);
  console.log(\`   POST /api/deliveries\`);
  console.log(\`   PUT  /api/deliveries/:id\`);
  console.log(\`   DELETE /api/deliveries/:id\`);
  console.log(\`   GET  /api/clients\`);
  console.log(\`   GET  /api/deliverers\`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;`;

fs.writeFileSync(serverPath, improvedServer);
console.log('✅ Updated simple-server.js with better logging and error handling');

// 2. Create a test script
const testScript = `const http = require('http');

console.log('🔍 Testing API endpoints...\\n');

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
        console.log(\`✅ \${method} \${path} - Status: \${res.statusCode}\`);
        try {
          const jsonBody = JSON.parse(body);
          console.log(\`   Response:\`, JSON.stringify(jsonBody, null, 2));
        } catch (e) {
          console.log(\`   Response:\`, body);
        }
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', (err) => {
      console.log(\`❌ \${method} \${path} - Error: \${err.message}\`);
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
    console.log('Testing basic endpoints...\\n');
    
    await testEndpoint('/api/health');
    await testEndpoint('/api/test');
    
    console.log('\\nTesting deliveries endpoints...\\n');
    
    await testEndpoint('/api/deliveries');
    await testEndpoint('/api/deliveries?page=1&limit=5');
    
    console.log('\\nTesting clients and deliverers...\\n');
    
    await testEndpoint('/api/clients');
    await testEndpoint('/api/deliverers');
    
    console.log('\\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();`;

fs.writeFileSync(path.join(__dirname, 'test-api.js'), testScript);
console.log('✅ Created test-api.js for testing endpoints');

console.log('\\n🎉 Fix completed!');
console.log('\\n📋 Next steps:');
console.log('1. Start the server: cd Backend && node simple-server.js');
console.log('2. Test the API: node test-api.js');
console.log('3. Start the frontend: cd Frontend && npm start');
console.log('4. The "Add New" button should now work!');
console.log('\\n🔍 If you still get "Route not found":');
console.log('- Check the server console for request logs');
console.log('- Make sure the frontend is connecting to http://localhost:5000');
console.log('- Check browser network tab for the actual request URL');

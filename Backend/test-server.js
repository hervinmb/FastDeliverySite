const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working!',
    data: {
      server: 'LIVRAISON RAPIDE Backend',
      version: '1.0.0',
      status: 'running'
    }
  });
});

// Mock auth endpoints for testing
app.post('/api/auth/register', (req, res) => {
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
  res.json({
    message: 'Login endpoint working!',
    user: {
      email: req.body.email,
      displayName: 'Test User',
      role: 'admin'
    }
  });
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

// Deliveries API endpoints
app.get('/api/deliveries', (req, res) => {
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
  const { limit = 100 } = req.query;
  res.json({
    clients: mockClients.slice(0, parseInt(limit))
  });
});

// Deliverers API endpoints
app.get('/api/deliverers', (req, res) => {
  const { limit = 100 } = req.query;
  res.json({
    deliverers: mockDeliverers.slice(0, parseInt(limit))
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

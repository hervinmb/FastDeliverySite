const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/firebase');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateClient = [
  body('name').notEmpty().withMessage('Client name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required')
];

// GET /api/clients - Get all clients
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = db.collection('clients').orderBy('createdAt', 'desc');

    // Apply search filter
    if (search) {
      query = query.where('name', '>=', search).where('name', '<=', search + '\uf8ff');
    }

    const snapshot = await query.limit(parseInt(limit)).offset(parseInt(offset)).get();
    const clients = [];
    
    snapshot.forEach(doc => {
      clients.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Get total count for pagination
    const totalSnapshot = await db.collection('clients').get();
    const total = totalSnapshot.size;

    res.json({
      clients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET /api/clients/:id - Get single client
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const clientDoc = await db.collection('clients').doc(id).get();
    
    if (!clientDoc.exists) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      id: clientDoc.id,
      ...clientDoc.data()
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// POST /api/clients - Create new client
router.post('/', authenticateToken, requireRole(['admin']), validateClient, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clientData = {
      ...req.body,
      isActive: true,
      totalDeliveries: 0,
      totalSpent: 0.00,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('clients').add(clientData);
    
    res.status(201).json({
      id: docRef.id,
      ...clientData
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// PUT /api/clients/:id - Update client
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await db.collection('clients').doc(id).update(updateData);
    
    const updatedDoc = await db.collection('clients').doc(id).get();
    
    if (!updatedDoc.exists) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE /api/clients/:id - Delete client
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const clientDoc = await db.collection('clients').doc(id).get();
    if (!clientDoc.exists) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Check if client has deliveries
    const deliveriesSnapshot = await db.collection('deliveries')
      .where('clientId', '==', id)
      .get();
    
    if (!deliveriesSnapshot.empty) {
      return res.status(400).json({ 
        error: 'Cannot delete client with existing deliveries. Please delete deliveries first.' 
      });
    }

    await db.collection('clients').doc(id).delete();

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// GET /api/clients/:id/deliveries - Get client's deliveries
router.get('/:id/deliveries', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const snapshot = await db.collection('deliveries')
      .where('clientId', '==', id)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();
    
    const deliveries = [];
    snapshot.forEach(doc => {
      deliveries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Get total count
    const totalSnapshot = await db.collection('deliveries')
      .where('clientId', '==', id)
      .get();
    const total = totalSnapshot.size;

    res.json({
      deliveries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching client deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch client deliveries' });
  }
});

module.exports = router;


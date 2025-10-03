const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/firebase');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateDeliverer = [
  body('name').notEmpty().withMessage('Deliverer name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required')
];

// GET /api/deliverers - Get all deliverers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = db.collection('deliverers').orderBy('createdAt', 'desc');

    // Apply filters
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    if (search) {
      query = query.where('name', '>=', search).where('name', '<=', search + '\uf8ff');
    }

    const snapshot = await query.limit(parseInt(limit)).offset(parseInt(offset)).get();
    const deliverers = [];
    
    snapshot.forEach(doc => {
      deliverers.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Get total count for pagination
    const totalSnapshot = await db.collection('deliverers').get();
    const total = totalSnapshot.size;

    res.json({
      deliverers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching deliverers:', error);
    res.status(500).json({ error: 'Failed to fetch deliverers' });
  }
});

// GET /api/deliverers/:id - Get single deliverer
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const delivererDoc = await db.collection('deliverers').doc(id).get();
    
    if (!delivererDoc.exists) {
      return res.status(404).json({ error: 'Deliverer not found' });
    }

    res.json({
      id: delivererDoc.id,
      ...delivererDoc.data()
    });
  } catch (error) {
    console.error('Error fetching deliverer:', error);
    res.status(500).json({ error: 'Failed to fetch deliverer' });
  }
});

// POST /api/deliverers - Create new deliverer
router.post('/', authenticateToken, requireRole(['admin']), validateDeliverer, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const delivererData = {
      ...req.body,
      status: 'available',
      rating: 0,
      totalDeliveries: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('deliverers').add(delivererData);
    
    res.status(201).json({
      id: docRef.id,
      ...delivererData
    });
  } catch (error) {
    console.error('Error creating deliverer:', error);
    res.status(500).json({ error: 'Failed to create deliverer' });
  }
});

// PUT /api/deliverers/:id - Update deliverer
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await db.collection('deliverers').doc(id).update(updateData);
    
    const updatedDoc = await db.collection('deliverers').doc(id).get();
    
    if (!updatedDoc.exists) {
      return res.status(404).json({ error: 'Deliverer not found' });
    }

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating deliverer:', error);
    res.status(500).json({ error: 'Failed to update deliverer' });
  }
});

// DELETE /api/deliverers/:id - Delete deliverer
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const delivererDoc = await db.collection('deliverers').doc(id).get();
    if (!delivererDoc.exists) {
      return res.status(404).json({ error: 'Deliverer not found' });
    }

    // Check if deliverer has deliveries
    const deliveriesSnapshot = await db.collection('deliveries')
      .where('delivererId', '==', id)
      .get();
    
    if (!deliveriesSnapshot.empty) {
      return res.status(400).json({ 
        error: 'Cannot delete deliverer with existing deliveries. Please reassign deliveries first.' 
      });
    }

    await db.collection('deliverers').doc(id).delete();

    res.json({ message: 'Deliverer deleted successfully' });
  } catch (error) {
    console.error('Error deleting deliverer:', error);
    res.status(500).json({ error: 'Failed to delete deliverer' });
  }
});

// PUT /api/deliverers/:id/status - Update deliverer status
router.put('/:id/status', authenticateToken, requireRole(['admin', 'deliverer']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    await db.collection('deliverers').doc(id).update(updateData);
    
    const updatedDoc = await db.collection('deliverers').doc(id).get();
    
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating deliverer status:', error);
    res.status(500).json({ error: 'Failed to update deliverer status' });
  }
});

// GET /api/deliverers/:id/deliveries - Get deliverer's deliveries
router.get('/:id/deliveries', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const snapshot = await db.collection('deliveries')
      .where('delivererId', '==', id)
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
      .where('delivererId', '==', id)
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
    console.error('Error fetching deliverer deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch deliverer deliveries' });
  }
});

module.exports = router;


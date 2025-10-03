const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/firebase');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateDelivery = [
  body('clientId').notEmpty().withMessage('Client ID is required'),
  body('clientName').notEmpty().withMessage('Client name is required'),
  body('delivererId').notEmpty().withMessage('Deliverer ID is required'),
  body('delivererName').notEmpty().withMessage('Deliverer name is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('totalGoodsPrice').isNumeric().withMessage('Total goods price must be a number'),
  body('deliveryFees').isNumeric().withMessage('Delivery fees must be a number'),
  body('numberOfItems').isInt({ min: 1 }).withMessage('Number of items must be a positive integer')
];

// GET /api/deliveries - Get all deliveries with pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, clientId, delivererId } = req.query;
    const offset = (page - 1) * limit;

    let query = db.collection('deliveries').orderBy('createdAt', 'desc');

    // Apply filters
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    if (clientId) {
      query = query.where('clientId', '==', clientId);
    }
    if (delivererId) {
      query = query.where('delivererId', '==', delivererId);
    }

    const snapshot = await query.limit(parseInt(limit)).offset(parseInt(offset)).get();
    const deliveries = [];
    
    snapshot.forEach(doc => {
      deliveries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Get total count for pagination
    const totalSnapshot = await db.collection('deliveries').get();
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
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

// GET /api/deliveries/:id - Get single delivery
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryDoc = await db.collection('deliveries').doc(id).get();
    
    if (!deliveryDoc.exists) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    res.json({
      id: deliveryDoc.id,
      ...deliveryDoc.data()
    });
  } catch (error) {
    console.error('Error fetching delivery:', error);
    res.status(500).json({ error: 'Failed to fetch delivery' });
  }
});

// POST /api/deliveries - Create new delivery
router.post('/', authenticateToken, requireRole(['admin', 'deliverer']), validateDelivery, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const deliveryData = {
      ...req.body,
      status: 'pending',
      paymentStatus: 'pending',
      createdBy: req.user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('deliveries').add(deliveryData);
    
    // Update client and deliverer statistics
    await updateClientStats(deliveryData.clientId);
    await updateDelivererStats(deliveryData.delivererId);

    res.status(201).json({
      id: docRef.id,
      ...deliveryData
    });
  } catch (error) {
    console.error('Error creating delivery:', error);
    res.status(500).json({ error: 'Failed to create delivery' });
  }
});

// PUT /api/deliveries/:id - Update delivery
router.put('/:id', authenticateToken, requireRole(['admin', 'deliverer']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await db.collection('deliveries').doc(id).update(updateData);
    
    const updatedDoc = await db.collection('deliveries').doc(id).get();
    
    if (!updatedDoc.exists) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating delivery:', error);
    res.status(500).json({ error: 'Failed to update delivery' });
  }
});

// DELETE /api/deliveries/:id - Delete delivery
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const deliveryDoc = await db.collection('deliveries').doc(id).get();
    if (!deliveryDoc.exists) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const deliveryData = deliveryDoc.data();
    
    await db.collection('deliveries').doc(id).delete();
    
    // Update client and deliverer statistics
    await updateClientStats(deliveryData.clientId);
    await updateDelivererStats(deliveryData.delivererId);

    res.json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery:', error);
    res.status(500).json({ error: 'Failed to delete delivery' });
  }
});

// PUT /api/deliveries/:id/status - Update delivery status
router.put('/:id/status', authenticateToken, requireRole(['admin', 'deliverer']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'assigned', 'in-transit', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (status === 'delivered') {
      updateData.completedDate = new Date();
    }

    await db.collection('deliveries').doc(id).update(updateData);
    
    const updatedDoc = await db.collection('deliveries').doc(id).get();
    
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

// Helper function to update client statistics
async function updateClientStats(clientId) {
  try {
    const deliveriesSnapshot = await db.collection('deliveries')
      .where('clientId', '==', clientId)
      .get();
    
    let totalDeliveries = 0;
    let totalSpent = 0;
    
    deliveriesSnapshot.forEach(doc => {
      const data = doc.data();
      totalDeliveries += data.numberOfItems || 0;
      totalSpent += (data.totalGoodsPrice || 0) + (data.deliveryFees || 0);
    });
    
    await db.collection('clients').doc(clientId).update({
      totalDeliveries,
      totalSpent,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating client stats:', error);
  }
}

// Helper function to update deliverer statistics
async function updateDelivererStats(delivererId) {
  try {
    const deliveriesSnapshot = await db.collection('deliveries')
      .where('delivererId', '==', delivererId)
      .get();
    
    const totalDeliveries = deliveriesSnapshot.size;
    
    await db.collection('deliverers').doc(delivererId).update({
      totalDeliveries,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating deliverer stats:', error);
  }
}

module.exports = router;


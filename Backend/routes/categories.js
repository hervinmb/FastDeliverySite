const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    // For now, return static categories based on your data model
    // In the future, you can store these in Firestore
    const categories = [
      {
        id: 'delivery_status',
        name: 'Delivery Status',
        values: ['pending', 'assigned', 'in-transit', 'delivered', 'cancelled']
      },
      {
        id: 'deliverer_status',
        name: 'Deliverer Status',
        values: ['available', 'busy', 'offline']
      },
      {
        id: 'payment_status',
        name: 'Payment Status',
        values: ['pending', 'paid', 'failed']
      },
      {
        id: 'user_roles',
        name: 'User Roles',
        values: ['admin', 'deliverer', 'client']
      }
    ];

    res.json({
      categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:id - Get specific category
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const categories = {
      'delivery_status': {
        id: 'delivery_status',
        name: 'Delivery Status',
        values: ['pending', 'assigned', 'in-transit', 'delivered', 'cancelled']
      },
      'deliverer_status': {
        id: 'deliverer_status',
        name: 'Deliverer Status',
        values: ['available', 'busy', 'offline']
      },
      'payment_status': {
        id: 'payment_status',
        name: 'Payment Status',
        values: ['pending', 'paid', 'failed']
      },
      'user_roles': {
        id: 'user_roles',
        name: 'User Roles',
        values: ['admin', 'deliverer', 'client']
      }
    };

    const category = categories[id];
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

module.exports = router;

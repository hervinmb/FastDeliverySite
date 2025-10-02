const express = require('express');
const { body, validationResult } = require('express-validator');
const { db, auth } = require('../config/firebase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('displayName').notEmpty().withMessage('Display name is required'),
  body('role').isIn(['admin', 'deliverer', 'client']).withMessage('Valid role is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, displayName, role, phone } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName
    });

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      email,
      displayName,
      role: role || 'client',
      phone: phone || '',
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: null
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        uid: userRecord.uid,
        email,
        displayName,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

// POST /api/auth/login - Login user (returns custom token)
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Note: In a real implementation, you would verify the password
    // For now, we'll create a custom token for demonstration
    const userRecord = await auth.getUserByEmail(email);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    if (!userData.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Create custom token
    const customToken = await auth.createCustomToken(userRecord.uid, {
      role: userData.role
    });

    // Update last login
    await db.collection('users').doc(userRecord.uid).update({
      lastLoginAt: new Date()
    });

    res.json({
      message: 'Login successful',
      customToken,
      user: {
        uid: userRecord.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    if (error.code === 'auth/user-not-found') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Failed to login' });
    }
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    res.json({
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      phone: userData.phone,
      isActive: userData.isActive,
      createdAt: userData.createdAt,
      lastLoginAt: userData.lastLoginAt
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT /api/auth/me - Update current user profile
router.put('/me', authenticateToken, [
  body('displayName').optional().notEmpty().withMessage('Display name cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await db.collection('users').doc(req.user.uid).update(updateData);
    
    const updatedDoc = await db.collection('users').doc(req.user.uid).get();
    
    res.json({
      uid: updatedDoc.data().uid,
      email: updatedDoc.data().email,
      displayName: updatedDoc.data().displayName,
      role: updatedDoc.data().role,
      phone: updatedDoc.data().phone,
      isActive: updatedDoc.data().isActive,
      createdAt: updatedDoc.data().createdAt,
      lastLoginAt: updatedDoc.data().lastLoginAt
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// POST /api/auth/logout - Logout user (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return success as token removal is handled client-side
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

module.exports = router;

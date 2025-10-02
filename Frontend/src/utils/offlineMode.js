// Offline Mode Utility - Temporary workaround for Firebase permission issues
import { auth } from '../config/firebase';

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'trego_users',
  DELIVERIES: 'trego_deliveries',
  CLIENTS: 'trego_clients',
  DELIVERERS: 'trego_deliverers'
};

// Mock data for offline mode
const MOCK_DATA = {
  users: [
    {
      uid: 'mock-admin',
      email: 'admin@trego.com',
      displayName: 'Admin User',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: new Date()
    }
  ],
  deliveries: [
    {
      id: 'delivery-1',
      clientName: 'Client Exemple 1',
      delivererName: 'Pierre Durand',
      destination: '123 Rue de la Paix, Conakry',
      numberOfItems: 2,
      totalGoodsPrice: 150.75,
      deliveryFees: 10.00,
      status: 'pending',
      notes: 'Livraison fragile',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'delivery-2',
      clientName: 'Client Exemple 2',
      delivererName: 'Sophie Bernard',
      destination: '456 Avenue des Champs, Kankan',
      numberOfItems: 1,
      totalGoodsPrice: 89.50,
      deliveryFees: 8.00,
      status: 'in-transit',
      notes: 'Livraison urgente',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  clients: [
    {
      id: 'client-1',
      name: 'Client Exemple 1',
      email: 'client1@example.com',
      phone: '+224 123 456 789',
      address: 'Conakry, Guinea',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'client-2',
      name: 'Client Exemple 2',
      email: 'client2@example.com',
      phone: '+224 987 654 321',
      address: 'Kankan, Guinea',
      isActive: true,
      createdAt: new Date()
    }
  ],
  deliverers: [
    {
      id: 'deliverer-1',
      name: 'Pierre Durand',
      email: 'pierre@example.com',
      phone: '+224 111 222 333',
      vehicleType: 'Moto',
      status: 'available',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'deliverer-2',
      name: 'Sophie Bernard',
      email: 'sophie@example.com',
      phone: '+224 444 555 666',
      vehicleType: 'Voiture',
      status: 'available',
      isActive: true,
      createdAt: new Date()
    }
  ]
};

// Initialize offline data if not exists
export const initializeOfflineData = () => {
  Object.keys(STORAGE_KEYS).forEach(key => {
    const storageKey = STORAGE_KEYS[key];
    const collectionName = key.toLowerCase();
    
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(MOCK_DATA[collectionName] || []));
    }
  });
};

// Get data from local storage
export const getOfflineData = (collectionName) => {
  const storageKey = STORAGE_KEYS[collectionName.toUpperCase()];
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : [];
};

// Save data to local storage
export const saveOfflineData = (collectionName, data) => {
  const storageKey = STORAGE_KEYS[collectionName.toUpperCase()];
  localStorage.setItem(storageKey, JSON.stringify(data));
};

// Add new item to offline data
export const addOfflineItem = (collectionName, item) => {
  const data = getOfflineData(collectionName);
  const newItem = {
    ...item,
    id: item.id || `${collectionName}-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  data.push(newItem);
  saveOfflineData(collectionName, data);
  return newItem;
};

// Update item in offline data
export const updateOfflineItem = (collectionName, itemId, updates) => {
  const data = getOfflineData(collectionName);
  const index = data.findIndex(item => item.id === itemId);
  if (index !== -1) {
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date()
    };
    saveOfflineData(collectionName, data);
    return data[index];
  }
  return null;
};

// Delete item from offline data
export const deleteOfflineItem = (collectionName, itemId) => {
  const data = getOfflineData(collectionName);
  const filteredData = data.filter(item => item.id !== itemId);
  saveOfflineData(collectionName, filteredData);
  return true;
};

// Mock authentication for offline mode
export const mockAuth = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock authentication
    if (email === 'admin@trego.com' && password === 'admin123') {
      const user = {
        uid: 'mock-admin',
        email: 'admin@trego.com',
        displayName: 'Admin User',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };
      
      // Store in localStorage
      localStorage.setItem('trego_current_user', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid credentials');
  },
  
  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {
      uid: `mock-user-${Date.now()}`,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role || 'client',
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: null
    };
    
    // Store in localStorage
    localStorage.setItem('trego_current_user', JSON.stringify(user));
    return user;
  },
  
  logout: async () => {
    localStorage.removeItem('trego_current_user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('trego_current_user');
    return user ? JSON.parse(user) : null;
  }
};

// Check if we should use offline mode
export const shouldUseOfflineMode = () => {
  // Check if Firebase is having issues
  const hasFirebaseError = localStorage.getItem('trego_firebase_error') === 'true';
  const userPreference = localStorage.getItem('trego_offline_mode') === 'true';
  
  return hasFirebaseError || userPreference;
};

// Enable offline mode
export const enableOfflineMode = () => {
  localStorage.setItem('trego_offline_mode', 'true');
  initializeOfflineData();
  console.log('🔄 Offline mode enabled');
};

// Disable offline mode
export const disableOfflineMode = () => {
  localStorage.removeItem('trego_offline_mode');
  localStorage.removeItem('trego_firebase_error');
  console.log('🔄 Offline mode disabled');
};

// Export for browser console
if (typeof window !== 'undefined') {
  window.enableOfflineMode = enableOfflineMode;
  window.disableOfflineMode = disableOfflineMode;
  window.mockAuth = mockAuth;
}

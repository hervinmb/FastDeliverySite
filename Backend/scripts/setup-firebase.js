const admin = require('firebase-admin');
const { db } = require('../config/firebase');

// Firebase setup script
const setupFirebase = async () => {
  try {
    console.log('🚀 Setting up Firebase collections and indexes...');

    // Create initial collections with sample data
    await createInitialCollections();
    
    // Create Firestore indexes
    await createFirestoreIndexes();
    
    console.log('✅ Firebase setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Firebase setup failed:', error);
    process.exit(1);
  }
};

const createInitialCollections = async () => {
  console.log('📝 Creating initial collections...');

  // Create users collection with sample admin user
  const adminUser = {
    uid: 'admin-user-123',
    email: 'admin@livraisonrapide.com',
    displayName: 'Administrateur',
    role: 'admin',
    phone: '+1234567890',
    isActive: true,
    createdAt: new Date(),
    lastLoginAt: null
  };

  await db.collection('users').doc(adminUser.uid).set(adminUser);
  console.log('✅ Users collection created with admin user');

  // Create sample clients
  const sampleClients = [
    {
      name: 'Client Exemple 1',
      contactPerson: 'Jean Dupont',
      email: 'jean@client1.com',
      phone: '+1234567890',
      address: '123 Rue de la Paix, Paris, France',
      isActive: true,
      totalDeliveries: 0,
      totalSpent: 0.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Client Exemple 2',
      contactPerson: 'Marie Martin',
      email: 'marie@client2.com',
      phone: '+1234567891',
      address: '456 Avenue des Champs, Lyon, France',
      isActive: true,
      totalDeliveries: 0,
      totalSpent: 0.00,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const client of sampleClients) {
    await db.collection('clients').add(client);
  }
  console.log('✅ Sample clients created');

  // Create sample deliverers
  const sampleDeliverers = [
    {
      name: 'Pierre Durand',
      email: 'pierre@livreur.com',
      phone: '+1234567892',
      vehicleInfo: 'Van - Plaque ABC-123',
      status: 'available',
      rating: 4.5,
      totalDeliveries: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Sophie Bernard',
      email: 'sophie@livreur.com',
      phone: '+1234567893',
      vehicleInfo: 'Moto - Plaque XYZ-789',
      status: 'available',
      rating: 4.8,
      totalDeliveries: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const deliverer of sampleDeliverers) {
    await db.collection('deliverers').add(deliverer);
  }
  console.log('✅ Sample deliverers created');

  // Create sample deliveries
  const sampleDeliveries = [
    {
      clientId: 'client-1',
      clientName: 'Client Exemple 1',
      delivererId: 'deliverer-1',
      delivererName: 'Pierre Durand',
      destination: '123 Rue de la Paix, Paris, France',
      totalGoodsPrice: 150.75,
      deliveryFees: 10.00,
      numberOfItems: 2,
      status: 'pending',
      deliveryDate: new Date(),
      scheduledDate: new Date(),
      completedDate: null,
      notes: 'Articles fragiles - manipuler avec précaution',
      paymentStatus: 'pending',
      createdBy: 'admin-user-123',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      clientId: 'client-2',
      clientName: 'Client Exemple 2',
      delivererId: 'deliverer-2',
      delivererName: 'Sophie Bernard',
      destination: '456 Avenue des Champs, Lyon, France',
      totalGoodsPrice: 89.50,
      deliveryFees: 8.00,
      numberOfItems: 1,
      status: 'in-transit',
      deliveryDate: new Date(),
      scheduledDate: new Date(),
      completedDate: null,
      notes: 'Livraison express',
      paymentStatus: 'pending',
      createdBy: 'admin-user-123',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const delivery of sampleDeliveries) {
    await db.collection('deliveries').add(delivery);
  }
  console.log('✅ Sample deliveries created');
};

const createFirestoreIndexes = async () => {
  console.log('📊 Firestore indexes will be created automatically when needed');
  console.log('💡 For production, create composite indexes in Firebase Console:');
  console.log('   - deliveries: status + createdAt');
  console.log('   - deliveries: clientId + createdAt');
  console.log('   - deliveries: delivererId + createdAt');
  console.log('   - clients: name (for search)');
  console.log('   - deliverers: name (for search)');
  console.log('   - deliverers: status + createdAt');
};

// Run setup if called directly
if (require.main === module) {
  setupFirebase();
}

module.exports = { setupFirebase };

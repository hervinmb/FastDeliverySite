const { admin, db } = require('../config/firebase');

const setupFirebase = async () => {
  try {
    console.log('🚀 Setting up Firebase collections...');
    
    // Create initial collections with sample data
    const collections = {
      users: [
        {
          uid: 'admin-user-1',
          email: 'admin@trego.com',
          displayName: 'Admin User',
          role: 'admin',
          phone: '+1234567890',
          isActive: true,
          createdAt: new Date(),
          lastLoginAt: null
        }
      ],
      clients: [
        {
          clientId: 'client-1',
          name: 'Sample Client',
          contactPerson: 'John Doe',
          email: 'client@example.com',
          phone: '+1234567890',
          address: '123 Main Street, City, Country',
          isActive: true,
          totalDeliveries: 0,
          totalSpent: 0.00,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      deliverers: [
        {
          delivererId: 'deliverer-1',
          name: 'Sample Deliverer',
          email: 'deliverer@example.com',
          phone: '+1234567890',
          vehicleInfo: 'Van - License Plate ABC-123',
          status: 'available',
          rating: 0,
          totalDeliveries: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      deliveries: [
        {
          deliveryId: 'delivery-1',
          clientId: 'client-1',
          clientName: 'Sample Client',
          delivererId: 'deliverer-1',
          delivererName: 'Sample Deliverer',
          destination: '456 Oak Avenue, Town, Country',
          totalGoodsPrice: 150.75,
          deliveryFees: 10.00,
          numberOfItems: 1,
          status: 'pending',
          deliveryDate: new Date(),
          scheduledDate: new Date(),
          completedDate: null,
          notes: 'Sample delivery',
          paymentStatus: 'pending',
          createdBy: 'admin-user-1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    };

    // Create collections and documents
    for (const [collectionName, documents] of Object.entries(collections)) {
      console.log(`📝 Creating ${collectionName} collection...`);
      
      for (const docData of documents) {
        const docRef = await db.collection(collectionName).add(docData);
        console.log(`   ✅ Created document ${docRef.id} in ${collectionName}`);
      }
    }

    console.log('🎉 Firebase setup completed successfully!');
    console.log('📊 You can now test the API endpoints:');
    console.log('   - GET /api/categories');
    console.log('   - GET /api/clients');
    console.log('   - GET /api/deliverers');
    console.log('   - GET /api/deliveries');

  } catch (error) {
    console.error('❌ Error setting up Firebase:', error);
    console.error('Make sure your Firebase credentials are correct and Firestore is enabled.');
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupFirebase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

module.exports = setupFirebase;

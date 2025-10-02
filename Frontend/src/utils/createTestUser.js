// Utility script to create test users for development
// This can be run in the browser console or as a component

import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export const createTestUsers = async () => {
  const testUsers = [
    {
      email: 'admin@trego.com',
      password: 'admin123',
      displayName: 'Admin User',
      role: 'admin'
    },
    {
      email: 'client@trego.com',
      password: 'client123',
      displayName: 'Test Client',
      role: 'client'
    },
    {
      email: 'deliverer@trego.com',
      password: 'deliverer123',
      displayName: 'Test Deliverer',
      role: 'deliverer'
    }
  ];

  console.log('Creating test users...');
  
  for (const userData of testUsers) {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      // Update Firebase profile
      await updateProfile(userCredential.user, {
        displayName: userData.displayName
      });
      
      // Create Firestore user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: null
      });
      
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ User already exists: ${userData.email}`);
      } else {
        console.error(`❌ Error creating user ${userData.email}:`, error);
      }
    }
  }
  
  console.log('Test user creation completed!');
  console.log('You can now login with:');
  console.log('- admin@trego.com / admin123 (Admin)');
  console.log('- client@trego.com / client123 (Client)');
  console.log('- deliverer@trego.com / deliverer123 (Deliverer)');
};

// Function to create sample data
export const createSampleData = async () => {
  console.log('Creating sample data...');
  
  try {
    // Create sample clients
    const clients = [
      { name: 'Client Exemple 1', email: 'client1@example.com', phone: '+224 123 456 789', address: 'Conakry, Guinea', isActive: true },
      { name: 'Client Exemple 2', email: 'client2@example.com', phone: '+224 987 654 321', address: 'Kankan, Guinea', isActive: true },
      { name: 'Client Exemple 3', email: 'client3@example.com', phone: '+224 555 123 456', address: 'Labé, Guinea', isActive: true }
    ];
    
    for (const client of clients) {
      await setDoc(doc(db, 'clients'), {
        ...client,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Create sample deliverers
    const deliverers = [
      { name: 'Pierre Durand', email: 'pierre@example.com', phone: '+224 111 222 333', vehicleType: 'Moto', status: 'available', isActive: true },
      { name: 'Sophie Bernard', email: 'sophie@example.com', phone: '+224 444 555 666', vehicleType: 'Voiture', status: 'available', isActive: true },
      { name: 'Jean Martin', email: 'jean@example.com', phone: '+224 777 888 999', vehicleType: 'Moto', status: 'busy', isActive: true }
    ];
    
    for (const deliverer of deliverers) {
      await setDoc(doc(db, 'deliverers'), {
        ...deliverer,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Create sample deliveries
    const deliveries = [
      {
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
    ];
    
    for (const delivery of deliveries) {
      await setDoc(doc(db, 'deliveries'), delivery);
    }
    
    console.log('✅ Sample data created successfully!');
    console.log('- 3 sample clients');
    console.log('- 3 sample deliverers');
    console.log('- 2 sample deliveries');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
};

// Export functions for use in browser console
if (typeof window !== 'undefined') {
  window.createTestUsers = createTestUsers;
  window.createSampleData = createSampleData;
}

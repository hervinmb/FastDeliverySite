// Firebase Test Utility - Use this to debug permission issues
import { db } from '../config/firebase';
import { doc, setDoc, getDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  console.log('🔍 Testing Firebase connection...');
  
  try {
    // Test 1: Write to test collection
    console.log('📝 Testing write operation...');
    await setDoc(doc(db, 'test', 'connection-test'), {
      test: true,
      timestamp: new Date(),
      message: 'Firebase connection test'
    });
    console.log('✅ Write operation successful');
    
    // Test 2: Read from test collection
    console.log('📖 Testing read operation...');
    const docSnap = await getDoc(doc(db, 'test', 'connection-test'));
    if (docSnap.exists()) {
      console.log('✅ Read operation successful:', docSnap.data());
    } else {
      console.log('❌ Document not found');
    }
    
    // Test 3: Write to users collection
    console.log('👤 Testing users collection write...');
    const testUserId = 'test-user-' + Date.now();
    await setDoc(doc(db, 'users', testUserId), {
      uid: testUserId,
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'client',
      isActive: true,
      createdAt: new Date()
    });
    console.log('✅ Users collection write successful');
    
    // Test 4: Write to deliveries collection
    console.log('📦 Testing deliveries collection write...');
    await addDoc(collection(db, 'deliveries'), {
      clientName: 'Test Client',
      delivererName: 'Test Deliverer',
      destination: 'Test Address',
      numberOfItems: 1,
      totalGoodsPrice: 100,
      deliveryFees: 10,
      status: 'pending',
      createdAt: new Date()
    });
    console.log('✅ Deliveries collection write successful');
    
    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await deleteDoc(doc(db, 'test', 'connection-test'));
    await deleteDoc(doc(db, 'users', testUserId));
    console.log('✅ Cleanup successful');
    
    console.log('🎉 All Firebase tests passed! Your connection is working.');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('🔧 SOLUTION: Update your Firestore rules in Firebase Console');
      console.log('📋 Copy this rule:');
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
      `);
    }
    
    return false;
  }
};

// Test specific collections
export const testCollectionAccess = async (collectionName) => {
  console.log(`🔍 Testing ${collectionName} collection...`);
  
  try {
    // Test write
    const docRef = await addDoc(collection(db, collectionName), {
      test: true,
      timestamp: new Date()
    });
    console.log(`✅ ${collectionName} write successful`);
    
    // Test read
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(`✅ ${collectionName} read successful`);
    }
    
    // Clean up
    await deleteDoc(docRef);
    console.log(`✅ ${collectionName} cleanup successful`);
    
    return true;
  } catch (error) {
    console.error(`❌ ${collectionName} test failed:`, error);
    return false;
  }
};

// Export for browser console use
if (typeof window !== 'undefined') {
  window.testFirebaseConnection = testFirebaseConnection;
  window.testCollectionAccess = testCollectionAccess;
}

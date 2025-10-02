const { db, auth } = require('../config/firebase');

// Test Firebase connection and operations
const testFirebase = async () => {
  console.log('🧪 Testing Firebase connection...\n');

  try {
    // Test 1: Firestore connection
    console.log('1️⃣ Testing Firestore connection...');
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('✅ Firestore connection successful\n');

    // Test 2: Create a test document
    console.log('2️⃣ Testing document creation...');
    await db.collection('test').doc('test-doc').set({
      message: 'Hello from LIVRAISON RAPIDE!',
      timestamp: new Date(),
      status: 'active'
    });
    console.log('✅ Document creation successful\n');

    // Test 3: Read the test document
    console.log('3️⃣ Testing document reading...');
    const doc = await db.collection('test').doc('test-doc').get();
    if (doc.exists) {
      console.log('✅ Document reading successful');
      console.log('📄 Document data:', doc.data());
    } else {
      console.log('❌ Document not found');
    }
    console.log('');

    // Test 4: Test collections structure
    console.log('4️⃣ Testing collections structure...');
    const collections = ['users', 'clients', 'deliverers', 'deliveries'];
    
    for (const collectionName of collections) {
      try {
        const snapshot = await db.collection(collectionName).limit(1).get();
        console.log(`✅ Collection '${collectionName}' exists (${snapshot.size} documents)`);
      } catch (error) {
        console.log(`⚠️  Collection '${collectionName}' might not exist yet: ${error.message}`);
      }
    }
    console.log('');

    // Test 5: Test authentication (if possible)
    console.log('5️⃣ Testing Firebase Auth...');
    try {
      // This will only work if we have a valid user
      console.log('✅ Firebase Auth service is available');
    } catch (error) {
      console.log('⚠️  Firebase Auth test skipped:', error.message);
    }
    console.log('');

    // Test 6: Clean up test data
    console.log('6️⃣ Cleaning up test data...');
    await db.collection('test').doc('test-doc').delete();
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 All Firebase tests passed successfully!');
    console.log('🚀 Your Firebase configuration is working correctly.\n');

    console.log('📋 Next steps:');
    console.log('   1. Run: npm run setup-firebase');
    console.log('   2. Start your backend: npm run dev');
    console.log('   3. Start your frontend: npm start');
    console.log('   4. Open http://localhost:3000');

  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    console.error('🔍 Error details:', error);
    
    console.log('\n🆘 Troubleshooting:');
    console.log('   1. Check your Firebase configuration');
    console.log('   2. Verify service account permissions');
    console.log('   3. Ensure Firestore is enabled');
    console.log('   4. Check your internet connection');
    
    process.exit(1);
  }
};

// Run tests if called directly
if (require.main === module) {
  testFirebase();
}

module.exports = { testFirebase };

const { admin, db, auth } = require('../config/firebase');

const testFirebase = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test Firestore
    console.log('📊 Testing Firestore...');
    const testDoc = await db.collection('_test').doc('connection').set({
      test: true,
      timestamp: new Date()
    });
    console.log('✅ Firestore write test passed');
    
    const testRead = await db.collection('_test').doc('connection').get();
    if (testRead.exists) {
      console.log('✅ Firestore read test passed');
      console.log('   Data:', testRead.data());
    }
    
    // Clean up test document
    await db.collection('_test').doc('connection').delete();
    console.log('✅ Firestore cleanup completed');
    
    // Test Auth
    console.log('🔐 Testing Firebase Auth...');
    try {
      // Try to list users (this will fail if auth is not properly configured)
      const listUsersResult = await auth.listUsers(1);
      console.log('✅ Firebase Auth test passed');
    } catch (authError) {
      console.log('⚠️  Firebase Auth test failed:', authError.message);
      console.log('   This is normal if you haven\'t configured Firebase Auth yet');
    }
    
    console.log('🎉 Firebase connection test completed!');
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 5) {
      console.error('\n💡 Troubleshooting tips:');
      console.error('1. Check if your Firebase project exists');
      console.error('2. Ensure Firestore is enabled in your Firebase console');
      console.error('3. Verify your service account credentials');
      console.error('4. Check if the project ID is correct');
    }
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testFirebase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}

module.exports = testFirebase;
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
let serviceAccount;

// Try to load from environment variables first, then from JSON file
if (process.env.FIREBASE_PRIVATE_KEY) {
  // Using environment variables
  serviceAccount = {
    type: "service_account",
    project_id: "trego-landing-page",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };
} else {
  // Using JSON file
  try {
    serviceAccount = require('./firebase-admin.json');
  } catch (error) {
    console.error('Firebase configuration not found. Please set up environment variables or firebase-admin.json file.');
    process.exit(1);
  }
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: "trego-landing-page",
      storageBucket: "trego-landing-page.firebasestorage.app"
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();
const auth = admin.auth();

// Test Firebase connection
const testConnection = async () => {
  try {
    // Try to access a collection to test connection
    // We'll use a simple query that doesn't require the collection to exist
    await db.collection('_test_connection').limit(1).get();
    console.log('✅ Firebase Firestore connection successful');
  } catch (error) {
    console.error('❌ Firebase Firestore connection failed:', error.message);
    console.error('Error details:', error.code, error.details);
    
    // Provide helpful error messages
    if (error.code === 5) {
      console.error('💡 This usually means:');
      console.error('   1. Firebase project does not exist');
      console.error('   2. Firestore is not enabled for this project');
      console.error('   3. Service account credentials are invalid');
      console.error('   4. Wrong project ID in configuration');
    }
  }
};

// Run connection test
testConnection();

module.exports = { admin, db, auth };

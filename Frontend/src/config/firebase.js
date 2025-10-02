// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBFah3hczu8sTbVyczh5S9TwV3hY52TMpk",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "trego-landing-page.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "trego-landing-page",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "trego-landing-page.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "7912729022",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:7912729022:web:1821c2413f1fee814e31ef",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-JNMY9JH91M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in production)
let analytics;
if (process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === 'development') {
  try {
    // Only connect if not already connected
    if (!auth._delegate._config?.emulator) {
      connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    }
  } catch (error) {
    // Emulator already connected or not available
    console.log('Auth emulator not available');
  }
  
  try {
    // Only connect if not already connected
    if (!db._delegate._settings?.host?.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
  } catch (error) {
    // Emulator already connected or not available
    console.log('Firestore emulator not available');
  }
}

export { app, analytics, auth, db };

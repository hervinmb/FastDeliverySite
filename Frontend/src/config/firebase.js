// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFah3hczu8sTbVyczh5S9TwV3hY52TMpk",
  authDomain: "trego-landing-page.firebaseapp.com",
  projectId: "trego-landing-page",
  storageBucket: "trego-landing-page.firebasestorage.app",
  messagingSenderId: "7912729022",
  appId: "1:7912729022:web:1821c2413f1fee814e31ef",
  measurementId: "G-JNMY9JH91M"
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

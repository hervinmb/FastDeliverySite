# 🔥 Firebase Configuration Guide

This guide will help you set up Firebase for your LIVRAISON RAPIDE system.

## 📋 Prerequisites

1. A Google account
2. Node.js installed
3. Your project already created

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `trego-landing-page`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 🔐 Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 🗄️ Step 3: Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## 🔑 Step 4: Generate Service Account Key

1. Go to Project Settings (gear icon)
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `firebase-admin.json`
6. Place it in `Backend/config/` folder

## ⚙️ Step 5: Configure Backend

### Option A: Using JSON File (Easier for development)

1. Place your `firebase-admin.json` in `Backend/config/`
2. The system will automatically use it

### Option B: Using Environment Variables (Recommended for production)

1. Copy `Backend/env.example` to `Backend/.env`
2. Fill in your Firebase credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=trego-landing-page
FIREBASE_PRIVATE_KEY_ID=your_private_key_id_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@trego-landing-page.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id_here
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40trego-landing-page.iam.gserviceaccount.com

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRES_IN=24h
```

## 🌐 Step 6: Configure Frontend

The frontend is already configured with your Firebase credentials in `Frontend/src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBFah3hczu8sTbVyczh5S9TwV3hY52TMpk",
  authDomain: "trego-landing-page.firebaseapp.com",
  projectId: "trego-landing-page",
  storageBucket: "trego-landing-page.firebasestorage.app",
  messagingSenderId: "7912729022",
  appId: "1:7912729022:web:1821c2413f1fee814e31ef",
  measurementId: "G-JNMY9JH91M"
};
```

## 🗂️ Step 7: Set Up Firestore Security Rules

Go to Firestore Database > Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Authenticated users can access clients
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
    
    // Authenticated users can access deliverers
    match /deliverers/{delivererId} {
      allow read, write: if request.auth != null;
    }
    
    // Authenticated users can access deliveries
    match /deliveries/{deliveryId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow reading delivery items
    match /deliveryItems/{itemId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Step 8: Initialize Database

Run the setup script to create initial data:

```bash
cd Backend
npm run setup-firebase
```

This will create:
- Sample users (admin)
- Sample clients
- Sample deliverers
- Sample deliveries
- Initial collections structure

## 🧪 Step 9: Test Your Setup

1. Start the backend:
```bash
cd Backend
npm run dev
```

2. Start the frontend:
```bash
cd Frontend
npm start
```

3. Open `http://localhost:3000`
4. Try to register a new user
5. Check if data appears in Firebase Console

## 📊 Step 10: Create Firestore Indexes (Optional but Recommended)

For better performance, create these composite indexes in Firebase Console:

1. Go to Firestore Database > Indexes
2. Click "Create Index"
3. Create these indexes:

**For deliveries collection:**
- Collection: `deliveries`
- Fields: `status` (Ascending), `createdAt` (Descending)

- Collection: `deliveries`
- Fields: `clientId` (Ascending), `createdAt` (Descending)

- Collection: `deliveries`
- Fields: `delivererId` (Ascending), `createdAt` (Descending)

**For clients collection:**
- Collection: `clients`
- Fields: `name` (Ascending)

**For deliverers collection:**
- Collection: `deliverers`
- Fields: `name` (Ascending)

- Collection: `deliverers`
- Fields: `status` (Ascending), `createdAt` (Descending)

## 🔒 Step 11: Production Security

For production deployment:

1. **Update Firestore Rules** to be more restrictive
2. **Use environment variables** instead of JSON files
3. **Enable App Check** for additional security
4. **Set up monitoring** and alerts
5. **Configure backup** strategies

## 🆘 Troubleshooting

### Common Issues:

1. **"Firebase configuration not found"**
   - Make sure `firebase-admin.json` is in `Backend/config/`
   - Or set up environment variables properly

2. **"Permission denied"**
   - Check Firestore security rules
   - Make sure user is authenticated

3. **"Invalid API key"**
   - Verify Firebase config in frontend
   - Check if API key is correct

4. **"Service account not found"**
   - Regenerate service account key
   - Check file permissions

### Getting Help:

- Check Firebase Console for error logs
- Verify all credentials are correct
- Make sure all services are enabled
- Check network connectivity

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Service account key downloaded
- [ ] Backend configuration complete
- [ ] Frontend configuration complete
- [ ] Security rules set
- [ ] Initial data created
- [ ] Application running successfully
- [ ] Can register/login users
- [ ] Can create/view deliveries

## 🎉 You're Ready!

Your Firebase configuration is now complete! The LIVRAISON RAPIDE system should be fully functional with:

- ✅ User authentication
- ✅ Data storage in Firestore
- ✅ Real-time updates
- ✅ Secure API endpoints
- ✅ Mobile-responsive interface

Start building your delivery management system! 🚚

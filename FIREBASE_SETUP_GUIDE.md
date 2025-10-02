# 🔥 Firebase Setup Guide

## 🚨 **Current Issue: Permission Denied**

You're getting "Missing or insufficient permissions" errors because your Firestore security rules are too restrictive.

## 🔧 **Quick Fix Steps**

### **Step 1: Update Firestore Rules**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `trego-landing-page`
3. Go to **Firestore Database** → **Rules**
4. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all operations for authenticated users (DEVELOPMENT ONLY)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Click **Publish**

### **Step 2: Verify Firebase Project Settings**

Make sure these are enabled in your Firebase project:

1. **Authentication** → **Sign-in method** → Enable **Email/Password**
2. **Firestore Database** → **Rules** → Updated (from Step 1)
3. **Project Settings** → **General** → Copy your config

### **Step 3: Test the Fix**

1. Refresh your application
2. Try to register a new user
3. Check browser console for errors

## 🔍 **Troubleshooting**

### **If Still Getting Permission Errors:**

1. **Check Firebase Console**:
   - Go to Firestore Database
   - Check if collections exist
   - Verify rules are published

2. **Check Browser Console**:
   - Look for specific error codes
   - Check network tab for failed requests

3. **Verify Project ID**:
   - Make sure `projectId: "trego-landing-page"` matches your Firebase project

### **Common Error Codes:**

- `permission-denied` → Update Firestore rules
- `project-not-found` → Check project ID
- `auth/user-not-found` → User doesn't exist
- `auth/wrong-password` → Incorrect password

## 🎯 **Production Security Rules**

For production, use these more secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Authenticated users can manage deliveries
    match /deliveries/{deliveryId} {
      allow read, write: if request.auth != null;
    }
    
    // Authenticated users can manage clients
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
    
    // Authenticated users can manage deliverers
    match /deliverers/{delivererId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## ✅ **After Fixing Rules**

1. **Test Registration**: Create a new user account
2. **Test Login**: Login with the created account
3. **Test Dashboard**: Check if stats load correctly
4. **Test Deliveries**: Add/edit/delete deliveries

## 🆘 **Still Having Issues?**

If you're still getting errors:

1. **Check Firebase Project Status**: Make sure it's active
2. **Verify Billing**: Some features require billing enabled
3. **Check Quotas**: Make sure you haven't exceeded limits
4. **Contact Support**: Use Firebase support if needed

## 📞 **Quick Test**

After updating rules, try this in browser console:

```javascript
// Test if you can write to Firestore
import { db } from './src/config/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

try {
  await setDoc(doc(db, 'test', 'test'), { test: true });
  console.log('✅ Firestore write successful');
} catch (error) {
  console.error('❌ Firestore write failed:', error);
}
```

The main issue is the Firestore security rules. Update them and your authentication should work perfectly! 🚀

# 🚀 LIVRAISON RAPIDE - Quick Start Guide

Get your delivery management system up and running in minutes!

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

**Backend:**
```bash
cd Backend
npm install
```

**Frontend:**
```bash
cd Frontend
npm install
```

### 2. Configure Firebase

**Option A: Using JSON File (Easiest)**
1. Download your Firebase service account key from [Firebase Console](https://console.firebase.google.com/)
2. Rename it to `firebase-admin.json`
3. Place it in `Backend/config/` folder

**Option B: Using Environment Variables**
1. Copy `Backend/env.example` to `Backend/.env`
2. Fill in your Firebase credentials

### 3. Test Firebase Connection

```bash
cd Backend
npm run test-firebase
```

### 4. Initialize Database

```bash
cd Backend
npm run setup-firebase
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm start
```

### 6. Access Your App

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎯 What You Get

- ✅ **Complete Authentication System**
- ✅ **Delivery Management Table** (matching your design)
- ✅ **Client & Deliverer Management**
- ✅ **Mobile-Responsive Design**
- ✅ **Bilingual Support** (French/English)
- ✅ **Real-time Updates**
- ✅ **Professional Dashboard**

## 🔧 Firebase Setup Details

### Required Firebase Services:
1. **Authentication** - Enable Email/Password
2. **Firestore Database** - Create in test mode
3. **Service Account** - Generate and download key

### Your Firebase Config (Already Set):
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

## 📱 Features Overview

### Main Table (Matching Your Design):
- **CLIENTS** - Client names
- **NOMBRE DE LIVRAISONS** - Number of deliveries
- **PRIX TOTAL DES MARCHANDISES** - Total goods price
- **DESTINATION** - Delivery destination
- **LIVREURS** - Deliverer names
- **FRAIS DE LIVRAISON** - Delivery fees
- **+ Button** - Add new deliveries

### Mobile Features:
- Horizontal scrolling tables
- Touch-friendly interface
- Responsive navigation
- Mobile-optimized forms

### Language Support:
- French (default)
- English
- Real-time language switching

## 🆘 Troubleshooting

### Common Issues:

**"Firebase configuration not found"**
- Make sure `firebase-admin.json` is in `Backend/config/`
- Or set up `.env` file properly

**"Permission denied"**
- Check Firestore security rules
- Make sure Authentication is enabled

**"Cannot connect to backend"**
- Make sure backend is running on port 5000
- Check if CORS is configured correctly

### Quick Fixes:

1. **Restart both servers** if you see errors
2. **Clear browser cache** if UI doesn't load
3. **Check console logs** for specific error messages
4. **Verify Firebase project** is set up correctly

## 🎉 Success!

If everything is working, you should see:
- Login/Register page
- Dark theme with brain icon
- "LIVRAISON RAPIDE" title
- Professional navigation
- Working forms and tables

## 📞 Need Help?

1. Check the detailed `FIREBASE_SETUP.md` guide
2. Review the `README.md` for complete documentation
3. Check Firebase Console for any errors
4. Verify all services are enabled

---

**Ready to manage deliveries like a pro!** 🚚✨


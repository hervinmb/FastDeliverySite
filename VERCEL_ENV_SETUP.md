# Vercel Environment Variables Setup

## ✅ **No .env Files Needed for Vercel!**

Vercel handles environment variables through its dashboard, not through `.env` files.

## 🔧 **Frontend Environment Variables**

### **In Vercel Dashboard:**
1. Go to your frontend project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
REACT_APP_API_URL = https://your-backend-url.vercel.app
```

### **In Code (Frontend):**
The frontend already uses the correct pattern:
```javascript
// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

## 🔧 **Backend Environment Variables**

### **In Vercel Dashboard:**
1. Go to your backend project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables (if using Firebase):

```
NODE_ENV = production
FIREBASE_PRIVATE_KEY = your_private_key
FIREBASE_CLIENT_EMAIL = your_client_email
FIREBASE_CLIENT_ID = your_client_id
FIREBASE_CLIENT_X509_CERT_URL = your_cert_url
```

## 🚀 **Deployment Steps**

### **1. Deploy Backend First:**
```bash
cd Backend
vercel --prod --yes
```
- Copy the backend URL (e.g., `https://trego-backend.vercel.app`)

### **2. Deploy Frontend:**
```bash
cd Frontend
vercel --prod --yes
```

### **3. Set Frontend Environment Variable:**
1. Go to Vercel Dashboard → Frontend Project
2. Settings → Environment Variables
3. Add: `REACT_APP_API_URL = https://your-backend-url.vercel.app`
4. Redeploy frontend

## 📝 **Environment Variable Naming**

### **Frontend (React):**
- Must start with `REACT_APP_`
- Example: `REACT_APP_API_URL`

### **Backend (Node.js):**
- Can be any name
- Example: `NODE_ENV`, `FIREBASE_PRIVATE_KEY`

## ✅ **Current Setup (No .env needed)**

Your current setup is perfect:
- ✅ No `.env` files in the project
- ✅ Frontend uses `process.env.REACT_APP_API_URL || 'http://localhost:5000'`
- ✅ Backend uses `process.env.PORT || 5000`
- ✅ Vercel will handle all environment variables

## 🎉 **Ready to Deploy!**

Just run:
```bash
# Deploy backend
cd Backend && vercel --prod --yes

# Deploy frontend  
cd Frontend && vercel --prod --yes
```

Then set the `REACT_APP_API_URL` in Vercel dashboard! 🚀

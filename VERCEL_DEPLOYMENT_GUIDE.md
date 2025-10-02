# 🚀 Complete Vercel Deployment Guide

This guide will help you deploy both the frontend and backend separately on Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Firebase Project**: Set up Firebase project with Firestore enabled
4. **Firebase Service Account**: Download the service account JSON file

## 🎯 Deployment Strategy

- **Frontend**: Deploy as a static site (React app)
- **Backend**: Deploy as a serverless function (Node.js API)

## 🔧 Step 1: Deploy Backend First

### 1.1 Connect Backend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. **Important**: Set **Root Directory** to `Backend`

### 1.2 Configure Backend Environment Variables

In Vercel dashboard, go to **Settings > Environment Variables** and add:

```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-app.vercel.app
```

**Firebase Service Account Variables** (from your downloaded JSON):
```bash
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email
```

### 1.3 Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Note the backend URL (e.g., `https://your-backend-app.vercel.app`)

### 1.4 Test Backend

Visit: `https://your-backend-app.vercel.app/api/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## 🎨 Step 2: Deploy Frontend

### 2.1 Connect Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import the same GitHub repository
4. **Important**: Set **Root Directory** to `Frontend`

### 2.2 Configure Frontend Environment Variables

In Vercel dashboard, go to **Settings > Environment Variables** and add:

```bash
REACT_APP_API_URL=https://your-backend-app.vercel.app
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2.3 Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Note the frontend URL (e.g., `https://your-frontend-app.vercel.app`)

## 🔄 Step 3: Update Cross-References

### 3.1 Update Backend CORS

1. Go to your backend project in Vercel
2. Update environment variable:
   ```bash
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```
3. Redeploy the backend

### 3.2 Update Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication > Settings > Authorized domains**
4. Add your Vercel domains:
   - `your-frontend-app.vercel.app`
   - `your-backend-app.vercel.app`

## 🧪 Step 4: Testing

### 4.1 Test Frontend
- Visit your frontend URL
- Try to register a new user
- Try to login
- Test all functionality

### 4.2 Test Backend
- Test API endpoints:
  - `GET /api/health`
  - `POST /api/auth/register`
  - `POST /api/auth/login`

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend
2. **Firebase Errors**: Check all Firebase environment variables
3. **Build Errors**: Check build logs in Vercel dashboard
4. **API 404**: Make sure backend is deployed and accessible

### Debug Steps:

1. Check Vercel function logs
2. Test API endpoints directly
3. Check browser console for errors
4. Verify environment variables

## 📱 Final URLs

After successful deployment, you'll have:

- **Frontend**: `https://your-frontend-app.vercel.app`
- **Backend**: `https://your-backend-app.vercel.app`

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Test the updated functionality

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Firebase console for errors
3. Test API endpoints individually
4. Verify all environment variables are set correctly

---

**🎉 Congratulations! Your LIVRAISON RAPIDE system is now deployed on Vercel!**

# Frontend Vercel Deployment Guide

## Environment Variables for Vercel

Set these environment variables in your Vercel dashboard:

### Required Environment Variables:
```
REACT_APP_API_URL=https://your-backend-app.vercel.app
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Deployment Steps:

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Set Root Directory**: Set root directory to `Frontend`
3. **Set Environment Variables**: Add all Firebase and API URL variables
4. **Deploy**: Click deploy

## Build Settings:
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

## Post-Deployment:
1. Update `REACT_APP_API_URL` to point to your deployed backend
2. Test all functionality
3. Update Firebase authorized domains with your Vercel URL

# Backend Vercel Deployment Guide

## Environment Variables for Vercel

Set these environment variables in your Vercel dashboard:

### Required Environment Variables:
```
NODE_ENV=production
PORT=5000
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

## Deployment Steps:

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Set Root Directory**: Set root directory to `Backend`
3. **Set Environment Variables**: Add all Firebase service account variables
4. **Deploy**: Click deploy

## Build Settings:
- **Framework Preset**: Other
- **Build Command**: `npm install`
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`

## Important Notes:

### Firebase Service Account:
1. Download your Firebase service account JSON file
2. Copy each field from the JSON to Vercel environment variables
3. For `FIREBASE_PRIVATE_KEY`, include the full key with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### CORS Configuration:
The backend is configured to accept requests from your frontend domain. Update the CORS origin in `server.js` after deployment.

### Rate Limiting:
The backend includes rate limiting. Adjust if needed for your use case.

## Post-Deployment:
1. Test the health endpoint: `https://your-backend-app.vercel.app/api/health`
2. Update frontend `REACT_APP_API_URL` to point to this backend URL
3. Test all API endpoints
4. Update Firebase authorized domains if needed

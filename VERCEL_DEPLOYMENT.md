# Vercel Deployment Guide

## ✅ Fixed: Functions and Builds Conflict

The error "The `functions` property cannot be used in conjunction with the `builds` property" has been resolved by removing the conflicting `functions` property from the Backend's `vercel.json`.

## 🚀 Deployment Options

### Option 1: Deploy Frontend and Backend Separately (Recommended)

#### Deploy Frontend (React App)
1. **Connect to Vercel:**
   ```bash
   cd Frontend
   npx vercel
   ```

2. **Configuration:**
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

#### Deploy Backend (Node.js API)
1. **Connect to Vercel:**
   ```bash
   cd Backend
   npx vercel
   ```

2. **Configuration:**
   - Framework: Other
   - Build Command: `npm install`
   - Output Directory: (leave empty)
   - Install Command: `npm install`

3. **Environment Variables:**
   Add these in Vercel dashboard:
   ```
   NODE_ENV=production
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_CLIENT_X509_CERT_URL=your_cert_url
   ```

### Option 2: Deploy as Monorepo

1. **Deploy from root directory:**
   ```bash
   cd "D:\Abroad Work\Trego"
   npx vercel
   ```

2. **Use the root `vercel.json` configuration**

## 🔧 Configuration Files

### Root vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "Backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "Frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/Backend/server.js"
    },
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/Frontend/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Backend vercel.json (Fixed)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "PORT": "5000"
  }
}
```

## 🌐 Environment Variables

### Frontend (.env.local)
```
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

### Backend (Vercel Dashboard)
```
NODE_ENV=production
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_X509_CERT_URL=your_cert_url
```

## 📝 Deployment Steps

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy Backend:**
   ```bash
   cd Backend
   vercel --prod
   ```

4. **Deploy Frontend:**
   ```bash
   cd Frontend
   vercel --prod
   ```

5. **Update Frontend API URL:**
   - Go to Vercel dashboard
   - Find your frontend project
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.vercel.app`
   - Redeploy

## 🔍 Troubleshooting

### Common Issues:
1. **Build fails:** Check Node.js version (requires 18+)
2. **API not working:** Verify environment variables
3. **CORS errors:** Check backend CORS configuration
4. **Firebase errors:** Verify service account credentials

### Debug Commands:
```bash
# Check Vercel CLI version
vercel --version

# Check deployment logs
vercel logs

# Check environment variables
vercel env ls
```

## 🎉 Success!

After deployment, you'll have:
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.vercel.app`

The "Add New" button and all CRUD operations should work perfectly! 🚚✨

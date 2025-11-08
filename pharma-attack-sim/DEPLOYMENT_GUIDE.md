# 🚀 Deployment Guide - Pharma Attack Simulator

This guide will help you deploy your app to get a shareable public link.

## 🌐 Recommended: Deploy to Render (Free Tier)

Render offers free hosting for both frontend and backend with persistent URLs.

---

## Step 1: Prepare Your Code

### 1.1 Add Environment Variables to Backend

Create a `.env` file in `/pharma-attack-sim/` directory (if you don't have one):

```env
# Optional - for LLM features
OPENROUTER_API_KEY=your_key_here

# Production settings
NODE_ENV=production
PORT=3001
```

### 1.2 Update Frontend API URL

The frontend needs to know where your deployed backend is. We'll create an environment variable for this.

---

## Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub (if not already done)

```bash
cd /Users/munir45/Documents/info492/info492-demo1
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.2 Deploy on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `pharma-attack-sim-backend`
   - **Root Directory**: `pharma-attack-sim/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `OPENROUTER_API_KEY` (if you have one)
   - `NODE_ENV` = `production`

6. Click **"Create Web Service"**

7. **Copy your backend URL**: It will be something like:
   ```
   https://pharma-attack-sim-backend.onrender.com
   ```

---

## Step 3: Deploy Frontend to Render (or Vercel/Netlify)

### Option A: Deploy Frontend to Vercel (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `pharma-attack-sim/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://pharma-attack-sim-backend.onrender.com/api`
   (Use YOUR backend URL from Step 2)

6. Click **"Deploy"**

7. **Your shareable link**: 
   ```
   https://pharma-attack-sim.vercel.app
   ```

### Option B: Deploy Frontend to Render

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:
   - **Name**: `pharma-attack-sim-frontend`
   - **Root Directory**: `pharma-attack-sim/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variable:
   - `VITE_API_URL` = `https://YOUR-BACKEND-URL.onrender.com/api`

5. Click **"Create Static Site"**

---

## Step 4: Update Configuration Files

You need to update the backend CORS and auth settings to allow your deployed frontend URL.

I'll create the necessary config updates in the next step.

---

## ⚡ Quick Alternative: ngrok (Temporary Link)

If you just need a link for a quick demo (today/tomorrow), use ngrok:

### 1. Install ngrok
```bash
brew install ngrok
# or download from ngrok.com
```

### 2. Start your local servers
```bash
# Terminal 1 - Backend
cd pharma-attack-sim/backend
npm start

# Terminal 2 - Frontend  
cd pharma-attack-sim/frontend
npm run dev
```

### 3. Create tunnels
```bash
# Terminal 3 - Backend tunnel
ngrok http 3001

# Terminal 4 - Frontend tunnel (in a new terminal)
ngrok http 5173
```

### 4. Share the frontend ngrok URL
You'll get URLs like:
- Frontend: `https://abc123.ngrok.io` ← Share this one!
- Backend: `https://def456.ngrok.io`

**Note**: Update the frontend's API URL to use the backend ngrok URL temporarily.

---

## 📝 Notes

- **Free Tier Limitations**:
  - Render free tier: Server sleeps after 15 min of inactivity (takes ~30s to wake up)
  - Vercel free tier: Unlimited bandwidth for personal projects

- **Database**: SQLite database will persist on Render (in the deployed instance)

- **Passkeys**: WebAuthn passkeys require HTTPS, which both Render and Vercel provide automatically

---

## 🆘 Need Help?

Let me know which option you want to use and I can help you with the specific configuration!


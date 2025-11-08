# 🚀 Deploy Instructions - Get Your Shareable Link

## ⚡ FASTEST: 5-Minute Deploy (Recommended)

### Option 1: Vercel (Frontend) + Render (Backend)

#### Step A: Deploy Backend to Render

1. Go to **[render.com](https://render.com)** → Sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub or paste your Git URL
4. **Settings**:
   ```
   Name: pharma-attack-backend
   Root Directory: pharma-attack-sim/backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```
5. Click **"Create Web Service"**
6. **COPY YOUR URL**: `https://pharma-attack-backend-xxxx.onrender.com`

#### Step B: Deploy Frontend to Vercel

1. Go to **[vercel.com](https://vercel.com)** → Sign up (free)
2. Click **"Add New..."** → **"Project"**
3. Import your repository
4. **Settings**:
   ```
   Framework: Vite
   Root Directory: pharma-attack-sim/frontend
   Build Command: npm run build
   Output Directory: dist
   ```
5. **Environment Variables** (click "Add"):
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL-FROM-STEP-A.onrender.com/api`
   
   - Name: `VITE_SOCKET_URL`
   - Value: `https://YOUR-BACKEND-URL-FROM-STEP-A.onrender.com`

6. Click **"Deploy"**

#### ✅ Done! Share Your Link:
```
https://pharma-attack-sim-xxxx.vercel.app
```

---

## 🎯 Alternative: ngrok (Quick Demo - Link expires today)

If you need a link RIGHT NOW for a quick demo:

```bash
# Terminal 1: Start backend
cd pharma-attack-sim/backend
npm install
npm start

# Terminal 2: Start frontend
cd pharma-attack-sim/frontend
npm install
npm run dev

# Terminal 3: Make it public
npx ngrok http 5173
```

Share the ngrok URL (like `https://1234abcd.ngrok.io`)

⚠️ This link expires when you close your terminal!

---

## 📋 Before Deploying

Make sure your code is pushed to GitHub:

```bash
cd /Users/munir45/Documents/info492/info492-demo1
git add .
git commit -m "Prepare for deployment"
git push
```

---

## 🔧 Environment Variables You Need

### For Production Deployment:

**Backend** (add in Render dashboard):
- `OPENROUTER_API_KEY` - Optional, for AI features (leave blank to use demo mode)
- `PORT` - Auto-set by Render
- `NODE_ENV` - Set to `production`

**Frontend** (add in Vercel dashboard):
- `VITE_API_URL` - Your backend URL + `/api`
- `VITE_SOCKET_URL` - Your backend URL (no `/api`)

Example:
```
VITE_API_URL=https://pharma-attack-backend-abcd.onrender.com/api
VITE_SOCKET_URL=https://pharma-attack-backend-abcd.onrender.com
```

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Render Free**: Server sleeps after 15 min inactive → first visit takes ~30s to wake
- **Vercel Free**: Unlimited for personal projects
- **Both provide HTTPS** (required for passkey auth)

### Database:
- SQLite database persists on Render
- Auto-created on first run

### Demo Mode:
- Works without OpenRouter API key
- Uses simulated attack data

---

## 🎮 What Users Will See

When someone visits your link:
1. **Login page** with:
   - Passkey authentication (fingerprint/Face ID)
   - "Demo Mode" button for instant access
2. **Deploy Mode** tab to set up attacks
3. **Monitor Mode** tab to watch real-time simulation
4. **Analyze Mode** tab to see impact reports

---

## 🆘 Troubleshooting

**"Cannot connect to backend"**
→ Check VITE_API_URL is correct in Vercel
→ Wait 30 seconds (free tier waking up)

**"Build failed"**
→ Check Root Directory is set correctly
→ Verify package.json exists in that directory

**"Passkeys not working"**
→ Make sure you're on HTTPS (both Vercel and Render provide this)
→ Or use "Demo Mode" button

---

## 🎉 You're Done!

Your app is now public and shareable!

**Next steps:**
- Test the link in an incognito window
- Share with your team/class
- The first visit might be slow (30s) if using free tier

**Want to update it?**
- Push to GitHub → Auto-deploys to both platforms


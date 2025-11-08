# ⚡ Quick Deploy Guide

Get your shareable link in 10 minutes!

## 🚀 Fastest Method: Vercel + Render

### Step 1: Deploy Backend (5 minutes)

1. **Sign up for Render**: Go to [render.com](https://render.com) and create a free account

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - **OR** use "Deploy from Git URL" and paste your repo URL

3. **Configure**:
   ```
   Name: pharma-attack-backend
   Root Directory: pharma-attack-sim/backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. **Add Environment Variable** (Optional):
   - Key: `OPENROUTER_API_KEY`
   - Value: Your API key (or leave blank to use demo mode)

5. **Deploy** and **copy your backend URL**:
   ```
   https://pharma-attack-backend.onrender.com
   ```

### Step 2: Deploy Frontend (5 minutes)

1. **Sign up for Vercel**: Go to [vercel.com](https://vercel.com) and create a free account

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - **OR** use Vercel CLI: `npm i -g vercel && vercel`

3. **Configure**:
   ```
   Framework Preset: Vite
   Root Directory: pharma-attack-sim/frontend
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Add Environment Variables**:
   ```
   VITE_API_URL = https://pharma-attack-backend.onrender.com/api
   VITE_SOCKET_URL = https://pharma-attack-backend.onrender.com
   ```
   (Replace with YOUR backend URL from Step 1)

5. **Deploy!**

### Step 3: Get Your Shareable Link 🎉

Your app will be live at:
```
https://pharma-attack-sim.vercel.app
```
or a similar URL that Vercel assigns.

**Share this link with anyone!**

---

## 🔧 Alternative: Both on Render

If you prefer everything on one platform:

1. Deploy backend as above
2. For frontend, use:
   - "New +" → "Static Site"
   - Same config as above
   - Will get URL like: `https://pharma-attack-frontend.onrender.com`

---

## ⚡ Super Quick: ngrok (Temporary - Today Only)

If you need a link RIGHT NOW for a demo:

```bash
# Terminal 1: Start backend
cd pharma-attack-sim/backend && npm start

# Terminal 2: Start frontend
cd pharma-attack-sim/frontend && npm run dev

# Terminal 3: Create public tunnel
npx ngrok http 5173
```

Share the ngrok URL (looks like `https://abc123.ngrok.io`)

**Note**: This link expires when you close your terminal!

---

## 📝 Important Notes

- **Free Tier Sleep**: Render free tier sleeps after 15min of inactivity. First visit takes ~30s to wake up.
- **HTTPS Automatic**: Both Vercel and Render provide HTTPS automatically (required for passkeys)
- **Database**: SQLite database persists on Render's disk
- **Demo Mode**: Works without OpenRouter API key (uses simulated attacks)

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check the logs in Render dashboard
- Make sure `package.json` is in the backend folder

**Frontend can't connect to backend?**
- Verify `VITE_API_URL` environment variable is set correctly
- Check CORS is enabled (it is by default in this app)
- Wait 30s for Render backend to wake up if using free tier

**Still stuck?**
Ask for help and include:
- Platform you're using (Vercel/Render/etc)
- Error message from logs
- Your backend URL


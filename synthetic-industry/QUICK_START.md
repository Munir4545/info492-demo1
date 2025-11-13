# Quick Start Guide

Get the Synthetic Industry Generator running in 5 minutes!

---

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

---

## Step 1: Install Backend

```bash
cd synthetic-industry/backend
npm install
```

---

## Step 2: Install Frontend

```bash
cd synthetic-industry/frontend
npm install
```

---

## Step 3: Start Backend

```bash
cd synthetic-industry/backend
npm start
```

✅ Backend running on **http://localhost:3002**

---

## Step 4: Start Frontend (New Terminal)

```bash
cd synthetic-industry/frontend
npm run dev
```

✅ Frontend running on **http://localhost:8001**

---

## Step 5: Open Browser

Navigate to: **http://localhost:8001**

---

## Step 6: Start Simulation

Click the big green **"Start 24-Hour Simulation"** button!

---

## 🎉 You're Done!

Watch as:
- Deliveries are created in real-time
- Drivers are assigned randomly
- Map updates with active deliveries
- Event stream shows all activity
- Statistics update live

---

## Test the API

```bash
# Get current statistics
curl http://localhost:3002/api/synthetic/stats

# Get active deliveries
curl http://localhost:3002/api/synthetic/active

# Health check
curl http://localhost:3002/api/health
```

---

## Consume the Stream

```bash
# Using curl (watch events in real-time)
curl -N http://localhost:3002/api/synthetic/stream
```

Or in your code:

```javascript
const eventSource = new EventSource('http://localhost:3002/api/synthetic/stream');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data);
};
```

---

## Stop the Simulation

Click **"Stop"** button in the UI, or:

```bash
curl -X POST http://localhost:3002/api/synthetic/stop
```

---

## Common Issues

**Port already in use?**
- Backend (3002): Edit `backend/server.js` and change PORT
- Frontend (8001): Edit `frontend/vite.config.ts` and change server.port

**Dependencies not installing?**
- Try `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then `npm install` again

**Stream not connecting?**
- Ensure backend is running first
- Check browser console for errors
- Verify CORS settings in `backend/server.js`

---

That's it! You now have a fully functional synthetic delivery data generator running! 🚀


# 🚀 Quick Start Guide - Enhanced Attack Simulation

## What's New

All enhancements from the guide have been implemented! The system now includes:

✅ **6-Panel Master Dashboard** with professional hacker workspace  
✅ **Interactive D3.js Attack Flow Graph** with real-time updates  
✅ **Tier Authentication Heatmap** with clickable details  
✅ **Dr. Chen's 5 Experiments** framework  
✅ **Multi-Mode Interface** (Attack, Experiment, Analysis)  
✅ **Live Telemetry** with real-time metrics  

## Getting Started (3 Steps)

### Step 1: Start Backend
```bash
cd /Users/jacqueline/Desktop/demo/pharma-attack-sim/backend
npm start
```

You should see:
```
🚀 Attack Control Server
   http://localhost:3001
   WebSocket ready
```

### Step 2: Start Frontend Server
Open a **new terminal**:
```bash
cd /Users/jacqueline/Desktop/demo/pharma-attack-sim/frontend
python3 -m http.server 8000
```

### Step 3: Open Browser
- **Basic Dashboard**: http://localhost:8000/index.html
- **Master Dashboard** (Recommended): http://localhost:8000/master-dashboard.html

## Using the Master Dashboard

### Attack Mode (Default)
1. Enter target driver: "Jerry Rodriguez"
2. Select success rate: 30%
3. Click "INITIALIZE ATTACK SEQUENCE"
4. Watch the 6 panels update in real-time:
   - **AI Reasoning** - Shows LLM decision-making
   - **Reconnaissance** - Entry points and vulnerabilities
   - **Target Map** - Tier heatmap (click tiers for details)
   - **Attack Flow Graph** - Interactive D3.js graph
   - **Access Tiers** - Detailed authentication breakdown
   - **Live Telemetry** - Real-time metrics

### Experiment Mode
1. Click **"EXPERIMENT MODE"** tab
2. Click **"RUN ALL EXPERIMENTS"** button
3. Watch experiments run and see results

### Analysis Mode
1. Click **"ANALYSIS MODE"** tab
2. View attack logs and historical data
3. Export results using Export button

## Key Features

### Interactive Attack Flow Graph
- **Drag nodes** to rearrange layout
- **Real-time highlighting** of active attack path
- **Color-coded nodes**: Blue (initial), Amber (decision), Purple (action), Green (success), Red (failure)
- **Probability labels** on edges

### Tier Authentication System
- **Click tier boxes** (Tier 2, 3, or 4) to see details
- View security scores, authentication methods, and attack vectors
- See success rates for different attack vectors

### Dr. Chen's Experiments
1. **Panic Window** - Alert storm impact on dispatcher accuracy
2. **DDoS Overlap** - Detection stack performance
3. **Human-AI Ratio** - Optimal automation balance
4. **Game Theory** - Nash equilibrium analysis
5. **Driver Distraction** - Phishing click rates under stress

### Live Telemetry
- **Success Rate Meter** - Real-time attack success probability
- **Detection Risk Gauge** - Increases over time
- **Time Elapsed** - Attack duration
- **Packets Sent** - Network activity counter
- **Active Agents** - Number of agents currently working

## File Structure

```
pharma-attack-sim/
├── config.json                    # Configuration
├── README.md                      # Main documentation
├── ENHANCEMENTS.md               # Detailed enhancement docs
├── QUICK_START.md                # This file
├── backend/
│   ├── server.js                 # Express + Socket.IO server
│   ├── agents.js                 # AI agents (updated with graph events)
│   ├── auth-tiers.js             # Tier authentication system
│   ├── experiments/
│   │   └── dr-chen-experiments.js # 5 experimental frameworks
│   └── package.json
└── frontend/
    ├── index.html                # Basic dashboard
    ├── master-dashboard.html     # Enhanced 6-panel dashboard ⭐
    ├── dashboard.js              # Dashboard functionality
    └── attack-graph.js           # D3.js graph implementation
```

## Troubleshooting

**Backend won't start:**
- Check if port 3001 is in use: `lsof -ti:3001 | xargs kill -9`
- Make sure you're in the backend directory
- Verify node_modules exists: `npm install`

**Frontend won't load:**
- Try different port: `python3 -m http.server 8080`
- Or use: `npx http-server -p 8000`
- Check browser console for errors

**Graph not showing:**
- Wait a moment for D3.js to load
- Check browser console for JavaScript errors
- Make sure attack-graph.js is loaded

**Experiments not running:**
- Make sure backend is running
- Check browser console for Socket.IO connection
- Verify experiments/dr-chen-experiments.js exists

## Next Steps

1. **Run an attack** - Use Attack Mode to see full simulation
2. **Try experiments** - Switch to Experiment Mode
3. **Explore graph** - Drag nodes in the attack flow graph
4. **View tiers** - Click tier boxes to see authentication details
5. **Export data** - Click Export button after attack completes

## Support

- See `README.md` for full documentation
- See `ENHANCEMENTS.md` for detailed feature documentation
- Check browser console (F12) for errors
- Check backend terminal for server logs

---

**Ready to attack!** 🚀


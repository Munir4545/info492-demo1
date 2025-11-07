# 🚀 Enhanced Dashboard Usage Guide

## Getting Started

### Step 1: Start Backend Server
```bash
cd backend
npm start
```

You should see:
```
🚀 Attack Control Server
   http://localhost:3001
   WebSocket ready
```

### Step 2: Start Frontend Server
```bash
cd frontend
python3 -m http.server 8000
```

### Step 3: Open Enhanced Dashboard
Open your browser to:
```
http://localhost:8000/enhanced-dashboard.html
```

## Login Flow

### 1. Login Screen
- Enter username: `attacker` (default)
- Enter password: `password123` (default)
- **OR** click "🔐 Authenticate with Passkey" for passkey simulation
- Click "LOGIN"

### 2. Passkey Authentication
- Simulates WebAuthn passkey authentication
- Shows spinning animation
- Automatically proceeds after 2 seconds

### 3. Driver Selection Screen
- **Search**: Type to filter drivers by name or route
- **Select Driver**: Click on any driver card to select
- **Choose Settings**:
  - Success Rate: 10%, 30%, 50%, or 90%
  - Attack Day: Day 1, 2, or 3
- **Click "INITIALIZE ATTACK SEQUENCE"** to start

## Driver Database

10 drivers available:
- Jerry Rodriguez (High risk) - Tacoma → Spokane
- Maria Santos (Medium risk) - Seattle → Yakima
- James Wilson (High risk) - Tacoma → Pullman
- Sarah Chen (Low risk) - Seattle → Wenatchee
- Michael Brown (Medium risk) - Tacoma → Richland
- Emily Davis (Low risk) - Seattle → Moses Lake
- David Lee (High risk) - Tacoma → Walla Walla
- Jessica Martinez (Medium risk) - Seattle → Ellensburg
- Robert Taylor (High risk) - Tacoma → Bellingham
- Amanda White (Low risk) - Seattle → Olympia

## Dashboard Controls

### Manual Agent Buttons
- **▶ RUN ORCHESTRATOR**: Plan attack strategy
- **▶ TEST PHISHING**: Test phishing campaign
- **▶ INJECT GPS**: Spoof GPS coordinates
- **▶ FLOOD API**: Generate fake alerts

### Graph Interaction
- **Click any node** in the attack flow graph to trigger that step
- Nodes light up when active
- Path highlights as attack progresses

### Tier Selection
- **Click tier cards** (Tier 2, 3, or 4) to change target
- Selected tier glows cyan
- Shows security levels and authentication methods

### Vulnerability Exploitation
- **Click "EXPLOIT THIS"** on any vulnerability
- Marks vulnerability as exploited
- Updates impact metrics

### Impact Dashboard
- **Live counters** animate as attack progresses:
  - Packages Affected: 0 → 7
  - Patients Impacted: 0 → 7
  - Detection Time: -- → 60min
  - Financial Loss: $0 → $4.5K
  - ER Visits: 0 → 2

## Troubleshooting

### Backend Not Running
**Error**: "Make sure the backend server is running"
**Solution**: Start backend with `cd backend && npm start`

### Socket.IO Not Connecting
**Error**: "Not connected to server"
**Solution**: 
1. Check backend is running on port 3001
2. Refresh browser
3. Check browser console for errors

### Attack Won't Initialize
**Error**: "Error initializing attack"
**Solution**:
1. Make sure a driver is selected
2. Check backend server is running
3. Check browser console for detailed error

### Graph Not Showing
**Solution**:
1. Wait for page to fully load
2. Check D3.js loaded (Network tab)
3. Refresh page

### Counters Not Animating
**Solution**:
1. Check CountUp.js loaded
2. Make sure attack is running
3. Check Socket.IO connection

## Features

✅ **Login with Passkey Simulation**
✅ **Driver Database Selection**
✅ **Manual Agent Controls**
✅ **Interactive Attack Graph**
✅ **Real-time Impact Metrics**
✅ **Tier Authentication Visualization**
✅ **Vulnerability Exploitation**
✅ **Export Attack Data**

## Tips

1. **Start with automatic attack** - Let it run through all steps
2. **Try manual controls** - Click agent buttons individually
3. **Experiment with tiers** - Change target tier mid-attack
4. **Watch impact metrics** - See real-time damage accumulation
5. **Export results** - Save attack data after completion

Enjoy your hacking simulation! 🚀

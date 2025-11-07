# 🚀 Enhanced Dashboard Guide

## Overview

The Enhanced Dashboard (`enhanced-dashboard.html`) is a fully interactive 6-panel attack control system with real-time updates, manual controls, and visual feedback.

## Features

### 1. AI Reasoning Panel (Top-Left)
- Real-time LLM thinking process
- Decision tree visualization
- "View Full Reasoning" button for complete log
- Updates automatically via Socket.IO

### 2. Reconnaissance Panel (Top-Middle)
- Lists discovered vulnerabilities
- Click "EXPLOIT THIS" to trigger exploitation
- Shows vulnerability scores
- Real-time vulnerability discovery

### 3. Target Systems Map (Top-Right)
- 3 clickable tier cards:
  - **Tier 4 (Admin)**: 95% security (Red)
  - **Tier 3 (Dispatcher)**: 70% security (Yellow)
  - **Tier 2 (Driver)**: 35% security (Green) ← Default target
- Click any tier to select it as target
- Visual security bars
- Shows authentication methods

### 4. Attack Flow Graph (Middle, Full Width)
- Interactive D3.js force-directed graph
- **Click nodes to trigger steps manually**
- Shows attack progression
- Real-time path highlighting
- Draggable nodes
- Color-coded by node type:
  - Blue: Initial/Complete
  - Yellow: Decision
  - Purple: Action
  - Green: Success/Analysis
  - Red: Failure

### 5. Manual Controls (Bottom-Left)
- **4 Agent Buttons:**
  - [▶ RUN ORCHESTRATOR]
  - [▶ TEST PHISHING]
  - [▶ INJECT GPS]
  - [▶ FLOOD API]
- Click any button to trigger that agent manually
- Status indicators (idle/running/success/failed)
- Can trigger anytime, in any order

### 6. Impact Dashboard (Bottom-Right)
- **Live animated counters:**
  - Packages Affected: 0 → 7
  - Patients Impacted: 0 → 7
  - Detection Time: -- → 60min
  - Financial Loss: $0 → $4,500
  - ER Visits: 0 → 2
- Progress bars with color coding
- Real-time updates as attack progresses

## Interactivity

### Click Tier Cards
- Click any tier card to select it as attack target
- Selected tier glows cyan
- Attack will target selected tier

### Click Graph Nodes
- Click any node in the attack flow graph
- Triggers that step manually
- Node pulses when active
- Path highlights in real-time

### Click Agent Buttons
- Click any agent button to run that agent
- Button shows running status
- Status indicator changes color
- Can run agents individually or in sequence

### Click Vulnerability Exploit Buttons
- Click "EXPLOIT THIS" on any vulnerability
- Marks vulnerability as exploited
- Updates impact metrics
- Triggers recon finding event

## Real-Time Updates

All panels update simultaneously via Socket.IO:

- **AI Reasoning**: Shows LLM thinking in real-time
- **Reconnaissance**: Adds new vulnerabilities as discovered
- **Target Map**: Highlights selected tier
- **Attack Graph**: Highlights active node and path
- **Manual Controls**: Updates agent status
- **Impact Dashboard**: Animates counters and bars

## Socket.IO Events

### Client → Server
- `tier:selected` - When user clicks a tier
- `vuln:exploit` - When user clicks exploit button
- `step:manual` - When user clicks graph node

### Server → Client
- `ai:reasoning` - AI thinking updates
- `impact:updated` - Impact metric changes
- `recon:finding` - New vulnerability discovered
- `step:manual` - Manual step triggered
- `agent:message` - Agent log messages
- `attack:started` - Attack initialization
- `attack:completed` - Attack finished

## Backend Endpoints

### Manual Agent Trigger
```
POST /api/agents/:name/trigger
Body: { attackId, tier }
```

Triggers an agent manually:
- `orchestrator`
- `phishing`
- `gps`
- `api`

### Tier Details
```
GET /api/tiers/:tier
```

Returns tier authentication details.

## Usage

### Step 1: Start Backend
```bash
cd backend
npm start
```

### Step 2: Start Frontend
```bash
cd frontend
python3 -m http.server 8000
```

### Step 3: Open Enhanced Dashboard
```
http://localhost:8000/enhanced-dashboard.html
```

### Step 4: Initialize Attack
1. Enter target driver
2. Select success rate
3. Click "INITIALIZE ATTACK SEQUENCE"

### Step 5: Interact!
- **Click tiers** to change target
- **Click graph nodes** to trigger steps
- **Click agent buttons** to run agents manually
- **Click exploit buttons** to exploit vulnerabilities
- **Watch impact metrics** animate in real-time

## Visual Features

### Color Coding
- **Green (#0f0)**: Success, low security
- **Cyan (#0ff)**: Active, selected
- **Yellow (#ff0)**: Warning, medium security
- **Red (#f00)**: Failure, high security

### Animations
- **Pulse glow**: Active panels
- **Blink**: Running indicators
- **CountUp**: Animated numbers
- **Bar fill**: Progress bars
- **Node pulse**: Active graph nodes

### Glassmorphism
- Dark backgrounds with transparency
- Green borders
- Blur effects
- Shadow glows

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: D3.js v7
- **Animations**: CountUp.js
- **Real-time**: Socket.IO
- **Styling**: Tailwind CSS (CDN)
- **Backend**: Node.js, Express, Socket.IO

## File Structure

```
frontend/
├── enhanced-dashboard.html    ← Main dashboard
└── enhanced-dashboard.js      ← Interactivity logic

backend/
├── server.js                  ← API endpoints
└── agents.js                  ← Agent logic with impact tracking
```

## Tips

1. **Click graph nodes** to trigger steps without using buttons
2. **Change tiers** mid-attack to see different security responses
3. **Run agents individually** to test specific attack vectors
4. **Watch impact metrics** to see cumulative damage
5. **View full reasoning** to see complete AI decision log

## Troubleshooting

**Graph not showing?**
- Wait for D3.js to load
- Check browser console for errors
- Ensure container has proper dimensions

**Counters not animating?**
- Check CountUp.js CDN loaded
- Verify Socket.IO connection
- Check impact:updated events firing

**Agents not triggering?**
- Ensure backend is running
- Check attackId is set
- Verify Socket.IO connection

---

**Enjoy the fully interactive attack simulation!** 🚀


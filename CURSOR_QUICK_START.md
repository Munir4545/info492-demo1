# 🚀 QUICK START: Using Cursor to Build Demo 3

## ⚡ Fast Track (For Cursor)

### **What This Guide Does**
Gives you **copy-paste prompts** to build a fully functional attack demonstration system with:
- 🔐 Hacker login interface (Matrix theme)
- 🤖 4 AI agents (orchestrator, phishing, GPS, API flooding)
- 🧠 Real LLM integration (OpenAI/Anthropic)
- ⚡ Live WebSocket updates
- 📊 Interactive dashboard
- 📈 Real-time attack visualization

---

## 📋 Before You Start

**1. Open Cursor**
```bash
# Create new project folder
mkdir pharma-attack-demo
cd pharma-attack-demo
cursor .
```

**2. Get API Keys (Optional but recommended)**
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/

**3. Have These Ready**
- Node.js 18+ installed
- Git installed
- Terminal open

---

## 🎯 The 3-Minute Quick Build

### **STEP 1: Project Setup** (Feed to Cursor)

```
Create a full-stack TypeScript project structure:

pharma-attack-demo/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── agents/
│   │   ├── routes/
│   │   └── database/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   └── components/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── shared/
    └── types.ts

Backend stack: Node.js, Express, Socket.IO, SQLite
Frontend stack: React 18, TypeScript, Vite, Tailwind CSS

Initialize both with TypeScript, install dependencies, and create basic file structure.
```

**What you'll get:**
- ✅ Full project structure
- ✅ Package.json files with all dependencies
- ✅ TypeScript configuration
- ✅ Basic server and React app

---

### **STEP 2: Backend API** (Feed to Cursor)

```
Build Express server with the following features:

1. Authentication:
   - POST /api/auth/login (username/password → JWT)
   - Demo user: username="demo", password="demo123"
   - Use bcrypt for password hashing
   - Use JWT for tokens

2. Attack API:
   - POST /api/attacks/create (config → attackId)
   - POST /api/attacks/:id/start (trigger execution)
   - GET /api/attacks/:id (get status)
   - GET /api/attacks/:id/export (download JSON)

3. Socket.IO:
   - Event: 'step:updated' (step progress)
   - Event: 'agent:message' (agent logs)
   - Event: 'attack:completed' (finished)

4. SQLite Database:
   - Table: users (id, username, password_hash)
   - Table: attacks (id, user_id, status, config)
   - Table: attack_steps (id, attack_id, status, data)

Create all routes, middleware, and database setup.
```

**What you'll get:**
- ✅ Working REST API
- ✅ JWT authentication
- ✅ SQLite database
- ✅ WebSocket server

---

### **STEP 3: AI Agents** (Feed to Cursor)

```
Create 4 AI agent classes:

1. OrchestratorAgent:
   - Analyzes target (Jerry Rodriguez, USPS driver)
   - Plans attack timing (11:45 AM lunch window)
   - Coordinates other agents
   - Calculates success rate (30% baseline)

2. PhishingAgent:
   - Tests phishing message across multiple LLMs
   - Calls OpenAI API: gpt-4, gpt-3.5-turbo
   - Calls Anthropic API: claude-3-sonnet
   - Calculates raw CTR (76%) and calibrated CTR (30%)
   - Determines if Jerry clicks (Monte Carlo simulation)

3. GPSAgent:
   - Generates fake coordinates (46.7298°N, 117.1817°W)
   - Simulates GPS spoofing (12.4 miles off route)
   - Maintains "On Route" status in logs

4. APIFloodingAgent:
   - Generates 50 fake alerts
   - Simulates dispatcher dashboard flooding
   - Creates alert fatigue scenario

Each agent should:
- Inherit from BaseAgent class
- Send messages via Socket.IO
- Save state to database
- Return success/failure status

Include realistic delays (1-2 seconds between actions).
```

**What you'll get:**
- ✅ 4 working AI agents
- ✅ LLM integration (with fallbacks)
- ✅ Realistic attack simulation
- ✅ Real-time progress updates

---

### **STEP 4: Login Page** (Feed to Cursor)

```
Create a hacker-style login page:

Design:
- Full-screen black background
- Matrix rain effect (green falling characters)
- Terminal-style login form
- ASCII art logo at top

Form fields:
- Operator ID (username)
- Access Code (password)
- Target Network (dropdown: USPS Spokane)
- Attack Day (dropdown: Day 1, 2, or 3)

Features:
- Matrix rain canvas animation
- Glowing green borders on focus
- Loading animation on submit
- Redirect to dashboard on success

Style: Monospace font, green (#00ff00) on black (#000)
```

**What you'll get:**
- ✅ Cyberpunk login interface
- ✅ Matrix rain background
- ✅ Working authentication
- ✅ Smooth animations

---

### **STEP 5: Attack Dashboard** (Feed to Cursor)

```
Build the main attack dashboard with 3 sections:

1. Agent Cards (Top):
   - 4 cards in a grid
   - Shows: Agent icon, name, status, current message
   - Pulse animation when active
   - Color-coded: Gray (idle), Blue (working), Green (completed)

2. Timeline (Left):
   - Vertical timeline with steps
   - Each step shows: Time, Title, Description
   - Auto-scroll to active step
   - Click to expand details

3. Live Console (Right):
   - Scrolling log output
   - Colored messages: Green (info), Yellow (warning), Red (error)
   - Timestamps on each line
   - Auto-scroll to bottom

Real-time Updates:
- Connect to Socket.IO
- Listen for 'step:updated', 'agent:message', 'attack:completed'
- Update UI dynamically (no page refresh)

Controls:
- Start Attack button
- Pause/Resume
- Reset
- Export Results

Use Tailwind CSS for styling and Framer Motion for animations.
```

**What you'll get:**
- ✅ Professional dashboard UI
- ✅ Real-time updates
- ✅ Interactive timeline
- ✅ Live agent monitoring

---

### **STEP 6: Connect Everything** (Feed to Cursor)

```
Wire up the frontend to backend:

1. API Client Setup:
   - Use axios for REST calls
   - Store JWT token in localStorage
   - Add Authorization header to all requests

2. Socket.IO Integration:
   - Connect on dashboard mount
   - Disconnect on unmount
   - Handle reconnection

3. Attack Flow:
   - User clicks "Start Attack"
   - POST /api/attacks/create
   - POST /api/attacks/:id/start
   - Subscribe to WebSocket updates
   - Display real-time progress

4. State Management:
   - Use React useState for local state
   - Use React Query for API data
   - Use custom hooks for WebSocket

Add error handling, loading states, and success messages.
```

**What you'll get:**
- ✅ Fully connected system
- ✅ Real-time data flow
- ✅ Error handling
- ✅ Loading states

---

## 🎬 Test Your System

### **Run Backend**
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:3001
```

### **Run Frontend**
```bash
cd frontend
npm install
npm run dev
# Opens http://localhost:3000
```

### **Test the Demo**
1. Go to http://localhost:3000
2. Login: demo / demo123
3. Click "Start Attack"
4. Watch agents coordinate in real-time!

---

## 🔧 Troubleshooting

### **"Cannot find module..."**
```bash
# In backend or frontend folder:
npm install
```

### **"Port 3001 already in use"**
```bash
# Kill the process:
lsof -ti:3001 | xargs kill -9
```

### **"WebSocket connection failed"**
- Check backend is running
- Check frontend .env has correct WS_URL
- Try refreshing the page

### **"LLM API error"**
- System has fallbacks - will use simulated responses
- Add API keys to backend/.env if you want real LLM calls

---

## 💡 Cursor Pro Tips

### **Make Changes**
```
Cursor: "Add a pause button to the attack dashboard"
Cursor: "Make the matrix effect faster and more intense"
Cursor: "Add a dark mode toggle"
```

### **Fix Bugs**
```
Cursor: "Fix the TypeScript error in AgentCard.tsx"
Cursor: "Why isn't the WebSocket connecting?"
Cursor: "Debug the authentication flow"
```

### **Add Features**
```
Cursor: "Add a PDF export button"
Cursor: "Create a metrics graph showing success rates"
Cursor: "Add sound effects when agents complete tasks"
```

---

## 📊 What Each Agent Does

### **🧠 Orchestrator Agent**
- Plans the attack
- Analyzes target vulnerabilities
- Coordinates other agents
- Monitors overall progress

### **🎣 Phishing Agent**
- Tests messages across 4 LLMs
- Simulates human click behavior
- Applies calibration factors
- Determines attack success (30% rate)

### **📍 GPS Agent**
- Generates fake coordinates
- Spoofs Jerry's location
- Maintains "normal" appearance
- Creates 12.4 mile diversion

### **💥 API Flooding Agent**
- Creates 50 fake alerts
- Floods dispatcher dashboard
- Masks real GPS anomaly
- Causes alert fatigue

---

## 🎯 Expected Output

When attack runs, you should see:

**Console Output:**
```
[11:45] [Orchestrator] Analyzing target: Jerry Rodriguez
[11:46] [Orchestrator] Success probability: 30%
[11:47] [Phishing] Testing message across 4 LLMs...
[11:48] [Phishing] Raw CTR: 76%, Calibrated: 30%
[11:49] [Phishing] Jerry clicked the link! ✓
[11:50] [GPS] Injecting fake coordinates...
[11:51] [GPS] Jerry following GPS (12.4 mi off route)
[11:52] [API] Flooding dashboard with 50 alerts...
[11:53] [API] Alert fatigue achieved ✓
[12:00] [Orchestrator] Attack completed successfully
```

**Dashboard Shows:**
- ✅ 4 agents working in coordination
- ✅ Timeline progressing step-by-step
- ✅ Live metrics updating
- ✅ All messages in real-time

---

## 📚 Full Documentation

For complete details, see:
- **[CURSOR_PROMPT_PLAN.md](./CURSOR_PROMPT_PLAN.md)** - All 40+ prompts
- **[README.md](./README.md)** - System overview
- **[CODE_STRUCTURE.md](./CODE_STRUCTURE.md)** - Architecture details

---

## 🚀 Ready to Build!

**Copy each prompt above into Cursor in order:**
1. Project Setup
2. Backend API
3. AI Agents
4. Login Page
5. Dashboard
6. Connect Everything

**Each step takes ~5-10 minutes. Total build time: 30-60 minutes.**

Let Cursor do the heavy lifting! 💪

---

## 🎓 What You'll Learn

By building this, you'll understand:
- ✅ Full-stack TypeScript development
- ✅ WebSocket real-time communication
- ✅ LLM API integration
- ✅ AI agent coordination
- ✅ React state management
- ✅ Authentication & authorization
- ✅ Database design
- ✅ UI/UX best practices

**Perfect for your thesis demonstration!** 🎯

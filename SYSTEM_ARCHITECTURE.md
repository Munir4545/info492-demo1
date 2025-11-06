# 🏗️ SYSTEM ARCHITECTURE - Visual Guide

## 🎯 High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Researcher)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + TypeScript)                  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Login Page   │  │  Dashboard   │  │ Visualization│         │
│  │ (Matrix UI)  │→ │ (Real-time)  │→ │  (Timeline)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │         Socket.IO Client (WebSocket)                │       │
│  └─────────────────────────────────────────────────────┘       │
└────────────────────────┬───────────────────┬────────────────────┘
                         │ REST API          │ WebSocket
                         ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express + Socket.IO)             │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Auth    │  │ Attack   │  │  Agent   │  │  WebSocket│       │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Handler │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │           AI AGENT ORCHESTRATION SYSTEM              │       │
│  │                                                       │       │
│  │   ┌──────────────┐         ┌──────────────┐        │       │
│  │   │ Orchestrator │────────→│  Phishing    │        │       │
│  │   │    Agent     │         │    Agent     │        │       │
│  │   └──────────────┘         └──────────────┘        │       │
│  │          │                         │                 │       │
│  │          │                         ▼                 │       │
│  │          │                  ┌──────────────┐        │       │
│  │          │                  │     LLM      │        │       │
│  │          │                  │   Service    │        │       │
│  │          │                  └──────────────┘        │       │
│  │          ▼                                           │       │
│  │   ┌──────────────┐         ┌──────────────┐        │       │
│  │   │  GPS Agent   │         │  API Flood   │        │       │
│  │   │              │         │    Agent     │        │       │
│  │   └──────────────┘         └──────────────┘        │       │
│  │                                                       │       │
│  └─────────────────────────────────────────────────────┘       │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              SQLite Database                         │       │
│  │  • users                                             │       │
│  │  • attacks                                           │       │
│  │  • attack_steps                                      │       │
│  │  • agent_messages                                    │       │
│  └─────────────────────────────────────────────────────┘       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL APIs (Optional)                       │
│                                                                  │
│  ┌──────────────┐              ┌──────────────┐                │
│  │   OpenAI     │              │  Anthropic   │                │
│  │     API      │              │     API      │                │
│  │  (GPT-4, etc)│              │(Claude, etc) │                │
│  └──────────────┘              └──────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Data Flow (User Journey)

### **PHASE 1: Login & Setup**

```
1. User Opens Browser
   │
   ├─→ Frontend loads login page
   │   ├─→ Matrix rain animation starts
   │   └─→ Login form renders
   │
2. User Enters Credentials
   │   Username: demo
   │   Password: demo123
   │
3. Frontend → POST /api/auth/login
   │
4. Backend validates credentials
   │   ├─→ Query database: SELECT * FROM users WHERE username=?
   │   ├─→ Compare password hash (bcrypt)
   │   └─→ Generate JWT token
   │
5. Backend → Returns JWT + User Info
   │
6. Frontend stores JWT
   │   ├─→ localStorage.setItem('token', jwt)
   │   └─→ Navigate to /dashboard
```

---

### **PHASE 2: Attack Configuration**

```
7. Dashboard Loads
   │
8. User Configures Attack
   │   Target: USPS Spokane-Pullman
   │   Scenario: Pharmaceutical
   │   Day: 1 (30% success rate)
   │
9. Frontend → POST /api/attacks/create
   │   Headers: { Authorization: "Bearer {JWT}" }
   │   Body: { targetNetwork, scenario, day }
   │
10. Backend creates attack record
   │   ├─→ Verify JWT token
   │   ├─→ INSERT INTO attacks (user_id, config, status='pending')
   │   └─→ Return attackId
   │
11. Frontend displays "Attack Ready"
```

---

### **PHASE 3: Attack Execution** (The Magic!)

```
12. User Clicks "Start Attack"
    │
13. Frontend → POST /api/attacks/:id/start
    │
14. Backend starts attack execution
    │   ├─→ Update attack status to 'running'
    │   ├─→ Emit Socket.IO: 'attack:started'
    │   └─→ Launch AttackExecutor
    │
    ┌────────────────────────────────────────────┐
    │      AttackExecutor Orchestration          │
    └────────────────────────────────────────────┘
    
15. OrchestratorAgent.execute()
    │
    ├─→ Analyze target (Jerry Rodriguez)
    │   └─→ Load persona data from config
    │
    ├─→ Calculate success probability
    │   └─→ Base: 30% for Day 1
    │
    ├─→ Determine attack timing
    │   └─→ 11:45 AM (lunch window, peak stress)
    │
    └─→ Send messages via Socket.IO
        ├─→ io.emit('agent:message', { agent: 'orchestrator', msg: '...' })
        ├─→ Save to database: INSERT INTO agent_messages
        └─→ Frontend receives → Update dashboard

16. PhishingAgent.execute()
    │
    ├─→ Load phishing message template
    │   "Jerry - Sonia here. Emergency insulin delivery..."
    │
    ├─→ Test across 4 LLMs (if API keys available)
    │   │
    │   ├─→ Call OpenAI API: gpt-4
    │   │   POST https://api.openai.com/v1/chat/completions
    │   │   {
    │   │     "model": "gpt-4",
    │   │     "messages": [{
    │   │       "role": "user",
    │   │       "content": "You are Jerry. Would you click this?: ..."
    │   │     }]
    │   │   }
    │   │   Response: { clicked: true, reasoning: "..." }
    │   │
    │   ├─→ Call OpenAI API: gpt-3.5-turbo
    │   ├─→ Call Anthropic API: claude-3-sonnet
    │   └─→ Call Anthropic API: claude-3-opus
    │
    ├─→ Calculate raw CTR
    │   3 out of 4 clicked = 75%
    │
    ├─→ Apply calibration factors
    │   rawCTR * 0.4 (skepticism)
    │        * 1.15 (stress)
    │        * 1.10 (familiarity)
    │   = ~30% realistic CTR
    │
    ├─→ Monte Carlo simulation
    │   if (Math.random() < 0.30) → SUCCESS
    │
    └─→ Emit results
        ├─→ io.emit('step:updated', { stepId: 2, status: 'completed' })
        └─→ Frontend updates: "Jerry clicked the link!"

17. IF phishing succeeded:
    │
    ├─→ GPSAgent.execute()
    │   │
    │   ├─→ Generate fake coordinates
    │   │   Latitude: 46.7298°N
    │   │   Longitude: -117.1817°W
    │   │   (12.4 miles off route)
    │   │
    │   ├─→ Simulate GPS injection
    │   │   "Injecting coordinates..."
    │   │
    │   ├─→ Spoof status logs
    │   │   "Dispatcher sees: 'On Route'"
    │   │
    │   └─→ Emit updates
    │       Frontend shows: "Jerry following GPS"
    │
    └─→ APIFloodingAgent.execute()
        │
        ├─→ Generate 50 fake alerts
        │   "Driver #3 package scan failed"
        │   "Driver #9 behind schedule"
        │   ...
        │   "Driver #7 location updated" ← REAL (buried at #25)
        │   ...
        │
        ├─→ Simulate flooding
        │   "Sent alerts 1-10..."
        │   "Sent alerts 11-20..."
        │   ...
        │
        └─→ Emit updates
            Frontend shows: "Alert fatigue: 85%"

18. Attack Completes
    │
    ├─→ Update database: status='completed'
    ├─→ Calculate final metrics
    │   • Success: true
    │   • Packages affected: 7
    │   • Detection time: 60 minutes
    │   • Cascading disruptions: 120+
    │
    └─→ io.emit('attack:completed', { attackId, results })
```

---

### **PHASE 4: Real-Time UI Updates**

```
Frontend Socket.IO Listeners:

socket.on('attack:started', (data) => {
  → Show "Attack in progress" banner
  → Start timer animation
  → Enable agent cards
});

socket.on('agent:message', (data) => {
  → Add message to live console
  → Update agent card message
  → Auto-scroll console to bottom
});

socket.on('step:updated', (data) => {
  → Update timeline step status
  → Highlight active step
  → Show step details
  → Progress bar animation
});

socket.on('attack:completed', (data) => {
  → Show success notification
  → Display final metrics
  → Enable export button
  → Stop animations
});
```

---

## 🗄️ Database Schema

```sql
┌────────────────────────────────────────────────────────┐
│                       users                             │
├────────────────────────────────────────────────────────┤
│ id                INTEGER PRIMARY KEY                   │
│ username          TEXT UNIQUE                           │
│ password_hash     TEXT                                  │
│ role              TEXT                                  │
│ created_at        DATETIME                              │
└────────────────────────────────────────────────────────┘
                           │
                           │ user_id
                           ▼
┌────────────────────────────────────────────────────────┐
│                      attacks                            │
├────────────────────────────────────────────────────────┤
│ id                INTEGER PRIMARY KEY                   │
│ user_id           INTEGER                               │
│ target_network    TEXT                                  │
│ scenario          TEXT                                  │
│ day               INTEGER                               │
│ status            TEXT (pending/running/completed)      │
│ success_rate      REAL                                  │
│ started_at        DATETIME                              │
│ completed_at      DATETIME                              │
└────────────────────────────────────────────────────────┘
                           │
                           │ attack_id
                           ├──────────────────┬────────────┐
                           ▼                  ▼            ▼
┌─────────────────────────────┐  ┌─────────────────────────┐
│      attack_steps            │  │    agent_messages       │
├─────────────────────────────┤  ├─────────────────────────┤
│ id             INTEGER PK    │  │ id         INTEGER PK   │
│ attack_id      INTEGER       │  │ attack_id  INTEGER      │
│ step_number    INTEGER       │  │ agent_type TEXT         │
│ agent_type     TEXT          │  │ message    TEXT         │
│ title          TEXT          │  │ timestamp  DATETIME     │
│ status         TEXT          │  └─────────────────────────┘
│ started_at     DATETIME      │
│ completed_at   DATETIME      │
│ data           JSON          │
└─────────────────────────────┘
```

---

## 🔌 API Endpoints Reference

### **Authentication**
```
POST /api/auth/login
├─ Body: { username, password }
├─ Response: { token, user: { id, username, role } }
└─ Status: 200 OK / 401 Unauthorized
```

### **Attacks**
```
POST /api/attacks/create
├─ Headers: Authorization: Bearer {token}
├─ Body: { targetNetwork, scenario, day }
├─ Response: { attackId }
└─ Status: 201 Created

POST /api/attacks/:id/start
├─ Headers: Authorization: Bearer {token}
├─ Triggers: Attack execution in background
├─ Response: { status: "started" }
└─ Status: 200 OK

GET /api/attacks/:id
├─ Headers: Authorization: Bearer {token}
├─ Response: { attack, steps, messages }
└─ Status: 200 OK

GET /api/attacks/:id/export
├─ Headers: Authorization: Bearer {token}
├─ Response: { /* complete attack report */ }
└─ Status: 200 OK
```

### **WebSocket Events**
```
CLIENT → SERVER:
  connect: { auth: { token } }
  
SERVER → CLIENT:
  'attack:started': { attackId }
  'step:updated': { attackId, stepId, status, result }
  'agent:message': { attackId, agentType, message, timestamp }
  'attack:completed': { attackId, results }
  'attack:failed': { attackId, error }
```

---

## 🧠 AI Agent Coordination Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   OrchestratorAgent                          │
│                  (Master Coordinator)                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ 1. Analyze Target
                   │ 2. Plan Attack
                   │ 3. Coordinate Agents
                   │
        ┌──────────┴──────────┬─────────────┬────────────┐
        ▼                     ▼             ▼            ▼
┌──────────────┐      ┌──────────────┐  ┌──────────┐  ┌──────────┐
│  Phishing    │      │   GPS Agent  │  │   API    │  │ Database │
│   Agent      │      │              │  │ Flooding │  │          │
└──────┬───────┘      └──────┬───────┘  └────┬─────┘  └────┬─────┘
       │                     │               │             │
       │ Test Message        │ Spoof GPS     │ Generate    │ Save
       ├─────────────┐       ├──────┐        │ Alerts      │ State
       │             │       │      │        │             │
       ▼             ▼       ▼      ▼        ▼             ▼
┌──────────┐  ┌──────────┐ ┌────┐ ┌────┐  ┌────┐       ┌────┐
│ OpenAI   │  │Anthropic │ │Fake│ │Logs│  │50  │       │SQLite│
│   API    │  │   API    │ │Loc │ │    │  │Msgs│       │      │
└──────────┘  └──────────┘ └────┘ └────┘  └────┘       └────┘
       │             │         │      │        │             │
       │ Response    │ Response│ Send │ Hide   │ Save        │ Query
       ▼             ▼         ▼      ▼        ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Results Aggregation                        │
│  • LLM responses: 76% raw CTR                               │
│  • Calibrated: 30% realistic CTR                            │
│  • Monte Carlo: Jerry clicked (30% probability)             │
│  • GPS spoofed: 12.4 mi off route                           │
│  • Alerts sent: 50 (real alert buried)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Socket.IO Emissions                        │
│  → Frontend receives updates in real-time                    │
│  → Dashboard updates without page refresh                    │
│  → Timeline animates step-by-step                            │
│  → Console logs scroll automatically                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Key Metrics Tracked

```
Attack Success Metrics:
├─ Phishing Click-Through Rate (30%)
├─ GPS Spoofing Success (100% if phishing succeeds)
├─ API Flooding Effectiveness (Alert fatigue %)
├─ Detection Time (60 minutes average)
└─ Overall Attack Success (true/false)

Impact Metrics:
├─ Packages Affected (7 pharmaceutical)
├─ Patients Impacted (7 without medications)
├─ Cascading Disruptions (120+)
├─ Financial Cost ($4,500)
└─ ER Visits (2 preventable)

Technical Metrics:
├─ LLM Response Times
├─ WebSocket Message Count
├─ Database Query Performance
└─ Frontend Render Times
```

---

## 🎯 Success Criteria

**Attack is considered successful if:**
1. ✅ Phishing message is clicked (30% probability)
2. ✅ GPS coordinates are injected
3. ✅ Driver diverted 12.4 miles off route
4. ✅ Detection delayed >30 minutes
5. ✅ Pharmaceutical packages exposed

**System is fully functional if:**
1. ✅ Login works with JWT authentication
2. ✅ Attack can be created and started
3. ✅ All 4 agents execute in sequence
4. ✅ WebSocket provides real-time updates
5. ✅ Dashboard displays all information correctly
6. ✅ Export generates complete JSON report

---

## 🚀 Build Order Summary

1. **Backend Foundation** (30 min)
   - Express server + Socket.IO
   - Database + authentication
   - API routes

2. **AI Agents** (30 min)
   - Base agent class
   - 4 specialized agents
   - LLM integration

3. **Frontend Core** (20 min)
   - Login page + Matrix effect
   - Dashboard layout
   - Socket.IO client

4. **Real-Time Features** (20 min)
   - WebSocket handlers
   - Live console
   - Agent cards

5. **Polish & Testing** (20 min)
   - Animations
   - Error handling
   - Export feature

**Total: ~2 hours with Cursor**

---

## 📁 File Structure Summary

```
pharma-attack-demo/
├── backend/
│   ├── src/
│   │   ├── server.ts              ← Main entry point
│   │   ├── routes/
│   │   │   ├── auth.ts            ← Login endpoints
│   │   │   ├── attacks.ts         ← Attack management
│   │   │   └── export.ts          ← Report generation
│   │   ├── agents/
│   │   │   ├── BaseAgent.ts       ← Abstract base class
│   │   │   ├── OrchestratorAgent.ts
│   │   │   ├── PhishingAgent.ts   ← LLM integration here
│   │   │   ├── GPSAgent.ts
│   │   │   └── APIFloodingAgent.ts
│   │   ├── llm/
│   │   │   ├── LLMService.ts      ← Unified LLM interface
│   │   │   ├── OpenAIService.ts   ← OpenAI API calls
│   │   │   └── AnthropicService.ts← Anthropic API calls
│   │   ├── database/
│   │   │   ├── db.ts              ← SQLite connection
│   │   │   └── schema.sql         ← Database schema
│   │   └── services/
│   │       └── AttackExecutor.ts  ← Orchestrates agents
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx                ← Main React component
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx      ← Matrix login UI
│   │   │   └── DashboardPage.tsx  ← Main dashboard
│   │   ├── components/
│   │   │   ├── MatrixRain.tsx     ← Canvas animation
│   │   │   ├── AgentCard.tsx      ← Agent display
│   │   │   ├── AttackTimeline.tsx ← Step visualization
│   │   │   └── LiveConsole.tsx    ← Log output
│   │   ├── hooks/
│   │   │   └── useAttackUpdates.ts← WebSocket hook
│   │   └── lib/
│   │       ├── api.ts             ← Axios wrapper
│   │       └── socket.ts          ← Socket.IO client
│   └── package.json
└── shared/
    └── types.ts                   ← TypeScript interfaces
```

---

**Now you have the complete blueprint! Feed the prompts to Cursor and watch the magic happen.** ✨

Ready to build? Start with [CURSOR_QUICK_START.md](./CURSOR_QUICK_START.md)!

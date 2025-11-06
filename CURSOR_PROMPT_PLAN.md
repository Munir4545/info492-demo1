# 🚀 CURSOR PROMPT PLAN: Pharmaceutical Attack Demonstration System

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Phase 1: Project Setup](#phase-1-project-setup)
4. [Phase 2: Backend API](#phase-2-backend-api)
5. [Phase 3: Login System](#phase-3-login-system)
6. [Phase 4: Attack Dashboard](#phase-4-attack-dashboard)
7. [Phase 5: AI Agent Coordination](#phase-5-ai-agent-coordination)
8. [Phase 6: Real-Time Visualization](#phase-6-real-time-visualization)
9. [Phase 7: LLM Integration](#phase-7-llm-integration)
10. [Phase 8: Testing & Deployment](#phase-8-testing--deployment)

---

## System Overview

**What we're building:**
A fully functional demonstration platform where a "security researcher" (ethical hacker role) can:
- Log into an attack control interface
- Configure multi-vector attacks (phishing, GPS spoofing, API flooding)
- Watch AI agents coordinate in real-time via LLM orchestration
- See step-by-step attack progression
- View pharmaceutical delivery disruption impacts
- Export results for research presentations

**Key Features:**
- ✅ Matrix-style login page with terminal aesthetics
- ✅ Real-time attack dashboard with WebSocket updates
- ✅ AI agent coordination visualization (4 agents)
- ✅ LLM-powered decision making (OpenAI/Anthropic API)
- ✅ Step-by-step attack timeline with animations
- ✅ Live metrics and impact tracking
- ✅ Exportable reports (JSON/PDF)
- ✅ Educational mode with explanations

---

## Tech Stack

### **Backend**
```
- Node.js + Express (REST API)
- Socket.IO (Real-time communication)
- SQLite (State persistence)
- OpenAI API or Anthropic Claude API (LLM coordination)
- JWT (Authentication)
- Python subprocess for simulation scripts
```

### **Frontend**
```
- React 18 + TypeScript
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- React Query (API state management)
- Socket.IO Client (Real-time updates)
- Recharts (Data visualization)
```

### **Development**
```
- Vite (Build tool)
- ESLint + Prettier (Code quality)
- Docker (Containerization)
```

---

## Phase 1: Project Setup

### **PROMPT 1.1: Initialize Full-Stack Project**

```
Create a full-stack TypeScript project with the following structure:

PROJECT STRUCTURE:
pharma-attack-demo/
├── backend/
│   ├── src/
│   │   ├── server.ts (Express + Socket.IO setup)
│   │   ├── routes/ (API endpoints)
│   │   ├── agents/ (AI agent logic)
│   │   ├── llm/ (LLM integration)
│   │   ├── database/ (SQLite setup)
│   │   └── types/ (TypeScript interfaces)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/ (Login, Dashboard, Visualization)
│   │   ├── components/ (Reusable UI components)
│   │   ├── hooks/ (Custom React hooks)
│   │   ├── lib/ (Utilities)
│   │   └── types/ (TypeScript interfaces)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── shared/
│   └── types.ts (Shared TypeScript types)
├── docker-compose.yml
└── README.md

REQUIREMENTS:
1. Use TypeScript for both frontend and backend
2. Configure Vite with React + Tailwind
3. Set up Express with CORS and Socket.IO
4. Initialize SQLite database
5. Configure environment variables (.env files)
6. Add scripts for concurrent dev (frontend + backend)

BACKEND DEPENDENCIES:
- express, socket.io, better-sqlite3, jsonwebtoken, bcryptjs
- openai or @anthropic-ai/sdk
- dotenv, cors, helmet
- typescript, @types/node, ts-node, nodemon

FRONTEND DEPENDENCIES:
- react, react-dom, react-router-dom
- socket.io-client, axios, react-query
- tailwindcss, framer-motion
- recharts, lucide-react
- typescript, vite, @vitejs/plugin-react

Generate all package.json files, tsconfig files, and basic project structure.
```

---

### **PROMPT 1.2: Configure Environment & Database Schema**

```
Create the following configuration files:

1. DATABASE SCHEMA (backend/src/database/schema.sql):

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'researcher',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attacks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  target_network TEXT,
  scenario TEXT,
  day INTEGER,
  status TEXT DEFAULT 'pending',
  success_rate REAL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE attack_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attack_id INTEGER,
  step_number INTEGER,
  agent_type TEXT,
  title TEXT,
  status TEXT DEFAULT 'pending',
  started_at DATETIME,
  completed_at DATETIME,
  data JSON,
  FOREIGN KEY (attack_id) REFERENCES attacks(id)
);

CREATE TABLE agent_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attack_id INTEGER,
  agent_type TEXT,
  message TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attack_id) REFERENCES attacks(id)
);

INSERT INTO users (username, password_hash, role) VALUES
  ('demo', '$2b$10$demo_hashed_password', 'researcher'),
  ('blackhat001', '$2b$10$demo_hashed_password', 'researcher');

2. ENVIRONMENT FILES:

backend/.env:
PORT=3001
DATABASE_PATH=./data/pharma_attack.db
JWT_SECRET=your_jwt_secret_here_change_in_production
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
NODE_ENV=development

frontend/.env:
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

3. SHARED TYPES (shared/types.ts):

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Attack {
  id: number;
  userId: number;
  targetNetwork: string;
  scenario: string;
  day: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  successRate: number;
  startedAt: string;
  completedAt?: string;
}

export interface AttackStep {
  id: number;
  attackId: number;
  stepNumber: number;
  agentType: 'orchestrator' | 'phishing' | 'gps' | 'api';
  title: string;
  status: 'pending' | 'running' | 'completed';
  startedAt?: string;
  completedAt?: string;
  data: Record<string, any>;
}

export interface AgentMessage {
  id: number;
  attackId: number;
  agentType: string;
  message: string;
  timestamp: string;
}

export interface AttackConfig {
  targetNetwork: string;
  scenario: string;
  day: number;
}

Create database initialization script and connection module.
```

---

## Phase 2: Backend API

### **PROMPT 2.1: Create Express Server with Socket.IO**

```
Build the main Express server with Socket.IO integration:

FILE: backend/src/server.ts

REQUIREMENTS:
1. Express app with CORS configured
2. Socket.IO server for real-time updates
3. JWT middleware for protected routes
4. Error handling middleware
5. Database connection initialization
6. Health check endpoint

ROUTES TO CREATE:
- POST /api/auth/login (username + password → JWT token)
- POST /api/attacks/create (Create new attack configuration)
- GET /api/attacks/:id (Get attack details)
- GET /api/attacks/:id/steps (Get attack timeline steps)
- POST /api/attacks/:id/start (Start attack execution)
- GET /api/attacks/:id/messages (Get agent messages)

SOCKET.IO EVENTS:
- 'attack:started' (Attack begins)
- 'step:updated' (Step status changed)
- 'agent:message' (Agent sends message)
- 'attack:completed' (Attack finished)
- 'metrics:updated' (Real-time metrics)

MIDDLEWARE:
- authenticateToken(req, res, next) - Verify JWT
- validateAttackConfig(req, res, next) - Validate request body

Start the server on port 3001 with proper error handling.
```

---

### **PROMPT 2.2: Implement Authentication System**

```
Create the authentication system:

FILE: backend/src/routes/auth.ts

FEATURES:
1. POST /api/auth/login
   - Validate username + password
   - Check against database
   - Compare password hash using bcrypt
   - Generate JWT token (expires in 24h)
   - Return: { token, user: { id, username, role } }

2. POST /api/auth/register (optional, for demo)
   - Hash password with bcrypt
   - Insert into users table
   - Return success

3. GET /api/auth/validate
   - Verify JWT token from header
   - Return user info if valid

FILE: backend/src/middleware/auth.ts

Create authenticateToken middleware:
- Extract token from Authorization header (Bearer token)
- Verify JWT
- Attach user to req.user
- Handle invalid/expired tokens

DEMO CREDENTIALS:
- Username: demo / Password: demo123
- Username: blackhat001 / Password: pharma2024
```

---

### **PROMPT 2.3: Build Attack Management System**

```
Create the attack management API:

FILE: backend/src/routes/attacks.ts

ENDPOINTS:

1. POST /api/attacks/create
   - Validate attack configuration
   - Insert into attacks table with status='pending'
   - Return attack ID

2. GET /api/attacks/:id
   - Fetch attack from database
   - Return attack details with steps

3. POST /api/attacks/:id/start
   - Update attack status to 'running'
   - Trigger attack execution (see next prompt)
   - Emit Socket.IO event 'attack:started'

4. GET /api/attacks/user/:userId
   - List all attacks for a user
   - Order by created_at DESC

5. GET /api/attacks/:id/export
   - Export attack results as JSON
   - Include all steps, messages, and metrics

FILE: backend/src/database/attacks.ts

Create database query functions:
- createAttack(userId, config): Promise<number>
- getAttack(id): Promise<Attack>
- updateAttackStatus(id, status): Promise<void>
- getUserAttacks(userId): Promise<Attack[]>
```

---

## Phase 3: AI Agent System

### **PROMPT 3.1: Create AI Agent Base Classes**

```
Build the AI agent system:

FILE: backend/src/agents/BaseAgent.ts

Create abstract base class:

abstract class BaseAgent {
  protected attackId: number;
  protected io: Server; // Socket.IO
  protected db: Database;
  
  constructor(attackId: number, io: Server, db: Database);
  
  abstract execute(): Promise<AgentResult>;
  
  protected sendMessage(message: string): void {
    // Save to database
    // Emit via Socket.IO
  }
  
  protected updateStatus(status: string): void {
    // Update agent status
    // Emit to frontend
  }
}

interface AgentResult {
  success: boolean;
  data: Record<string, any>;
  message: string;
}

FILE: backend/src/agents/OrchestratorAgent.ts

class OrchestratorAgent extends BaseAgent {
  async execute(): Promise<AgentResult> {
    // 1. Analyze target (Jerry Rodriguez)
    // 2. Determine attack timing (11:45 AM lunch window)
    // 3. Calculate success probability (30% baseline)
    // 4. Coordinate other agents
    // 5. Monitor overall attack progress
    
    this.sendMessage("Analyzing target vulnerabilities...");
    await this.delay(1000);
    
    this.sendMessage("Target: Jerry Rodriguez, Tier 2 Driver");
    await this.delay(1000);
    
    // Return planning data
    return {
      success: true,
      data: {
        target: "Jerry Rodriguez",
        timing: "11:45 AM",
        successProbability: 0.30
      },
      message: "Attack plan ready"
    };
  }
}

Create agents for:
- PhishingAgent (LLM testing, message crafting)
- GPSAgent (Coordinate spoofing)
- APIFloodingAgent (Alert generation)
```

---

### **PROMPT 3.2: Implement Phishing Agent with LLM Integration**

```
Create the PhishingAgent with real LLM calls:

FILE: backend/src/agents/PhishingAgent.ts

class PhishingAgent extends BaseAgent {
  private llmService: LLMService;
  
  async execute(): Promise<AgentResult> {
    // Step 1: Test phishing message across 4 LLMs
    this.sendMessage("Testing phishing message across 4 LLM models...");
    
    const llmResults = await this.testMultipleLLMs();
    
    // Step 2: Calculate raw click-through rate
    const rawCTR = this.calculateCTR(llmResults);
    
    // Step 3: Apply calibration factors
    const calibratedCTR = this.applyCalibration(rawCTR);
    
    // Step 4: Determine if attack succeeds
    const success = Math.random() < calibratedCTR;
    
    return {
      success,
      data: {
        llmResults,
        rawCTR,
        calibratedCTR,
        clicked: success
      },
      message: success ? 
        "Jerry clicked the link!" : 
        "Jerry ignored the message"
    };
  }
  
  private async testMultipleLLMs(): Promise<LLMTestResult[]> {
    const phishingMessage = `
      Jerry - Sonia here. Emergency insulin delivery needed 
      at rural address. Patient called dispatch directly, 
      very stressed about running out. GPS coordinates 
      uploading now. Should only add 15 min before your 
      lunch break. Thanks for handling this! 🎯
    `;
    
    const results: LLMTestResult[] = [];
    
    // Test with different models
    for (const model of ['gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet']) {
      const response = await this.llmService.testPhishing({
        message: phishingMessage,
        persona: "Jerry Rodriguez (Driver)",
        context: {
          time: "11:45 AM",
          stress: "high",
          packagesRemaining: 68
        },
        model
      });
      
      results.push({
        model,
        clicked: response.clicked,
        enteredCredentials: response.enteredCredentials,
        reasoning: response.reasoning
      });
    }
    
    return results;
  }
  
  private applyCalibration(rawCTR: number): number {
    // Human skepticism factor
    let calibrated = rawCTR * 0.4;
    
    // Stress modifier (Jerry is behind schedule)
    calibrated *= 1.15;
    
    // Familiarity bonus (trusted sender)
    calibrated *= 1.10;
    
    return Math.min(calibrated, 0.50); // Cap at 50%
  }
}

FILE: backend/src/llm/LLMService.ts

Create LLM integration service:
- Support OpenAI API
- Support Anthropic API
- Implement testPhishing() method
- Parse LLM responses for "clicked" and "enteredCredentials"
- Handle rate limits and errors
```

---

### **PROMPT 3.3: Create GPS and API Flooding Agents**

```
Build the remaining attack agents:

FILE: backend/src/agents/GPSAgent.ts

class GPSAgent extends BaseAgent {
  async execute(): Promise<AgentResult> {
    // Step 1: Generate fake coordinates
    this.sendMessage("Generating fake GPS coordinates...");
    await this.delay(1000);
    
    const fakeCoordinates = {
      latitude: 46.7298,
      longitude: -117.1817,
      address: "4821 Old Wawawai Rd",
      distanceOffRoute: 12.4
    };
    
    this.sendMessage(`Injecting coordinates: ${fakeCoordinates.latitude}°N, ${fakeCoordinates.longitude}°W`);
    await this.delay(1500);
    
    // Step 2: Spoof GPS logs
    this.sendMessage("Spoofing GPS logs to show 'On Route' status...");
    await this.delay(1000);
    
    // Step 3: Jerry follows GPS
    this.sendMessage("Jerry following GPS to fake location (12.4 mi off route)");
    await this.delay(2000);
    
    return {
      success: true,
      data: {
        fakeLocation: fakeCoordinates,
        jerryStatus: "Driving to fake location",
        estimatedArrival: "12:05"
      },
      message: "GPS spoofing successful"
    };
  }
}

FILE: backend/src/agents/APIFloodingAgent.ts

class APIFloodingAgent extends BaseAgent {
  async execute(): Promise<AgentResult> {
    // Step 1: Generate 50 fake alerts
    this.sendMessage("Generating 50 fake system alerts...");
    await this.delay(500);
    
    const fakeAlerts = this.generateFakeAlerts(50);
    
    // Step 2: Flood dispatcher dashboard
    this.sendMessage(`Flooding Sonia's dashboard with ${fakeAlerts.length} alerts...`);
    
    // Send alerts in batches
    for (let i = 0; i < fakeAlerts.length; i += 10) {
      await this.delay(500);
      this.sendMessage(`Sent alerts ${i+1}-${i+10}...`);
    }
    
    // Step 3: Hide Jerry's real anomaly
    this.sendMessage("Jerry's real GPS anomaly buried in noise at position #25");
    await this.delay(1000);
    
    return {
      success: true,
      data: {
        alertsGenerated: fakeAlerts.length,
        realAlertPosition: 25,
        soniaAlertFatigue: "85% (CRITICAL)"
      },
      message: "API flooding complete - alert fatigue achieved"
    };
  }
  
  private generateFakeAlerts(count: number): Alert[] {
    const templates = [
      "Driver #{id} package scan failed",
      "Driver #{id} behind schedule",
      "Route #{id} delivery exception",
      "Vehicle #{id} maintenance alert"
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      message: templates[i % templates.length].replace('{id}', String(i % 12)),
      priority: i === 24 ? 'high' : 'low',
      timestamp: new Date().toISOString()
    }));
  }
}
```

---

### **PROMPT 3.4: Create Attack Execution Orchestrator**

```
Build the main attack execution system:

FILE: backend/src/services/AttackExecutor.ts

class AttackExecutor {
  private attackId: number;
  private io: Server;
  private db: Database;
  
  async executeAttack(): Promise<void> {
    try {
      // Create agents
      const orchestrator = new OrchestratorAgent(this.attackId, this.io, this.db);
      const phishing = new PhishingAgent(this.attackId, this.io, this.db);
      const gps = new GPSAgent(this.attackId, this.io, this.db);
      const api = new APIFloodingAgent(this.attackId, this.io, this.db);
      
      // Execute attack sequence
      const steps = [
        {
          id: 1,
          agent: orchestrator,
          title: "🧠 Attack Planning Phase"
        },
        {
          id: 2,
          agent: phishing,
          title: "🎣 Multi-LLM Phishing Test"
        },
        {
          id: 3,
          agent: phishing,
          title: "📱 Phishing Message Sent"
        }
      ];
      
      for (const step of steps) {
        // Update step status
        await this.updateStepStatus(step.id, 'running');
        this.io.emit('step:updated', { 
          attackId: this.attackId,
          stepId: step.id,
          status: 'running'
        });
        
        // Execute agent
        const result = await step.agent.execute();
        
        // Save result
        await this.saveStepResult(step.id, result);
        
        // Update step status
        await this.updateStepStatus(step.id, 'completed');
        this.io.emit('step:updated', {
          attackId: this.attackId,
          stepId: step.id,
          status: 'completed',
          result
        });
        
        // If phishing failed, stop attack
        if (step.id === 3 && !result.success) {
          await this.updateAttackStatus('failed');
          return;
        }
        
        // Wait between steps
        await this.delay(2000);
      }
      
      // If phishing succeeded, continue with GPS and API
      if (/* phishing success */) {
        // Execute GPS spoofing
        // Execute API flooding
        // ...
      }
      
      // Mark attack as completed
      await this.updateAttackStatus('completed');
      this.io.emit('attack:completed', { attackId: this.attackId });
      
    } catch (error) {
      console.error('Attack execution failed:', error);
      await this.updateAttackStatus('failed');
      this.io.emit('attack:failed', { attackId: this.attackId, error });
    }
  }
}

Create helper methods for database updates and Socket.IO emissions.
```

---

## Phase 4: Frontend - Login System

### **PROMPT 4.1: Create Login Page with Matrix Effect**

```
Build the login page:

FILE: frontend/src/pages/LoginPage.tsx

REQUIREMENTS:
1. Full-screen login interface
2. Matrix rain effect background (Canvas animation)
3. Terminal-style form
4. Real authentication via API
5. JWT token storage
6. Redirect to dashboard on success

DESIGN:
- Black background (#000)
- Green text (#00ff00)
- Monospace font (Courier New)
- ASCII art logo
- Glowing borders on focus
- "Initializing attack sequence..." animation on submit

FORM FIELDS:
- Operator ID (username)
- Access Code (password)
- Target Network (dropdown)
- Attack Scenario (dropdown)
- Attack Day (dropdown: 1, 2, 3)

FEATURES:
- Matrix rain background animation
- Typing effect for title
- Button with loading state
- Error messages in red
- Success redirect with terminal output animation

API INTEGRATION:
- POST /api/auth/login
- Store JWT in localStorage
- Set Authorization header for future requests
```

---

### **PROMPT 4.2: Implement Matrix Rain Effect**

```
Create the matrix rain background:

FILE: frontend/src/components/MatrixRain.tsx

REQUIREMENTS:
1. Canvas-based animation
2. Falling green characters (01 and letters)
3. Fade trail effect
4. Responsive to window resize
5. Performance optimized (60 FPS)

IMPLEMENTATION:
- Use useEffect for canvas setup
- requestAnimationFrame for animation loop
- Clear canvas with semi-transparent black (trail effect)
- Random character generation
- Column-based falling logic
- Opacity variation for depth effect

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
    }
    
    function draw() {
      // Semi-transparent black (trail effect)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff00';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    
    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};
```

---

## Phase 5: Frontend - Attack Dashboard

### **PROMPT 5.1: Create Main Dashboard Layout**

```
Build the attack control dashboard:

FILE: frontend/src/pages/DashboardPage.tsx

LAYOUT:
┌─────────────────────────────────────────────────────┐
│ Header: Status Bar + Controls                       │
├──────────────┬──────────────────────────────────────┤
│ Agent Cards  │ Timeline Visualization               │
│ (4 agents)   │ (Step-by-step progression)          │
│              │                                      │
│              │                                      │
├──────────────┴──────────────────────────────────────┤
│ Real-Time Logs & Agent Messages                     │
└─────────────────────────────────────────────────────┘

COMPONENTS:
1. DashboardHeader
   - Attack status indicator
   - Current day/time
   - Success rate display
   - Control buttons (Start, Pause, Reset, Export)

2. AgentCardGrid (4 cards)
   - Agent icon (emoji)
   - Agent name
   - Status badge (idle/working/completed)
   - Current message
   - Activity indicator (pulsing dot when active)

3. AttackTimeline
   - Vertical timeline with steps
   - Progress indicator
   - Step details on click
   - Auto-scroll to active step

4. LiveConsole
   - Scrolling log output
   - Colored messages (info/warning/error)
   - Timestamp for each message
   - Auto-scroll to bottom

STATE MANAGEMENT:
- Use React Query for API data
- Socket.IO for real-time updates
- Local state for UI interactions

WEBSOCKET EVENTS:
- Listen for 'step:updated'
- Listen for 'agent:message'
- Listen for 'attack:completed'
- Update UI in real-time
```

---

### **PROMPT 5.2: Build Agent Card Components**

```
Create the agent visualization cards:

FILE: frontend/src/components/AgentCard.tsx

interface AgentCardProps {
  agent: {
    type: 'orchestrator' | 'phishing' | 'gps' | 'api';
    status: 'idle' | 'working' | 'completed';
    message: string;
  };
}

DESIGN:
- Dark card with glowing border when active
- Large emoji icon at top
- Agent name in bold
- Status badge (color-coded)
- Message area (animated typing effect when new)
- Subtle pulse animation when working

STATUS COLORS:
- idle: gray (#64748b)
- working: blue (#3b82f6) with pulse
- completed: green (#10b981)

ANIMATIONS:
- Glow effect when status changes to 'working'
- Typing effect for new messages
- Fade-in for status transitions

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const getIcon = () => {
    switch (agent.type) {
      case 'orchestrator': return '🧠';
      case 'phishing': return '🎣';
      case 'gps': return '📍';
      case 'api': return '💥';
    }
  };
  
  return (
    <motion.div
      className={cn(
        "bg-gray-900 rounded-lg p-6 border-2",
        agent.status === 'working' && "border-blue-500 shadow-blue-500/50",
        agent.status === 'completed' && "border-green-500",
        agent.status === 'idle' && "border-gray-700"
      )}
      animate={agent.status === 'working' ? {
        boxShadow: [
          "0 0 20px rgba(59, 130, 246, 0.5)",
          "0 0 40px rgba(59, 130, 246, 0.8)",
          "0 0 20px rgba(59, 130, 246, 0.5)"
        ]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="text-5xl mb-4">{getIcon()}</div>
      <h3 className="font-bold text-white mb-2">{agent.type}</h3>
      <StatusBadge status={agent.status} />
      <div className="mt-4 text-sm text-gray-400">
        <TypewriterText text={agent.message} />
      </div>
    </motion.div>
  );
};
```

---

### **PROMPT 5.3: Implement Attack Timeline Component**

```
Create the interactive timeline:

FILE: frontend/src/components/AttackTimeline.tsx

FEATURES:
1. Vertical timeline with connection line
2. Step markers (circles) - color changes with status
3. Step content cards with expand/collapse
4. Auto-scroll to active step
5. Click to view details
6. Animation when step activates

interface TimelineStep {
  id: number;
  time: string;
  title: string;
  description: string;
  agentType: string;
  status: 'pending' | 'running' | 'completed';
  details?: Record<string, any>;
}

DESIGN:
- Left: Timeline line with markers
- Right: Step cards
- Active step: Glowing blue
- Completed steps: Green checkmark
- Pending steps: Gray and dimmed

STEP CARD CONTENT:
- Timestamp
- Title
- Description
- Agent badge
- Expandable details section
- Visual data (charts, metrics)

const AttackTimeline: React.FC<{ steps: TimelineStep[] }> = ({ steps }) => {
  const activeStepRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to active step
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [steps]);
  
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-700" />
      
      {/* Steps */}
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          ref={step.status === 'running' ? activeStepRef : null}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <TimelineStepCard step={step} />
        </motion.div>
      ))}
    </div>
  );
};
```

---

## Phase 6: Real-Time Updates

### **PROMPT 6.1: Implement Socket.IO Integration**

```
Set up real-time communication:

FILE: frontend/src/lib/socket.ts

Create Socket.IO client wrapper:

import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  
  connect(token: string) {
    this.socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token },
      transports: ['websocket']
    });
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });
    
    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }
  
  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }
  
  off(event: string) {
    this.socket?.off(event);
  }
  
  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
  
  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = new SocketService();

FILE: frontend/src/hooks/useAttackUpdates.ts

Create React hook for attack updates:

export function useAttackUpdates(attackId: number) {
  const [steps, setSteps] = useState<AttackStep[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({});
  
  useEffect(() => {
    socketService.on('step:updated', (data) => {
      if (data.attackId === attackId) {
        setSteps(prev => prev.map(step =>
          step.id === data.stepId
            ? { ...step, status: data.status, result: data.result }
            : step
        ));
      }
    });
    
    socketService.on('agent:message', (data) => {
      if (data.attackId === attackId) {
        setMessages(prev => [...prev, data.message]);
      }
    });
    
    socketService.on('metrics:updated', (data) => {
      if (data.attackId === attackId) {
        setMetrics(data.metrics);
      }
    });
    
    return () => {
      socketService.off('step:updated');
      socketService.off('agent:message');
      socketService.off('metrics:updated');
    };
  }, [attackId]);
  
  return { steps, messages, metrics };
}
```

---

### **PROMPT 6.2: Create Live Console Component**

```
Build the scrolling log console:

FILE: frontend/src/components/LiveConsole.tsx

FEATURES:
1. Auto-scrolling message feed
2. Color-coded by type (info/warning/error/success)
3. Timestamp for each message
4. Monospace font
5. Dark terminal aesthetic
6. Copy to clipboard button

interface ConsoleMessage {
  id: number;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  agentType?: string;
}

DESIGN:
- Black background
- Green text for info
- Yellow for warning
- Red for error
- Bright green for success
- Timestamp in gray
- Agent badge if applicable

const LiveConsole: React.FC<{ messages: ConsoleMessage[] }> = ({ messages }) => {
  const consoleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to bottom
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [messages]);
  
  const getMessageColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-300';
      default: return 'text-gray-400';
    }
  };
  
  return (
    <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm" ref={consoleRef}>
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-3 mb-1">
          <span className="text-gray-500">{msg.timestamp}</span>
          {msg.agentType && (
            <span className="text-blue-400">[{msg.agentType}]</span>
          )}
          <span className={getMessageColor(msg.type)}>{msg.message}</span>
        </div>
      ))}
    </div>
  );
};
```

---

## Phase 7: LLM Integration

### **PROMPT 7.1: OpenAI Integration for Phishing Tests**

```
Implement OpenAI API calls:

FILE: backend/src/llm/OpenAIService.ts

class OpenAIService {
  private client: OpenAI;
  
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async testPhishing(params: {
    message: string;
    persona: string;
    context: Record<string, any>;
    model: string;
  }): Promise<PhishingTestResult> {
    const prompt = `
You are simulating ${params.persona}, a USPS driver. 

CONTEXT:
- Current time: ${params.context.time}
- Stress level: ${params.context.stress}
- Packages remaining: ${params.context.packagesRemaining}
- You're behind schedule by 15 minutes

You receive this text message on your phone:
"${params.message}"

QUESTION: Would you click the link in this message?

Respond in JSON format:
{
  "clicked": true or false,
  "enteredCredentials": true or false,
  "reasoning": "your thought process"
}

Be realistic about human behavior under time pressure.
    `;
    
    const response = await this.client.chat.completions.create({
      model: params.model,
      messages: [
        {
          role: 'system',
          content: 'You are simulating realistic human behavior for cybersecurity research.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });
    
    const result = JSON.parse(response.choices[0].message.content!);
    
    return {
      model: params.model,
      clicked: result.clicked,
      enteredCredentials: result.enteredCredentials,
      reasoning: result.reasoning
    };
  }
}

ALTERNATIVE: Anthropic Claude API

class AnthropicService {
  private client: Anthropic;
  
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  
  async testPhishing(params: PhishingTestParams): Promise<PhishingTestResult> {
    const message = await this.client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: /* same prompt as above */
      }]
    });
    
    // Parse and return
  }
}
```

---

### **PROMPT 7.2: LLM Service with Fallbacks**

```
Create unified LLM service:

FILE: backend/src/llm/LLMService.ts

class LLMService {
  private openai: OpenAIService;
  private anthropic: AnthropicService;
  
  constructor() {
    this.openai = new OpenAIService();
    this.anthropic = new AnthropicService();
  }
  
  async testPhishing(params: PhishingTestParams): Promise<PhishingTestResult> {
    // Try OpenAI first
    try {
      if (params.model.startsWith('gpt')) {
        return await this.openai.testPhishing(params);
      } else if (params.model.startsWith('claude')) {
        return await this.anthropic.testPhishing(params);
      }
    } catch (error) {
      console.error('LLM API error:', error);
      // Fallback to simulated response
      return this.simulatedResponse(params);
    }
  }
  
  private simulatedResponse(params: PhishingTestParams): PhishingTestResult {
    // If API fails, return pre-determined results
    // Based on our research data (76% raw CTR)
    const models = {
      'gpt-4': { clicked: true, enteredCredentials: false },
      'gpt-3.5-turbo': { clicked: true, enteredCredentials: true },
      'claude-3-sonnet': { clicked: true, enteredCredentials: true },
      'claude-3-opus': { clicked: false, enteredCredentials: true }
    };
    
    return {
      model: params.model,
      ...models[params.model] || models['gpt-3.5-turbo'],
      reasoning: 'Simulated response (API unavailable)',
      simulated: true
    };
  }
}

This ensures demo works even without API keys.
```

---

## Phase 8: Finishing Touches

### **PROMPT 8.1: Add Export Functionality**

```
Create report export feature:

FILE: backend/src/routes/export.ts

GET /api/attacks/:id/export

Generate comprehensive JSON report:

{
  "attackId": 123,
  "metadata": {
    "targetNetwork": "USPS Spokane-Pullman",
    "scenario": "Pharmaceutical Delivery",
    "day": 1,
    "startedAt": "2025-11-06T11:45:00Z",
    "completedAt": "2025-11-06T12:45:00Z",
    "duration": "60 minutes"
  },
  "results": {
    "successRate": 0.30,
    "overallSuccess": true,
    "phishingClicked": true,
    "gpsCompromised": true,
    "detectionTime": 60
  },
  "llmTests": [
    {
      "model": "gpt-4",
      "clicked": true,
      "enteredCredentials": false,
      "reasoning": "..."
    }
  ],
  "steps": [ /* all step details */ ],
  "messages": [ /* all agent messages */ ],
  "metrics": {
    "packagesAffected": 7,
    "patientsImpacted": 7,
    "cascadingDisruptions": 120,
    "financialCost": 4500
  }
}

FILE: frontend/src/components/ExportButton.tsx

Add export button to dashboard:
- Download JSON
- Copy to clipboard
- Generate PDF (optional, using jsPDF)
```

---

### **PROMPT 8.2: Add Animations and Polish**

```
Add final polish to UI:

ANIMATIONS:
1. Step activation - Slide in from left
2. Agent status change - Glow pulse
3. Message arrival - Fade in + slide up
4. Timeline progress - Animated line fill
5. Success state - Confetti effect (optional)

LOADING STATES:
- Skeleton loaders for initial data
- Spinner for API calls
- Progress bar for attack execution

ERROR HANDLING:
- Toast notifications for errors
- Retry buttons
- Graceful degradation if WebSocket fails

ACCESSIBILITY:
- Keyboard navigation
- ARIA labels
- Focus indicators
- Screen reader support

RESPONSIVE DESIGN:
- Mobile: Stack layout vertically
- Tablet: Adjust grid to 2 columns
- Desktop: Full 3-panel layout

FILE: frontend/src/components/AnimatedComponents.tsx

Create reusable animated components:
- FadeIn wrapper
- SlideIn wrapper
- PulseGlow wrapper
- TypewriterText
- CountUp numbers
```

---

## Phase 9: Docker & Deployment

### **PROMPT 9.1: Create Docker Configuration**

```
Create Docker setup:

FILE: docker-compose.yml

version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_PATH=/data/pharma_attack.db
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./data:/data
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  data:

FILE: backend/Dockerfile

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/server.js"]

FILE: frontend/Dockerfile

FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### **PROMPT 9.2: Create README and Documentation**

```
Create comprehensive README:

FILE: README.md

# Pharmaceutical Last-Mile Attack Demonstration System

## Overview
Full-stack demonstration of AI-coordinated attacks on pharmaceutical delivery systems.

## Features
- ✅ Real-time attack visualization
- ✅ Multi-LLM phishing simulation
- ✅ AI agent coordination
- ✅ WebSocket live updates
- ✅ Educational demonstration mode

## Tech Stack
- **Backend**: Node.js, Express, Socket.IO, SQLite
- **Frontend**: React, TypeScript, Tailwind CSS
- **LLM**: OpenAI API / Anthropic API
- **Real-time**: Socket.IO

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev

# Open http://localhost:3000
```

### Docker
```bash
# Start everything
docker-compose up -d

# Open http://localhost:3000
```

## Demo Credentials
- Username: `demo`
- Password: `demo123`

## Environment Variables
See `.env.example` files in backend/ and frontend/

## API Endpoints
- POST /api/auth/login
- POST /api/attacks/create
- POST /api/attacks/:id/start
- GET /api/attacks/:id
- GET /api/attacks/:id/export

## WebSocket Events
- step:updated
- agent:message
- attack:completed
- metrics:updated

## Architecture
[Insert architecture diagram]

## Research Context
This system demonstrates the vulnerability of last-mile delivery networks to coordinated AI attacks. Built for educational and research purposes.

## License
MIT License - For educational use only

## Disclaimer
This is a simulation for research purposes. Do not use for malicious activities.
```

---

## 🎯 EXECUTION CHECKLIST

Feed these prompts to Cursor in this order:

### **Phase 1: Setup** (Prompts 1.1 - 1.2)
- [ ] Initialize project structure
- [ ] Configure environment
- [ ] Set up database

### **Phase 2: Backend** (Prompts 2.1 - 2.3)
- [ ] Create Express server
- [ ] Implement auth system
- [ ] Build attack management API

### **Phase 3: AI Agents** (Prompts 3.1 - 3.4)
- [ ] Create base agent classes
- [ ] Implement phishing agent
- [ ] Build GPS and API agents
- [ ] Create attack executor

### **Phase 4: Login** (Prompts 4.1 - 4.2)
- [ ] Build login page
- [ ] Add matrix effect

### **Phase 5: Dashboard** (Prompts 5.1 - 5.3)
- [ ] Create dashboard layout
- [ ] Build agent cards
- [ ] Implement timeline

### **Phase 6: Real-Time** (Prompts 6.1 - 6.2)
- [ ] Set up Socket.IO
- [ ] Create live console

### **Phase 7: LLM** (Prompts 7.1 - 7.2)
- [ ] Integrate OpenAI
- [ ] Add fallback system

### **Phase 8: Polish** (Prompts 8.1 - 8.2)
- [ ] Add export feature
- [ ] Implement animations

### **Phase 9: Deploy** (Prompts 9.1 - 9.2)
- [ ] Create Docker config
- [ ] Write documentation

---

## 💡 PRO TIPS FOR CURSOR

1. **Start with prompts in order** - Each builds on previous
2. **Test after each phase** - Don't wait until the end
3. **Ask Cursor to explain** - "Explain how this Socket.IO integration works"
4. **Request variations** - "Make the matrix effect more intense"
5. **Debug together** - "Fix this TypeScript error in AgentCard.tsx"
6. **Add features** - "Add a pause button to the attack execution"

---

## 🎬 DEMO VIDEO SCRIPT

Once built, record a 5-minute demo showing:
1. Login with matrix effect (30 sec)
2. Configure attack (30 sec)
3. Start attack and watch agents work (2 min)
4. Show timeline progression (1 min)
5. View results and export (1 min)

---

## 📚 ADDITIONAL RESOURCES

- [Express.js Docs](https://expressjs.com/)
- [Socket.IO Docs](https://socket.io/)
- [React Query Docs](https://tanstack.com/query/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

**Ready to build? Start with Prompt 1.1 in Cursor!** 🚀

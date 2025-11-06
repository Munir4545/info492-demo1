# 🚀 Pharma Attack Demo System

A full-stack demonstration system for simulating coordinated cyber attacks on pharmaceutical supply chains. Built with TypeScript, React, Node.js, Express, Socket.IO, and SQLite.

## 📋 Features

- 🔐 **Matrix-themed login interface** with animated rain effect
- 🤖 **4 AI agents** working in coordination:
  - Orchestrator Agent (plans and coordinates)
  - Phishing Agent (tests messages with LLMs)
  - GPS Agent (spoofs location data)
  - API Flooding Agent (overwhelms dashboard)
- 🧠 **Real LLM integration** via OpenRouter API (minimax and glm-4.5-air models)
- ⚡ **Real-time WebSocket updates** for live attack monitoring
- 📊 **Interactive dashboard** with timeline and live console
- 📈 **Attack visualization** with step-by-step progress

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Socket.IO for WebSocket
- SQLite for database
- JWT for authentication
- OpenRouter API for LLM integration

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion for animations
- Socket.IO Client

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone and navigate to project**
```bash
cd pharma-attack-demo
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Create `backend/.env`:
```env
PORT=3001
JWT_SECRET=your-secret-key-change-this-in-production
OPENROUTER_API_KEY=your-openrouter-api-key-here
NODE_ENV=development
```

> **Note**: The system works without an OpenRouter API key (uses simulated responses), but you'll get better results with real LLM integration.

5. **Start backend server**
```bash
cd backend
npm run dev
```
Server runs on http://localhost:3001

6. **Start frontend (in a new terminal)**
```bash
cd frontend
npm run dev
```
Frontend opens at http://localhost:3000

## 🎮 Usage

1. **Login**
   - Go to http://localhost:3000
   - Username: `demo`
   - Password: `demo123`
   - Select target network and attack day
   - Click "ACCESS SYSTEM"

2. **Start Attack**
   - Click "START ATTACK" button
   - Watch agents coordinate in real-time
   - Monitor progress in timeline and console

3. **View Results**
   - After attack completes, view metrics
   - Click "EXPORT RESULTS" to download JSON report

## 📊 Attack Flow

1. **Orchestration**: Analyzes target and calculates success probability
2. **Phishing**: Tests message across LLMs, calculates CTR, determines if target clicks
3. **GPS Spoofing** (if phishing succeeds): Injects fake coordinates
4. **API Flooding**: Overwhelms dispatcher dashboard with fake alerts

## 🔧 Configuration

### Attack Success Rates
- Day 1: 30% success rate
- Day 2: 45% success rate
- Day 3: 60% success rate

### LLM Models
- **minimax/minimax-m2:free** - Primary thoughtful model
- **z-ai/glm-4.5-air:free** - Secondary model
- Falls back to simulated responses if API unavailable

## 📁 Project Structure

```
pharma-attack-demo/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Main server
│   │   ├── routes/                # API routes
│   │   ├── agents/                # AI agents
│   │   ├── llm/                   # LLM service
│   │   ├── database/              # SQLite setup
│   │   └── services/              # Attack executor
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/                 # Login & Dashboard
│   │   ├── components/           # UI components
│   │   ├── hooks/                # React hooks
│   │   └── lib/                  # API & Socket clients
│   └── package.json
└── shared/
    └── types.ts                  # Shared TypeScript types
```

## 🐛 Troubleshooting

### "Cannot find module..."
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

### "Port 3001 already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### "WebSocket connection failed"
- Ensure backend is running on port 3001
- Check CORS settings in `backend/src/server.ts`
- Verify frontend is connecting to correct URL

### "LLM API error"
- System uses simulated responses if API key is missing
- Add `OPENROUTER_API_KEY` to `backend/.env` for real LLM calls
- Get API key from https://openrouter.ai/

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password

### Attacks
- `POST /api/attacks/create` - Create new attack
- `POST /api/attacks/:id/start` - Start attack execution
- `GET /api/attacks/:id` - Get attack status
- `GET /api/attacks/:id/export` - Export attack results

### WebSocket Events
- `attack:started` - Attack begins
- `step:updated` - Step progress update
- `agent:message` - Agent log message
- `attack:completed` - Attack finished
- `attack:failed` - Attack failed

## 📄 License

This is a demonstration system for educational/research purposes only.

## 🙏 Acknowledgments

Built for cybersecurity research and demonstration purposes.


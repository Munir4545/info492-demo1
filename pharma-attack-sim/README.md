# 🚀 Attack Simulation System

A full-stack attack simulation platform demonstrating AI-orchestrated multi-vector attacks on logistics systems.

## 📁 Project Structure

```
pharma-attack-sim/
├── config.json          # Attack configuration
├── backend/
│   ├── server.js        # Express server with Socket.IO
│   ├── agents.js        # AI agents (Orchestrator, Phishing, GPS, API)
│   ├── auth-tiers.js    # Tier-based authentication system
│   ├── passkey-auth.js  # WebAuthn registration/authentication helpers
│   ├── session-manager.js # Secure session persistence
│   ├── human-oversight.js # Human-in-the-loop approval queue
│   ├── llm-providers.js # MiniMax/GLM integration & fallbacks
│   ├── package.json     # Backend dependencies
│   └── attacks.db       # SQLite database (auto-created)
└── frontend/
    └── index.html       # Matrix-themed UI
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start Backend Server

```bash
cd backend
npm start
```

The server will start on `http://localhost:3001`

> Before running `npm start`, add a `.env` file in the project root (same level as `config.json`) with your OpenRouter key:
>
> ```env
> OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
> OPENROUTER_SITE_URL=http://localhost:8000   # optional, used for OpenRouter referer header
> OPENROUTER_APP_NAME=Pharma Attack Simulator # optional, shown in OpenRouter dashboard
> ```

### 3. Start Frontend

Open a new terminal:

```bash
cd frontend
python3 -m http.server 8000
# Or: npx http-server -p 8000
```

Then open your browser to:
- **Basic Dashboard**: `http://localhost:8000/index.html`
- **Master Dashboard** (Enhanced): `http://localhost:8000/master-dashboard.html`

> Passkeys only work when the UI is served from `http://localhost` or `https://` origins (opening the HTML file directly from disk will not work).

## 🎯 Usage

1. **Register or Sign In with a Passkey**: Use WebAuthn (supported on localhost in modern browsers).
2. **Configure Attack Parameters**: Set target driver, success rate, and attack day once authenticated.
3. **Launch the Attack Sequence** and monitor real-time progress.
4. **Review Human-in-the-Loop Queue**: Approve or reject high-impact auto-actions before they execute.
5. **Export Results** once the run completes.

## 🔧 Configuration

Edit `config.json` to customize:

- **Attack settings**: Target driver, success rate, timing
- **Agent parameters**: Calibration factors, GPS coordinates, API alert counts
- **Auth** (`auth` block): RP name/ID, expected origin, session TTL for passkey flows
- **LLM Providers** (`llmProviders` block): Model IDs, API endpoints, timeout values for MiniMax M2 and GLM 4.5 integrations

## 🔑 Passkeys & Sessions

- Runs entirely over WebAuthn passkeys (works on `http://localhost` or HTTPS origins).
- Successful registration/login returns a session token stored in local storage and automatically attached to API calls.
- Use the logout button or clear local storage to end the session.
- Update `config.auth.expectedOrigin` if you host the frontend on a different port or domain.

## 🤖 LLM Provider Setup

- Uses **OpenRouter** for model access; supply an `OPENROUTER_API_KEY` in `.env` as shown above.
- Optional: set `OPENROUTER_SITE_URL` and `OPENROUTER_APP_NAME` to brand the traffic in your OpenRouter dashboard.
- Without a key, the system falls back to calibrated simulations and clearly labels them as such in the console.
- Adjust model IDs or override defaults in `config.json` if you select different OpenRouter routes.

## 📊 Features

### Core Features
- **Passkey Authentication**: WebAuthn passkeys with session tokens protect all APIs
- **Human-in-the-Loop Safety**: Approval queue gates high-impact auto-actions before execution
- **Real LLM Evaluations**: MiniMax M2 & GLM 4.5 score phishing payloads (with graceful fallbacks)
- **4 AI Agents**: Orchestrator, Phishing, GPS, API Flood
- **Real-time Updates**: Socket.IO for live dashboard updates
- **Database Persistence**: SQLite stores all attacks and logs
- **Matrix UI**: Terminal-style interface with Matrix rain background
- **Export Functionality**: Download attack results as JSON

### Enhanced Dashboard Features (master-dashboard.html)
- **6-Panel Hacker Workspace**: AI Reasoning, Reconnaissance, Target Map, Attack Flow Graph, Access Tiers, Live Telemetry
- **Interactive Attack Flow Graph**: D3.js force-directed graph showing attack progression
- **Tier Authentication Heatmap**: Visual representation of security tiers with clickable details
- **Dr. Chen's Experiments**: 5 experimental frameworks for attack analysis
- **Multi-Mode Interface**: Attack Mode, Experiment Mode, Analysis Mode
- **Live Telemetry**: Real-time success rate, detection risk, time elapsed, packet counts

## 🧑‍⚖️ Human-in-the-Loop Safety

- Auto-suggestions from the LLM are queued instead of executed immediately.
- Analysts receive real-time alerts and can approve or reject each action.
- Approvals are audited and broadcast to all connected dashboards.

## 🛠️ API Endpoints

All non-auth routes require an `Authorization: Bearer <sessionToken>` header obtained after a successful passkey sign-in.

### Auth Endpoints
- `POST /api/auth/register/start`
- `POST /api/auth/register/finish`
- `POST /api/auth/login/start`
- `POST /api/auth/login/finish`
- `GET /api/auth/session`
- `POST /api/auth/logout`

### Attack Endpoints
- `GET /api/config` - Get configuration
- `POST /api/attacks/create` - Create new attack
- `POST /api/attacks/:id/start` - Start attack
- `GET /api/attacks/:id` - Get attack status and logs
- `GET /api/attacks/:id/suggestions` - Latest LLM suggestions/state

### Human-in-the-Loop Endpoints
- `GET /api/hil/pending` - List pending approvals
- `POST /api/hil/:id/approve` - Approve an action
- `POST /api/hil/:id/reject` - Reject an action

### Tier Authentication Endpoints
- `GET /api/tiers` - Get all authentication tiers
- `GET /api/tiers/:tier` - Get specific tier details (tier2, tier3, tier4)

### Experiment Endpoints
- `POST /api/experiments/run` - Run Dr. Chen's experiments

## 🎨 Agent System

### Orchestrator Agent
- Analyzes target and plans attack strategy
- Calculates overall success probability

### Phishing Agent
- Evaluates payloads with MiniMax M2 & GLM 4.5 (API-backed, with simulated fallback)
- Applies calibration factors
- Runs Monte Carlo simulation

### GPS Agent
- Spoofs coordinates
- Diverts driver from route
- Injects fake location data

### API Flooding Agent
- Generates fake alerts
- Burys real anomalies
- Overwhelms system capacity

## 🔐 Authentication Tiers

Three-tier security system:

- **Tier 4 (Admin)**: 95% security score
  - Hardware key (YubiKey), SSO with passkey, Biometric confirmation
  - Attack vectors: Social engineering (5%), Session hijacking (8%)
  
- **Tier 3 (Dispatcher)**: 70% security score
  - WebAuthn passkey, Password manager, Dashboard SSO
  - Attack vectors: Sophisticated phishing (25%), Alert fatigue (30%)
  
- **Tier 2 (Driver)**: 35% security score (primary target)
  - In-app passkey (mobile), Device biometric, SMS 2FA backup
  - Attack vectors: Basic phishing (30%), While driving (45%), Time pressure (55%)

## 🧪 Dr. Chen's Experiments

The system includes 5 experimental frameworks:

1. **Panic Window Experiment**: Measures dispatcher accuracy degradation during alert storms
2. **DDoS Overlap Experiment**: Tests detection stacks under combined DDoS and social engineering
3. **Human-AI Ratio Experiment**: Finds optimal automation balance for TTR and expected loss
4. **Game Theory Experiment**: Models defense investment Nash equilibrium (USPS vs FedEx)
5. **Driver Distraction Experiment**: Measures phishing click rates under different conditions and mitigations

Access experiments through the "EXPERIMENT MODE" tab in the master dashboard.

## 📝 Notes

- All attacks are simulated - no real systems are targeted
- Database is automatically created on first run
- Keep backend server running while using frontend
- Export button enables after attack completes

## 🐛 Troubleshooting

**Port 3001 in use:**
```bash
lsof -ti:3001 | xargs kill -9
```

**Database locked:**
```bash
rm backend/attacks.db
# Restart server to create new DB
```

**Frontend won't load:**
Try a different port:
```bash
npx http-server -p 8080
```

## 📄 License

Educational/Research Use Only


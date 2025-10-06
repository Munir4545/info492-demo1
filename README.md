# PNW Logistics Hub - AI Attack Simulation

A demonstration platform showcasing vulnerabilities in last-mile delivery systems through AI-orchestrated multi-vector attacks.

## Project Team
- Jacqueline Flynn
- Charlotte Liu
- Munir Emam
- Ellie Wu

## Overview

This project demonstrates how AI agents can exploit vulnerabilities in Pacific Northwest logistics networks through coordinated attacks across multiple vectors:

- **Phishing Campaigns**: Automated credential harvesting via AI-generated emails
- **GPS Manipulation**: Spoofing fleet tracking systems to disrupt routes
- **API Flooding**: Injecting fake orders to overwhelm system capacity

## AI Agent Architecture

This project implements a sophisticated **Autonomous Agent Architecture** based on the Analyze → Decide → Act → Update loop.

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    AI ORCHESTRATOR (🧠 Brain)                │
│  • Analyzes shared state                                     │
│  • Makes strategic decisions                                 │
│  • Coordinates specialized agents                            │
│  • Adapts based on success/failure                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │   LLM ENGINE      │ ← DeepSeek v3.1 via OpenRouter
        │  (Content Gen)     │    Generates attack content
        └─────────┬──────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼───┐  ┌─────▼──┐
│PHISHING│  │  GPS   │  │  API   │
│ AGENT  │  │ AGENT  │  │ AGENT  │
└────────┘  └────────┘  └────────┘
    │             │            │
    └─────────────┼────────────┘
                  ▼
        ┌─────────────────┐
        │  SHARED STATE   │ ← System Memory
        │  • Compromised  │
        │  • Detection Risk│
        │  • Progress     │
        └─────────────────┘
```

### Agent Loop Cycle

1. **ANALYZE**: Orchestrator reads Shared State (compromised accounts, detection risk, phase)
2. **DECIDE**: Uses LLM to strategically choose next action based on current situation
3. **ACT**: Commands a specialized agent (Phishing/GPS/API) with LLM-generated content
4. **UPDATE**: Results recorded to Shared State (success, failure, new data)
5. **REPEAT**: Loop continues, adapting strategy based on updated state

### Specialized Agents

- **Phishing Agent**: Harvests credentials via AI-generated email campaigns
- **GPS Manipulation Agent**: Spoofs vehicle locations to disrupt routes
- **API Flood Agent**: Injects fake orders to overwhelm system capacity

### Shared State Tracking

- Compromised account count
- Detection risk percentage (increases with activity)
- Attack phase (initializing → active → escalating → peak)
- Metrics per attack vector
- Attack history log

## Features

### 1. Logistics Operations Portal
- Realistic dispatcher login interface
- Live operations dashboard showing:
  - Active fleet status (47 drivers across WA regions)
  - Pending deliveries tracking
  - System health monitoring
  - Real-time alerts

### 2. AI-Orchestrated Attack Simulation
- **5 AI Agents working in coordination:**
  - AGENT-PHI-001: Phishing Orchestrator
  - AGENT-GPS-002: GPS Manipulator
  - AGENT-API-003: API Flooder
  - AGENT-CRD-004: Credential Harvester
  - AGENT-SCL-005: Attack Scaler

- **Attack Phases:**
  - Initializing (0-10s): Initial reconnaissance
  - Active (10-30s): Multi-vector attacks begin
  - Escalating (30-60s): Coordinated assault intensifies
  - Peak (60s+): Full-scale system compromise

- **Real-time Visualization:**
  - Live metrics for each attack vector
  - Compromised fleet units display
  - Activity log with timestamped events
  - Progress tracking toward 500+ disruptions

- **AI Orchestrator Dashboard:**
  - **Orchestrator Thinking Panel**: See the AI's strategic analysis in real-time
  - **Decision Stream**: Watch as the orchestrator decides which agent to deploy
  - **Shared State Monitor**: View system memory (compromised accounts, detection risk, progress)
  - **Agent Status Panel**: Track all 5 agents and their action counts
  - **Risk Assessment**: Live risk evaluation (low/medium/high)
  - **Expected Outcomes**: See what the orchestrator predicts will happen

### 3. Geographic Visualization (OpenStreetMap)
**Operations Dashboard Map:**
- Live fleet tracking across Washington State
- Color-coded driver status markers:
  - 🔵 Blue: En Route
  - 🟢 Green: Delivering
  - ⚫ Gray: Loading
- Coverage area: Tacoma to Eastern Washington (Spokane, Yakima, Walla Walla, Pasco, Wenatchee)
- Interactive popups showing driver details

**Attack Monitor Map:**
- Real-time attack visualization overlay
- 🔴 Red pulsing markers for compromised units
- ⚡ Attack origin points (Phishing Server, GPS Spoofer, API Flooder)
- Attack radius circles showing range of influence
- Connecting lines from attack origins to compromised drivers
- Live counter of compromised fleet units

### 4. AI Chat Interface (Bonus)
- Chat with DeepSeek v3.1 via OpenRouter
- Accessible from main page

## Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS 4
- **Mapping**: Leaflet + React-Leaflet (OpenStreetMap)
- **AI Integration**: OpenRouter API (DeepSeek v3.1)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd demo-1
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser:
- Main page: http://localhost:3000
- Logistics Portal: http://localhost:3000/portal

## Usage

### Accessing the Logistics Portal

1. Navigate to `/portal`
2. Login with any username/password (demo mode)
3. View the normal operations dashboard
4. Click **"Start Attack Simulation"** button
5. Watch the AI-orchestrated attack unfold in real-time

### What You'll See

**Left Side - Attack Execution:**
- **Metrics Dashboard**: Real-time counters for each attack vector
- **AI Agent Status**: 5 agents activating and coordinating attacks
- **Geographic Map**: Visual attack spread across Washington
- **Compromised Systems**: List of affected drivers and vehicles
- **Activity Log**: Live feed of AI actions (phishing, GPS spoofing, API floods)
- **Progress Tracker**: Visual progress toward 500+ disruptions

**Right Side - AI Orchestrator:**
- **Orchestrator Brain**: Purple pulsing icon showing active thinking
- **Strategic Analysis**: Read the AI's reasoning in plain English
  - Example: *"Detection risk is currently low at 23%. Prioritizing phishing campaign to harvest more credentials before escalating GPS manipulation. This will establish a stronger foothold."*
- **Current Decision**: See which agent is being deployed and why
- **Shared State**: Live memory showing:
  - Attack phase (with color coding)
  - Compromised account count
  - Detection risk meter (0-100%)
  - Total disruptions counter
  - System metrics tree view
- **Agent Panel**: Status of all 5 agents (Active/Standby/Executing)

**How the Orchestrator Works:**
- Every 15 seconds, the orchestrator calls the LLM
- Sends current state and recent history
- LLM analyzes and returns strategic decision
- Decision appears in the panel with full reasoning
- Agents execute based on orchestrator commands
- Actions increment faster for targeted agents
- State updates in real-time
- Cycle repeats with adapted strategy

## Research Context

This project validates the thesis:

> "PNW last-mile delivery networks cannot defend against AI-orchestrated attacks by deploying autonomous agents that harvest credentials through phishing, manipulating GPS tracking, and flooding APIs with fake orders across Tacoma to Eastern Washington logistics operations."

### Key Vulnerabilities Demonstrated

1. **System-to-System Trust**: APIs between carriers, TMS, and warehouses
2. **Human-to-System Trust**: Dispatchers trust system-generated instructions
3. **Organization-to-Vendor Trust**: Automated updates from trusted vendors
4. **Role-to-Role Trust**: Communications assumed authentic without verification

### Attack Vectors

- **Phishing**: AI-generated emails targeting drivers, dispatchers, IT admins
- **GPS Spoofing**: Manipulating vehicle tracking to disrupt routes
- **API Exploitation**: Flooding order management systems with fake requests
- **Credential Harvesting**: Automated collection of authentication data
- **Multi-vector Coordination**: Simultaneous attacks across all vectors

## Security Constraints

- **Geographic Limitation**: Washington State only
- **Simulation Mode**: No real systems targeted
- **Research Purpose**: Educational demonstration
- **Logging**: All AI actions are recorded for analysis

## Future Enhancements

- [ ] Integration with actual LLM for dynamic attack generation
- [ ] Voice deepfake simulation for dispatcher impersonation
- [ ] Advanced GPS trajectory spoofing visualization
- [ ] Multi-day attack progression (72-hour simulation)
- [ ] Defense mechanism demonstrations
- [ ] Comparative analysis with hardened systems

## Citations

See full research paper for comprehensive citations including:
- McKinsey & Company (2023) - $9T global logistics market
- BlueVoyant (2024) - NotPetya attack analysis
- CM Alliance (2024) - Logistics cybersecurity strategies
- Brundage et al. (2018) - Malicious use of AI

## License

Educational/Research Use Only

## Disclaimer

This is a demonstration project for academic research purposes. No real logistics systems were compromised. All attack simulations are fictional and run in an isolated environment.

---

**Course**: INFO 492
**Institution**: University of Washington
**Date**: October 2025
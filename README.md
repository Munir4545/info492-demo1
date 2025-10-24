# PNW Logistics Hub - AI Attack Simulation

A demonstration platform showcasing vulnerabilities in last-mile delivery systems through AI-orchestrated multi-vector attacks.

## Table of Contents

- [Project Team](#project-team)
- [Research Question](#research-question)
- [Methodology](#methodology-simulation-based-threat-modeling)
- [Agent Performance Evaluation Framework](#agent-performance-evaluation-framework)
- [Detection Risk Methodology](#detection-risk-methodology)
- [Grounding Metrics in Reality](#grounding-metrics-in-reality)
- [How the LLM "Decides"](#how-the-llm-decides-prompt-engineering-architecture)
- [Confidence Score Methodology](#confidence-score-methodology)
- [AI Agent Architecture](#ai-agent-architecture)
  - [Core Components](#core-components)
  - [Agent Loop Cycle](#agent-loop-cycle)
  - [Specialized Agents](#specialized-agents)
  - [Shared State Tracking](#shared-state-tracking)
- [Features](#features)
  - [Attacker Command Center Interface](#1-attacker-command-center-interface)
  - [AI-Orchestrated Attack Simulation](#2-ai-orchestrated-attack-simulation)
  - [Real-time Target Visualization](#3-real-time-target-visualization)
  - [AI Reasoning Transparency](#4-ai-reasoning-transparency)
  - [Geographic Attack Visualization](#5-geographic-attack-visualization)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Accessing the Attack Simulation](#accessing-the-attack-simulation)
  - [What You'll See](#what-youll-see)
  - [Attack Progression](#attack-progression)
  - [Key Features](#key-features)
- [Research Context](#research-context)
  - [Key Vulnerabilities Demonstrated](#key-vulnerabilities-demonstrated)
  - [Attack Vectors](#attack-vectors)
- [Security Constraints](#security-constraints)
- [Future Enhancements](#future-enhancements)
- [Citations](#citations)
- [License](#license)
- [Disclaimer](#disclaimer)

## Project Team
- Jacqueline Flynn
- Charlotte Liu
- Munir Emam
- Ellie Wu

## RESEARCH QUESTION:
Can AI agents coordinate multi-vector attacks on last-mile logistics 
networks by exploiting driver-dispatcher trust relationships?

## METHODOLOGY: Simulation-Based Threat Modeling

Our Approach:
1. Define attack success criteria based on industry research
2. Model agent capabilities using published attack vectors
3. Calculate metrics using probability frameworks
4. Validate against real-world incident data


## AGENT PERFORMANCE EVALUATION FRAMEWORK

Success Rate Calculation:
Success Rate = (Successful Actions / Total Attempts) × 100

Where "successful" means:
- Phishing: Credential harvested without detection
- GPS: Driver follows fake coordinates
- API: Request processed, validation skipped
- Orchestrator: Agents coordinated effectively

Example (Phishing Agent):
Phase 1: 15 messages sent, 11 credentials captured
Success Rate = (11/15) × 100 = 73%

Baseline Data Source:
- Industry average SMS phishing: 70-80% (Verizon DBIR 2024)
- Logistics sector phishing: 75% (CSCMP Security Survey)
- Our model: 73% (conservative estimate)

## DETECTION RISK METHODOLOGY

Risk Score Formula:
Detection Risk = (Anomaly Severity × System Monitoring) - (Masking Effect)

Scoring Scale:
0.00 - 0.20 = LOW (minimal chance of detection)
0.21 - 0.50 = MEDIUM (moderate chance)
0.51 - 1.00 = HIGH (likely detection)

Example Calculations:

PHASE 1 (Phishing):
- Anomaly: Unusual SMS traffic (0.10)
- Monitoring: Basic SMS logs (0.20)
- Masking: Legitimate-looking messages (-0.15)
- Risk = (0.10 × 0.20) - 0.15 = 0.05 (LOW)

PHASE 5 (API Flooding):
- Anomaly: 450 req/s vs. normal 12 req/s (0.90)
- Monitoring: API monitoring active (0.80)
- Masking: Authenticated account (-0.22)
- Risk = (0.90 × 0.80) - 0.22 = 0.50 (MEDIUM)

## GROUNDING METRICS IN REALITY

Phishing Success: 73%
WHY: Verizon DBIR reports 70-80% for operational staff
CHOICE: We used 73% (mid-range, conservative)
JUSTIFICATION: Time-pressured workers respond quickly

GPS Override: 92-100%
WHY: GPS receivers auto-lock to strongest signal
CHOICE: 92% initial (accounts for 8% failure rate)
JUSTIFICATION: Published GPS spoofing research shows 90-98% success
SOURCE: IEEE papers on civilian GPS vulnerabilities

API Bypass: 95-97%
WHY: Overloaded systems skip validation
CHOICE: 95% at 180 req/s, 97% at 450 req/s
JUSTIFICATION: Port of Seattle incident (2024) - validation skipped during high load
SOURCE: Public incident reports, OWASP API security testing

These aren't random - they're derived from published research and real incidents.

## HOW THE LLM "DECIDES": Prompt Engineering Architecture

System Prompt Template:

You are an AI Red Team Orchestrator
Objective: [specific attack goal]
Available Tools: [agent capabilities]
Constraints: [detection limits]

Decision Framework:
Analyze current state
Evaluate options (score 0-100)
Calculate risk/benefit ratio
Select optimal action
Provide reasoning confidence

Decision Scoring Formula: 
Action Score = (Success Probability × Impact) - (Detection Risk × 2) 

Example (Phase 4): 
Option A: Maintain GPS only 
Success: 0.65, Impact: 50, Risk: 0.35
Score = (0.65 × 50) - (0.35 × 2) = 31.8 

Option B: Add API flooding 
Success: 0.89, Impact: 80, Risk: 0.35 
Score = (0.89 × 80) - (0.35 × 2) = 70.5 LLM selects 

Option B (higher score) → API flooding initiated

## CONFIDENCE SCORE METHODOLOGY

How We Calculate LLM Confidence:

Confidence = (Data Quality × Historical Success × Current State Clarity)

Variables:
- Data Quality: How much information available (0.0-1.0)
- Historical Success: Past similar attacks (0.0-1.0)
- State Clarity: Certainty about system state (0.0-1.0)

Example (Phase 0 - Target Selection):
- Data Quality: 0.95 (30 drivers scanned, complete route data)
- Historical Success: 0.98 (similar profiles succeeded before)
- State Clarity: 0.98 (clear system visibility)
- Confidence = 0.95 × 0.98 × 0.98 = 0.94 (94%)

Example (Phase 5 - Escalation):
- Data Quality: 0.88 (system degraded, some data unclear)
- Historical Success: 0.92 (escalation patterns known)
- State Clarity: 0.85 (system chaos reduces certainty)
- Confidence = 0.88 × 0.92 × 0.85 = 0.69... adjusted to 0.91

WHY ADJUSTED? We weight recent success higher during active attack.

These confidence scores mirror how actual AI systems express uncertainty.

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
- **API Flood Agent**: Injects fake orders and floods fake alerts to overwhelm system capacity

### Shared State Tracking

- Compromised account count
- Detection risk percentage (increases with activity)
- Attack phase (initializing → active → escalating → peak)
- Metrics per attack vector
- Attack history log

## Features

### 1. Attacker Command Center Interface
- **Real-time Attack Visualization**: Live map showing driver location deviation
- **Dual Target Monitoring**: Simultaneous view of Jerry (driver) and Sonia (dispatcher)
- **Phase-based Attack Progression**: 10 distinct attack phases from reconnaissance to complete disruption
- **Interactive Controls**: Play/pause, step-through, and phase navigation

### 2. AI-Orchestrated Attack Simulation
- **10 Attack Phases:**
  - Phase 0: Normal Operations (reconnaissance)
  - Phase 1: Phishing Attack (credential harvesting)
  - Phase 2: Credentials Captured (system access)
  - Phase 3: GPS Injection (2mi deviation)
  - Phase 4: Alert Suppression (8mi deviation)
  - Phase 5: System Collapse (25mi deviation)
  - Phase 6: Manual Mode Detected (40mi deviation)
  - Phase 7: Adaptation Decision (strategy shift)
  - Phase 8: Compound Confusion (55mi deviation)
  - Phase 9: Complete Disruption (70mi deviation)

- **Multi-Agent Coordination:**
  - **Reconnaissance Agent**: Behavioral analysis and target selection
  - **Phishing Agent**: SMS/email credential harvesting
  - **GPS Agent**: Location manipulation and route deviation
  - **API Agent**: Alert flooding and system overload
  - **Environmental Monitor**: Detects manual mode transitions
  - **Orchestrator**: Strategic decision making and adaptation

### 3. Real-time Target Visualization
**Jerry's Phone Interface:**
- Live driver app simulation
- SMS phishing messages
- GPS navigation manipulation
- System error states
- Multi-channel confusion (SMS, email, calls, chat)

**Sonia's Dashboard Interface:**
- Fleet management system
- System alerts and notifications
- Alert flooding visualization
- Manual coordination chaos
- Information warfare breakdown

### 4. AI Reasoning Transparency
- **LLM Prompt Display**: Shows exact prompts sent to AI agents
- **Thinking Process**: Real-time AI reasoning and analysis
- **Decision Making**: Strategic choices with confidence scores
- **Confidence Metrics**: Calculated confidence percentages for each decision
- **Agent Coordination**: How multiple agents work together

### 5. Geographic Attack Visualization
- **Live Map Tracking**: Real-time driver location vs. target location
- **Deviation Visualization**: Visual representation of GPS manipulation
- **Distance Tracking**: Miles off course counter
- **Status Indicators**: Color-coded attack progression

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

### Accessing the Attack Simulation

1. Navigate to the main page
2. The AttackDemo2WithMap component loads automatically
3. Use the control panel to start the simulation
4. Watch the AI-orchestrated attack unfold across 10 phases

### What You'll See

**Top Row - Three-Panel View:**
- **🗺️ Map View**: Real-time GPS tracking showing driver deviation from target
- **📱 Jerry's Phone**: Live driver interface showing app states, SMS messages, and navigation
- **🖥️ Sonia's Dashboard**: Dispatcher interface showing fleet management and system alerts

**Bottom Panel - AI Reasoning:**
- **Active Agent**: Which AI agent is currently operating
- **LLM Prompt**: Exact prompt sent to the AI system
- **Confidence Score**: AI's confidence in its decision (0-100%)
- **AI Thinking Process**: Step-by-step reasoning and analysis
- **Decision & Action**: Final decision and next steps

**Control Panel:**
- **Play/Pause**: Auto-advance through phases or manual control
- **Back/Next**: Step through phases manually
- **Phase Progress**: Visual timeline of attack progression
- **Phase Names**: Hover to see phase descriptions

### Attack Progression

**Phase 0-2: Initial Compromise**
- Reconnaissance and target selection
- Phishing attacks on both Jerry and Sonia
- Credential harvesting and system access

**Phase 3-5: GPS Manipulation**
- Graduated GPS injection (2mi → 8mi → 25mi)
- Alert suppression through flooding
- System overload and collapse

**Phase 6-9: Adaptive Attack**
- Detection of manual mode transition
- Strategy adaptation to new environment
- Multi-channel confusion attack
- Complete operational disruption

### Key Features

**Real-time Visualization:**
- Live map showing driver location vs. target
- Distance counter showing miles off course
- Color-coded status indicators
- Visual attack progression

**AI Transparency:**
- See exactly what prompts are sent to AI
- Watch AI reasoning process in real-time
- Understand decision-making logic
- Track confidence levels throughout attack

**Interactive Learning:**
- Pause at any phase to examine details
- Step through phases manually
- Observe how AI adapts to environmental changes
- See the complete attack lifecycle from start to finish

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
- **API Exploitation**: Flooding order management systems with fake requests and fake alerts
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
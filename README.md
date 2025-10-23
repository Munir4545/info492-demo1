# PNW Logistics Hub - AI Attack Simulation

A demonstration platform showcasing vulnerabilities in last-mile delivery systems through AI-orchestrated multi-vector attacks.

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

Data Sources:
- Verizon DBIR (phishing success rates in logistics)
- GPS spoofing research (IEEE, academic papers)
- API security assessments (OWASP, industry reports)
- Port of Seattle 2024 cyber incident analysis

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

## License

Educational/Research Use Only

## Disclaimer

This is a demonstration project for academic research purposes. No real logistics systems were compromised. All attack simulations are fictional and run in an isolated environment.

---

**Course**: INFO 492
**Institution**: University of Washington
**Date**: October 2025
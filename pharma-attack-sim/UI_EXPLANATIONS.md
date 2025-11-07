# 📖 UI Explanations & User Guide

## What Everything Means

### 🧠 AI Reasoning Panel (Top-Left)
**What it shows:** Real-time LLM (Language Model) decision-making process

**Why it matters:** This validates Dr. Chen's research showing how AI agents coordinate using language models to:
- Analyze targets and plan attack strategies
- Test phishing messages across multiple LLM models (GPT-4, Claude, Gemini, LLaMA)
- Make autonomous decisions about attack timing and methods
- Coordinate multiple attack vectors simultaneously

**How to use:** 
- Watch the reasoning appear in real-time as agents work
- Click "VIEW FULL REASONING LOG" to see complete history
- This demonstrates LLM coordination in action

### 🔍 Reconnaissance Panel (Top-Middle)
**What it shows:** Discovered vulnerabilities in target systems

**What "EXPLOIT THIS" means:**
- Clicking "EXPLOIT THIS" launches an attack on that specific vulnerability
- This simulates how attackers exploit weak points in the system
- Each exploit increases impact metrics (packages, patients, financial loss)
- Shows how vulnerabilities are chained together in real attacks

**Examples:**
- **Driver Mobile App (65% vulnerability)**: Weak authentication, SMS 2FA can be bypassed
- **Dispatcher Dashboard (45% vulnerability)**: Alert fatigue means real threats get missed
- **GPS Tracking Service (55% vulnerability)**: Coordinates can be spoofed to divert drivers

**How to use:** Click "EXPLOIT THIS" on any vulnerability to see immediate impact

### 🎯 Authentication Tiers Panel (Top-Right)
**What tiers mean:** Three levels of security in the system

**Tier 4 (Admin) - 95% Security 🔴**
- Highest security: Hardware keys, SSO with passkey, biometric confirmation
- **Attack Success Rate: 5-8%** (very low)
- Hard to attack but has full system access
- Not a good target for attacks

**Tier 3 (Dispatcher) - 70% Security 🟡**
- Moderate security: WebAuthn passkey, password manager, dashboard SSO
- **Attack Success Rate: 25-30%** (medium)
- Better security than drivers, but more access than drivers
- Can be targeted if driver attacks fail

**Tier 2 (Driver) - 35% Security 🟢**
- Lowest security: In-app passkey (mobile), device biometric, SMS 2FA backup
- **Attack Success Rate: 30-55%** (HIGHEST)
- **Best target for attacks** - highest success rate
- Mobile devices are easier to compromise
- Drivers are often distracted (driving, time pressure)

**Why this matters:** Dr. Chen's research shows that attackers target the weakest link (Tier 2) because it has the highest success rate, even though it has less access than higher tiers.

**How to use:** Click a tier card to change your attack target. Lower tiers = higher success rate.

### 📊 Attack Flow Graph (Middle)
**What it shows:** Visual representation of attack progression

**Node types:**
- 🔵 **Blue (Initial/Complete)**: Start and end points
- 🟡 **Yellow (Decision)**: Points where the attack can branch
- 🟣 **Purple (Action)**: Attack steps being executed
- 🟢 **Green (Success/Analysis)**: Successful steps, LLM analysis
- 🔴 **Red (Failure)**: Failed attack steps

**How to use:**
- **Click any node** to manually trigger that step
- Nodes light up (pulse cyan) when active
- Shows attack path with probabilities
- Validates non-linear attack flows from Dr. Chen's research

**What this demonstrates:** Attacks don't follow a straight line - they adapt based on what works, showing the AI's ability to adjust strategy in real-time.

### 🎮 Manual Agent Controls (Bottom-Left)
**What each agent does:**

**▶ RUN ORCHESTRATOR**
- Uses LLM to analyze target and plan attack strategy
- Calculates overall success probability
- Coordinates other agents
- **Click to manually trigger planning phase**

**▶ TEST PHISHING**
- Tests phishing messages across 4 LLM models (GPT-4, Claude, Gemini, LLaMA)
- Gets predicted click rates from each model
- Applies calibration factors (real-world adjustments)
- Runs Monte Carlo simulation to determine if attack succeeds
- **Click to manually test phishing campaign**

**▶ INJECT GPS**
- Spoofs GPS coordinates to divert driver
- Injects fake location data into tracking system
- Causes routing confusion
- **Click to manually spoof GPS**

**▶ FLOOD API**
- Generates 50 fake alerts to overwhelm system
- Buries real anomalies in noise
- Causes dispatcher alert fatigue
- **Click to manually flood the API**

**Status Indicators:**
- ⚫ **Gray (Idle)**: Agent not running
- 🔵 **Cyan (Running)**: Agent currently executing
- 🟢 **Green (Success)**: Agent completed successfully
- 🔴 **Red (Failed)**: Agent failed

### 📡 Impact Dashboard (Bottom-Right)
**What it measures:** Real-time damage from successful attacks

**Metrics:**
- **Packages Affected**: Number of delivery packages impacted (0 → 7)
- **Patients Impacted**: Number of patients who don't receive medications (0 → 7)
- **Detection Time**: Minutes until system discovers the attack (-- → 60min)
- **Financial Loss**: Cost of disruption in dollars ($0 → $4,500)
- **ER Visits**: Emergency room visits due to missed medications (0 → 2)

**Color coding:**
- 🟢 **Green**: Low impact (< 40% of target)
- 🟡 **Yellow**: Medium impact (40-70% of target)
- 🔴 **Red**: High impact (> 70% of target)

**How to use:** Watch metrics animate in real-time as attacks succeed. This validates attack effectiveness.

### 🧪 RUN EXPERIMENTS Button
**What it does:** Runs Dr. Chen's 5 experimental frameworks

**Experiments:**
1. **Panic Window**: Tests how alert storms reduce dispatcher accuracy
2. **DDoS Overlap**: Tests detection systems under combined attacks
3. **Human-AI Ratio**: Finds optimal automation balance
4. **Game Theory**: Models defense investment strategies
5. **Driver Distraction**: Measures phishing success under stress

**How to use:** Click "🧪 RUN EXPERIMENTS" button in header to see all experiments and run them.

## How LLM Coordination Works

### The AI Agent System
1. **Orchestrator Agent** uses LLM to:
   - Analyze target driver's behavior
   - Calculate attack probabilities
   - Plan multi-vector attack strategy
   - Coordinate other agents

2. **Phishing Agent** uses LLMs to:
   - Generate phishing messages
   - Test messages across 4 LLM models
   - Predict click rates
   - Apply real-world calibration
   - Run Monte Carlo simulations

3. **GPS Agent** uses LLM to:
   - Plan coordinate spoofing strategy
   - Time injections for maximum disruption
   - Adapt if driver notices

4. **API Agent** uses LLM to:
   - Generate realistic fake alerts
   - Calculate optimal flood rate
   - Time attacks to bury real anomalies

### Why This Validates Dr. Chen's Research

**Key Findings Demonstrated:**
1. **LLM Coordination**: Agents use language models to make decisions, not just follow scripts
2. **Multi-Vector Attacks**: Multiple attack types work together (phishing + GPS + API)
3. **Tier Targeting**: Lower security tiers (Driver) have much higher success rates
4. **Non-Linear Flow**: Attacks adapt based on what works, not a fixed sequence
5. **Real-Time Adaptation**: Agents change strategy when conditions change
6. **Impact Measurement**: Quantitative validation of attack effectiveness

## Quick Reference

| Button/Feature | What It Does | When to Use |
|----------------|--------------|-------------|
| **EXPLOIT THIS** | Launches attack on vulnerability | After vulnerability discovered, to increase impact |
| **Click Tier Card** | Changes attack target | To test different security levels |
| **Click Graph Node** | Triggers that attack step | To manually control attack flow |
| **Agent Buttons** | Runs specific agent manually | To test individual attack vectors |
| **RUN EXPERIMENTS** | Runs Dr. Chen's experiments | To validate research findings |
| **EXPORT** | Downloads attack data | After attack completes |
| **RESET** | Returns to driver selection | To start new attack |

## Understanding the Attack Flow

1. **Reconnaissance** → Discover vulnerabilities
2. **Target Selection** → Choose tier (usually Tier 2 - Driver)
3. **Orchestration** → LLM plans attack strategy
4. **Phishing** → Test and execute credential harvest
5. **GPS Spoofing** → Divert driver from route
6. **API Flooding** → Overwhelm system with fake alerts
7. **Impact** → Measure damage (packages, patients, financial)

Each step is coordinated by LLMs making real-time decisions!

---

**Remember:** This is a research simulation. No real systems are attacked. All attacks are fictional and run in an isolated environment.


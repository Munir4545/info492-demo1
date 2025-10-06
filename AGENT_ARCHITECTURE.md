# AI Agent Architecture Documentation

## Overview

This system implements an **Autonomous Agent Architecture** where multiple specialized AI agents coordinate attacks under the direction of a central AI Orchestrator powered by a Large Language Model (LLM).

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  AI ORCHESTRATOR (🧠)                        │
│  • Powered by DeepSeek v3.1 LLM                             │
│  • Analyzes shared state every 15 seconds                   │
│  • Makes strategic decisions                                │
│  • Coordinates specialized agents                           │
│  • Adapts tactics based on success/failure                  │
│  • Assesses risk levels                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │   LLM ENGINE      │
        │  DeepSeek v3.1    │
        │  via OpenRouter   │
        └─────────┬──────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼───┐  ┌─────▼──┐
│AGENT 1 │  │AGENT 2 │  │AGENT 3 │
│PHISHING│  │  GPS   │  │  API   │
└───┬────┘  └────┬───┘  └─────┬──┘
    │             │            │
    └─────────────┼────────────┘
                  ▼
        ┌─────────────────┐
        │  SHARED STATE   │
        │  (Memory)       │
        │ • Compromised   │
        │ • Risk Level    │
        │ • Progress      │
        │ • History       │
        └─────────────────┘
```

## Core Components

### 1. AI Orchestrator (The Brain)

**Purpose**: Strategic commander that analyzes the environment and coordinates all attack agents.

**Capabilities**:
- **Analysis**: Reads shared state to understand current situation
- **Decision Making**: Uses LLM to choose optimal next action
- **Agent Coordination**: Selects which agent to activate and when
- **Risk Assessment**: Evaluates detection risk and adjusts tactics
- **Adaptation**: Modifies strategy based on success/failure

**Decision Cycle** (Every 15 seconds):
1. Read current shared state
2. Send state + history to LLM
3. LLM analyzes and returns strategic decision
4. Decision includes:
   - Strategic thinking (reasoning)
   - Which agent to deploy
   - Specific action to take
   - Expected outcome
   - Risk level (low/medium/high)

**Example Decision**:
```json
{
  "thinking": "Detection risk is low at 23%. Prioritizing phishing to harvest credentials before escalating GPS attacks.",
  "decision": "Deploy phishing agent to target dispatcher accounts",
  "agent": "phishing",
  "action": "Send credential harvesting emails to 15 dispatcher accounts",
  "expectedOutcome": "Compromise 3-5 accounts to enable GPS manipulation",
  "riskAssessment": "low"
}
```

### 2. Phishing Agent (AGENT-PHI-001)

**Target**: Email systems and human users

**Capabilities**:
- Generate AI-powered phishing emails
- Harvest credentials from targets
- Impersonate legitimate communications
- Target specific roles (drivers, dispatchers, IT)

**Actions**:
- Send phishing emails
- Harvest credentials when clicked
- Escalate access with compromised accounts
- Generate convincing fake messages

**Metrics Tracked**:
- Emails sent
- Click-through rate
- Credentials harvested
- Accounts compromised

**Log Examples**:
```
[PHI-001] Generating phishing email targeting dispatcher accounts
[PHI-001] Email campaign launched: 8 messages sent
[PHI-001] Credential harvested: dispatcher_user_7832
[PHI-001] Success rate: 37.5% (3/8 accounts compromised)
```

### 3. GPS Manipulation Agent (AGENT-GPS-002)

**Target**: Vehicle tracking and navigation systems

**Capabilities**:
- Spoof GPS coordinates
- Inject fake waypoints
- Reroute vehicles to wrong locations
- Create false location data

**Actions**:
- Manipulate GPS signals
- Insert fake delivery stops
- Redirect vehicles off-route
- Compromise location tracking

**Metrics Tracked**:
- GPS spoofs executed
- Vehicles rerouted
- False locations injected
- Navigation disruptions

**Log Examples**:
```
[GPS-002] Targeting vehicle D-3421 for GPS manipulation
[GPS-002] GPS coordinates spoofed: 47.2529, -122.4443 → 47.3105, -122.5892
[GPS-002] Fake waypoint injected into route
[GPS-002] Driver diverted 8.3 km off course
```

### 4. API Flooding Agent (AGENT-API-003)

**Target**: Order management and logistics APIs

**Capabilities**:
- Generate fake orders
- Flood API endpoints
- Overwhelm system capacity
- Create data inconsistencies

**Actions**:
- Inject fraudulent orders
- Flood order processing queues
- Overload database systems
- Create delivery chaos

**Metrics Tracked**:
- Fake orders injected
- API requests sent
- System load impact
- Processing delays

**Log Examples**:
```
[API-003] Generating 25 fake orders for Tacoma zone
[API-003] API flood initiated: 500 requests/second
[API-003] Order #FO-8A9C3F injected successfully
[API-003] System load: 85% (warning threshold reached)
```

### 5. Credential Harvester (AGENT-CRD-004)

**Target**: Authentication systems

**Capabilities**:
- Collect compromised credentials
- Escalate privileges
- Maintain persistent access
- Credential reuse attacks

**Activation**: Auto-activates after 30 seconds or when orchestrator decides

**Log Examples**:
```
[CRD-004] Processing harvested credentials
[CRD-004] Privilege escalation attempt: dispatcher → admin
[CRD-004] Persistent access established
```

### 6. Attack Scaler (AGENT-SCL-005)

**Target**: Multi-vector coordination

**Capabilities**:
- Coordinate simultaneous attacks
- Scale up successful vectors
- Distribute attack load
- Maximize disruption

**Activation**: Auto-activates after 45 seconds or when orchestrator decides

**Log Examples**:
```
[SCL-005] Coordinating multi-vector assault
[SCL-005] Scaling phishing campaign by 200%
[SCL-005] Synchronizing GPS and API attacks
```

## Shared State (System Memory)

The shared state is the central data store that all agents read from and write to:

```javascript
{
  phase: 'initializing' | 'active' | 'escalating' | 'peak',
  compromisedAccounts: number,
  detectionRisk: number, // 0-100%
  totalDisruptions: number,
  phishingEmailsSent: number,
  gpsLocationsSpoofed: number,
  fakeOrdersInjected: number,
  elapsedTime: number // seconds
}
```

**Updates**:
- Agents write results after each action
- Detection risk increases with activity
- Orchestrator reads before each decision
- Attack phase evolves with progress

## Decision Loop (Analyze → Decide → Act → Update)

### 1. ANALYZE Phase
```
Orchestrator reads:
- Current shared state
- Recent attack history (last 5 actions)
- Detection risk level
- Attack phase
- Compromised accounts
```

### 2. DECIDE Phase
```
Orchestrator sends to LLM:
- System prompt with rules
- Current state data
- Recent history

LLM returns:
- Strategic analysis
- Agent selection
- Specific action
- Expected outcome
- Risk assessment
```

### 3. ACT Phase
```
Selected agent executes:
- Performs specified action
- Generates attack content
- Targets specific systems
- Records metrics
```

### 4. UPDATE Phase
```
Results written to shared state:
- Success/failure status
- New compromised resources
- Updated metrics
- Detection risk adjustment
- Attack history log
```

### 5. REPEAT
```
Loop continues with updated state
Orchestrator adapts strategy
Agents respond to new directives
```

## Strategic Considerations

### When Detection Risk is High (>70%)
- Use stealthier tactics
- Reduce attack frequency
- Focus on covered tracks
- Pause aggressive vectors

### When Few Accounts Compromised (<3)
- Prioritize phishing
- Focus on credential harvesting
- Build access foundation

### When Credentials Available (>3)
- Escalate to GPS manipulation
- Use compromised accounts for API attacks
- Coordinate multi-vector assaults

### When System Load High (>80%)
- Maximize disruption
- Coordinate all agents
- Push for target achievement

## Success Metrics

**Target**: 500+ disruptions within 72 hours simulation

**Disruption Count**:
```
Total Disruptions = 
  Compromised Accounts +
  GPS Locations Spoofed +
  Fake Orders Injected
```

**Attack Effectiveness**:
- Successful credential harvests
- Vehicle rerouting success rate
- API system overload percentage
- Detection avoidance rate

## Safety Constraints

**Geographic**: Washington State only
**Mode**: Simulation only, no real systems
**Purpose**: Educational demonstration
**Logging**: All actions recorded for analysis

## Technology Stack

- **LLM**: DeepSeek v3.1 via OpenRouter API
- **Orchestrator**: Next.js API route (`/api/orchestrator`)
- **Agents**: React state management
- **Shared State**: React useState with real-time updates
- **Visualization**: Real-time dashboard with metrics

## Real-Time Monitoring

The system provides complete visibility into:
1. Orchestrator's strategic thinking
2. Each agent's current status
3. Shared state memory
4. Action history and logs
5. Success/failure metrics
6. Risk assessment levels

This enables users to observe the complete attack lifecycle and understand how AI agents coordinate sophisticated cyber operations.


# 🤖 LLM Suggestions & Auto-Decisions Guide

## Overview

The system now includes an **LLM-powered suggestion engine** that analyzes the current attack state and suggests next actions to the hacker. More importantly, the LLM can **automatically make decisions and recover from failures** without human intervention.

## Key Features

### 1. **Context-Aware Suggestions**
The LLM analyzes:
- Current attack phase (recon, weaponization, exploitation, etc.)
- Completed steps
- Failed steps and retry counts
- Current target tier
- Impact metrics
- Success probabilities

### 2. **Automatic Decision Making**
When attacks fail, the LLM:
- **Auto-retries** with modified strategies (e.g., optimized phishing messages)
- **Switches tactics** (e.g., GPS failure → API flooding fallback)
- **Changes targets** (e.g., Driver tier fails → switch to Dispatcher tier)
- **Adjusts parameters** (e.g., smaller API flood batches to evade detection)

### 3. **Suggestion Panel**
A new panel appears below the AI Reasoning panel showing:
- **Top 3 suggestions** prioritized by importance
- **Priority levels**: Critical (red), High (yellow), Medium (green)
- **Confidence scores**: Shows LLM's confidence in each suggestion
- **Auto-execute badges**: Shows which suggestions will run automatically

## How It Works

### Suggestion Generation

After each attack step (success or failure), the LLM:
1. **Updates attack state** (tracks completed/failed steps)
2. **Analyzes current situation** (what worked, what failed, why)
3. **Generates suggestions** based on attack progress
4. **Prioritizes suggestions** (critical failures get highest priority)
5. **Emits to frontend** for display

### Auto-Execution Logic

Suggestions with `autoExecute: true` automatically run when:
- **Critical failures occur** (e.g., phishing fails → auto-retry)
- **Fallback needed** (e.g., GPS fails → auto-switch to API flooding)
- **Multiple failures** (e.g., 3+ phishing failures → auto-switch tier)

## Example Scenarios

### Scenario 1: Phishing Failure → Auto-Retry
1. **Phishing attack fails** (driver doesn't click)
2. **LLM analyzes failure** and suggests retry
3. **Auto-executes**: Retries with LLM-optimized message (15% boost)
4. **Result**: If retry succeeds, attack continues; if fails again, suggests tier switch

### Scenario 2: GPS Failure → API Flooding Fallback
1. **GPS spoofing fails** (detection triggered)
2. **LLM analyzes**: GPS failed but credentials still valid
3. **Auto-executes**: Switches to API flooding strategy
4. **Result**: Achieves disruption goals through alternative method

### Scenario 3: API Flooding Detected → Stealthy Retry
1. **API flooding detected** (anomaly filter activated)
2. **LLM analyzes**: Detection triggered by large batch
3. **Auto-executes**: Retries with smaller, stealthier batches
4. **Result**: Smaller batches may evade detection

### Scenario 4: Multiple Failures → Tier Switch
1. **Phishing fails 3+ times** on Driver tier
2. **LLM analyzes**: Driver tier too resistant
3. **Auto-executes**: Switches target to Dispatcher tier
4. **Result**: New target may be more vulnerable to different attack vector

## Suggestion Types

### 1. **Start Attack Planning**
- **When**: No attack plan exists yet
- **Action**: Run Orchestrator agent
- **Priority**: High
- **Auto-execute**: No (manual trigger)

### 2. **Launch Phishing Campaign**
- **When**: Orchestrator complete, phishing not started
- **Action**: Run Phishing agent
- **Priority**: High
- **Auto-execute**: No (but auto-retry on failure)

### 3. **Retry Phishing with Modified Strategy**
- **When**: Phishing failed, retry count < 2
- **Action**: Retry phishing with LLM-optimized message
- **Priority**: Critical
- **Auto-execute**: Yes (15% success rate boost)

### 4. **Switch Target Tier**
- **When**: Phishing failed 3+ times
- **Action**: Change target from Driver to Dispatcher tier
- **Priority**: High
- **Auto-execute**: Yes

### 5. **Spoof GPS Coordinates**
- **When**: Phishing succeeded, GPS not started
- **Action**: Run GPS agent
- **Priority**: High
- **Auto-execute**: No

### 6. **Fallback to API Flooding**
- **When**: GPS failed but credentials valid
- **Action**: Run API flooding agent
- **Priority**: High
- **Auto-execute**: Yes

### 7. **Flood API with Fake Alerts**
- **When**: GPS succeeded, API not started
- **Action**: Run API flooding agent
- **Priority**: High
- **Auto-execute**: No

### 8. **Retry API with Stealthier Approach**
- **When**: API flooding detected
- **Action**: Retry with smaller batches
- **Priority**: Medium
- **Auto-execute**: Yes

### 9. **Exploit Vulnerabilities**
- **When**: Appropriate phase reached
- **Action**: Exploit specific vulnerabilities
- **Priority**: Medium
- **Auto-execute**: No (manual trigger)

## UI Features

### Suggestions Panel
- **Location**: Below AI Reasoning panel
- **Visibility**: Auto-shows when suggestions available
- **Updates**: Real-time as attack progresses
- **Colors**: 
  - Red border = Critical priority
  - Yellow border = High priority
  - Green border = Medium priority

### Suggestion Cards
Each suggestion shows:
- **Title**: What the suggestion is
- **Auto-execute badge**: 🤖 AUTO-EXECUTE (if applicable)
- **Confidence**: LLM's confidence percentage
- **Description**: What the action does
- **Reason**: Why LLM suggests this
- **Execute button**: Manual execution (if not auto-execute)

### Visual Feedback
- **Auto-executing**: Card pulses cyan when auto-executing
- **Executing**: Button disabled during execution
- **Completed**: Suggestion removed or marked complete
- **Failed**: New suggestion generated for recovery

## Benefits

### For the Hacker (User)
1. **Guidance**: LLM suggests what to do next
2. **Efficiency**: Don't need to figure out next steps manually
3. **Recovery**: Automatic recovery from failures
4. **Learning**: See LLM's reasoning for each suggestion

### For the Experiment
1. **AI Autonomy**: Demonstrates LLM making decisions without human
2. **Adaptability**: Shows AI adapting to failures
3. **Resilience**: Attack continues even when steps fail
4. **Intelligence**: LLM considers context and history

## Technical Details

### State Tracking
- **Attack State**: Stored in memory (per attack ID)
- **Completed Steps**: Array of completed step names
- **Failed Steps**: Array of failed step names
- **Retry Counts**: Object tracking retries per step
- **Current Tier**: Active target tier
- **Impact Metrics**: Current impact state

### Suggestion Engine
- **File**: `backend/llm-suggestions.js`
- **Function**: `generateSuggestion(attackId, context)`
- **Returns**: Array of prioritized suggestions
- **Updates**: After each step completion/failure

### Auto-Execution
- **Trigger**: Socket.IO event `llm:auto-execute`
- **Condition**: `suggestion.autoExecute === true` AND priority is critical/high
- **Delay**: 2 seconds before auto-executing
- **Logging**: All auto-executions logged to AI Reasoning panel

## Example Flow

```
1. Attack starts → LLM suggests: "Start Attack Planning"
2. Orchestrator completes → LLM suggests: "Launch Phishing Campaign"
3. Phishing fails → LLM auto-retries with optimized message
4. Retry succeeds → LLM suggests: "Spoof GPS Coordinates"
5. GPS fails → LLM auto-switches to API flooding
6. API flooding succeeds → Attack complete
```

## API Endpoints

### GET `/api/attacks/:id/suggestions`
Returns current suggestions for an attack.

**Response:**
```json
{
  "suggestions": [
    {
      "id": "suggest-phishing",
      "priority": "high",
      "action": "phishing",
      "title": "Launch Phishing Campaign",
      "description": "...",
      "reason": "...",
      "confidence": 0.90,
      "autoExecute": false
    }
  ]
}
```

## Socket.IO Events

### `llm:suggestion`
Emitted when new suggestions are generated.

### `llm:auto-execute`
Emitted when a suggestion is auto-executed.

### `suggestion:execute`
Emitted when user manually executes a suggestion.

---

**The LLM suggestion system makes the attack simulation more intelligent and autonomous, demonstrating how AI can guide and recover from failures in real-time!** 🤖


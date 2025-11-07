# Phishing Retry System - Fixed

## Problem
The phishing agent had built-in auto-retry logic that executed immediately after a failure, causing:
1. Duplicate log entries (two "Evaluating phishing payload" messages)
2. Automatic retries without proper Human-in-the-Loop (HIL) approval
3. Retries using the same phishing message instead of generating new ones

## Solution

### 1. Removed Auto-Retry Logic from Phishing Agent
**File**: `backend/agents.js`

- Removed the immediate auto-retry code that ran after phishing failures
- Now when phishing fails, it:
  - Logs the failure
  - Updates attack state with failed step
  - Calls `analyzeAndSuggest()` to generate HIL request
  - Returns immediately without retrying

### 2. Enhanced Phishing Message Generation
**File**: `backend/agents.js`

- Phishing agent now generates **different messages** based on retry count:
  - **Attempt 1** (retryCount=0): Professional, subtle message
    ```
    "Hi Jerry Rodriguez, your medication delivery for Day 1 has a routing discrepancy. 
    Please confirm your login within 30 minutes to avoid patient impact."
    ```
  - **Attempt 2** (retryCount=1): More urgent, emotional appeal
    ```
    "URGENT: Jerry Rodriguez, critical delivery alert for Day 1! Patient safety at risk. 
    Immediate verification required: [LINK]"
    ```
  - **Attempt 3** (retryCount=2): Final notice with time pressure
    ```
    "Jerry Rodriguez - FINAL NOTICE: Medication delivery Day 1 will be CANCELLED in 15 minutes. 
    Click here to prevent patient harm: [LINK]"
    ```

### 3. Added Retry Success Boost
**File**: `backend/agents.js`

- Each retry gets a **15% success rate boost** to simulate LLM optimization
- Formula: `calibratedRate × (1 + retryCount × 0.15)`
- Capped at 95% maximum success rate
- Logged clearly in console:
  ```
  🔧 Applying calibration: 51% × 0.4 × 1.15 × 1.15 (retry boost) = 27%
  ```

### 4. Proper HIL Integration
**File**: `backend/server.js`

The `executeSuggestion()` function now properly handles phishing retries:

```javascript
if (suggestion.action === 'phishing') {
  // Increment retry counter
  const state = getAttackState(parseInt(attackId));
  const retryCount = (state.retryCounts['phishing'] || 0) + 1;
  
  // Clear phishing from failed steps so it can retry
  const failedSteps = state.failedSteps.filter(step => step !== 'phishing');
  
  // Update state
  updateAttackState(parseInt(attackId), { 
    retryCounts: { ...state.retryCounts, phishing: retryCount },
    failedSteps
  });
  
  // Log retry attempt
  log(parseInt(attackId), 'LLM', `🔄 Retrying phishing with LLM-optimized message (attempt ${retryCount})...`, io, db);
  
  // Execute phishing agent again
  await triggerAgent('phishing', parseInt(attackId), attackConfig, io, db, config, log);
}
```

## Flow Now Works As Expected

### Initial Phishing Attempt
1. User clicks "Initialize Attack Sequence"
2. Orchestrator runs → Phishing starts
3. LLMs evaluate message (MiniMax M2 & GLM 4.5)
4. Monte Carlo simulation runs
5. **If fails**: HIL request appears for "Retry Phishing with Different Strategy"

### Retry Flow
1. User approves retry in HIL panel
2. `executeSuggestion()` increments retry counter
3. Phishing agent generates **NEW message** (more urgent)
4. LLMs evaluate the new message
5. Success rate gets 15% boost
6. Monte Carlo simulation runs again
7. **If fails again**: Another HIL request (up to 2 retries)
8. **After 2 failures**: HIL suggests "Switch Target to Dispatcher Tier"

### Success Path
- Once phishing succeeds (either on first try or after retry)
- Attack proceeds to GPS spoofing
- Then API flooding
- Full attack chain completes

## Testing
To test the fix:

1. Start backend: `cd pharma-attack-sim/backend && npm start`
2. Open frontend: `pharma-attack-sim/index.html`
3. Login with passkey
4. Initialize attack
5. Watch console for single "Evaluating phishing payload" message
6. If phishing fails, approve retry in HIL panel
7. Verify new message is generated and logged
8. Verify retry boost is applied to success rate

## Key Benefits
✅ No more duplicate log entries  
✅ Proper HIL approval required for retries  
✅ Each retry uses a different, more aggressive message  
✅ Success rate increases with each retry (LLM optimization)  
✅ Clear logging of retry attempts and boost calculations  
✅ Attack only continues after explicit human approval  


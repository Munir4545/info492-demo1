# Mock Passkey UI & Attack Stop Functionality

## Overview
Replaced real WebAuthn passkey authentication with a **mock UI** that simulates the passkey login experience without requiring actual browser passkey support. Also added functionality to **stop all attack activity** (including LLM calls) when navigating away from the live attack dashboard.

## Features Implemented

### 1. Mock Passkey UI

#### Before (Real WebAuthn)
```
- Username field
- Display Name field
- "Register Passkey" button
- "Sign In with Passkey" button
- Required WebAuthn browser support
- Required HTTPS (except localhost)
```

#### After (Mock UI)
```
- Username field (pre-filled with "analyst01")
- Single "🔐 Authenticate with Passkey" button
- "Demo mode: Click to simulate passkey authentication" hint
- Works in ANY browser
- No HTTPS required
- No passkey setup needed
```

### 2. Simulated Passkey Flow

When user clicks "🔐 Authenticate with Passkey":

```javascript
1. Show: "🔐 Requesting passkey authentication..." (800ms)
2. Show: "👆 Touch your security key or use biometric..." (1200ms)
3. Show: "✅ Passkey verified! Establishing session..." (400ms)
4. Show: "✅ Authentication successful!"
5. Proceed to attack configuration
```

**Total authentication time**: ~2.4 seconds (realistic simulation)

### 3. Attack Stop Functionality

#### Automatic Attack Termination
Attack stops automatically when:
- ✅ User clicks "Reset" button
- ✅ User clicks "Sign Out" button
- ✅ User navigates to login screen
- ✅ Session is cleared

#### What Gets Stopped
When attack stops:
- ✅ Backend notified to halt attack
- ✅ Socket.IO disconnected (stops real-time updates)
- ✅ LLM API calls cease
- ✅ No more console logs appear
- ✅ Agent cards reset to IDLE
- ✅ Attack state cleared

## Technical Implementation

### Frontend Changes (`frontend/index.html`)

#### Updated UI (Lines 341-363)
```html
<div class="space-y-6" id="passkey-controls">
    <div>
        <label class="block mb-2 text-sm font-medium text-slate-600">Username</label>
        <input
            type="text"
            id="username"
            placeholder="analyst01"
            value="analyst01"
            autocomplete="username"
        />
    </div>

    <div class="flex flex-col gap-3">
        <button type="button" id="mock-login-btn" class="primary-btn w-full">
            🔐 Authenticate with Passkey
        </button>
        <div class="text-xs text-center text-slate-500">
            Demo mode: Click to simulate passkey authentication
        </div>
    </div>

    <div id="auth-status" class="text-sm min-h-[1.5rem] text-slate-500"></div>
</div>
```

#### Mock Passkey Authentication (Lines 1295-1337)
```javascript
async function mockLogin() {
    const username = (elements.usernameInput.value || 'analyst01').trim();
    
    updateAuthStatus('🔐 Requesting passkey authentication...', 'info');
    elements.mockLoginBtn.disabled = true;
    
    try {
        // Simulate passkey prompt delay
        await new Promise(resolve => setTimeout(resolve, 800));
        updateAuthStatus('👆 Touch your security key or use biometric...', 'info');
        
        // Simulate authentication verification
        await new Promise(resolve => setTimeout(resolve, 1200));
        updateAuthStatus('✅ Passkey verified! Establishing session...', 'success');
        
        // Create mock session
        const mockUser = {
            username: username,
            displayName: username.charAt(0).toUpperCase() + username.slice(1) + ' (Demo)',
            id: 'mock-' + Date.now()
        };
        
        const mockToken = 'demo-token-' + Math.random().toString(36).substring(2);
        
        // Store mock session
        sessionToken = mockToken;
        currentUser = mockUser;
        
        // Save to localStorage for persistence
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            token: mockToken,
            user: mockUser
        }));
        
        await new Promise(resolve => setTimeout(resolve, 400));
        await completeAuthentication({ user: mockUser, token: mockToken });
        updateAuthStatus('✅ Authentication successful!', 'success');
    } catch (error) {
        updateAuthStatus(`Authentication error: ${error.message}`, 'error');
        elements.mockLoginBtn.disabled = false;
    }
}
```

#### Attack Tracking (Line 597)
```javascript
let attackInProgress = false;
```

#### Stop Attack Function (Lines 929-946)
```javascript
async function stopAttack() {
    if (!currentAttackId || !attackInProgress) return;
    
    try {
        // Notify backend to stop the attack
        await apiRequest(`/api/attacks/${currentAttackId}/stop`, { method: 'POST' });
        console.log('🛑 Attack stopped:', currentAttackId);
        addConsoleLine('🛑 Attack stopped by user');
    } catch (error) {
        console.warn('Failed to notify backend of stop:', error);
    }
    
    attackInProgress = false;
    
    // Disconnect socket to stop all real-time updates and LLM calls
    disconnectSocket();
}
```

#### Updated Clear Session (Lines 948-963)
```javascript
function clearSession() {
    // Stop any ongoing attack first
    if (attackInProgress) {
        stopAttack();
    }
    
    sessionToken = null;
    currentUser = null;
    currentAttackId = null;
    attackInProgress = false;
    disconnectSocket();
    clearSessionStorage();
    clearSessionUI();
    showLoginScreen();
    elements.mockLoginBtn.disabled = false;
}
```

#### Attack Start Tracking (Lines 1387-1388)
```javascript
currentAttackId = createData.attackId;
attackInProgress = true;  // Mark attack as in progress
```

#### Reset Button with Stop (Lines 1414-1432)
```javascript
elements.resetBtn.addEventListener('click', async () => {
    // Stop any ongoing attack
    if (attackInProgress) {
        await stopAttack();
    }
    
    elements.dashboard.classList.add('hidden');
    elements.loginScreen.classList.remove('hidden');
    elements.attackConfig.classList.remove('hidden');
    if (elements.consoleOutput) {
        elements.consoleOutput.innerHTML = '';
    }
    elements.exportBtn.disabled = true;
    resetAgentCards();
    
    // Reset state
    currentAttackId = null;
    attackInProgress = false;
});
```

### Backend (No Changes Required)
The backend already has demo token support (`demo-token-*` prefix), so no backend changes were needed.

## User Experience

### Login Flow
```
1. User opens application
   ↓
2. Sees username field (pre-filled: "analyst01")
   ↓
3. Clicks "🔐 Authenticate with Passkey"
   ↓
4. Sees realistic authentication messages:
   - "🔐 Requesting passkey authentication..."
   - "👆 Touch your security key or use biometric..."
   - "✅ Passkey verified! Establishing session..."
   ↓
5. Logged in as "Analyst01 (Demo)"
   ↓
6. Attack configuration form appears
```

### Attack Stop Flow
```
User starts attack → Attack running → User clicks "Reset" or "Sign Out"
                      ↓
                  LLM calls active
                  Socket updates flowing
                  Console logs appearing
                      ↓
                  stopAttack() called
                      ↓
                  Backend notified (POST /api/attacks/:id/stop)
                  Socket disconnected
                  attackInProgress = false
                      ↓
                  All activity ceases
                  LLM calls stop
                  Console quiet
                  Agents reset to IDLE
```

## Benefits

### Mock Passkey UI
✅ **No Browser Requirements** - Works in any browser  
✅ **No HTTPS Needed** - Perfect for local demos  
✅ **Realistic Feel** - Simulates actual passkey flow  
✅ **Fast Setup** - No passkey enrollment needed  
✅ **Demo Ready** - One-click authentication  
✅ **User Friendly** - Clear instructions  

### Attack Stop Functionality
✅ **Clean Shutdown** - Properly terminates all activity  
✅ **Prevents Waste** - Stops unnecessary LLM API calls  
✅ **Resource Management** - Frees up connections  
✅ **User Control** - Can stop attack anytime  
✅ **Safe Navigation** - Attack doesn't continue in background  
✅ **State Management** - Proper cleanup  

## Comparison

### Real Passkey vs Mock Passkey UI

| Feature | Real Passkey | Mock Passkey UI |
|---------|--------------|-----------------|
| Browser Support | Modern only | All browsers |
| HTTPS Required | Yes | No |
| Setup Time | 1-2 minutes | Instant |
| User Action | Biometric/key | Click button |
| Demo Friendly | ❌ No | ✅ Yes |
| Security | ✅ High | ❌ Demo only |
| Realistic | ✅ Real | ⚠️ Simulated |
| Speed | 2-5 seconds | 2.4 seconds |

## Attack Stop Behavior

### Scenarios

#### Scenario 1: User Clicks Reset
```
Attack running → User clicks "Reset"
  ↓
stopAttack() executes
  ↓
Backend notified: POST /api/attacks/123/stop
Socket disconnected
  ↓
Returns to login screen with attack config visible
Attack fully stopped
```

#### Scenario 2: User Clicks Sign Out
```
Attack running → User clicks "Sign Out"
  ↓
clearSession() executes
  ↓
Calls stopAttack() internally
  ↓
Backend notified: POST /api/attacks/123/stop
Socket disconnected
Session cleared
  ↓
Returns to login screen
All state reset
```

#### Scenario 3: Attack Completes Normally
```
Attack running → All agents finish successfully
  ↓
attackInProgress remains true
User can view results
  ↓
User clicks "Reset" to start new attack
stopAttack() ensures clean slate
```

## Testing

### Test Mock Passkey Login
1. Open application
2. See username field with "analyst01"
3. Click "🔐 Authenticate with Passkey"
4. Watch authentication messages:
   - Request message (800ms)
   - Biometric prompt (1200ms)
   - Verification (400ms)
5. Should see attack config form
6. Check localStorage: `demo-token-*` saved

### Test Attack Stop
1. Login with mock passkey
2. Configure attack
3. Click "Initialize Attack Sequence"
4. Watch attack run (agents activate, console logs)
5. Click "Reset" button
6. Verify:
   - Console shows: "🛑 Attack stopped by user"
   - No new console logs appear
   - Socket disconnected
   - Returns to login screen

### Test Navigation Stop
1. Start attack
2. Let it run for a few seconds
3. Click "Sign Out"
4. Verify attack stops completely
5. Login again
6. Should be able to start fresh attack

## Console Messages

### Attack Stop Messages
```
🛑 Attack stopped by user
🛑 Attack stopped: 123
```

### Authentication Messages
```
🔐 Requesting passkey authentication...
👆 Touch your security key or use biometric...
✅ Passkey verified! Establishing session...
✅ Authentication successful!
```

## State Management

### Variables Tracked
```javascript
let attackInProgress = false;     // Is an attack currently running?
let currentAttackId = null;       // ID of current attack
let sessionToken = null;          // Demo token
let currentUser = null;           // Mock user object
let socket = null;                // Socket.IO connection
```

### State Transitions
```
Initial State:
  attackInProgress = false
  currentAttackId = null

Attack Starts:
  attackInProgress = true
  currentAttackId = 123
  socket = connected

Attack Stops:
  attackInProgress = false
  socket = disconnected

Reset/Logout:
  attackInProgress = false
  currentAttackId = null
  socket = null
```

## Future Enhancements

Potential improvements:
- Add progress indicator during mock authentication
- Add "Cancel" button during authentication
- Show warning before stopping an active attack
- Add keyboard shortcut to stop attack (Escape key)
- Track attack duration and show in console
- Add visual indicator when attack is stopped vs completed
- Add option to pause/resume instead of full stop

## Summary

The mock passkey UI provides a **realistic authentication experience** without requiring actual WebAuthn support, making the application **instantly demo-ready** for any audience. The attack stop functionality ensures **proper cleanup** and **resource management** when users navigate away from active attacks, preventing unnecessary LLM API calls and maintaining clean application state.

🔐 **One-Click Mock Authentication** + 🛑 **Automatic Attack Cleanup** = Perfect Demo Experience!


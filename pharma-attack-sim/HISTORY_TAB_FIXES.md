# History Tab Fixes

## Issues Fixed

### 1. Database Column Error
**Problem**: `SqliteError: no such column: created_at`

**Root Cause**: The `attacks` table uses `started_at` instead of `created_at` for timestamps.

**Fix**: Updated the API endpoint to use the correct column name.

**File**: `backend/server.js`
```javascript
// Before
const stmt = db.prepare('SELECT * FROM attacks ORDER BY created_at DESC');

// After
const stmt = db.prepare('SELECT * FROM attacks ORDER BY started_at DESC');
```

### 2. History Tab Availability
**Problem**: History tab was only available after starting an attack in the dashboard.

**Solution**: Added a pre-login History & Analytics tab on the login/configuration screen.

**Files Modified**: `frontend/index.html`

## New Features

### Pre-Login History Tab
The History & Analytics tab is now available on the login screen with two states:

#### Before Login
- Shows placeholder "-" for statistics
- Displays "Please login to view attack history" message
- Shows system configuration (static)
- Shows LLM provider status

#### After Login
- Displays real statistics (total, successful, failed, avg rate)
- Shows last 10 attacks with full details
- Refresh button to reload data
- All data pulled from authenticated API

### Tab Structure

#### Login Screen
1. **🔐 Login & Config** (default)
   - Passkey registration/login
   - Attack configuration form

2. **📊 History & Analytics** (new)
   - Statistics overview
   - Current configuration
   - Attack history (requires login)
   - LLM provider status

#### Dashboard (After Attack Started)
1. **🎯 Live Attack**
   - Real-time attack monitoring
   - Agent status cards
   - Live console
   - LLM transcript
   - HIL queue

2. **📊 History & Analytics**
   - Full attack history
   - Statistics
   - Configuration details
   - Session information

## Technical Implementation

### Frontend Changes

#### New HTML Elements
```html
<!-- Login screen tabs -->
<button id="tab-login">🔐 Login & Config</button>
<button id="tab-history-pre">📊 History & Analytics</button>

<div id="content-login"><!-- Login form --></div>
<div id="content-history-pre"><!-- History content --></div>

<!-- Pre-login statistics -->
<div id="stat-total-attacks-pre">-</div>
<div id="stat-successful-pre">-</div>
<div id="stat-failed-pre">-</div>
<div id="stat-avg-rate-pre">-</div>

<!-- Pre-login history list -->
<div id="history-list-pre">Please login to view attack history</div>
<button id="refresh-history-pre-btn">Refresh</button>
```

#### New JavaScript Functions
```javascript
// Tab switching for login screen
document.getElementById('tab-login').addEventListener('click', ...)
document.getElementById('tab-history-pre').addEventListener('click', ...)

// Load history data (pre-login version)
async function loadHistoryDataPre() {
  if (!sessionToken) {
    // Show placeholders
    return;
  }
  // Load real data via API
  const response = await apiRequest('/api/attacks');
  // Update UI with statistics and history
}

// Refresh button
document.getElementById('refresh-history-pre-btn').addEventListener('click', loadHistoryDataPre);
```

### Backend Changes

#### Fixed API Endpoint
```javascript
app.get('/api/attacks', authenticate, (req, res) => {
  const stmt = db.prepare('SELECT * FROM attacks ORDER BY started_at DESC');
  const attacks = stmt.all();
  res.json(attacks);
});
```

**Authentication**: Required  
**Response**: Array of attacks sorted by `started_at` (newest first)  
**Fixed**: Uses correct column name `started_at` instead of `created_at`

## User Experience Improvements

### Before Login
1. User can view system configuration without logging in
2. Can see LLM providers are active
3. Statistics show "-" until login
4. Clear message: "Please login to view attack history"

### After Login
1. Click History tab to see full attack data
2. Statistics automatically calculate from attack history
3. Last 10 attacks displayed with details
4. Refresh button to manually reload data
5. Seamless experience between login screen and dashboard

## Data Flow

```
User clicks "History & Analytics" tab
  ↓
loadHistoryDataPre() called
  ↓
Check if sessionToken exists
  ↓
  No → Show placeholders and "Please login" message
  Yes → Call apiRequest('/api/attacks')
    ↓
    Backend: authenticate middleware validates token
    ↓
    Backend: Query database with ORDER BY started_at DESC
    ↓
    Frontend: Calculate statistics
    ↓
    Frontend: Render attack history cards
    ↓
    Frontend: Display data in UI
```

## Testing

### Test Pre-Login State
1. Open application
2. Click "📊 History & Analytics" tab
3. Verify:
   - Statistics show "-"
   - Message: "Please login to view attack history"
   - Configuration shows default values
   - LLM providers show "Active"

### Test Post-Login State
1. Login with passkey
2. Click "📊 History & Analytics" tab
3. Verify:
   - Statistics show real numbers
   - Attack history displays (if any attacks exist)
   - Refresh button works
   - Timestamps are correct

### Test Dashboard History Tab
1. Start an attack
2. Click "📊 History & Analytics" tab in dashboard
3. Verify:
   - Same data as pre-login tab (if logged in)
   - Session information displays correctly
   - All panels render properly

## Benefits

✅ **Early Access**: View configuration before starting attacks  
✅ **No Errors**: Fixed database column name issue  
✅ **Better UX**: History available at login screen  
✅ **Clear States**: Different UI for logged in vs logged out  
✅ **Consistent**: Same history data in both locations  
✅ **Informative**: Shows system status before authentication  


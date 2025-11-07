# History & Analytics Tab Feature

## Overview
Added a comprehensive History & Analytics tab to the dashboard that provides attackers with historical data, configuration settings, and system information.

## Features Added

### 1. Tab Navigation System
**Location**: `frontend/index.html`

- Two-tab interface:
  - **🎯 Live Attack**: Real-time attack monitoring (existing functionality)
  - **📊 History & Analytics**: Historical data and system information (new)

### 2. Statistics Overview
Displays key metrics at a glance:
- **Total Attacks**: Count of all executed attacks
- **Successful**: Number of successful attacks (green)
- **Failed**: Number of failed attacks (red)
- **Avg Success Rate**: Overall success percentage

### 3. Current Configuration Panel
Shows the active system configuration:
- Target Driver name
- Base Success Rate
- Phishing Calibration Factor
- Stress Multiplier
- GPS Coordinates
- API Alert Count

### 4. Attack History
Displays the last 10 attacks with details:
- Attack ID and timestamp
- Success/Failure status with color coding
- Target driver name
- Configured success rate
- Attack day
- Current status

Features:
- Hover effects for better UX
- Refresh button to reload data
- Shows "No attack history yet" when empty
- Reverse chronological order (newest first)

### 5. LLM Provider Status
Shows configured LLM providers:
- **MiniMax M2** (minimax/minimax-m2:free) - Active
- **GLM 4.5 Air** (z-ai/glm-4.5-air:free) - Active

### 6. Session Information
Displays current session details:
- Logged in user (display name)
- Session TTL (24 hours)
- Authentication method (WebAuthn Passkey)

## Technical Implementation

### Frontend Changes (`frontend/index.html`)

#### CSS Additions
```css
.tab-btn - Tab button styling with active state
.tab-content - Tab content container
.stat-card - Statistics card styling
.history-item - Attack history item styling
```

#### JavaScript Functions
```javascript
// Tab switching
document.getElementById('tab-live').addEventListener('click', ...)
document.getElementById('tab-history').addEventListener('click', ...)

// Load history data
async function loadHistoryData() {
  - Fetches all attacks from API
  - Calculates statistics
  - Renders attack history
  - Updates session info
}

// Refresh button
document.getElementById('refresh-history-btn').addEventListener('click', loadHistoryData)
```

### Backend Changes (`backend/server.js`)

#### New API Endpoint
```javascript
app.get('/api/attacks', authenticate, (req, res) => {
  const stmt = db.prepare('SELECT * FROM attacks ORDER BY created_at DESC');
  const attacks = stmt.all();
  res.json(attacks);
});
```

**Authentication**: Requires valid session token  
**Response**: Array of all attacks with full details  
**Sorting**: Newest first (DESC by created_at)

## Usage

### Accessing the History Tab
1. Log in to the dashboard with your passkey
2. Click the **📊 History & Analytics** tab
3. View statistics, configuration, and attack history
4. Click **Refresh** to update the data

### Data Updates
- History loads automatically when switching to the tab
- Click "Refresh" button to manually reload
- Statistics recalculate based on latest attack data

## UI/UX Improvements

### Professional Design
- Clean, modern card-based layout
- Color-coded success/failure indicators
- Smooth hover effects on history items
- Consistent spacing and typography

### Responsive Layout
- Grid system adapts to screen size
- Mobile-friendly design
- Proper spacing on all devices

### User Feedback
- Loading states handled gracefully
- Error messages for failed data loads
- Empty state message when no history exists

## Data Structure

### Attack Object
```json
{
  "id": 1,
  "config": "{\"targetDriver\":\"Jerry Rodriguez\",\"baseSuccessRate\":0.30,\"day\":1}",
  "status": "completed",
  "success": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:35:00Z"
}
```

### Statistics Calculation
```javascript
totalAttacks = attacks.length
successful = attacks.filter(a => a.success === 1).length
failed = totalAttacks - successful
avgRate = (successful / totalAttacks) * 100
```

## Future Enhancements

Potential additions:
- Export attack history to CSV/JSON
- Filter attacks by date range
- Search/filter by target or status
- Detailed attack logs viewer
- Success rate trends over time
- LLM performance comparison charts
- Real-time LLM provider health checks

## Benefits

✅ **Visibility**: Complete overview of attack history  
✅ **Analytics**: Quick statistics and success rates  
✅ **Configuration**: Easy reference to current settings  
✅ **Transparency**: LLM provider and session information  
✅ **User Experience**: Professional, intuitive interface  
✅ **Debugging**: Historical data for troubleshooting  


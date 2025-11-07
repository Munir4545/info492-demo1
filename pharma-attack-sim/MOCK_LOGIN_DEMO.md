# Mock Login for Demo/Showcase

## Overview
Added a **Quick Demo Login** button that bypasses WebAuthn passkey authentication, making it easy to showcase the application without requiring passkey setup.

## Features

### Frontend (`frontend/index.html`)

#### New UI Element
```html
<div class="relative">
    <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-slate-300"></div>
    </div>
    <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-slate-500">Demo Mode</span>
    </div>
</div>

<button type="button" id="mock-login-btn" class="ghost-btn w-full">
    🎭 Quick Demo Login (No Passkey Required)
</button>
```

#### Mock Login Function
```javascript
async function mockLogin() {
    updateAuthStatus('Demo login in progress...', 'info');
    enableAuthButtons(false);
    
    try {
        // Create a mock session without actual passkey authentication
        const mockUser = {
            username: 'demo-user',
            displayName: 'Demo Analyst',
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
        
        await completeAuthentication({ user: mockUser, token: mockToken });
        updateAuthStatus('✅ Demo login successful!', 'success');
    } catch (error) {
        updateAuthStatus(`Demo login error: ${error.message}`, 'error');
        enableAuthButtons(true);
    }
}
```

### Backend (`backend/server.js`)

#### Updated Authentication Middleware
```javascript
function authenticate(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if it's a demo token (for showcase/demo purposes)
    if (token.startsWith('demo-token-')) {
      req.sessionToken = token;
      req.user = {
        id: 'demo-user',
        username: 'demo-user',
        displayName: 'Demo Analyst',
      };
      return next();
    }
    
    // Regular passkey authentication
    const user = getSessionUser(db, token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
    req.sessionToken = token;
    req.user = {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
    };
    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}
```

## How It Works

### User Flow
1. User opens the application
2. Sees three authentication options:
   - **Register Passkey** (real WebAuthn)
   - **Sign In with Passkey** (real WebAuthn)
   - **🎭 Quick Demo Login** (mock authentication)
3. Clicks "Quick Demo Login"
4. Instantly logged in as "Demo Analyst"
5. Can configure and launch attacks immediately

### Technical Flow
```
User clicks "Quick Demo Login"
  ↓
mockLogin() function executes
  ↓
Creates mock user object:
  - username: 'demo-user'
  - displayName: 'Demo Analyst'
  - id: 'mock-' + timestamp
  ↓
Generates mock token: 'demo-token-' + random string
  ↓
Stores in sessionToken and localStorage
  ↓
Calls completeAuthentication()
  ↓
Shows attack configuration form
  ↓
User configures attack
  ↓
Attack API calls include token: 'demo-token-xyz123'
  ↓
Backend authenticate() middleware detects 'demo-token-' prefix
  ↓
Bypasses database session lookup
  ↓
Sets req.user to demo user
  ↓
API request proceeds normally
  ↓
Attack executes successfully
```

## Benefits

### For Demos/Showcases
✅ **No Setup Required**: No need to register passkeys  
✅ **Instant Access**: One-click login  
✅ **No Browser Compatibility Issues**: Works everywhere  
✅ **No HTTPS Required**: Demo tokens work on localhost  
✅ **Persistent Session**: Stored in localStorage  
✅ **Full Functionality**: All features work normally  

### For Development
✅ **Fast Testing**: Quick login during development  
✅ **No Passkey Management**: No need to manage test credentials  
✅ **Easy Reset**: Just clear localStorage  

### For Presentations
✅ **Professional Look**: Clean UI with divider  
✅ **Clear Labeling**: "Demo Mode" section  
✅ **No Friction**: Audience can try it immediately  

## Security Notes

### Production Considerations
⚠️ **Demo Mode is for Showcase Only**  
⚠️ **Not Secure for Production**  
⚠️ **Anyone can generate demo tokens**  
⚠️ **No real authentication**  

### Recommended for Production
If deploying to production, you should:
1. Remove the mock login button
2. Remove the demo token check in `authenticate()`
3. Require real passkey authentication only

### Or Add Environment Flag
```javascript
// Backend
const ENABLE_DEMO_MODE = process.env.ENABLE_DEMO_MODE === 'true';

function authenticate(req, res, next) {
  // ...
  if (ENABLE_DEMO_MODE && token.startsWith('demo-token-')) {
    // Allow demo login
  }
  // ...
}
```

```html
<!-- Frontend -->
<button type="button" id="mock-login-btn" class="ghost-btn w-full" style="display: ${DEMO_MODE ? 'block' : 'none'}">
    🎭 Quick Demo Login (No Passkey Required)
</button>
```

## Usage

### For Demos
1. Open application
2. Click "🎭 Quick Demo Login"
3. Configure attack settings
4. Launch attack
5. Show all features working

### For Testing
1. Clear localStorage if needed: `localStorage.clear()`
2. Refresh page
3. Click "Quick Demo Login"
4. Test features

### For Development
1. Use mock login for quick access
2. Test with real passkeys when needed
3. Switch between both as needed

## UI Design

### Visual Hierarchy
```
┌─────────────────────────────────┐
│  Register Passkey               │  Primary
├─────────────────────────────────┤
│  Sign In with Passkey           │  Secondary
├─────────────────────────────────┤
│  ────── Demo Mode ──────        │  Divider
├─────────────────────────────────┤
│  🎭 Quick Demo Login            │  Ghost (subtle)
└─────────────────────────────────┘
```

### Button Styling
- **Primary/Secondary**: Real authentication (prominent)
- **Divider**: Clear separation with "Demo Mode" label
- **Ghost Button**: Subtle, less prominent (demo only)

## Token Format

### Demo Token Structure
```
demo-token-[random-string]

Examples:
- demo-token-k7x9m2p5q8
- demo-token-a3b6c9d2e5
- demo-token-z1y4x7w0v3
```

### Detection
Backend checks if token starts with `demo-token-` prefix to identify demo sessions.

## Persistence

### localStorage Structure
```json
{
  "token": "demo-token-k7x9m2p5q8",
  "user": {
    "username": "demo-user",
    "displayName": "Demo Analyst",
    "id": "mock-1699876543210"
  }
}
```

### Session Restoration
On page reload:
1. Check localStorage for session
2. If demo token found, restore session
3. User remains logged in
4. Can continue using the app

## Comparison

### Real Passkey vs Mock Login

| Feature | Real Passkey | Mock Login |
|---------|-------------|------------|
| Security | ✅ High | ❌ None |
| Setup Required | ✅ Yes | ❌ No |
| Browser Support | ⚠️ Modern only | ✅ All |
| HTTPS Required | ✅ Yes | ❌ No |
| Demo Friendly | ❌ No | ✅ Yes |
| Production Ready | ✅ Yes | ❌ No |
| Speed | ⚠️ Slower | ✅ Instant |

## Best Practices

### When to Use Mock Login
✅ Live demos and presentations  
✅ Quick testing during development  
✅ Showcasing to non-technical audience  
✅ Local development without HTTPS  
✅ Rapid prototyping  

### When to Use Real Passkeys
✅ Production deployment  
✅ Security demonstrations  
✅ User acceptance testing  
✅ Final QA testing  
✅ Any real-world usage  

## Future Enhancements

Potential improvements:
- Add environment variable to enable/disable demo mode
- Add visual indicator when in demo mode
- Add warning banner for demo sessions
- Add demo session timeout
- Add demo mode toggle in settings
- Add multiple demo user profiles

## Summary

The mock login feature makes the Pharma Attack Simulator **demo-ready** by providing instant, frictionless access without requiring passkey setup. Perfect for showcases, presentations, and quick testing while maintaining the option for real passkey authentication when needed.

🎭 **One-Click Demo Access** → Perfect for Showcases!


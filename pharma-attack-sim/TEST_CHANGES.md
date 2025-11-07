# 🔍 How to See the Changes

## The Problem
You might be opening the **OLD file** (`index.html`) instead of the **NEW file** (`master-dashboard.html`).

## Quick Test

### Step 1: Verify Files Exist
Run this command:
```bash
cd /Users/jacqueline/Desktop/demo/pharma-attack-sim
ls -lh frontend/*.html frontend/*.js
```

You should see:
- `index.html` (14KB) - OLD
- `master-dashboard.html` (15KB) - NEW ⭐
- `attack-graph.js` (5KB) - NEW
- `dashboard.js` (10KB) - NEW

### Step 2: Start Backend
```bash
cd backend
npm start
```

Keep this running!

### Step 3: Start Frontend
Open a NEW terminal:
```bash
cd frontend
python3 -m http.server 8000
```

### Step 4: Open BOTH Files in Browser

**Open TWO browser tabs:**

**Tab 1 - OLD (Basic):**
```
http://localhost:8000/index.html
```
You'll see: Simple 4-agent cards

**Tab 2 - NEW (Enhanced):**
```
http://localhost:8000/master-dashboard.html
```
You'll see: 6-panel layout with graph!

## What You Should See in master-dashboard.html

### Before Login:
- Same login form as before

### After Starting Attack:
**You'll see 3 NEW things:**

1. **TABS at top:**
   - ATTACK MODE
   - EXPERIMENT MODE  
   - ANALYSIS MODE

2. **6 PANELS (not 4 cards):**
   - Top-left: AI Reasoning
   - Top-middle: Reconnaissance
   - Top-right: Target Map (Tier Heatmap)
   - Middle: **BIG INTERACTIVE GRAPH** ← This is the main new feature!
   - Bottom-left: Access Tiers
   - Bottom-right: Live Telemetry

3. **Interactive Graph:**
   - Nodes that you can drag
   - Lines connecting them
   - Path lights up as attack progresses
   - Shows attack flow in real-time

## Still Don't See It?

### Check 1: Are you opening the right file?
- ❌ `http://localhost:8000/` → Goes to index.html
- ❌ `http://localhost:8000/index.html` → OLD file
- ✅ `http://localhost:8000/master-dashboard.html` → NEW file

### Check 2: Is backend running?
Open browser console (F12) and check:
- Should see: "Connected to attack server"
- If not: Backend isn't running!

### Check 3: Check for errors
Open browser console (F12):
- Any red errors?
- Is D3.js loading? (Check Network tab)

### Check 4: Hard refresh
- Mac: Cmd + Shift + R
- Windows: Ctrl + Shift + R

## Visual Comparison

### index.html (OLD):
```
┌─────────────────────────┐
│  ATTACK CONTROL SYSTEM  │
│                         │
│  [Login Form]           │
└─────────────────────────┘

After login:
┌─────────────────────────┐
│ [Card] [Card]           │
│ [Card] [Card]           │
│                         │
│ [Console]               │
└─────────────────────────┘
```

### master-dashboard.html (NEW):
```
┌──────────────────────────────────────┐
│ MASTER ATTACK CONTROL SYSTEM         │
│ [ATTACK] [EXPERIMENT] [ANALYSIS]     │
├──────────┬──────────┬──────────┐     │
│   AI     │   RECON  │  TARGET  │     │
│ REASONING│          │   MAP    │     │
├──────────┴──────────┴──────────┤     │
│                                 │     │
│   [INTERACTIVE D3.JS GRAPH]    │     │
│   (Drag nodes, see path!)      │     │
│                                 │     │
├──────────┬──────────────────────┤     │
│  TIERS   │   TELEMETRY          │     │
│          │  • Success Rate      │     │
│          │  • Detection Risk    │     │
└──────────┴──────────────────────┘     │
```

## File Size Comparison

- `index.html`: ~14KB (simple)
- `master-dashboard.html`: ~15KB + includes 6 panels, graph, experiments

## New JavaScript Files

Check if these exist:
```bash
ls -lh frontend/attack-graph.js
ls -lh frontend/dashboard.js
```

These are NEW files that the master dashboard uses!

## Still Confused?

Run this command to see all new files:
```bash
cd /Users/jacqueline/Desktop/demo/pharma-attack-sim
find . -name "*.js" -o -name "*dashboard*.html" | grep -v node_modules
```

You should see:
- `frontend/index.html` (old)
- `frontend/master-dashboard.html` (new) ⭐
- `frontend/attack-graph.js` (new) ⭐
- `frontend/dashboard.js` (new) ⭐
- `backend/experiments/dr-chen-experiments.js` (new) ⭐

## The Bottom Line

**The changes are in a NEW FILE: `master-dashboard.html`**

You need to:
1. Open `master-dashboard.html` (not `index.html`)
2. Have backend running
3. Start an attack to see the graph and panels


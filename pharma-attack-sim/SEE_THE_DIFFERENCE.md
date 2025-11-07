# 👀 See The Difference - Simple Guide

## What Changed: Summary

You now have **TWO separate dashboard files**:

| File | What It Is | When to Use |
|------|------------|-------------|
| `index.html` | **Original** basic dashboard | Simple testing |
| `master-dashboard.html` | **NEW** enhanced dashboard | Full features ⭐ |

## The Changes Are Real

Verified files that exist:
- ✅ `frontend/master-dashboard.html` (15KB) - NEW
- ✅ `frontend/attack-graph.js` (5.4KB) - NEW  
- ✅ `frontend/dashboard.js` (9.9KB) - NEW
- ✅ `backend/experiments/dr-chen-experiments.js` - NEW

## How to See It

### Quick Visual Test

1. **Open your file explorer/finder**
2. **Navigate to:** `/Users/jacqueline/Desktop/demo/pharma-attack-sim/frontend/`
3. **You'll see TWO HTML files:**
   - `index.html` (created at 15:15)
   - `master-dashboard.html` (created at 15:22) ⭐

### Side-by-Side Comparison

**Open BOTH files in your text editor:**
```bash
# Compare file sizes
index.html:          14,629 bytes
master-dashboard.html: 15,700 bytes

# Compare features
index.html:          4 agent cards, basic console
master-dashboard.html: 6 panels, interactive graph, experiments, tabs
```

## Key Differences You'll See

### 1. In the HTML File Structure

**index.html has:**
```html
<!-- 4 agent cards -->
<div id="orchestrator-card">...</div>
<div id="phishing-card">...</div>
<div id="gps-card">...</div>
<div id="api-card">...</div>
```

**master-dashboard.html has:**
```html
<!-- Tabs -->
<div class="tab">ATTACK MODE</div>
<div class="tab">EXPERIMENT MODE</div>
<div class="tab">ANALYSIS MODE</div>

<!-- 6 panels -->
<div class="panel">AI Reasoning</div>
<div class="panel">Reconnaissance</div>
<div class="panel">Target Map</div>
<div id="attack-graph"></div>  <!-- NEW! -->
<div class="panel">Access Tiers</div>
<div class="panel">Live Telemetry</div>
```

### 2. JavaScript Libraries

**index.html:**
```html
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
```

**master-dashboard.html:**
```html
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
<script src="https://d3js.org/d3.v7.min.js"></script>  <!-- NEW! -->
<script src="attack-graph.js"></script>  <!-- NEW! -->
<script src="dashboard.js"></script>  <!-- NEW! -->
```

### 3. Features

**index.html:**
- 4 agent cards
- Basic console
- Export/Reset buttons

**master-dashboard.html:**
- ✅ 6 specialized panels
- ✅ Interactive D3.js graph (drag nodes!)
- ✅ 3 modes (Attack/Experiment/Analysis)
- ✅ Tier authentication heatmap
- ✅ Dr. Chen's experiments
- ✅ Live telemetry meters
- ✅ All features from index.html

## How to Test

### Method 1: Compare File Contents
```bash
cd /Users/jacqueline/Desktop/demo/pharma-attack-sim/frontend
diff index.html master-dashboard.html | head -50
```

You'll see hundreds of differences!

### Method 2: Run Both in Browser

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && python3 -m http.server 8000`
3. Open TWO browser tabs:
   - Tab 1: `http://localhost:8000/index.html` (old)
   - Tab 2: `http://localhost:8000/master-dashboard.html` (new)

**You'll immediately see:**
- Tab 1: Simple 4-card layout
- Tab 2: Complex 6-panel layout with tabs and graph area

### Method 3: Check File Contents Directly

**index.html line count:**
```bash
wc -l frontend/index.html
# Result: ~406 lines
```

**master-dashboard.html line count:**
```bash
wc -l frontend/master-dashboard.html  
# Result: ~380 lines (but references external JS files)
```

**Plus new JS files:**
```bash
wc -l frontend/attack-graph.js
# Result: ~180 lines

wc -l frontend/dashboard.js
# Result: ~280 lines
```

## Visual Proof

Run this command to see all new files:
```bash
cd /Users/jacqueline/Desktop/demo/pharma-attack-sim
find . -type f \( -name "*.html" -o -name "*graph*.js" -o -name "*dashboard*.js" -o -name "*experiment*.js" \) | grep -v node_modules | sort
```

Output should show:
```
./backend/experiments/dr-chen-experiments.js
./frontend/attack-graph.js
./frontend/dashboard.js
./frontend/index.html
./frontend/master-dashboard.html
```

## Still Don't See It?

### Check 1: Are you in the right directory?
```bash
pwd
# Should show: /Users/jacqueline/Desktop/demo/pharma-attack-sim
```

### Check 2: List the files
```bash
ls -la frontend/
```

You should see both HTML files!

### Check 3: Open master-dashboard.html in a text editor
Look for these unique strings that DON'T exist in index.html:
- `"MASTER ATTACK DASHBOARD"` (title)
- `"ATTACK MODE"` (tab)
- `"EXPERIMENT MODE"` (tab)
- `"attack-graph"` (div id)
- `"d3js.org"` (D3.js library)

## Bottom Line

**The changes ARE there!** 

You just need to:
1. Open `master-dashboard.html` instead of `index.html`
2. Start the backend server
3. Look for the tabs, 6-panel layout, and graph area

The files are definitely different - I can prove it with the file listings and line counts above!


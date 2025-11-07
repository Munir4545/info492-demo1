# 🚀 Enhanced Features Documentation

## Overview

The enhanced attack simulation system includes a professional multi-panel dashboard with advanced visualizations, experimental frameworks, and real-time analytics.

## Master Dashboard Features

### 1. Multi-Panel Layout

The master dashboard (`master-dashboard.html`) features 6 specialized panels:

#### Panel 1: AI Reasoning (Top-Left)
- Real-time AI decision-making process
- Shows LLM analysis and strategic choices
- Displays confidence scores and reasoning chains

#### Panel 2: Reconnaissance (Top-Middle)
- Network scanning results
- Entry points identified (Driver app, Dispatcher dashboard, GPS service)
- Vulnerability scores for each entry point

#### Panel 3: Target Map / Tier Heatmap (Top-Right)
- Visual representation of authentication tiers
- Color-coded security levels (Red=High, Yellow=Medium, Green=Low)
- Clickable tiers show detailed authentication methods and attack vectors

#### Panel 4: Attack Flow Graph (Middle - Full Width)
- Interactive D3.js force-directed graph
- Shows attack progression through nodes
- Real-time highlighting of active path
- Color-coded nodes by type (initial, decision, action, success, failure)
- Draggable nodes for exploration

#### Panel 5: Access Tiers Details (Bottom-Left)
- Detailed breakdown of selected tier
- Authentication methods
- Attack vector success rates
- Security score breakdown

#### Panel 6: Live Telemetry (Bottom-Right)
- Success rate meter
- Detection risk gauge (increases over time)
- Time elapsed counter
- Packets sent counter
- Active agents count

### 2. Three-Mode Interface

#### Attack Mode
- Full attack simulation with all panels active
- Real-time attack progression
- Live graph updates

#### Experiment Mode
- Access to Dr. Chen's 5 experimental frameworks
- Run individual or all experiments
- View experiment results and conclusions

#### Analysis Mode
- Historical attack data analysis
- Logs and metrics review
- Export functionality

### 3. Interactive Attack Flow Graph

The D3.js graph visualizes the complete attack lifecycle:

**Nodes:**
- START (initial, blue)
- TARGET_SELECT (decision, amber)
- TIER2_ATTACK (action, purple)
- PHISHING (action, purple)
- LLM_TEST (analysis, green)
- SUCCESS/FAILURE (success/failure, green/red)
- GPS_SPOOF (action, purple)
- API_FLOOD (action, purple)
- COMPLETE (complete, cyan)

**Edges:**
- Show probability percentages
- Highlight active path during attack
- Animate with pulse effect

**Interactivity:**
- Drag nodes to rearrange
- Click nodes for details
- Real-time path highlighting via Socket.IO

### 4. Tier Authentication System

**Visualization:**
- Heatmap showing all 3 tiers
- Color intensity represents security level
- Click to view detailed breakdown

**Tier Details Include:**
- Security score
- Authentication methods
- Attack vectors with success rates
- Context modifiers (stress, driving, time pressure)

### 5. Dr. Chen's Experiments

#### Experiment 1: Panic Window
- **Purpose**: Measure dispatcher accuracy during alert storms
- **Method**: Simulates alert rate increase from 20/hr to 65/hr
- **Metrics**: Accuracy degradation (90% → 60%), TTR increase
- **Variations**: With/without LM assistance

#### Experiment 2: DDoS Overlap
- **Purpose**: Test detection stacks under combined attacks
- **Method**: DDoS traffic (10x normal) + Social engineering (3 msg/hr)
- **Stacks Tested**: Rules-based, LM-based, Hybrid
- **Metrics**: Detection probability, false positives, latency

#### Experiment 3: Human-AI Ratio
- **Purpose**: Find optimal automation balance
- **Method**: Test automation levels 0%, 25%, 50%, 75%, 100%
- **Metrics**: TTR (Time to Recognition), Expected loss
- **Output**: Optimal automation percentage with trade-off curve

#### Experiment 4: Game Theory
- **Purpose**: Model defense investment strategies
- **Method**: Payoff matrix for USPS vs FedEx
- **Analysis**: Nash equilibrium calculation
- **Simulation**: Repeated game (10 rounds)

#### Experiment 5: Driver Distraction
- **Purpose**: Measure phishing click rates under stress
- **Conditions**: Baseline, While driving, Under stress, Combined
- **Mitigations**: Lock screen, Forced delay
- **Metrics**: Click rate reduction effectiveness

## Socket.IO Events

### Real-time Updates

**Attack Events:**
- `attack:started` - Attack initialization
- `attack:completed` - Attack finished
- `attack:failed` - Attack failure

**Agent Events:**
- `agent:message` - Agent log message
- `step:started` - Agent step begun
- `step:completed` - Agent step finished

**Dashboard Events:**
- `ai:reasoning` - AI decision-making updates
- `recon:finding` - Reconnaissance discoveries
- `tier:analysis` - Tier security analysis
- `graph:update` - Attack flow graph updates

**Experiment Events:**
- `experiment:started` - Experiment begun
- `experiment:completed` - Experiment finished
- `experiments:completed` - All experiments done

## File Structure

```
frontend/
├── index.html              # Basic dashboard
├── master-dashboard.html   # Enhanced dashboard (6 panels)
├── dashboard.js            # Dashboard functionality
└── attack-graph.js         # D3.js graph implementation

backend/
├── server.js               # Express server
├── agents.js               # AI agents
├── auth-tiers.js           # Tier authentication system
└── experiments/
    └── dr-chen-experiments.js  # Experimental frameworks
```

## Usage Tips

1. **Start with Basic Dashboard**: Use `index.html` for simple testing
2. **Use Master Dashboard**: Switch to `master-dashboard.html` for full features
3. **Run Experiments**: Use Experiment Mode tab to test frameworks
4. **Export Data**: Click Export button after attack completes
5. **Explore Graph**: Drag nodes in attack flow graph for better layout
6. **View Tiers**: Click tier boxes to see authentication details

## Performance Notes

- Matrix rain animation runs at ~30 FPS
- Graph updates are throttled for performance
- Socket.IO events are batched when possible
- Large log outputs are paginated

## Future Enhancements

Potential additions:
- Voice deepfake simulation
- Advanced GPS trajectory visualization
- Multi-day attack progression (72-hour simulation)
- Defense mechanism demonstrations
- Comparative analysis with hardened systems
- PDF report generation
- CSV data export for experiments


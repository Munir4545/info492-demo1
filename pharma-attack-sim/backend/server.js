// Attack Control Server
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { runAttack } = require('./agents');
const { getAllTiers, getTierData } = require('./auth-tiers');
const { runAllExperiments } = require('./experiments/dr-chen-experiments');
const { getSuggestions, updateAttackState } = require('./llm-suggestions');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Load config
const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Initialize database
const dbPath = path.join(__dirname, 'attacks.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS attacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config TEXT,
    status TEXT DEFAULT 'pending',
    success BOOLEAN,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attack_id INTEGER,
    agent TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Helper function to log messages
function log(attackId, agent, message, io, db) {
  const timestamp = new Date().toISOString();
  
  // Save to database
  const stmt = db.prepare('INSERT INTO logs (attack_id, agent, message) VALUES (?, ?, ?)');
  stmt.run(attackId, agent, message);
  
  // Emit via Socket.IO
  io.emit('agent:message', {
    attackId,
    agent,
    message,
    timestamp
  });
  
  // Enhanced events for dashboard panels
  if (agent === 'Orchestrator') {
    io.emit('ai:reasoning', {
      attackId,
      agent,
      message,
      timestamp
    });
  }
  
  if (agent === 'Phishing' || agent === 'GPS' || agent === 'API') {
    io.emit('recon:finding', {
      attackId,
      agent,
      message,
      timestamp
    });
  }
  
  // Console log
  console.log(`[${agent}] ${message}`);
}

// Enhanced broadcast function for attack updates
function broadcastAttackUpdate(attackId, data) {
  io.emit('ai:reasoning', { attackId, ...data });
  io.emit('recon:finding', { attackId, ...data });
  io.emit('tier:analysis', { attackId, ...data });
  io.emit('graph:update', { attackId, ...data });
}

// API endpoints
app.get('/api/config', (req, res) => {
  res.json(config);
});

app.post('/api/attacks/create', (req, res) => {
  const attackConfig = req.body.config || config.attack;
  const stmt = db.prepare('INSERT INTO attacks (config, status) VALUES (?, ?)');
  const result = stmt.run(JSON.stringify(attackConfig), 'pending');
  const attackId = result.lastInsertRowid;
  
  res.json({ attackId });
});

app.post('/api/attacks/:id/start', async (req, res) => {
  const attackId = parseInt(req.params.id);
  
  const stmt = db.prepare('SELECT * FROM attacks WHERE id = ?');
  const attack = stmt.get(attackId);
  
  if (!attack) {
    return res.status(404).json({ error: 'Attack not found' });
  }
  
  const attackConfig = JSON.parse(attack.config);
  
  // Update status
  const updateStmt = db.prepare('UPDATE attacks SET status = ? WHERE id = ?');
  updateStmt.run('running', attackId);
  
  io.emit('attack:started', { attackId });
  
  // Start attack in background
  runAttack(attackId, attackConfig, io, db, config, log).then((success) => {
    const completeStmt = db.prepare('UPDATE attacks SET status = ?, success = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?');
    completeStmt.run('completed', success, attackId);
    io.emit('attack:completed', { attackId, success });
  }).catch((error) => {
    console.error('Attack error:', error);
    const failStmt = db.prepare('UPDATE attacks SET status = ?, success = ? WHERE id = ?');
    failStmt.run('failed', false, attackId);
    io.emit('attack:failed', { attackId, error: error.message });
  });
  
  res.json({ success: true, attackId });
});

app.get('/api/attacks/:id', (req, res) => {
  const attackId = parseInt(req.params.id);
  const stmt = db.prepare('SELECT * FROM attacks WHERE id = ?');
  const attack = stmt.get(attackId);
  
  if (!attack) {
    return res.status(404).json({ error: 'Attack not found' });
  }
  
  const logsStmt = db.prepare('SELECT * FROM logs WHERE attack_id = ? ORDER BY timestamp');
  const logs = logsStmt.all(attackId);
  
  res.json({
    ...attack,
    config: JSON.parse(attack.config),
    logs
  });
});

// Tier authentication endpoints
app.get('/api/tiers', (req, res) => {
  res.json(getAllTiers());
});

app.get('/api/tiers/:tier', (req, res) => {
  const tier = req.params.tier;
  const tierData = getTierData(tier);
  
  if (!tierData) {
    return res.status(404).json({ error: 'Tier not found' });
  }
  
  res.json(tierData);
});

// Experiments endpoint
app.post('/api/experiments/run', async (req, res) => {
  const attackId = req.body.attackId || null;
  
  res.json({ success: true, message: 'Experiments started' });
  
  // Run experiments in background
  runAllExperiments(io, db, log, attackId).catch(error => {
    console.error('Experiments error:', error);
  });
});

// Get LLM suggestions endpoint
app.get('/api/attacks/:id/suggestions', (req, res) => {
  const attackId = parseInt(req.params.id);
  const suggestions = getSuggestions(attackId);
  res.json({ suggestions });
});

// Manual agent trigger endpoint
app.post('/api/agents/:name/trigger', async (req, res) => {
  const agentName = req.params.name;
  const { attackId, tier } = req.body;
  
  if (!attackId) {
    return res.status(400).json({ error: 'Attack ID required' });
  }
  
  // Get attack config
  const stmt = db.prepare('SELECT * FROM attacks WHERE id = ?');
  const attack = stmt.get(parseInt(attackId));
  
  if (!attack) {
    return res.status(404).json({ error: 'Attack not found' });
  }
  
  const attackConfig = JSON.parse(attack.config);
  const configPath = path.join(__dirname, '..', 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // Emit manual trigger event
  io.emit('step:manual', {
    attackId: parseInt(attackId),
    agent: agentName,
    status: 'running',
    nodeId: getNodeIdForAgent(agentName)
  });
  
  // Trigger the agent
  try {
    const { triggerAgent } = require('./agents');
    await triggerAgent(agentName, parseInt(attackId), attackConfig, io, db, config, log, tier);
    
    res.json({ success: true, agent: agentName });
  } catch (error) {
    console.error(`Error triggering ${agentName}:`, error);
    io.emit('step:manual', {
      attackId: parseInt(attackId),
      agent: agentName,
      status: 'failed'
    });
    res.status(500).json({ error: error.message });
  }
});

// Helper function to map agents to graph nodes (industry-standard phases)
function getNodeIdForAgent(agentName) {
  const mapping = {
    'orchestrator': 'TARGET_ANALYSIS',
    'phishing': 'PHISHING',
    'gps': 'GPS_MANIP',
    'api': 'API_EXPLOIT'
  };
  return mapping[agentName] || null;
}

// Socket.IO connection with error handling
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  // Send welcome message
  socket.emit('ai:reasoning', {
    agent: 'System',
    message: 'Connected to attack simulation server'
  });
  
  socket.on('tier:selected', (data) => {
    console.log(`🎯 Tier selected: ${data.tier} for attack ${data.attackId}`);
    io.emit('tier:analysis', {
      attackId: data.attackId,
      tier: data.tier,
      message: `Target tier changed to ${data.tier}`
    });
  });
  
  socket.on('vuln:exploit', (data) => {
    console.log(`💥 Vulnerability exploited: ${data.vulnerability} in attack ${data.attackId}`);
    io.emit('recon:finding', {
      attackId: data.attackId,
      name: data.vulnerability,
      description: 'Exploited',
      exploited: true
    });
  });
  
  socket.on('step:manual', (data) => {
    console.log(`⚙️ Manual step triggered: ${data.stepId} by agent ${data.agent}`);
  });
  
  socket.on('llm:auto-execute', async (data) => {
    console.log(`🤖 Auto-executing LLM suggestion: ${data.suggestion.title}`);
    const { suggestion, attackId } = data;
    
    // Get attack config
    const stmt = db.prepare('SELECT * FROM attacks WHERE id = ?');
    const attack = stmt.get(parseInt(attackId));
    if (!attack) return;
    
    const attackConfig = JSON.parse(attack.config);
    const configPath = path.join(__dirname, '..', 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Execute suggestion action
    if (suggestion.action === 'phishing' || suggestion.action === 'gps' || suggestion.action === 'api' || suggestion.action === 'orchestrator') {
      const { triggerAgent } = require('./agents');
      try {
        await triggerAgent(suggestion.action, parseInt(attackId), attackConfig, io, db, config, log);
      } catch (error) {
        console.error('Error auto-executing suggestion:', error);
      }
    } else if (suggestion.action === 'switch_tier') {
      updateAttackState(attackId, { currentTier: suggestion.newTier });
      io.emit('tier:selected', { attackId, tier: suggestion.newTier });
    }
  });
  
  socket.on('suggestion:execute', async (data) => {
    const { suggestionId, attackId } = data;
    const suggestions = getSuggestions(parseInt(attackId));
    const suggestion = suggestions.find(s => s.id === suggestionId);
    
    if (!suggestion) return;
    
    // Emit auto-execute event (same logic as above)
    socket.emit('llm:auto-execute', { attackId, suggestion });
  });
  
  socket.on('disconnect', (reason) => {
    console.log('❌ Client disconnected:', socket.id, 'Reason:', reason);
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Handle server errors gracefully
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't crash the server
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't crash the server
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`
🚀 Attack Control Server
   http://localhost:${PORT}
   WebSocket ready
  `);
});

module.exports = { app, io, db, log, broadcastAttackUpdate };


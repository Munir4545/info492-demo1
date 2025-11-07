// Attack Control Server
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { runAttack, triggerAgent } = require('./agents');
const { getAllTiers, getTierData } = require('./auth-tiers');
const { runAllExperiments } = require('./experiments/dr-chen-experiments');
const { getSuggestions, updateAttackState, getAttackState, analyzeAndSuggest } = require('./llm-suggestions');
const {
  startRegistration,
  finishRegistration,
  startAuthentication,
  finishAuthentication,
} = require('./passkey-auth');
const {
  createSession,
  getSessionUser,
  deleteSession,
  purgeExpiredSessions,
} = require('./session-manager');
const humanOversight = require('./human-oversight');

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

const authRouter = express.Router();

authRouter.post('/register/start', async (req, res) => {
  try {
    const { username, displayName } = req.body || {};
    const options = await startRegistration(db, config, {
      username,
      displayName: displayName || username,
    });
    res.json({ options });
  } catch (error) {
    console.error('Passkey registration start failed:', error);
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/register/finish', async (req, res) => {
  try {
    const { username, attestation } = req.body || {};
    const user = await finishRegistration(db, config, {
      username,
      attestationResponse: attestation,
    });
    const { token, expiresAt } = createSession(db, user.userId, config.auth?.sessionTTLHours || 24);
    res.json({ user, token, expiresAt });
  } catch (error) {
    console.error('Passkey registration finish failed:', error);
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/login/start', async (req, res) => {
  try {
    const { username } = req.body || {};
    const options = await startAuthentication(db, config, { username });
    res.json({ options });
  } catch (error) {
    console.error('Passkey authentication start failed:', error);
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/login/finish', async (req, res) => {
  try {
    const { username, assertion } = req.body || {};
    const user = await finishAuthentication(db, config, {
      username,
      assertionResponse: assertion,
    });
    const { token, expiresAt } = createSession(db, user.userId, config.auth?.sessionTTLHours || 24);
    res.json({ user, token, expiresAt });
  } catch (error) {
    console.error('Passkey authentication finish failed:', error);
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/logout', authenticate, (req, res) => {
  try {
    if (req.sessionToken) {
      deleteSession(db, req.sessionToken);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

authRouter.get('/session', authenticate, (req, res) => {
  res.json({
    user: req.user,
    token: req.sessionToken,
  });
});

app.use('/api/auth', authRouter);

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

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    display_name TEXT,
    user_handle TEXT UNIQUE,
    credential_id TEXT,
    public_key TEXT,
    counter INTEGER DEFAULT 0,
    transports TEXT,
    backup_flags TEXT,
    current_challenge TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

purgeExpiredSessions(db);
setInterval(() => purgeExpiredSessions(db), 60 * 60 * 1000);

humanOversight.init({ io, log, db });

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers['x-session-token'];
    if (!token) {
      return next(new Error('unauthorized'));
    }
    const user = getSessionUser(db, token);
    if (!user) {
      return next(new Error('unauthorized'));
    }
    socket.user = {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
    };
    return next();
  } catch (error) {
    return next(error);
  }
});

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

async function executeSuggestion(attackId, suggestion) {
  if (!suggestion || attackId == null) {
    return;
  }

  try {
    const stmt = db.prepare('SELECT * FROM attacks WHERE id = ?');
    const attack = stmt.get(parseInt(attackId));
    if (!attack) {
      console.warn('Suggestion execution skipped; attack not found', attackId);
      return;
    }

    const attackConfig = JSON.parse(attack.config);

    if (suggestion.action === 'phishing') {
      // Handle phishing retry: increment retry counter and clear failed status
      const state = getAttackState(parseInt(attackId));
      const retryCount = (state.retryCounts['phishing'] || 0) + 1;
      
      // Clear phishing from failed steps so it can retry
      const failedSteps = state.failedSteps.filter(step => step !== 'phishing');
      
      updateAttackState(parseInt(attackId), { 
        retryCounts: { ...state.retryCounts, phishing: retryCount },
        failedSteps
      });
      
      log(parseInt(attackId), 'LLM', `🔄 Retrying phishing with LLM-optimized message (attempt ${retryCount})...`, io, db);
      
      try {
        await triggerAgent('phishing', parseInt(attackId), attackConfig, io, db, config, log);
      } catch (error) {
        console.error('Error executing phishing retry:', error);
      }
    } else if (suggestion.action === 'gps' || suggestion.action === 'api' || suggestion.action === 'orchestrator') {
      try {
        await triggerAgent(suggestion.action, parseInt(attackId), attackConfig, io, db, config, log);
      } catch (error) {
        console.error('Error auto-executing suggestion:', error);
      }
    } else if (suggestion.action === 'switch_tier') {
      const tier = suggestion.newTier;
      updateAttackState(parseInt(attackId), { currentTier: tier });
      log(parseInt(attackId), 'HumanLoop', `🎯 Dispatcher tier selected. Awaiting analyst decision on next step.`, io, db);
      io.emit('tier:selected', { attackId, tier });
      analyzeAndSuggest(parseInt(attackId), 'tier_switch', true, io, log, db);
    }
  } catch (error) {
    console.error('Suggestion execution failure:', error);
  }
}

function extractToken(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  if (req.headers['x-session-token']) {
    return req.headers['x-session-token'];
  }
  if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

function authenticate(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
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

// API endpoints
app.get('/api/config', authenticate, (req, res) => {
  res.json(config);
});

app.post('/api/attacks/create', authenticate, (req, res) => {
  const attackConfig = req.body.config || config.attack;
  const stmt = db.prepare('INSERT INTO attacks (config, status) VALUES (?, ?)');
  const result = stmt.run(JSON.stringify(attackConfig), 'pending');
  const attackId = result.lastInsertRowid;
  
  res.json({ attackId });
});

app.post('/api/attacks/:id/start', authenticate, async (req, res) => {
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
    completeStmt.run('completed', success ? 1 : 0, attackId);
    io.emit('attack:completed', { attackId, success });
  }).catch((error) => {
    console.error('Attack error:', error);
    const failStmt = db.prepare('UPDATE attacks SET status = ?, success = ? WHERE id = ?');
    failStmt.run('failed', 0, attackId);
    io.emit('attack:failed', { attackId, error: error.message });
  });
  
  res.json({ success: true, attackId });
});

app.get('/api/attacks', authenticate, (req, res) => {
  const stmt = db.prepare('SELECT * FROM attacks ORDER BY started_at DESC');
  const attacks = stmt.all();
  res.json(attacks);
});

app.get('/api/attacks/:id', authenticate, (req, res) => {
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
app.get('/api/tiers', authenticate, (req, res) => {
  res.json(getAllTiers());
});

app.get('/api/tiers/:tier', authenticate, (req, res) => {
  const tier = req.params.tier;
  const tierData = getTierData(tier);
  
  if (!tierData) {
    return res.status(404).json({ error: 'Tier not found' });
  }
  
  res.json(tierData);
});

// Experiments endpoint
app.post('/api/experiments/run', authenticate, async (req, res) => {
  const attackId = req.body.attackId || null;
  
  res.json({ success: true, message: 'Experiments started' });
  
  // Run experiments in background
  runAllExperiments(io, db, log, attackId).catch(error => {
    console.error('Experiments error:', error);
  });
});

// Get LLM suggestions endpoint
app.get('/api/attacks/:id/suggestions', authenticate, (req, res) => {
  const attackId = parseInt(req.params.id);
  const suggestions = getSuggestions(attackId);
  res.json({ suggestions });
});

app.get('/api/hil/pending', authenticate, (req, res) => {
  const actions = humanOversight.getPendingActions();
  res.json({ actions });
});

app.post('/api/hil/:id/approve', authenticate, (req, res) => {
  try {
    const { notes } = req.body || {};
    const result = humanOversight.approveAction(req.params.id, req.user.username, notes);
    if (result && result.status === 'approved' && result.metadata && result.metadata.suggestion) {
      executeSuggestion(result.attackId, result.metadata.suggestion).catch(error => {
        console.error('Suggestion execution error:', error);
      });
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/hil/:id/reject', authenticate, (req, res) => {
  try {
    const { notes } = req.body || {};
    const result = humanOversight.rejectAction(req.params.id, req.user.username, notes);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Manual agent trigger endpoint
app.post('/api/agents/:name/trigger', authenticate, async (req, res) => {
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
    await executeSuggestion(attackId, suggestion);
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


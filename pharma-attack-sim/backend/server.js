// Attack Control Server
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const fetch = (...args) => import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args));
const agents = require('./agents');
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
const decisionEngine = require('./decision-engine');
const CampaignManager = require('./campaign-manager');
const SyntheticClient = require('./synthetic-client');
const chromaClient = require('./chroma-client');
const AttackLog = require('./models/AttackLog');
const PatternLearningSystem = require('./pattern-learning');

const SYNTHETIC_API_BASE = (process.env.SYNTHETIC_API_BASE || 'http://localhost:8007').replace(/\/$/, '');
const AUTO_LOOP_DELAY_MS = parseInt(process.env.AUTO_LOOP_DELAY_MS || '5000', 10);

const SIM_TOTAL_MINUTES = parseInt(process.env.SIM_TOTAL_MINUTES || `${24 * 60}`, 10);
const SIM_MINUTE_MS = parseInt(process.env.SIM_MINUTE_MS || '1000', 10);

// ChromaDB Connection (Vector Database)
chromaClient.initChroma()
  .then(() => console.log('✅ ChromaDB vector database connected successfully'))
  .catch(err => console.error('❌ ChromaDB connection error:', err));

// Initialize Pattern Learning System (uses ChromaDB for semantic search)
const learningSystem = new PatternLearningSystem();
learningSystem.connect().catch(err => console.error('⚠️ Pattern Learning System initialization failed:', err));

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

// Global attack metrics tracker
const attackMetricsTracker = new Map();
const attackEventBus = new EventEmitter();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createAttackRecord(attackConfig) {
  const stmt = db.prepare('INSERT INTO attacks (config, status) VALUES (?, ?)');
  const result = stmt.run(JSON.stringify(attackConfig), 'pending');
  return result.lastInsertRowid;
}

function kickoffAttack(attackId, attackConfig, syntheticClient = null) {
  // Mark running
  const updateStmt = db.prepare('UPDATE attacks SET status = ? WHERE id = ?');
  updateStmt.run('running', attackId);

  initializeAttackMetrics(attackId);

  decisionEngine.start(attackId, attackConfig, {
    totalSimMinutes: SIM_TOTAL_MINUTES,
    simMinuteDurationMs: SIM_MINUTE_MS
  });

  io.emit('attack:started', { attackId });
  console.log(`[AUTONOMY] Attack ${attackId} started for target ${attackConfig.targetDriver || 'Unknown'}`);

  agents.setMetricsTracker({ getAttackMetrics, updateAttackMetrics });

  const attackPromise = agents.runAttack(attackId, attackConfig, io, db, config, log, syntheticClient)
    .then(async (success) => {
      const finalMetrics = finalizeAttackMetrics(attackId);

      if (finalMetrics) {
        const completeStmt = db.prepare(`
          UPDATE attacks SET 
            status = ?, 
            success = ?, 
            completed_at = CURRENT_TIMESTAMP,
            duration_seconds = ?,
            compromised_deliveries = ?,
            affected_patients = ?,
            critical_medications = ?,
            financial_impact = ?,
            time_to_impact_seconds = ?,
            detection_delay_seconds = ?,
            recovery_time_minutes = ?,
            phishing_success = ?,
            phishing_effectiveness = ?,
            gps_success = ?,
            gps_effectiveness = ?,
            api_success = ?,
            api_effectiveness = ?
          WHERE id = ?
        `);
        completeStmt.run(
          'completed', 
          success ? 1 : 0,
          finalMetrics.duration_seconds,
          finalMetrics.compromised_deliveries,
          finalMetrics.affected_patients,
          finalMetrics.critical_medications,
          finalMetrics.financial_impact,
          finalMetrics.time_to_impact_seconds,
          finalMetrics.detection_delay_seconds,
          finalMetrics.recovery_time_minutes,
          finalMetrics.phishing_success,
          finalMetrics.phishing_effectiveness,
          finalMetrics.gps_success,
          finalMetrics.gps_effectiveness,
          finalMetrics.api_success,
          finalMetrics.api_effectiveness,
          attackId
        );
        
        // Save to ChromaDB
        await saveAttackToChroma(attackId, attackConfig, 'completed', success, finalMetrics);
      } else {
        const completeStmt = db.prepare('UPDATE attacks SET status = ?, success = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?');
        completeStmt.run('completed', success ? 1 : 0, attackId);
        
        // Save to ChromaDB even without detailed metrics
        await saveAttackToChroma(attackId, attackConfig, 'completed', success, null);
      }

      io.emit('attack:completed', { attackId, success });
      decisionEngine.stop(attackId);
      attackEventBus.emit('attack_completed', { attackId, success });
      console.log(`[AUTONOMY] Attack ${attackId} completed (success=${success})`);
    })
    .catch(async (error) => {
      console.error('Attack error:', error);
      const failStmt = db.prepare('UPDATE attacks SET status = ?, success = ? WHERE id = ?');
      failStmt.run('failed', 0, attackId);
      
      // Save failed attack to MongoDB
      await saveAttackToChroma(attackId, attackConfig, 'failed', false, null, error.message);
      
      io.emit('attack:failed', { attackId, error: error.message });
      decisionEngine.stop(attackId);
      attackEventBus.emit('attack_failed', { attackId, error });
      console.log(`[AUTONOMY] Attack ${attackId} failed: ${error.message}`);
    });

  return attackPromise;
}

async function startSyntheticSimulation(durationHours = 24) {
  const url = `${SYNTHETIC_API_BASE}/api/synthetic/start`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration: durationHours })
    });
    if (!response.ok) {
      const text = await response.text();
      console.warn(`[AUTONOMY] Synthetic start responded with ${response.status}: ${text}`);
    } else {
      console.log('[AUTONOMY] Synthetic simulation started.');
    }
  } catch (error) {
    console.error('[AUTONOMY] Failed to start synthetic simulation:', error.message);
    throw error;
  }
}

async function stopSyntheticSimulation() {
  const url = `${SYNTHETIC_API_BASE}/api/synthetic/stop`;
  try {
    const response = await fetch(url, { method: 'POST' });
    if (!response.ok) {
      console.warn(`[AUTONOMY] Synthetic stop responded with ${response.status}`);
    } else {
      console.log('[AUTONOMY] Synthetic simulation stopped.');
    }
  } catch (error) {
    console.error('[AUTONOMY] Failed to stop synthetic simulation:', error.message);
  }
}

async function fetchSyntheticManifest() {
  const url = `${SYNTHETIC_API_BASE}/api/synthetic/manifest`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

async function waitForManifest(timeoutMs = 45000, pollInterval = 2000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const manifest = await fetchSyntheticManifest();
    if (manifest && manifest.driver) {
      return manifest;
    }
    await delay(pollInterval);
  }
  return null;
}

function buildAttackConfigFromManifest(manifest) {
  // Use CampaignManager to pick the best target
  const targetSelection = campaignManager.selectTarget(manifest);
  const targetData = targetSelection.data;
  const isDispatcher = targetSelection.type === 'dispatcher';

  const driverName = targetData.displayName || targetData.name || 'Unknown Target';
  // Adjust persona/vuln based on history if available
  const profile = campaignManager.getDriverProfile(driverName);
  
  const vulnerability = profile 
    ? (profile.susceptibility_score * 100) 
    : (targetData.vulnerabilityScore || 70);
    
  const derivedRate = Math.min(0.9, Math.max(0.25, vulnerability / 100));
  const fakeCoords = config?.agents?.gps?.fakeCoordinates || [46.7298, -117.1817];
  
  let gpsTarget = null;
  if (Array.isArray(manifest?.deliveries) && manifest.deliveries.length > 0) {
    gpsTarget = manifest.deliveries.reduce((best, delivery) => {
      const dist = Math.hypot(
        (delivery.destination.lat - fakeCoords[0]),
        (delivery.destination.lng - fakeCoords[1])
      );
      if (!best || dist < best.dist) {
        return { dist, delivery };
      }
      return best;
    }, null);
  }
  
  const currentDay = campaignManager.getCampaignDay();

  // Calculate GPS Spoof Target based on the next delivery's destination
  // This masks the diversion by telling the dispatcher the driver is at the *intended* destination
  let gpsSpoofTargetLocation = null;
  if (Array.isArray(manifest?.deliveries) && manifest.deliveries.length > 0) {
    // Find the anchor delivery (or default to the first one)
    const anchorDelivery = gpsTarget?.delivery || manifest.deliveries[0];
    gpsSpoofTargetLocation = {
        lat: anchorDelivery.destination.lat,
        lng: anchorDelivery.destination.lng
    };
  }

  // If no delivery found, fall back to config fake coords (unlikely in valid manifest)
  if (!gpsSpoofTargetLocation) {
      gpsSpoofTargetLocation = {
          lat: fakeCoords[0],
          lng: fakeCoords[1]
      };
  }

  return {
    targetDriver: driverName,
    targetTier: isDispatcher ? 'tier3' : 'tier2',
    baseSuccessRate: Number(derivedRate.toFixed(2)),
    vectorPlan: ['phishing', 'gps', 'api'],
    day: currentDay,
    manifestSummary: {
      routeId: manifest?.routeId,
      totalDeliveries: manifest?.totalDeliveries,
      dispatcher: manifest?.dispatcher?.displayName || manifest?.dispatcher?.name || null
    },
    gpsSpoofAnchorDeliveryId: gpsTarget?.delivery?.id || null,
    gpsSpoofAnchorSequence: gpsTarget?.delivery?.sequenceNumber || null,
    gpsSpoofTargetLocation: gpsSpoofTargetLocation
  };
}

const autoRunner = (() => {
  let active = false;
  let cycle = 0;
  let currentAttackId = null;
  let loopPromise = null;

  async function runLoop() {
    while (active) {
      cycle += 1;
      console.log(`[AUTONOMY] ==== Cycle ${cycle} ====`);
      try {
        let syntheticClient = null;
        try {
          syntheticClient = new SyntheticClient(SYNTHETIC_API_BASE);
          await syntheticClient.connect();
          console.log('[AUTONOMY] Starting synthetic route generation...');
          await startSyntheticSimulation(24);
          const manifest = await waitForManifest();
          if (!manifest) {
            throw new Error('Timed out waiting for synthetic manifest');
          }
          console.log(`[AUTONOMY] Received manifest ${manifest.routeId} for driver ${manifest.driver?.displayName || manifest.driver?.name}`);
          const attackConfig = buildAttackConfigFromManifest(manifest);
          attackConfig.syntheticManifest = manifest;
          const attackId = createAttackRecord(attackConfig);
          currentAttackId = attackId;
          
          console.log(`[AUTONOMY] Campaign Day ${attackConfig.day}: Targeting ${attackConfig.targetDriver}`);
          
          await kickoffAttack(attackId, attackConfig, syntheticClient);
          
          // Record results for campaign memory
          const metrics = getAttackMetrics(attackId);
          // Wait for metrics to be finalized if not yet done
          const finalStatus = db.prepare('SELECT success, phishing_success, gps_success, api_success FROM attacks WHERE id = ?').get(attackId);
          
          // Heuristic: If phishing failed, it was likely detected or ignored.
          // If Phishing succeeded but GPS/API failed, it might be partial detection.
          const wasDetected = !finalStatus.success && !finalStatus.phishing_success; 
          
          campaignManager.recordAttackResult(attackConfig.targetDriver, finalStatus.success, wasDetected);
          
          // Every 3 cycles, advance the day
          if (cycle % 3 === 0) {
             const newDay = campaignManager.incrementCampaignDay();
             console.log(`[AUTONOMY] 🌙 Night falls... Advancing to Campaign Day ${newDay}`);
          }
          
          await stopSyntheticSimulation();
        } finally {
          if (syntheticClient) {
            await syntheticClient.close().catch(() => {});
          }
        }
      } catch (error) {
        console.error(`[AUTONOMY] Cycle ${cycle} error: ${error.message}`);
      } finally {
        currentAttackId = null;
      }

      if (!active) break;
      console.log(`[AUTONOMY] Cycle ${cycle} complete. Waiting ${AUTO_LOOP_DELAY_MS}ms before next cycle.`);
      await delay(AUTO_LOOP_DELAY_MS);
    }
    console.log('[AUTONOMY] Auto attack runner idle.');
  }

  async function start() {
    if (active) {
      return { started: false, message: 'Auto runner already active' };
    }
    active = true;
    cycle = 0;
    console.log('[AUTONOMY] Auto attack runner engaged.');
    loopPromise = runLoop().catch(error => {
      console.error('[AUTONOMY] Runner crashed:', error);
      active = false;
    });
    return { started: true };
  }

  async function stop() {
    if (!active) {
      return { stopped: false, message: 'Auto runner not active' };
    }
    active = false;
    console.log('[AUTONOMY] Auto attack runner stopping after current cycle.');
    return { stopped: true };
  }

  function status() {
    return {
      active,
      cycle,
      currentAttackId
    };
  }

  return { start, stop, status };
})();

function initializeAttackMetrics(attackId) {
  attackMetricsTracker.set(attackId, {
    startTime: Date.now(),
    firstImpactTime: null,
    compromisedDeliveries: 0,
    affectedPatients: 0,
    criticalMedications: 0,
    financialImpact: 0,
    phishing: { attempted: false, success: false, effectiveness: 0, message: '', llm_evaluations: [], click_rate_prediction: 0 },
    gps: { attempted: false, success: false, effectiveness: 0, spoofed_location: null, diversion_distance: 0 },
    api: { attempted: false, success: false, effectiveness: 0, alerts_sent: 0, bury_position: 0 },
    logs: [],
    decision_events: []
  });
}

function updateAttackMetrics(attackId, updates) {
  const metrics = attackMetricsTracker.get(attackId);
  if (!metrics) return;
  
  // Deep merge for nested objects
  if (updates.phishing) {
    metrics.phishing = { ...metrics.phishing, ...updates.phishing };
    delete updates.phishing;
  }
  if (updates.gps) {
    metrics.gps = { ...metrics.gps, ...updates.gps };
    delete updates.gps;
  }
  if (updates.api) {
    metrics.api = { ...metrics.api, ...updates.api };
    delete updates.api;
  }
  
  Object.assign(metrics, updates);
  attackMetricsTracker.set(attackId, metrics);
}

function getAttackMetrics(attackId) {
  return attackMetricsTracker.get(attackId) || null;
}

async function saveAttackToChroma(attackId, attackConfig, status, success, metrics, errorMessage = null) {
  try {
    const inMemoryMetrics = attackMetricsTracker.get(attackId) || {};
    
    // Get decision events from SQLite
    const decisionEventsStmt = db.prepare('SELECT * FROM decision_event_logs WHERE attack_id = ? ORDER BY id ASC');
    const decisionEvents = decisionEventsStmt.all(attackId);
    
    // Get all logs from SQLite
    const logsStmt = db.prepare('SELECT * FROM logs WHERE attack_id = ? ORDER BY timestamp');
    const allLogs = logsStmt.all(attackId);
    
    const attackLog = new AttackLog({
      attackId,
      timestamp: new Date(),
      config: attackConfig,
      status,
      success,
      
      // Metrics
      duration_seconds: metrics?.duration_seconds,
      compromised_deliveries: metrics?.compromised_deliveries || inMemoryMetrics.compromisedDeliveries,
      affected_patients: metrics?.affected_patients || inMemoryMetrics.affectedPatients,
      critical_medications: metrics?.critical_medications || inMemoryMetrics.criticalMedications,
      financial_impact: metrics?.financial_impact || inMemoryMetrics.financialImpact,
      time_to_impact_seconds: metrics?.time_to_impact_seconds,
      detection_delay_seconds: metrics?.detection_delay_seconds,
      recovery_time_minutes: metrics?.recovery_time_minutes,
      
      // Vector details
      phishing: {
        attempted: inMemoryMetrics.phishing?.attempted || false,
        success: metrics?.phishing_success === 1 || inMemoryMetrics.phishing?.success || false,
        effectiveness: metrics?.phishing_effectiveness || inMemoryMetrics.phishing?.effectiveness || 0,
        message: inMemoryMetrics.phishing?.message || '',
        llm_evaluations: inMemoryMetrics.phishing?.llm_evaluations || [],
        click_rate_prediction: inMemoryMetrics.phishing?.click_rate_prediction || 0
      },
      gps: {
        attempted: inMemoryMetrics.gps?.attempted || false,
        success: metrics?.gps_success === 1 || inMemoryMetrics.gps?.success || false,
        effectiveness: metrics?.gps_effectiveness || inMemoryMetrics.gps?.effectiveness || 0,
        spoofed_location: inMemoryMetrics.gps?.spoofed_location || attackConfig.gpsSpoofTargetLocation,
        diversion_distance: inMemoryMetrics.gps?.diversion_distance || 0
      },
      api: {
        attempted: inMemoryMetrics.api?.attempted || false,
        success: metrics?.api_success === 1 || inMemoryMetrics.api?.success || false,
        effectiveness: metrics?.api_effectiveness || inMemoryMetrics.api?.effectiveness || 0,
        alerts_sent: inMemoryMetrics.api?.alerts_sent || 0,
        bury_position: inMemoryMetrics.api?.bury_position || 0
      },
      
      // Logs and events
      logs: allLogs.map(log => ({
        agent: log.agent,
        message: log.message,
        timestamp: new Date(log.timestamp)
      })),
      decision_events: decisionEvents.map(event => ({
        event_type: event.event_type,
        agent: event.agent,
        vector: event.vector,
        description: event.description,
        outcome: event.outcome,
        impact: event.impact,
        agent_reasoning: event.agent_reasoning,
        detection_risk: event.detection_risk,
        compromise_rate: event.compromise_rate,
        sim_minute: event.sim_minute,
        metadata: event.metadata,
        created_at: new Date(event.created_at)
      })),
      
      synthetic_manifest: attackConfig.syntheticManifest,
      
      // Error info if failed
      error: errorMessage ? { message: errorMessage, timestamp: new Date() } : undefined
    });
    
    // Save as embedding to ChromaDB vector database
    await attackLog.save();
    console.log(`✅ Attack ${attackId} saved to ChromaDB as vector embedding`);
  } catch (error) {
    console.error(`❌ Failed to save attack ${attackId} to ChromaDB:`, error.message);
  }
}

function finalizeAttackMetrics(attackId) {
  const metrics = attackMetricsTracker.get(attackId);
  if (!metrics) return null;
  
  const endTime = Date.now();
  const durationSeconds = Math.round((endTime - metrics.startTime) / 1000);
  
  let timeToImpactSeconds = null;
  if (metrics.firstImpactTime) {
    timeToImpactSeconds = Math.round((metrics.firstImpactTime - metrics.startTime) / 1000);
  }
  
  // Calculate detection delay (typically 30s after GPS spoofing)
  const detectionDelaySeconds = metrics.gps.success ? 30 : null;
  
  // Calculate recovery time (12 min per compromised delivery)
  const recoveryTimeMinutes = metrics.compromisedDeliveries * 12;
  
  const finalMetrics = {
    duration_seconds: durationSeconds,
    compromised_deliveries: metrics.compromisedDeliveries,
    affected_patients: metrics.affectedPatients,
    critical_medications: metrics.criticalMedications,
    financial_impact: metrics.financialImpact,
    time_to_impact_seconds: timeToImpactSeconds,
    detection_delay_seconds: detectionDelaySeconds,
    recovery_time_minutes: recoveryTimeMinutes,
    phishing_success: metrics.phishing.success ? 1 : 0,
    phishing_effectiveness: metrics.phishing.effectiveness,
    gps_success: metrics.gps.success ? 1 : 0,
    gps_effectiveness: metrics.gps.effectiveness,
    api_success: metrics.api.success ? 1 : 0,
    api_effectiveness: metrics.api.effectiveness
  };
  
  // Clean up
  attackMetricsTracker.delete(attackId);
  
  return finalMetrics;
}

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
const campaignManager = new CampaignManager(db);

// Migrate database schema
// Check if new columns exist, if not add them
try {
  const tableInfo = db.pragma('table_info(attacks)');
  const columnNames = tableInfo.map(col => col.name);
  
  const newColumns = [
    { name: 'duration_seconds', type: 'INTEGER' },
    { name: 'compromised_deliveries', type: 'INTEGER', default: 0 },
    { name: 'affected_patients', type: 'INTEGER', default: 0 },
    { name: 'critical_medications', type: 'INTEGER', default: 0 },
    { name: 'financial_impact', type: 'INTEGER', default: 0 },
    { name: 'time_to_impact_seconds', type: 'INTEGER' },
    { name: 'detection_delay_seconds', type: 'INTEGER' },
    { name: 'recovery_time_minutes', type: 'INTEGER' },
    { name: 'phishing_success', type: 'BOOLEAN' },
    { name: 'phishing_effectiveness', type: 'INTEGER' },
    { name: 'gps_success', type: 'BOOLEAN' },
    { name: 'gps_effectiveness', type: 'INTEGER' },
    { name: 'api_success', type: 'BOOLEAN' },
    { name: 'api_effectiveness', type: 'INTEGER' }
  ];
  
  newColumns.forEach(col => {
    if (!columnNames.includes(col.name)) {
      const defaultClause = col.default !== undefined ? ` DEFAULT ${col.default}` : '';
      db.exec(`ALTER TABLE attacks ADD COLUMN ${col.name} ${col.type}${defaultClause}`);
      console.log(`Added column: ${col.name}`);
    }
  });
} catch (error) {
  // Table doesn't exist, create it
  db.exec(`
    CREATE TABLE IF NOT EXISTS attacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      config TEXT,
      status TEXT DEFAULT 'pending',
      success BOOLEAN,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      duration_seconds INTEGER,
      compromised_deliveries INTEGER DEFAULT 0,
      affected_patients INTEGER DEFAULT 0,
      critical_medications INTEGER DEFAULT 0,
      financial_impact INTEGER DEFAULT 0,
      time_to_impact_seconds INTEGER,
      detection_delay_seconds INTEGER,
      recovery_time_minutes INTEGER,
      phishing_success BOOLEAN,
      phishing_effectiveness INTEGER,
      gps_success BOOLEAN,
      gps_effectiveness INTEGER,
      api_success BOOLEAN,
      api_effectiveness INTEGER
    )
  `);
}

// Create other tables
db.exec(`
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

  CREATE TABLE IF NOT EXISTS decision_event_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attack_id INTEGER NOT NULL,
    event_type TEXT,
    agent TEXT,
    vector TEXT,
    description TEXT,
    outcome TEXT,
    impact TEXT,
    agent_reasoning TEXT,
    detection_risk REAL,
    compromise_rate REAL,
    sim_minute INTEGER,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS decision_state_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attack_id INTEGER NOT NULL,
    snapshot_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    sim_minute INTEGER,
    compromised_deliveries INTEGER,
    total_deliveries INTEGER,
    compromise_rate REAL,
    detection_alerts INTEGER,
    average_patient_health REAL,
    active_vectors TEXT,
    metadata TEXT
  );
`);

purgeExpiredSessions(db);
setInterval(() => purgeExpiredSessions(db), 60 * 60 * 1000);

humanOversight.init({ io, log, db });

decisionEngine.init({
  db,
  io,
  humanOversight,
  triggerAgent: agents.triggerAgent,
  metricsTracker: { getAttackMetrics, updateAttackMetrics },
  config,
  logFn: log,
  syntheticApiBase: process.env.SYNTHETIC_API_BASE || 'http://localhost:8007'
});

io.use((socket, next) => {
  socket.user = {
    id: 'autonomous-operator',
    username: 'autonomous',
    displayName: 'Autonomous Operator'
  };
  return next();
});

// Helper function to log messages
function log(attackId, agent, message, io, db) {
  const timestamp = new Date().toISOString();
  
  // Save to database
  const stmt = db.prepare('INSERT INTO logs (attack_id, agent, message) VALUES (?, ?, ?)');
  stmt.run(attackId, agent, message);
  
  // Add to in-memory metrics for ChromaDB export
  const metrics = attackMetricsTracker.get(attackId);
  if (metrics) {
    metrics.logs.push({ agent, message, timestamp: new Date(timestamp) });
  }
  
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

  decisionEngine.recordExternalEvent({ attackId, agent, message });
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
        await agents.triggerAgent('phishing', parseInt(attackId), attackConfig, io, db, config, log);
      } catch (error) {
        console.error('Error executing phishing retry:', error);
      }
    } else if (suggestion.action === 'gps' || suggestion.action === 'api' || suggestion.action === 'orchestrator') {
      try {
        await agents.triggerAgent(suggestion.action, parseInt(attackId), attackConfig, io, db, config, log);
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
  req.sessionToken = null;
  req.user = {
    id: 'autonomous-operator',
    username: 'autonomous',
    displayName: 'Autonomous Operator'
  };
  return next();
}

// API endpoints
app.get('/api/config', authenticate, (req, res) => {
  res.json(config);
});

app.post('/api/attacks/create', authenticate, (req, res) => {
  const attackConfig = req.body.config || config.attack;
  const attackId = createAttackRecord(attackConfig);
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
  
  kickoffAttack(attackId, attackConfig, null);
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

app.post('/api/attacks/:id/stop', authenticate, (req, res) => {
  const attackId = parseInt(req.params.id);
  
  // Update attack status to stopped
  const stmt = db.prepare('UPDATE attacks SET status = ? WHERE id = ?');
  stmt.run('stopped', attackId);
  
  // Log the stop event
  log(attackId, 'System', '🛑 Attack stopped by user', io, db);
  
  // Emit stop event to all clients
  io.emit('attack:stopped', { attackId });
  
  console.log(`Attack ${attackId} stopped by user`);
  decisionEngine.stop(attackId);
  res.json({ success: true, message: 'Attack stopped' });
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

app.get('/api/attacks/:id/events', authenticate, (req, res) => {
  const attackId = parseInt(req.params.id);
  const stmt = db.prepare(`
    SELECT id, event_type, agent, vector, description, outcome, impact, agent_reasoning,
           detection_risk, compromise_rate, sim_minute, metadata, created_at
    FROM decision_event_logs
    WHERE attack_id = ?
    ORDER BY id ASC
  `);
  const events = stmt.all(attackId);
  res.json({ attackId, events });
});

app.get('/api/attacks/:id/snapshots', authenticate, (req, res) => {
  const attackId = parseInt(req.params.id);
  const stmt = db.prepare(`
    SELECT id, snapshot_time, sim_minute, compromised_deliveries, total_deliveries,
           compromise_rate, detection_alerts, average_patient_health, active_vectors, metadata
    FROM decision_state_snapshots
    WHERE attack_id = ?
    ORDER BY sim_minute ASC
  `);
  const snapshots = stmt.all(attackId);
  res.json({ attackId, snapshots });
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

app.post('/api/autonomous/start', authenticate, async (req, res) => {
  const result = await autoRunner.start();
  res.json({
    success: true,
    result,
    status: autoRunner.status()
  });
});

app.post('/api/autonomous/stop', authenticate, async (req, res) => {
  const result = await autoRunner.stop();
  res.json({
    success: true,
    result,
    status: autoRunner.status()
  });
});

app.get('/api/autonomous/status', authenticate, (req, res) => {
  res.json({
    success: true,
    status: autoRunner.status()
  });
});

// Pattern Learning System Endpoints
app.get('/api/learning/patterns', authenticate, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours || '24', 10);
    const patterns = await learningSystem.analyzePatterns(hours);
    res.json({ success: true, patterns });
  } catch (error) {
    console.error('Error fetching patterns:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/learning/strategy', authenticate, async (req, res) => {
  try {
    const strategy = await learningSystem.getStrategyRecommendations();
    res.json({ success: true, strategy });
  } catch (error) {
    console.error('Error fetching strategy:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/learning/report', authenticate, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours || '24', 10);
    const report = await learningSystem.generateReport(hours);
    res.json({ success: true, report });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Semantic Search Endpoints (ChromaDB Vector Database)
app.post('/api/learning/similar', authenticate, async (req, res) => {
  try {
    const { attackPattern, nResults = 5 } = req.body;
    if (!attackPattern) {
      return res.status(400).json({ success: false, error: 'attackPattern is required' });
    }
    const similar = await learningSystem.findSimilarSuccessfulAttacks(attackPattern, nResults);
    res.json({ success: true, similar });
  } catch (error) {
    console.error('Error finding similar attacks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/learning/semantic-recommendations', authenticate, async (req, res) => {
  try {
    const { currentState } = req.body;
    if (!currentState) {
      return res.status(400).json({ success: false, error: 'currentState is required' });
    }
    const recommendations = await learningSystem.getSemanticRecommendations(currentState);
    res.json({ success: true, recommendations });
  } catch (error) {
    console.error('Error getting semantic recommendations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/vector-db/stats', authenticate, async (req, res) => {
  try {
    const stats = await chromaClient.getCollectionStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting vector DB stats:', error);
    res.status(500).json({ success: false, error: error.message });
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
    await agents.triggerAgent(agentName, parseInt(attackId), attackConfig, io, db, config, log, tier);
    
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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`
🚀 Attack Control Server
   http://localhost:${PORT}
   WebSocket ready
   Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

module.exports = { app, io, db, log, broadcastAttackUpdate };


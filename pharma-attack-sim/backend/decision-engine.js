const fetch = (...args) => import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args));
const { getAttackState } = require('./llm-suggestions');

const TARGET_COMPROMISE_RATE = 0.30;
const DEFAULT_TOTAL_DELIVERIES = 50;
const DEFAULT_SIM_MINUTE_MS = parseInt(process.env.SIM_MINUTE_MS || '1000', 10);
const DEFAULT_TOTAL_MINUTES = 24 * 60;
const DEFAULT_SNAPSHOT_INTERVAL = 30;
const SYNTHETIC_REFRESH_INTERVAL = 5; // simulation minutes

// Default risk tolerance settings (can be overridden via attackConfig)
const DEFAULT_RISK_TOLERANCE = {
  posture: 'balanced', // 'stealth', 'balanced', 'aggressive', 'blitz'
  detectionRiskThreshold: 0.65,
  holdAttackThreshold: 0.85,
  baseDetectionRisk: 0.20,
  alertPenaltyMultiplier: 0.12,
  failedVectorPenalty: { api: 0.10, gps: 0.08 },
  stealthPriority: 0.5,
  cascadeBonus: 0.15
};

// Default targeting settings (can be overridden via attackConfig)
const DEFAULT_TARGETING = {
  strategy: 'opportunistic', // 'opportunistic', 'round-robin', 'persistent', 'fresh'
  preferredTier: 'tier2',
  avoidRecentlyDetected: true,
  vigilanceThreshold: 0.30,
  susceptibilityMinimum: 0.40,
  randomizationFactor: 0.10
};

const VECTOR_AGENT_MAP = {
  orchestrator: 'orchestrator',
  phishing: 'phishing',
  gps: 'gps',
  api: 'api',
  dispatcher_cascade: 'api'
};

const VECTOR_LABELS = {
  orchestrator: 'Route Recon & Planning',
  phishing: 'Phishing Credential Harvest',
  gps: 'GPS Spoof & Driver Diversion',
  api: 'Dispatcher API Flood',
  dispatcher_cascade: 'Dispatcher Cascade Attack'
};

const loops = new Map();

let context = {
  db: null,
  io: null,
  humanOversight: null,
  triggerAgent: null,
  metricsTracker: null,
  logFn: null,
  config: null,
  syntheticApiBase: 'http://localhost:8007'
};

function init(options = {}) {
  context = {
    ...context,
    ...options,
    syntheticApiBase: (options.syntheticApiBase || 'http://localhost:8007').replace(/\/$/, '')
  };
}

function start(attackId, attackConfig, options = {}) {
  if (!context.db || loops.has(attackId)) {
    return;
  }

  // Merge runtime config with defaults
  const riskTolerance = {
    ...DEFAULT_RISK_TOLERANCE,
    ...(context.config?.riskTolerance || {}),
    ...(attackConfig?.riskTolerance || {})
  };

  const targeting = {
    ...DEFAULT_TARGETING,
    ...(context.config?.targeting || {}),
    ...(attackConfig?.targeting || {})
  };

  const loopState = {
    attackId,
    attackConfig,
    riskTolerance,
    targeting,
    simMinute: 0,
    totalSimMinutes: options.totalSimMinutes || DEFAULT_TOTAL_MINUTES,
    simMinuteMs: options.simMinuteDurationMs || DEFAULT_SIM_MINUTE_MS,
    snapshotInterval: options.snapshotInterval || DEFAULT_SNAPSHOT_INTERVAL,
    pendingVectors: new Set(),
    lastDecision: null,
    lastEvaluation: null,
    ticking: false,
    syntheticCache: null,
    lastSyntheticMinute: -Infinity,
    syntheticRefreshInterval: options.syntheticRefreshInterval || SYNTHETIC_REFRESH_INTERVAL
  };

  loops.set(attackId, loopState);

  // Run initial evaluation immediately
  tick(loopState, true);
  loopState.interval = setInterval(() => tick(loopState, false), loopState.simMinuteMs);
}

function stop(attackId) {
  const loopState = loops.get(attackId);
  if (!loopState) return;

  if (loopState.interval) {
    clearInterval(loopState.interval);
  }

  if (loopState.lastEvaluation) {
    recordStateSnapshot(loopState.attackId, loopState.simMinute, loopState.lastEvaluation, true);
  }

  loops.delete(attackId);
}

function getSimMinute(attackId) {
  const loopState = loops.get(attackId);
  return loopState?.simMinute ?? null;
}

async function tick(loopState, isInitial) {
  if (loopState.ticking) return;
  loopState.ticking = true;

  if (!isInitial) {
    loopState.simMinute += 1;
  }

  try {
    const evaluation = await evaluateState(loopState);
    loopState.lastEvaluation = evaluation;

    recordEventLog(loopState.attackId, {
      eventType: 'decision_evaluation',
      vector: evaluation.vector,
      description: `Decision engine evaluated state at minute ${loopState.simMinute}`,
      outcome: 'evaluated',
      impact: {
        compromisedDeliveries: evaluation.compromisedDeliveries,
        targetRate: TARGET_COMPROMISE_RATE
      },
      agentReasoning: evaluation.reason,
      detectionRisk: evaluation.detectionRisk,
      compromiseRate: evaluation.compromiseRate,
      simMinute: loopState.simMinute,
      metadata: {
        cascadeOpportunity: evaluation.cascadeOpportunity,
        aggressiveness: evaluation.aggressiveness,
        timeRemainingRatio: evaluation.timeRemainingRatio
      }
    });

    emitDecisionEvaluation(loopState.attackId, loopState.simMinute, evaluation, loopState);

    const snapshotDue = isInitial || loopState.simMinute % loopState.snapshotInterval === 0;
    if (snapshotDue) {
      recordStateSnapshot(loopState.attackId, loopState.simMinute, evaluation);
    }

    if (shouldQueueVector(loopState, evaluation)) {
      queueVectorAction(loopState, evaluation);
    }

    if (loopState.simMinute >= loopState.totalSimMinutes) {
      stop(loopState.attackId);
    }
  } catch (error) {
    console.error('[DecisionEngine] Tick error:', error.message);
  } finally {
    loopState.ticking = false;
  }
}

async function evaluateState(loopState) {
  const attackState = getAttackState(loopState.attackId);
  const metrics = context.metricsTracker?.getAttackMetrics(loopState.attackId) || {};
  const riskTolerance = loopState.riskTolerance || DEFAULT_RISK_TOLERANCE;

  const syntheticState = await getSyntheticState(loopState);

  const totalDeliveries =
    syntheticState?.totalDeliveries ||
    attackState?.totalDeliveries ||
    loopState.attackConfig?.totalDeliveries ||
    DEFAULT_TOTAL_DELIVERIES;

  const compromisedDeliveries =
    metrics.compromisedDeliveries ??
    attackState?.impactMetrics?.packages ??
    0;

  const compromiseRate = totalDeliveries
    ? Number((compromisedDeliveries / totalDeliveries).toFixed(3))
    : 0;

  const detectionAlerts = (attackState.failedSteps || []).length;
  
  // Use configurable risk tolerance values
  const failedVectorPenalty = riskTolerance.failedVectorPenalty || DEFAULT_RISK_TOLERANCE.failedVectorPenalty;
  const detectionRisk = Math.min(
    1,
    riskTolerance.baseDetectionRisk +
      detectionAlerts * riskTolerance.alertPenaltyMultiplier +
      (metrics.api?.attempted && !metrics.api?.success ? failedVectorPenalty.api : 0) +
      (metrics.gps?.attempted && !metrics.gps?.success ? failedVectorPenalty.gps : 0)
  );

  const activeDeliveries = syntheticState?.activeDeliveries ?? 0;
  const dispatcherLoad =
    syntheticState?.dispatcher?.supervision_scope?.drivers_supervised?.length || 0;

  const cascadeOpportunity = activeDeliveries >= 6 || dispatcherLoad >= 5;

  const timeRemainingRatio = Math.max(
    0,
    (loopState.totalSimMinutes - loopState.simMinute) / loopState.totalSimMinutes
  );

  const compromiseGap = Math.max(0, TARGET_COMPROMISE_RATE - compromiseRate);
  
  // Apply posture-based aggressiveness modifiers
  let postureModifier = 0;
  switch (riskTolerance.posture) {
    case 'stealth':
      postureModifier = -0.3; // Much more cautious
      break;
    case 'aggressive':
      postureModifier = 0.2; // Push harder
      break;
    case 'blitz':
      postureModifier = 0.4; // Maximum aggression
      break;
    default: // 'balanced'
      postureModifier = 0;
  }

  const cascadeBonus = riskTolerance.cascadeBonus || DEFAULT_RISK_TOLERANCE.cascadeBonus;
  const stealthFactor = riskTolerance.stealthPriority || DEFAULT_RISK_TOLERANCE.stealthPriority;
  
  const aggressiveness = Math.min(
    1,
    Math.max(
      0,
      compromiseGap * 2 + 
      (1 - timeRemainingRatio) * 0.5 - 
      detectionRisk * stealthFactor - 
      (cascadeOpportunity ? cascadeBonus : 0) +
      postureModifier
    )
  );

  const vector = selectVector({
    attackState,
    detectionRisk,
    aggressiveness,
    cascadeOpportunity,
    riskTolerance
  });

  const averagePatientHealth = computeAveragePatientHealth(compromiseRate, detectionAlerts);

  const reason = buildReason({
    vector,
    compromiseRate,
    detectionRisk,
    cascadeOpportunity,
    aggressiveness,
    timeRemainingRatio
  });

  return {
    vector,
    reason,
    compromiseRate,
    detectionRisk,
    cascadeOpportunity,
    aggressiveness,
    compromisedDeliveries,
    totalDeliveries,
    detectionAlerts,
    timeRemainingRatio,
    syntheticState,
    averagePatientHealth
  };
}

function selectVector({ attackState, detectionRisk, aggressiveness, cascadeOpportunity, riskTolerance }) {
  const threshold = riskTolerance?.detectionRiskThreshold ?? DEFAULT_RISK_TOLERANCE.detectionRiskThreshold;
  
  if (!attackState.completedSteps.includes('orchestrator')) {
    return 'orchestrator';
  }
  if (!attackState.completedSteps.includes('phishing')) {
    return 'phishing';
  }

  // Use configurable detection risk threshold
  if (cascadeOpportunity && detectionRisk < threshold) {
    return 'gps';
  }

  // Adjust aggressiveness threshold based on posture
  let aggressivenessThreshold = 0.6;
  if (riskTolerance?.posture === 'stealth') {
    aggressivenessThreshold = 0.8; // Require higher aggressiveness to switch to API
  } else if (riskTolerance?.posture === 'aggressive' || riskTolerance?.posture === 'blitz') {
    aggressivenessThreshold = 0.4; // Lower threshold, more willing to use API
  }

  if (aggressiveness > aggressivenessThreshold) {
    return 'api';
  }

  return 'gps';
}

function buildReason({ vector, compromiseRate, detectionRisk, cascadeOpportunity, aggressiveness, timeRemainingRatio }) {
  const formattedPercent = (value) => `${Math.round(value * 100)}%`;
  const parts = [
    `Compromise rate at ${formattedPercent(compromiseRate)} vs target ${formattedPercent(TARGET_COMPROMISE_RATE)}.`,
    `Detection risk evaluated at ${formattedPercent(detectionRisk)}.`,
    `Time remaining ${(timeRemainingRatio * 24).toFixed(1)}h equivalent.`
  ];

  if (cascadeOpportunity) {
    parts.push('Dispatcher supervision density enables cascade leverage.');
  }

  if (aggressiveness > 0.6) {
    parts.push('Aggressive stance required to reach compromise target.');
  } else {
    parts.push('Maintaining stealth posture while progressing compromise rate.');
  }

  return `Vector ${VECTOR_LABELS[vector] || vector}: ${parts.join(' ')}`;
}

async function getSyntheticState(loopState) {
  if (
    loopState.syntheticCache &&
    loopState.simMinute - loopState.lastSyntheticMinute < loopState.syntheticRefreshInterval
  ) {
    return loopState.syntheticCache;
  }

  const statsUrl = `${context.syntheticApiBase}/api/synthetic/stats`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(statsUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`Synthetic stats request failed (${response.status})`);
    }
    const data = await response.json();
    loopState.syntheticCache = data;
    loopState.lastSyntheticMinute = loopState.simMinute;
    return data;
  } catch (error) {
    console.warn('[DecisionEngine] Synthetic stats unavailable:', error.message);
    return loopState.syntheticCache;
  }
}

function shouldQueueVector(loopState, evaluation) {
  if (!evaluation.vector) return false;
  if (!context.humanOversight) return false;
  if (loopState.pendingVectors.has(evaluation.vector)) return false;

  const riskTolerance = loopState.riskTolerance || DEFAULT_RISK_TOLERANCE;

  // Avoid repeated recommendations unless enough simulated time has passed
  if (
    loopState.lastDecision &&
    loopState.lastDecision.vector === evaluation.vector &&
    loopState.simMinute - loopState.lastDecision.simMinute < 30
  ) {
    return false;
  }

  // Use configurable hold attack threshold
  // If detection risk is extremely high and we still have time, hold (unless blitz mode)
  const holdThreshold = riskTolerance.holdAttackThreshold ?? DEFAULT_RISK_TOLERANCE.holdAttackThreshold;
  
  if (riskTolerance.posture !== 'blitz') {
    if (evaluation.detectionRisk > holdThreshold && evaluation.timeRemainingRatio > 0.2) {
      return false;
    }
  }

  return true;
}

function queueVectorAction(loopState, evaluation) {
  const vector = evaluation.vector;
  const riskTolerance = loopState.riskTolerance || DEFAULT_RISK_TOLERANCE;
  const detectionThreshold = riskTolerance.detectionRiskThreshold ?? DEFAULT_RISK_TOLERANCE.detectionRiskThreshold;
  
  const severity = evaluation.detectionRisk > detectionThreshold ? 'medium' : 'high';
  const title = `Autonomous Decision: ${VECTOR_LABELS[vector] || vector}`;
  const postureLabel = riskTolerance.posture ? ` [${riskTolerance.posture.toUpperCase()}]` : '';
  const description = `${evaluation.reason} Compromise gap ${(TARGET_COMPROMISE_RATE - evaluation.compromiseRate).toFixed(2)} remaining.${postureLabel}`;

  const metadata = {
    evaluation,
    targetCompromiseRate: TARGET_COMPROMISE_RATE,
    riskTolerance,
    targeting: loopState.targeting
  };

  const actionRecord = context.humanOversight.enqueueAction({
    attackId: loopState.attackId,
    title,
    description,
    severity,
    category: 'autonomous-decision',
    metadata,
    requestedBy: 'AutonomousDecisionEngine',
    onApprove: (approver, notes) => {
      loopState.pendingVectors.delete(vector);
      loopState.lastDecision = { vector, simMinute: loopState.simMinute };
      recordEventLog(loopState.attackId, {
        eventType: 'decision_action',
        vector,
        agent: 'AutonomousDecisionEngine',
        description: `Decision approved by ${approver || 'unknown reviewer'}`,
        outcome: 'approved',
        agentReasoning: notes || description,
        detectionRisk: evaluation.detectionRisk,
        compromiseRate: evaluation.compromiseRate,
        simMinute: loopState.simMinute
      });
      executeVector(vector, loopState).catch((error) => {
        recordEventLog(loopState.attackId, {
          eventType: 'decision_action',
          vector,
          agent: 'AutonomousDecisionEngine',
          description: `Execution error: ${error.message}`,
          outcome: 'execution_error',
          simMinute: loopState.simMinute
        });
      });
    },
    onReject: (approver, notes) => {
      loopState.pendingVectors.delete(vector);
      recordEventLog(loopState.attackId, {
        eventType: 'decision_action',
        vector,
        agent: 'AutonomousDecisionEngine',
        description: `Decision rejected by ${approver || 'unknown reviewer'}`,
        outcome: 'rejected',
        agentReasoning: notes || description,
        detectionRisk: evaluation.detectionRisk,
        compromiseRate: evaluation.compromiseRate,
        simMinute: loopState.simMinute
      });
    }
  });

  loopState.pendingVectors.add(vector);

  recordEventLog(loopState.attackId, {
    eventType: 'decision_action',
    vector,
    agent: 'AutonomousDecisionEngine',
    description: `Queued HIL approval for ${title}`,
    outcome: 'queued',
    detectionRisk: evaluation.detectionRisk,
    compromiseRate: evaluation.compromiseRate,
    simMinute: loopState.simMinute,
    metadata: actionRecord
  });

  emitDecisionQueued(loopState.attackId, {
    vector,
    severity,
    simMinute: loopState.simMinute,
    detectionRisk: evaluation.detectionRisk,
    compromiseRate: evaluation.compromiseRate,
    description
  });
}

async function executeVector(vector, loopState) {
  const agentName = VECTOR_AGENT_MAP[vector];
  if (!agentName || typeof context.triggerAgent !== 'function') {
    return;
  }
  await context.triggerAgent(
    agentName,
    loopState.attackId,
    loopState.attackConfig,
    context.io,
    context.db,
    context.config,
    context.logFn
  );
}

function computeAveragePatientHealth(compromiseRate, detectionAlerts) {
  const baseline = 95;
  const penalty = compromiseRate * 70 + detectionAlerts * 4;
  return Math.max(30, Math.round(baseline - penalty));
}

function recordEventLog(attackId, payload) {
  if (!context.db || !attackId) return;
  try {
    const stmt = context.db.prepare(`
      INSERT INTO decision_event_logs (
        attack_id,
        event_type,
        agent,
        vector,
        description,
        outcome,
        impact,
        agent_reasoning,
        detection_risk,
        compromise_rate,
        sim_minute,
        metadata
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      attackId,
      payload.eventType || 'unknown',
      payload.agent || null,
      payload.vector || null,
      payload.description || null,
      payload.outcome || null,
      payload.impact ? JSON.stringify(payload.impact) : null,
      payload.agentReasoning || null,
      payload.detectionRisk ?? null,
      payload.compromiseRate ?? null,
      payload.simMinute ?? null,
      payload.metadata ? JSON.stringify(payload.metadata) : null
    );
  } catch (error) {
    console.error('[DecisionEngine] Failed to persist event log:', error.message);
  }
}

function recordStateSnapshot(attackId, simMinute, evaluation, isTerminal = false) {
  if (!context.db || !evaluation) return;
  try {
    const stmt = context.db.prepare(`
      INSERT INTO decision_state_snapshots (
        attack_id,
        sim_minute,
        compromised_deliveries,
        total_deliveries,
        compromise_rate,
        detection_alerts,
        average_patient_health,
        active_vectors,
        metadata,
        snapshot_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    stmt.run(
      attackId,
      simMinute,
      evaluation.compromisedDeliveries,
      evaluation.totalDeliveries,
      evaluation.compromiseRate,
      evaluation.detectionAlerts,
      evaluation.averagePatientHealth,
      JSON.stringify(getAttackState(attackId).completedSteps || []),
      JSON.stringify({
        cascadeOpportunity: evaluation.cascadeOpportunity,
        detectionRisk: evaluation.detectionRisk,
        aggressiveness: evaluation.aggressiveness,
        terminal: isTerminal
      })
    );
  } catch (error) {
    console.error('[DecisionEngine] Snapshot persistence error:', error.message);
  }
}

function emitDecisionEvaluation(attackId, simMinute, evaluation, loopState) {
  const riskTolerance = loopState?.riskTolerance || DEFAULT_RISK_TOLERANCE;
  const targeting = loopState?.targeting || DEFAULT_TARGETING;
  
  context.io?.emit('decision:evaluation', {
    attackId,
    simMinute,
    vector: evaluation.vector,
    detectionRisk: evaluation.detectionRisk,
    compromiseRate: evaluation.compromiseRate,
    cascadeOpportunity: evaluation.cascadeOpportunity,
    aggressiveness: evaluation.aggressiveness,
    averagePatientHealth: evaluation.averagePatientHealth,
    reason: evaluation.reason,
    config: {
      posture: riskTolerance.posture,
      detectionRiskThreshold: riskTolerance.detectionRiskThreshold,
      holdAttackThreshold: riskTolerance.holdAttackThreshold,
      targetingStrategy: targeting.strategy,
      preferredTier: targeting.preferredTier
    }
  });
}

function emitDecisionQueued(attackId, payload) {
  context.io?.emit('decision:queued', {
    attackId,
    ...payload
  });
}

function recordExternalEvent({ attackId, agent, message, outcome }) {
  if (!attackId) return;
  recordEventLog(attackId, {
    eventType: 'agent_log',
    agent,
    description: message,
    outcome: outcome || null,
    simMinute: getSimMinute(attackId)
  });
}

module.exports = {
  init,
  start,
  stop,
  getSimMinute,
  recordExternalEvent
};


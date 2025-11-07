// LLM-Powered Attack Suggestions and Auto-Decision System
const humanOversight = require('./human-oversight');

// Attack state tracking
const attackStates = {};

function updateAttackState(attackId, updates) {
  if (!attackStates[attackId]) {
    attackStates[attackId] = {
      phase: 'recon',
      completedSteps: [],
      failedSteps: [],
      currentTier: 'tier2',
      successRate: 0.35,
      impactMetrics: { packages: 0, patients: 0, financial: 0 },
      retryCounts: {},
      suggestions: []
    };
  }
  Object.assign(attackStates[attackId], updates);
  return attackStates[attackId];
}

function getAttackState(attackId) {
  return attackStates[attackId] || updateAttackState(attackId, {});
}

// LLM-powered suggestion engine
function generateSuggestion(attackId, context) {
  const state = getAttackState(attackId);
  const suggestions = [];
  
  // Analyze current state and generate contextual suggestions
  if (state.phase === 'recon' || state.completedSteps.length === 0) {
    suggestions.push({
      id: 'suggest-orchestrator',
      priority: 'high',
      action: 'orchestrator',
      title: 'Start Attack Planning',
      description: 'Run Orchestrator agent to analyze target and plan attack strategy. This is the first step in any attack.',
      reason: 'No attack plan exists yet. Orchestrator will analyze vulnerabilities and calculate success probabilities.',
      confidence: 0.95,
      autoExecute: false
    });
  }
  
  if (state.completedSteps.includes('orchestrator') && !state.completedSteps.includes('phishing')) {
    suggestions.push({
      id: 'suggest-phishing',
      priority: 'high',
      action: 'phishing',
      title: 'Launch Phishing Campaign',
      description: 'Test phishing messages across 4 LLM models and attempt credential harvesting.',
      reason: 'Attack plan is ready. Phishing is the primary entry point to gain credentials.',
      confidence: 0.90,
      autoExecute: false
    });
  }
  
  if (state.failedSteps.includes('phishing')) {
    const retryCount = state.retryCounts['phishing'] || 0;
    // Allow unlimited retries - analyst decides when to stop
    suggestions.push({
      id: 'suggest-retry-phishing',
      priority: 'critical',
      action: 'phishing',
      title: 'Retry Phishing with Different Strategy',
      description: 'Previous phishing attempt failed. Retrying with updated message crafted by LLMs.',
      reason: `Phishing failed ${retryCount + 1} time(s). LLM will adjust message tone and urgency to increase click rate.`,
      confidence: 0.75,
      autoExecute: true, // Requires HIL approval
      retryCount: retryCount + 1
    });
  }
  
  if (state.completedSteps.includes('phishing') && !state.completedSteps.includes('gps')) {
    suggestions.push({
      id: 'suggest-gps',
      priority: 'high',
      action: 'gps',
      title: 'Spoof GPS Coordinates',
      description: 'Now that credentials are harvested, inject fake GPS coordinates to divert driver from route.',
      reason: 'Credential access enables GPS manipulation. This will disrupt delivery routes and cause delays.',
      confidence: 0.85,
      autoExecute: false
    });
  }
  
  if (state.failedSteps.includes('gps') && state.completedSteps.includes('phishing')) {
    suggestions.push({
      id: 'suggest-api-flood',
      priority: 'medium',
      action: 'api',
      title: 'Bypass GPS Failure with API Flooding',
      description: 'GPS spoofing failed. Switch to API flooding to overwhelm dispatcher system instead.',
      reason: 'GPS attack failed but we still have credential access. API flooding can achieve similar disruption goals.',
      confidence: 0.80,
      autoExecute: true // Auto-fallback to API flooding
    });
  }
  
  if (state.completedSteps.includes('gps') && !state.completedSteps.includes('api')) {
    suggestions.push({
      id: 'suggest-api',
      priority: 'high',
      action: 'api',
      title: 'Flood API with Fake Alerts',
      description: 'GPS manipulation successful. Now flood the dispatcher API with fake alerts to bury real anomalies.',
      reason: 'GPS spoofing is working. API flooding will complete the attack by overwhelming the dispatcher.',
      confidence: 0.90,
      autoExecute: false
    });
  }
  
  if (state.failedSteps.includes('api')) {
    const retryCount = state.retryCounts['api'] || 0;
    if (retryCount < 1) {
      suggestions.push({
        id: 'suggest-retry-api',
        priority: 'medium',
        action: 'api',
        title: 'Retry API Flooding with Smaller Batch',
        description: 'Previous API flood was detected. Retrying with smaller, more stealthy alert batches.',
        reason: 'Initial API flood triggered detection. Smaller batches may evade anomaly filters.',
        confidence: 0.65,
        autoExecute: true,
        retryCount: retryCount + 1
      });
    }
  }
  
  // Suggest vulnerability exploits based on current state
  if (state.completedSteps.includes('orchestrator')) {
    if (!state.completedSteps.includes('exploit-driver-app')) {
      suggestions.push({
        id: 'suggest-exploit-driver',
        priority: 'medium',
        action: 'exploit',
        target: 'driver-app',
        title: 'Exploit Driver Mobile App Vulnerability',
        description: 'Exploit weak authentication in driver mobile app to gain additional access.',
        reason: 'Driver app has 65% vulnerability score. Exploiting now increases attack surface.',
        confidence: 0.75,
        autoExecute: false
      });
    }
    
    if (state.completedSteps.includes('phishing') && !state.completedSteps.includes('exploit-gps-service')) {
      suggestions.push({
        id: 'suggest-exploit-gps',
        priority: 'medium',
        action: 'exploit',
        target: 'gps-service',
        title: 'Exploit GPS Tracking Service',
        description: 'GPS service has weak coordinate validation. Exploit to enable route manipulation.',
        reason: 'GPS service vulnerability enables coordinate spoofing. This complements GPS agent attacks.',
        confidence: 0.80,
        autoExecute: false
      });
    }
  }
  
  // Prioritize suggestions
  suggestions.sort((a, b) => {
    const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  return suggestions.slice(0, 3); // Return top 3 suggestions
}

// Generate suggestion after any step completion or failure
function analyzeAndSuggest(attackId, step, success, io, log, db) {
  const state = getAttackState(attackId);
  
  // Update state
  if (success) {
    if (!state.completedSteps.includes(step)) {
      state.completedSteps.push(step);
    }
    // Remove from failed if it was there
    state.failedSteps = state.failedSteps.filter(s => s !== step);
  } else {
    if (!state.failedSteps.includes(step)) {
      state.failedSteps.push(step);
    }
    state.retryCounts[step] = (state.retryCounts[step] || 0) + 1;
  }
  
  // Update phase based on progress
  if (state.completedSteps.includes('api')) {
    state.phase = 'complete';
  } else if (state.completedSteps.includes('gps')) {
    state.phase = 'actions';
  } else if (state.completedSteps.includes('phishing')) {
    state.phase = 'exploitation';
  } else if (state.completedSteps.includes('orchestrator')) {
    state.phase = 'weaponization';
  }
  
  // Generate new suggestions
  const suggestions = generateSuggestion(attackId, { step, success });
  state.suggestions = suggestions;
  
  // Emit suggestions to frontend
  io.emit('llm:suggestion', {
    attackId,
    suggestions: suggestions.map(s => ({
      ...s,
      timestamp: new Date().toISOString()
    }))
  });
  
  // Auto-execute critical/high priority suggestions if autoExecute is true
  suggestions.forEach(suggestion => {
    if (suggestion.autoExecute && (suggestion.priority === 'critical' || suggestion.priority === 'high')) {
      humanOversight.enqueueAction({
        attackId,
        title: suggestion.title,
        description: suggestion.description,
        severity: suggestion.priority,
        metadata: { suggestion, sourceStep: step },
        requestedBy: 'LLM',
        onApprove: () => {
          if (typeof log === 'function') {
            log(attackId, 'LLM', `🤖 Human approved suggestion: ${suggestion.title}. Executing now.`, io, db);
          }
          io.emit('llm:auto-execute', {
            attackId,
            suggestion
          });
        },
        onReject: () => {
          if (typeof log === 'function') {
            log(attackId, 'LLM', `🧑‍⚖️ Human rejected suggestion: ${suggestion.title}.`, io, db);
          }
        }
      });
    }
  });
  
  return suggestions;
}

// Get current suggestions for an attack
function getSuggestions(attackId) {
  const state = getAttackState(attackId);
  return state.suggestions || generateSuggestion(attackId, {});
}

module.exports = {
  updateAttackState,
  getAttackState,
  generateSuggestion,
  analyzeAndSuggest,
  getSuggestions
};


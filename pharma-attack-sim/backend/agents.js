// AI Agents System
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { calculateTierBypass } = require('./auth-tiers');
const { analyzeAndSuggest, updateAttackState, getAttackState } = require('./llm-suggestions');
const { evaluatePhishingWithLLMs, fallbackClickRate } = require('./llm-providers');

// Metrics tracker reference (set by server)
let metricsTracker = null;

function setMetricsTracker(tracker) {
  metricsTracker = tracker;
}

function trackImpact(attackId, impactData) {
  if (!metricsTracker) return;
  
  const metrics = metricsTracker.getAttackMetrics(attackId);
  if (!metrics) return;
  
  const updates = {};
  
  // Track first impact time
  if (!metrics.firstImpactTime && (impactData.packages || impactData.patients)) {
    updates.firstImpactTime = Date.now();
  }
  
  // Accumulate impact
  if (impactData.packages) updates.compromisedDeliveries = (metrics.compromisedDeliveries || 0) + impactData.packages;
  if (impactData.patients) updates.affectedPatients = (metrics.affectedPatients || 0) + impactData.patients;
  if (impactData.critical) updates.criticalMedications = (metrics.criticalMedications || 0) + impactData.critical;
  if (impactData.financial) updates.financialImpact = (metrics.financialImpact || 0) + impactData.financial;
  
  metricsTracker.updateAttackMetrics(attackId, updates);
}

function trackVectorSuccess(attackId, vectorName, success, effectiveness) {
  if (!metricsTracker) return;
  
  const metrics = metricsTracker.getAttackMetrics(attackId);
  if (!metrics) return;
  
  const updates = {};
  updates[vectorName] = { attempted: true, success, effectiveness: success ? effectiveness : 0 };
  
  metricsTracker.updateAttackMetrics(attackId, updates);
}

// Orchestrator Agent - Plans attack and calculates success probability
async function OrchestratorAgent(attackId, attackConfig, io, db, config, log) {
  log(attackId, 'Orchestrator', '🧠 Analyzing target and planning attack strategy...', io, db);
  await sleep(1000);
  
  const targetDriver = attackConfig.targetDriver || config.attack.targetDriver;
  const baseSuccessRate = attackConfig.baseSuccessRate || config.attack.baseSuccessRate;
  
  log(attackId, 'Orchestrator', `🎯 Target identified: ${targetDriver}`, io, db);
  log(attackId, 'Orchestrator', `📊 Base success rate: ${(baseSuccessRate * 100).toFixed(0)}%`, io, db);
  
  // Emit tier analysis
  io.emit('tier:analysis', {
    attackId,
    targetTier: 'tier2',
    securityScore: 35,
    attackVector: 'Basic phishing',
    successRate: baseSuccessRate,
    recommendation: 'Target Tier 2 (Driver) - optimal vulnerability'
  });
  
  // Emit AI reasoning
  io.emit('ai:reasoning', {
    attackId,
    agent: 'Orchestrator',
    message: `Analyzing target: ${targetDriver}. Base success rate: ${(baseSuccessRate * 100).toFixed(0)}%. Planning multi-vector attack.`,
    nodeId: 'TARGET_ANALYSIS'
  });
  
  // Emit graph update (industry-standard phases)
  io.emit('graph:update', {
    attackId,
    currentNode: 'TARGET_ANALYSIS',
    path: ['RECON', 'OSINT', 'TARGET_ANALYSIS']
  });
  
  await sleep(800);
  
  // Calculate overall attack probability
  const phishingRate = baseSuccessRate;
  const gpsRate = 0.85;
  const apiRate = 0.70;
  
  const overallProbability = phishingRate * gpsRate * apiRate;
  
  log(attackId, 'Orchestrator', `⚡ Attack plan formulated. Overall success probability: ${(overallProbability * 100).toFixed(1)}%`, io, db);
  await sleep(500);
  
  io.emit('step:started', { attackId, step: 'orchestrator' });
  io.emit('step:completed', { attackId, step: 'orchestrator', success: true });
  
  // Update state and generate suggestions
  updateAttackState(attackId, { phase: 'weaponization', currentTier: attackConfig.targetTier || 'tier2' });
  analyzeAndSuggest(attackId, 'orchestrator', true, io, log, db);
  
  return { success: true, probability: overallProbability };
}

// Phishing Agent - Tests message across LLMs, applies calibration, Monte Carlo simulation
async function PhishingAgent(attackId, attackConfig, io, db, config, log) {
  log(attackId, 'Phishing', '🎣 Initializing phishing campaign...', io, db);
  io.emit('step:started', { attackId, step: 'phishing' });
  
  await sleep(1000);
  
  const targetDriver = attackConfig.targetDriver || config.attack.targetDriver;
  const baseSuccessRate = attackConfig.baseSuccessRate || config.attack.baseSuccessRate;
  const attackDay = attackConfig.day || config.attack.day;

  log(attackId, 'Phishing', '🤖 Evaluating phishing payload with MiniMax M2 & GLM 4.5...', io, db);

  // Generate different phishing messages based on retry count
  const state = getAttackState(attackId);
  const retryCount = state.retryCounts['phishing'] || 0;
  
  let phishingMessage;
  const messages = [
    `Hi ${targetDriver}, your medication delivery for Day ${attackDay} has a routing discrepancy. Please confirm your login within 30 minutes to avoid patient impact.`,
    `URGENT: ${targetDriver}, critical delivery alert for Day ${attackDay}! Patient safety at risk. Immediate verification required: [LINK]`,
    `${targetDriver} - FINAL NOTICE: Medication delivery Day ${attackDay} will be CANCELLED in 15 minutes. Click here to prevent patient harm: [LINK]`,
    `EMERGENCY: ${targetDriver}, multiple patients waiting for Day ${attackDay} delivery. System lockout in 10 minutes. VERIFY NOW: [LINK]`,
    `${targetDriver} - CRITICAL: Your supervisor has been notified of Day ${attackDay} delivery failure. Resolve immediately to avoid disciplinary action: [LINK]`,
    `ALERT: ${targetDriver}, pharmacy reporting Day ${attackDay} delivery as MISSING. Immediate action required or police will be contacted: [LINK]`
  ];
  
  // Use progressively more aggressive messages, cycle if needed
  phishingMessage = messages[Math.min(retryCount, messages.length - 1)];
  
  const llmPrompt = `Estimate the likelihood that the following phishing message convinces the target to click the malicious link. Provide reasoning and a single predicted click rate percentage.\n\nTarget persona: ${targetDriver}\nBaseline success expectation: ${(baseSuccessRate * 100).toFixed(0)}%\nRetry attempt: ${retryCount + 1}\nMessage:\n"""${phishingMessage}"""`;

  let llmTests = [];
  const transcriptEntries = [];
  try {
    const evaluations = await evaluatePhishingWithLLMs({ prompt: llmPrompt, config });
    if (evaluations.length) {
      for (const result of evaluations) {
        const percentage = (result.clickRate * 100).toFixed(0);
        const suffix = result.simulated ? ' (simulated fallback)' : '';
        const normalizedContent = Array.isArray(result.content)
          ? result.content.map(item => (typeof item === 'string' ? item : item?.text || '')).join('\n')
          : result.content;
        llmTests.push({ model: result.model, clickRate: result.clickRate });
        transcriptEntries.push({
          model: result.model,
          provider: result.provider,
          prompt: llmPrompt,
          response: normalizedContent,
          simulated: result.simulated,
          timestamp: new Date().toISOString()
        });
        if (!result.simulated) {
          llmTests[llmTests.length - 1].insight = normalizedContent;
        }
        log(attackId, 'Phishing', `  ✓ ${result.model}: ${percentage}% predicted click rate${suffix}`, io, db);
      }
    }
  } catch (error) {
    log(attackId, 'Phishing', `⚠️ LLM evaluation error: ${error.message}`, io, db);
  }

  if (llmTests.length < 2) {
    const fallbackModels = ['MiniMax M2 (historical)', 'GLM 4.5 (historical)'];
    fallbackModels.forEach((modelName, index) => {
      const rate = fallbackClickRate(index);
      llmTests.push({ model: modelName, clickRate: rate });
      log(attackId, 'Phishing', `  ~ ${modelName}: ${(rate * 100).toFixed(0)}% predicted click rate (benchmark)`, io, db);
      transcriptEntries.push({
        model: modelName,
        provider: 'Historical Benchmark',
        prompt: llmPrompt,
        response: `Simulated benchmark produced ${(rate * 100).toFixed(0)}% estimated click rate.`,
        simulated: true,
        timestamp: new Date().toISOString()
      });
    });
  }

  if (transcriptEntries.length) {
    io.emit('llm:transcript', {
      attackId,
      prompt: llmPrompt,
      entries: transcriptEntries
    });
  }

  llmTests.forEach(test => {
    if (test.insight) {
      io.emit('ai:reasoning', {
        attackId,
        agent: 'Phishing',
        message: `${test.model} insight: ${test.insight}`,
        nodeId: 'LLM_VALIDATION'
      });
    }
  });

  updateAttackState(attackId, {
    phishingMessage,
    llmEvaluations: llmTests,
    lastLLMModels: llmTests.map(test => test.model),
    lastLLMPrompt: llmPrompt
  });

  await sleep(500);
  
  let totalClickRate = 0;
  llmTests.forEach(test => {
    totalClickRate += test.clickRate;
  });
  
  const rawCTR = totalClickRate / llmTests.length;
  log(attackId, 'Phishing', `📈 Average raw click rate: ${(rawCTR * 100).toFixed(0)}%`, io, db);
  
  await sleep(800);
  
  // Apply calibration with heavy weight on configured base success rate
  const calibrationFactor = config.agents.phishing.calibrationFactor;
  const stressMultiplier = config.agents.phishing.stressMultiplier;
  
  // Blend LLM predictions with configured base rate (70% config, 30% LLM)
  const configWeight = 0.70;
  const llmWeight = 0.30;
  let calibratedRate = (baseSuccessRate * configWeight) + (rawCTR * calibrationFactor * stressMultiplier * llmWeight);
  
  // Apply retry boost (LLM-optimized messages are more effective)
  if (retryCount > 0) {
    const retryBoost = 1 + (retryCount * 0.15); // 15% boost per retry
    calibratedRate = Math.min(calibratedRate * retryBoost, 0.95); // Cap at 95%
    log(attackId, 'Phishing', `🔧 Applying calibration: (${(baseSuccessRate * 100).toFixed(0)}% config × ${configWeight}) + (${(rawCTR * 100).toFixed(0)}% LLM × ${llmWeight}) × ${retryBoost.toFixed(2)} (retry boost) = ${(calibratedRate * 100).toFixed(0)}%`, io, db);
  } else {
    log(attackId, 'Phishing', `🔧 Applying calibration: (${(baseSuccessRate * 100).toFixed(0)}% config × ${configWeight}) + (${(rawCTR * 100).toFixed(0)}% LLM × ${llmWeight}) = ${(calibratedRate * 100).toFixed(0)}%`, io, db);
  }

  // Update metrics for ChromaDB (now that calibratedRate is defined)
  if (metricsTracker) {
    metricsTracker.updateAttackMetrics(attackId, {
      phishing: {
        message: phishingMessage,
        llm_evaluations: llmTests,
        click_rate_prediction: calibratedRate
      }
    });
  }
  
  await sleep(1000);
  
  // Emit graph update (industry-standard phases)
  io.emit('graph:update', {
    attackId,
    currentNode: 'PHISHING',
    path: ['RECON', 'OSINT', 'TARGET_ANALYSIS', 'WEAPONIZE', 'PHISHING']
  });
  
  // Monte Carlo simulation
  log(attackId, 'Phishing', '🎲 Running Monte Carlo simulation...', io, db);
  await sleep(800);
  
  const random = Math.random();
  const success = random < calibratedRate;
  
  if (success) {
    log(attackId, 'Phishing', `✅ SUCCESS: Driver clicked link (random: ${(random * 100).toFixed(1)}% < ${(calibratedRate * 100).toFixed(0)}%)`, io, db);
    log(attackId, 'Phishing', '🔑 Credentials harvested successfully', io, db);
    
    // Emit AI reasoning
    io.emit('ai:reasoning', {
      attackId,
      agent: 'Phishing',
      message: `Successfully harvested credentials. Click rate: ${(calibratedRate * 100).toFixed(0)}%`,
      nodeId: 'EXPLOIT_SUCCESS'
    });
    
    io.emit('graph:update', {
      attackId,
      currentNode: 'EXPLOIT_SUCCESS',
      path: ['RECON', 'OSINT', 'TARGET_ANALYSIS', 'WEAPONIZE', 'PHISHING', 'LLM_VALIDATION', 'CRED_HARVEST', 'EXPLOIT_SUCCESS']
    });
    
    // Update impact with affected deliveries
    const impactData = {
      attackId,
      packages: 2,
      patients: 1,
      critical: 1,
      financial: 1500,
      deliveries: [
        {
          medication: 'Insulin (Humalog)',
          patient: 'Emma Thompson',
          route: 'Route 7A',
          priority: 'critical'
        },
        {
          medication: 'Blood Pressure Medication',
          patient: 'John Martinez',
          route: 'Route 7A',
          priority: 'urgent'
        }
      ],
      cascadeEffect: {
        title: 'Driver Credentials Compromised',
        description: 'Attacker gained access to driver system. All deliveries on Route 7A now at risk.'
      }
    };
    trackImpact(attackId, impactData);
    trackVectorSuccess(attackId, 'phishing', true, 85);
    io.emit('impact:updated', impactData);
  } else {
    log(attackId, 'Phishing', `❌ FAILED: Driver ignored message (random: ${(random * 100).toFixed(1)}% >= ${(calibratedRate * 100).toFixed(0)}%)`, io, db);
    trackVectorSuccess(attackId, 'phishing', false, 0);
    io.emit('graph:update', {
      attackId,
      currentNode: 'EXPLOIT_FAIL',
      path: ['RECON', 'OSINT', 'TARGET_ANALYSIS', 'WEAPONIZE', 'PHISHING', 'LLM_VALIDATION', 'CRED_HARVEST', 'EXPLOIT_FAIL']
    });
    
    // LLM analyzes failure and suggests next action (HIL will handle approval)
    log(attackId, 'LLM', '🤖 Analyzing phishing failure... Generating recovery strategy...', io, db);
    
    io.emit('step:completed', { attackId, step: 'phishing', success: false });
    
    // Generate suggestions (will create HIL request for retry)
    analyzeAndSuggest(attackId, 'phishing', false, io, log, db);
    
    return { success: false, clickRate: calibratedRate };
  }
  
  // Success path
  io.emit('step:completed', { attackId, step: 'phishing', success: true });
  
  // Update state on success
  updateAttackState(attackId, { 
    completedSteps: [...getAttackState(attackId).completedSteps, 'phishing'],
    phase: 'exploitation'
  });
  analyzeAndSuggest(attackId, 'phishing', true, io, log, db);
  
  return { success: true, clickRate: calibratedRate };
}

// GPS Agent - Spoofs coordinates and diverts driver
async function GPSAgent(attackId, attackConfig, io, db, config, log, syntheticClient = null) {
  log(attackId, 'GPS', '📍 Initializing GPS spoofing attack...', io, db);
  io.emit('step:started', { attackId, step: 'gps' });
  
  await sleep(1000);
  
  const fakeCoords = config.agents.gps.fakeCoordinates;
  const distanceOffRoute = config.agents.gps.distanceOffRoute;
  
  log(attackId, 'GPS', `🗺️ Injecting fake coordinates: [${fakeCoords[0]}, ${fakeCoords[1]}]`, io, db);
  
  // Emit graph update (industry-standard phases)
  io.emit('graph:update', {
    attackId,
    currentNode: 'GPS_MANIP',
    path: ['RECON', 'OSINT', 'TARGET_ANALYSIS', 'WEAPONIZE', 'PHISHING', 'LLM_VALIDATION', 'CRED_HARVEST', 'EXPLOIT_SUCCESS', 'INSTALL', 'C2_ESTABLISH', 'LATERAL_MOVE', 'GPS_MANIP']
  });
  
  await sleep(800);
  
  log(attackId, 'GPS', `📏 Driver diverted ${distanceOffRoute} miles off route`, io, db);
  await sleep(600);
  
  log(attackId, 'GPS', '🔄 Routing system recalculating...', io, db);
  await sleep(1000);
  
  log(attackId, 'GPS', '⚠️ Dispatcher receiving conflicting location data', io, db);
  await sleep(500);
  
  // GPS attack usually succeeds if phishing succeeded
  const success = Math.random() < 0.85;
  
  if (success) {
    log(attackId, 'GPS', '✅ GPS spoofing successful - driver following false route', io, db);
    if (attackConfig.gpsSpoofAnchorSequence) {
      log(attackId, 'GPS', `🚨 Driver diverted near stop #${attackConfig.gpsSpoofAnchorSequence}.`, io, db);
    }
    
    io.emit('ai:reasoning', {
      attackId,
      agent: 'GPS',
      message: `Driver diverted ${distanceOffRoute} miles off route. GPS injection successful.`,
      nodeId: 'GPS_MANIP'
    });
    
    io.emit('graph:update', {
      attackId,
      currentNode: 'GPS_MANIP',
      status: 'success'
    });
    
    if (syntheticClient) {
      try {
        await syntheticClient.triggerGpsSpoof({
          lat: attackConfig.gpsSpoofTargetLocation.lat,
          lng: attackConfig.gpsSpoofTargetLocation.lng,
          durationMs: (config.agents.gps.spoofDurationMs || 60000),
          message: `Driver location spoofed to match intended destination for delivery #${attackConfig.gpsSpoofAnchorSequence || '?'}`
        });
        log(attackId, 'GPS', '🌐 Synthetic industry stream notified about GPS diversion.', io, db);
      } catch (error) {
        log(attackId, 'GPS', `⚠️ Failed to inject GPS spoof into synthetic industry stream: ${error.message}`, io, db);
      }
    }
    
    // Update metrics for ChromaDB
    if (metricsTracker) {
      metricsTracker.updateAttackMetrics(attackId, {
        gps: {
          spoofed_location: attackConfig.gpsSpoofTargetLocation,
          diversion_distance: distanceOffRoute
        }
      });
    }

    // Update impact with route disruption
    const gpsImpactData = {
      attackId,
      packages: 3,
      patients: 2,
      critical: 1,
      financial: 2500,
      deliveries: [
        {
          medication: 'Chemotherapy (Taxol)',
          patient: 'Sarah Chen',
          route: 'Route 7A',
          priority: 'critical'
        },
        {
          medication: 'Antibiotic (Amoxicillin)',
          patient: 'Michael Roberts',
          route: 'Route 7A',
          priority: 'urgent'
        },
        {
          medication: 'Pain Management (Oxycodone)',
          patient: 'Lisa Anderson',
          route: 'Route 7A',
          priority: 'routine'
        }
      ],
      cascadeEffect: {
        title: 'Route Deviation - Driver Lost',
        description: `Driver diverted ${distanceOffRoute} miles off route. Multiple deliveries delayed beyond critical windows.`
      }
    };
    trackImpact(attackId, gpsImpactData);
    trackVectorSuccess(attackId, 'gps', true, 92);
    io.emit('impact:updated', gpsImpactData);
  } else {
    log(attackId, 'GPS', '❌ GPS spoofing detected - manual override activated', io, db);
    trackVectorSuccess(attackId, 'gps', false, 0);
    io.emit('graph:update', {
      attackId,
      currentNode: 'GPS_MANIP',
      status: 'failed'
    });
    
    // LLM suggests fallback strategy
    log(attackId, 'LLM', '🤖 GPS attack failed. Analyzing fallback options...', io, db);
    const suggestions = analyzeAndSuggest(attackId, 'gps', false, io, log, db);
    
    // Auto-fallback to API flooding if suggested
    const apiFallback = suggestions.find(s => s.autoExecute && s.action === 'api');
    if (apiFallback) {
      log(attackId, 'LLM', `🔄 Auto-executing fallback: ${apiFallback.title}`, io, db);
      io.emit('ai:reasoning', {
        attackId,
        agent: 'LLM',
        message: `GPS failed. Automatically switching to API flooding strategy to achieve disruption goals.`,
        nodeId: 'API_EXPLOIT'
      });
      // Emit event to trigger API flooding as fallback (avoid circular dependency)
      io.emit('llm:auto-execute', {
        attackId,
        suggestion: {
          id: 'auto-api-fallback',
          action: 'api',
          title: 'Bypass GPS Failure with API Flooding'
        }
      });
    }
  }
  
  if (success) {
    analyzeAndSuggest(attackId, 'gps', true, io, log, db);
  }
  
  await sleep(500);
  io.emit('step:completed', { attackId, step: 'gps', success });
  
  return { success, coordinates: fakeCoords, distance: distanceOffRoute };
}

// API Flooding Agent - Generates fake alerts and masks real anomaly
async function APIFloodingAgent(attackId, attackConfig, io, db, config, log, syntheticClient = null) {
  log(attackId, 'API', '💥 Initializing API flooding attack...', io, db);
  io.emit('step:started', { attackId, step: 'api' });
  
  await sleep(1000);
  
  const alertCount = config.agents.api.alertCount;
  const buryPosition = config.agents.api.buryPosition;
  
  log(attackId, 'API', `📨 Generating ${alertCount} fake alerts...`, io, db);
  
  // Emit graph update (industry-standard phases)
  io.emit('graph:update', {
    attackId,
    currentNode: 'API_EXPLOIT',
    path: ['RECON', 'OSINT', 'TARGET_ANALYSIS', 'WEAPONIZE', 'PHISHING', 'LLM_VALIDATION', 'CRED_HARVEST', 'EXPLOIT_SUCCESS', 'INSTALL', 'C2_ESTABLISH', 'LATERAL_MOVE', 'GPS_MANIP', 'API_EXPLOIT']
  });
  
  await sleep(1200);
  
  for (let i = 1; i <= 10; i++) {
    await sleep(200);
    log(attackId, 'API', `  📬 Sent alert batch ${i}/10 (${i * 5} alerts)`, io, db);
  }
  
  await sleep(800);
  
  log(attackId, 'API', `🎯 Real anomaly buried at position ${buryPosition} in alert queue`, io, db);
  await sleep(600);
  
  log(attackId, 'API', '🔥 System overwhelmed - processing capacity exceeded', io, db);
  await sleep(700);
  
  // API flooding usually succeeds if previous steps succeeded
  const success = Math.random() < 0.70;
  
  if (success) {
    log(attackId, 'API', '✅ API flooding successful - real alert missed by dispatcher', io, db);
    log(attackId, 'API', '🎯 Attack complete - operational disruption achieved', io, db);
    
    io.emit('ai:reasoning', {
      attackId,
      agent: 'API',
      message: `Generated ${alertCount} fake alerts. Real anomaly buried. System overwhelmed.`,
      nodeId: 'MISSION_COMPLETE'
    });
    
    io.emit('graph:update', {
      attackId,
      currentNode: 'MISSION_COMPLETE',
      path: ['RECON', 'OSINT', 'TARGET_ANALYSIS', 'WEAPONIZE', 'PHISHING', 'LLM_VALIDATION', 'CRED_HARVEST', 'EXPLOIT_SUCCESS', 'INSTALL', 'C2_ESTABLISH', 'LATERAL_MOVE', 'GPS_MANIP', 'API_EXPLOIT', 'MISSION_COMPLETE'],
      status: 'complete'
    });
    
    // Final impact update - system overwhelmed
    const apiImpactData = {
      attackId,
      packages: 5,
      patients: 4,
      critical: 2,
      financial: 5000,
      deliveries: [
        {
          medication: 'Epinephrine (EpiPen)',
          patient: 'David Park',
          route: 'Route 7A',
          priority: 'critical'
        },
        {
          medication: 'Insulin (Lantus)',
          patient: 'Maria Gonzalez',
          route: 'Route 7A',
          priority: 'critical'
        },
        {
          medication: 'Heart Medication (Digoxin)',
          patient: 'Robert Wilson',
          route: 'Route 7A',
          priority: 'urgent'
        },
        {
          medication: 'Thyroid Medication',
          patient: 'Jennifer Lee',
          route: 'Route 7A',
          priority: 'urgent'
        },
        {
          medication: 'Antidepressant (Zoloft)',
          patient: 'Thomas Brown',
          route: 'Route 7A',
          priority: 'routine'
        }
      ],
      cascadeEffect: {
        title: 'Dispatch System Overload',
        description: `${alertCount} fake alerts flooded system. Real emergency buried. Dispatcher unable to respond to legitimate route deviation.`
      }
    };
    trackImpact(attackId, apiImpactData);
    trackVectorSuccess(attackId, 'api', true, 78);
    io.emit('impact:updated', apiImpactData);
    
    // Update metrics for ChromaDB
    if (metricsTracker) {
      metricsTracker.updateAttackMetrics(attackId, {
        api: {
          alerts_sent: alertCount,
          bury_position: buryPosition
        }
      });
    }

    if (syntheticClient) {
      try {
        const alertPayloads = Array.from({ length: Math.min(5, Math.max(1, Math.floor(alertCount / 10))) }).map((_, idx) => ({
          severity: idx === 0 ? 'critical' : idx <= 2 ? 'warning' : 'info',
          source: 'Pharma Dispatch API',
          message: `Injected false alarm ${idx + 1} - ${idx === 0 ? 'Dispatch queue overload' : 'Secondary anomaly'}`,
          metadata: {
            attackId,
            vector: 'api_flood',
            batchIndex: idx + 1
          }
        }));
        await syntheticClient.pushApiAlerts(alertPayloads);
        log(attackId, 'API', '📡 Synthetic industry stream flooded with fake API alerts.', io, db);
      } catch (error) {
        log(attackId, 'API', `⚠️ Failed to send API alerts to synthetic industry stream: ${error.message}`, io, db);
      }
    }
  } else {
    log(attackId, 'API', '❌ API flooding detected - anomaly filter activated', io, db);
    trackVectorSuccess(attackId, 'api', false, 0);
    io.emit('graph:update', {
      attackId,
      currentNode: 'API_EXPLOIT',
      status: 'failed'
    });
    
    // LLM suggests retry with different strategy
    const suggestions = analyzeAndSuggest(attackId, 'api', false, io, log, db);
    const retrySuggestion = suggestions.find(s => s.autoExecute && s.action === 'api');
    if (retrySuggestion) {
      log(attackId, 'LLM', `🔄 Auto-retrying API flood with stealthier approach...`, io, db);
      await sleep(2000);
      // Retry with smaller batch (simulated)
      const stealthySuccess = Math.random() < 0.55; // Lower success but more stealthy
      if (stealthySuccess) {
        log(attackId, 'LLM', `✅ Stealthy API flood succeeded! Smaller batches evaded detection.`, io, db);
        io.emit('impact:updated', {
          attackId,
          packages: 1,
          patients: 1,
          financial: 1200,
          detectionTime: 90
        });
        analyzeAndSuggest(attackId, 'api', true, io, log, db);
        await sleep(500);
        io.emit('step:completed', { attackId, step: 'api', success: true });
        return { success: true, alertsSent: Math.floor(alertCount * 0.5), stealthy: true };
      } else {
        log(attackId, 'LLM', `❌ Stealthy retry also failed. Attack partially successful.`, io, db);
      }
    }
  }
  
  if (success) {
    analyzeAndSuggest(attackId, 'api', true, io, log, db);
  }
  
  await sleep(500);
  io.emit('step:completed', { attackId, step: 'api', success });
  
  return { success, alertsSent: alertCount };
}

// Main attack function
async function runAttack(attackId, attackConfig, io, db, config, log, syntheticClient = null) {
  try {
    log(attackId, 'System', '🚀 Attack sequence initiated', io, db);
    
    // Step 1: Orchestrator plans attack
    const orchestratorResult = await OrchestratorAgent(attackId, attackConfig, io, db, config, log);
    if (!orchestratorResult.success) {
      return false;
    }
    
    await sleep(1000);
    
    // Step 2: Phishing attack
    const phishingResult = await PhishingAgent(attackId, attackConfig, io, db, config, log);
    if (!phishingResult.success) {
      log(attackId, 'System', '🛑 Attack aborted - phishing failed', io, db);
      return false;
    }
    
    await sleep(1000);
    
    if (syntheticClient) {
      const anchorId = attackConfig.gpsSpoofAnchorDeliveryId || attackConfig.syntheticManifest?.deliveries?.[0]?.id || null;
      if (anchorId) {
        try {
          await syntheticClient.waitForEvent(
            'delivery_en_route',
            event => event.data?.deliveryId === anchorId,
            1800000 // 30 minutes (to accommodate realistic drive times)
          );
          log(attackId, 'GPS', `📡 Driver now en route for anchor delivery ${anchorId}. GPS spoof primed.`, io, db);
        } catch (error) {
          log(attackId, 'GPS', `⚠️ Anchor delivery ${anchorId} never entered en-route state (${error.message}). Proceeding anyway.`, io, db);
        }
      }
    }
    
    // Step 3: GPS spoofing
const gpsResult = await GPSAgent(attackId, attackConfig, io, db, config, log, syntheticClient);
    if (!gpsResult.success) {
      log(attackId, 'System', '⚠️ GPS attack failed, but continuing...', io, db);
    }
    
    await sleep(1000);
    
    if (syntheticClient) {
      try {
        // Wait longer for GPS spoof confirmation (5 minutes)
        await syntheticClient.waitForEvent('gps_spoof_applied', () => true, 300000);
        log(attackId, 'GPS', '🛰️ Synthetic stream acknowledged GPS spoof diversion.', io, db);
      } catch (error) {
        log(attackId, 'GPS', `⚠️ No GPS spoof confirmation from synthetic stream (${error.message}).`, io, db);
      }
    }
    
    // Step 4: API flooding
    const apiResult = await APIFloodingAgent(attackId, attackConfig, io, db, config, log, syntheticClient);
    
    const overallSuccess = phishingResult.success && (gpsResult.success || apiResult.success);
    
    if (overallSuccess) {
      log(attackId, 'System', '🎉 ATTACK COMPLETE - All objectives achieved', io, db);
    } else {
      log(attackId, 'System', '⚠️ Attack partially successful', io, db);
    }
    
    return overallSuccess;
    
  } catch (error) {
    log(attackId, 'System', `❌ Attack error: ${error.message}`, io, db);
    throw error;
  }
}

// Manual agent trigger function
async function triggerAgent(agentName, attackId, attackConfig, io, db, config, log, tier = null, syntheticClient = null) {
  const agentMap = {
    'orchestrator': OrchestratorAgent,
    'phishing': PhishingAgent,
    'gps': GPSAgent,
    'api': APIFloodingAgent
  };
  
  const agent = agentMap[agentName];
  if (!agent) {
    throw new Error(`Unknown agent: ${agentName}`);
  }
  
  // Update tier if provided
  if (tier) {
    attackConfig.targetTier = tier;
  }
  
  // Emit reasoning event
  io.emit('ai:reasoning', {
    attackId,
    agent: agentName.charAt(0).toUpperCase() + agentName.slice(1),
    message: `Manually triggered ${agentName} agent`,
    nodeId: getNodeIdForAgent(agentName)
  });
  
  // Run the agent
  const result = await agent(attackId, attackConfig, io, db, config, log, syntheticClient);
  
  // Update impact based on agent result
  if (result && result.success) {
    updateImpact(attackId, agentName, io);
  }
  
  // Emit completion event
  io.emit('step:manual', {
    attackId,
    agent: agentName,
    status: result.success ? 'completed' : 'failed',
    nodeId: getNodeIdForAgent(agentName)
  });
  
  return result;
}

function getNodeIdForAgent(agentName) {
  const mapping = {
    'orchestrator': 'TARGET_ANALYSIS',
    'phishing': 'PHISHING',
    'gps': 'GPS_MANIP',
    'api': 'API_EXPLOIT'
  };
  return mapping[agentName] || null;
}

// Update impact metrics (accumulative)
const impactState = {};

function updateImpact(attackId, agentName, io) {
  if (!impactState[attackId]) {
    impactState[attackId] = {
      packages: 0,
      patients: 0,
      financial: 0,
      erVisits: 0,
      detectionTime: null
    };
  }
  
  const state = impactState[attackId];
  const impactUpdates = {
    'orchestrator': { packages: 1, patients: 0, financial: 500 },
    'phishing': { packages: 2, patients: 1, financial: 1000 },
    'gps': { packages: 3, patients: 2, financial: 1500, detectionTime: 30 },
    'api': { packages: 1, patients: 1, financial: 1500, erVisits: 1, detectionTime: 60 }
  };
  
  const update = impactUpdates[agentName];
  if (update) {
    // Accumulate values
    state.packages += update.packages || 0;
    state.patients += update.patients || 0;
    state.financial += update.financial || 0;
    state.erVisits += update.erVisits || 0;
    if (update.detectionTime !== undefined) {
      state.detectionTime = update.detectionTime;
    }
    
    io.emit('impact:updated', {
      attackId,
      packages: state.packages,
      patients: state.patients,
      financial: state.financial,
      erVisits: state.erVisits,
      detectionTime: state.detectionTime
    });
  }
}

module.exports = { runAttack, triggerAgent, setMetricsTracker };


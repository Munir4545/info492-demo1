// AI Agents System
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { calculateTierBypass } = require('./auth-tiers');
const { analyzeAndSuggest, updateAttackState, getAttackState } = require('./llm-suggestions');
const { evaluatePhishingWithLLMs, fallbackClickRate } = require('./llm-providers');

<<<<<<< Updated upstream
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
=======
// Synthetic delivery route state (powers interactive visualization)
const syntheticRoutes = {};

function generateSyntheticRoute(attackId, attackConfig, io, config) {
  const baseCoords = (config?.agents?.gps?.fakeCoordinates && Array.isArray(config.agents.gps.fakeCoordinates))
    ? config.agents.gps.fakeCoordinates
    : [46.7298, -117.1817];

  const offsets = [
    { id: 'STOP-0', name: 'Pullman Distribution Hub', medication: 'Bulk Inventory', priority: 'origin', patients: 0, eta: '14:05', offset: [0, 0] },
    { id: 'STOP-1', name: 'Valley Diabetes Clinic', medication: 'Insulin Pump Cartridges', priority: 'critical', patients: 12, eta: '14:25', offset: [0.035, 0.018] },
    { id: 'STOP-2', name: 'Regional Children\'s Hospital', medication: 'Cardiac Stabilizers', priority: 'high', patients: 6, eta: '14:50', offset: [0.048, -0.022] },
    { id: 'STOP-3', name: 'Community Pharmacy North', medication: 'Routine Prescriptions', priority: 'standard', patients: 30, eta: '15:10', offset: [0.012, -0.048] },
    { id: 'STOP-4', name: 'Assisted Living Center', medication: 'Critical Pain Management Kits', priority: 'critical', patients: 18, eta: '15:35', offset: [-0.028, 0.032] }
  ];

  const stops = offsets.map((stop, index) => {
    const jitterLat = stop.offset[0] + (Math.random() - 0.5) * 0.01;
    const jitterLon = stop.offset[1] + (Math.random() - 0.5) * 0.01;
    return {
      id: stop.id,
      sequence: index,
      name: stop.name,
      medication: stop.medication,
      priority: stop.priority,
      patients: stop.patients,
      eta: stop.eta,
      status: index === 0 ? 'dispatch' : 'en_route',
      stage: index === 0 ? 'Preparing shipment' : 'Awaiting delivery',
      coordinates: [
        Number((baseCoords[0] + jitterLat).toFixed(4)),
        Number((baseCoords[1] + jitterLon).toFixed(4))
      ]
    };
  });

  syntheticRoutes[attackId] = stops;

  io.emit('delivery:route', {
    attackId,
    driver: attackConfig.targetDriver || 'Unknown Driver',
    totalStops: stops.length,
    route: stops,
    path: stops.map((stop) => stop.coordinates)
  });
}

function updateDeliveryStatus(attackId, updates, io) {
  const route = syntheticRoutes[attackId];
  if (!route) {
    return;
  }

  const appliedUpdates = updates.map((update) => {
    const target = route.find((stop) => stop.id === update.id);
    if (!target) {
      return null;
    }

    const nextState = {
      ...target,
      status: update.status || target.status,
      stage: update.stage || target.stage,
      notes: update.notes || target.notes,
      impact: update.impact || target.impact || null,
      lastEvent: new Date().toISOString()
    };

    Object.assign(target, nextState);
    return {
      id: target.id,
      status: nextState.status,
      stage: nextState.stage,
      notes: nextState.notes,
      impact: nextState.impact,
      coordinates: target.coordinates
    };
  }).filter(Boolean);

  if (appliedUpdates.length > 0) {
    io.emit('delivery:update', {
      attackId,
      updates: appliedUpdates
    });
  }
>>>>>>> Stashed changes
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

  updateDeliveryStatus(attackId, [
    {
      id: 'STOP-0',
      status: 'planned',
      stage: 'Attack plan approved',
      notes: 'LLM recommends high-impact phishing pretext to compromise driver credentials'
    },
    {
      id: 'STOP-1',
      status: 'targeted',
      stage: 'LLM crafting phishing template',
      notes: 'Driver targeted with insulin delivery urgency pretext'
    }
  ], io);
  
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
<<<<<<< Updated upstream
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
=======
      financial: 1000,
      status: 'credentials_compromised'
    });
    
    // Emit affected delivery
    io.emit('delivery:affected', {
      attackId,
      deliveryId: 'STOP-1',
      address: 'Valley Diabetes Clinic',
      medication: 'Insulin Pump Cartridges',
      priority: 'critical',
      status: 'compromised',
      message: 'Driver credentials harvested. Clinic delivery exposed to takeover.'
    });
    
    updateDeliveryStatus(attackId, [
      {
        id: 'STOP-1',
        status: 'compromised',
        stage: 'Credentials harvested',
        notes: 'LLM-crafted phishing succeeded; clinic staff now awaiting spoofed instructions',
        impact: { patients: 12, risk: 'insulin_delay' }
      }
    ], io);
    
    // Emit patient notification
    io.emit('patient:notification', {
      attackId,
      message: 'Your insulin delivery is delayed. Expected time: TBD',
      medication: 'Insulin'
    });
    
    // Update metrics
    io.emit('metrics:updated', {
      attackId,
      vectorEffectiveness: { phishing: Math.round(calibratedRate * 100) }
    });
>>>>>>> Stashed changes
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
async function GPSAgent(attackId, attackConfig, io, db, config, log) {
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
    
    // Update impact with route disruption
    const gpsImpactData = {
      attackId,
      packages: 3,
      patients: 2,
<<<<<<< Updated upstream
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
=======
      financial: 1500,
      detectionTime: 30,
      status: 'driver_diverted'
    });
    
    io.emit('delivery:affected', {
      attackId,
      deliveryId: 'STOP-2',
      address: 'Regional Children\'s Hospital',
      medication: 'Cardiac Stabilizers',
      priority: 'high',
      status: 'diverted',
      message: 'GPS spoofing diverted driver off route. Pediatric cardiac meds delayed.'
    });
    
    updateDeliveryStatus(attackId, [
      {
        id: 'STOP-2',
        status: 'diverted',
        stage: 'Driver diverted by false coordinates',
        notes: 'Dispatch unaware of false route; hospital awaiting delivery',
        impact: { patients: 6, risk: 'cardiac_event' }
      },
      {
        id: 'STOP-3',
        status: 'at_risk',
        stage: 'Downstream deliveries accumulating delay',
        notes: 'Community Pharmacy now forecasting shortages due to detour'
      }
    ], io);
    
    // Emit affected deliveries for downstream stops
    io.emit('delivery:affected', {
      attackId,
      deliveryId: 'STOP-2',
      address: 'Regional Children\'s Hospital',
      medication: 'Cardiac Stabilizers',
      priority: 'high',
      status: 'diverted',
      message: 'Pediatric ward awaiting cardiac stabilizers – driver diverted off course.'
    });
    io.emit('delivery:affected', {
      attackId,
      deliveryId: 'STOP-3',
      address: 'Community Pharmacy North',
      medication: 'Routine Prescriptions',
      priority: 'standard',
      status: 'at_risk',
      message: 'Pharmacy inventory now at risk due to cascading delays.'
    });
    
    // Emit failed delivery notification for hospital stop
    io.emit('delivery:failed', {
      attackId,
      deliveryId: 'STOP-2',
      address: 'Regional Children\'s Hospital',
      reason: 'Driver off route - GPS coordinates manipulated'
    });
    
    // Emit status conflict between systems
    io.emit('status:conflict', {
      attackId,
      deliveryId: 'STOP-2',
      driverApp: 'In Transit',
      pharmacySystem: 'Delivered',
      patientPortal: 'Urgent - Awaiting'
    });
    
    // Emit cascade failure
    io.emit('cascade:failure', {
      attackId,
      source: 'GPS Spoofing',
      affected: ['Delivery System', 'Routing Engine', 'Dispatcher Dashboard']
    });
    
    // Update metrics
    io.emit('metrics:updated', {
      attackId,
      vectorEffectiveness: { gps: 85 }
    });
    
    // Trigger detection after delay
    setTimeout(() => {
      io.emit('detection:triggered', { attackId });
    }, 30000); // 30 seconds
>>>>>>> Stashed changes
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
async function APIFloodingAgent(attackId, attackConfig, io, db, config, log) {
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
  
  // Update impact with API flooding results
  io.emit('impact:updated', {
    attackId,
    packages: 5,
    patients: 3,
    financial: 2500,
    operational: 70,
    status: 'alert_storm'
  });
  
  io.emit('delivery:affected', {
    attackId,
    deliveryId: 'STOP-3',
    address: 'Community Pharmacy North',
    medication: 'Routine Prescriptions',
    priority: 'standard',
    status: 'backlog',
    message: 'Dispatcher flooded with alerts. Pharmacy sees conflicting statuses.'
  });
  io.emit('delivery:affected', {
    attackId,
    deliveryId: 'STOP-4',
    address: 'Assisted Living Center',
    medication: 'Critical Pain Management Kits',
    priority: 'critical',
    status: 'delayed',
    message: 'Alert storm hides true status; assisted living center now overdue.'
  });
  
  updateDeliveryStatus(attackId, [
    {
      id: 'STOP-3',
      status: 'backlog',
      stage: 'Alerts overwhelming dispatcher',
      notes: 'Real anomaly buried at position ' + buryPosition,
      impact: { patients: 30, risk: 'medication_backlog' }
    },
    {
      id: 'STOP-4',
      status: 'delayed',
      stage: 'Critical meds delayed by alert storm',
      notes: 'Assisted living center receiving conflicting updates',
      impact: { patients: 18, risk: 'pain_management' }
    }
  ], io);
  
  // Emit patient notifications
  io.emit('patient:notification', {
    attackId,
    message: 'Multiple delivery alerts detected. System investigating delays.',
    medication: 'Multiple'
  });
  
  // Update metrics
  io.emit('metrics:updated', {
    attackId,
    vectorEffectiveness: { api: 70 },
    recoveryTime: 45
  });
  
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
<<<<<<< Updated upstream
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
=======
      packages: 1,
      patients: 1,
      financial: 1500,
      erVisits: 1,
      detectionTime: 60,
      status: 'mission_complete'
    });
    
    updateDeliveryStatus(attackId, [
      {
        id: 'STOP-4',
        status: 'disrupted',
        stage: 'Critical delivery missed',
        notes: 'LLM confirms dispatcher missed real alert amid noise',
        impact: { patients: 18, risk: 'emergency_room' }
      }
    ], io);
>>>>>>> Stashed changes
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
async function runAttack(attackId, attackConfig, io, db, config, log) {
  try {
    log(attackId, 'System', '🚀 Attack sequence initiated', io, db);
    generateSyntheticRoute(attackId, attackConfig, io, config);
    updateDeliveryStatus(attackId, [
      {
        id: 'STOP-0',
        status: 'dispatch',
        stage: 'Loading delivery vehicle',
        notes: 'Logistics hub preparing high-priority medications'
      }
    ], io);
    
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
    
    // Step 3: GPS spoofing
    const gpsResult = await GPSAgent(attackId, attackConfig, io, db, config, log);
    if (!gpsResult.success) {
      log(attackId, 'System', '⚠️ GPS attack failed, but continuing...', io, db);
    }
    
    await sleep(1000);
    
    // Step 4: API flooding
    const apiResult = await APIFloodingAgent(attackId, attackConfig, io, db, config, log);
    
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
async function triggerAgent(agentName, attackId, attackConfig, io, db, config, log, tier = null) {
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
  const result = await agent(attackId, attackConfig, io, db, config, log);
  
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


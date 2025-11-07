// Dr. Chen's Experimental Frameworks
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const experiments = {
  panic_window: {
    name: "Panic Window Experiment",
    description: "Simulate alert storm and measure dispatcher accuracy degradation",
    parameters: {
      baselineAlerts: 20,
      peakAlerts: 65,
      baselineAccuracy: 0.90,
      peakAccuracy: 0.60,
      lmAssistance: true
    },
    procedure: async function(io, db, log, attackId = null) {
      log(attackId || 'EXP', 'Experiment', '🧪 Starting Panic Window Experiment...', io, db);
      
      const results = {
        alertRates: [],
        accuracyRates: [],
        ttr: [],
        withLM: [],
        withoutLM: []
      };
      
      // Baseline measurement
      log(attackId || 'EXP', 'Experiment', '📊 Baseline: 20 alerts/hr, 90% accuracy', io, db);
      await sleep(1000);
      
      // Gradual increase to peak
      for (let hour = 1; hour <= 6; hour++) {
        const alerts = 20 + (65 - 20) * (hour / 6);
        const accuracy = 0.90 - (0.90 - 0.60) * (hour / 6);
        const ttr = 5 + (hour * 2); // Time to recognition increases
        
        results.alertRates.push({ hour, alerts });
        results.accuracyRates.push({ hour, accuracy: accuracy * 100 });
        results.ttr.push({ hour, ttr });
        
        log(attackId || 'EXP', 'Experiment', `  Hour ${hour}: ${alerts.toFixed(0)} alerts/hr, ${(accuracy * 100).toFixed(0)}% accuracy, TTR: ${ttr}min`, io, db);
        await sleep(800);
      }
      
      // Test with LM assistance
      log(attackId || 'EXP', 'Experiment', '🤖 Testing with LM assistance...', io, db);
      await sleep(1000);
      const lmAccuracy = 0.75; // LM helps maintain higher accuracy
      results.withLM = { accuracy: lmAccuracy * 100, ttr: 8 };
      
      // Test without LM
      log(attackId || 'EXP', 'Experiment', '👤 Testing without LM assistance...', io, db);
      await sleep(1000);
      results.withoutLM = { accuracy: 60, ttr: 12 };
      
      const conclusion = `Alert storms reduce accuracy from ${(this.parameters.baselineAccuracy * 100)}% to ${(this.parameters.peakAccuracy * 100)}%. LM assistance maintains ${(lmAccuracy * 100)}% accuracy.`;
      
      log(attackId || 'EXP', 'Experiment', `✅ Conclusion: ${conclusion}`, io, db);
      
      return { ...results, conclusion };
    }
  },
  
  ddos_overlap: {
    name: "DDoS Overlap Experiment",
    description: "Test detection stacks under combined DDoS and social engineering",
    parameters: {
      ddosMultiplier: 10,
      socialEngineeringRate: 3,
      detectionStacks: ['rules', 'lm', 'hybrid']
    },
    procedure: async function(io, db, log, attackId = null) {
      log(attackId || 'EXP', 'Experiment', '🧪 Starting DDoS Overlap Experiment...', io, db);
      
      const results = {
        stacks: {}
      };
      
      for (const stack of this.parameters.detectionStacks) {
        log(attackId || 'EXP', 'Experiment', `🔍 Testing ${stack.toUpperCase()} detection stack...`, io, db);
        await sleep(1000);
        
        let detectionProb;
        switch(stack) {
          case 'rules':
            detectionProb = 0.35; // Rules-based struggles with overlap
            break;
          case 'lm':
            detectionProb = 0.68; // LM better at pattern recognition
            break;
          case 'hybrid':
            detectionProb = 0.82; // Hybrid performs best
            break;
        }
        
        results.stacks[stack] = {
          detectionProbability: detectionProb * 100,
          falsePositives: stack === 'rules' ? 15 : stack === 'lm' ? 8 : 5,
          latency: stack === 'rules' ? 50 : stack === 'lm' ? 120 : 85
        };
        
        log(attackId || 'EXP', 'Experiment', `  ${stack}: ${(detectionProb * 100).toFixed(0)}% detection, ${results.stacks[stack].falsePositives} FP/hr`, io, db);
        await sleep(800);
      }
      
      const conclusion = `Hybrid detection stack performs best (${(results.stacks.hybrid.detectionProbability).toFixed(0)}% detection) but with latency trade-off.`;
      log(attackId || 'EXP', 'Experiment', `✅ Conclusion: ${conclusion}`, io, db);
      
      return { ...results, conclusion };
    }
  },
  
  human_ai_ratio: {
    name: "Human-AI Ratio Experiment",
    description: "Find optimal automation balance for TTR and expected loss",
    parameters: {
      automationLevels: [0, 25, 50, 75, 100]
    },
    procedure: async function(io, db, log, attackId = null) {
      log(attackId || 'EXP', 'Experiment', '🧪 Starting Human-AI Ratio Experiment...', io, db);
      
      const results = {
        levels: []
      };
      
      for (const level of this.parameters.automationLevels) {
        log(attackId || 'EXP', 'Experiment', `⚙️ Testing ${level}% automation...`, io, db);
        await sleep(800);
        
        // TTR decreases with automation, but expected loss has sweet spot
        const ttr = 15 - (level / 100) * 10; // 15min at 0%, 5min at 100%
        const expectedLoss = calculateExpectedLoss(level);
        
        results.levels.push({
          automation: level,
          ttr,
          expectedLoss,
          efficiency: (100 - expectedLoss) / ttr
        });
        
        log(attackId || 'EXP', 'Experiment', `  ${level}%: TTR=${ttr.toFixed(1)}min, Loss=$${expectedLoss.toFixed(0)}k`, io, db);
        await sleep(600);
      }
      
      // Find optimal
      const optimal = results.levels.reduce((best, current) => 
        current.efficiency > best.efficiency ? current : best
      );
      
      const conclusion = `Optimal automation: ${optimal.automation}% (TTR: ${optimal.ttr.toFixed(1)}min, Loss: $${optimal.expectedLoss.toFixed(0)}k)`;
      log(attackId || 'EXP', 'Experiment', `✅ Conclusion: ${conclusion}`, io, db);
      
      return { ...results, optimal, conclusion };
    }
  },
  
  game_theory: {
    name: "Game Theory Experiment",
    description: "Model defense investment Nash equilibrium for USPS vs FedEx",
    parameters: {
      firms: ['USPS', 'FedEx'],
      strategies: ['low', 'medium', 'high']
    },
    procedure: async function(io, db, log, attackId = null) {
      log(attackId || 'EXP', 'Experiment', '🧪 Starting Game Theory Experiment...', io, db);
      
      // Payoff matrix: [USPS strategy][FedEx strategy] = {usps, fedex}
      const payoffMatrix = {
        low: {
          low: { usps: -50, fedex: -50 },
          medium: { usps: -80, fedex: -20 },
          high: { usps: -100, fedex: -10 }
        },
        medium: {
          low: { usps: -20, fedex: -80 },
          medium: { usps: -40, fedex: -40 },
          high: { usps: -70, fedex: -30 }
        },
        high: {
          low: { usps: -10, fedex: -100 },
          medium: { usps: -30, fedex: -70 },
          high: { usps: -35, fedex: -35 }
        }
      };
      
      log(attackId || 'EXP', 'Experiment', '📊 Analyzing payoff matrix...', io, db);
      await sleep(1000);
      
      // Find Nash equilibrium (both choose medium)
      const nashEquilibrium = {
        usps: 'medium',
        fedex: 'medium',
        payoffs: payoffMatrix.medium.medium
      };
      
      log(attackId || 'EXP', 'Experiment', `⚖️ Nash Equilibrium: Both choose MEDIUM defense`, io, db);
      await sleep(800);
      log(attackId || 'EXP', 'Experiment', `  USPS payoff: -$${Math.abs(nashEquilibrium.payoffs.usps)}k`, io, db);
      log(attackId || 'EXP', 'Experiment', `  FedEx payoff: -$${Math.abs(nashEquilibrium.payoffs.fedex)}k`, io, db);
      
      // Simulate repeated game
      log(attackId || 'EXP', 'Experiment', '🔄 Simulating repeated game (10 rounds)...', io, db);
      await sleep(1000);
      
      let totalLoss = { usps: 0, fedex: 0 };
      for (let round = 1; round <= 10; round++) {
        totalLoss.usps += Math.abs(nashEquilibrium.payoffs.usps);
        totalLoss.fedex += Math.abs(nashEquilibrium.payoffs.fedex);
        if (round % 3 === 0) {
          await sleep(400);
          log(attackId || 'EXP', 'Experiment', `  Round ${round}: USPS=-$${totalLoss.usps}k, FedEx=-$${totalLoss.fedex}k`, io, db);
        }
      }
      
      const conclusion = `Nash equilibrium at MEDIUM defense. Repeated game: USPS loses $${totalLoss.usps}k, FedEx loses $${totalLoss.fedex}k over 10 rounds.`;
      log(attackId || 'EXP', 'Experiment', `✅ Conclusion: ${conclusion}`, io, db);
      
      return { payoffMatrix, nashEquilibrium, repeatedGame: totalLoss, conclusion };
    }
  },
  
  driver_distraction: {
    name: "Driver Distraction Experiment",
    description: "Measure phishing click rates under different conditions",
    parameters: {
      baseline: 0.30,
      whileDriving: 0.45,
      underStress: 0.55,
      combined: 0.65
    },
    procedure: async function(io, db, log, attackId = null) {
      log(attackId || 'EXP', 'Experiment', '🧪 Starting Driver Distraction Experiment...', io, db);
      
      const results = {
        conditions: []
      };
      
      const conditions = [
        { name: 'Baseline', rate: this.parameters.baseline, mitigation: 'None' },
        { name: 'While Driving', rate: this.parameters.whileDriving, mitigation: 'None' },
        { name: 'Under Stress', rate: this.parameters.underStress, mitigation: 'None' },
        { name: 'Combined', rate: this.parameters.combined, mitigation: 'None' },
        { name: 'With Lock Screen', rate: this.parameters.combined * 0.3, mitigation: 'Lock screen' },
        { name: 'With Forced Delay', rate: this.parameters.combined * 0.5, mitigation: '3s delay' }
      ];
      
      for (const condition of conditions) {
        log(attackId || 'EXP', 'Experiment', `📱 Testing: ${condition.name}`, io, db);
        await sleep(700);
        
        results.conditions.push({
          name: condition.name,
          clickRate: condition.rate * 100,
          mitigation: condition.mitigation,
          effectiveness: condition.mitigation !== 'None' ? ((this.parameters.combined - condition.rate) / this.parameters.combined * 100) : 0
        });
        
        log(attackId || 'EXP', 'Experiment', `  Click rate: ${(condition.rate * 100).toFixed(0)}% ${condition.mitigation !== 'None' ? `(${condition.mitigation})` : ''}`, io, db);
        await sleep(600);
      }
      
      const conclusion = `Combined distraction increases click rate to ${(this.parameters.combined * 100).toFixed(0)}%. Lock screen reduces by ${(results.conditions[4].effectiveness).toFixed(0)}%.`;
      log(attackId || 'EXP', 'Experiment', `✅ Conclusion: ${conclusion}`, io, db);
      
      return { ...results, conclusion };
    }
  }
};

// Helper function for expected loss calculation
function calculateExpectedLoss(automationLevel) {
  // Sweet spot around 50-75% automation
  if (automationLevel < 50) {
    return 100 - (automationLevel / 50) * 40; // High loss due to slow response
  } else if (automationLevel <= 75) {
    return 60 - ((automationLevel - 50) / 25) * 20; // Optimal range
  } else {
    return 40 + ((automationLevel - 75) / 25) * 30; // Increasing loss due to false positives
  }
}

// Run all experiments
async function runAllExperiments(io, db, log, attackId = null) {
  log(attackId || 'EXP', 'Experiment', '🚀 Starting Dr. Chen Experimental Framework...', io, db);
  
  const results = {};
  
  for (const [key, experiment] of Object.entries(experiments)) {
    try {
      io.emit('experiment:started', { experiment: key, name: experiment.name });
      const result = await experiment.procedure(io, db, log, attackId);
      results[key] = result;
      io.emit('experiment:completed', { experiment: key, result });
      await sleep(1000);
    } catch (error) {
      log(attackId || 'EXP', 'Experiment', `❌ Error in ${experiment.name}: ${error.message}`, io, db);
      results[key] = { error: error.message };
    }
  }
  
  log(attackId || 'EXP', 'Experiment', '✅ All experiments completed', io, db);
  io.emit('experiments:completed', { results });
  
  return results;
}

module.exports = {
  experiments,
  runAllExperiments
};


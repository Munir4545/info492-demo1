/**
 * Interactive Attack Configuration Prompt
 * Prompts the human operator in the console before an attack starts
 */

const readline = require('readline');

// Default configurations
const DEFAULT_RISK_TOLERANCE = {
  posture: 'balanced',
  detectionRiskThreshold: 0.65,
  holdAttackThreshold: 0.85,
  baseDetectionRisk: 0.20,
  alertPenaltyMultiplier: 0.12,
  failedVectorPenalty: { api: 0.10, gps: 0.08 },
  stealthPriority: 0.5,
  cascadeBonus: 0.15
};

const DEFAULT_TARGETING = {
  strategy: 'opportunistic',
  preferredTier: 'tier2',
  avoidRecentlyDetected: true,
  vigilanceThreshold: 0.30,
  susceptibilityMinimum: 0.40,
  randomizationFactor: 0.10
};

const POSTURE_OPTIONS = {
  '1': { value: 'stealth', label: 'Stealth', description: 'Minimize detection risk. Slower compromise, harder to detect.' },
  '2': { value: 'balanced', label: 'Balanced', description: 'Adaptive behavior. Balance speed with detection avoidance.' },
  '3': { value: 'aggressive', label: 'Aggressive', description: 'Push for quick compromise. Accept higher detection risk.' },
  '4': { value: 'blitz', label: 'Blitz', description: 'Maximum speed. Ignore detection concerns entirely.' }
};

const STRATEGY_OPTIONS = {
  '1': { value: 'opportunistic', label: 'Opportunistic', description: 'Target most vulnerable based on history.' },
  '2': { value: 'round-robin', label: 'Round Robin', description: 'Rotate through all targets evenly.' },
  '3': { value: 'persistent', label: 'Persistent', description: 'Keep hitting same target until success.' },
  '4': { value: 'fresh', label: 'Fresh Targets', description: 'Prioritize targets with no attack history.' }
};

const TIER_OPTIONS = {
  '1': { value: 'tier2', label: 'Tier 2 (Driver)', description: 'Lowest security. Mobile auth, SMS backup. Highest success rate.' },
  '2': { value: 'tier3', label: 'Tier 3 (Dispatcher)', description: 'Medium security. WebAuthn passkey. Force multiplier effect.' },
  '3': { value: 'tier4', label: 'Tier 4 (Admin)', description: 'Highest security. Hardware keys, biometric. Very low success.' }
};

class AttackConfigPrompt {
  constructor() {
    this.rl = null;
    this.config = {
      riskTolerance: { ...DEFAULT_RISK_TOLERANCE },
      targeting: { ...DEFAULT_TARGETING }
    };
  }

  createInterface() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  closeInterface() {
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  printHeader() {
    console.log('\n' + '═'.repeat(70));
    console.log('  ⚙️  PRE-ATTACK CONFIGURATION');
    console.log('  Configure attack parameters before deployment');
    console.log('═'.repeat(70) + '\n');
  }

  printSection(title) {
    console.log('\n' + '─'.repeat(50));
    console.log(`  ${title}`);
    console.log('─'.repeat(50));
  }

  printOptions(options) {
    Object.entries(options).forEach(([key, opt]) => {
      console.log(`  [${key}] ${opt.label}`);
      console.log(`      ${opt.description}`);
    });
  }

  async promptPosture() {
    this.printSection('🎯 RISK TOLERANCE - Attack Posture');
    console.log('\n  Select how aggressively the attack should proceed:\n');
    this.printOptions(POSTURE_OPTIONS);
    
    const answer = await this.question('\n  Enter choice [1-4] (default: 2 - Balanced): ');
    const choice = answer || '2';
    
    if (POSTURE_OPTIONS[choice]) {
      this.config.riskTolerance.posture = POSTURE_OPTIONS[choice].value;
      console.log(`  ✓ Selected: ${POSTURE_OPTIONS[choice].label}\n`);
      
      // Auto-adjust thresholds based on posture
      this.applyPostureDefaults(POSTURE_OPTIONS[choice].value);
    } else {
      console.log('  ⚠ Invalid choice. Using default: Balanced\n');
    }
  }

  applyPostureDefaults(posture) {
    switch (posture) {
      case 'stealth':
        this.config.riskTolerance.detectionRiskThreshold = 0.50;
        this.config.riskTolerance.holdAttackThreshold = 0.70;
        this.config.riskTolerance.stealthPriority = 0.8;
        this.config.riskTolerance.cascadeBonus = 0.05;
        break;
      case 'aggressive':
        this.config.riskTolerance.detectionRiskThreshold = 0.75;
        this.config.riskTolerance.holdAttackThreshold = 0.90;
        this.config.riskTolerance.stealthPriority = 0.3;
        this.config.riskTolerance.cascadeBonus = 0.20;
        break;
      case 'blitz':
        this.config.riskTolerance.detectionRiskThreshold = 0.95;
        this.config.riskTolerance.holdAttackThreshold = 0.99;
        this.config.riskTolerance.stealthPriority = 0.1;
        this.config.riskTolerance.cascadeBonus = 0.30;
        break;
      default: // balanced
        this.config.riskTolerance.detectionRiskThreshold = 0.65;
        this.config.riskTolerance.holdAttackThreshold = 0.85;
        this.config.riskTolerance.stealthPriority = 0.5;
        this.config.riskTolerance.cascadeBonus = 0.15;
    }
  }

  async promptDetectionThreshold() {
    const current = (this.config.riskTolerance.detectionRiskThreshold * 100).toFixed(0);
    console.log(`  Current detection risk threshold: ${current}%`);
    console.log('  (Lower = more cautious, Higher = more aggressive)\n');
    
    const answer = await this.question(`  Enter new threshold % [30-95] (press Enter to keep ${current}%): `);
    
    if (answer) {
      const value = parseInt(answer, 10);
      if (value >= 30 && value <= 95) {
        this.config.riskTolerance.detectionRiskThreshold = value / 100;
        console.log(`  ✓ Detection threshold set to: ${value}%\n`);
      } else {
        console.log('  ⚠ Invalid value. Keeping current setting.\n');
      }
    }
  }

  async promptHoldThreshold() {
    const current = (this.config.riskTolerance.holdAttackThreshold * 100).toFixed(0);
    console.log(`  Current hold attack threshold: ${current}%`);
    console.log('  (At this detection level, attack pauses to reassess)\n');
    
    const answer = await this.question(`  Enter new threshold % [50-99] (press Enter to keep ${current}%): `);
    
    if (answer) {
      const value = parseInt(answer, 10);
      if (value >= 50 && value <= 99) {
        this.config.riskTolerance.holdAttackThreshold = value / 100;
        console.log(`  ✓ Hold threshold set to: ${value}%\n`);
      } else {
        console.log('  ⚠ Invalid value. Keeping current setting.\n');
      }
    }
  }

  async promptStrategy() {
    this.printSection('🎯 TARGETING - Strategy');
    console.log('\n  Select how targets should be selected:\n');
    this.printOptions(STRATEGY_OPTIONS);
    
    const answer = await this.question('\n  Enter choice [1-4] (default: 1 - Opportunistic): ');
    const choice = answer || '1';
    
    if (STRATEGY_OPTIONS[choice]) {
      this.config.targeting.strategy = STRATEGY_OPTIONS[choice].value;
      console.log(`  ✓ Selected: ${STRATEGY_OPTIONS[choice].label}\n`);
    } else {
      console.log('  ⚠ Invalid choice. Using default: Opportunistic\n');
    }
  }

  async promptPreferredTier() {
    this.printSection('🎯 TARGETING - Preferred Tier');
    console.log('\n  Select preferred target security tier:\n');
    this.printOptions(TIER_OPTIONS);
    
    const answer = await this.question('\n  Enter choice [1-3] (default: 1 - Tier 2): ');
    const choice = answer || '1';
    
    if (TIER_OPTIONS[choice]) {
      this.config.targeting.preferredTier = TIER_OPTIONS[choice].value;
      console.log(`  ✓ Selected: ${TIER_OPTIONS[choice].label}\n`);
    } else {
      console.log('  ⚠ Invalid choice. Using default: Tier 2 (Driver)\n');
    }
  }

  async promptAvoidDetected() {
    const answer = await this.question('  Avoid recently detected targets? [Y/n] (default: Y): ');
    this.config.targeting.avoidRecentlyDetected = answer.toLowerCase() !== 'n';
    console.log(`  ✓ Avoid detected targets: ${this.config.targeting.avoidRecentlyDetected ? 'Yes' : 'No'}\n`);
  }

  async promptSusceptibilityMinimum() {
    const current = (this.config.targeting.susceptibilityMinimum * 100).toFixed(0);
    console.log(`  Current minimum susceptibility: ${current}%`);
    console.log('  (Only target individuals with at least this vulnerability score)\n');
    
    const answer = await this.question(`  Enter minimum % [10-80] (press Enter to keep ${current}%): `);
    
    if (answer) {
      const value = parseInt(answer, 10);
      if (value >= 10 && value <= 80) {
        this.config.targeting.susceptibilityMinimum = value / 100;
        console.log(`  ✓ Minimum susceptibility set to: ${value}%\n`);
      } else {
        console.log('  ⚠ Invalid value. Keeping current setting.\n');
      }
    }
  }

  printSummary() {
    console.log('\n' + '═'.repeat(70));
    console.log('  📋 ATTACK CONFIGURATION SUMMARY');
    console.log('═'.repeat(70));
    
    const rt = this.config.riskTolerance;
    const tg = this.config.targeting;
    
    console.log('\n  RISK TOLERANCE:');
    console.log(`    • Posture:              ${rt.posture.toUpperCase()}`);
    console.log(`    • Detection Threshold:  ${(rt.detectionRiskThreshold * 100).toFixed(0)}%`);
    console.log(`    • Hold Threshold:       ${(rt.holdAttackThreshold * 100).toFixed(0)}%`);
    console.log(`    • Stealth Priority:     ${(rt.stealthPriority * 100).toFixed(0)}%`);
    console.log(`    • Cascade Bonus:        +${(rt.cascadeBonus * 100).toFixed(0)}%`);
    
    console.log('\n  TARGETING:');
    console.log(`    • Strategy:             ${tg.strategy}`);
    console.log(`    • Preferred Tier:       ${tg.preferredTier}`);
    console.log(`    • Avoid Detected:       ${tg.avoidRecentlyDetected ? 'Yes' : 'No'}`);
    console.log(`    • Min Susceptibility:   ${(tg.susceptibilityMinimum * 100).toFixed(0)}%`);
    console.log(`    • Randomization:        ${(tg.randomizationFactor * 100).toFixed(0)}%`);
    
    console.log('\n' + '═'.repeat(70) + '\n');
  }

  async promptConfirmation() {
    const answer = await this.question('  Proceed with this configuration? [Y/n]: ');
    return answer.toLowerCase() !== 'n';
  }

  async promptQuickOrDetailed() {
    console.log('  Configuration modes:');
    console.log('  [1] Quick Setup - Just posture and targeting strategy');
    console.log('  [2] Detailed Setup - All parameters');
    console.log('  [3] Use Defaults - Skip configuration\n');
    
    const answer = await this.question('  Enter choice [1-3] (default: 1): ');
    return answer || '1';
  }

  /**
   * Main prompt flow - returns the attack configuration
   */
  async prompt() {
    this.createInterface();
    
    try {
      this.printHeader();
      
      const mode = await this.promptQuickOrDetailed();
      
      if (mode === '3') {
        console.log('\n  ✓ Using default configuration.\n');
        this.printSummary();
        return this.config;
      }
      
      // Always prompt for posture and strategy
      await this.promptPosture();
      await this.promptStrategy();
      await this.promptPreferredTier();
      
      // Detailed mode includes additional prompts
      if (mode === '2') {
        this.printSection('🔧 RISK TOLERANCE - Fine Tuning');
        await this.promptDetectionThreshold();
        await this.promptHoldThreshold();
        
        this.printSection('🔧 TARGETING - Fine Tuning');
        await this.promptAvoidDetected();
        await this.promptSusceptibilityMinimum();
      }
      
      this.printSummary();
      
      const confirmed = await this.promptConfirmation();
      
      if (!confirmed) {
        console.log('\n  Configuration cancelled. Using defaults.\n');
        this.config = {
          riskTolerance: { ...DEFAULT_RISK_TOLERANCE },
          targeting: { ...DEFAULT_TARGETING }
        };
      } else {
        console.log('\n  ✓ Configuration confirmed. Proceeding with attack.\n');
      }
      
      return this.config;
      
    } finally {
      this.closeInterface();
    }
  }

  /**
   * Non-interactive configuration (for API calls)
   */
  static fromOptions(options = {}) {
    const config = {
      riskTolerance: { ...DEFAULT_RISK_TOLERANCE, ...(options.riskTolerance || {}) },
      targeting: { ...DEFAULT_TARGETING, ...(options.targeting || {}) }
    };
    return config;
  }

  /**
   * Get defaults
   */
  static getDefaults() {
    return {
      riskTolerance: { ...DEFAULT_RISK_TOLERANCE },
      targeting: { ...DEFAULT_TARGETING }
    };
  }
}

module.exports = AttackConfigPrompt;


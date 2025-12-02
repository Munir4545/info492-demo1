import { useState } from 'react';

export type AttackPosture = 'stealth' | 'balanced' | 'aggressive' | 'blitz';
export type TargetingStrategy = 'opportunistic' | 'round-robin' | 'persistent' | 'fresh';
export type PreferredTier = 'tier2' | 'tier3' | 'tier4';

export interface RiskToleranceConfig {
  posture: AttackPosture;
  detectionRiskThreshold: number;
  holdAttackThreshold: number;
  baseDetectionRisk: number;
  alertPenaltyMultiplier: number;
  stealthPriority: number;
  cascadeBonus: number;
}

export interface TargetingConfig {
  strategy: TargetingStrategy;
  preferredTier: PreferredTier;
  avoidRecentlyDetected: boolean;
  vigilanceThreshold: number;
  susceptibilityMinimum: number;
  randomizationFactor: number;
}

export interface AttackConfig {
  riskTolerance: RiskToleranceConfig;
  targeting: TargetingConfig;
}

interface AttackConfigModalProps {
  open: boolean;
  onConfirm: (config: AttackConfig) => void;
  onCancel: () => void;
}

const POSTURE_INFO: Record<AttackPosture, { label: string; description: string; color: string }> = {
  stealth: {
    label: 'Stealth',
    description: 'Minimize detection risk. Slower compromise, harder to detect.',
    color: 'text-emerald-600 border-emerald-400 bg-emerald-50'
  },
  balanced: {
    label: 'Balanced',
    description: 'Adaptive behavior. Balance speed with detection avoidance.',
    color: 'text-blue-600 border-blue-400 bg-blue-50'
  },
  aggressive: {
    label: 'Aggressive',
    description: 'Push for quick compromise. Accept higher detection risk.',
    color: 'text-orange-600 border-orange-400 bg-orange-50'
  },
  blitz: {
    label: 'Blitz',
    description: 'Maximum speed. Ignore detection concerns entirely.',
    color: 'text-red-600 border-red-400 bg-red-50'
  }
};

const STRATEGY_INFO: Record<TargetingStrategy, { label: string; description: string }> = {
  opportunistic: {
    label: 'Opportunistic',
    description: 'Target most vulnerable based on history and susceptibility scores.'
  },
  'round-robin': {
    label: 'Round Robin',
    description: 'Rotate through all targets evenly to distribute attack footprint.'
  },
  persistent: {
    label: 'Persistent',
    description: 'Keep targeting the same individual until successful compromise.'
  },
  fresh: {
    label: 'Fresh Targets',
    description: 'Prioritize targets with no prior attack history.'
  }
};

const TIER_INFO: Record<PreferredTier, { label: string; description: string }> = {
  tier2: {
    label: 'Tier 2 (Driver)',
    description: 'Lowest security. Mobile-based auth, SMS backup. Highest success rate.'
  },
  tier3: {
    label: 'Tier 3 (Dispatcher)',
    description: 'Medium security. WebAuthn passkey, dashboard SSO. Force multiplier effect.'
  },
  tier4: {
    label: 'Tier 4 (Admin)',
    description: 'Highest security. Hardware keys, biometric. Very low success rate.'
  }
};

const DEFAULT_CONFIG: AttackConfig = {
  riskTolerance: {
    posture: 'balanced',
    detectionRiskThreshold: 0.65,
    holdAttackThreshold: 0.85,
    baseDetectionRisk: 0.20,
    alertPenaltyMultiplier: 0.12,
    stealthPriority: 0.5,
    cascadeBonus: 0.15
  },
  targeting: {
    strategy: 'opportunistic',
    preferredTier: 'tier2',
    avoidRecentlyDetected: true,
    vigilanceThreshold: 0.30,
    susceptibilityMinimum: 0.40,
    randomizationFactor: 0.10
  }
};

const AttackConfigModal = ({ open, onConfirm, onCancel }: AttackConfigModalProps) => {
  const [config, setConfig] = useState<AttackConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'risk' | 'targeting'>('risk');

  if (!open) return null;

  const handlePostureChange = (posture: AttackPosture) => {
    // Auto-adjust related settings based on posture
    let adjustments: Partial<RiskToleranceConfig> = { posture };
    
    switch (posture) {
      case 'stealth':
        adjustments = {
          ...adjustments,
          detectionRiskThreshold: 0.50,
          holdAttackThreshold: 0.70,
          stealthPriority: 0.8,
          cascadeBonus: 0.05
        };
        break;
      case 'aggressive':
        adjustments = {
          ...adjustments,
          detectionRiskThreshold: 0.75,
          holdAttackThreshold: 0.90,
          stealthPriority: 0.3,
          cascadeBonus: 0.20
        };
        break;
      case 'blitz':
        adjustments = {
          ...adjustments,
          detectionRiskThreshold: 0.95,
          holdAttackThreshold: 0.99,
          stealthPriority: 0.1,
          cascadeBonus: 0.30
        };
        break;
      default: // balanced
        adjustments = {
          ...adjustments,
          detectionRiskThreshold: 0.65,
          holdAttackThreshold: 0.85,
          stealthPriority: 0.5,
          cascadeBonus: 0.15
        };
    }

    setConfig(prev => ({
      ...prev,
      riskTolerance: { ...prev.riskTolerance, ...adjustments }
    }));
  };

  const handleStrategyChange = (strategy: TargetingStrategy) => {
    setConfig(prev => ({
      ...prev,
      targeting: { ...prev.targeting, strategy }
    }));
  };

  const handleTierChange = (preferredTier: PreferredTier) => {
    setConfig(prev => ({
      ...prev,
      targeting: { ...prev.targeting, preferredTier }
    }));
  };

  const handleSliderChange = (
    section: 'riskTolerance' | 'targeting',
    key: string,
    value: number
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  const handleCheckboxChange = (key: keyof TargetingConfig) => {
    setConfig(prev => ({
      ...prev,
      targeting: { ...prev.targeting, [key]: !prev.targeting[key] }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl border border-surface-border rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            Pre-Attack Configuration
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Configure attack parameters before deployment. These settings affect decision-making throughout the attack.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-border bg-surface-bg">
          <button
            onClick={() => setActiveTab('risk')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              activeTab === 'risk'
                ? 'text-brand-primary border-b-2 border-brand-primary bg-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
            }`}
          >
            🎯 Risk Tolerance
          </button>
          <button
            onClick={() => setActiveTab('targeting')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              activeTab === 'targeting'
                ? 'text-brand-primary border-b-2 border-brand-primary bg-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
            }`}
          >
            🎯 Targeting Strategy
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'risk' && (
            <div className="space-y-6">
              {/* Posture Selection */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  Attack Posture
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(POSTURE_INFO) as AttackPosture[]).map((posture) => {
                    const info = POSTURE_INFO[posture];
                    const isSelected = config.riskTolerance.posture === posture;
                    return (
                      <button
                        key={posture}
                        onClick={() => handlePostureChange(posture)}
                        className={`text-left border-2 rounded-lg p-4 transition ${
                          isSelected ? info.color : 'border-surface-border hover:border-brand-primary/50'
                        }`}
                      >
                        <div className="font-semibold text-sm">{info.label}</div>
                        <div className="text-xs mt-1 opacity-75">{info.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Threshold Sliders */}
              <div className="space-y-4 pt-4 border-t border-surface-border">
                <h3 className="text-sm font-semibold text-text-primary">Fine-Tune Thresholds</h3>
                
                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Detection Risk Threshold</span>
                    <span className="font-mono">{(config.riskTolerance.detectionRiskThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="0.95"
                    step="0.05"
                    value={config.riskTolerance.detectionRiskThreshold}
                    onChange={(e) => handleSliderChange('riskTolerance', 'detectionRiskThreshold', parseFloat(e.target.value))}
                    className="w-full h-2 bg-surface-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                    <span>Cautious</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Hold Attack Threshold</span>
                    <span className="font-mono">{(config.riskTolerance.holdAttackThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.99"
                    step="0.01"
                    value={config.riskTolerance.holdAttackThreshold}
                    onChange={(e) => handleSliderChange('riskTolerance', 'holdAttackThreshold', parseFloat(e.target.value))}
                    className="w-full h-2 bg-surface-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                    <span>Hold early</span>
                    <span>Never hold</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Stealth Priority</span>
                    <span className="font-mono">{(config.riskTolerance.stealthPriority * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.05"
                    value={config.riskTolerance.stealthPriority}
                    onChange={(e) => handleSliderChange('riskTolerance', 'stealthPriority', parseFloat(e.target.value))}
                    className="w-full h-2 bg-surface-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                    <span>Speed priority</span>
                    <span>Stealth priority</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Cascade Bonus</span>
                    <span className="font-mono">+{(config.riskTolerance.cascadeBonus * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.4"
                    step="0.05"
                    value={config.riskTolerance.cascadeBonus}
                    onChange={(e) => handleSliderChange('riskTolerance', 'cascadeBonus', parseFloat(e.target.value))}
                    className="w-full h-2 bg-surface-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                    <span>Ignore cascades</span>
                    <span>Maximize cascades</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'targeting' && (
            <div className="space-y-6">
              {/* Strategy Selection */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  Targeting Strategy
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(STRATEGY_INFO) as TargetingStrategy[]).map((strategy) => {
                    const info = STRATEGY_INFO[strategy];
                    const isSelected = config.targeting.strategy === strategy;
                    return (
                      <button
                        key={strategy}
                        onClick={() => handleStrategyChange(strategy)}
                        className={`text-left border-2 rounded-lg p-4 transition ${
                          isSelected
                            ? 'border-brand-primary bg-brand-primaryLight text-brand-primary'
                            : 'border-surface-border hover:border-brand-primary/50'
                        }`}
                      >
                        <div className="font-semibold text-sm">{info.label}</div>
                        <div className="text-xs mt-1 opacity-75">{info.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Tier */}
              <div className="pt-4 border-t border-surface-border">
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  Preferred Target Tier
                </label>
                <div className="space-y-2">
                  {(Object.keys(TIER_INFO) as PreferredTier[]).map((tier) => {
                    const info = TIER_INFO[tier];
                    const isSelected = config.targeting.preferredTier === tier;
                    return (
                      <button
                        key={tier}
                        onClick={() => handleTierChange(tier)}
                        className={`w-full text-left border-2 rounded-lg px-4 py-3 transition ${
                          isSelected
                            ? 'border-brand-primary bg-brand-primaryLight'
                            : 'border-surface-border hover:border-brand-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">{info.label}</div>
                            <div className="text-xs mt-1 text-text-secondary">{info.description}</div>
                          </div>
                          {isSelected && (
                            <span className="text-brand-primary text-lg">✓</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Targeting Options */}
              <div className="pt-4 border-t border-surface-border space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">Targeting Options</h3>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.targeting.avoidRecentlyDetected}
                    onChange={() => handleCheckboxChange('avoidRecentlyDetected')}
                    className="w-4 h-4 accent-brand-primary"
                  />
                  <div>
                    <div className="text-sm text-text-primary">Avoid Recently Detected Targets</div>
                    <div className="text-xs text-text-secondary">Skip targets who detected previous attacks (higher vigilance)</div>
                  </div>
                </label>

                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Minimum Susceptibility Score</span>
                    <span className="font-mono">{(config.targeting.susceptibilityMinimum * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={config.targeting.susceptibilityMinimum}
                    onChange={(e) => handleSliderChange('targeting', 'susceptibilityMinimum', parseFloat(e.target.value))}
                    className="w-full h-2 bg-surface-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                    <span>Include all targets</span>
                    <span>Only vulnerable targets</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Randomization Factor</span>
                    <span className="font-mono">{(config.targeting.randomizationFactor * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={config.targeting.randomizationFactor}
                    onChange={(e) => handleSliderChange('targeting', 'randomizationFactor', parseFloat(e.target.value))}
                    className="w-full h-2 bg-surface-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                    <span>Deterministic</span>
                    <span>High variance</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-surface-border bg-surface-bg px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-text-secondary">
              <span className="font-semibold">Current:</span>{' '}
              <span className={POSTURE_INFO[config.riskTolerance.posture].color.split(' ')[0]}>
                {POSTURE_INFO[config.riskTolerance.posture].label}
              </span>
              {' • '}
              {STRATEGY_INFO[config.targeting.strategy].label}
              {' • '}
              {TIER_INFO[config.targeting.preferredTier].label}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-2 border border-surface-border text-sm rounded-lg text-text-primary hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(config)}
                className="px-6 py-2 bg-brand-primary text-white text-sm rounded-lg font-semibold hover:bg-blue-700"
              >
                Continue to Deploy →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackConfigModal;


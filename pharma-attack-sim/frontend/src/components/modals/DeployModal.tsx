import { AttackVector, DriverProfile } from '../../types/simulation';
import type { AttackConfig } from './AttackConfigModal';

interface DeployModalProps {
  open: boolean;
  vectors: AttackVector[];
  driver: DriverProfile | undefined;
  intensity: 'low' | 'medium' | 'high';
  attackConfig?: AttackConfig | null;
  onConfirm: () => void;
  onCancel: () => void;
  onEditConfig?: () => void;
}

const intensityLabels: Record<'low' | 'medium' | 'high', string> = {
  low: 'Low (stealth focus)',
  medium: 'Medium (balanced)',
  high: 'High (aggressive)'
};

const POSTURE_LABELS: Record<string, { label: string; color: string }> = {
  stealth: { label: '🥷 Stealth', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  balanced: { label: '⚖️ Balanced', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  aggressive: { label: '⚡ Aggressive', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  blitz: { label: '💥 Blitz', color: 'text-red-600 bg-red-50 border-red-200' }
};

const STRATEGY_LABELS: Record<string, string> = {
  opportunistic: '🎯 Opportunistic',
  'round-robin': '🔄 Round Robin',
  persistent: '🎯 Persistent',
  fresh: '✨ Fresh Targets'
};

const TIER_LABELS: Record<string, string> = {
  tier2: 'Tier 2 (Driver)',
  tier3: 'Tier 3 (Dispatcher)',
  tier4: 'Tier 4 (Admin)'
};

const DeployModal = ({ open, vectors, driver, intensity, attackConfig, onConfirm, onCancel, onEditConfig }: DeployModalProps) => {
  if (!open) return null;

  const posture = attackConfig?.riskTolerance?.posture || 'balanced';
  const postureInfo = POSTURE_LABELS[posture] || POSTURE_LABELS.balanced;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl border border-surface-border rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-text-primary">Confirm Attack Deployment</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Review the vector stack, target persona, and attack configuration before initiating. All selected vectors will synchronize at T+0.
        </p>

        <div className="mt-6 space-y-4 text-sm text-gray-200">
          {/* Attack Configuration Summary */}
          {attackConfig && (
            <div className="border-2 border-dashed border-brand-primary/30 rounded-lg px-4 py-3 bg-brand-primaryLight/30">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-brand-primary uppercase tracking-wide">Attack Configuration</div>
                {onEditConfig && (
                  <button
                    onClick={onEditConfig}
                    className="text-xs text-brand-primary hover:underline"
                  >
                    Edit Config
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-text-secondary mb-1">Risk Posture</div>
                  <div className={`inline-block text-xs font-semibold px-2 py-1 rounded border ${postureInfo.color}`}>
                    {postureInfo.label}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary mb-1">Targeting</div>
                  <div className="text-sm text-text-primary">
                    {STRATEGY_LABELS[attackConfig.targeting?.strategy || 'opportunistic']}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary mb-1">Detection Threshold</div>
                  <div className="text-sm text-text-primary font-mono">
                    {((attackConfig.riskTolerance?.detectionRiskThreshold || 0.65) * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary mb-1">Preferred Tier</div>
                  <div className="text-sm text-text-primary">
                    {TIER_LABELS[attackConfig.targeting?.preferredTier || 'tier2']}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="text-xs text-text-secondary mb-1">Target Profile</div>
            <div className="flex items-center justify-between border border-surface-border rounded-lg px-4 py-3 bg-surface-bg">
              <div>
                <div className="font-semibold text-base text-text-primary">{driver?.name ?? 'Unknown Driver'}</div>
                <div className="text-xs text-text-secondary mt-1">
                  Persona: {driver?.persona.replace('_', ' ') ?? 'N/A'} • Vulnerability Score: {driver?.vulnerabilityScore ?? '--'} / 100
                </div>
              </div>
              <div className="text-xs text-text-secondary text-right">
                Alert dismissal: {driver?.characteristics.alertDismissalRate ?? '--'}
                <br />
                Experience: {driver ? `${driver.characteristics.experienceYears} yrs` : '--'}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-text-secondary mb-1">Vectors ({vectors.length})</div>
            <div className="grid gap-3 md:grid-cols-2">
              {vectors.map((vector) => (
                <div key={vector.id} className="border border-surface-border rounded-lg px-4 py-3 bg-surface-bg">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm text-text-primary">{vector.name}</div>
                    <span className="text-[10px] text-text-secondary">{vector.type}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-2 leading-5">{vector.description}</p>
                  <div className="mt-3 text-[11px] text-text-secondary">
                    Success Rate: {vector.baseSuccessRate}% • Detectability: {vector.detectability}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-surface-border rounded-lg px-4 py-3 bg-surface-bg">
            <div className="text-xs text-text-secondary mb-1">Intensity</div>
            <div className="text-sm text-text-primary">{intensityLabels[intensity]}</div>
            <p className="text-xs text-text-secondary mt-1">
              Intensity adjusts compromise velocity and detection risk. High intensity accelerates cascade formation but increases detection probability.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2 border border-surface-border text-sm rounded-lg text-text-primary hover:bg-surface-bg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2 bg-brand-primary text-white text-sm rounded-lg font-semibold hover:bg-blue-700"
          >
            🚀 Deploy Attack
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeployModal;



import { AttackVector, DriverProfile } from '../../types/simulation';

interface DeployModalProps {
  open: boolean;
  vectors: AttackVector[];
  driver: DriverProfile | undefined;
  intensity: 'low' | 'medium' | 'high';
  onConfirm: () => void;
  onCancel: () => void;
}

const intensityLabels: Record<'low' | 'medium' | 'high', string> = {
  low: 'Low (stealth focus)',
  medium: 'Medium (balanced)',
  high: 'High (aggressive)'
};

const DeployModal = ({ open, vectors, driver, intensity, onConfirm, onCancel }: DeployModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl border border-surface-border rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-text-primary">Confirm Attack Deployment</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Review the vector stack and target persona before initiating. All selected vectors will synchronize at T+0.
        </p>

        <div className="mt-6 space-y-4 text-sm text-gray-200">
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
            Deploy Attack
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeployModal;



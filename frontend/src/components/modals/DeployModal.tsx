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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl border border-gray-800 rounded-2xl bg-gray-950/95 p-6 shadow-xl shadow-green-500/10">
        <h2 className="text-xl font-semibold tracking-[0.3em] text-green-400 uppercase">Confirm Attack Deployment</h2>
        <p className="mt-2 text-sm text-gray-400">
          Review the vector stack and target persona before initiating. All selected vectors will synchronize at T+0.
        </p>

        <div className="mt-6 space-y-4 text-sm text-gray-200">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Target Profile</div>
            <div className="flex items-center justify-between border border-gray-800 rounded-lg px-4 py-3">
              <div>
                <div className="font-semibold text-base">{driver?.name ?? 'Unknown Driver'}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Persona: {driver?.persona.replace('_', ' ') ?? 'N/A'} • Vulnerability Score: {driver?.vulnerabilityScore ?? '--'} / 100
                </div>
              </div>
              <div className="text-xs text-gray-400 text-right">
                Alert dismissal: {driver?.characteristics.alertDismissalRate ?? '--'}
                <br />
                Experience: {driver ? `${driver.characteristics.experienceYears} yrs` : '--'}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Vectors ({vectors.length})</div>
            <div className="grid gap-3 md:grid-cols-2">
              {vectors.map((vector) => (
                <div key={vector.id} className="border border-gray-800 rounded-lg px-4 py-3 bg-gray-900/40">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold uppercase text-xs tracking-[0.2em] text-green-300">{vector.name}</div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{vector.type}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 leading-5">{vector.description}</p>
                  <div className="mt-3 text-[11px] text-gray-500">
                    Success Rate: {vector.baseSuccessRate}% • Detectability: {vector.detectability}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-800 rounded-lg px-4 py-3 bg-gray-900/40">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Intensity</div>
            <div className="text-sm text-gray-200">{intensityLabels[intensity]}</div>
            <p className="text-xs text-gray-500 mt-1">
              Intensity adjusts compromise velocity and detection risk. High intensity accelerates cascade formation but increases detection probability.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2 border border-gray-700 text-sm uppercase tracking-[0.2em] rounded-lg text-gray-300 hover:border-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2 bg-green-500 text-black text-sm uppercase tracking-[0.3em] rounded-lg font-semibold hover:bg-green-400"
          >
            Deploy Attack
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeployModal;



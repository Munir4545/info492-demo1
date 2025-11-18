import { useMemo } from 'react';
import { useAttackContext } from '../../state/AttackProvider';

const statusClasses: Record<string, string> = {
  idle: 'text-text-secondary border-surface-border',
  starting: 'text-amber-600 border-amber-300',
  running: 'text-brand-primary border-brand-primary/60',
  paused: 'text-amber-700 border-amber-400',
  completed: 'text-emerald-600 border-emerald-300',
  failed: 'text-red-600 border-red-300'
};

const DecisionEnginePanel = () => {
  const { backendStream } = useAttackContext();
  const latestSnapshot = backendStream.snapshots[backendStream.snapshots.length - 1] ?? null;
  const latestEvaluations = useMemo(
    () => [...backendStream.decisionEvaluations].slice(-4).reverse(),
    [backendStream.decisionEvaluations]
  );
  const queuedDecisions = useMemo(
    () => [...backendStream.decisionQueue].slice(-3).reverse(),
    [backendStream.decisionQueue]
  );
  const recentEvents = useMemo(
    () => [...backendStream.events].slice(-4).reverse(),
    [backendStream.events]
  );

  const statusBadgeClass = statusClasses[backendStream.status] || statusClasses.idle;

  return (
    <div className="border border-surface-border rounded-xl bg-white p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Autonomous Decision Engine</h3>
          <p className="text-xs text-text-secondary mt-1">
            Backend attack {backendStream.attackId ? `#${backendStream.attackId}` : 'not started'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] uppercase tracking-wide border rounded-full px-3 py-1 ${statusBadgeClass}`}
          >
            {backendStream.status}
          </span>
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              backendStream.connected ? 'bg-green-500' : 'bg-gray-300'
            }`}
            title={backendStream.connected ? 'Socket connected' : 'Socket disconnected'}
          />
        </div>
      </div>

      {!backendStream.attackId ? (
        <p className="text-sm text-text-secondary">
          Deploy an attack to automatically spin up the backend decision engine. Live evaluations, queue events,
          and analytics will appear here once the pharma backend run is active.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="border border-surface-border rounded-lg p-3">
              <div className="text-xs text-text-secondary">Compromise rate</div>
              <div className="text-lg font-semibold text-text-primary">
                {latestSnapshot ? `${(latestSnapshot.compromise_rate * 100).toFixed(1)}%` : '--'}
              </div>
            </div>
            <div className="border border-surface-border rounded-lg p-3">
              <div className="text-xs text-text-secondary">Detection alerts</div>
              <div className="text-lg font-semibold text-text-primary">
                {latestSnapshot?.detection_alerts ?? '--'}
              </div>
            </div>
            <div className="border border-surface-border rounded-lg p-3">
              <div className="text-xs text-text-secondary">Patient health</div>
              <div className="text-lg font-semibold text-text-primary">
                {latestSnapshot?.average_patient_health ?? '--'}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-text-secondary">
              Last snapshot:{' '}
              {latestSnapshot ? `T+${latestSnapshot.sim_minute}m` : 'pending'}
            </div>
            <button
              onClick={backendStream.refreshAnalytics}
              disabled={!backendStream.attackId}
              className="text-xs px-3 py-1 border border-surface-border rounded-md text-text-secondary hover:bg-surface-bg disabled:opacity-50"
            >
              Refresh Logs
            </button>
          </div>

          <div className="pt-3 border-t border-surface-border/70 space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">Latest Evaluations</h4>
              {latestEvaluations.length === 0 ? (
                <p className="text-xs text-text-secondary">Waiting for evaluation stream…</p>
              ) : (
                <ul className="space-y-2">
                  {latestEvaluations.map((evaluation, idx) => (
                    <li key={`${evaluation.simMinute}-${evaluation.vector}-${idx}`} className="text-xs">
                      <div className="flex items-center justify-between text-text-primary">
                        <span className="font-semibold">{evaluation.vector?.toUpperCase()}</span>
                        <span className="text-text-secondary">
                          T+{evaluation.simMinute}m • {(evaluation.compromiseRate * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-[11px] text-text-secondary mt-1 leading-5">{evaluation.reason}</div>
                      <div className="mt-1 flex text-[11px] text-text-secondary gap-4">
                        <span>Risk {(evaluation.detectionRisk * 100).toFixed(0)}%</span>
                        <span>Health {evaluation.averagePatientHealth ?? '--'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">Queued Actions</h4>
              {queuedDecisions.length === 0 ? (
                <p className="text-xs text-text-secondary">No pending approvals.</p>
              ) : (
                <ul className="space-y-2">
                  {queuedDecisions.map((queued, idx) => (
                    <li
                      key={`${queued.vector}-${queued.simMinute}-${idx}`}
                      className="text-xs border border-surface-border rounded-lg p-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{queued.vector.toUpperCase()}</span>
                        <span className="text-[10px] uppercase text-amber-600">{queued.severity}</span>
                      </div>
                      <div className="text-[11px] text-text-secondary mt-1 leading-5">
                        {queued.description}
                      </div>
                      <div className="text-[11px] text-text-secondary mt-1 flex gap-4">
                        <span>T+{queued.simMinute}m</span>
                        <span>Risk {(queued.detectionRisk * 100).toFixed(0)}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">Event Log</h4>
              {recentEvents.length === 0 ? (
                <p className="text-xs text-text-secondary">No events logged yet.</p>
              ) : (
                <ul className="space-y-2 text-xs">
                  {recentEvents.map((event) => (
                    <li key={event.id} className="border border-surface-border rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{event.event_type ?? 'event'}</span>
                        <span className="text-text-secondary">T+{event.sim_minute ?? '--'}m</span>
                      </div>
                      <div className="text-[11px] text-text-secondary mt-1 leading-5">{event.description}</div>
                      <div className="text-[11px] text-text-secondary mt-1 flex gap-4">
                        <span>Vector {event.vector ?? '--'}</span>
                        <span>Outcome {event.outcome ?? 'n/a'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DecisionEnginePanel;


import { useState, useMemo } from 'react';
import { useAttackContext } from '../state/AttackProvider';
import DeliveryMap from '../components/map/DeliveryMap';
import AttackMetricsPanel from '../components/metrics/AttackMetricsPanel';
import LLMConsole from '../components/console/LLMConsole';
import InterventionQueue from '../components/console/InterventionQueue';
import DeployModal from '../components/modals/DeployModal';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import type { AttackSimulationState, Delivery, AttackVector, AttackHistory } from '../types/simulation';

type Mode = 'deploy' | 'monitor' | 'analyze';

const modeLabels: Record<Mode, string> = {
  deploy: 'DEPLOY MODE',
  monitor: 'MONITOR MODE',
  analyze: 'ANALYZE MODE'
};

const HackerDashboard = () => {
  const {
    attackVectors,
    driverProfiles,
    control,
    simulation,
    deliveries,
    toggleVector,
    selectDriver,
    setIntensity,
    setDeployModalOpen,
    startAttack,
    history,
    exportLatestReport
  } = useAttackContext();
  const [mode, setMode] = useState<Mode>('deploy');

  const selectedVectors = attackVectors.filter((vector) => control.selectedVectors.includes(vector.id));
  const selectedDriver = driverProfiles.find((profile) => profile.id === control.selectedDriver);
  const deployDisabled = selectedVectors.length === 0 || !selectedDriver;

  const handleDeploy = () => {
    if (deployDisabled) return;
    setDeployModalOpen(true);
  };

  const handleConfirmDeploy = () => {
    const started = startAttack();
    if (started) {
      setMode('monitor');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans">
      <header className="border-b border-gray-800 px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-[0.25em] text-green-400 uppercase">Pharma Attack Simulator</h1>
            <p className="mt-2 text-sm text-gray-400 font-mono">
              Target compromise threshold: {simulation.targetCompromisePercentage}% • Phase: {simulation.phase.toUpperCase()}
              {simulation.paused ? ' (PAUSED)' : ''} • Time: T+{simulation.elapsedMinutes}m
            </p>
          </div>
          <div className="flex gap-3">
            {(Object.keys(modeLabels) as Mode[]).map((modeKey) => (
              <button
                key={modeKey}
                onClick={() => setMode(modeKey)}
                className={`px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase transition ${
                  mode === modeKey
                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/40'
                    : 'bg-gray-900 text-gray-400 hover:text-green-300 hover:bg-gray-800'
                }`}
              >
                {modeLabels[modeKey]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-8 py-6 space-y-6">
        {mode === 'deploy' && (
          <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-6 space-y-6">
              <h2 className="text-xl font-semibold tracking-[0.2em] text-green-400 uppercase">Vector Selection</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {attackVectors.map((vector) => {
                  const selected = control.selectedVectors.includes(vector.id);
                  return (
                    <label
                      key={vector.id}
                      className={`border rounded-lg p-4 transition cursor-pointer ${
                        selected ? 'border-green-400 bg-green-500/10' : 'border-gray-700 hover:border-green-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm uppercase tracking-wide">{vector.name}</div>
                          <div className="text-xs text-gray-400 mt-1">Success Rate: {vector.baseSuccessRate}%</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleVector(vector.id)}
                          className="h-4 w-4 accent-green-500"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2 leading-5">{vector.description}</p>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-6 space-y-3">
                <h2 className="text-xl font-semibold tracking-[0.2em] text-green-400 uppercase">Target Profile</h2>
                {driverProfiles.map((profile) => {
                  const selected = control.selectedDriver === profile.id;
                  return (
                    <button
                      key={profile.id}
                      onClick={() => selectDriver(profile.id)}
                      className={`w-full text-left border rounded-lg px-4 py-3 transition ${
                        selected ? 'border-green-400 bg-green-500/10' : 'border-gray-700 hover:border-green-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold uppercase tracking-wide text-sm">{profile.name}</div>
                          <div className="text-xs text-gray-400 mt-1">Persona: {profile.persona.replace('_', ' ')}</div>
                        </div>
                        <span className="text-xs font-mono text-green-400">Score: {profile.vulnerabilityScore}/100</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-6 space-y-4">
                <h2 className="text-xl font-semibold tracking-[0.2em] text-green-400 uppercase">Attack Intensity</h2>
                <div className="flex gap-3">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setIntensity(level)}
                      className={`flex-1 px-4 py-2 border rounded-lg uppercase text-xs tracking-[0.2em] ${
                        control.intensity === level
                          ? 'border-green-400 bg-green-500/10 text-green-300'
                          : 'border-gray-700 text-gray-400 hover:border-green-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleDeploy}
                  disabled={deployDisabled}
                  className={`w-full mt-2 font-mono tracking-[0.3em] uppercase py-3 rounded-lg transition ${
                    deployDisabled
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-black hover:bg-green-400'
                  }`}
                >
                  Deploy Attack
                </button>
                <p className="text-xs text-gray-500">
                  Confirmation required. Deployment will log to the LLM console and initialize simulation state.
                </p>
              </div>
            </div>
          </section>
        )}

        {mode === 'monitor' && (
          <section className="space-y-6">
            <MonitorControls />
            <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-4">
                <h2 className="text-lg font-semibold tracking-[0.2em] text-green-400 uppercase mb-3">Seattle Operational Theater</h2>
                <DeliveryMap />
              </div>
              <AttackMetricsPanel />
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-4">
                <h3 className="text-lg font-semibold tracking-[0.2em] text-green-400 uppercase mb-3">LLM Decision Console</h3>
                <LLMConsole />
              </div>
              <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-4">
                <h3 className="text-lg font-semibold tracking-[0.2em] text-green-400 uppercase mb-3">Intervention Queue</h3>
                <InterventionQueue />
              </div>
            </div>
          </section>
        )}

        {mode === 'analyze' && (
          <AnalyzeSection
            simulation={simulation}
            deliveries={deliveries}
            attackVectors={attackVectors}
            history={history}
            exportLatestReport={exportLatestReport}
          />
        )}
      </main>

      <DeployModal
        open={control.deployModalOpen}
        vectors={selectedVectors}
        driver={selectedDriver}
        intensity={control.intensity}
        onConfirm={handleConfirmDeploy}
        onCancel={() => setDeployModalOpen(false)}
      />
    </div>
  );
};

export default HackerDashboard;

const TimelineTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded bg-gray-900/90 px-3 py-2 text-xs text-gray-200 border border-gray-700 shadow-lg">
      <div>Minute: {point.minute}</div>
      <div>Compromise: {point.compromise.toFixed(1)}%</div>
    </div>
  );
};

const MonitorControls = () => {
  const { simulation, pauseAttack, resumeAttack, setLiveIntensity, triggerManualCascade } = useAttackContext();
  const isRunning = simulation.phase === 'executing' || simulation.phase === 'detected';
  const paused = simulation.paused;

  const handlePauseToggle = () => {
    if (!isRunning && !paused) return;
    if (paused) {
      resumeAttack();
    } else {
      pauseAttack();
    }
  };

  const handleCascade = () => {
    triggerManualCascade();
  };

  return (
    <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handlePauseToggle}
          className={`px-4 py-2 text-xs uppercase tracking-[0.3em] rounded-lg border transition ${
            paused
              ? 'border-green-500 text-green-300 hover:bg-green-500/10'
              : 'border-yellow-500 text-yellow-300 hover:bg-yellow-500/10'
          }`}
          disabled={!isRunning && !paused}
        >
          {paused ? 'Resume Attack' : 'Pause Attack'}
        </button>
        <button
          onClick={handleCascade}
          className="px-4 py-2 text-xs uppercase tracking-[0.3em] rounded-lg border border-red-500 text-red-300 hover:bg-red-500/10"
          disabled={!isRunning}
        >
          Trigger Cascade
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Intensity</span>
        {(['low', 'medium', 'high'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setLiveIntensity(level)}
            className={`px-3 py-1 text-xs uppercase tracking-[0.3em] rounded border transition ${
              simulation.attackIntensity === level
                ? 'border-green-500 text-green-300'
                : 'border-gray-700 text-gray-400 hover:border-green-400 hover:text-green-300'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-400 font-mono">
        {paused ? 'STATUS: PAUSED FOR OVERRIDE' : isRunning ? 'STATUS: LIVE EXECUTION' : 'STATUS: IDLE'}
      </div>
    </div>
  );
};

interface AnalyzeSectionProps {
  simulation: AttackSimulationState;
  deliveries: Delivery[];
  attackVectors: AttackVector[];
  history: AttackHistory[];
  exportLatestReport: () => boolean;
}

const AnalyzeSection = ({ simulation, deliveries, attackVectors, history, exportLatestReport }: AnalyzeSectionProps) => {
  const latestHistory = history[0] ?? null;
  const compromisePct = latestHistory ? latestHistory.results.compromiseRate * 100 : simulation.compromisePercentage;
  const detectionDelay = latestHistory ? latestHistory.results.detectionDelay ?? 0 : simulation.detectionDelay || 0;
  const durationMinutes = latestHistory ? latestHistory.durationMinutes : simulation.elapsedMinutes;
  const cascadeEvents = latestHistory
    ? latestHistory.results.cascadeEvents
    : deliveries.filter((delivery) => delivery.cascadeAffected || delivery.status === 'compromised' || delivery.status === 'delayed').length;

  const timelineData = useMemo(() => (latestHistory ? latestHistory.timeline : simulation.timeline), [latestHistory, simulation.timeline]);

  const vectorRanking = useMemo(() => {
    const effectiveness = latestHistory ? latestHistory.results.vectorEffectiveness : simulation.vectorEffectiveness;
    const entries = Object.entries(effectiveness || {});
    if (!entries.length) return [];
    const total = latestHistory ? 100 : entries.reduce((acc, [, value]) => acc + value, 0) || 1;
    return entries
      .map(([id, value]) => {
        const vector = attackVectors.find((v) => v.id === id);
        const percent = latestHistory ? value : (value / total) * 100;
        return {
          id,
          name: vector?.name ?? id,
          percent
        };
      })
      .sort((a, b) => b.percent - a.percent);
  }, [attackVectors, latestHistory, simulation.vectorEffectiveness]);

  const transcriptPreview = useMemo(() => {
    const source = latestHistory?.transcript ?? [];
    return source.slice(-8).reverse();
  }, [latestHistory]);

  const cascadeHighlights = useMemo(
    () =>
      deliveries
        .filter((delivery) => delivery.status === 'compromised' || delivery.status === 'delayed' || delivery.cascadeAffected)
        .slice(0, 6),
    [deliveries]
  );

  const handleExport = () => {
    const success = exportLatestReport();
    if (!success) {
      alert('No completed attack report available yet.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-[0.3em] text-green-400 uppercase">Post-Attack Analysis</h2>
          <p className="text-xs text-gray-500 mt-1">Most recent session: {latestHistory ? latestHistory.sessionId : 'Live Simulation'}</p>
        </div>
        <button
          onClick={handleExport}
          className="self-start md:self-auto px-4 py-2 border border-green-500 text-green-300 text-xs uppercase tracking-[0.3em] rounded-lg hover:bg-green-500/10"
        >
          Export Attack Report
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Compromise" value={`${compromisePct.toFixed(1)}%`} subtitle="Total compromise achieved" />
        <SummaryCard label="Detection Delay" value={`${detectionDelay} m`} subtitle="Impact vs detection ratio" />
        <SummaryCard label="Duration" value={`${durationMinutes} m`} subtitle="Attack runtime" />
        <SummaryCard label="Cascade Events" value={`${cascadeEvents}`} subtitle="Deliveries impacted downstream" />
      </div>

      <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-6">
        <h3 className="text-sm font-semibold tracking-[0.3em] text-green-400 uppercase mb-4">Timeline</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="analyzeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="minute" stroke="#475569" tick={{ fontSize: 10 }} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<TimelineTooltip />} />
            <Area type="monotone" dataKey="compromise" stroke="#4ade80" fill="url(#analyzeGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-6">
          <h3 className="text-sm font-semibold tracking-[0.3em] text-green-400 uppercase mb-4">Vector Effectiveness</h3>
          {vectorRanking.length ? (
            <ul className="space-y-3 text-sm text-gray-200">
              {vectorRanking.map((vector, index) => (
                <li key={vector.id} className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-500">#{index + 1}</span>
                    {vector.name}
                  </span>
                  <span className="font-mono text-green-300">{vector.percent.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">No vector data available yet.</p>
          )}
        </div>

        <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-6">
          <h3 className="text-sm font-semibold tracking-[0.3em] text-green-400 uppercase mb-4">Transcript Highlights</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs text-gray-300 bg-gray-950/40 rounded-lg p-3">
            {transcriptPreview.length ? (
              transcriptPreview.map((entry, idx) => (
                <div key={`${entry.timestamp}-${idx}`}>
                  <span className="text-green-400 mr-2">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-yellow-300 mr-2">[{entry.agent}]</span>
                  <span>{entry.content}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500">Complete an attack to review transcript highlights.</div>
            )}
          </div>
        </div>
      </div>

      <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-6">
        <h3 className="text-sm font-semibold tracking-[0.3em] text-green-400 uppercase mb-4">Cascade Summary</h3>
        {cascadeHighlights.length ? (
          <ul className="space-y-2 text-sm text-gray-300">
            {cascadeHighlights.map((delivery) => (
              <li key={delivery.id} className="flex items-center justify-between">
                <span>{delivery.id} • {delivery.medication}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-yellow-300">{delivery.status.replace('_', ' ')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">No cascade effects recorded.</p>
        )}
      </div>

      <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-6">
        <h3 className="text-sm font-semibold tracking-[0.3em] text-green-400 uppercase mb-4">Attack History</h3>
        {history.length ? (
          <div className="space-y-3 text-sm text-gray-300">
            {history.map((entry) => (
              <div key={entry.sessionId} className="border border-gray-800 rounded-lg px-4 py-3 bg-gray-950/40">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-green-300">{(entry.results.compromiseRate * 100).toFixed(1)}%</span>
                </div>
                <div className="mt-1">Driver: {entry.targetDriver.name ?? 'Unknown'} • Vectors: {entry.vectorsDeployed.join(', ')}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">Complete an attack to populate history.</p>
        )}
      </div>
    </section>
  );
};

const SummaryCard = ({ label, value, subtitle }: { label: string; value: string; subtitle: string }) => (
  <div className="border border-gray-800 rounded-xl bg-gray-900/60 p-5">
    <div className="text-xs uppercase tracking-[0.3em] text-gray-500">{label}</div>
    <div className="text-2xl font-semibold text-green-300 mt-2">{value}</div>
    <div className="text-[11px] text-gray-500 mt-1">{subtitle}</div>
  </div>
);



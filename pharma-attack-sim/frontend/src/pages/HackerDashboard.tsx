import { useState, useMemo } from 'react';
import { useAttackContext } from '../state/AttackProvider';
import DeliveryMap from '../components/map/DeliveryMap';
import AttackMetricsPanel from '../components/metrics/AttackMetricsPanel';
import LLMConsole from '../components/console/LLMConsole';
import InterventionQueue from '../components/console/InterventionQueue';
import DecisionEnginePanel from '../components/console/DecisionEnginePanel';
import DeployModal from '../components/modals/DeployModal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import type { AttackSimulationState, Delivery, AttackVector, AttackHistory } from '../types/simulation';
import {
  calculateHealthImpact,
  calculateCorrelation,
  calculateSystemStrain,
  calculateFinancialImpact,
  determinePatientJourney,
  formatMinutesToHours,
  getTemporalProgressionBucket,
  getCorrelationSeries,
  getPatientData,
} from '../utils/impactCalculations';
import { disruptionCorrelationModel, attackScenarios } from '../data/syntheticAttackData';

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
    exportLatestReport,
    backendStream
  } = useAttackContext();
  const [mode, setMode] = useState<Mode>('deploy');

  const selectedVectors = attackVectors.filter((vector) => control.selectedVectors.includes(vector.id));
  const selectedDriver = driverProfiles.find((profile) => profile.id === control.selectedDriver);
  const deployDisabled = selectedVectors.length === 0 || !selectedDriver;

  const driverTargets = driverProfiles.filter((profile) => profile.role !== 'DISPATCHER');
  const dispatcherTargets = driverProfiles.filter((profile) => profile.role === 'DISPATCHER');

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
    <div className="min-h-screen bg-surface-bg text-text-primary font-sans">
      <header className="border-b border-surface-border bg-white/70 backdrop-blur px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Pharma Attack Simulator</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Target compromise threshold: {simulation.targetCompromisePercentage}% • Phase: {simulation.phase.toUpperCase()}
              {simulation.paused ? ' (PAUSED)' : ''} • Time: T+{simulation.elapsedMinutes}m • Backend:{' '}
              {backendStream.attackId ? `#${backendStream.attackId} (${backendStream.status})` : 'not running'}
            </p>
          </div>
          <div className="flex gap-3">
            {(Object.keys(modeLabels) as Mode[]).map((modeKey) => (
              <button
                key={modeKey}
                onClick={() => setMode(modeKey)}
                className={`px-3 py-2 text-xs rounded-md border transition ${
                  mode === modeKey
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-white text-text-secondary border-surface-border hover:bg-surface-bg'
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
            <div className="border border-surface-border rounded-xl bg-white p-6 space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">Vectors</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {attackVectors.map((vector) => {
                  const selected = control.selectedVectors.includes(vector.id);
                  return (
                    <label
                      key={vector.id}
                      className={`border rounded-lg p-4 transition cursor-pointer ${
                        selected ? 'border-brand-primary bg-brand-primaryLight' : 'border-surface-border hover:border-brand-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{vector.name}</div>
                          <div className="text-xs text-text-secondary mt-1">Success Rate: {vector.baseSuccessRate}%</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleVector(vector.id)}
                          className="h-4 w-4 accent-blue-600"
                        />
                      </div>
                      <p className="text-xs text-text-secondary mt-2 leading-5">{vector.description}</p>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-surface-border rounded-xl bg-white p-6 space-y-3">
                <h2 className="text-lg font-semibold text-text-primary">Target profile</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs uppercase text-text-secondary mb-2">Drivers (individual impact)</h3>
                    <div className="space-y-3">
                      {driverTargets.map((profile) => {
                        const selected = control.selectedDriver === profile.id;
                        const isSoniaDriver = profile.id === attackScenarios.targetDriver.id;
                        const expectedCompromise = isSoniaDriver
                          ? `${Math.round(attackScenarios.targetDriver.expectedCompromise * 100)}%`
                          : `${profile.activeDeliveries.length * 2.1 <= 0 ? '~' : Math.min(Math.round((profile.activeDeliveries.length / deliveries.length) * 100 + 10), 45)}%`;
                        return (
                          <button
                            key={profile.id}
                            onClick={() => selectDriver(profile.id)}
                            className={`w-full text-left border rounded-lg px-4 py-3 transition ${
                              selected ? 'border-brand-primary bg-brand-primaryLight' : 'border-surface-border hover:border-brand-primary'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">{profile.name} <span className="text-xs text-text-secondary">(Driver)</span></div>
                                <div className="text-xs text-text-secondary mt-1">
                                  Persona: {profile.persona.replace('_', ' ')} • Deliveries: {profile.activeDeliveries.length || 1}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-text-secondary">Score: {profile.vulnerabilityScore}/100</div>
                                <div className="text-xs text-text-secondary">Expected: {expectedCompromise}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {dispatcherTargets.length > 0 && (
                    <div className="pt-4 border-t border-surface-border/70">
                      <h3 className="text-xs uppercase text-text-secondary mb-2">Dispatchers (force multiplier)</h3>
                      <div className="space-y-3">
                        {dispatcherTargets.map((profile) => {
                          const selected = control.selectedDriver === profile.id;
                          const scenario = attackScenarios.targetDispatcher;
                          return (
                            <button
                              key={profile.id}
                              onClick={() => selectDriver(profile.id)}
                              className={`w-full text-left border rounded-lg px-4 py-3 transition ${
                                selected ? 'border-brand-primary bg-brand-primaryLight' : 'border-surface-border hover:border-brand-primary'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm flex items-center gap-1">
                                    {profile.name}
                                    <span className="text-[10px] uppercase text-brand-primary border border-brand-primary/40 rounded px-1">Dispatcher</span>
                                  </div>
                                  <div className="text-xs text-text-secondary mt-1">
                                    Drivers managed: {profile.driversManaged?.length ?? scenario.driversManaged} • Deliveries: {profile.activeDeliveriesManaged ?? scenario.deliveriesManaged}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-text-secondary">Score: {profile.vulnerabilityScore}/100</div>
                                  <div className="text-xs text-red-500 font-semibold">Expected: {Math.round(scenario.expectedCompromise * 100)}%</div>
                                </div>
                              </div>
                              <div className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                <span role="img" aria-label="warning">⚡</span> High impact scenario • Force multiplier {scenario.cascadeMultiplier}×
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-surface-border rounded-xl bg-white p-6 space-y-4">
                <h2 className="text-lg font-semibold text-text-primary">Attack intensity</h2>
                <div className="flex gap-3">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setIntensity(level)}
                      className={`flex-1 px-4 py-2 border rounded-lg text-xs ${
                        control.intensity === level
                          ? 'border-brand-primary bg-brand-primaryLight text-text-primary'
                          : 'border-surface-border text-text-secondary hover:border-brand-primary'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleDeploy}
                  disabled={deployDisabled}
                  className={`w-full mt-2 rounded-lg transition py-3 ${
                    deployDisabled
                      ? 'bg-surface-bg text-text-secondary cursor-not-allowed'
                      : 'bg-brand-primary text-white hover:bg-blue-700'
                  }`}
                >
                  Deploy Attack
                </button>
                <p className="text-xs text-text-secondary">
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
              <div className="border border-surface-border rounded-xl bg-white p-4">
                <h2 className="text-lg font-semibold text-text-primary mb-3">Seattle Operational Theater</h2>
                <DeliveryMap />
              </div>
              <AttackMetricsPanel />
            </div>
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="border border-surface-border rounded-xl bg-white p-4">
                <h3 className="text-lg font-semibold text-text-primary mb-3">LLM Decision Console</h3>
                <LLMConsole />
              </div>
              <div className="space-y-6">
                <div className="border border-surface-border rounded-xl bg-white p-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Human-in-the-Loop Control</h3>
                  <InterventionQueue />
                </div>
                <DecisionEnginePanel />
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
    <div className="rounded bg-white px-3 py-2 text-xs text-text-primary border border-surface-border shadow">
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
    <div className="border border-surface-border rounded-xl bg-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handlePauseToggle}
          className={`px-4 py-2 text-xs rounded-lg border transition ${
            paused
              ? 'border-brand-primary text-brand-primary hover:bg-brand-primary/10'
              : 'border-surface-border text-text-secondary hover:bg-surface-bg'
          }`}
          disabled={!isRunning && !paused}
        >
          {paused ? 'Resume Attack' : 'Pause Attack'}
        </button>
        <button
          onClick={handleCascade}
          className="px-4 py-2 text-xs rounded-lg border border-surface-border text-text-secondary hover:bg-surface-bg"
          disabled={!isRunning}
        >
          Trigger Cascade
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-text-secondary">Intensity</span>
        {(['low', 'medium', 'high'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setLiveIntensity(level)}
            className={`px-3 py-1 text-xs rounded border transition ${
              simulation.attackIntensity === level
                ? 'border-brand-primary text-brand-primary'
                : 'border-surface-border text-text-secondary hover:border-brand-primary hover:text-brand-primary'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      <div className="text-xs text-text-secondary">
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
  const { finalOutcome, decisions } = useAttackContext();
  const latestHistory = history[0] ?? null;
  const compromisePct = latestHistory ? latestHistory.results.compromiseRate * 100 : simulation.compromisePercentage;
  const detectionDelay = latestHistory ? latestHistory.results.detectionDelay ?? 0 : simulation.detectionDelay || 0;
  const cascadeEvents = latestHistory
    ? latestHistory.results.cascadeEvents
    : deliveries.filter((delivery) => delivery.cascadeAffected || delivery.status === 'compromised' || delivery.status === 'delayed').length;

  const timelineData = useMemo(() => (latestHistory ? latestHistory.timeline : simulation.timeline), [latestHistory, simulation.timeline]);

  const compromisedDeliveries = deliveries.filter(
    (delivery) =>
      (delivery.status === 'compromised' || delivery.status === 'delayed' || delivery.cascadeAffected) &&
      !!getPatientData(delivery)
  );

  const minutesSinceStart = simulation.elapsedMinutes;

  const patientReports = useMemo(() => {
    return compromisedDeliveries
      .map((delivery) => {
        const patientData = getPatientData(delivery);
        const minutesSinceExpected = Math.max(minutesSinceStart - (delivery.timeRemaining ?? 0), 0);
        const impact = calculateHealthImpact(delivery, minutesSinceExpected);
        const journey = determinePatientJourney(minutesSinceExpected);
        return {
          delivery,
          patientData,
          impact,
          minutesSinceExpected,
          journey,
        };
      })
      .filter((report) => report.impact && report.patientData);
  }, [compromisedDeliveries, minutesSinceStart]);

  const averageHealthScore = patientReports.length
    ? patientReports.reduce((acc, report) => acc + (report.impact?.healthScore ?? 0), 0) / patientReports.length
    : calculateCorrelation(compromisePct).averageHealthScore;

  const criticalPatientCount = patientReports.filter((report) => report.patientData?.criticality === 'critical').length;
  const highPatientCount = patientReports.filter((report) => report.patientData?.criticality === 'high').length;

  const correlation = calculateCorrelation(compromisePct);
  const correlationSeries = useMemo(() => getCorrelationSeries(), []);
  const systemStrain = calculateSystemStrain(criticalPatientCount, compromisePct);
  const financialImpact = calculateFinancialImpact(criticalPatientCount, highPatientCount);
  const temporalBucket = getTemporalProgressionBucket(minutesSinceStart);
  const temporalDetails = disruptionCorrelationModel.temporalProgression[temporalBucket];

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
          percent,
        };
      })
      .sort((a, b) => b.percent - a.percent);
  }, [attackVectors, latestHistory, simulation.vectorEffectiveness]);

  const transcriptPreview = useMemo(() => {
    const source = latestHistory?.transcript ?? [];
    return source.slice(-8).reverse();
  }, [latestHistory]);

  const handleExport = () => {
    const success = exportLatestReport();
    if (!success) {
      alert('No completed attack report available yet.');
    }
  };

  const keyInsights = [
    `30% compromise → ${averageHealthScore.toFixed(0)}/100 average patient health (r = -0.89)`,
    `Each compromised delivery impacts ≈2.1 adjacent patients (cascade amplification)`,
    `System strain: ${correlation.systemStrain.toUpperCase()} — crisis threshold at 40%`,
    `Time-critical window: 4-8 hours for insulin to avoid DKA escalation`,
    `Avg. cost per critical medication missed: $${disruptionCorrelationModel.financialImpact.perCriticalMedicationMissed.total.toLocaleString()}`,
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">System Disruption → Human Impact</h2>
          <p className="text-xs text-text-secondary mt-1">Most recent session: {latestHistory ? latestHistory.sessionId : 'Live Simulation'}</p>
        </div>
        <button
          onClick={handleExport}
          className="self-start md:self-auto px-4 py-2 border border-brand-primary text-brand-primary text-xs rounded-lg hover:bg-brand-primary/10"
        >
          Export Impact Report
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SummaryCard
          label="Compromise Achieved"
          value={`${simulation.compromisePercentage.toFixed(1)}%`}
          subtitle={`Target: ${simulation.targetCompromisePercentage}% • Cascade radius ${simulation.cascadeRadius.toFixed(1)}km`}
        />
        <SummaryCard
          label="Detection"
          value={simulation.detectionTime ? `T+${simulation.elapsedMinutes}m` : 'Undetected'}
          subtitle={`Risk ${Math.round(simulation.detectionRisk * 100)}% • Delay ${simulation.detectionDelay || 0}m`}
        />
        <SummaryCard
          label="Final Grade"
          value={finalOutcome ? `${finalOutcome.grade.grade}` : 'Pending'}
          subtitle={finalOutcome ? finalOutcome.grade.label : 'Complete attack to evaluate'}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryCard label="Compromise" value={`${compromisePct.toFixed(1)}%`} subtitle="System compromise level" />
          <SummaryCard label="Deliveries Affected" value={`${cascadeEvents}`} subtitle="Compromised or cascading" />
          <SummaryCard label="Detection Delay" value={`${detectionDelay} m`} subtitle="Impact vs detection" />
          <SummaryCard label="Cascade Ratio" value={`${simulation.cascadeRadius.toFixed(1)}x`} subtitle="Downstream multiplier" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryCard label="Patients Affected" value={`${(correlation.patientsAffected * 100).toFixed(0)}%`} subtitle="Critical patients impacted" />
          <SummaryCard label="Avg Health Score" value={`${averageHealthScore.toFixed(0)}/100`} subtitle="Aggregate health state" />
          <SummaryCard label="Emergency Events" value={`${(correlation.emergencyEvents * 100).toFixed(0)}%`} subtitle="Projected ER probability" />
          <SummaryCard label="System Strain" value={correlation.systemStrain.toUpperCase()} subtitle={correlation.description} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="border border-surface-border rounded-xl bg-white p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">System Compromise vs Patient Health</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={correlationSeries} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="compromise" tickFormatter={(value) => `${value}%`} stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip formatter={(value: number) => `${Number(value).toFixed(0)}`} labelFormatter={(label) => `${label}% compromise`} />
              <Line type="monotone" dataKey="healthScore" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
              <ReferenceLine x={compromisePct} stroke="#f97316" strokeDasharray="4 4" />
              <ReferenceDot x={compromisePct} y={averageHealthScore} r={6} fill="#f97316" />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-3 text-sm text-text-secondary">
            Current correlation: {compromisePct.toFixed(0)}% compromise → average patient health {averageHealthScore.toFixed(0)}/100.
          </p>
        </div>

        <div className="border border-surface-border rounded-xl bg-white p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Attack Timeline</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="analyzeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="minute" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<TimelineTooltip />} />
              <Area type="monotone" dataKey="compromise" stroke="#2563eb" fill="url(#analyzeGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 text-sm text-text-secondary">
            <div>Elapsed time: T+{simulation.elapsedMinutes} minutes</div>
            <div>Expected detection: T+{simulation.detectionExpectedAt} minutes</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="border border-surface-border rounded-xl bg-white p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Individual Patient Impacts</h3>
          {patientReports.length ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {patientReports.map(({ delivery, patientData, impact, minutesSinceExpected, journey }) => (
                <div key={delivery.id} className="border border-surface-border rounded-lg p-4 bg-surface-bg space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {patientData?.patientProfile.name} • {delivery.medication}
                      </div>
                      <div className="text-xs text-text-secondary">Delivery {delivery.id} • {delivery.status.replace('_', ' ').toUpperCase()}</div>
                    </div>
                    <div className={`text-sm font-semibold ${impact && impact.healthScore <= 45 ? 'text-red-600' : 'text-amber-600'}`}>
                      Health: {impact?.healthScore ?? '--'}/100
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="text-xs text-text-secondary space-y-1">
                      <div>Time since expected dose: {formatMinutesToHours(minutesSinceExpected)}</div>
                      <div>Current severity: {impact?.severity}</div>
                      <div>Medical risk: {impact?.medicalRisk}</div>
                    </div>
                    <div className="text-xs text-text-secondary space-y-1">
                      <div>Symptoms: {impact?.symptoms.join(', ') || 'Monitoring'}</div>
                      {impact?.alternativeAction && <div>Recommended action: {impact.alternativeAction}</div>}
                      <div>Intervention needed: {impact?.interventionNeeded ? 'YES' : 'Monitoring'}</div>
                    </div>
                  </div>
                  <div className="text-xs text-text-secondary">
                    Patient actions: {journey.actionsTaken.join(' • ')}
                  </div>
                  {patientData && (
                    <div className="text-xs text-text-secondary space-y-1">
                      <div>Projected outcomes:</div>
                      <ul className="list-disc pl-4 space-y-1">
                        {Object.entries(patientData.systemImpact).map(([key, value]) => (
                          <li key={key}>
                            {key.replace(/([A-Z])/g, ' $1')}: {(value.probability * 100).toFixed(0)}% • ${value.cost.toLocaleString()}
                            {value.duration ? ` • ${value.duration}` : value.waitTime ? ` • ${value.waitTime}` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">No compromised critical patients in this window.</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="border border-surface-border rounded-xl bg-white p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Healthcare System Strain</h3>
            <div className="space-y-4 text-sm text-text-secondary">
              <MetricBar label="Pharmacy Call Volume" value={systemStrain.pharmacyCallVolume} baseline={45} suffix=" calls/hr" capacityPercent={systemStrain.pharmacyCapacityPercent} />
              <MetricBar label="ER Admissions" value={systemStrain.emergencyRoomAdmissions} baseline={12} suffix=" / day" />
              <MetricBar label="Ambulance Dispatches" value={systemStrain.ambulanceDispatches} baseline={8} suffix=" / day" />
              <div>
                <div>Wait time increase: +{systemStrain.waitTimeIncrease} minutes</div>
                <div>Response delay: +{systemStrain.responseDelay} minutes</div>
              </div>
              <div>
                <div>Alternative care utilization:</div>
                <ul className="list-disc pl-4">
                  <li>Urgent Care: ↑ {(systemStrain.careUtilization.urgentCareVisits * 100).toFixed(0)}%</li>
                  <li>Telehealth: ↑ {(systemStrain.careUtilization.telehealth * 100).toFixed(0)}%</li>
                  <li>Alternate Pharmacies: ↑ {(systemStrain.careUtilization.alternativePharmacies * 100).toFixed(0)}%</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border border-surface-border rounded-xl bg-white p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Financial Impact</h3>
            <div className="text-xs text-text-secondary space-y-2">
              <div className="font-semibold text-text-primary">Critical Medication</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Direct medical: ${financialImpact.criticalCost.directMedical.toLocaleString()}</li>
                <li>Productivity loss: ${financialImpact.criticalCost.productivityLoss.toLocaleString()}</li>
                <li>Alternative medication: ${financialImpact.criticalCost.alternativeMedication.toLocaleString()}</li>
                <li>Transportation: ${financialImpact.criticalCost.transportation.toLocaleString()}</li>
              </ul>
              <div className="font-semibold text-text-primary mt-3">High Priority Medication</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Direct medical: ${financialImpact.highCost.directMedical.toLocaleString()}</li>
                <li>Productivity loss: ${financialImpact.highCost.productivityLoss.toLocaleString()}</li>
                <li>Alternative medication: ${financialImpact.highCost.alternativeMedication.toLocaleString()}</li>
              </ul>
              <div className="mt-3 text-sm text-text-primary font-semibold">Total Estimated Cost: ${financialImpact.aggregate.toLocaleString()}</div>
              <div className="text-xs">Projected at 30% compromise: ${financialImpact.projectedAt30Percent.estimatedTotalCost.toLocaleString()} — {financialImpact.projectedAt30Percent.hospitalSystemStrain}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-surface-border rounded-xl bg-white p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Temporal Progression</h3>
          <div className="text-sm text-text-secondary space-y-3">
            <div>Current window: {temporalBucket} (T+{simulation.elapsedMinutes} minutes)</div>
            <div>Patient impact: {temporalDetails.patientImpact}</div>
            <div>Health risk: {temporalDetails.healthRisk}</div>
            <div>System response: {temporalDetails.systemResponse}</div>
            {decisions.length > 0 && (
              <div className="border border-surface-border rounded-lg bg-surface-bg px-4 py-3 text-xs">
                <div className="font-semibold text-text-primary mb-1">Decision Snapshot</div>
                {decisions.map((decision) => (
                  <div key={`${decision.triggerId}-${decision.time}`} className="flex justify-between text-text-secondary">
                    <span>{decision.triggerId.replace('_', ' ')}</span>
                    <span className={decision.success ? 'text-green-600' : 'text-red-500'}>
                      {decision.selectedOption.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border border-surface-border rounded-xl bg-white p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Key Insights</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-secondary">
            {keyInsights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border border-surface-border rounded-xl bg-white p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Vector Effectiveness & Transcript Highlights</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h4 className="text-xs uppercase text-text-secondary mb-3">Vector Effectiveness</h4>
            {vectorRanking.length ? (
              <ul className="space-y-3 text-sm text-text-primary">
                {vectorRanking.map((vector, index) => (
                  <li key={vector.id} className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <span className="text-xs font-mono text-text-secondary">#{index + 1}</span>
                      {vector.name}
                    </span>
                    <span className="font-mono text-brand-primary">{vector.percent.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-secondary">No vector data available yet.</p>
            )}
          </div>
          <div>
            <h4 className="text-xs uppercase text-text-secondary mb-3">LLM Console Highlights</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs text-text-primary bg-surface-bg rounded-lg p-3">
              {transcriptPreview.length ? (
                transcriptPreview.map((entry, idx) => (
                  <div key={`${entry.timestamp}-${idx}`}>
                    <span className="text-brand-primary mr-2">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-amber-600 mr-2">[{entry.agent}]</span>
                    <span>{entry.content}</span>
                  </div>
                ))
              ) : (
                <div className="text-text-secondary">Complete an attack to review transcript highlights.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-surface-border rounded-xl bg-white p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Attack History</h3>
        {history.length ? (
          <div className="space-y-3 text-sm text-text-primary">
            {history.map((entry) => (
              <div key={entry.sessionId} className="border border-surface-border rounded-lg px-4 py-3 bg-surface-bg">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-secondary">{new Date(entry.timestamp).toLocaleString()}</span>
                  <span className="text-xs text-brand-primary">{(entry.results.compromiseRate * 100).toFixed(1)}%</span>
                </div>
                <div className="mt-1">Driver: {entry.targetDriver.name ?? 'Unknown'} • Vectors: {entry.vectorsDeployed.join(', ')}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-secondary">Complete an attack to populate history.</p>
        )}
      </div>
    </section>
  );
};

const SummaryCard = ({ label, value, subtitle }: { label: string; value: string; subtitle: string }) => (
  <div className="border border-surface-border rounded-xl bg-white p-5">
    <div className="text-xs text-text-secondary uppercase tracking-wide">{label}</div>
    <div className="text-2xl font-semibold text-brand-primary mt-2">{value}</div>
    <div className="text-[11px] text-text-secondary mt-1">{subtitle}</div>
  </div>
);

const MetricBar = ({
  label,
  value,
  baseline,
  suffix = '',
  capacityPercent,
}: {
  label: string;
  value: number;
  baseline: number;
  suffix?: string;
  capacityPercent?: number;
}) => {
  const percent = Math.min((value / (baseline * 2)) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>{label}</span>
        <span>
          {value}
          {suffix}
          {capacityPercent !== undefined && ` (${capacityPercent}% capacity)`}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-border">
        <div
          className={`h-full rounded-full ${percent > 80 ? 'bg-red-500' : percent > 60 ? 'bg-amber-500' : 'bg-brand-primary'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-[10px] text-text-secondary">Baseline: {baseline}{suffix}</div>
    </div>
  );
};



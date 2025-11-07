import { useMemo } from 'react';
import { useAttackContext } from '../../state/AttackProvider';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  ReferenceLine,
  YAxis
} from 'recharts';

const ProgressTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded bg-white px-3 py-2 text-xs text-text-primary border border-surface-border shadow">
      <div>Minute: {point.minute}</div>
      <div>Compromise: {point.compromise.toFixed(1)}%</div>
    </div>
  );
};

const AttackMetricsPanel = () => {
  const { simulation, attackVectors } = useAttackContext();

  const compromiseStatus = useMemo(() => {
    const pct = simulation.compromisePercentage;
    if (pct < 10) return { label: 'Undetected', color: 'bg-green-500' };
    if (pct < 25) return { label: 'Escalating', color: 'bg-yellow-400' };
    if (pct < 35) return { label: 'Target Range', color: 'bg-orange-400' };
    return { label: 'Detected', color: 'bg-red-500' };
  }, [simulation.compromisePercentage]);

  const timelineData = useMemo(() => simulation.timeline.map((point) => ({ ...point })), [simulation.timeline]);

  const vectorRanking = useMemo(() => {
    const entries = Object.entries(simulation.vectorEffectiveness || {});
    if (!entries.length) return [];
    const total = entries.reduce((acc, [, value]) => acc + value, 0) || 1;
    return entries
      .map(([id, value]) => {
        const vector = attackVectors.find((v) => v.id === id);
        return {
          id,
          name: vector?.name ?? id,
          value,
          percent: (value / total) * 100
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [simulation.vectorEffectiveness, attackVectors]);

  const [minRecovery, maxRecovery] = simulation.recoveryEstimateRange;
  const firstImpact = simulation.firstImpactMinute ?? '-';
  const detectionActual = simulation.detectionTime ? simulation.elapsedMinutes : null;

  return (
    <div className="border border-surface-border rounded-xl bg-white p-6 space-y-5">
      <h2 className="text-lg font-semibold text-text-primary">Live Attack Metrics</h2>

      <div>
        <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
          <span>Deliveries Compromised</span>
          <span>{simulation.compromisePercentage.toFixed(1)}% / {simulation.targetCompromisePercentage}%</span>
        </div>
        <div className="relative h-3 w-full rounded-full bg-surface-bg overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="h-full" style={{ width: '10%', backgroundColor: 'rgba(34,197,94,0.2)' }} />
            <div className="h-full" style={{ width: '15%', backgroundColor: 'rgba(234,179,8,0.2)' }} />
            <div className="h-full" style={{ width: '10%', backgroundColor: 'rgba(249,115,22,0.2)' }} />
            <div className="flex-1 h-full" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }} />
          </div>
          <div
            className={`relative h-full transition-all duration-500 ${compromiseStatus.color}`}
            style={{ width: `${Math.min(simulation.compromisePercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-text-secondary mt-1">Status: {compromiseStatus.label}</p>
        <div className="mt-2 grid grid-cols-4 gap-2 text-[10px] text-text-secondary">
          <span>0-10% Green</span>
          <span>10-25% Yellow</span>
          <span>25-35% Orange</span>
          <span>35%+ Red</span>
        </div>
      </div>

      <div className="grid gap-4 text-sm text-text-primary">
        <div className="flex items-center justify-between">
          <span>Detection Timeline</span>
          <span className="font-mono text-brand-primary">Expected T+{simulation.detectionExpectedAt}m</span>
        </div>
        <div className="flex items-center text-xs text-text-secondary">
          <div className="flex-1">
            First impact: <span className="text-brand-primary font-mono">T+{firstImpact}m</span> • Detection
            {simulation.detectionTime ? (
              <span className="text-red-600 font-mono"> T+{detectionActual}m</span>
            ) : (
              <span className="text-amber-600 font-mono"> pending</span>
            )}
          </div>
          <span className="font-mono text-brand-primary">Delay: {simulation.detectionDelay || 0}m</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Active Vectors</span>
          <span className="font-mono text-green-300">{simulation.activeVectors.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Compromised Deliveries</span>
          <span className="font-mono text-green-300">{simulation.compromisedDeliveries} / {simulation.totalDeliveries}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Cascade Radius</span>
          <span className="font-mono text-green-300">{simulation.cascadeRadius.toFixed(1)} km</span>
        </div>
      </div>

      <div className="border border-surface-border rounded-lg p-4 bg-surface-bg">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="compromiseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="minute" stroke="#475569" tick={{ fontSize: 10 }} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<ProgressTooltip />} />
            <ReferenceLine x={simulation.detectionExpectedAt} stroke="#facc15" strokeDasharray="4 4" />
            {simulation.detectionTime && (
              <ReferenceLine x={simulation.elapsedMinutes} stroke="#ef4444" strokeDasharray="2 6" />
            )}
            <Area type="monotone" dataKey="compromise" stroke="#22c55e" fill="url(#compromiseGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-2 flex justify-between text-[10px] text-text-secondary">
          <span>T+0</span>
          <span>Detection Expected</span>
          <span>{simulation.detectionTime ? 'Detection Actual' : 'In Progress'}</span>
        </div>
      </div>

      <div className="border border-surface-border rounded-lg p-4 bg-surface-bg space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Vector Effectiveness</h3>
        {vectorRanking.length ? (
          <ul className="space-y-2 text-sm text-text-primary">
            {vectorRanking.map((vector, index) => (
              <li key={vector.id} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-gray-500">#{index + 1}</span>
                  {vector.name}
                </span>
                <span className="font-mono text-brand-primary">
                  {vector.percent.toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-text-secondary">Activate vectors to populate effectiveness ranking.</p>
        )}
      </div>

      <div className="border border-surface-border rounded-lg p-4 bg-surface-bg text-xs text-text-primary leading-5">
        Recovery estimate: <span className="text-brand-primary font-mono">{minRecovery}-{maxRecovery} minutes</span> based on current
        compromise ({simulation.compromisePercentage.toFixed(1)}%), detection delay {simulation.detectionDelay || 0}m, and active vector stack
        ({simulation.activeVectors.length}).
      </div>
    </div>
  );
};

export default AttackMetricsPanel;



import { useMemo } from 'react';
import { useAttackContext } from '../../state/AttackProvider';

const agentColorMap: Record<string, string> = {
  SYSTEM: 'text-amber-600',
  METRICS: 'text-brand-primary',
  COORDINATOR: 'text-amber-600',
  'HUMAN OVERSIGHT': 'text-green-600',
};

const LLMConsole = () => {
  const { transcript, finalOutcome } = useAttackContext();

  const entries = useMemo(() => {
    if (!finalOutcome) return transcript;
    const outcomeLogged = transcript.some((item) => item.content.includes('Final grade'));
    if (outcomeLogged) return transcript;
    return [
      ...transcript,
      {
        timestamp: finalOutcome.timestamp,
        agent: 'METRICS',
        content: `Final grade ${finalOutcome.grade.grade} (${finalOutcome.grade.label}) — ${finalOutcome.summary}`,
      },
    ];
  }, [transcript, finalOutcome]);

  return (
    <div className="h-72 overflow-y-auto bg-white border border-surface-border rounded-lg p-4 font-mono text-sm space-y-3">
      {entries.map((entry, idx) => (
        <div key={`${entry.timestamp}-${idx}`} className="flex flex-col gap-1 text-text-primary">
          <div className="text-xs text-text-secondary">
            <span className="text-brand-primary font-semibold mr-2">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
            <span className={`font-semibold ${agentColorMap[entry.agent] || 'text-amber-600'}`}>[{entry.agent}]</span>
          </div>
          <p className="leading-6">{entry.content}</p>
        </div>
      ))}
      {!entries.length && <div className="text-text-secondary">Awaiting LLM activity...</div>}
    </div>
  );
};

export default LLMConsole;



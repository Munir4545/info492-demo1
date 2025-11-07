import { useEffect, useMemo, useState } from 'react';
import { useAttackContext } from '../../state/AttackProvider';
import { interventionTriggers, InterventionOption } from '../../data/syntheticAttackData';

const DecisionBadge = ({ successProbability }: { successProbability: number }) => {
  if (successProbability >= 0.75) return <span className="text-green-500">High</span>;
  if (successProbability >= 0.5) return <span className="text-amber-500">Medium</span>;
  return <span className="text-red-500">Low</span>;
};

const formatPercent = (value: number) => `${(value * 100).toFixed(0)}%`;

const InterventionQueue = () => {
  const { simulation, decisions, recordDecision, finalOutcome } = useAttackContext();

  const [activeTriggerIndex, setActiveTriggerIndex] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [pendingOption, setPendingOption] = useState<{ triggerId: string; option: InterventionOption } | null>(null);
  const [decisionHistory, setDecisionHistory] = useState(decisions);

  const activeTrigger = useMemo(
    () => (activeTriggerIndex !== null ? interventionTriggers[activeTriggerIndex] : null),
    [activeTriggerIndex]
  );

  useEffect(() => {
    if (finalOutcome) {
      setActiveTriggerIndex(null);
      setTimeRemaining(0);
    }
  }, [finalOutcome]);

  useEffect(() => {
    const checkTrigger = () => {
      if (finalOutcome) return;
      const elapsed = simulation.elapsedMinutes;
      const nextTriggerIndex = interventionTriggers.findIndex((trigger, index) => {
        if (decisions.some((d) => d.triggerId === trigger.id)) return false;
        if (activeTriggerIndex !== null && index === activeTriggerIndex) return false;
        return elapsed >= trigger.triggerTime;
      });

      if (nextTriggerIndex !== -1) {
        setActiveTriggerIndex(nextTriggerIndex);
        setTimeRemaining(interventionTriggers[nextTriggerIndex].scenario.timeToDecide);
      }
    };

    const interval = setInterval(checkTrigger, 1000);
    return () => clearInterval(interval);
  }, [simulation.elapsedMinutes, decisions, activeTriggerIndex, finalOutcome]);

  useEffect(() => {
    if (activeTriggerIndex === null) return undefined;
    if (!activeTrigger) return undefined;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          const defaultOption = activeTrigger.options[0];
          handleDecision(activeTrigger, defaultOption);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTriggerIndex, activeTrigger]);

  useEffect(() => {
    setDecisionHistory(decisions);
  }, [decisions]);

  const handleDecision = (trigger: typeof interventionTriggers[number], option: InterventionOption) => {
    const roll = Math.random();
    const success = roll <= option.consequences.successProbability;
    recordDecision({
      triggerId: trigger.id,
      time: simulation.elapsedMinutes,
      selectedOption: option,
      success,
      roll,
    });

    setActiveTriggerIndex(null);
    setTimeRemaining(0);
    setPendingOption({ triggerId: trigger.id, option });

    setTimeout(() => setPendingOption(null), 4000);
  };

  const renderDecisionHistory = () => (
    <div className="space-y-3 mt-4">
      {decisionHistory.map((decision) => (
        <div
          key={`${decision.triggerId}-${decision.time}`}
          className={`border rounded-lg p-3 ${decision.success ? 'border-green-300 bg-green-100/40' : 'border-red-300 bg-red-100/40'}`}
        >
          <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
            <span>{decision.triggerId.replace('_', ' ').toUpperCase()}</span>
            <span>T+{decision.time}m</span>
          </div>
          <div className="text-sm text-text-primary font-semibold">{decision.selectedOption.label}</div>
          <div className="text-xs text-text-secondary mt-1">
            Result:{' '}
            {decision.success ? decision.selectedOption.outcome.success : decision.selectedOption.outcome.failure || 'Failed roll'}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {pendingOption && (
        <div className="border border-brand-primary/40 rounded-xl bg-brand-primaryLight/50 p-3 text-xs text-text-primary">
          Decision acknowledged: {pendingOption.triggerId.toUpperCase()} • {pendingOption.option.label}
        </div>
      )}

      {activeTrigger && !finalOutcome ? (
        <div className="border border-amber-300 rounded-xl bg-amber-50 p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-amber-600 uppercase tracking-wide">Decision Required</div>
              <h4 className="text-sm font-semibold text-text-primary mt-1">{activeTrigger.scenario.title}</h4>
              <p className="text-xs text-text-secondary mt-1 leading-5">{activeTrigger.scenario.description}</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-text-secondary uppercase">Time Remaining</div>
              <div className="text-xl font-mono text-amber-600">{timeRemaining}s</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-[11px] text-text-secondary">
            <div>
              <div className="text-text-secondary/70 uppercase tracking-wide">Compromise</div>
              <div className="text-base font-semibold text-brand-primary">{simulation.compromisePercentage.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-text-secondary/70 uppercase tracking-wide">Detection Risk</div>
              <div className="text-base font-semibold text-amber-500">{formatPercent(simulation.detectionRisk)}</div>
            </div>
            <div>
              <div className="text-text-secondary/70 uppercase tracking-wide">Active Vectors</div>
              <div className="text-base font-semibold text-text-primary">{simulation.activeVectors.length}</div>
            </div>
          </div>

          <div className="space-y-3">
            {activeTrigger.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleDecision(activeTrigger, option)}
                className="w-full border border-surface-border hover:border-brand-primary transition rounded-xl p-4 text-left bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-text-primary">{option.label}</div>
                  <div className="text-xs text-text-secondary flex items-center gap-2">
                    <span>Success:</span>
                    <DecisionBadge successProbability={option.consequences.successProbability} />
                    <span>{formatPercent(option.consequences.successProbability)}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mt-2 leading-5">{option.description}</p>
                <div className="flex flex-wrap gap-4 text-[11px] mt-3 text-text-secondary">
                  <span className={option.consequences.compromiseChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                    Compromise {option.consequences.compromiseChange >= 0 ? '+' : ''}
                    {formatPercent(option.consequences.compromiseChange)}
                  </span>
                  <span className={option.consequences.detectionRiskChange >= 0 ? 'text-red-500' : 'text-green-500'}>
                    Risk {option.consequences.detectionRiskChange >= 0 ? '+' : ''}
                    {formatPercent(option.consequences.detectionRiskChange)}
                  </span>
                  {option.consequences.cascadeBonus !== 0 && (
                    <span className="text-amber-500">
                      Cascade {option.consequences.cascadeBonus >= 0 ? '+' : ''}
                      {option.consequences.cascadeBonus}×
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-text-secondary">
          {finalOutcome
            ? 'Attack complete. Review the decision history below or open Analyze mode for the final grade.'
            : 'Awaiting next human intervention window. Decisions unlock automatically as the attack progresses.'}
        </div>
      )}

      <div>
        <div className="text-xs uppercase text-text-secondary tracking-wide mb-2">Decision History</div>
        {decisionHistory.length ? renderDecisionHistory() : <div className="text-sm text-text-secondary">No decisions taken yet.</div>}
      </div>
    </div>
  );
};

export default InterventionQueue;



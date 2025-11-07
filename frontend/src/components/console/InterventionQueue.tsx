import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
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
  
  // Use refs to track processed triggers and prevent duplicate activations
  const processedTriggersRef = useRef<Set<string>>(new Set());
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingDecisionRef = useRef<boolean>(false);

  const activeTrigger = useMemo(
    () => (activeTriggerIndex !== null ? interventionTriggers[activeTriggerIndex] : null),
    [activeTriggerIndex]
  );

  // Memoize handleDecision to fix closure issues
  const handleDecision = useCallback((trigger: typeof interventionTriggers[number], option: InterventionOption) => {
    // Prevent double-clicks or rapid decision making
    if (isProcessingDecisionRef.current) {
      return;
    }
    
    isProcessingDecisionRef.current = true;
    
    const roll = Math.random();
    const success = roll <= option.consequences.successProbability;
    
    // Mark this trigger as processed
    processedTriggersRef.current.add(trigger.id);
    
    recordDecision({
      triggerId: trigger.id,
      time: simulation.elapsedMinutes,
      selectedOption: option,
      success,
      roll,
    });

    // Clear the active trigger immediately
    setActiveTriggerIndex(null);
    setTimeRemaining(0);
    setPendingOption({ triggerId: trigger.id, option });

    // Clear countdown timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    // Reset processing flag after a short delay
    setTimeout(() => {
      setPendingOption(null);
      isProcessingDecisionRef.current = false;
    }, 4000);
  }, [simulation.elapsedMinutes, recordDecision]);

  // Reset when attack completes or starts
  useEffect(() => {
    if (finalOutcome || simulation.phase === 'completed') {
      setActiveTriggerIndex(null);
      setTimeRemaining(0);
      processedTriggersRef.current.clear();
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    }
    
    // Reset processed triggers when a new attack starts
    if (simulation.phase === 'planning' && processedTriggersRef.current.size > 0) {
      processedTriggersRef.current.clear();
    }
  }, [finalOutcome, simulation.phase]);

  // Check for new intervention triggers
  useEffect(() => {
    // Only check if simulation is running and not paused
    if (simulation.phase !== 'executing' && simulation.phase !== 'detected') {
      return;
    }
    if (simulation.paused) {
      // Pause countdown if there's an active trigger
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      return;
    }
    if (finalOutcome) {
      return;
    }
    // Don't check for new triggers if one is already active
    if (activeTriggerIndex !== null || isProcessingDecisionRef.current) {
      return;
    }

    const checkTrigger = () => {
      const elapsed = simulation.elapsedMinutes;
      
      // Find the next trigger that should be shown
      const nextTriggerIndex = interventionTriggers.findIndex((trigger) => {
        // Skip if already decided or processed
        if (decisions.some((d) => d.triggerId === trigger.id)) {
          return false;
        }
        if (processedTriggersRef.current.has(trigger.id)) {
          return false;
        }
        // Trigger when elapsed time reaches or exceeds trigger time
        // Use a small buffer (0.2) to account for timing precision
        return elapsed >= trigger.triggerTime - 0.2 && elapsed < trigger.triggerTime + 2;
      });

      if (nextTriggerIndex !== -1) {
        const trigger = interventionTriggers[nextTriggerIndex];
        // Mark as processed immediately to prevent duplicates
        processedTriggersRef.current.add(trigger.id);
        setActiveTriggerIndex(nextTriggerIndex);
        setTimeRemaining(trigger.scenario.timeToDecide);
      }
    };

    // Check immediately
    checkTrigger();
    
    // Then check every 500ms for more responsive triggering
    const interval = setInterval(checkTrigger, 500);
    return () => clearInterval(interval);
  }, [simulation.elapsedMinutes, simulation.phase, simulation.paused, decisions, activeTriggerIndex, finalOutcome]);

  // Countdown timer for active decision
  useEffect(() => {
    // Clear any existing timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    if (activeTriggerIndex === null || !activeTrigger) {
      return;
    }
    if (simulation.paused) {
      return;
    }
    if (timeRemaining <= 0) {
      return;
    }

    // Start countdown timer
    countdownTimerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-select first option if time runs out
          const defaultOption = activeTrigger.options[0];
          handleDecision(activeTrigger, defaultOption);
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    };
  }, [activeTriggerIndex, activeTrigger, timeRemaining, simulation.paused, handleDecision]);

  // Update decision history when decisions change
  useEffect(() => {
    setDecisionHistory(decisions);
  }, [decisions]);

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
        <div className="border border-brand-primary/40 rounded-xl bg-brand-primaryLight/50 p-3 text-xs text-text-primary animate-pulse">
          ✅ Decision acknowledged: {pendingOption.triggerId.toUpperCase()} • {pendingOption.option.label}
        </div>
      )}

      {activeTrigger && !finalOutcome && !simulation.paused && (simulation.phase === 'executing' || simulation.phase === 'detected') ? (
        <div className="border-2 border-amber-400 rounded-xl bg-amber-50 p-4 space-y-4 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-amber-700 uppercase tracking-wide font-bold">⚠️ DECISION REQUIRED</div>
              <h4 className="text-base font-bold text-text-primary mt-1">{activeTrigger.scenario.title}</h4>
              <p className="text-xs text-text-secondary mt-2 leading-5">{activeTrigger.scenario.description}</p>
              {activeTrigger.scenario.driverMessage && (
                <p className="text-xs text-amber-800 mt-2 italic bg-amber-100 p-2 rounded">
                  "{activeTrigger.scenario.driverMessage}"
                </p>
              )}
              {activeTrigger.scenario.systemMessage && (
                <p className="text-xs text-amber-800 mt-2 font-mono bg-amber-100 p-2 rounded">
                  "{activeTrigger.scenario.systemMessage}"
                </p>
              )}
            </div>
            <div className="text-right min-w-[100px]">
              <div className="text-[10px] text-text-secondary uppercase font-semibold">Time Remaining</div>
              <div className={`text-3xl font-mono font-bold ${timeRemaining <= 10 ? 'text-red-600 animate-pulse' : 'text-amber-600'}`}>
                {timeRemaining}s
              </div>
              {timeRemaining <= 10 && (
                <div className="text-[10px] text-red-600 mt-1 font-semibold">Auto-selecting soon...</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-[11px] text-text-secondary bg-white/70 rounded-lg p-3 border border-amber-200">
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
            <div className="text-xs text-text-secondary uppercase tracking-wide font-semibold">Your Options:</div>
            {activeTrigger.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleDecision(activeTrigger, option)}
                className="w-full border-2 border-surface-border hover:border-brand-primary transition-all rounded-xl p-4 text-left bg-white hover:bg-brand-primaryLight/20 shadow-sm hover:shadow-md active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-text-primary">{option.label}</div>
                  <div className="text-xs text-text-secondary flex items-center gap-2">
                    <span>Success:</span>
                    <DecisionBadge successProbability={option.consequences.successProbability} />
                    <span className="font-semibold">{formatPercent(option.consequences.successProbability)}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mt-2 leading-5">{option.description}</p>
                <div className="flex flex-wrap gap-4 text-[11px] mt-3 text-text-secondary">
                  <span className={option.consequences.compromiseChange >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    Compromise {option.consequences.compromiseChange >= 0 ? '+' : ''}
                    {formatPercent(option.consequences.compromiseChange)}
                  </span>
                  <span className={option.consequences.detectionRiskChange >= 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                    Risk {option.consequences.detectionRiskChange >= 0 ? '+' : ''}
                    {formatPercent(option.consequences.detectionRiskChange)}
                  </span>
                  {option.consequences.cascadeBonus !== 0 && (
                    <span className="text-amber-600 font-semibold">
                      Cascade {option.consequences.cascadeBonus >= 0 ? '+' : ''}
                      {option.consequences.cascadeBonus}×
                    </span>
                  )}
                  {option.consequences.enableVector && (
                    <span className="text-blue-600 font-semibold">
                      + Enable {option.consequences.enableVector}
                    </span>
                  )}
                  {option.consequences.disableVector && (
                    <span className="text-red-600 font-semibold">
                      - Disable {option.consequences.disableVector}
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
            : simulation.phase === 'planning' || simulation.phase === 'completed'
            ? 'Start an attack to see intervention decisions. Decisions will appear automatically as the attack progresses.'
            : simulation.paused && activeTriggerIndex !== null
            ? 'Attack is paused. Resume to continue the countdown timer.'
            : simulation.paused
            ? 'Attack is paused. Resume to continue receiving intervention decisions.'
            : 'Awaiting next human intervention window. Decisions will appear automatically as the attack progresses.'}
        </div>
      )}

      <div>
        <div className="text-xs uppercase text-text-secondary tracking-wide mb-2">Decision History ({decisionHistory.length})</div>
        {decisionHistory.length ? renderDecisionHistory() : <div className="text-sm text-text-secondary">No decisions taken yet.</div>}
      </div>
    </div>
  );
};

export default InterventionQueue;



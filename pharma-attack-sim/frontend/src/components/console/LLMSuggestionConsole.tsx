import { useEffect, useState } from 'react';
import { useAttackContext } from '../../state/AttackProvider';
import { interventionTriggers, InterventionOption } from '../../data/syntheticAttackData';

interface LLMSuggestion {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  recommendedOption?: {
    triggerId: string;
    optionIndex: number;
    option: InterventionOption;
  };
  timestamp: string;
}

const LLMSuggestionConsole = () => {
  const { simulation, decisions, attackVectors, finalOutcome } = useAttackContext();
  const [suggestions, setSuggestions] = useState<LLMSuggestion[]>([]);

  // Generate LLM suggestions based on current attack state
  useEffect(() => {
    if (finalOutcome || simulation.phase === 'planning' || simulation.phase === 'completed') {
      setSuggestions([]);
      return;
    }

    const generateSuggestions = (): LLMSuggestion[] => {
      const newSuggestions: LLMSuggestion[] = [];
      const elapsed = simulation.elapsedMinutes;
      const compromise = simulation.compromisePercentage;
      const detectionRisk = simulation.detectionRisk;
      const activeVectorsCount = simulation.activeVectors.length;

      // Find upcoming intervention triggers
      const upcomingTriggers = interventionTriggers.filter(
        (trigger) => !decisions.some((d) => d.triggerId === trigger.id) && elapsed < trigger.triggerTime + 2
      );

      // Suggestion 1: Upcoming decision warnings
      upcomingTriggers.forEach((trigger) => {
        const timeUntilTrigger = trigger.triggerTime - elapsed;
        if (timeUntilTrigger > 0 && timeUntilTrigger <= 3) {
          // Analyze which option is best based on current state
          let recommendedOptionIndex = 0;
          let bestScore = -Infinity;

          trigger.options.forEach((option, index) => {
            // Score based on compromise target, detection risk, and success probability
            const compromiseScore = option.consequences.compromiseChange * 100;
            const riskPenalty = option.consequences.detectionRiskChange * -50;
            const successBonus = option.consequences.successProbability * 30;
            const cascadeBonus = option.consequences.cascadeBonus * 10;
            
            // Prefer options that maintain progress but don't increase risk too much
            let score = compromiseScore + riskPenalty + successBonus + cascadeBonus;
            
            // If we're below target, prioritize compromise increase
            if (compromise < simulation.targetCompromisePercentage) {
              score += option.consequences.compromiseChange > 0 ? 20 : -20;
            } else {
              // If we're above target, prioritize risk reduction
              if (option.consequences.detectionRiskChange < 0) {
                score += 15;
              }
            }
            
            if (score > bestScore) {
              bestScore = score;
              recommendedOptionIndex = index;
            }
          });

          const recommendedOption = trigger.options[recommendedOptionIndex];

          newSuggestions.push({
            id: `suggestion-${trigger.id}`,
            priority: timeUntilTrigger <= 1 ? 'critical' : 'high',
            title: `⚠️ Decision Approaching: ${trigger.scenario.title}`,
            description: `A critical decision point is approaching in ${Math.ceil(timeUntilTrigger)} minute(s). ${trigger.scenario.description}`,
            reasoning: `Based on current state (${compromise.toFixed(1)}% compromise, ${(detectionRisk * 100).toFixed(0)}% detection risk), the recommended action is "${recommendedOption.label}" because it ${
              recommendedOption.consequences.compromiseChange > 0
                ? 'increases compromise while maintaining acceptable risk levels'
                : recommendedOption.consequences.detectionRiskChange < 0
                ? 'reduces detection risk and protects current gains'
                : 'provides the best balance of success probability and outcome'
            }.`,
            confidence: recommendedOption.consequences.successProbability,
            recommendedOption: {
              triggerId: trigger.id,
              optionIndex: recommendedOptionIndex,
              option: recommendedOption,
            },
            timestamp: new Date().toISOString(),
          });
        }
      });

      // Suggestion 2: Detection risk warnings
      if (detectionRisk > 0.7 && compromise < simulation.targetCompromisePercentage) {
        newSuggestions.push({
          id: 'suggestion-detection-risk',
          priority: 'high',
          title: '🚨 High Detection Risk Detected',
          description: `Detection risk is at ${(detectionRisk * 100).toFixed(0)}% while compromise is only ${compromise.toFixed(1)}%. Consider reducing attack visibility.`,
          reasoning: 'High detection risk with low compromise suggests the attack is too aggressive or visible. Consider pausing aggressive vectors or choosing lower-risk options in upcoming decisions.',
          confidence: 0.85,
          timestamp: new Date().toISOString(),
        });
      }

      // Suggestion 3: Compromise progress
      if (compromise < simulation.targetCompromisePercentage * 0.5 && elapsed > 8) {
        newSuggestions.push({
          id: 'suggestion-progress',
          priority: 'medium',
          title: '📊 Below Target Progress',
          description: `Current compromise (${compromise.toFixed(1)}%) is below 50% of target (${simulation.targetCompromisePercentage}%). Consider more aggressive tactics.`,
          reasoning: 'Attack is progressing slower than expected. Upcoming decisions should prioritize options that increase compromise, even if they slightly increase detection risk.',
          confidence: 0.75,
          timestamp: new Date().toISOString(),
        });
      }

      // Suggestion 4: Vector effectiveness
      if (activeVectorsCount === 0 && elapsed > 2) {
        newSuggestions.push({
          id: 'suggestion-no-vectors',
          priority: 'critical',
          title: '⚠️ No Active Attack Vectors',
          description: 'All attack vectors have been disabled. Attack progress will stall.',
          reasoning: 'Without active vectors, compromise cannot increase. Consider enabling vectors in future decisions or restarting the attack.',
          confidence: 1.0,
          timestamp: new Date().toISOString(),
        });
      }

      // Suggestion 5: Success trajectory
      if (compromise >= simulation.targetCompromisePercentage * 0.8 && detectionRisk < 0.5) {
        newSuggestions.push({
          id: 'suggestion-success',
          priority: 'low',
          title: '✅ Attack on Track for Success',
          description: `Excellent progress! Compromise at ${compromise.toFixed(1)}% with low detection risk (${(detectionRisk * 100).toFixed(0)}%). Maintain current strategy.`,
          reasoning: 'Attack is performing well above expectations. Continue with conservative options to avoid detection while maintaining progress.',
          confidence: 0.9,
          timestamp: new Date().toISOString(),
        });
      }

      return newSuggestions.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    };

    const interval = setInterval(() => {
      const newSuggestions = generateSuggestions();
      setSuggestions(newSuggestions);
    }, 2000); // Update every 2 seconds

    // Generate initial suggestions
    const initialSuggestions = generateSuggestions();
    setSuggestions(initialSuggestions);

    return () => clearInterval(interval);
  }, [simulation, decisions, attackVectors, finalOutcome]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-red-400 bg-red-50 text-red-900';
      case 'high':
        return 'border-amber-400 bg-amber-50 text-amber-900';
      case 'medium':
        return 'border-blue-400 bg-blue-50 text-blue-900';
      case 'low':
        return 'border-green-400 bg-green-50 text-green-900';
      default:
        return 'border-gray-400 bg-gray-50 text-gray-900';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '📊';
      case 'low':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  if (simulation.phase === 'planning' || simulation.phase === 'completed') {
    return (
      <div className="h-96 overflow-y-auto bg-white border border-surface-border rounded-lg p-4">
        <div className="text-text-secondary text-sm">Start an attack to receive LLM-powered suggestions and recommendations.</div>
      </div>
    );
  }

  return (
    <div className="h-96 overflow-y-auto bg-white border border-surface-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b z-10">
        <h3 className="text-sm font-semibold text-text-primary">AI Recommendations</h3>
        <span className="text-xs text-text-secondary">{suggestions.length} active</span>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-text-secondary text-sm text-center py-8">
          Analyzing attack state... Recommendations will appear here as the attack progresses.
        </div>
      ) : (
        suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`border-2 rounded-lg p-3 space-y-2 ${getPriorityColor(suggestion.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">{getPriorityIcon(suggestion.priority)}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{suggestion.title}</div>
                  <div className="text-xs opacity-75 mt-1">{suggestion.description}</div>
                </div>
              </div>
              <div className="text-xs font-mono bg-white/50 px-2 py-1 rounded ml-2">
                {(suggestion.confidence * 100).toFixed(0)}%
              </div>
            </div>

            <div className="text-xs bg-white/50 rounded p-2 mt-2">
              <div className="font-semibold mb-1">🤖 AI Reasoning:</div>
              <div className="opacity-90">{suggestion.reasoning}</div>
            </div>

            {suggestion.recommendedOption && (
              <div className="mt-2 pt-2 border-t border-current/20">
                <div className="text-xs font-semibold mb-1">💡 Recommended Action:</div>
                <div className="bg-white/70 rounded p-2">
                  <div className="font-semibold">{suggestion.recommendedOption.option.label}</div>
                  <div className="text-xs mt-1 opacity-75">{suggestion.recommendedOption.option.description}</div>
                  <div className="flex gap-3 text-xs mt-2 flex-wrap">
                    <span>
                      Success: <span className="font-semibold">{(suggestion.recommendedOption.option.consequences.successProbability * 100).toFixed(0)}%</span>
                    </span>
                    {suggestion.recommendedOption.option.consequences.compromiseChange !== 0 && (
                      <span>
                        Compromise:{' '}
                        <span className="font-semibold">
                          {suggestion.recommendedOption.option.consequences.compromiseChange > 0 ? '+' : ''}
                          {(suggestion.recommendedOption.option.consequences.compromiseChange * 100).toFixed(0)}%
                        </span>
                      </span>
                    )}
                    {suggestion.recommendedOption.option.consequences.detectionRiskChange !== 0 && (
                      <span>
                        Risk:{' '}
                        <span className="font-semibold">
                          {suggestion.recommendedOption.option.consequences.detectionRiskChange > 0 ? '+' : ''}
                          {(suggestion.recommendedOption.option.consequences.detectionRiskChange * 100).toFixed(0)}%
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="text-[10px] opacity-60 mt-1">
              {new Date(suggestion.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LLMSuggestionConsole;


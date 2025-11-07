import { useEffect, useRef } from 'react';
import { StepUpdate } from '../hooks/useAttackUpdates';

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  agentType: string;
}

const steps: TimelineStep[] = [
  {
    id: 1,
    title: 'Orchestration',
    description: 'Analyzing target and planning attack sequence',
    agentType: 'orchestrator'
  },
  {
    id: 2,
    title: 'Phishing Attack',
    description: 'Testing message and deploying malware',
    agentType: 'phishing'
  },
  {
    id: 3,
    title: 'GPS Spoofing',
    description: 'Injecting fake coordinates',
    agentType: 'gps'
  },
  {
    id: 4,
    title: 'API Flooding',
    description: 'Overwhelming dispatcher dashboard',
    agentType: 'api_flooding'
  }
];

interface AttackTimelineProps {
  stepUpdates: StepUpdate[];
}

const AttackTimeline = ({ stepUpdates }: AttackTimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const getStepStatus = (stepId: number): 'pending' | 'running' | 'completed' | 'failed' => {
    const update = stepUpdates.find(s => s.stepId === stepId);
    return (update?.status as any) || 'pending';
  };

  useEffect(() => {
    // Auto-scroll to active step
    const activeIndex = steps.findIndex((step, idx) => {
      const status = getStepStatus(step.id);
      return status === 'running' || status === 'completed';
    });

    if (activeIndex >= 0 && timelineRef.current) {
      const stepElement = timelineRef.current.children[activeIndex];
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [stepUpdates]);

  return (
    <div ref={timelineRef} className="space-y-4">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const isActive = status === 'running';
        const isCompleted = status === 'completed';
        const isFailed = status === 'failed';

        return (
          <div key={step.id} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-4 top-12 w-0.5 h-full ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            )}

            {/* Step content */}
            <div className="flex items-start space-x-4">
              {/* Status indicator */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? 'bg-green-500 border-green-500'
                    : isFailed
                    ? 'bg-red-500 border-red-500'
                    : isActive
                    ? 'bg-blue-500 border-blue-500 animate-pulse'
                    : 'bg-gray-700 border-gray-600'
                }`}
              >
                {isCompleted && '✓'}
                {isFailed && '✗'}
                {isActive && '●'}
                {!isActive && !isCompleted && !isFailed && index + 1}
              </div>

              {/* Step details */}
              <div className="flex-1">
                <h4
                  className={`font-mono font-bold ${
                    isActive
                      ? 'text-blue-400'
                      : isCompleted
                      ? 'text-green-400'
                      : isFailed
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                {isActive && (
                  <div className="mt-2 text-xs text-blue-400 font-mono animate-pulse">
                    IN PROGRESS...
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttackTimeline;


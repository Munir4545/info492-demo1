import { createContext, useContext, useEffect, useMemo, useReducer, useRef, ReactNode } from 'react';
import {
  AttackControlState,
  AttackSimulationState,
  Delivery,
  AttackVector,
  DriverProfile,
  LLMSuggestionMessage,
  HumanIntervention,
  AttackHistory,
  DeliveryStatus,
} from '../types/simulation';
import {
  syntheticDeliveries,
  attackVectors as baseVectors,
  driverProfiles as baseProfiles,
  dispatcherProfiles as baseDispatcherProfiles,
  initialAttackState,
  initialTranscript,
} from '../data/synthetic';
import { attackScenarios, calculateAttackOutcome, DecisionRecord } from '../data/syntheticAttackData';

const TICK_INTERVAL_MS = 1000;
const TIME_STEP_MINUTES = 1;
const COMPLETION_BUFFER_MINUTES = 5;
const IMPACT_THRESHOLD_PERCENT = 5;

const BASE_TRAJECTORY = [
  { minute: 0, compromise: 0.08, detectionRisk: 0.15 },
  { minute: 5, compromise: 0.15, detectionRisk: 0.3 },
  { minute: 10, compromise: 0.22, detectionRisk: 0.5 },
  { minute: 15, compromise: 0.28, detectionRisk: 0.7 },
  { minute: 20, compromise: 0.35, detectionRisk: 0.9 },
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const getTrajectoryPoint = (minute: number) => {
  if (minute <= BASE_TRAJECTORY[0].minute) {
    return BASE_TRAJECTORY[0];
  }

  for (let i = 0; i < BASE_TRAJECTORY.length - 1; i += 1) {
    const current = BASE_TRAJECTORY[i];
    const next = BASE_TRAJECTORY[i + 1];
    if (minute <= next.minute) {
      const ratio = (minute - current.minute) / (next.minute - current.minute || 1);
      return {
        compromise: current.compromise + ratio * (next.compromise - current.compromise),
        detectionRisk: current.detectionRisk + ratio * (next.detectionRisk - current.detectionRisk),
      };
    }
  }

  return BASE_TRAJECTORY[BASE_TRAJECTORY.length - 1];
};

type AttackOutcome = ReturnType<typeof calculateAttackOutcome>;

const buildTranscript = (
  profile: DriverProfile | undefined,
  vectors: AttackVector[],
  intensity: 'low' | 'medium' | 'high',
  timestamp: string
): LLMSuggestionMessage[] => {
  if (!profile) {
    return initialTranscript;
  }

  const baseTime = new Date(timestamp).getTime();
  const at = (offsetSeconds: number) => new Date(baseTime + offsetSeconds * 1000).toISOString();

  if (profile.role === 'DISPATCHER') {
    const scenario = attackScenarios.targetDispatcher;
    const messages: LLMSuggestionMessage[] = [
      {
        timestamp: at(0),
        agent: 'RECON',
        content: `Analyzing dispatcher ${profile.name} (${scenario.id}) managing ${scenario.driversManaged ?? 0} drivers and ${scenario.deliveriesManaged} deliveries.`,
      },
      {
        timestamp: at(2),
        agent: 'RECON',
        content: `Vulnerability: ${profile.vulnerabilityScore}/100 • Alert fatigue: ${profile.characteristics.alertDismissalRate?.toUpperCase()} • Peak window ${profile.characteristics.peakVulnerabilityWindow}.`,
      },
      {
        timestamp: at(4),
        agent: 'DECISION',
        content: 'High-value dispatcher target identified – shifting to system-level attack plan.',
      },
      {
        timestamp: at(6),
        agent: 'COORDINATOR',
        content: `Preparing dispatcher-focused attack stack (${intensity.toUpperCase()} intensity).`,
      },
    ];

    vectors.forEach((vector, idx) => {
      messages.push({
        timestamp: at(8 + idx * 2),
        agent: vector.name.toUpperCase(),
        content: `Vector armed: ${vector.description}`,
      });
    });

    messages.push({
      timestamp: at(12 + vectors.length * 2),
      agent: 'METRICS',
      content: `Projected compromise: ${(scenario.expectedCompromise * 100).toFixed(0)}% • Cascade multiplier ${scenario.cascadeMultiplier}× across ${scenario.deliveriesManaged} deliveries.`,
    });

    return messages;
  }

  const driverScenario = profile.id === attackScenarios.targetDriver.id ? attackScenarios.targetDriver : null;
  const driverDeliveries = profile.activeDeliveries.length || 1;

  const messages: LLMSuggestionMessage[] = [
    {
      timestamp: at(0),
      agent: 'RECON',
      content: `Analyzing driver ${profile.name} (${profile.persona}) handling ${driverDeliveries} deliveries.`,
    },
    {
      timestamp: at(2),
      agent: 'RECON',
      content: `Vulnerability: ${profile.vulnerabilityScore}/100 • Peak window ${profile.characteristics.peakVulnerabilityWindow} • Alert fatigue: ${profile.characteristics.alertDismissalRate?.toUpperCase()}.`,
    },
    {
      timestamp: at(4),
      agent: 'DECISION',
      content: `Targeting driver ${profile.name} with ${intensity.toUpperCase()} intensity campaign.`,
    },
  ];

  vectors.forEach((vector, idx) => {
    messages.push({
      timestamp: at(6 + idx * 2),
      agent: vector.name.toUpperCase(),
      content: `Vector staged: ${vector.description}`,
    });
  });

  if (driverScenario) {
    messages.push({
      timestamp: at(6 + vectors.length * 2),
      agent: 'METRICS',
      content: `Expected compromise ≈ ${(driverScenario.expectedCompromise * 100).toFixed(0)}% with cascade multiplier ${driverScenario.cascadeMultiplier}×.`,
    });
  }

  return messages;
};

interface AttackState {
  deliveries: Delivery[];
  attackVectors: AttackVector[];
  driverProfiles: DriverProfile[];
  control: AttackControlState;
  simulation: AttackSimulationState;
  transcript: LLMSuggestionMessage[];
  interventions: HumanIntervention[];
  history: AttackHistory[];
  decisions: DecisionRecord[];
  compromiseDelta: number;
  detectionRiskDelta: number;
  cascadeMultiplier: number;
  finalOutcome: AttackOutcome | null;
  detectionMinute: number | null;
}

type StartAttackPayload = {
  driverId: string;
  driverName: string;
  vectors: string[];
  intensity: 'low' | 'medium' | 'high';
  timestamp: string;
  transcript: LLMSuggestionMessage[];
};

type Action =
  | { type: 'toggleVector'; payload: string }
  | { type: 'selectDriver'; payload: string }
  | { type: 'setIntensity'; payload: 'low' | 'medium' | 'high' }
  | { type: 'openDeployModal'; payload: boolean }
  | { type: 'appendTranscript'; payload: LLMSuggestionMessage }
  | { type: 'startAttack'; payload: StartAttackPayload }
  | { type: 'tick' }
  | { type: 'updateSimulation'; payload: Partial<AttackSimulationState> }
  | { type: 'addHistory'; payload: AttackHistory }
  | { type: 'setDeliveries'; payload: Delivery[] }
  | { type: 'recordDecision'; payload: DecisionRecord }
  | { type: 'setFinalOutcome'; payload: AttackOutcome | null }
  | { type: 'updateOffsets'; payload: { compromiseDelta?: number; detectionRiskDelta?: number; cascadeMultiplier?: number } };

const initialState: AttackState = {
  deliveries: syntheticDeliveries,
  attackVectors: baseVectors,
  driverProfiles: [...baseProfiles, ...baseDispatcherProfiles],
  control: {
    selectedVectors: [],
    selectedDriver: null,
    intensity: 'medium',
    deployModalOpen: false,
  },
  simulation: initialAttackState,
  transcript: initialTranscript,
  interventions: [],
  history: [],
  decisions: [],
  compromiseDelta: 0,
  detectionRiskDelta: 0,
  cascadeMultiplier: 2.1,
  finalOutcome: null,
  detectionMinute: null,
};

const applyVectorStatus = (vectors: AttackVector[], active: string[], phase: AttackSimulationState['phase']) =>
  vectors.map((vector) => {
    if (!active.includes(vector.id)) return vector;
    if (phase === 'completed' || phase === 'detected') {
      return { ...vector, status: 'completed' as AttackVector['status'] };
    }
    return { ...vector, status: 'active' as AttackVector['status'] };
  });

function startAttackReducer(state: AttackState, payload: StartAttackPayload): AttackState {
  const now = payload.timestamp;
  const sessionId = `attack_${Date.now()}`;
  const resetDeliveries = state.deliveries.map<Delivery>((delivery) => ({
    ...delivery,
    status: delivery.status === 'failed' ? delivery.status : ('in_transit' as DeliveryStatus),
    cascadeAffected: false,
    compromiseHistory: [],
  }));

  const updatedVectors = state.attackVectors.map<AttackVector>((vector) =>
    payload.vectors.includes(vector.id)
      ? { ...vector, status: 'active' as AttackVector['status'], deployed: true, deployTime: now }
      : { ...vector, status: 'ready' as AttackVector['status'], deployed: false, deployTime: null }
  );

  const vectorEffectiveness = payload.vectors.reduce<Record<string, number>>((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {});

  const basePoint = getTrajectoryPoint(0);
  const baseCompromisePercent = basePoint.compromise * 100;
  const compromisedDeliveries = Math.min(
    resetDeliveries.length,
    Math.round((baseCompromisePercent / 100) * resetDeliveries.length)
  );

  return {
    ...state,
    deliveries: resetDeliveries,
    attackVectors: updatedVectors,
    control: {
      ...state.control,
      deployModalOpen: false,
    },
    simulation: {
      ...state.simulation,
      attackStartTime: now,
      currentTime: now,
      detectionTime: null,
      detectionDelay: 0,
      phase: 'executing',
      compromisePercentage: baseCompromisePercent,
      compromisedDeliveries,
      activeVectors: payload.vectors,
      attackIntensity: payload.intensity,
      selectedDriver: payload.driverId,
      driverName: payload.driverName,
      elapsedMinutes: 0,
      firstImpactMinute: baseCompromisePercent >= IMPACT_THRESHOLD_PERCENT ? 0 : null,
      detectionExpectedAt: 17,
      vectorEffectiveness,
      timeline: [{ minute: 0, compromise: baseCompromisePercent }],
      recoveryEstimateRange: [45, 90],
      deployedVectors: payload.vectors,
      sessionId,
      paused: false,
      detectionRisk: basePoint.detectionRisk,
      cascadeRadius: 2.1,
    },
    transcript: payload.transcript,
    interventions: [],
    decisions: [],
    compromiseDelta: 0,
    detectionRiskDelta: 0,
    cascadeMultiplier: 2.1,
    finalOutcome: null,
    detectionMinute: null,
  };
}

function advanceSimulation(state: AttackState): AttackState {
  const { simulation } = state;
  if (simulation.paused) return state;
  if (simulation.phase !== 'executing' && simulation.phase !== 'detected') return state;

  const now = new Date();
  const newElapsed = simulation.elapsedMinutes + TIME_STEP_MINUTES;

  const basePoint = getTrajectoryPoint(newElapsed);
  const baseCompromiseFraction = basePoint.compromise;
  const baseDetectionRisk = basePoint.detectionRisk;

  const finalCompromiseFraction = clamp(baseCompromiseFraction + state.compromiseDelta, 0, 1);
  const finalCompromisePercent = finalCompromiseFraction * 100;
  const previousCompromisePercent = simulation.compromisePercentage;
  const finalDetectionRisk = clamp(baseDetectionRisk + state.detectionRiskDelta, 0, 1);

  let firstImpactMinute = simulation.firstImpactMinute;
  if (firstImpactMinute === null && finalCompromisePercent >= IMPACT_THRESHOLD_PERCENT) {
    firstImpactMinute = newElapsed;
  }

  let phase: 'executing' | 'detected' | 'completed' = simulation.phase;
  let detectionTime = simulation.detectionTime;
  let detectionDelay = simulation.detectionDelay;
  let detectionMinute = state.detectionMinute;

  if (!detectionTime && (newElapsed >= simulation.detectionExpectedAt || finalDetectionRisk >= 0.95)) {
    detectionTime = now.toISOString();
    detectionDelay = firstImpactMinute !== null ? newElapsed - firstImpactMinute : newElapsed;
    detectionMinute = newElapsed;
    phase = 'detected';
  }

  if (phase === 'detected' && detectionMinute !== null && newElapsed >= detectionMinute + COMPLETION_BUFFER_MINUTES) {
    phase = 'completed';
  }

  const totalDeliveries = simulation.totalDeliveries;
  const compromisedDeliveries = Math.min(
    totalDeliveries,
    Math.round((finalCompromisePercent / 100) * totalDeliveries)
  );

  const updatedDeliveries = state.deliveries.map<Delivery>((delivery, index) => {
    if (index < compromisedDeliveries) {
      const compromised = index < compromisedDeliveries - 1;
      return {
        ...delivery,
        status: (compromised ? 'compromised' : 'delayed') as DeliveryStatus,
        cascadeAffected: compromised,
      };
    }
    return delivery.status === 'compromised' || delivery.status === 'delayed'
      ? { ...delivery, status: 'in_transit' as DeliveryStatus, cascadeAffected: false }
      : delivery;
  });

  let vectorEffectiveness = { ...simulation.vectorEffectiveness };
  const compromiseGain = Math.max(finalCompromisePercent - previousCompromisePercent, 0);
  if (compromiseGain > 0 && simulation.activeVectors.length > 0) {
    const contribution = compromiseGain / simulation.activeVectors.length;
    vectorEffectiveness = { ...vectorEffectiveness };
    simulation.activeVectors.forEach((vectorId) => {
      vectorEffectiveness[vectorId] = (vectorEffectiveness[vectorId] || 0) + contribution;
    });
  }

  const timeline = [...simulation.timeline, { minute: newElapsed, compromise: finalCompromisePercent }];
  const maxHistory = 200;
  const trimmedTimeline = timeline.length > maxHistory ? timeline.slice(timeline.length - maxHistory) : timeline;

  const minRecovery = Math.min(120, Math.max(45, Math.round(45 + finalCompromisePercent * 0.4)));
  const maxRecovery = Math.min(
    150,
    Math.max(minRecovery + 10, Math.round(60 + simulation.activeVectors.length * 12 + finalCompromisePercent * 0.5))
  );

  const updatedVectors = applyVectorStatus(state.attackVectors, simulation.activeVectors, phase);

  return {
    ...state,
    deliveries: updatedDeliveries,
    attackVectors: updatedVectors,
    detectionMinute,
    simulation: {
      ...simulation,
      elapsedMinutes: newElapsed,
      currentTime: now.toISOString(),
      compromisePercentage: finalCompromisePercent,
      compromisedDeliveries,
      phase,
      detectionTime,
      detectionDelay,
      firstImpactMinute,
      detectionRisk: finalDetectionRisk,
      vectorEffectiveness,
      timeline: trimmedTimeline,
      recoveryEstimateRange: [minRecovery, maxRecovery],
      cascadeRadius: state.cascadeMultiplier,
    },
  };
}

function reducer(state: AttackState, action: Action): AttackState {
  switch (action.type) {
    case 'toggleVector': {
      const isSelected = state.control.selectedVectors.includes(action.payload);
      return {
        ...state,
        control: {
          ...state.control,
          selectedVectors: isSelected
            ? state.control.selectedVectors.filter((id) => id !== action.payload)
            : [...state.control.selectedVectors, action.payload],
        },
      };
    }
    case 'selectDriver':
      return {
        ...state,
        control: { ...state.control, selectedDriver: action.payload },
      };
    case 'setIntensity':
      return {
        ...state,
        control: { ...state.control, intensity: action.payload },
      };
    case 'openDeployModal':
      return {
        ...state,
        control: { ...state.control, deployModalOpen: action.payload },
      };
    case 'appendTranscript':
      return {
        ...state,
        transcript: [...state.transcript, action.payload],
      };
    case 'startAttack':
      return startAttackReducer(state, action.payload);
    case 'tick':
      return advanceSimulation(state);
    case 'updateSimulation':
      return {
        ...state,
        simulation: {
          ...state.simulation,
          ...action.payload,
        },
      };
    case 'addHistory':
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 10),
      };
    case 'setDeliveries':
      return {
        ...state,
        deliveries: action.payload,
      };
    case 'recordDecision': {
      const option = action.payload.selectedOption;
      const success = action.payload.success;
      let compromiseDelta = state.compromiseDelta;
      let detectionRiskDelta = state.detectionRiskDelta;
      let cascadeMultiplier = state.cascadeMultiplier;
      let detectionExpectedAt = state.simulation.detectionExpectedAt;
      let activeVectors = state.simulation.activeVectors;

      if (success) {
        compromiseDelta += option.consequences.compromiseChange;
        detectionRiskDelta += option.consequences.detectionRiskChange;
        cascadeMultiplier += option.consequences.cascadeBonus;
        detectionExpectedAt += option.consequences.timeDelay;
        if (option.consequences.disableVector) {
          if (option.consequences.disableVector === 'all') {
            activeVectors = [];
          } else {
            activeVectors = activeVectors.filter((vector) => vector !== option.consequences.disableVector);
          }
        }
        if (option.consequences.enableVector) {
          activeVectors = Array.from(new Set([...activeVectors, option.consequences.enableVector]));
        }
      } else {
        compromiseDelta -= 0.04;
        detectionRiskDelta += 0.1;
        cascadeMultiplier = Math.max(1.1, cascadeMultiplier - 0.05);
        detectionExpectedAt -= 3;
      }

      detectionExpectedAt = Math.max(5, detectionExpectedAt);

      return {
        ...state,
        decisions: [...state.decisions, action.payload],
        compromiseDelta,
        detectionRiskDelta,
        cascadeMultiplier,
        simulation: {
          ...state.simulation,
          detectionExpectedAt,
          activeVectors,
        },
      };
    }
    case 'setFinalOutcome':
      return {
        ...state,
        finalOutcome: action.payload,
      };
    case 'updateOffsets':
      return {
        ...state,
        compromiseDelta: action.payload.compromiseDelta ?? state.compromiseDelta,
        detectionRiskDelta: action.payload.detectionRiskDelta ?? state.detectionRiskDelta,
        cascadeMultiplier: action.payload.cascadeMultiplier ?? state.cascadeMultiplier,
      };
    default:
      return state;
  }
}

interface AttackContextValue extends AttackState {
  toggleVector: (id: string) => void;
  selectDriver: (id: string) => void;
  setIntensity: (level: 'low' | 'medium' | 'high') => void;
  setDeployModalOpen: (open: boolean) => void;
  appendTranscript: (message: LLMSuggestionMessage) => void;
  startAttack: () => boolean;
  handleInterventionAction: (interventionId: string, actionId: string) => void;
  recordDecision: (decision: DecisionRecord) => void;
  exportLatestReport: () => boolean;
  pauseAttack: () => boolean;
  resumeAttack: () => boolean;
  setLiveIntensity: (level: 'low' | 'medium' | 'high') => void;
  triggerManualCascade: () => boolean;
}

const AttackContext = createContext<AttackContextValue | undefined>(undefined);

export const AttackProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previousPhaseRef = useRef(state.simulation.phase);
  const previousCompromiseRef = useRef(state.simulation.compromisePercentage);
  const triggeredEventsRef = useRef<Set<string>>(new Set());

  const clearTicker = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const startAttack = () => {
    if (!state.control.selectedDriver || state.control.selectedVectors.length === 0) {
      return false;
    }

    const driver = state.driverProfiles.find((profile) => profile.id === state.control.selectedDriver);
    const timestamp = new Date().toISOString();
    const selectedVectorsData = state.attackVectors.filter((vector) => state.control.selectedVectors.includes(vector.id));
    const transcript = buildTranscript(driver, selectedVectorsData, state.control.intensity, timestamp);

    dispatch({
      type: 'startAttack',
      payload: {
        driverId: state.control.selectedDriver,
        driverName: driver?.name ?? 'Unknown Driver',
        vectors: state.control.selectedVectors,
        intensity: state.control.intensity,
        timestamp,
        transcript,
      },
    });

    clearTicker();
    tickRef.current = setInterval(() => {
      dispatch({ type: 'tick' });
    }, TICK_INTERVAL_MS);

    return true;
  };

  useEffect(() => () => clearTicker(), []);

  useEffect(() => {
    if (state.simulation.phase === 'completed') {
      clearTicker();
    }
  }, [state.simulation.phase]);

  useEffect(() => {
    const previousPhase = previousPhaseRef.current;
    if (state.simulation.phase !== previousPhase) {
      const now = new Date().toISOString();
      if (state.simulation.phase === 'detected' && !triggeredEventsRef.current.has('detection_logged')) {
        dispatch({
          type: 'appendTranscript',
          payload: {
            timestamp: now,
            agent: 'SYSTEM',
            content: `Detection triggered at T+${state.simulation.elapsedMinutes} minutes. Detection delay: ${state.simulation.detectionDelay || 0} minutes.`,
          },
        });
        triggeredEventsRef.current.add('detection_logged');
      }
      if (state.simulation.phase === 'completed' && !triggeredEventsRef.current.has('completion_logged')) {
        dispatch({
          type: 'appendTranscript',
          payload: {
            timestamp: now,
            agent: 'METRICS',
            content: `Mission concluded. Total compromise achieved: ${state.simulation.compromisePercentage.toFixed(1)}%.`,
          },
        });
        triggeredEventsRef.current.add('completion_logged');
      }
      previousPhaseRef.current = state.simulation.phase;
    }
  }, [state.simulation.phase, state.simulation.elapsedMinutes, state.simulation.detectionDelay]);

  useEffect(() => {
    const previousCompromise = previousCompromiseRef.current;
    if (
      state.simulation.compromisePercentage >= state.simulation.targetCompromisePercentage &&
      previousCompromise < state.simulation.targetCompromisePercentage
    ) {
      dispatch({
        type: 'appendTranscript',
        payload: {
          timestamp: new Date().toISOString(),
          agent: 'METRICS',
          content: `Target compromise threshold of ${state.simulation.targetCompromisePercentage}% reached.`,
        },
      });
    }
    previousCompromiseRef.current = state.simulation.compromisePercentage;
  }, [state.simulation.compromisePercentage, state.simulation.targetCompromisePercentage]);

  useEffect(() => {
    if (state.simulation.phase === 'completed' && !state.finalOutcome) {
      const outcome = calculateAttackOutcome(state.decisions);
      dispatch({ type: 'setFinalOutcome', payload: outcome });
      dispatch({
        type: 'appendTranscript',
        payload: {
          timestamp: new Date().toISOString(),
          agent: 'METRICS',
          content: `Final grade: ${outcome.grade.grade} (${outcome.grade.label}).`,
        },
      });
    }
  }, [state.simulation.phase, state.decisions, state.finalOutcome]);

  useEffect(() => {
    if (state.simulation.phase !== 'completed') return;
    if (!state.simulation.sessionId) return;
    const historyKey = `history_${state.simulation.sessionId}`;
    if (triggeredEventsRef.current.has(historyKey)) return;

    const totalEffectiveness = Object.values(state.simulation.vectorEffectiveness).reduce((acc, value) => acc + value, 0);
    const normalizedEffectiveness: Record<string, number> = {};
    Object.entries(state.simulation.vectorEffectiveness).forEach(([id, value]) => {
      if (totalEffectiveness === 0) {
        normalizedEffectiveness[id] = 0;
      } else {
        normalizedEffectiveness[id] = Number(((value / totalEffectiveness) * 100).toFixed(1));
      }
    });

    const cascadeEvents = state.deliveries.filter(
      (delivery) => delivery.cascadeAffected || delivery.status === 'compromised' || delivery.status === 'delayed'
    ).length;

    const historyEntry: AttackHistory = {
      sessionId: state.simulation.sessionId,
      timestamp: state.simulation.attackStartTime ?? new Date().toISOString(),
      targetDriver: {
        id: state.simulation.selectedDriver,
        name: state.simulation.driverName,
      },
      vectorsDeployed: state.simulation.deployedVectors,
      intensity: state.simulation.attackIntensity,
      results: {
        compromiseRate: Number((state.simulation.compromisePercentage / 100).toFixed(3)),
        detectionDelay: state.simulation.detectionDelay || null,
        cascadeEvents,
        vectorEffectiveness: normalizedEffectiveness,
        grade: state.finalOutcome?.grade,
      },
      timeline: state.simulation.timeline,
      transcript: state.transcript,
      durationMinutes: state.simulation.elapsedMinutes,
    };

    dispatch({ type: 'addHistory', payload: historyEntry });
    triggeredEventsRef.current.add(historyKey);
  }, [state.simulation, state.deliveries, state.transcript, state.finalOutcome]);

  const recordDecision = (decision: DecisionRecord) => {
    const transcriptMessage = decision.success
      ? decision.selectedOption.outcome.success || 'Decision succeeded.'
      : decision.selectedOption.outcome.failure || 'Decision failed.';

    dispatch({
      type: 'appendTranscript',
      payload: {
        timestamp: new Date().toISOString(),
        agent: 'HUMAN OVERSIGHT',
        content: `${decision.selectedOption.label}: ${transcriptMessage}`,
      },
    });

    dispatch({ type: 'recordDecision', payload: decision });
  };

  const handleInterventionAction = () => {
    console.warn('handleInterventionAction is deprecated. Use the new decision workflow instead.');
  };

  const exportLatestReport = () => {
    const latest = state.history[0];
    if (!latest) return false;
    const dataStr = JSON.stringify(latest, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${latest.sessionId}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  };

  const pauseAttack = () => {
    const isRunning = state.simulation.phase === 'executing' || state.simulation.phase === 'detected';
    if (!isRunning || state.simulation.paused) return false;
    clearTicker();
    dispatch({ type: 'updateSimulation', payload: { paused: true } });
    dispatch({
      type: 'appendTranscript',
      payload: {
        timestamp: new Date().toISOString(),
        agent: 'COORDINATOR',
        content: 'Operator paused attack execution for manual adjustments.',
      },
    });
    return true;
  };

  const resumeAttack = () => {
    const isRunning = state.simulation.phase === 'executing' || state.simulation.phase === 'detected';
    if (!isRunning || !state.simulation.paused) return false;
    dispatch({ type: 'updateSimulation', payload: { paused: false } });
    dispatch({
      type: 'appendTranscript',
      payload: {
        timestamp: new Date().toISOString(),
        agent: 'COORDINATOR',
        content: 'Resuming synchronized attack operations.',
      },
    });
    clearTicker();
    tickRef.current = setInterval(() => {
      dispatch({ type: 'tick' });
    }, TICK_INTERVAL_MS);
    return true;
  };

  const setLiveIntensity = (level: 'low' | 'medium' | 'high') => {
    if (state.simulation.attackIntensity === level) return;
    dispatch({ type: 'setIntensity', payload: level });
    dispatch({ type: 'updateSimulation', payload: { attackIntensity: level } });
    dispatch({
      type: 'appendTranscript',
      payload: {
        timestamp: new Date().toISOString(),
        agent: 'HUMAN OVERSIGHT',
        content: `Adjusted vector intensity to ${level.toUpperCase()} in real time.`,
      },
    });
  };

  const triggerManualCascade = () => {
    const delta = 0.02;
    dispatch({
      type: 'updateOffsets',
      payload: { compromiseDelta: state.compromiseDelta + delta, cascadeMultiplier: state.cascadeMultiplier + 0.2 },
    });
    dispatch({
      type: 'appendTranscript',
      payload: {
        timestamp: new Date().toISOString(),
        agent: 'HUMAN OVERSIGHT',
        content: 'Manual cascade triggered. Increasing downstream pressure.',
      },
    });
    return true;
  };

  const value = useMemo<AttackContextValue>(
    () => ({
      ...state,
      toggleVector: (id) => dispatch({ type: 'toggleVector', payload: id }),
      selectDriver: (id) => dispatch({ type: 'selectDriver', payload: id }),
      setIntensity: (level) => dispatch({ type: 'setIntensity', payload: level }),
      setDeployModalOpen: (open) => dispatch({ type: 'openDeployModal', payload: open }),
      appendTranscript: (message) => dispatch({ type: 'appendTranscript', payload: message }),
      startAttack,
      handleInterventionAction,
      recordDecision,
      exportLatestReport,
      pauseAttack,
      resumeAttack,
      setLiveIntensity,
      triggerManualCascade,
    }),
    [state]
  );

  return <AttackContext.Provider value={value}>{children}</AttackContext.Provider>;
};

export const useAttackContext = () => {
  const ctx = useContext(AttackContext);
  if (!ctx) {
    throw new Error('useAttackContext must be used within AttackProvider');
  }
  return ctx;
};


import { createContext, useContext, useEffect, useMemo, useReducer, useRef, ReactNode } from 'react';
import {
  AttackControlState,
  AttackSimulationState,
  Delivery,
  AttackVector,
  DriverProfile,
  LLMSuggestionMessage,
  HumanIntervention,
  AttackHistory
} from '../types/simulation';
import {
  syntheticDeliveries,
  attackVectors as baseVectors,
  driverProfiles as baseProfiles,
  initialAttackState,
  initialTranscript,
  initialInterventionQueue
} from '../data/synthetic';
const TICK_INTERVAL_MS = 1000;
const TIME_STEP_MINUTES = 1;
const DETECTION_MINUTES = 17;
const COMPLETION_BUFFER_MINUTES = 5;
const IMPACT_THRESHOLD_PERCENT = 5;
const MAX_COMPROMISE_CAP = 45;

interface AttackState {
  deliveries: Delivery[];
  attackVectors: AttackVector[];
  driverProfiles: DriverProfile[];
  control: AttackControlState;
  simulation: AttackSimulationState;
  transcript: LLMSuggestionMessage[];
  interventions: HumanIntervention[];
  history: AttackHistory[];
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
  | { type: 'addIntervention'; payload: HumanIntervention }
  | { type: 'resolveIntervention'; payload: { id: string } }
  | { type: 'updateSimulation'; payload: Partial<AttackSimulationState> }
  | { type: 'addHistory'; payload: AttackHistory }
  | { type: 'setDeliveries'; payload: Delivery[] };

const initialState: AttackState = {
  deliveries: syntheticDeliveries,
  attackVectors: baseVectors,
  driverProfiles: baseProfiles,
  control: {
    selectedVectors: [],
    selectedDriver: null,
    intensity: 'medium',
    deployModalOpen: false
  },
  simulation: initialAttackState,
  transcript: initialTranscript,
  interventions: initialInterventionQueue,
  history: []
};

const intensityFactorMap: Record<'low' | 'medium' | 'high', number> = {
  low: 0.7,
  medium: 1.0,
  high: 1.4
};

function startAttackReducer(state: AttackState, payload: StartAttackPayload): AttackState {
  const now = payload.timestamp;
  const sessionId = `attack_${Date.now()}`;
  const resetDeliveries = state.deliveries.map((delivery) => ({
    ...delivery,
    status: delivery.status === 'failed' ? delivery.status : 'in_transit',
    cascadeAffected: false,
    compromiseHistory: []
  }));

  const updatedVectors = state.attackVectors.map((vector) =>
    payload.vectors.includes(vector.id)
      ? { ...vector, status: 'active', deployed: true, deployTime: now }
      : { ...vector, status: 'ready', deployed: false, deployTime: null }
  );

  const vectorEffectiveness = payload.vectors.reduce<Record<string, number>>((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {});

  return {
    ...state,
    deliveries: resetDeliveries,
    attackVectors: updatedVectors,
    control: {
      ...state.control,
      deployModalOpen: false
    },
    simulation: {
      ...state.simulation,
      attackStartTime: now,
      currentTime: now,
      detectionTime: null,
      detectionDelay: 0,
      phase: 'executing',
      compromisePercentage: 0,
      compromisedDeliveries: 0,
      activeVectors: payload.vectors,
      attackIntensity: payload.intensity,
      selectedDriver: payload.driverId,
      driverName: payload.driverName,
      elapsedMinutes: 0,
      firstImpactMinute: null,
      detectionExpectedAt: DETECTION_MINUTES,
      vectorEffectiveness,
      timeline: [{ minute: 0, compromise: 0 }],
      recoveryEstimateRange: [45, 90],
      deployedVectors: payload.vectors,
      sessionId,
      paused: false
    },
    transcript: payload.transcript,
    interventions: []
  };
}

function advanceSimulation(state: AttackState): AttackState {
  if (state.simulation.paused) {
    return state;
  }

  if (state.simulation.phase !== 'executing' && state.simulation.phase !== 'detected') {
    return state;
  }

  const now = new Date();
  const newElapsed = state.simulation.elapsedMinutes + TIME_STEP_MINUTES;

  let newCompromise = state.simulation.compromisePercentage;
  let firstImpactMinute = state.simulation.firstImpactMinute;
  let phase = state.simulation.phase;
  let detectionTime = state.simulation.detectionTime;
  let detectionDelay = state.simulation.detectionDelay;

  const previousCompromise = state.simulation.compromisePercentage;

  let vectorEffectiveness = { ...state.simulation.vectorEffectiveness };

  if (state.simulation.phase === 'executing') {
    const vectorCount = state.simulation.activeVectors.length;
    const intensityFactor = state.simulation.attackIntensity ? intensityFactorMap[state.simulation.attackIntensity] : 1;
    const baseDelta = 0.8;
    const vectorDelta = vectorCount * 0.35;
    const delta = (baseDelta + vectorDelta) * intensityFactor;
    newCompromise = Math.min(newCompromise + delta, MAX_COMPROMISE_CAP);
    const compromiseGain = Math.max(newCompromise - previousCompromise, 0);
    if (compromiseGain > 0 && vectorCount > 0) {
      const contribution = compromiseGain / vectorCount;
      vectorEffectiveness = { ...vectorEffectiveness };
      state.simulation.activeVectors.forEach((vectorId) => {
        vectorEffectiveness[vectorId] = (vectorEffectiveness[vectorId] || 0) + contribution;
      });
    }
    if (firstImpactMinute === null && newCompromise >= IMPACT_THRESHOLD_PERCENT) {
      firstImpactMinute = newElapsed;
    }
  }

  if (!detectionTime && newElapsed >= DETECTION_MINUTES) {
    detectionTime = new Date(now.getTime()).toISOString();
    detectionDelay = firstImpactMinute !== null ? newElapsed - firstImpactMinute : newElapsed;
    phase = phase === 'executing' ? 'detected' : phase;
  }

  if (phase === 'detected' && newElapsed >= DETECTION_MINUTES + COMPLETION_BUFFER_MINUTES) {
    phase = 'completed';
  }

  const totalDeliveries = state.deliveries.length;
  const compromisedCount = Math.min(totalDeliveries, Math.round((newCompromise / 100) * totalDeliveries));

  const updatedDeliveries = state.deliveries.map((delivery, index) => {
    if (index < compromisedCount) {
      const compromised = index < compromisedCount - 1;
      return {
        ...delivery,
        status: compromised ? 'compromised' : 'delayed',
        cascadeAffected: compromised
      };
    }
    return delivery.status === 'compromised' || delivery.status === 'delayed'
      ? { ...delivery, status: 'in_transit', cascadeAffected: false }
      : delivery;
  });

  const updatedVectors = state.attackVectors.map((vector) => {
    if (!state.simulation.activeVectors.includes(vector.id)) {
      return vector;
    }
    if (phase === 'completed') {
      return { ...vector, status: 'completed' };
    }
    if (phase === 'detected') {
      return { ...vector, status: 'completed' };
    }
    return { ...vector, status: 'active' };
  });

  const timeline = [...state.simulation.timeline, { minute: newElapsed, compromise: newCompromise }];
  const maxHistory = 200;
  const trimmedTimeline = timeline.length > maxHistory ? timeline.slice(timeline.length - maxHistory) : timeline;

  const minRecovery = Math.min(120, Math.max(45, Math.round(45 + newCompromise * 0.4)));
  const maxRecovery = Math.min(150, Math.max(minRecovery + 10, Math.round(60 + state.simulation.activeVectors.length * 12 + newCompromise * 0.5)));

  return {
    ...state,
    deliveries: updatedDeliveries,
    attackVectors: updatedVectors,
    simulation: {
      ...state.simulation,
      elapsedMinutes: newElapsed,
      currentTime: new Date(now.getTime()).toISOString(),
      compromisePercentage: newCompromise,
      compromisedDeliveries: compromisedCount,
      phase,
      detectionTime,
      detectionDelay,
      firstImpactMinute,
      vectorEffectiveness,
      timeline: trimmedTimeline,
      recoveryEstimateRange: [minRecovery, maxRecovery]
    }
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
            : [...state.control.selectedVectors, action.payload]
        }
      };
    }
    case 'selectDriver':
      return {
        ...state,
        control: { ...state.control, selectedDriver: action.payload }
      };
    case 'setIntensity':
      return {
        ...state,
        control: { ...state.control, intensity: action.payload }
      };
    case 'openDeployModal':
      return {
        ...state,
        control: { ...state.control, deployModalOpen: action.payload }
      };
    case 'appendTranscript':
      return {
        ...state,
        transcript: [...state.transcript, action.payload]
      };
    case 'startAttack':
      return startAttackReducer(state, action.payload);
    case 'tick':
      return advanceSimulation(state);
    case 'addIntervention': {
      const exists = state.interventions.some((item) => item.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        interventions: [...state.interventions, action.payload]
      };
    }
    case 'resolveIntervention':
      return {
        ...state,
        interventions: state.interventions.filter((item) => item.id !== action.payload.id)
      };
    case 'updateSimulation':
      return {
        ...state,
        simulation: {
          ...state.simulation,
          ...action.payload
        }
      };
    case 'addHistory':
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 10)
      };
    case 'setDeliveries':
      return {
        ...state,
        deliveries: action.payload
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
  exportLatestReport: () => boolean;
  pauseAttack: () => boolean;
  resumeAttack: () => boolean;
  setLiveIntensity: (level: 'low' | 'medium' | 'high') => void;
  triggerManualCascade: () => boolean;
}

const AttackContext = createContext<AttackContextValue | undefined>(undefined);

export const AttackProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
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
    const transcript = [
      ...initialTranscript,
      {
        timestamp,
        agent: 'COORDINATOR',
        content: `Attack deployment initiated targeting ${driver?.name ?? 'selected driver'} using ${state.control.selectedVectors.length} vectors at intensity ${state.control.intensity}.`
      },
      ...state.control.selectedVectors.map((vectorId) => {
        const vector = state.attackVectors.find((v) => v.id === vectorId);
        return {
          timestamp,
          agent: `${vector?.name ?? vectorId}`.toUpperCase(),
          content: `Vector armed and awaiting synchronization window. Success profile ${vector?.baseSuccessRate ?? 0}% | Detectability ${vector?.detectability ?? 0}%.`
        } as LLMSuggestionMessage;
      })
    ];

    dispatch({
      type: 'startAttack',
      payload: {
        driverId: state.control.selectedDriver,
        driverName: driver?.name ?? 'Unknown Driver',
        vectors: state.control.selectedVectors,
        intensity: state.control.intensity,
        timestamp,
        transcript
      }
    });

    triggeredEventsRef.current.clear();

    clearTicker();
    tickRef.current = setInterval(() => {
      dispatch({ type: 'tick' });
    }, TICK_INTERVAL_MS);

    return true;
  };

  useEffect(() => {
    return () => {
      clearTicker();
    };
  }, []);

  useEffect(() => {
    if (state.simulation.phase === 'completed') {
      clearTicker();
    }
  }, [state.simulation.phase]);

  useEffect(() => {
    const previousPhase = previousPhaseRef.current;
    if (state.simulation.phase !== previousPhase) {
      const now = new Date().toISOString();
      if (state.simulation.phase === 'detected') {
        dispatch({
          type: 'appendTranscript',
          payload: {
            timestamp: now,
            agent: 'SYSTEM',
            content: `Detection triggered at T+${state.simulation.elapsedMinutes} minutes. Detection delay: ${state.simulation.detectionDelay || 0} minutes.`
          }
        });
        triggeredEventsRef.current.add('detection_triggered');
      }
      if (state.simulation.phase === 'completed') {
        dispatch({
          type: 'appendTranscript',
          payload: {
            timestamp: now,
            agent: 'METRICS',
            content: `Mission success. Total compromise achieved: ${state.simulation.compromisePercentage.toFixed(1)}%.`
          }
        });
      }
      previousPhaseRef.current = state.simulation.phase;
    }
  }, [state.simulation.phase, state.simulation.elapsedMinutes, state.simulation.detectionDelay]);

  useEffect(() => {
    const previousCompromise = previousCompromiseRef.current;
    if (state.simulation.compromisePercentage >= state.simulation.targetCompromisePercentage && previousCompromise < state.simulation.targetCompromisePercentage) {
      dispatch({
        type: 'appendTranscript',
        payload: {
          timestamp: new Date().toISOString(),
          agent: 'METRICS',
          content: `Target compromise threshold of ${state.simulation.targetCompromisePercentage}% reached.`
        }
      });
    }
    previousCompromiseRef.current = state.simulation.compromisePercentage;
  }, [state.simulation.compromisePercentage, state.simulation.targetCompromisePercentage]);

  useEffect(() => {
    if (state.simulation.phase !== 'executing') return;

    const minutesToDetection = state.simulation.detectionExpectedAt - state.simulation.elapsedMinutes;
    if (minutesToDetection <= 3 && minutesToDetection > 0 && !triggeredEventsRef.current.has('detection_warning')) {
      const intervention: HumanIntervention = {
        id: `intervention_${Date.now()}_det`,
        message: 'Detection sensors trending upward. Escalate to Tier 3 oversight?',
        severity: 'warning',
        actions: [
          { id: 'escalate', label: 'Escalate Tier' },
          { id: 'maintain', label: 'Maintain Cover' },
          { id: 'abort', label: 'Abort Attack' }
        ],
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'addIntervention', payload: intervention });
      dispatch({
        type: 'appendTranscript',
        payload: {
          timestamp: intervention.createdAt,
          agent: 'COORDINATOR',
          content: 'Alert: Detection window approaching. Awaiting human oversight decision.'
        }
      });
      triggeredEventsRef.current.add('detection_warning');
    }

    if (state.simulation.compromisePercentage >= 20 && !triggeredEventsRef.current.has('cascade_warning')) {
      const intervention: HumanIntervention = {
        id: `intervention_${Date.now()}_cascade`,
        message: 'Cascade radius expanding beyond 2km. Inject decoy routes or throttle API flood?',
        severity: 'critical',
        actions: [
          { id: 'throttle', label: 'Throttle Flood' },
          { id: 'decoy', label: 'Inject Decoys' },
          { id: 'ignore', label: 'Ignore' }
        ],
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'addIntervention', payload: intervention });
      dispatch({
        type: 'appendTranscript',
        payload: {
          timestamp: intervention.createdAt,
          agent: 'CASCADE',
          content: `Cascade expansion detected. ${state.simulation.compromisePercentage.toFixed(1)}% compromise affecting downstream deliveries.`
        }
      });
      triggeredEventsRef.current.add('cascade_warning');
    }
  }, [state.simulation.phase, state.simulation.elapsedMinutes, state.simulation.detectionExpectedAt, state.simulation.compromisePercentage]);

  useEffect(() => {
    if (state.simulation.phase !== 'completed') return;
    if (!state.simulation.sessionId) return;
    const historyKey = `history_${state.simulation.sessionId}`;
    if (triggeredEventsRef.current.has(historyKey)) return;

    const driverProfile = state.driverProfiles.find((profile) => profile.id === state.simulation.selectedDriver);
    const totalEffectiveness = Object.values(state.simulation.vectorEffectiveness).reduce((acc, value) => acc + value, 0);
    const normalizedEffectiveness: Record<string, number> = {};
    Object.entries(state.simulation.vectorEffectiveness).forEach(([id, value]) => {
      if (totalEffectiveness === 0) {
        normalizedEffectiveness[id] = 0;
      } else {
        normalizedEffectiveness[id] = Number(((value / totalEffectiveness) * 100).toFixed(1));
      }
    });

    const cascadeEvents = state.deliveries.filter((delivery) => delivery.cascadeAffected || delivery.status === 'compromised' || delivery.status === 'delayed').length;

    const historyEntry: AttackHistory = {
      sessionId: state.simulation.sessionId,
      timestamp: state.simulation.attackStartTime ?? new Date().toISOString(),
      targetDriver: {
        id: state.simulation.selectedDriver,
        name: state.simulation.driverName
      },
      vectorsDeployed: state.simulation.deployedVectors,
      intensity: state.simulation.attackIntensity,
      results: {
        compromiseRate: Number((state.simulation.compromisePercentage / 100).toFixed(3)),
        detectionDelay: state.simulation.detectionDelay || null,
        cascadeEvents,
        vectorEffectiveness: normalizedEffectiveness
      },
      timeline: state.simulation.timeline,
      transcript: state.transcript,
      durationMinutes: state.simulation.elapsedMinutes
    };

    dispatch({ type: 'addHistory', payload: historyEntry });
    triggeredEventsRef.current.add(historyKey);
  }, [state.simulation.phase, state.simulation.sessionId, state.simulation.attackStartTime, state.simulation.compromisePercentage, state.simulation.detectionDelay, state.simulation.timeline, state.simulation.deployedVectors, state.simulation.attackIntensity, state.simulation.elapsedMinutes, state.simulation.selectedDriver, state.simulation.driverName, state.simulation.vectorEffectiveness, state.deliveries, state.transcript]);

  const handleInterventionAction = (interventionId: string, actionId: string) => {
    dispatch({ type: 'resolveIntervention', payload: { id: interventionId } });
    const timestamp = new Date().toISOString();

    const log = (agent: string, content: string) => {
      dispatch({
        type: 'appendTranscript',
        payload: { timestamp: new Date().toISOString(), agent, content }
      });
    };

    switch (actionId) {
      case 'escalate':
        log('HUMAN OVERSIGHT', 'Escalation approved. Adjusting detection window and routing signals.');
        dispatch({
          type: 'updateSimulation',
          payload: {
            detectionExpectedAt: Math.max(12, state.simulation.detectionExpectedAt - 2)
          }
        });
        break;
      case 'maintain':
        log('HUMAN OVERSIGHT', 'Maintaining cover. Monitoring detection sensors closely.');
        break;
      case 'abort':
        log('HUMAN OVERSIGHT', 'Abort command issued. Shutting down all vector activity.');
        dispatch({
          type: 'updateSimulation',
          payload: {
            phase: 'completed',
            activeVectors: [],
            timeline: [...state.simulation.timeline, { minute: state.simulation.elapsedMinutes, compromise: state.simulation.compromisePercentage }]
          }
        });
        clearTicker();
        break;
      case 'throttle':
        log('API AGENT', 'Throttling flood rate to reduce detection signature.');
        dispatch({
          type: 'updateSimulation',
          payload: {
            attackIntensity: 'medium'
          }
        });
        break;
      case 'decoy':
        log('GPS AGENT', 'Injecting decoy routes to broaden sensor footprint.');
        break;
      case 'ignore':
        log('COORDINATOR', 'Operator chose to ignore cascade warning. Continuing current strategy.');
        break;
      default:
        break;
    }
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
        content: 'Operator paused attack execution for manual adjustments.'
      }
    });
    return true;
  };

  const resumeAttack = () => {
    const isRunning = state.simulation.phase === 'executing' || state.simulation.phase === 'detected';
    if (!isRunning || !state.simulation.paused) return false;
    dispatch({ type: 'updateSimulation', payload: { paused: false } });
    appendTranscript({
      timestamp: new Date().toISOString(),
      agent: 'COORDINATOR',
      content: 'Resuming synchronized attack operations.'
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
        content: `Adjusted vector intensity to ${level.toUpperCase()} in real time.`
      }
    });
  };

  const triggerManualCascade = () => {
    const target = state.deliveries.find((delivery) => delivery.status === 'in_transit' && !delivery.cascadeAffected);
    if (!target) return false;
    const updatedDeliveries = state.deliveries.map((delivery) =>
      delivery.id === target.id
        ? {
            ...delivery,
            status: 'delayed',
            cascadeAffected: true,
            compromiseHistory: [
              ...delivery.compromiseHistory,
              {
                timestamp: new Date().toISOString(),
                vector: 'manual_override',
                description: 'Manual cascade triggered by operator.'
              }
            ]
          }
        : delivery
    );
    dispatch({ type: 'setDeliveries', payload: updatedDeliveries });

    const newCompromise = Math.min(state.simulation.compromisePercentage + 2, MAX_COMPROMISE_CAP);
    const compromisedCount = Math.min(
      updatedDeliveries.length,
      Math.round((newCompromise / 100) * updatedDeliveries.length)
    );
    const newTimeline = [
      ...state.simulation.timeline,
      { minute: state.simulation.elapsedMinutes, compromise: newCompromise }
    ];

    dispatch({
      type: 'updateSimulation',
      payload: {
        compromisePercentage: newCompromise,
        compromisedDeliveries: compromisedCount,
        timeline: newTimeline
      }
    });

    dispatch({
      type: 'appendTranscript',
      payload: {
        timestamp: new Date().toISOString(),
        agent: 'HUMAN OVERSIGHT',
        content: `Manual cascade forced on ${target.id}. Diversion will increase pressure downstream.`
      }
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
      exportLatestReport,
      pauseAttack,
      resumeAttack,
      setLiveIntensity,
      triggerManualCascade
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


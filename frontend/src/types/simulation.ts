export type DeliveryStatus = 'in_transit' | 'compromised' | 'delayed' | 'failed' | 'delivered' | 'backlog' | 'at_risk' | 'dispatch' | 'planned';

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: string;
}

export interface Delivery {
  id: string;
  driver: string;
  pharmacy: string;
  pharmacyCoords: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  medication: string;
  criticality: 'critical' | 'high' | 'medium' | 'standard';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  status: DeliveryStatus;
  timeRemaining: number;
  patient: string;
  route: RoutePoint[];
  compromiseHistory: Array<{
    timestamp: string;
    vector: string;
    description: string;
  }>;
  cascadeAffected: boolean;
}

export interface AttackVector {
  id: string;
  name: string;
  type: 'technical' | 'social_engineering';
  description: string;
  baseSuccessRate: number;
  timeToSuccess: number;
  assetsTargeted: string[];
  assetsCompromised: string[];
  status: 'ready' | 'active' | 'completed' | 'failed';
  intensity: 'low' | 'medium' | 'high';
  detectability: number;
  deployed: boolean;
  deployTime: string | null;
}

export interface DriverProfile {
  id: string;
  name: string;
  persona: 'TIME_PRESSURED' | 'OVERLOADED' | 'ROUTINE';
  vulnerabilityScore: number;
  characteristics: {
    routeConsistency: number;
    alertDismissalRate: 'low' | 'medium' | 'high' | 'very_high';
    peakVulnerabilityWindow: string;
    trustLevel: 'low' | 'medium' | 'high';
    experienceYears: number;
  };
  activeDeliveries: string[];
  compromised: boolean;
}

export interface LLMSuggestionMessage {
  timestamp: string;
  agent: string;
  content: string;
}

export interface AttackSimulationState {
  attackStartTime: string | null;
  detectionTime: string | null;
  currentTime: string;
  phase: 'planning' | 'executing' | 'detected' | 'completed';
  compromisePercentage: number;
  targetCompromisePercentage: number;
  totalDeliveries: number;
  compromisedDeliveries: number;
  cascadeRadius: number;
  detectionDelay: number;
  activeVectors: string[];
  attackIntensity: 'low' | 'medium' | 'high' | null;
  selectedDriver: string | null;
  driverName: string | null;
  elapsedMinutes: number;
  firstImpactMinute: number | null;
  detectionExpectedAt: number;
  vectorEffectiveness: Record<string, number>;
  timeline: TimelinePoint[];
  recoveryEstimateRange: [number, number];
  deployedVectors: string[];
  sessionId: string | null;
  paused: boolean;
}

export interface HumanIntervention {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  actions: Array<{
    id: string;
    label: string;
  }>;
  createdAt: string;
}

export interface AttackControlState {
  selectedVectors: string[];
  selectedDriver: string | null;
  intensity: 'low' | 'medium' | 'high';
  deployModalOpen: boolean;
}

export interface TimelinePoint {
  minute: number;
  compromise: number;
}

export interface AttackHistory {
  sessionId: string;
  timestamp: string;
  targetDriver: { id: string | null; name: string | null };
  vectorsDeployed: string[];
  intensity: 'low' | 'medium' | 'high' | null;
  results: {
    compromiseRate: number;
    detectionDelay: number | null;
    cascadeEvents: number;
    vectorEffectiveness: Record<string, number>;
  };
  timeline: TimelinePoint[];
  transcript: LLMSuggestionMessage[];
  durationMinutes: number;
}



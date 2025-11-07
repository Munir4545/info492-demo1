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
  role?: 'DRIVER' | 'DISPATCHER';
  persona: 'TIME_PRESSURED' | 'OVERLOADED' | 'ROUTINE';
  vulnerabilityScore: number;
  characteristics: {
    routeConsistency: number;
    alertDismissalRate: 'low' | 'medium' | 'high' | 'very_high';
    peakVulnerabilityWindow: string;
    trustLevel: 'low' | 'medium' | 'high';
    experienceYears: number;
    averageDeliveriesPerDay?: number;
    overtimeFrequency?: 'low' | 'medium' | 'high' | 'very_high';
    workloadPressure?: 'low' | 'moderate' | 'high' | 'extreme';
    systemRelianceScore?: number;
    systemAccessLevel?: 'limited' | 'standard' | 'full';
    alertProcessingRate?: 'low' | 'medium' | 'high' | 'very_high';
    averageAlertVolume?: number;
  };
  behavioralPatterns?: {
    gpsReliance?: string;
    alertResponse?: string;
    communicationStyle?: string;
    dashboardReliance?: string;
    driverCommunication?: string;
    stressIndicators?: string[];
  };
  exploitableVulnerabilities?: string[];
  activeDeliveries: string[];
  compromised: boolean;
  driversManaged?: string[];
  activeDeliveriesManaged?: number;
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
  detectionRisk: number;
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
  recommendation?: {
    summary: string;
    actionId: string;
    confidence?: 'low' | 'medium' | 'high';
  };
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
    grade?: { grade: string; label: string };
  };
  timeline: TimelinePoint[];
  transcript: LLMSuggestionMessage[];
  durationMinutes: number;
}



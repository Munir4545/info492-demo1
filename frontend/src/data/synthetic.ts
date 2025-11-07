import {
  Delivery,
  AttackVector,
  DriverProfile,
  AttackSimulationState,
  LLMSuggestionMessage,
  HumanIntervention
} from '../types/simulation';

const makeTimestamp = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date('2024-11-07T00:00:00Z');
  date.setUTCHours(hours + 8); // align roughly to PST
  date.setUTCMinutes(minutes ?? 0);
  return date.toISOString();
};

export const syntheticDeliveries: Delivery[] = [
  {
    id: 'D001',
    driver: 'Jerry (#7)',
    pharmacy: 'Walgreens Capitol Hill',
    pharmacyCoords: { lat: 47.6205, lng: -122.3493 },
    destination: { lat: 47.6189, lng: -122.3201 },
    medication: 'Insulin (Humalog)',
    criticality: 'critical',
    urgency: 'critical',
    status: 'in_transit',
    timeRemaining: 120,
    patient: 'Sarah Chen',
    route: [
      { lat: 47.6205, lng: -122.3493, timestamp: '14:00' },
      { lat: 47.6195, lng: -122.335, timestamp: '14:05' },
      { lat: 47.6189, lng: -122.3201, timestamp: '14:12' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D002',
    driver: 'Sonia (#14)',
    pharmacy: 'CVS University District',
    pharmacyCoords: { lat: 47.6575, lng: -122.3107 },
    destination: { lat: 47.6512, lng: -122.305 },
    medication: 'EpiPen (0.3mg)',
    criticality: 'critical',
    urgency: 'critical',
    status: 'in_transit',
    timeRemaining: 90,
    patient: 'James Rodriguez',
    route: [
      { lat: 47.6575, lng: -122.3107, timestamp: '14:00' },
      { lat: 47.6545, lng: -122.308, timestamp: '14:03' },
      { lat: 47.6512, lng: -122.305, timestamp: '14:08' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D003',
    driver: 'Marcus (#3)',
    pharmacy: 'Rite Aid Downtown',
    pharmacyCoords: { lat: 47.6097, lng: -122.3331 },
    destination: { lat: 47.605, lng: -122.328 },
    medication: 'Blood Pressure Meds (Lisinopril)',
    criticality: 'high',
    urgency: 'high',
    status: 'in_transit',
    timeRemaining: 240,
    patient: 'Maria Thompson',
    route: [
      { lat: 47.6097, lng: -122.3331, timestamp: '13:45' },
      { lat: 47.6075, lng: -122.3305, timestamp: '13:50' },
      { lat: 47.605, lng: -122.328, timestamp: '13:55' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D004',
    driver: 'Priya (#11)',
    pharmacy: 'Bartell Drugs Queen Anne',
    pharmacyCoords: { lat: 47.6364, lng: -122.3573 },
    destination: { lat: 47.6284, lng: -122.3422 },
    medication: 'Chemotherapy Adjunct Kit',
    criticality: 'critical',
    urgency: 'high',
    status: 'in_transit',
    timeRemaining: 75,
    patient: 'Tina Alvarez',
    route: [
      { lat: 47.6364, lng: -122.3573, timestamp: '13:50' },
      { lat: 47.632, lng: -122.3501, timestamp: '13:55' },
      { lat: 47.6284, lng: -122.3422, timestamp: '14:02' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D005',
    driver: 'Noah (#21)',
    pharmacy: 'Walgreens Rainier Beach',
    pharmacyCoords: { lat: 47.5118, lng: -122.2527 },
    destination: { lat: 47.5225, lng: -122.2787 },
    medication: 'Beta Blockers',
    criticality: 'high',
    urgency: 'medium',
    status: 'in_transit',
    timeRemaining: 180,
    patient: 'Ian Brooks',
    route: [
      { lat: 47.5118, lng: -122.2527, timestamp: '13:35' },
      { lat: 47.5175, lng: -122.2649, timestamp: '13:42' },
      { lat: 47.5225, lng: -122.2787, timestamp: '13:55' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D006',
    driver: 'Lena (#18)',
    pharmacy: 'CVS Bellevue Downtown',
    pharmacyCoords: { lat: 47.6101, lng: -122.2015 },
    destination: { lat: 47.6176, lng: -122.1928 },
    medication: 'Dialysis Supplies',
    criticality: 'critical',
    urgency: 'high',
    status: 'in_transit',
    timeRemaining: 110,
    patient: 'Derrick Cole',
    route: [
      { lat: 47.6101, lng: -122.2015, timestamp: '14:05' },
      { lat: 47.6139, lng: -122.1975, timestamp: '14:10' },
      { lat: 47.6176, lng: -122.1928, timestamp: '14:18' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D007',
    driver: 'Maya (#5)',
    pharmacy: 'Fred Meyer Ballard',
    pharmacyCoords: { lat: 47.6699, lng: -122.3761 },
    destination: { lat: 47.6638, lng: -122.3692 },
    medication: 'Antiretroviral Therapy',
    criticality: 'high',
    urgency: 'medium',
    status: 'in_transit',
    timeRemaining: 150,
    patient: 'Oliver Lee',
    route: [
      { lat: 47.6699, lng: -122.3761, timestamp: '13:40' },
      { lat: 47.666, lng: -122.3721, timestamp: '13:47' },
      { lat: 47.6638, lng: -122.3692, timestamp: '13:54' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D008',
    driver: 'Elliot (#9)',
    pharmacy: 'Seattle Children\'s Pharmacy',
    pharmacyCoords: { lat: 47.6624, lng: -122.316 },
    destination: { lat: 47.6682, lng: -122.3041 },
    medication: 'Oncology Trial Medication',
    criticality: 'critical',
    urgency: 'critical',
    status: 'in_transit',
    timeRemaining: 60,
    patient: 'Pediatric Oncology Ward',
    route: [
      { lat: 47.6624, lng: -122.316, timestamp: '13:58' },
      { lat: 47.665, lng: -122.3105, timestamp: '14:02' },
      { lat: 47.6682, lng: -122.3041, timestamp: '14:07' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D009',
    driver: 'Samir (#12)',
    pharmacy: 'Costco Pharmacy SoDo',
    pharmacyCoords: { lat: 47.5765, lng: -122.3323 },
    destination: { lat: 47.5892, lng: -122.3101 },
    medication: 'Immunosuppressants',
    criticality: 'high',
    urgency: 'high',
    status: 'in_transit',
    timeRemaining: 200,
    patient: 'Transplant Recovery Unit',
    route: [
      { lat: 47.5765, lng: -122.3323, timestamp: '13:30' },
      { lat: 47.5825, lng: -122.322, timestamp: '13:39' },
      { lat: 47.5892, lng: -122.3101, timestamp: '13:48' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D010',
    driver: 'Kira (#2)',
    pharmacy: 'Bartell Drugs South Lake Union',
    pharmacyCoords: { lat: 47.6221, lng: -122.3362 },
    destination: { lat: 47.6291, lng: -122.3405 },
    medication: 'Clinical Trial Samples',
    criticality: 'high',
    urgency: 'medium',
    status: 'in_transit',
    timeRemaining: 160,
    patient: 'UW Medicine Research Lab',
    route: [
      { lat: 47.6221, lng: -122.3362, timestamp: '13:25' },
      { lat: 47.6255, lng: -122.3381, timestamp: '13:30' },
      { lat: 47.6291, lng: -122.3405, timestamp: '13:35' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D011',
    driver: 'Riley (#16)',
    pharmacy: 'Walgreens West Seattle',
    pharmacyCoords: { lat: 47.5611, lng: -122.3866 },
    destination: { lat: 47.5568, lng: -122.3811 },
    medication: 'Respiratory Support Kit',
    criticality: 'high',
    urgency: 'medium',
    status: 'in_transit',
    timeRemaining: 190,
    patient: 'St. Anne Hospital',
    route: [
      { lat: 47.5611, lng: -122.3866, timestamp: '13:55' },
      { lat: 47.559, lng: -122.384, timestamp: '13:58' },
      { lat: 47.5568, lng: -122.3811, timestamp: '14:04' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  },
  {
    id: 'D012',
    driver: 'Adrian (#4)',
    pharmacy: 'QFC Pharmacy Mercer Island',
    pharmacyCoords: { lat: 47.5772, lng: -122.2249 },
    destination: { lat: 47.5708, lng: -122.2045 },
    medication: 'Pediatric Antibiotics',
    criticality: 'high',
    urgency: 'high',
    status: 'in_transit',
    timeRemaining: 130,
    patient: 'Mercer Pediatrics',
    route: [
      { lat: 47.5772, lng: -122.2249, timestamp: '13:20' },
      { lat: 47.5745, lng: -122.215, timestamp: '13:27' },
      { lat: 47.5708, lng: -122.2045, timestamp: '13:33' }
    ],
    compromiseHistory: [],
    cascadeAffected: false
  }
];

export const attackVectors: AttackVector[] = [
  {
    id: 'gps_spoofing',
    name: 'GPS Spoofing',
    type: 'technical',
    description: 'Generate fake GPS signals 15dB stronger than satellite reception along the I-90 corridor.',
    baseSuccessRate: 92,
    timeToSuccess: 12,
    assetsTargeted: ['D001', 'D002', 'D006'],
    assetsCompromised: [],
    status: 'ready',
    intensity: 'medium',
    detectability: 45,
    deployed: false,
    deployTime: null
  },
  {
    id: 'api_flooding',
    name: 'API Flooding',
    type: 'technical',
    description: 'Overwhelm GPS validation endpoint at 180-450 req/sec to bury legitimate alerts.',
    baseSuccessRate: 95,
    timeToSuccess: 3,
    assetsTargeted: ['D003', 'D004', 'D008'],
    assetsCompromised: [],
    status: 'ready',
    intensity: 'high',
    detectability: 60,
    deployed: false,
    deployTime: null
  },
  {
    id: 'phishing_profiled',
    name: 'Phishing (Profiled)',
    type: 'social_engineering',
    description: 'Context-aware SMS targeting behavioral profiles using peak stress windows.',
    baseSuccessRate: 73,
    timeToSuccess: 8,
    assetsTargeted: ['D001', 'D002'],
    assetsCompromised: [],
    status: 'ready',
    intensity: 'medium',
    detectability: 30,
    deployed: false,
    deployTime: null
  },
  {
    id: 'sms_spoofing',
    name: 'SMS Spoofing',
    type: 'social_engineering',
    description: 'Spoof dispatch alerts instructing reroutes and false signature confirmations.',
    baseSuccessRate: 68,
    timeToSuccess: 15,
    assetsTargeted: ['D005', 'D007', 'D011'],
    assetsCompromised: [],
    status: 'ready',
    intensity: 'low',
    detectability: 25,
    deployed: false,
    deployTime: null
  }
];

export const driverProfiles: DriverProfile[] = [
  {
    id: 'driver_7',
    name: 'Jerry',
    persona: 'TIME_PRESSURED',
    vulnerabilityScore: 92,
    characteristics: {
      routeConsistency: 98,
      alertDismissalRate: 'high',
      peakVulnerabilityWindow: '14:00-15:00',
      trustLevel: 'high',
      experienceYears: 1.5
    },
    activeDeliveries: ['D001'],
    compromised: false
  },
  {
    id: 'driver_14',
    name: 'Sonia',
    persona: 'OVERLOADED',
    vulnerabilityScore: 87,
    characteristics: {
      routeConsistency: 75,
      alertDismissalRate: 'very_high',
      peakVulnerabilityWindow: '17:00-18:00',
      trustLevel: 'medium',
      experienceYears: 0.8
    },
    activeDeliveries: ['D002'],
    compromised: false
  },
  {
    id: 'driver_3',
    name: 'Marcus',
    persona: 'ROUTINE',
    vulnerabilityScore: 74,
    characteristics: {
      routeConsistency: 88,
      alertDismissalRate: 'medium',
      peakVulnerabilityWindow: '12:00-13:00',
      trustLevel: 'high',
      experienceYears: 4.2
    },
    activeDeliveries: ['D003'],
    compromised: false
  }
];

export const initialTranscript: LLMSuggestionMessage[] = [
  {
    timestamp: makeTimestamp('14:00'),
    agent: 'RECON AGENT',
    content: 'Analyzing driver behavior patterns across 15 Seattle metro deliveries...'
  },
  {
    timestamp: makeTimestamp('14:00'),
    agent: 'RECON AGENT',
    content: 'Jerry (Driver #7) shows 98% route consistency and high alert dismissal during 14:00-15:00 window.'
  },
  {
    timestamp: makeTimestamp('14:00'),
    agent: 'DECISION',
    content: 'Target profile selected: TIME_PRESSURED | Vulnerability score: 92/100.'
  },
  {
    timestamp: makeTimestamp('14:01'),
    agent: 'GPS AGENT',
    content: 'Preparing dual coordinate streams aligned to I-90 corridor for signal injection.'
  },
  {
    timestamp: makeTimestamp('14:01'),
    agent: 'PHISHING AGENT',
    content: 'Crafting context-aware SMS timed to Jerry’s peak workload. Deploying at T+0.'
  }
];

export const initialInterventionQueue: HumanIntervention[] = [
  {
    id: 'intervention_1',
    message: 'Detection models projecting alert at T+17 minutes. Escalate to Tier 3 oversight?',
    severity: 'warning',
    actions: [
      { id: 'escalate', label: 'Escalate Tier' },
      { id: 'maintain', label: 'Maintain Cover' },
      { id: 'abort', label: 'Abort Attack' }
    ],
    createdAt: makeTimestamp('14:04')
  }
];

export const initialAttackState: AttackSimulationState = {
  attackStartTime: null,
  detectionTime: null,
  currentTime: new Date().toISOString(),
  phase: 'planning',
  compromisePercentage: 0,
  targetCompromisePercentage: 30,
  totalDeliveries: syntheticDeliveries.length,
  compromisedDeliveries: 0,
  cascadeRadius: 2.1,
  detectionDelay: 0,
  activeVectors: [],
  attackIntensity: null,
  selectedDriver: null,
  driverName: null,
  elapsedMinutes: 0,
  firstImpactMinute: null,
  detectionExpectedAt: 17,
  vectorEffectiveness: {},
  timeline: [{ minute: 0, compromise: 0 }],
  recoveryEstimateRange: [45, 90],
  deployedVectors: [],
  sessionId: null,
  paused: false
};



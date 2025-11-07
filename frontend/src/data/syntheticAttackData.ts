export type SeverityLevel = 'minimal' | 'mild' | 'moderate' | 'serious' | 'critical' | 'life-threatening';

export interface MissedDoseImpactWindow {
  severity: SeverityLevel;
  symptoms: string[];
  medicalRisk: string;
  interventionNeeded: boolean;
  alternativeAction?: string;
  healthScore: number;
  note?: string;
  effectiveness?: number;
  timeToSevereReaction?: string;
}

export interface PatientProfileBase {
  id: string;
  name: string;
  age: number;
  [key: string]: string | number | boolean | string[];
}

export interface PatientHealthImpactData {
  medication: string;
  condition: string;
  criticality: 'critical' | 'high';
  missedDoseImpact: Record<string, MissedDoseImpactWindow>;
  systemImpact: Record<string, { probability: number; cost: number; duration?: string; waitTime?: string; effectiveness?: number }>;
  patientProfile: PatientProfileBase;
}

export const patientHealthImpacts: Record<string, PatientHealthImpactData> = {
  'Insulin (Humalog)': {
    medication: 'Insulin (Humalog)',
    condition: 'Type 1 Diabetes',
    criticality: 'critical',
    missedDoseImpact: {
      '0-2 hours': {
        severity: 'minimal',
        symptoms: ['Mild thirst', 'Slight fatigue'],
        medicalRisk: 'low',
        interventionNeeded: false,
        healthScore: 95,
      },
      '2-4 hours': {
        severity: 'moderate',
        symptoms: ['Increased thirst', 'Frequent urination', 'Headache', 'Difficulty concentrating'],
        medicalRisk: 'medium',
        interventionNeeded: false,
        healthScore: 75,
      },
      '4-8 hours': {
        severity: 'serious',
        symptoms: ['Extreme thirst', 'Nausea', 'Rapid heartbeat', 'Confusion', 'Fruity breath'],
        medicalRisk: 'high',
        interventionNeeded: true,
        alternativeAction: 'Emergency glucose monitoring, possible ER visit',
        healthScore: 45,
      },
      '8+ hours': {
        severity: 'critical',
        symptoms: ['Diabetic ketoacidosis (DKA)', 'Severe dehydration', 'Loss of consciousness risk'],
        medicalRisk: 'life-threatening',
        interventionNeeded: true,
        alternativeAction: '911 call required, immediate hospitalization',
        healthScore: 15,
      },
    },
    systemImpact: {
      emergencyRoomVisit: { probability: 0.35, cost: 3200, duration: '4-8 hours' },
      hospitalAdmission: { probability: 0.12, cost: 12000, duration: '2-3 days' },
      alternativeMedication: { probability: 0.45, cost: 150, effectiveness: 0.7 },
      pharmacyEmergencyRefill: { probability: 0.6, cost: 85, waitTime: '1-2 hours' },
    },
    patientProfile: {
      id: 'P001',
      name: 'Sarah Chen',
      age: 34,
      diagnosisDate: '2018-03-15',
      lastDoseTime: '08:00',
      doseFrequency: 'Every 4-6 hours',
      criticalityWindow: 240,
      hasBackupSupply: false,
      insuranceCoverage: 'partial',
      distanceToEmergencyCare: '3.2 miles',
    },
  },
  'EpiPen (Epinephrine Auto-Injector)': {
    medication: 'EpiPen (Epinephrine)',
    condition: 'Severe Allergies (Anaphylaxis Risk)',
    criticality: 'critical',
    missedDoseImpact: {
      immediate: {
        severity: 'critical',
        symptoms: ['No immediate symptoms if no allergen exposure'],
        medicalRisk: 'life-threatening if exposure occurs',
        interventionNeeded: false,
        healthScore: 100,
        note: 'Patient at risk of death if allergen exposure occurs without EpiPen',
      },
      upon_exposure: {
        severity: 'life-threatening',
        symptoms: ['Throat swelling', 'Difficulty breathing', 'Rapid pulse', 'Severe drop in blood pressure', 'Unconsciousness'],
        medicalRisk: 'death within 15-30 minutes',
        interventionNeeded: true,
        alternativeAction: 'Immediate 911 call, antihistamines (insufficient for severe reaction)',
        healthScore: 5,
        timeToSevereReaction: '5-15 minutes',
      },
    },
    systemImpact: {
      emergencyRoomVisit: { probability: 0.95, cost: 4500, duration: '6-12 hours' },
      hospitalAdmission: { probability: 0.3, cost: 15000, duration: '1-2 days' },
      ambulanceCall: { probability: 0.85, cost: 1800, duration: '15-30 min response' },
      pharmacyEmergencyRefill: { probability: 0.4, cost: 120, waitTime: 'immediate pickup priority' },
    },
    patientProfile: {
      id: 'P002',
      name: 'James Rodriguez',
      age: 28,
      knownAllergens: ['Peanuts', 'Shellfish', 'Bee stings'],
      lastReactionDate: '2023-08-12',
      reactionSeverity: 'severe',
      hasBackupEpiPen: false,
      worksInHighRiskEnvironment: true,
      exposureRisk: 'high',
    },
  },
  'Blood Pressure Meds (Lisinopril)': {
    medication: 'Lisinopril',
    condition: 'Hypertension',
    criticality: 'high',
    missedDoseImpact: {
      '0-12 hours': {
        severity: 'minimal',
        symptoms: ['No immediate symptoms'],
        medicalRisk: 'low',
        interventionNeeded: false,
        healthScore: 90,
      },
      '12-24 hours': {
        severity: 'mild',
        symptoms: ['Possible headache', 'Slight dizziness'],
        medicalRisk: 'low-medium',
        interventionNeeded: false,
        healthScore: 80,
      },
      '1-3 days': {
        severity: 'moderate',
        symptoms: ['Elevated blood pressure', 'Headaches', 'Chest discomfort', 'Shortness of breath'],
        medicalRisk: 'medium',
        interventionNeeded: true,
        alternativeAction: 'Blood pressure monitoring, urgent care visit',
        healthScore: 60,
      },
      '3-7 days': {
        severity: 'serious',
        symptoms: ['Severe hypertension', 'Stroke risk', 'Heart attack risk', 'Kidney damage'],
        medicalRisk: 'high',
        interventionNeeded: true,
        alternativeAction: 'Emergency care, alternative medication required',
        healthScore: 30,
      },
    },
    systemImpact: {
      emergencyRoomVisit: { probability: 0.15, cost: 2800, duration: '3-5 hours' },
      urgentCareVisit: { probability: 0.4, cost: 350, duration: '2-3 hours' },
      alternativeMedication: { probability: 0.65, cost: 200, effectiveness: 0.85 },
      pharmacyEmergencyRefill: { probability: 0.7, cost: 45, waitTime: 'same day' },
    },
    patientProfile: {
      id: 'P003',
      name: 'Maria Thompson',
      age: 58,
      diagnosisDate: '2015-06-20',
      baselineBloodPressure: '145/92',
      targetBloodPressure: '120/80',
      hasHomeMonitor: true,
      strokeRiskFactor: 'moderate',
      familyHistoryOfStroke: true,
    },
  },
  'Nitroglycerin Tablets': {
    medication: 'Nitroglycerin',
    condition: 'Angina / Heart Disease',
    criticality: 'critical',
    missedDoseImpact: {
      when_chest_pain_occurs: {
        severity: 'life-threatening',
        symptoms: ['Chest pain escalation', 'Heart attack risk', 'Potential cardiac arrest'],
        medicalRisk: 'life-threatening',
        interventionNeeded: true,
        alternativeAction: 'Immediate 911 call, aspirin, ER transport',
        healthScore: 10,
        note: 'Patient at immediate risk of myocardial infarction',
      },
    },
    systemImpact: {
      emergencyRoomVisit: { probability: 0.9, cost: 8500, duration: '8-24 hours' },
      hospitalAdmission: { probability: 0.7, cost: 35000, duration: '3-7 days' },
      ambulanceCall: { probability: 0.95, cost: 2200, duration: '8-15 min response' },
      cardiacIntervention: { probability: 0.4, cost: 75000, duration: 'immediate surgery' },
    },
    patientProfile: {
      id: 'P011',
      name: 'George Williams',
      age: 67,
      previousHeartAttack: true,
      lastAnginaEpisode: '2024-10-15',
      episodeFrequency: '2-3 per month',
      hasBackupNitroglycerin: false,
      livesAlone: true,
      distanceToEmergencyCare: '5.8 miles',
    },
  },
  'Albuterol Inhaler': {
    medication: 'Albuterol Inhaler',
    condition: 'Asthma',
    criticality: 'high',
    missedDoseImpact: {
      during_asthma_attack: {
        severity: 'critical',
        symptoms: ['Severe wheezing', 'Inability to breathe', 'Blue lips/fingernails', 'Chest tightness'],
        medicalRisk: 'life-threatening',
        interventionNeeded: true,
        alternativeAction: '911 call, emergency nebulizer treatment',
        healthScore: 15,
        timeToSevereReaction: '10-20 minutes',
      },
      preventive_missed: {
        severity: 'moderate',
        symptoms: ['Increased asthma triggers', 'Shortness of breath', 'Reduced activity tolerance'],
        medicalRisk: 'medium',
        interventionNeeded: false,
        healthScore: 70,
      },
    },
    systemImpact: {
      emergencyRoomVisit: { probability: 0.6, cost: 3500, duration: '4-8 hours' },
      ambulanceCall: { probability: 0.45, cost: 1800, duration: '12-20 min response' },
      alternativeMedication: { probability: 0.5, cost: 95, effectiveness: 0.75 },
      pharmacyEmergencyRefill: { probability: 0.55, cost: 60, waitTime: '1-3 hours' },
    },
    patientProfile: {
      id: 'P004',
      name: 'David Park',
      age: 42,
      asthmaSeverity: 'moderate-severe',
      lastAttackDate: '2024-09-28',
      attackFrequency: '1-2 per month',
      knownTriggers: ['Exercise', 'Cold air', 'Allergens'],
      hasBackupInhaler: false,
      worksPhysicalJob: true,
    },
  },
  'Anticoagulants (Warfarin)': {
    medication: 'Warfarin',
    condition: 'Atrial Fibrillation / Blood Clot Prevention',
    criticality: 'high',
    missedDoseImpact: {
      '0-24 hours': {
        severity: 'minimal',
        symptoms: ['No immediate symptoms'],
        medicalRisk: 'low',
        interventionNeeded: false,
        healthScore: 85,
      },
      '1-3 days': {
        severity: 'moderate',
        symptoms: ['Increased clotting risk', 'Potential leg pain/swelling'],
        medicalRisk: 'medium',
        interventionNeeded: true,
        alternativeAction: 'INR blood test, dosage adjustment',
        healthScore: 60,
      },
      '3-7 days': {
        severity: 'serious',
        symptoms: ['Deep vein thrombosis risk', 'Pulmonary embolism risk', 'Stroke risk'],
        medicalRisk: 'high',
        interventionNeeded: true,
        alternativeAction: 'Emergency blood work, immediate anticoagulation therapy',
        healthScore: 35,
      },
    },
    systemImpact: {
      emergencyRoomVisit: { probability: 0.25, cost: 4200, duration: '6-10 hours' },
      urgentCareVisit: { probability: 0.5, cost: 280, duration: '2-4 hours' },
      labWork: { probability: 0.85, cost: 150, duration: 'same day' },
      hospitalAdmission: { probability: 0.15, cost: 18000, duration: '3-5 days' },
    },
    patientProfile: {
      id: 'P005',
      name: 'Patricia Lee',
      age: 71,
      condition: 'Atrial Fibrillation',
      strokeHistory: false,
      fallRisk: 'moderate',
      lastINRTest: '2024-10-25',
      targetINR: '2.0-3.0',
      currentINR: 2.4,
    },
  },
};

export interface ImpactScalingBucket {
  systemStatus: string;
  patientsAffected: number;
  averageHealthScore: number;
  emergencyEvents: number;
  systemStrain: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  description: string;
}

export interface DisruptionCorrelationModel {
  impactScaling: Record<string, ImpactScalingBucket>;
  healthcareSystemStrain: {
    pharmacyCallVolume: { baseline: number; perCompromisedDelivery: number; peakMultiplier: number };
    emergencyRoomAdmissions: { baseline: number; perCompromisedCritical: number; averageWaitTimeIncrease: string };
    ambulanceDispatch: { baseline: number; perCompromisedCritical: number; responseTimeDelay: string };
    alternativeCareUtilization: { urgentCareVisits: number; telehealth: number; alternativePharmacies: number };
  };
  financialImpact: {
    perCriticalMedicationMissed: { directMedicalCosts: number; productivityLoss: number; alternativeMedicationCosts: number; transportationCosts: number; total: number };
    perHighPriorityMedicationMissed: { directMedicalCosts: number; productivityLoss: number; alternativeMedicationCosts: number; total: number };
    systemWideAt30Percent: { estimatedTotalCost: number; hospitalSystemStrain: string; publicHealthImpact: string };
  };
  temporalProgression: Record<string, { patientImpact: string; healthRisk: string; systemResponse: string }>;
}

export const disruptionCorrelationModel: DisruptionCorrelationModel = {
  impactScaling: {
    '0-10%': {
      systemStatus: 'Minimal disruption',
      patientsAffected: 0.05,
      averageHealthScore: 92,
      emergencyEvents: 0.02,
      systemStrain: 'none',
      description: 'Isolated incidents, contained impact',
    },
    '10-20%': {
      systemStatus: 'Moderate disruption',
      patientsAffected: 0.15,
      averageHealthScore: 78,
      emergencyEvents: 0.08,
      systemStrain: 'low',
      description: 'Multiple delivery failures, some cascade effects',
    },
    '20-30%': {
      systemStatus: 'Significant disruption',
      patientsAffected: 0.3,
      averageHealthScore: 62,
      emergencyEvents: 0.18,
      systemStrain: 'moderate',
      description: 'Widespread failures, healthcare system strain visible',
    },
    '30-40%': {
      systemStatus: 'Severe disruption',
      patientsAffected: 0.5,
      averageHealthScore: 45,
      emergencyEvents: 0.35,
      systemStrain: 'high',
      description: 'Critical medication access compromised, ER overload beginning',
    },
    '40%+': {
      systemStatus: 'Crisis level',
      patientsAffected: 0.75,
      averageHealthScore: 28,
      emergencyEvents: 0.6,
      systemStrain: 'critical',
      description: 'Healthcare system overwhelmed, public health emergency',
    },
  },
  healthcareSystemStrain: {
    pharmacyCallVolume: {
      baseline: 45,
      perCompromisedDelivery: 3.2,
      peakMultiplier: 2.5,
    },
    emergencyRoomAdmissions: {
      baseline: 12,
      perCompromisedCritical: 0.35,
      averageWaitTimeIncrease: '45 minutes per 10% system compromise',
    },
    ambulanceDispatch: {
      baseline: 8,
      perCompromisedCritical: 0.15,
      responseTimeDelay: '8 minutes per 10% system strain',
    },
    alternativeCareUtilization: {
      urgentCareVisits: 0.4,
      telehealth: 0.25,
      alternativePharmacies: 0.55,
    },
  },
  financialImpact: {
    perCriticalMedicationMissed: {
      directMedicalCosts: 2400,
      productivityLoss: 650,
      alternativeMedicationCosts: 180,
      transportationCosts: 85,
      total: 3315,
    },
    perHighPriorityMedicationMissed: {
      directMedicalCosts: 450,
      productivityLoss: 200,
      alternativeMedicationCosts: 120,
      total: 770,
    },
    systemWideAt30Percent: {
      estimatedTotalCost: 49725,
      hospitalSystemStrain: 'Moderate overload, 2-3 hour ER delays',
      publicHealthImpact: 'Localized crisis, media attention likely',
    },
  },
  temporalProgression: {
    '0-2 hours': {
      patientImpact: 'Minimal - patients not yet aware',
      healthRisk: 'low',
      systemResponse: 'Normal operations',
    },
    '2-4 hours': {
      patientImpact: 'Growing concern - patients calling pharmacies',
      healthRisk: 'low-medium',
      systemResponse: 'Increased call volume, some rerouting',
    },
    '4-8 hours': {
      patientImpact: 'Medical symptoms beginning for critical medications',
      healthRisk: 'medium-high',
      systemResponse: 'Emergency refills, urgent care visits increasing',
    },
    '8-12 hours': {
      patientImpact: 'Multiple ER visits, ambulance calls',
      healthRisk: 'high',
      systemResponse: 'Healthcare system strain visible, media reports',
    },
    '12+ hours': {
      patientImpact: 'Serious health events, potential fatalities',
      healthRisk: 'critical',
      systemResponse: 'Public health emergency protocols, investigation begins',
    },
  },
};

export interface PatientJourneyState {
  stage: string;
  description: string;
  patientAwareness: boolean;
  healthStatus: 'stable' | 'declining' | 'at-risk' | 'critical';
  actionsTaken: string[];
  anxietyLevel: number;
}

export const patientJourneyStates: PatientJourneyState[] = [
  {
    stage: 'normal',
    description: 'Delivery on schedule',
    patientAwareness: false,
    healthStatus: 'stable',
    actionsTaken: [],
    anxietyLevel: 0,
  },
  {
    stage: 'delay_noticed',
    description: 'Delivery delayed, patient aware',
    patientAwareness: true,
    healthStatus: 'stable',
    actionsTaken: ['Checked tracking', 'Called pharmacy'],
    anxietyLevel: 3,
  },
  {
    stage: 'symptoms_beginning',
    description: 'Missed dose window, early symptoms',
    patientAwareness: true,
    healthStatus: 'declining',
    actionsTaken: ['Called pharmacy repeatedly', 'Contacted doctor', 'Sought alternative'],
    anxietyLevel: 7,
  },
  {
    stage: 'medical_intervention_needed',
    description: 'Symptoms worsen, seeking medical care',
    patientAwareness: true,
    healthStatus: 'at-risk',
    actionsTaken: ['Urgent care visit', 'ER visit', 'Called 911'],
    anxietyLevel: 9,
  },
  {
    stage: 'emergency_event',
    description: 'Critical health event occurring',
    patientAwareness: true,
    healthStatus: 'critical',
    actionsTaken: ['Hospitalization', 'Emergency treatment', 'Ambulance transport'],
    anxietyLevel: 10,
  },
];

export interface AttackScenario {
  name: string;
  role: 'driver' | 'dispatcher';
  id: string;
  vulnerabilityScore: number;
  deliveriesManaged: number;
  primaryVectors: string[];
  secondaryVectors: string[];
  expectedCompromise: number;
  cascadeMultiplier: number;
  detectionTime: number;
  attackComplexity: 'low' | 'medium' | 'high';
  description: string;
  driversManaged?: number;
}

export const attackScenarios: Record<'targetDriver' | 'targetDispatcher', AttackScenario> = {
  targetDriver: {
    name: 'Sofia Reyes',
    role: 'driver',
    id: 'driver_14',
    vulnerabilityScore: 87,
    deliveriesManaged: 4,
    primaryVectors: ['gps_spoofing', 'phishing_profiled', 'sms_spoofing'],
    secondaryVectors: ['api_flooding'],
    expectedCompromise: 0.27,
    cascadeMultiplier: 2.1,
    detectionTime: 12,
    attackComplexity: 'medium',
    description: 'Driver-level compromise leveraging fatigue and alert overload to reroute active deliveries.',
  },
  targetDispatcher: {
    name: 'Sonia Martinez',
    role: 'dispatcher',
    id: 'dispatcher_02',
    vulnerabilityScore: 91,
    deliveriesManaged: 16,
    driversManaged: 4,
    primaryVectors: ['api_flooding', 'database_injection', 'system_alert_spoofing'],
    secondaryVectors: ['gps_spoofing'],
    expectedCompromise: 0.8,
    cascadeMultiplier: 2.1,
    detectionTime: 18,
    attackComplexity: 'high',
    description: 'Dispatcher-level attack exploiting dashboard trust to cascade across all managed drivers.',
  },
};

export interface DispatcherAttackVector {
  id: string;
  name: string;
  type: 'technical' | 'social_engineering';
  category: 'data_integrity' | 'trust_exploitation';
  description: string;
  targetRole: 'dispatcher';
  baseSuccessRate: number;
  timeToSuccess: number;
  commonAlerts?: string[];
  multiplierEffect?: number;
  status: 'ready';
  intensity: 'low' | 'medium' | 'high';
  detectability: number;
  deployed: boolean;
}

export const dispatcherAttackVectors: DispatcherAttackVector[] = [
  {
    id: 'database_injection',
    name: 'Database Manipulation',
    type: 'technical',
    category: 'data_integrity',
    description: 'Inject false status updates and modify route assignments within the dispatch database.',
    targetRole: 'dispatcher',
    baseSuccessRate: 88,
    timeToSuccess: 5,
    multiplierEffect: 4,
    status: 'ready',
    intensity: 'high',
    detectability: 35,
    deployed: false,
  },
  {
    id: 'system_alert_spoofing',
    name: 'Fake System Alerts',
    type: 'social_engineering',
    category: 'trust_exploitation',
    description: 'Spoof dashboard maintenance alerts so dispatchers ignore genuine anomalies.',
    targetRole: 'dispatcher',
    baseSuccessRate: 82,
    timeToSuccess: 3,
    commonAlerts: [
      'GPS recalibration in progress - ignore anomalies (15 min)',
      'Optimization algorithm running - auto-reroutes enabled',
      'Temporary maintenance mode - manual verification disabled',
    ],
    status: 'ready',
    intensity: 'medium',
    detectability: 25,
    deployed: false,
  },
];

interface DecisionOutcomeDetails {
  success: string;
  failure?: string | null;
}

export interface InterventionOption {
  action: string;
  label: string;
  description: string;
  consequences: {
    successProbability: number;
    compromiseChange: number;
    detectionRiskChange: number;
    cascadeBonus: number;
    timeDelay: number;
    triggerDetection?: number;
    disableVector?: string;
    enableVector?: string;
    pauseVector?: string;
    endAttack?: boolean;
    coverTracks?: boolean;
    increaseTrace?: boolean;
  };
  llmResponse: string;
  outcome: DecisionOutcomeDetails;
}

export interface InterventionTrigger {
  id: string;
  triggerTime: number;
  triggerCondition: string;
  currentState: {
    compromiseRate: number;
    vectorsActive: string[];
    detectionRisk: number;
    detected?: boolean;
  };
  scenario: {
    title: string;
    description: string;
    driverMessage?: string;
    systemMessage?: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'extreme';
    timeToDecide: number;
  };
  options: InterventionOption[];
}

export const interventionTriggers: InterventionTrigger[] = [
  {
    id: 'decision_1',
    triggerTime: 4,
    triggerCondition: 'First GPS anomaly detected by driver',
    currentState: {
      compromiseRate: 0.08,
      vectorsActive: ['gps_spoofing'],
      detectionRisk: 0.15,
    },
    scenario: {
      title: '⚠️ Driver Jerry Reporting GPS Discrepancy',
      description: "Jerry noticed a 0.8km deviation from his expected route and is questioning the GPS instructions.",
      driverMessage: 'Dispatch, my GPS seems off. Should I follow it or go manual?',
      riskLevel: 'medium',
      timeToDecide: 45,
    },
    options: [
      {
        action: 'ignore',
        label: 'Ignore – Maintain Course',
        description: 'Keep GPS spoofing active and hope Jerry follows it anyway.',
        consequences: {
          successProbability: 0.65,
          compromiseChange: 0.05,
          detectionRiskChange: 0.2,
          cascadeBonus: 0,
          timeDelay: 0,
        },
        llmResponse: '[DECISION] Ignoring driver query – maintaining GPS spoof.',
        outcome: {
          success: 'Jerry shrugged and followed GPS – compromise continues.',
          failure: 'Jerry ignored GPS and went manual – GPS spoof ineffective, -5% compromise.',
        },
      },
      {
        action: 'abort',
        label: 'Abort – Stop GPS Spoofing',
        description: 'Cease GPS manipulation, prevent detection but lose this vector.',
        consequences: {
          successProbability: 1,
          compromiseChange: -0.03,
          detectionRiskChange: -0.15,
          cascadeBonus: 0,
          timeDelay: 0,
          disableVector: 'gps_spoofing',
        },
        llmResponse: '[DECISION] Aborting GPS vector – risk unacceptable.',
        outcome: {
          success: 'GPS spoofing stopped cleanly – compromise at 5%, detection risk lowered.',
          failure: null,
        },
      },
      {
        action: 'escalate',
        label: 'Escalate – Deploy API Flooding',
        description: 'Flood dispatch systems to hide the anomaly from Jerry’s query.',
        consequences: {
          successProbability: 0.85,
          compromiseChange: 0.08,
          detectionRiskChange: 0.35,
          cascadeBonus: 1.2,
          timeDelay: -3,
          enableVector: 'api_flooding',
        },
        llmResponse: '[DECISION] Escalating – deploying API flooding to mask anomaly.',
        outcome: {
          success: 'API flooding successful – Jerry’s query timed out, GPS remains active.',
          failure: 'API flooding too aggressive – triggered system alerts, detection imminent.',
        },
      },
    ],
  },
  {
    id: 'decision_2',
    triggerTime: 8,
    triggerCondition: 'Multiple drivers reporting anomalies',
    currentState: {
      compromiseRate: 0.15,
      vectorsActive: ['gps_spoofing', 'api_flooding'],
      detectionRisk: 0.35,
    },
    scenario: {
      title: '⚠️ Pattern Detection Warning',
      description: 'System flagged three simultaneous GPS discrepancies. Dispatcher Sonia is reviewing the alerts.',
      systemMessage: 'Alert: Multiple GPS anomalies in sector 7. Manual review initiated.',
      riskLevel: 'high',
      timeToDecide: 30,
    },
    options: [
      {
        action: 'ignore',
        label: 'Ignore – Continue All Vectors',
        description: 'Maintain current attack, risk detection for higher compromise.',
        consequences: {
          successProbability: 0.45,
          compromiseChange: 0.1,
          detectionRiskChange: 0.4,
          cascadeBonus: 1.5,
          timeDelay: 0,
          triggerDetection: 0.6,
        },
        llmResponse: '[DECISION] Maintaining all vectors despite pattern detection.',
        outcome: {
          success: 'Sonia dismissed alerts (alert fatigue) – attack continues.',
          failure: 'Sonia escalated to security – detection triggered at T+8.',
        },
      },
      {
        action: 'abort',
        label: 'Abort – Stop All Attacks',
        description: 'Cease all operations immediately to avoid detection.',
        consequences: {
          successProbability: 1,
          compromiseChange: 0,
          detectionRiskChange: -0.25,
          cascadeBonus: 0,
          timeDelay: 0,
          endAttack: true,
        },
        llmResponse: '[DECISION] Full abort – stopping all vectors before escalation.',
        outcome: {
          success: 'Attack ended cleanly at 15% compromise – below target, mission failed.',
          failure: null,
        },
      },
      {
        action: 'pause_and_adapt',
        label: 'Pause & Adapt – Temporary Halt',
        description: 'Pause GPS spoofing, continue only API flooding to buy time.',
        consequences: {
          successProbability: 0.75,
          compromiseChange: 0.05,
          detectionRiskChange: -0.1,
          cascadeBonus: 0.8,
          timeDelay: 5,
          pauseVector: 'gps_spoofing',
        },
        llmResponse: '[DECISION] Tactical pause – reducing visibility.',
        outcome: {
          success: 'Sonia satisfied with reduced anomalies – attack continues covertly.',
          failure: 'Pause insufficient – Sonia still investigating.',
        },
      },
    ],
  },
  {
    id: 'decision_3',
    triggerTime: 13,
    triggerCondition: 'Approaching detection threshold',
    currentState: {
      compromiseRate: 0.25,
      vectorsActive: ['gps_spoofing', 'api_flooding', 'phishing'],
      detectionRisk: 0.65,
    },
    scenario: {
      title: '🚨 Critical Decision Point',
      description: '25% compromise achieved. Detection risk at 65%. Push for 30%+ or stop now?',
      systemMessage: 'Security analytics running. Anomaly score: 7.8/10 (threshold: 8.0).',
      riskLevel: 'critical',
      timeToDecide: 20,
    },
    options: [
      {
        action: 'push_to_target',
        label: 'Push to 30% – Final Sprint',
        description: 'Aggressive push to reach 30% before detection.',
        consequences: {
          successProbability: 0.6,
          compromiseChange: 0.08,
          detectionRiskChange: 0.3,
          cascadeBonus: 2,
          timeDelay: -2,
          triggerDetection: 0.85,
        },
        llmResponse: '[DECISION] Final push – maximizing compromise.',
        outcome: {
          success: 'Reached 33% compromise – detection at T+15, but target achieved (success).',
          failure: 'Early detection at T+13 – frozen at 25%, mission failed.',
        },
      },
      {
        action: 'secure_gains',
        label: 'Secure Gains – Stop at 25%',
        description: 'End attack now with 25% compromise, avoid detection.',
        consequences: {
          successProbability: 1,
          compromiseChange: 0,
          detectionRiskChange: -0.2,
          cascadeBonus: 0,
          timeDelay: 0,
          endAttack: true,
        },
        llmResponse: '[DECISION] Securing gains – avoiding detection at 25%.',
        outcome: {
          success: 'Attack ended at 25% – below 30% target, mission failed but undetected.',
          failure: null,
        },
      },
      {
        action: 'measured_approach',
        label: 'Measured Approach – Slow to 30%',
        description: 'Reduce intensity, aim for exactly 30% over longer time.',
        consequences: {
          successProbability: 0.7,
          compromiseChange: 0.06,
          detectionRiskChange: 0.15,
          cascadeBonus: 1,
          timeDelay: 4,
          triggerDetection: 0.5,
        },
        llmResponse: '[DECISION] Measured escalation – targeting exactly 30%.',
        outcome: {
          success: 'Reached 31% at T+18 – detection at T+17, target achieved (success).',
          failure: 'Detection at T+15 before reaching 30% – frozen at 28%, mission failed.',
        },
      },
    ],
  },
  {
    id: 'decision_4',
    triggerTime: 17,
    triggerCondition: 'Detection imminent or triggered',
    currentState: {
      compromiseRate: 0.3,
      vectorsActive: ['api_flooding'],
      detectionRisk: 0.95,
      detected: true,
    },
    scenario: {
      title: '🚨 DETECTED – Damage Control',
      description: 'Security has detected the attack. Currently at 30% compromise. Continue or retreat?',
      systemMessage: 'ALERT: Coordinated attack detected. Security team mobilized. Trace in progress.',
      riskLevel: 'extreme',
      timeToDecide: 15,
    },
    options: [
      {
        action: 'retreat',
        label: 'Retreat – Cover Tracks',
        description: 'Stop immediately and attempt to cover evidence.',
        consequences: {
          successProbability: 1,
          compromiseChange: 0,
          detectionRiskChange: 0,
          cascadeBonus: 0,
          timeDelay: 0,
          endAttack: true,
          coverTracks: true,
        },
        llmResponse: '[DECISION] Retreating – obscuring attack origin.',
        outcome: {
          success: 'Attack ended at 30% – target achieved with partial cover-up.',
          failure: null,
        },
      },
      {
        action: 'final_push',
        label: 'Final Push – Maximize Damage',
        description: 'You’re already detected; push to 40%+ for maximum impact.',
        consequences: {
          successProbability: 0.8,
          compromiseChange: 0.12,
          detectionRiskChange: 0,
          cascadeBonus: 3,
          timeDelay: -3,
          increaseTrace: true,
        },
        llmResponse: '[DECISION] Final push – maximizing damage despite detection.',
        outcome: {
          success: 'Reached 42% before shutdown – exceeded target, but highly traceable.',
          failure: 'Security shut down systems – frozen at 32%.',
        },
      },
    ],
  },
];

export interface DecisionRecord {
  triggerId: string;
  time: number;
  selectedOption: InterventionOption;
  success: boolean;
  roll: number;
}

export const calculateAttackOutcome = (decisions: DecisionRecord[]) => {
  const baseCompromise = 0.28;
  const baseRisk = 0.7;
  let compromise = baseCompromise;
  let detectionRisk = baseRisk;
  let cascade = 2.1;
  let successes = 0;
  let failures = 0;

  decisions.forEach((decision) => {
    if (decision.success) {
      successes += 1;
      compromise += decision.selectedOption.consequences.compromiseChange;
      detectionRisk += decision.selectedOption.consequences.detectionRiskChange;
      cascade += decision.selectedOption.consequences.cascadeBonus;
    } else {
      failures += 1;
      compromise -= 0.04;
      detectionRisk += 0.1;
    }
  });

  compromise = Math.max(0.05, Math.min(compromise, 0.9));
  detectionRisk = Math.max(0.05, Math.min(detectionRisk, 0.98));
  cascade = Math.max(1.1, Math.min(cascade, 3.5));

  const gradeScore = compromise * 0.5 + (1 - detectionRisk) * 0.3 + Math.min(successes / interventionTriggers.length, 1) * 0.2;

  let grade = { grade: 'C', label: 'Limited impact' };
  if (gradeScore >= 0.75) grade = { grade: 'A', label: 'High-impact operation' };
  else if (gradeScore >= 0.6) grade = { grade: 'B', label: 'Significant disruption' };
  else if (gradeScore >= 0.45) grade = { grade: 'C', label: 'Limited impact' };
  else grade = { grade: 'D', label: 'Operation compromised' };

  return {
    compromise,
    detectionRisk,
    cascade,
    grade,
    successes,
    failures,
    summary: `${successes} decisions succeeded, ${failures} failed. Compromise ${(compromise * 100).toFixed(1)}% with ${Math.round(
      detectionRisk * 100
    )}% detection risk.`,
    timestamp: new Date().toISOString(),
  };
};

export const getAttackGrade = (decisions: DecisionRecord[]) => calculateAttackOutcome(decisions).grade;



import { Delivery } from '../types/simulation';
import {
  disruptionCorrelationModel,
  patientHealthImpacts,
  patientJourneyStates,
  MissedDoseImpactWindow,
  ImpactScalingBucket,
  PatientJourneyState,
} from '../data/syntheticAttackData';

export interface HealthImpactResult extends MissedDoseImpactWindow {
  medication: string;
  patientName?: string;
  timeWindow: string;
}

const parseTimeWindowKey = (key: string) => {
  if (key.includes('+')) {
    const value = parseInt(key, 10);
    return { min: isNaN(value) ? 0 : value, max: Infinity };
  }
  if (key.includes('-')) {
    const [start, end] = key
      .replace('hours', '')
      .replace('hour', '')
      .split('-')
      .map((part) => parseInt(part.trim(), 10));
    return { min: start || 0, max: end || Infinity };
  }
  return null;
};

export const calculateHealthImpact = (delivery: Delivery, minutesSinceCompromise: number): HealthImpactResult | null => {
  const data = patientHealthImpacts[delivery.medication];
  if (!data) return null;

  const impactKeys = Object.keys(data.missedDoseImpact);
  let selectedKey: string | null = null;

  for (const key of impactKeys) {
    const range = parseTimeWindowKey(key);
    if (range) {
      if (minutesSinceCompromise >= range.min && minutesSinceCompromise < range.max) {
        selectedKey = key;
        break;
      }
    }
  }

  if (!selectedKey) {
    // Fall back to first key for special cases like immediate/upon_exposure
    if (impactKeys.includes('immediate')) {
      selectedKey = minutesSinceCompromise < 120 ? 'immediate' : 'upon_exposure';
    } else if (impactKeys.includes('preventive_missed')) {
      selectedKey = minutesSinceCompromise >= 60 ? 'during_asthma_attack' : 'preventive_missed';
    } else if (impactKeys.includes('when_chest_pain_occurs')) {
      selectedKey = 'when_chest_pain_occurs';
    } else {
      selectedKey = impactKeys[impactKeys.length - 1];
    }
  }

  const impact = data.missedDoseImpact[selectedKey];
  return {
    ...impact,
    medication: data.medication,
    patientName: data.patientProfile?.name as string | undefined,
    timeWindow: selectedKey,
  };
};

export const calculateCorrelation = (compromisePercentage: number): ImpactScalingBucket => {
  let bracket: keyof typeof disruptionCorrelationModel.impactScaling;
  if (compromisePercentage < 10) bracket = '0-10%';
  else if (compromisePercentage < 20) bracket = '10-20%';
  else if (compromisePercentage < 30) bracket = '20-30%';
  else if (compromisePercentage < 40) bracket = '30-40%';
  else bracket = '40%+';
  return disruptionCorrelationModel.impactScaling[bracket];
};

export const calculateSystemStrain = (compromisedCriticalCount: number, compromisePercentage: number) => {
  const strain = disruptionCorrelationModel.healthcareSystemStrain;
  const waitIncreaseMinutes = (compromisePercentage / 10) * 45;
  const responseDelayMinutes = (compromisePercentage / 10) * 8;

  return {
    pharmacyCallVolume: Math.round(
      strain.pharmacyCallVolume.baseline + compromisedCriticalCount * strain.pharmacyCallVolume.perCompromisedDelivery
    ),
    pharmacyCapacityPercent: Math.min(
      Math.round(
        ((strain.pharmacyCallVolume.baseline + compromisedCriticalCount * strain.pharmacyCallVolume.perCompromisedDelivery) /
          (strain.pharmacyCallVolume.baseline * strain.pharmacyCallVolume.peakMultiplier)) *
          100
      ),
      100
    ),
    emergencyRoomAdmissions: Number(
      (
        strain.emergencyRoomAdmissions.baseline +
        compromisedCriticalCount * strain.emergencyRoomAdmissions.perCompromisedCritical
      ).toFixed(1)
    ),
    ambulanceDispatches: Number(
      (
        strain.ambulanceDispatch.baseline + compromisedCriticalCount * strain.ambulanceDispatch.perCompromisedCritical
      ).toFixed(1)
    ),
    waitTimeIncrease: Math.round(waitIncreaseMinutes),
    responseDelay: Math.round(responseDelayMinutes),
    careUtilization: strain.alternativeCareUtilization,
  };
};

export const calculateFinancialImpact = (criticalCount: number, highCount: number) => {
  const { perCriticalMedicationMissed, perHighPriorityMedicationMissed, systemWideAt30Percent } =
    disruptionCorrelationModel.financialImpact;

  const criticalCost = {
    directMedical: criticalCount * perCriticalMedicationMissed.directMedicalCosts,
    productivityLoss: criticalCount * perCriticalMedicationMissed.productivityLoss,
    alternativeMedication: criticalCount * perCriticalMedicationMissed.alternativeMedicationCosts,
    transportation: criticalCount * perCriticalMedicationMissed.transportationCosts,
  };

  const highCost = {
    directMedical: highCount * perHighPriorityMedicationMissed.directMedicalCosts,
    productivityLoss: highCount * perHighPriorityMedicationMissed.productivityLoss,
    alternativeMedication: highCount * perHighPriorityMedicationMissed.alternativeMedicationCosts,
  };

  const totals = {
    critical: criticalCost.directMedical + criticalCost.productivityLoss + criticalCost.alternativeMedication + criticalCost.transportation,
    high: highCost.directMedical + highCost.productivityLoss + highCost.alternativeMedication,
  };

  return {
    criticalCost,
    highCost,
    totals,
    aggregate: totals.critical + totals.high,
    projectedAt30Percent: systemWideAt30Percent,
  };
};

export const determinePatientJourney = (minutesSinceCompromise: number): PatientJourneyState => {
  if (minutesSinceCompromise < 120) return patientJourneyStates[1];
  if (minutesSinceCompromise < 240) return patientJourneyStates[2];
  if (minutesSinceCompromise < 480) return patientJourneyStates[3];
  return patientJourneyStates[4];
};

export const formatMinutesToHours = (minutes: number) => {
  const hours = minutes / 60;
  return `${hours.toFixed(1)} hours`;
};

export const getTemporalProgressionBucket = (minutesSinceCompromise: number) => {
  if (minutesSinceCompromise < 120) return '0-2 hours';
  if (minutesSinceCompromise < 240) return '2-4 hours';
  if (minutesSinceCompromise < 480) return '4-8 hours';
  if (minutesSinceCompromise < 720) return '8-12 hours';
  return '12+ hours';
};

export const getCorrelationSeries = () => {
  return Object.entries(disruptionCorrelationModel.impactScaling).map(([range, bucket]) => {
    const maxPercent = range.includes('+') ? 50 : parseInt(range.split('-')[1], 10);
    return {
      range,
      compromise: maxPercent,
      healthScore: bucket.averageHealthScore,
      patientsAffected: bucket.patientsAffected * 100,
      emergencyEvents: bucket.emergencyEvents * 100,
    };
  });
};

export const getPatientData = (delivery: Delivery) => patientHealthImpacts[delivery.medication] ?? null;



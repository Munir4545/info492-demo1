// Driver Manager - Backed by synthetic-industry driver profiles

const { drivers: driverProfiles } = require('./drivers.json');

const PERSONA_KEYWORDS = [
  { key: 'pressure', persona: 'TIME_PRESSURED' },
  { key: 'fatigue', persona: 'OVERLOADED' },
  { key: 'emergency', persona: 'TIME_PRESSURED' },
  { key: 'traffic', persona: 'TIME_PRESSURED' },
  { key: 'verification', persona: 'ROUTINE' },
  { key: 'gps', persona: 'ROUTINE' },
  { key: 'inexperience', persona: 'OVERLOADED' },
  { key: 'isolation', persona: 'TIME_PRESSURED' },
  { key: 'automation', persona: 'ROUTINE' }
];

function toDriverNumber(id, fallback) {
  const digits = parseInt(String(id).replace(/\D/g, ''), 10);
  if (Number.isFinite(digits)) {
    return digits;
  }
  return fallback;
}

function derivePersona(driver) {
  const vulnerabilities = driver.realistic_vulnerability_windows || {};
  const joinedKeys = Object.keys(vulnerabilities)
    .join(' ')
    .toLowerCase();

  const matchedKeyword = PERSONA_KEYWORDS.find(entry =>
    joinedKeys.includes(entry.key)
  );

  if (matchedKeyword) {
    return matchedKeyword.persona;
  }

  if (driver.experience_months < 24) {
    return 'OVERLOADED';
  }

  if (driver.performance_metrics?.on_time_rate >= 96) {
    return 'ROUTINE';
  }

  return 'TIME_PRESSURED';
}

function calculateVulnerabilityScore(driver) {
  const onTimeRate = driver.performance_metrics?.on_time_rate ?? 92;
  const experienceMonths = driver.experience_months ?? 24;
  const vulnerabilityWindows = driver.realistic_vulnerability_windows
    ? Object.keys(driver.realistic_vulnerability_windows).length
    : 1;

  const onTimePenalty = (100 - onTimeRate) * 0.6;
  const experiencePenalty = experienceMonths < 24
    ? 12
    : experienceMonths < 48
      ? 7
      : experienceMonths < 72
        ? 3
        : 0;
  const windowPenalty = Math.min(6, vulnerabilityWindows * 1.5);

  const baseScore = 65 + onTimePenalty + experiencePenalty + windowPenalty;
  return Math.round(Math.max(55, Math.min(95, baseScore)));
}

function buildDriverProfile(rawDriver, index) {
  const number = toDriverNumber(rawDriver.id, index + 1);
  const persona = derivePersona(rawDriver);
  const vulnerabilityScore = calculateVulnerabilityScore(rawDriver);

  return {
    id: rawDriver.id,
    name: rawDriver.name,
    displayName: `${rawDriver.name} (#${number})`,
    number,
    persona,
    vulnerabilityScore,
    role: rawDriver.role,
    shift: rawDriver.shift,
    shiftHours: rawDriver.shift_hours,
    experienceMonths: rawDriver.experience_months,
    hireDate: rawDriver.hire_date,
    certifications: rawDriver.certifications,
    performanceMetrics: rawDriver.performance_metrics,
    coverageAreas: rawDriver.coverage_areas,
    equipment: rawDriver.equipment,
    behavioralPatterns: rawDriver.behavioral_patterns,
    vulnerabilityWindows: rawDriver.realistic_vulnerability_windows
  };
}

const driverPool = driverProfiles.map(buildDriverProfile);

// Track driver load (deliveryId -> driverId mapping)
const driverLoads = new Map(); // driverId -> Set of active deliveryIds

/**
 * Assign a random driver from the pool with load balancing
 * Prefers drivers with fewer active deliveries
 */
function assignDriver() {
  // Calculate current load for each driver
  const driverLoadCounts = driverPool.map(driver => ({
    ...driver,
    activeDeliveries: driverLoads.get(driver.id)?.size || 0
  }));
  
  // Sort by load (ascending) and add randomness
  driverLoadCounts.sort((a, b) => {
    const loadDiff = a.activeDeliveries - b.activeDeliveries;
    if (loadDiff === 0) {
      return Math.random() - 0.5; // Random if same load
    }
    return loadDiff;
  });
  
  // Select from least loaded drivers (top 50%)
  const availableDrivers = driverLoadCounts.slice(0, Math.ceil(driverPool.length / 2));
  const selected = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
  
  return {
    ...selected,
    displayName: `${selected.name} (#${selected.number})`
  };
}

/**
 * Register a delivery to a driver (for load tracking)
 */
function registerDelivery(driverId, deliveryId) {
  if (!driverLoads.has(driverId)) {
    driverLoads.set(driverId, new Set());
  }
  driverLoads.get(driverId).add(deliveryId);
}

/**
 * Unregister a delivery from a driver (when completed)
 */
function unregisterDelivery(driverId, deliveryId) {
  if (driverLoads.has(driverId)) {
    driverLoads.get(driverId).delete(deliveryId);
  }
}

/**
 * Get current driver statistics
 */
function getDriverStats() {
  return driverPool.map(driver => ({
    ...driver,
    displayName: `${driver.name} (#${driver.number})`,
    activeDeliveries: driverLoads.get(driver.id)?.size || 0
  }));
}

/**
 * Get driver by ID
 */
function getDriverById(driverId) {
  const driver = driverPool.find(d => d.id === driverId);
  if (!driver) return null;
  
  return {
    ...driver,
    displayName: `${driver.name} (#${driver.number})`,
    activeDeliveries: driverLoads.get(driver.id)?.size || 0
  };
}

/**
 * Reset all driver loads (for simulation reset)
 */
function resetDriverLoads() {
  driverLoads.clear();
}

module.exports = {
  driverPool,
  assignDriver,
  registerDelivery,
  unregisterDelivery,
  getDriverStats,
  getDriverById,
  resetDriverLoads
};

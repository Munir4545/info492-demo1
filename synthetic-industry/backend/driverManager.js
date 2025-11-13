// Driver Manager - Matching pharma-attack-sim driver profiles

const driverPool = [
  { id: 'driver_7', name: 'Jerry', number: 7, persona: 'TIME_PRESSURED', vulnerabilityScore: 92 },
  { id: 'driver_14', name: 'Sofia', number: 14, persona: 'OVERLOADED', vulnerabilityScore: 87 },
  { id: 'driver_3', name: 'Marcus', number: 3, persona: 'ROUTINE', vulnerabilityScore: 74 },
  { id: 'driver_11', name: 'Priya', number: 11, persona: 'TIME_PRESSURED', vulnerabilityScore: 85 },
  { id: 'driver_21', name: 'Noah', number: 21, persona: 'ROUTINE', vulnerabilityScore: 70 },
  { id: 'driver_18', name: 'Lena', number: 18, persona: 'OVERLOADED', vulnerabilityScore: 82 },
  { id: 'driver_5', name: 'Maya', number: 5, persona: 'TIME_PRESSURED', vulnerabilityScore: 79 },
  { id: 'driver_9', name: 'Elliot', number: 9, persona: 'ROUTINE', vulnerabilityScore: 76 },
  { id: 'driver_12', name: 'Samir', number: 12, persona: 'OVERLOADED', vulnerabilityScore: 84 },
  { id: 'driver_2', name: 'Kira', number: 2, persona: 'TIME_PRESSURED', vulnerabilityScore: 88 },
  { id: 'driver_16', name: 'Riley', number: 16, persona: 'ROUTINE', vulnerabilityScore: 72 },
  { id: 'driver_4', name: 'Adrian', number: 4, persona: 'OVERLOADED', vulnerabilityScore: 81 }
];

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
    id: selected.id,
    name: selected.name,
    displayName: `${selected.name} (#${selected.number})`,
    number: selected.number,
    persona: selected.persona,
    vulnerabilityScore: selected.vulnerabilityScore
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

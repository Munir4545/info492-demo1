// Dispatcher Manager - Handles dispatcher assignments for routes

const { dispatchers: dispatcherProfiles } = require('./dispatchers.json');

const DEFAULT_COMPANY = 'Synthetic Industry Dispatch Operations';
const DEFAULT_CONTACT = '+1-206-555-0100';

function buildEmployeeId(profile, index) {
  const numeric = profile.id?.split('-')[1];
  if (numeric) {
    return `SYN-DSP-${numeric}`;
  }
  return `SYN-DSP-${2000 + index + 1}`;
}

function toUsername(name = '') {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function deriveClearanceLevel(profile) {
  if (profile.role?.toLowerCase().includes('senior') || profile.role?.toLowerCase().includes('automated')) {
    return 'critical';
  }

  if (profile.certifications?.emergency_response_trained) {
    return 'high';
  }

  return 'medium';
}

function determineBaseLocation(profile) {
  if (profile.id === 'DSP-2003') {
    return 'Remote Automation Core';
  }

  const primaryArea = profile.supervision_scope?.coverage_areas?.[0];
  if (primaryArea) {
    return `${primaryArea} Dispatch Desk`;
  }
  return 'Seattle Dispatch HQ';
}

function normalizeShiftHours(profile) {
  return profile.shift_hours || '06:00-14:00';
}

function buildContactNumber(profile, index) {
  const suffix = String(2000 + index + 1).slice(-4);
  if (profile.id === 'DSP-2003') {
    return '+1-206-555-0999';
  }
  return `+1-206-555-${suffix}`;
}

function buildDispatcherProfile(profile, index) {
  return {
    id: profile.id,
    name: profile.name,
    displayName: `${profile.name} (${profile.role})`,
    role: profile.role,
    employeeId: buildEmployeeId(profile, index),
    company: DEFAULT_COMPANY,
    credentials: {
      role: profile.role,
      username: toUsername(profile.name),
      clearanceLevel: deriveClearanceLevel(profile)
    },
    baseLocation: determineBaseLocation(profile),
    contactNumber: buildContactNumber(profile, index) || DEFAULT_CONTACT,
    shift: profile.shift,
    shiftHours: normalizeShiftHours(profile),
    experienceMonths: profile.experience_months,
    hireDate: profile.hire_date,
    certifications: profile.certifications,
    performanceMetrics: profile.performance_metrics,
    supervisionScope: profile.supervision_scope,
    equipment: profile.equipment,
    behavioralPatterns: profile.behavioral_patterns,
    vulnerabilityWindows: profile.realistic_vulnerability_windows
  };
}

const dispatchers = dispatcherProfiles.map(buildDispatcherProfile);

function getLastShiftStart(dispatcher) {
  const shiftHours = dispatcher.shiftHours || '06:00-14:00';
  const [start] = shiftHours.split('-');
  const [hour, minute] = start.split(':').map(Number);
  const now = new Date();
  const shiftStart = new Date(now);
  shiftStart.setHours(hour || 6, minute || 0, 0, 0);

  if (shiftStart > now) {
    shiftStart.setDate(shiftStart.getDate() - 1);
  }

  return shiftStart.toISOString();
}

function assignDispatcher() {
  const dispatcher = dispatchers[Math.floor(Math.random() * dispatchers.length)];

  const avgDeliveries = dispatcher.performanceMetrics?.avg_deliveries_coordinated_per_shift ?? 60;
  const assignedOrders = Math.max(
    10,
    Math.round(avgDeliveries * (0.85 + Math.random() * 0.35))
  );

  const supervisedDrivers = dispatcher.supervisionScope?.drivers_supervised?.length ?? 4;
  const assignedDrivers = Math.max(
    1,
    Math.round(supervisedDrivers * (0.9 + Math.random() * 0.3))
  );

  return {
    ...dispatcher,
    assignedOrders,
    assignedDrivers,
    lastShiftStartedAt: getLastShiftStart(dispatcher)
  };
}

module.exports = {
  assignDispatcher,
  dispatchers
};


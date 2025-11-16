// Dispatcher Manager - Handles dispatcher assignments for routes

const dispatchers = [
  {
    id: 'DSP-101',
    name: 'Samantha Lee',
    displayName: 'Dispatcher Samantha Lee',
    employeeId: 'PLNW-447',
    company: 'Pharma Logistics Northwest',
    credentials: {
      role: 'Senior Route Dispatcher',
      username: 'slee',
      clearanceLevel: 'high'
    },
    baseLocation: 'Seattle HQ',
    contactNumber: '+1-206-555-0147'
  },
  {
    id: 'DSP-205',
    name: 'Miguel Alvarez',
    displayName: 'Dispatcher Miguel Alvarez',
    employeeId: 'PLNW-552',
    company: 'Cascade Medical Supply Chain',
    credentials: {
      role: 'Operations Coordinator',
      username: 'malvarez',
      clearanceLevel: 'medium'
    },
    baseLocation: 'Bellevue Ops Center',
    contactNumber: '+1-425-555-0289'
  },
  {
    id: 'DSP-314',
    name: 'Priya Natarajan',
    displayName: 'Dispatcher Priya Natarajan',
    employeeId: 'PLNW-603',
    company: 'Evergreen Pharma Logistics',
    credentials: {
      role: 'Night Shift Supervisor',
      username: 'pnatarajan',
      clearanceLevel: 'high'
    },
    baseLocation: 'Redmond Control Hub',
    contactNumber: '+1-425-555-0194'
  },
  {
    id: 'DSP-420',
    name: 'Marcus Johnson',
    displayName: 'Dispatcher Marcus Johnson',
    employeeId: 'PLNW-671',
    company: 'SoundCare Distribution',
    credentials: {
      role: 'Route Dispatcher',
      username: 'mjohnson',
      clearanceLevel: 'medium'
    },
    baseLocation: 'Tacoma Dispatch Center',
    contactNumber: '+1-253-555-0102'
  },
  {
    id: 'DSP-537',
    name: 'Linh Tran',
    displayName: 'Dispatcher Linh Tran',
    employeeId: 'PLNW-734',
    company: 'Columbia Valley Logistics',
    credentials: {
      role: 'Logistics Planner',
      username: 'ltran',
      clearanceLevel: 'critical'
    },
    baseLocation: 'Vancouver Logistics Hub',
    contactNumber: '+1-360-555-0228'
  }
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function assignDispatcher() {
  const dispatcher = dispatchers[Math.floor(Math.random() * dispatchers.length)];

  const activeOrders = randomInt(8, 24);
  const activeDrivers = randomInt(2, 7);

  return {
    ...dispatcher,
    assignedOrders: activeOrders,
    assignedDrivers: activeDrivers,
    lastShiftStartedAt: new Date(Date.now() - randomInt(30, 180) * 60000).toISOString()
  };
}

module.exports = {
  assignDispatcher
};


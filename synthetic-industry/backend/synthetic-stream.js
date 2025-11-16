// Synthetic Stream - Single driver with multiple deliveries model

const {
  generateRouteManifest,
  calculateCurrentDelivery,
  calculateCurrentLocation
} = require('./routeGenerator');
const { getDriverStats } = require('./driverManager');

// Connected SSE clients
let streamClients = [];

// Simulation state - ONE route with ONE driver and MULTIPLE deliveries
let simulationState = {
  running: false,
  startTime: null,
  endTime: null,
  routeManifest: null, // Single route with driver and all deliveries
  currentDeliveryIndex: 0,
  completedDeliveries: [],
  eventCount: 0,
  dispatcher: null
};

// Interval references
let progressInterval = null;
let dispatcherInterval = null;

/**
 * Broadcast event to all connected SSE clients
 */
function broadcastEvent(event) {
  simulationState.eventCount++;
  
  const message = `data: ${JSON.stringify({
    ...event,
    timestamp: new Date().toISOString(),
    eventId: simulationState.eventCount
  })}\n\n`;
  
  streamClients.forEach(client => {
    try {
      client.res.write(message);
    } catch (err) {
      console.error('Error broadcasting to client:', err);
    }
  });
}

/**
 * Update route progress - check delivery status and location
 */
function updateRouteProgress() {
  if (!simulationState.running || !simulationState.routeManifest) return;
  
  const now = new Date();
  const manifest = simulationState.routeManifest;
  
  // Check if simulation should end (route completed or time expired)
  if (now >= simulationState.endTime || simulationState.currentDeliveryIndex >= manifest.deliveries.length) {
    if (simulationState.currentDeliveryIndex >= manifest.deliveries.length) {
      // All deliveries completed
      broadcastEvent({
        type: 'route_completed',
        data: {
          routeId: manifest.routeId,
          driver: manifest.driver.displayName,
          totalDeliveries: manifest.totalDeliveries,
          completedDeliveries: simulationState.completedDeliveries.length,
          duration: Math.round((now.getTime() - new Date(manifest.startTime).getTime()) / 60000)
        }
      });
    }
    stopSimulation();
    return;
  }
  
  const currentIndex = simulationState.currentDeliveryIndex;
  const currentDelivery = manifest.deliveries[currentIndex];
  
  // Check for delivery status transitions
  const pickupTime = new Date(currentDelivery.estimatedPickup);
  const dropoffTime = new Date(currentDelivery.estimatedDropoff);
  
  if (currentDelivery.status === 'planned' && now >= pickupTime) {
    // Driver approaching this delivery location
    currentDelivery.status = 'en_route';
    
    broadcastEvent({
      type: 'delivery_en_route',
      data: {
        deliveryId: currentDelivery.id,
        sequenceNumber: currentDelivery.sequenceNumber,
        totalDeliveries: manifest.totalDeliveries,
        medication: currentDelivery.medication,
        patient: currentDelivery.patient,
        criticality: currentDelivery.criticality,
        destination: currentDelivery.destination,
        estimatedArrival: currentDelivery.estimatedDropoff
      }
    });
    
    // Dispatcher sends message about this delivery
    sendDispatcherMessage(currentDelivery, 'en_route');
  }
  
  if (currentDelivery.status === 'en_route') {
    // Calculate and broadcast current location
    const location = calculateCurrentLocation(manifest, now, currentIndex);
    
    broadcastEvent({
      type: 'location_update',
      data: {
        routeId: manifest.routeId,
        driverId: manifest.driver.id,
        driver: manifest.driver.displayName,
        currentDelivery: currentDelivery.id,
        sequenceNumber: currentDelivery.sequenceNumber,
        totalDeliveries: manifest.totalDeliveries,
        location: { lat: location.lat, lng: location.lng },
        heading: location.heading,
        progress: location.progress,
        nextStop: currentDelivery.patient,
        medication: currentDelivery.medication
      }
    });
    
    // Check if arrived at location
    if (now >= dropoffTime) {
      currentDelivery.status = 'at_location';
      
      broadcastEvent({
        type: 'arrived_at_location',
        data: {
          deliveryId: currentDelivery.id,
          sequenceNumber: currentDelivery.sequenceNumber,
          location: currentDelivery.destination,
          patient: currentDelivery.patient,
          medication: currentDelivery.medication
        }
      });
      
      // Dispatcher acknowledges arrival
      sendDispatcherMessage(currentDelivery, 'arrived');
    }
  }
  
  if (currentDelivery.status === 'at_location') {
    // Simulate dropoff completion (2-3 seconds after arrival)
    setTimeout(() => {
      currentDelivery.status = 'delivered';
      simulationState.completedDeliveries.push(currentDelivery);
      
      broadcastEvent({
        type: 'delivery_completed',
        data: {
          deliveryId: currentDelivery.id,
          sequenceNumber: currentDelivery.sequenceNumber,
          totalDeliveries: manifest.totalDeliveries,
          medication: currentDelivery.medication,
          patient: currentDelivery.patient,
          criticality: currentDelivery.criticality,
          deliveredAt: new Date().toISOString(),
          remainingDeliveries: manifest.totalDeliveries - simulationState.completedDeliveries.length
        }
      });
      
      // Dispatcher confirms completion
      sendDispatcherMessage(currentDelivery, 'completed');
      
      // Move to next delivery
      simulationState.currentDeliveryIndex++;
      
      if (simulationState.currentDeliveryIndex < manifest.deliveries.length) {
        const nextDelivery = manifest.deliveries[simulationState.currentDeliveryIndex];
        
        broadcastEvent({
          type: 'next_delivery',
          data: {
            deliveryId: nextDelivery.id,
            sequenceNumber: nextDelivery.sequenceNumber,
            totalDeliveries: manifest.totalDeliveries,
            medication: nextDelivery.medication,
            patient: nextDelivery.patient,
            criticality: nextDelivery.criticality,
            destination: nextDelivery.destination
          }
        });
      }
    }, 2000);
  }
}

/**
 * Send dispatcher message about delivery
 */
function sendDispatcherMessage(delivery, eventType) {
  let message = '';
  const dispatcher = simulationState.routeManifest?.dispatcher || simulationState.dispatcher;
  
  switch (eventType) {
    case 'en_route':
      message = `Driver en route to delivery ${delivery.sequenceNumber}/${delivery.totalDeliveries}. ${delivery.medication} for ${delivery.patient}. ETA: ${new Date(delivery.estimatedDropoff).toLocaleTimeString()}`;
      break;
    case 'arrived':
      message = `Driver arrived at delivery location ${delivery.sequenceNumber}/${delivery.totalDeliveries}. Delivering ${delivery.medication} to ${delivery.patient}.`;
      break;
    case 'completed':
      message = `Delivery ${delivery.sequenceNumber}/${delivery.totalDeliveries} completed. ${delivery.medication} delivered to ${delivery.patient}. ${delivery.totalDeliveries - delivery.sequenceNumber} remaining.`;
      break;
  }
  
  broadcastEvent({
    type: 'dispatcher_message',
    data: {
      dispatcherId: dispatcher?.id,
      dispatcher: dispatcher?.displayName || dispatcher?.name,
      deliveryId: delivery.id,
      sequenceNumber: delivery.sequenceNumber,
      message: message,
      priority: delivery.criticality,
      dispatcherNotes: delivery.dispatcherNotes
    }
  });
}

/**
 * Start simulation with a new route manifest
 */
async function startSimulation(durationHours = 24) {
  if (simulationState.running) {
    throw new Error('Simulation already running');
  }
  
  const now = new Date();
  
  // Generate a complete route manifest (one driver, multiple deliveries)
  const manifest = await generateRouteManifest(now);
  
  simulationState.running = true;
  simulationState.startTime = now;
  simulationState.endTime = new Date(now.getTime() + durationHours * 3600000);
  simulationState.routeManifest = manifest;
  simulationState.currentDeliveryIndex = 0;
  simulationState.completedDeliveries = [];
  simulationState.eventCount = 0;
  simulationState.dispatcher = manifest.dispatcher;
  
  manifest.status = 'active';
  
  // Broadcast simulation started
  broadcastEvent({
    type: 'simulation_started',
    data: {
      routeId: manifest.routeId,
      driver: manifest.driver.displayName,
      driverId: manifest.driver.id,
      driverPersona: manifest.driver.persona,
      routeName: manifest.routeName,
      totalDeliveries: manifest.totalDeliveries,
      startTime: manifest.startTime,
      estimatedEndTime: manifest.estimatedEndTime,
      estimatedDuration: manifest.estimatedDuration,
      criticalityBreakdown: manifest.criticalityBreakdown,
      dispatcher: manifest.dispatcher
    }
  });
  
  // Broadcast route manifest (entire manifest for clients)
  broadcastEvent({
    type: 'route_manifest',
    data: {
      routeId: manifest.routeId,
      driver: manifest.driver,
      dispatcher: manifest.dispatcher,
      routeName: manifest.routeName,
      startLocation: manifest.startLocation,
      deliveries: manifest.deliveries,
      totalDeliveries: manifest.totalDeliveries,
      criticalityBreakdown: manifest.criticalityBreakdown
    }
  });
  
  // Dispatcher sends initial briefing
  broadcastEvent({
    type: 'dispatcher_message',
    data: {
      dispatcherId: manifest.dispatcher.id,
      dispatcher: manifest.dispatcher.displayName,
      message: `Route briefing for ${manifest.driver.displayName}: ${manifest.totalDeliveries} deliveries scheduled. ${manifest.criticalityBreakdown.critical} critical priority items. Starting from ${manifest.startLocation.name}.`,
      priority: 'high',
      dispatcherNotes: `Credentials: ${manifest.dispatcher.credentials.role}, clearance ${manifest.dispatcher.credentials.clearanceLevel}`
    }
  });
  
  // Start progress tracking (every 5 seconds)
  progressInterval = setInterval(updateRouteProgress, 5000);
  
  console.log(`Simulation started: Driver ${manifest.driver.displayName} with ${manifest.totalDeliveries} deliveries`);
}

/**
 * Stop simulation
 */
function stopSimulation() {
  simulationState.running = false;
  
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  
  if (dispatcherInterval) {
    clearInterval(dispatcherInterval);
    dispatcherInterval = null;
  }
  
  if (simulationState.routeManifest) {
    simulationState.routeManifest.status = 'completed';
  }
  simulationState.dispatcher = null;
  
  broadcastEvent({
    type: 'simulation_stopped',
    data: {
      completedDeliveries: simulationState.completedDeliveries.length,
      totalDeliveries: simulationState.routeManifest?.totalDeliveries || 0
    }
  });
  
  console.log('Simulation stopped');
}

/**
 * Pause simulation
 */
function pauseSimulation() {
  if (!simulationState.running) {
    throw new Error('Simulation not running');
  }
  
  if (progressInterval) clearInterval(progressInterval);
  if (dispatcherInterval) clearInterval(dispatcherInterval);
  
  simulationState.running = false;
  
  broadcastEvent({
    type: 'simulation_paused'
  });
}

/**
 * Resume simulation
 */
function resumeSimulation() {
  if (simulationState.running) {
    throw new Error('Simulation already running');
  }
  
  if (!simulationState.routeManifest) {
    throw new Error('No route to resume');
  }
  
  simulationState.running = true;
  
  // Restart intervals
  progressInterval = setInterval(updateRouteProgress, 5000);
  
  broadcastEvent({
    type: 'simulation_resumed'
  });
}

/**
 * Get simulation statistics
 */
function getSimulationStats() {
  const manifest = simulationState.routeManifest;
  
  if (!manifest) {
    return {
      running: false,
      hasRoute: false,
      completedDeliveries: 0,
      totalDeliveries: 0,
      eventCount: 0
    };
  }
  
  const elapsedTime = simulationState.startTime 
    ? (Date.now() - new Date(simulationState.startTime).getTime()) / 1000 
    : 0;
  
  return {
    running: simulationState.running,
    hasRoute: true,
    routeId: manifest.routeId,
    driver: manifest.driver,
    dispatcher: manifest.dispatcher || simulationState.dispatcher,
    routeName: manifest.routeName,
    currentDeliveryIndex: simulationState.currentDeliveryIndex,
    currentDelivery: manifest.deliveries[simulationState.currentDeliveryIndex] || null,
    activeDeliveries: manifest.deliveries.filter(d => d.status !== 'delivered').length,
    completedDeliveries: simulationState.completedDeliveries.length,
    totalDeliveries: manifest.totalDeliveries,
    criticalityBreakdown: manifest.criticalityBreakdown,
    elapsedTime: Math.round(elapsedTime),
    eventCount: simulationState.eventCount,
    startTime: simulationState.startTime?.toISOString(),
    endTime: simulationState.endTime?.toISOString(),
    estimatedRouteCompletion: manifest.estimatedEndTime,
    progress: Math.round((simulationState.completedDeliveries.length / manifest.totalDeliveries) * 100)
  };
}

/**
 * Get route manifest
 */
function getRouteManifest() {
  return simulationState.routeManifest;
}

/**
 * Get active deliveries (not yet delivered)
 */
function getActiveDeliveries() {
  if (!simulationState.routeManifest) return [];
  return simulationState.routeManifest.deliveries.filter(d => d.status !== 'delivered');
}

/**
 * Get completed deliveries
 */
function getCompletedDeliveries() {
  return simulationState.completedDeliveries;
}

/**
 * Add SSE client
 */
function addClient(clientId, res) {
  streamClients.push({ id: clientId, res });
  
  // Send initial state
  const initialMessage = `data: ${JSON.stringify({
    type: 'connected',
    clientId,
    state: getSimulationStats(),
    routeManifest: simulationState.routeManifest
  })}\n\n`;
  
  res.write(initialMessage);
}

/**
 * Remove SSE client
 */
function removeClient(clientId) {
  streamClients = streamClients.filter(c => c.id !== clientId);
  console.log(`Client ${clientId} disconnected. ${streamClients.length} clients remaining.`);
}

module.exports = {
  startSimulation,
  stopSimulation,
  pauseSimulation,
  resumeSimulation,
  getSimulationStats,
  getRouteManifest,
  getActiveDeliveries,
  getCompletedDeliveries,
  addClient,
  removeClient,
  broadcastEvent
};

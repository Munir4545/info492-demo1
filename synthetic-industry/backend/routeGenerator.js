// Route Generator - Single driver with multiple deliveries along one route

const { mainRoute } = require('./routeDefinitions');
const { assignCargo, getRandomPatient } = require('./medicationPool');
const { assignDriver } = require('./driverManager');
const { assignDispatcher } = require('./dispatcherManager');
const { snapToRoad, getRouteBetween } = require('./osrmClient');

/**
 * Generate a random dropoff location along the main route
 * Uses route waypoints and adds random perpendicular offset
 */
function generateDropoffLocation() {
  const waypoints = mainRoute.waypoints;
  
  // Select random segment along the route
  const segmentIndex = Math.floor(Math.random() * (waypoints.length - 1));
  const start = waypoints[segmentIndex];
  const end = waypoints[segmentIndex + 1];
  
  // Interpolate along segment (0 to 1)
  const t = Math.random();
  const baseLat = start.lat + (end.lat - start.lat) * t;
  const baseLng = start.lng + (end.lng - start.lng) * t;
  
  // Add random perpendicular offset (0-500 meters)
  const offsetDistance = Math.random() * 500; // meters
  const offsetAngle = Math.random() * 2 * Math.PI;
  
  // Convert to lat/lng offset (approximate)
  const latOffset = (offsetDistance / 111000) * Math.cos(offsetAngle);
  const lngOffset = (offsetDistance / (111000 * Math.cos(baseLat * Math.PI / 180))) * Math.sin(offsetAngle);
  
  const lat = baseLat + latOffset;
  const lng = baseLng + lngOffset;
  
  // Ensure within bounds
  const bounds = mainRoute.bounds;
  return {
    lat: Math.max(bounds.minLat, Math.min(bounds.maxLat, lat)),
    lng: Math.max(bounds.minLng, Math.min(bounds.maxLng, lng)),
    segmentIndex
  };
}

/**
 * Generate a full route manifest for a single driver
 * This creates one driver with multiple deliveries (5-10) along the route
 * 
 * @param {Date} startTime - Simulation start time
 * @returns {Object} Complete route manifest with driver and all deliveries
 */
const EARTH_RADIUS_METERS = 6_371_000;

const toRadians = value => (value * Math.PI) / 180;

const distanceBetween = (a, b) => {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const haversine =
    sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;

  const angularDistance = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return EARTH_RADIUS_METERS * angularDistance;
};

function decodePolyline(encoded, precision = 6) {
  if (!encoded) return [];

  let index = 0;
  const len = encoded.length;
  const coordinates = [];
  let lat = 0;
  let lng = 0;
  const factor = Math.pow(10, precision);

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const deltaLat = (result & 1 ? ~(result >> 1) : result >> 1);
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const deltaLng = (result & 1 ? ~(result >> 1) : result >> 1);
    lng += deltaLng;

    coordinates.push({
      lat: lat / factor,
      lng: lng / factor
    });
  }

  return coordinates;
}

async function snapCoordinate(point, fallback) {
  try {
    const snapped = await snapToRoad(point);
    return {
      lat: snapped.lat,
      lng: snapped.lng,
      snapped: true
    };
  } catch (error) {
    console.warn('OSRM nearest lookup failed, using fallback coords:', error.message);
    return fallback;
  }
}

async function buildRouteSegment(start, end) {
  try {
    const route = await getRouteBetween(start, end);
    const coordinates = decodePolyline(route.geometry);

    return {
      geometry: route.geometry,
      distance: route.distance,
      duration: route.duration,
      coordinates
    };
  } catch (error) {
    console.warn('OSRM route lookup failed, using straight-line path:', error.message);
    return {
      geometry: null,
      distance: distanceBetween(start, end),
      duration: null,
      coordinates: [start, end]
    };
  }
}

async function generateRouteManifest(startTime) {
  // Select ONE driver for this entire route
  const driver = assignDriver();
  const dispatcher = assignDispatcher();
  
  // Get starting pharmacy
  const pharmacy = mainRoute.pharmacy;
  
  // Generate 5-10 deliveries for this driver
  const numDeliveries = 5 + Math.floor(Math.random() * 6); // 5-10 deliveries
  const deliveries = [];
  
  // Generate dropoff locations and sort by route progression
  const dropoffPoints = [];
  for (let i = 0; i < numDeliveries; i++) {
    const dropoff = generateDropoffLocation();
    const cargo = assignCargo();
    const patient = getRandomPatient();
    
    dropoffPoints.push({
      dropoff,
      cargo,
      patient,
      sequenceOrder: dropoff.segmentIndex + Math.random() // Add randomness for same segment
    });
  }
  
  // Sort by route progression (driver visits in order along the route)
  dropoffPoints.sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  
  // Create deliveries with timing
  let currentTime = new Date(startTime);
  let previousLocation = pharmacy.coords;
  
  for (let i = 0; i < dropoffPoints.length; i++) {
    const point = dropoffPoints[i];
    const deliveryId = `D_${String(i + 1).padStart(3, '0')}`;

    const candidateLocation = {
      lat: point.dropoff.lat,
      lng: point.dropoff.lng
    };

    const snappedDestination = await snapCoordinate(candidateLocation, candidateLocation);

    const startCoords = i === 0 ? pharmacy.coords : deliveries[i - 1].destination;
    const routeSegment = await buildRouteSegment(startCoords, snappedDestination);
    const travelMinutes = Math.max(3, (routeSegment.duration || 0) / 60 || 0);

    const pickupTime = i === 0
      ? new Date(currentTime.getTime() + Math.max(5, travelMinutes) * 60000)
      : new Date(currentTime.getTime() + travelMinutes * 60000);

    const dropoffDuration = 2 + Math.random() * 3;
    const estimatedDropoff = new Date(pickupTime.getTime() + dropoffDuration * 60000);

    // Calculate time remaining based on criticality
    let timeRemaining;
    if (point.cargo.criticality === 'critical') {
      timeRemaining = 30 + Math.random() * 60; // 30-90 minutes
    } else if (point.cargo.criticality === 'high') {
      timeRemaining = 90 + Math.random() * 120; // 90-210 minutes
    } else if (point.cargo.criticality === 'medium') {
      timeRemaining = 180 + Math.random() * 120; // 180-300 minutes
    } else {
      timeRemaining = 300 + Math.random() * 180; // 300-480 minutes
    }
    
    const delivery = {
      id: deliveryId,
      sequenceNumber: i + 1,
      totalDeliveries: numDeliveries,
      driver: driver.displayName,
      driverId: driver.id,
      driverNumber: driver.number,
      driverPersona: driver.persona,
      pharmacy: pharmacy.name,
      pharmacyCoords: pharmacy.coords,
      destination: { lat: snappedDestination.lat, lng: snappedDestination.lng },
      medication: point.cargo.medication,
      criticality: point.cargo.criticality,
      urgency: point.cargo.urgency,
      status: 'planned', // planned -> en_route -> at_location -> delivered
      timeRemaining: Math.round(timeRemaining),
      patient: point.patient,
      routeName: mainRoute.name,
      estimatedPickup: pickupTime.toISOString(),
      estimatedDropoff: estimatedDropoff.toISOString(),
      estimatedDuration: Math.round(dropoffDuration),
      createdAt: startTime.toISOString(),
      currentLocation: i === 0 ? pharmacy.coords : previousLocation,
      dispatcherNotes: `Delivery ${i + 1}/${numDeliveries} - ${point.cargo.criticality.toUpperCase()} priority`,
      route: {
        geometry: routeSegment.geometry,
        distance: routeSegment.distance,
        duration: routeSegment.duration,
        coordinates: routeSegment.coordinates
      }
    };
    
    deliveries.push(delivery);
    previousLocation = snappedDestination;
    currentTime = estimatedDropoff;
  }
  
  // Calculate total route information
  const totalRouteTime = new Date(currentTime).getTime() - new Date(startTime).getTime();
  const routeEndTime = new Date(startTime.getTime() + totalRouteTime);
  
  return {
    routeId: `ROUTE_${Date.now()}`,
    driver: {
      id: driver.id,
      name: driver.name,
      displayName: driver.displayName,
      number: driver.number,
      persona: driver.persona,
      vulnerabilityScore: driver.vulnerabilityScore
    },
    dispatcher,
    routeName: mainRoute.name,
    startTime: startTime.toISOString(),
    estimatedEndTime: routeEndTime.toISOString(),
    estimatedDuration: Math.round(totalRouteTime / 60000), // minutes
    startLocation: pharmacy,
    deliveries: deliveries,
    totalDeliveries: numDeliveries,
    status: 'pending', // pending -> active -> completed
    createdAt: startTime.toISOString(),
    criticalityBreakdown: {
      critical: deliveries.filter(d => d.criticality === 'critical').length,
      high: deliveries.filter(d => d.criticality === 'high').length,
      medium: deliveries.filter(d => d.criticality === 'medium').length,
      standard: deliveries.filter(d => d.criticality === 'standard').length
    }
  };
}

/**
 * Calculate current delivery index based on elapsed time
 */
function calculateCurrentDelivery(manifest, currentTime) {
  const elapsed = currentTime.getTime() - new Date(manifest.startTime).getTime();
  
  for (let i = 0; i < manifest.deliveries.length; i++) {
    const delivery = manifest.deliveries[i];
    const dropoffTime = new Date(delivery.estimatedDropoff).getTime();
    
    if (elapsed < dropoffTime) {
      return i;
    }
  }
  
  // All deliveries completed
  return manifest.deliveries.length;
}

/**
 * Get current location interpolated along route
 */
function calculateCurrentLocation(manifest, currentTime, currentDeliveryIndex) {
  if (currentDeliveryIndex >= manifest.deliveries.length) {
    // Route complete - at last delivery location
    return manifest.deliveries[manifest.deliveries.length - 1].destination;
  }
  
  const currentDelivery = manifest.deliveries[currentDeliveryIndex];
  const startTime = currentDeliveryIndex === 0 
    ? new Date(manifest.startTime)
    : new Date(manifest.deliveries[currentDeliveryIndex - 1].estimatedDropoff);
  
  const endTime = new Date(currentDelivery.estimatedPickup);
  const startLoc = currentDeliveryIndex === 0
    ? manifest.startLocation.coords
    : manifest.deliveries[currentDeliveryIndex - 1].destination;
  const endLoc = currentDelivery.destination;
  
  // Calculate progress between locations
  const elapsed = currentTime.getTime() - startTime.getTime();
  const duration = endTime.getTime() - startTime.getTime();
  const progress = duration <= 0 ? 1 : Math.min(1, Math.max(0, elapsed / duration));

  const interpolated = interpolateAlongRoute(currentDelivery.route, progress, startLoc, endLoc);

  return {
    lat: interpolated.lat,
    lng: interpolated.lng,
    progress: interpolated.progress,
    heading: interpolated.heading
  };
}

/**
 * Calculate heading/bearing between two points
 */
function calculateHeading(from, to) {
  const dLng = to.lng - from.lng;
  const dLat = to.lat - from.lat;
  const angle = Math.atan2(dLng, dLat) * 180 / Math.PI;
  return (angle + 360) % 360;
}

function interpolateAlongRoute(route, progress, fallbackStart, fallbackEnd) {
  if (!route || !route.coordinates || route.coordinates.length < 2) {
    return {
      lat: fallbackStart.lat + (fallbackEnd.lat - fallbackStart.lat) * progress,
      lng: fallbackStart.lng + (fallbackEnd.lng - fallbackStart.lng) * progress,
      heading: calculateHeading(fallbackStart, fallbackEnd),
      progress
    };
  }

  const totalDistance = route.distance || route.coordinates.reduce((acc, coord, idx) => {
    if (idx === 0) return 0;
    return acc + distanceBetween(route.coordinates[idx - 1], coord);
  }, 0);

  if (totalDistance === 0) {
    const finalPoint = route.coordinates[route.coordinates.length - 1];
    return {
      lat: finalPoint.lat,
      lng: finalPoint.lng,
      heading: calculateHeading(fallbackStart, fallbackEnd),
      progress
    };
  }

  const targetDistance = Math.max(0, Math.min(progress, 1)) * totalDistance;

  let traversed = 0;
  for (let i = 1; i < route.coordinates.length; i++) {
    const segmentStart = route.coordinates[i - 1];
    const segmentEnd = route.coordinates[i];
    const segmentDistance = distanceBetween(segmentStart, segmentEnd);

    if (traversed + segmentDistance >= targetDistance) {
      const segmentProgress = segmentDistance === 0
        ? 0
        : (targetDistance - traversed) / segmentDistance;
      const lat = segmentStart.lat + (segmentEnd.lat - segmentStart.lat) * segmentProgress;
      const lng = segmentStart.lng + (segmentEnd.lng - segmentStart.lng) * segmentProgress;
      return {
        lat,
        lng,
        heading: calculateHeading(segmentStart, segmentEnd),
        progress
      };
    }

    traversed += segmentDistance;
  }

  const finalPoint = route.coordinates[route.coordinates.length - 1];
  const prevPoint = route.coordinates[route.coordinates.length - 2] || fallbackStart;
  return {
    lat: finalPoint.lat,
    lng: finalPoint.lng,
    heading: calculateHeading(prevPoint, finalPoint),
    progress: Math.min(progress, 1)
  };
}

module.exports = {
  generateRouteManifest,
  calculateCurrentDelivery,
  calculateCurrentLocation,
  generateDropoffLocation
};

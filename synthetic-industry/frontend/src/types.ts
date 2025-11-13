// Type definitions for Synthetic Industry - Single driver with multiple deliveries model

export interface Coordinates {
  lat: number;
  lng: number;
}

export type DeliveryStatus = 'planned' | 'en_route' | 'at_location' | 'delivered';
export type Criticality = 'critical' | 'high' | 'medium' | 'standard';
export type Urgency = 'critical' | 'high' | 'medium' | 'low';

export interface Delivery {
  id: string;
  sequenceNumber: number;
  totalDeliveries: number;
  driver: string;
  driverId: string;
  driverNumber: number;
  driverPersona: string;
  pharmacy: string;
  pharmacyCoords: Coordinates;
  destination: Coordinates;
  medication: string;
  criticality: Criticality;
  urgency: Urgency;
  status: DeliveryStatus;
  timeRemaining: number;
  patient: string;
  routeName: string;
  estimatedPickup: string;
  estimatedDropoff: string;
  estimatedDuration: number;
  createdAt: string;
  currentLocation?: Coordinates;
  dispatcherNotes: string;
}

export interface Driver {
  id: string;
  name: string;
  displayName: string;
  number: number;
  persona: string;
  vulnerabilityScore: number;
}

export interface RouteManifest {
  routeId: string;
  driver: Driver;
  routeName: string;
  startTime: string;
  estimatedEndTime: string;
  estimatedDuration: number;
  startLocation: {
    name: string;
    coords: Coordinates;
  };
  deliveries: Delivery[];
  totalDeliveries: number;
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
  criticalityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    standard: number;
  };
}

export interface SimulationStats {
  running: boolean;
  hasRoute: boolean;
  routeId?: string;
  driver?: Driver;
  routeName?: string;
  currentDeliveryIndex: number;
  currentDelivery: Delivery | null;
  activeDeliveries: number;
  completedDeliveries: number;
  totalDeliveries: number;
  criticalityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    standard: number;
  };
  elapsedTime: number;
  eventCount: number;
  startTime?: string;
  endTime?: string;
  estimatedRouteCompletion?: string;
  progress: number;
}

export interface StreamEvent {
  type: string;
  timestamp: string;
  eventId: number;
  data?: any;
  deliveryId?: string;
  driverId?: string;
  driverName?: string;
  message?: string;
  stats?: SimulationStats;
}

export interface LocationUpdate {
  routeId: string;
  driverId: string;
  driver: string;
  currentDelivery: string;
  sequenceNumber: number;
  totalDeliveries: number;
  location: Coordinates;
  heading: number;
  progress: number;
  nextStop: string;
  medication: string;
}

export interface DispatcherMessage {
  deliveryId?: string;
  sequenceNumber?: number;
  message: string;
  priority: string;
  dispatcherNotes?: string;
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SyntheticStreamClient } from './lib/syntheticStream';
import { ControlPanel } from './components/ControlPanel';
import { LiveStatistics } from './components/LiveStatistics';
import { EventStream } from './components/EventStream';
import { StreamMap } from './components/StreamMap';
import { ApiDataPanel } from './components/ApiDataPanel';
import { Delivery, SimulationStats, StreamEvent, RouteManifest, Coordinates } from './types';

const initialStats: SimulationStats = {
  running: false,
  hasRoute: false,
  currentDeliveryIndex: 0,
  currentDelivery: null,
  activeDeliveries: 0,
  completedDeliveries: 0,
  totalDeliveries: 0,
  criticalityBreakdown: {
    critical: 0,
    high: 0,
    medium: 0,
    standard: 0
  },
  elapsedTime: 0,
  eventCount: 0,
  progress: 0,
  dispatcher: undefined
};

const EARTH_RADIUS_METERS = 6_371_000;
const AVERAGE_SPEED_MPS = 11.11; // ~40 km/h realistic urban driving speed
const FRAME_INTERVAL_MS = 1000 / 30; // Throttle re-renders to ~30fps

const toRadians = (value: number) => (value * Math.PI) / 180;

const distanceBetweenCoords = (a: Coordinates, b: Coordinates): number => {
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

const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

interface AnimationState {
  start: Coordinates;
  end: Coordinates;
  startTime: number;
  duration: number;
}

function App() {
  const [streamClient] = useState(() => new SyntheticStreamClient());
  const [streamConnected, setStreamConnected] = useState(false);
  const [stats, setStats] = useState<SimulationStats>(initialStats);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [routeManifest, setRouteManifest] = useState<RouteManifest | null>(null);
  const [driverLocation, setDriverLocationState] = useState<Coordinates | null>(null);
  const driverLocationRef = useRef<Coordinates | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const animationStateRef = useRef<AnimationState | null>(null);
  const lastServerTimestampRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);
  const routeManifestRef = useRef<RouteManifest | null>(null);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const maxEvents = 200; // Keep last 200 events

  const stopDriverAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    animationStateRef.current = null;
  }, []);

  const setDriverLocationInstant = useCallback(
    (location: Coordinates | null) => {
      stopDriverAnimation();
      driverLocationRef.current = location;
      setDriverLocationState(location);
      lastServerTimestampRef.current = null;
    },
    [stopDriverAnimation, setDriverLocationState]
  );

  const animateDriverTo = useCallback(
    (target: Coordinates, timestamp?: string) => {
      if (!target) {
        return;
      }

      let serverDuration: number | null = null;
      if (timestamp) {
        const serverMs = Date.parse(timestamp);
        if (!Number.isNaN(serverMs)) {
          if (lastServerTimestampRef.current) {
            const diff = serverMs - lastServerTimestampRef.current;
            if (diff > 0) {
              serverDuration = diff;
            }
          }
          lastServerTimestampRef.current = serverMs;
        }
      }

      const start = driverLocationRef.current;

      if (!start) {
        driverLocationRef.current = target;
        setDriverLocationState(target);
        return;
      }

      stopDriverAnimation();

      const distance = distanceBetweenCoords(start, target);

      if (distance < 0.5) {
        driverLocationRef.current = target;
        setDriverLocationState(target);
        return;
      }

      let duration = serverDuration ?? 5000;
      const travelMs = (distance / AVERAGE_SPEED_MPS) * 1000;
      if (travelMs > 0) {
        duration = Math.max(duration, travelMs);
      }
      duration = Math.min(Math.max(duration, 1200), 15000);

      const state: AnimationState = {
        start,
        end: target,
        startTime: performance.now(),
        duration
      };

      animationStateRef.current = state;
      lastFrameRef.current = state.startTime - FRAME_INTERVAL_MS;

      const step = () => {
        const currentState = animationStateRef.current;
        if (!currentState) {
          return;
        }

        const now = performance.now();
        const elapsed = now - currentState.startTime;
        const t = Math.min(1, elapsed / currentState.duration);

        if (now - lastFrameRef.current >= FRAME_INTERVAL_MS || t >= 1) {
          const lat = lerp(currentState.start.lat, currentState.end.lat, t);
          const lng = lerp(currentState.start.lng, currentState.end.lng, t);
          const nextLocation = { lat, lng };
          driverLocationRef.current = nextLocation;
          setDriverLocationState(nextLocation);
          lastFrameRef.current = now;
        }

        if (t < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          animationFrameRef.current = null;
          animationStateRef.current = null;
          driverLocationRef.current = currentState.end;
          setDriverLocationState(currentState.end);
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    },
    [setDriverLocationState, stopDriverAnimation]
  );

  useEffect(() => {
    const subscriptions: Array<[string, (event: StreamEvent) => void]> = [];

    const subscribe = (type: string, handler: (event: StreamEvent) => void) => {
      streamClient.on(type, handler);
      subscriptions.push([type, handler]);
    };

    const handleConnected = (event: StreamEvent) => {
      console.log('Stream connected', event);
      setStreamConnected(true);

      if (event.data?.state) {
        setStats(event.data.state);
      }

      if (event.data?.routeManifest) {
        const manifest = event.data.routeManifest as RouteManifest;
        routeManifestRef.current = manifest;
        setRouteManifest(manifest);
        setDeliveries(manifest.deliveries || []);
        setDriverLocationInstant(manifest.startLocation?.coords || null);
      } else {
        routeManifestRef.current = null;
        setRouteManifest(null);
        setDeliveries([]);
        setDriverLocationInstant(null);
      }

      addEvent(event);
    };

    const handleRouteManifest = (event: StreamEvent) => {
      if (event.data) {
        const manifest = event.data as RouteManifest;
        routeManifestRef.current = manifest;
        setRouteManifest(manifest);
        setDeliveries(manifest.deliveries || []);
        if (!driverLocationRef.current) {
          setDriverLocationInstant(manifest.startLocation?.coords || null);
        }
      }
      addEvent(event);
    };

    const handleDeliveryEnRoute = (event: StreamEvent) => {
      if (event.data?.deliveryId) {
        setDeliveries(prev => prev.map(d =>
          d.id === event.data.deliveryId
            ? { ...d, status: 'en_route' }
            : d
        ));
        setRouteManifest(prev => {
          if (!prev) return prev;
          const updatedDeliveries = prev.deliveries.map(d =>
            d.id === event.data.deliveryId
              ? { ...d, status: 'en_route' }
              : d
          );
          const updated = { ...prev, deliveries: updatedDeliveries };
          routeManifestRef.current = updated;
          return updated;
        });
      }
      addEvent(event);
      fetchStats();
    };

    const handleArrivedAtLocation = (event: StreamEvent) => {
      if (event.data?.deliveryId) {
        setDeliveries(prev => prev.map(d =>
          d.id === event.data.deliveryId
            ? { ...d, status: 'at_location' }
            : d
        ));
        setRouteManifest(prev => {
          if (!prev) return prev;
          const updatedDeliveries = prev.deliveries.map(d =>
            d.id === event.data.deliveryId
              ? { ...d, status: 'at_location' }
              : d
          );
          const updated = { ...prev, deliveries: updatedDeliveries };
          routeManifestRef.current = updated;
          return updated;
        });
      }
      if (event.data?.location) {
        animateDriverTo(event.data.location, event.timestamp);
      }
      addEvent(event);
      fetchStats();
    };

    const handleDeliveryCompleted = (event: StreamEvent) => {
      if (event.data?.deliveryId) {
        setDeliveries(prev => prev.map(d =>
          d.id === event.data.deliveryId
            ? { ...d, status: 'delivered' }
            : d
        ));
        setRouteManifest(prev => {
          if (!prev) return prev;
          const updatedDeliveries = prev.deliveries.map(d =>
            d.id === event.data.deliveryId
              ? { ...d, status: 'delivered' }
              : d
          );
          const updated = { ...prev, deliveries: updatedDeliveries };
          routeManifestRef.current = updated;
          return updated;
        });
      }
      addEvent(event);
      fetchStats();
    };

    const handleNextDelivery = (event: StreamEvent) => {
      addEvent(event);
      fetchStats();
    };

    const handleLocationUpdate = (event: StreamEvent) => {
      if (event.data?.location) {
        animateDriverTo(event.data.location, event.timestamp);
      }
    };

    const handleRouteCompleted = (event: StreamEvent) => {
      addEvent(event);
      fetchStats();
      const manifest = routeManifestRef.current;
      if (manifest && manifest.deliveries.length > 0) {
        const lastDelivery = manifest.deliveries[manifest.deliveries.length - 1];
        setDriverLocationInstant(lastDelivery.destination);
      }
      setRouteManifest(prev => {
        if (!prev) return prev;
        const updated = { ...prev, status: 'completed' as const };
        routeManifestRef.current = updated;
        return updated;
      });
    };

    const handleSimulationStopped = (event: StreamEvent) => {
      addEvent(event);
      fetchStats();
      routeManifestRef.current = null;
      setRouteManifest(null);
      setDeliveries([]);
      setDriverLocationInstant(null);
    };

    subscribe('connected', handleConnected);
    subscribe('simulation_started', event => {
      addEvent(event);
      fetchStats();
    });
    subscribe('route_manifest', handleRouteManifest);
    subscribe('delivery_en_route', handleDeliveryEnRoute);
    subscribe('arrived_at_location', handleArrivedAtLocation);
    subscribe('delivery_completed', handleDeliveryCompleted);
    subscribe('next_delivery', handleNextDelivery);
    subscribe('location_update', handleLocationUpdate);
    subscribe('dispatcher_message', addEvent);
    subscribe('route_completed', handleRouteCompleted);
    subscribe('simulation_stopped', handleSimulationStopped);

    // Connect to stream
    streamClient.connect();

    // Fetch initial stats
    fetchStats();

    // Setup periodic stats fetch
    const statsInterval = setInterval(fetchStats, 5000);

    return () => {
      clearInterval(statsInterval);
      subscriptions.forEach(([type, handler]) => streamClient.off(type, handler));
      streamClient.disconnect();
      routeManifestRef.current = null;
      stopDriverAnimation();
      lastServerTimestampRef.current = null;
      driverLocationRef.current = null;
      setDriverLocationState(null);
    };
  }, [streamClient, animateDriverTo, setDriverLocationInstant, stopDriverAnimation]);
  
  const addEvent = (event: StreamEvent) => {
    const rawTimestamp = event.timestamp;
    const normalizedTimestamp =
      rawTimestamp && !Number.isNaN(Date.parse(rawTimestamp))
        ? rawTimestamp
        : new Date().toISOString();

    const normalizedEvent: StreamEvent = {
      ...event,
      timestamp: normalizedTimestamp,
      clientId: event.clientId ?? event.data?.clientId ?? (event as any)?.clientId
    };

    setEvents(prev => {
      const newEvents = [...prev, normalizedEvent];
      // Keep only last N events to prevent memory issues
      if (newEvents.length > maxEvents) {
        return newEvents.slice(-maxEvents);
      }
      return newEvents;
    });
  };
  
  const fetchManifest = async () => {
    try {
      const response = await fetch('/api/synthetic/manifest');
      if (response.ok) {
        const manifest: RouteManifest = await response.json();
        routeManifestRef.current = manifest;
        setRouteManifest(manifest);
        setDeliveries(manifest.deliveries || []);
        if (!driverLocationRef.current) {
          setDriverLocationInstant(manifest.startLocation?.coords || null);
        }
      } else if (response.status === 404) {
        routeManifestRef.current = null;
        setRouteManifest(null);
        setDeliveries([]);
        setDriverLocationInstant(null);
      }
    } catch (err) {
      console.error('Failed to fetch manifest:', err);
    }
  };
  
  const fetchStats = async () => {
    try {
      const newStats = await streamClient.getStats();
      setStats(newStats);
      if (newStats.hasRoute) {
        if (!routeManifestRef.current || routeManifestRef.current.routeId !== newStats.routeId) {
          fetchManifest();
        }
      } else {
        routeManifestRef.current = null;
        setRouteManifest(null);
        setDeliveries([]);
        setDriverLocationInstant(null);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };
  
  const handleStart = async () => {
    if (isStarting) {
      return;
    }
    setIsStarting(true);
    try {
      setError(null);
      await streamClient.start(24);
      await fetchStats();
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to start simulation:', err);
    } finally {
      setIsStarting(false);
    }
  };
  
  const handleStop = async () => {
    try {
      setError(null);
      await streamClient.stop();
      await fetchStats();
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to stop simulation:', err);
    }
  };
  
  const handlePause = async () => {
    try {
      setError(null);
      await streamClient.pause();
      await fetchStats();
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to pause simulation:', err);
    }
  };
  
  const handleResume = async () => {
    try {
      setError(null);
      await streamClient.resume();
      await fetchStats();
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to resume simulation:', err);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">
            🚚 Synthetic Industry Stream
          </h1>
          <p className="text-gray-400 text-center mt-2">
            Single Driver • Multiple Deliveries • One Route
          </p>
          <p className="text-gray-500 text-center text-sm mt-1">
            Simulates a delivery driver completing multiple pharmaceutical deliveries with dispatcher coordination
          </p>
        </div>
      </header>
      
      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ControlPanel
              stats={stats}
              onStart={handleStart}
              onStop={handleStop}
              onPause={handlePause}
              onResume={handleResume}
              isStarting={isStarting}
            />
            
            <LiveStatistics
              stats={stats}
              streamConnected={streamConnected}
            />
          </div>
          
          {/* Middle Column */}
          <div className="lg:col-span-2 space-y-6">
            <StreamMap
              deliveries={deliveries}
              driverLocation={driverLocation}
              startLocation={routeManifest?.startLocation?.coords || null}
              routeName={routeManifest?.routeName}
              currentDeliveryId={stats.currentDelivery?.id || null}
            />
            
            <EventStream events={events} autoScroll={true} />

            <ApiDataPanel
              stats={stats}
              manifest={routeManifest}
              driverLocation={driverLocation}
              latestEvent={events.length > 0 ? events[events.length - 1] : null}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>Synthetic Industry Generator v1.0 | Autonomous Delivery Data Generation System</p>
          <p className="mt-1">
            Backend: <code className="bg-gray-700 px-2 py-1 rounded">http://localhost:3002</code>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

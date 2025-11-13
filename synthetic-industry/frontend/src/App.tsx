import React, { useState, useEffect, useRef } from 'react';
import { SyntheticStreamClient } from './lib/syntheticStream';
import { ControlPanel } from './components/ControlPanel';
import { LiveStatistics } from './components/LiveStatistics';
import { EventStream } from './components/EventStream';
import { StreamMap } from './components/StreamMap';
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
  progress: 0
};

function App() {
  const [streamClient] = useState(() => new SyntheticStreamClient());
  const [streamConnected, setStreamConnected] = useState(false);
  const [stats, setStats] = useState<SimulationStats>(initialStats);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
const [routeManifest, setRouteManifest] = useState<RouteManifest | null>(null);
const [driverLocation, setDriverLocation] = useState<Coordinates | null>(null);
const routeManifestRef = useRef<RouteManifest | null>(null);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const maxEvents = 200; // Keep last 200 events
  
  useEffect(() => {
    // Setup stream event handlers
    streamClient.on('connected', (event: StreamEvent) => {
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
        setDriverLocation(manifest.startLocation?.coords || null);
      } else {
        routeManifestRef.current = null;
        setRouteManifest(null);
        setDeliveries([]);
        setDriverLocation(null);
      }
      
      addEvent(event);
    });
    
    streamClient.on('simulation_started', (event: StreamEvent) => {
      addEvent(event);
      fetchStats();
    });
    
    streamClient.on('route_manifest', (event: StreamEvent) => {
      if (event.data) {
        const manifest = event.data as RouteManifest;
        routeManifestRef.current = manifest;
        setRouteManifest(manifest);
        setDeliveries(manifest.deliveries || []);
        setDriverLocation(manifest.startLocation?.coords || null);
      }
      addEvent(event);
    });
    
    streamClient.on('delivery_en_route', (event: StreamEvent) => {
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
    });
    
    streamClient.on('arrived_at_location', (event: StreamEvent) => {
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
      addEvent(event);
      fetchStats();
    });
    
    streamClient.on('delivery_completed', (event: StreamEvent) => {
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
    });
    
    streamClient.on('next_delivery', (event: StreamEvent) => {
      addEvent(event);
      fetchStats();
    });
    
    streamClient.on('location_update', (event: StreamEvent) => {
      if (event.data?.location) {
        setDriverLocation(event.data.location);
      }
    });
    
    streamClient.on('dispatcher_message', addEvent);
    
    streamClient.on('route_completed', (event: StreamEvent) => {
      addEvent(event);
      fetchStats();
      const manifest = routeManifestRef.current;
      if (manifest && manifest.deliveries.length > 0) {
        const lastDelivery = manifest.deliveries[manifest.deliveries.length - 1];
        setDriverLocation(lastDelivery.destination);
      }
      setRouteManifest(prev => {
        if (!prev) return prev;
        const updated = { ...prev, status: 'completed' as const };
        routeManifestRef.current = updated;
        return updated;
      });
    });
    
    streamClient.on('simulation_stopped', (event: StreamEvent) => {
      addEvent(event);
      fetchStats();
      routeManifestRef.current = null;
      setRouteManifest(null);
      setDeliveries([]);
      setDriverLocation(null);
    });
    
    // Connect to stream
    streamClient.connect();
    
    // Fetch initial stats
    fetchStats();
    
    // Setup periodic stats fetch
    const statsInterval = setInterval(fetchStats, 5000);
    
    return () => {
      clearInterval(statsInterval);
      streamClient.disconnect();
      routeManifestRef.current = null;
    };
  }, [streamClient]);
  
  const addEvent = (event: StreamEvent) => {
    setEvents(prev => {
      const newEvents = [...prev, event];
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
        if (!driverLocation) {
          setDriverLocation(manifest.startLocation?.coords || null);
        }
      } else if (response.status === 404) {
        routeManifestRef.current = null;
        setRouteManifest(null);
        setDeliveries([]);
        setDriverLocation(null);
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
        setDriverLocation(null);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };
  
  const handleStart = async () => {
    try {
      setError(null);
      await streamClient.start(24);
      await fetchStats();
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to start simulation:', err);
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

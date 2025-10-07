'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AttackSimulation from './AttackSimulation';
import DriverDetailModal from './DriverDetailModal';

// Dynamic import for map component (Leaflet requires window object)
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <p className="text-slate-600 dark:text-slate-400">Loading map...</p>
    </div>
  ),
});

export default function Dashboard({ user, onLogout, showAttackSimulation = false }) {
  const [attackActive, setAttackActive] = useState(false);
  const [currentView, setCurrentView] = useState('operations'); // 'operations' or 'attack'
  const [attackKey, setAttackKey] = useState(0); // Key to maintain attack state
  
  // Auto-start attack simulation if requested
  useEffect(() => {
    if (showAttackSimulation) {
      setAttackActive(true);
      setCurrentView('attack');
    }
  }, [showAttackSimulation]);
  
  const [systemStatus, setSystemStatus] = useState({
    activeDrivers: 47,
    pendingDeliveries: 234,
    completedToday: 189,
    apiHealth: 'Operational',
  });

  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, type: 'info', message: 'System backup completed successfully', time: '2 min ago' },
    { id: 2, type: 'success', message: 'Route optimization completed for Zone 3', time: '15 min ago' },
    { id: 3, type: 'info', message: 'Driver #D-3421 completed delivery batch', time: '23 min ago' },
  ]);

  const [activeDrivers, setActiveDrivers] = useState([
    { 
      id: 'D-3421', 
      name: 'Mike Johnson', 
      zone: 'Tacoma Central', 
      status: 'En Route', 
      packages: 12, 
      location: { lat: 47.2529, lng: -122.4443 },
      route: [
        { address: '1234 Pacific Ave, Tacoma, WA', packages: 3, status: 'completed', completedAt: '9:15 AM' },
        { address: '5678 Market St, Tacoma, WA', packages: 4, status: 'in-progress', eta: '10:30 AM', notes: 'Apartment building - call on arrival' },
        { address: '9012 Union Ave, Tacoma, WA', packages: 3, status: 'pending', eta: '11:00 AM' },
        { address: '3456 Commerce St, Tacoma, WA', packages: 2, status: 'pending', eta: '11:30 AM' },
      ]
    },
    { 
      id: 'D-7832', 
      name: 'Sarah Chen', 
      zone: 'Spokane Valley', 
      status: 'Delivering', 
      packages: 8, 
      location: { lat: 47.6588, lng: -117.2648 },
      route: [
        { address: '2201 N Argonne Rd, Spokane, WA', packages: 5, status: 'completed', completedAt: '8:45 AM' },
        { address: '8924 E Sprague Ave, Spokane, WA', packages: 4, status: 'completed', completedAt: '9:30 AM' },
        { address: '1515 N Sullivan Rd, Spokane Valley, WA', packages: 4, status: 'in-progress', eta: '10:15 AM' },
        { address: '7733 E Trent Ave, Spokane, WA', packages: 4, status: 'pending', eta: '11:00 AM' },
      ]
    },
    { 
      id: 'D-5109', 
      name: 'James Rodriguez', 
      zone: 'Yakima North', 
      status: 'En Route', 
      packages: 15, 
      location: { lat: 46.6021, lng: -120.5059 },
      route: [
        { address: '101 N 1st St, Yakima, WA', packages: 5, status: 'completed', completedAt: '8:30 AM' },
        { address: '2405 W Nob Hill Blvd, Yakima, WA', packages: 5, status: 'in-progress', eta: '10:00 AM' },
        { address: '5510 Tieton Dr, Yakima, WA', packages: 5, status: 'pending', eta: '10:45 AM' },
      ]
    },
    { 
      id: 'D-9234', 
      name: 'Emily Davis', 
      zone: 'Bellevue East', 
      status: 'Loading', 
      packages: 0, 
      location: { lat: 47.6101, lng: -122.2015 },
      route: [
        { address: '577 156th Ave NE, Bellevue, WA', packages: 6, status: 'pending', eta: '11:00 AM' },
        { address: '900 Bellevue Way NE, Bellevue, WA', packages: 8, status: 'pending', eta: '12:00 PM' },
        { address: '13033 NE 20th St, Bellevue, WA', packages: 4, status: 'pending', eta: '1:00 PM' },
      ]
    },
    { 
      id: 'D-4567', 
      name: 'David Kim', 
      zone: 'Olympia South', 
      status: 'En Route', 
      packages: 10, 
      location: { lat: 47.0379, lng: -122.9007 },
      route: [
        { address: '625 Woodland Sq Loop SE, Olympia, WA', packages: 4, status: 'completed', completedAt: '9:00 AM' },
        { address: '222 Capitol Way N, Olympia, WA', packages: 3, status: 'in-progress', eta: '10:15 AM', notes: 'Government building - security check' },
        { address: '4220 6th Ave SE, Olympia, WA', packages: 3, status: 'pending', eta: '11:00 AM' },
      ]
    },
  ]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [gpsCompromisedDrivers, setGpsCompromisedDrivers] = useState(new Set());

  const handleStartAttack = () => {
    setAttackActive(true);
    setCurrentView('attack');
    setAttackKey(prev => prev + 1); // New key for new attack instance
  };

  const handleStopAttack = () => {
    setAttackActive(false);
    setCurrentView('operations');
  };

  // Helper to interpolate between two coordinates
  const interpolateCoords = (start, end, progress) => ({
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress
  });

  // Helper to get stop coordinates (same logic as MapView)
  const getStopCoordinates = (driver, stopIndex) => {
    const baseLatoffsets = [0.01, 0.02, -0.01, 0.015];
    const baseLngOffsets = [0.015, -0.01, 0.02, -0.015];
    
    // Use original starting location from initial data
    const originalLat = driver.id === 'D-3421' ? 47.2529 : 
                        driver.id === 'D-7832' ? 47.6588 :
                        driver.id === 'D-5109' ? 46.6021 :
                        driver.id === 'D-9234' ? 47.6101 :
                        driver.id === 'D-4567' ? 47.0379 : driver.location.lat;
    const originalLng = driver.id === 'D-3421' ? -122.4443 :
                        driver.id === 'D-7832' ? -117.2648 :
                        driver.id === 'D-5109' ? -120.5059 :
                        driver.id === 'D-9234' ? -122.2015 :
                        driver.id === 'D-4567' ? -122.9007 : driver.location.lng;
    
    return {
      lat: originalLat + (baseLatoffsets[stopIndex % baseLatoffsets.length] || 0),
      lng: originalLng + (baseLngOffsets[stopIndex % baseLngOffsets.length] || 0)
    };
  };

  // Simulate driver movement and deliveries (1 sec = 0.3 simulation hours)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDrivers(prevDrivers => 
        prevDrivers.map(driver => {
          // Skip if loading or completed
          if (driver.status === 'Loading' || driver.status === 'Completed') return driver;

          // Initialize movement progress if not exists
          if (!driver.movementProgress) {
            driver.movementProgress = 0;
          }

          // Find current stop
          const currentStopIndex = driver.route.findIndex(stop => stop.status === 'in-progress');
          if (currentStopIndex === -1) return driver;

          const currentStop = driver.route[currentStopIndex];
          const targetCoords = getStopCoordinates(driver, currentStopIndex);
          
          // Get previous position (previous stop or starting location)
          let startCoords;
          if (currentStopIndex > 0) {
            startCoords = getStopCoordinates(driver, currentStopIndex - 1);
          } else {
            // Use original starting location
            startCoords = {
              lat: driver.id === 'D-3421' ? 47.2529 : 
                   driver.id === 'D-7832' ? 47.6588 :
                   driver.id === 'D-5109' ? 46.6021 :
                   driver.id === 'D-9234' ? 47.6101 :
                   driver.id === 'D-4567' ? 47.0379 : driver.location.lat,
              lng: driver.id === 'D-3421' ? -122.4443 :
                   driver.id === 'D-7832' ? -117.2648 :
                   driver.id === 'D-5109' ? -120.5059 :
                   driver.id === 'D-9234' ? -122.2015 :
                   driver.id === 'D-4567' ? -122.9007 : driver.location.lng
            };
          }

          // Move vehicle towards target (increment by 5% per second, ~20 seconds per stop = 6 sim hours)
          const newProgress = Math.min(driver.movementProgress + 0.05, 1);
          const newLocation = interpolateCoords(startCoords, targetCoords, newProgress);

          // Check if reached destination
          if (newProgress >= 1) {
            // Complete current stop
            const updatedRoute = [...driver.route];
            updatedRoute[currentStopIndex] = {
              ...currentStop,
              status: 'completed',
              completedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            };

            // Start next stop if available
            const nextStopIndex = currentStopIndex + 1;
            if (nextStopIndex < updatedRoute.length) {
              updatedRoute[nextStopIndex] = {
                ...updatedRoute[nextStopIndex],
                status: 'in-progress'
              };
            }

            // Calculate remaining packages
            const remainingPackages = updatedRoute
              .filter(stop => stop.status !== 'completed')
              .reduce((sum, stop) => sum + stop.packages, 0);

            return {
              ...driver,
              route: updatedRoute,
              packages: remainingPackages,
              location: targetCoords, // Snap to exact stop location
              movementProgress: 0, // Reset for next stop
              status: remainingPackages === 0 ? 'Completed' : 'En Route'
            };
          }

          // Update position along route
          return {
            ...driver,
            location: newLocation,
            movementProgress: newProgress
          };
        })
      );
    }, 1000); // Update every second (0.3 sim hours)

    return () => clearInterval(interval);
  }, []);

  // GPS Spoofing Effect during attacks
  useEffect(() => {
    if (!attackActive) return;

    const spoofInterval = setInterval(() => {
      // Randomly compromise drivers with GPS spoofing (10% chance per interval)
      if (Math.random() < 0.1) {
        setActiveDrivers(prevDrivers => {
          const uncompromisedDrivers = prevDrivers.filter(d => 
            !gpsCompromisedDrivers.has(d.id) && d.status !== 'Loading' && d.status !== 'Completed'
          );
          
          if (uncompromisedDrivers.length === 0) return prevDrivers;
          
          const targetDriver = uncompromisedDrivers[Math.floor(Math.random() * uncompromisedDrivers.length)];
          
          // Mark as compromised
          setGpsCompromisedDrivers(prev => new Set([...prev, targetDriver.id]));
          
          // Add system alert
          setRecentAlerts(prev => [
            { id: Date.now(), type: 'warning', message: `GPS spoofing detected: ${targetDriver.name} (${targetDriver.id}) rerouted`, time: 'Just now' },
            ...prev.slice(0, 2)
          ]);

          return prevDrivers.map(driver => {
            if (driver.id !== targetDriver.id) return driver;

            // Create a fake rerouted stop (random wrong location)
            const spoofedLocation = {
              lat: driver.location.lat + (Math.random() - 0.5) * 0.1,
              lng: driver.location.lng + (Math.random() - 0.5) * 0.1
            };

            // Insert fake stop after current in-progress stop
            const currentStopIndex = driver.route.findIndex(stop => stop.status === 'in-progress');
            if (currentStopIndex === -1) return driver;

            const updatedRoute = [...driver.route];
            updatedRoute.splice(currentStopIndex + 1, 0, {
              address: '⚠️ SPOOFED LOCATION - Incorrect GPS Data',
              packages: 0,
              status: 'pending',
              eta: 'REROUTED',
              notes: 'GPS COMPROMISED - Driver diverted to wrong location',
              isSpoofed: true
            });

            return {
              ...driver,
              route: updatedRoute,
              location: spoofedLocation,
              isGpsCompromised: true
            };
          });
        });
      }
    }, 5000);

    return () => clearInterval(spoofInterval);
  }, [attackActive, gpsCompromisedDrivers]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                  PNW Logistics Hub
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Operations Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {attackActive && (
                <div className="flex items-center gap-2 mr-4">
                  <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    <button
                      onClick={() => setCurrentView('operations')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentView === 'operations'
                          ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Operations
                    </button>
                    <button
                      onClick={() => setCurrentView('attack')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        currentView === 'attack'
                          ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      Attack Monitor
                    </button>
                  </div>
                </div>
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  {user.username}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.role} • {user.id}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 max-w-[1800px] mx-auto">
        {currentView === 'operations' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Drivers</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{systemStatus.activeDrivers}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending Deliveries</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{systemStatus.pendingDeliveries}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Completed Today</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{systemStatus.completedToday}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">API Status</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{systemStatus.apiHealth}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Fleet Map */}
            <div className="mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Fleet Location Tracking</h2>
                  {selectedDriver && (
                    <button
                      onClick={() => setSelectedDriver(null)}
                      className="text-sm px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
                <MapView 
                  drivers={activeDrivers} 
                  selectedDriver={selectedDriver}
                  onDriverSelect={setSelectedDriver}
                />
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Active Drivers */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Active Fleet Status</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {activeDrivers.map((driver) => (
                      <div 
                        key={driver.id} 
                        className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                          driver.isGpsCompromised
                            ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600'
                            : selectedDriver?.id === driver.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-600'
                            : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent'
                        }`}
                        onClick={() => setSelectedDriver(driver)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            driver.isGpsCompromised 
                              ? 'bg-gradient-to-br from-red-500 to-orange-600 animate-pulse' 
                              : 'bg-gradient-to-br from-blue-500 to-purple-600'
                          }`}>
                            {driver.isGpsCompromised ? '⚠' : driver.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-800 dark:text-white">{driver.name}</p>
                              {driver.isGpsCompromised && (
                                <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-medium">
                                  GPS COMPROMISED
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{driver.id} • {driver.zone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            driver.status === 'En Route' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                            driver.status === 'Delivering' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            driver.status === 'Completed' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                            'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {driver.status}
                          </span>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{driver.packages} packages</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Alerts */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">System Alerts</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${
                            alert.type === 'success' ? 'bg-green-500' :
                            alert.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-800 dark:text-white">{alert.message}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Attack Trigger/Status Section */}
            {!attackActive ? (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl shadow-sm border-2 border-red-200 dark:border-red-800 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                      Security Vulnerability Test
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Initiate AI-orchestrated multi-vector attack simulation to demonstrate system vulnerabilities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                        Phishing
                      </span>
                      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                        GPS Manipulation
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
                        API Flooding
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleStartAttack}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl text-lg"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Start Attack Simulation</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl shadow-sm border-2 border-red-500 dark:border-red-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                        ⚠️ Attack Simulation Active
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        AI agents are currently executing coordinated assault. Switch to Attack Monitor to view details.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('attack')}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    View Attack Monitor
                  </button>
                </div>
              </div>
            )}
          </>
        ) : null}
        
        {/* Always render attack simulation but hide it when not in attack view */}
        {attackActive && (
          <div style={{ display: currentView === 'attack' ? 'block' : 'none' }}>
            <AttackSimulation key={attackKey} onStop={handleStopAttack} />
          </div>
        )}
      </div>

      {/* Driver Detail Modal */}
      {selectedDriver && currentView === 'operations' && (
        <DriverDetailModal 
          driver={selectedDriver} 
          onClose={() => setSelectedDriver(null)} 
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Zap, AlertTriangle, CheckCircle, Activity, MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Map controller for panning
function MapController({ selectedDriver, attackPhase }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedDriver) {
      map.setView([selectedDriver.location.lat, selectedDriver.location.lng], 11, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedDriver, map]);

  useEffect(() => {
    if (attackPhase === 'gps') {
      // Focus on compromised driver during GPS phase
      map.setView([47.2529, -122.4443], 10, { animate: true, duration: 1 });
    }
  }, [attackPhase, map]);
  
  return null;
}

// Custom icons for different driver statuses
const createCustomIcon = (color, isCompromised = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        ${isCompromised ? `
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: rgba(239, 68, 68, 0.3);
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "></div>
        ` : ''}
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">${isCompromised ? '⚠' : ''}</div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const enRouteIcon = createCustomIcon('#3b82f6');
const deliveringIcon = createCustomIcon('#10b981');
const loadingIcon = createCustomIcon('#64748b');
const completedIcon = createCustomIcon('#9333ea');
const compromisedIcon = createCustomIcon('#ef4444', true);

// Attack origin icons
const createAttackOriginIcon = (type) => {
  const colors = {
    phishing: '#dc2626',
    gps: '#ea580c',
    api: '#ca8a04',
  };
  
  return L.divIcon({
    className: 'attack-origin-marker',
    html: `
      <div style="
        background-color: ${colors[type]};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 20px ${colors[type]};
        display: flex;
        align-items: center;
        justify-content: center;
        animation: glow 2s ease-in-out infinite;
      ">
        <div style="color: white; font-size: 14px; font-weight: bold;">⚡</div>
      </div>
      <style>
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px ${colors[type]}; }
          50% { box-shadow: 0 0 40px ${colors[type]}, 0 0 60px ${colors[type]}; }
        }
      </style>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Main App Component
export default function AttackDemoWithMap() {
  const [currentScenario, setCurrentScenario] = useState('intro');
  const [phishingStep, setPhishingStep] = useState(0);
  const [gpsStep, setGpsStep] = useState(0);
  const [apiStep, setApiStep] = useState(0);
  const [compromisedDrivers, setCompromisedDrivers] = useState(0);
  const [totalDisruptions, setTotalDisruptions] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Mock driver data
  const [drivers] = useState([
    {
      id: 'driver-7',
      name: 'Sarah Mitchell',
      location: { lat: 47.2529, lng: -122.4443 },
      status: 'En Route',
      zone: 'Tacoma',
      packages: 12,
      isCompromised: false,
      route: [
        { address: '123 Main St, Tacoma', status: 'completed', packages: 2 },
        { address: '456 Oak Ave, Tacoma', status: 'in-progress', packages: 1 },
        { address: '789 Pine St, Tacoma', status: 'pending', packages: 3 },
        { address: '321 Elm St, Tacoma', status: 'pending', packages: 2 },
      ]
    },
    {
      id: 'driver-3',
      name: 'Mike Johnson',
      location: { lat: 47.6588, lng: -117.4260 },
      status: 'Delivering',
      zone: 'Spokane',
      packages: 8,
      isCompromised: false,
      route: []
    },
    {
      id: 'driver-12',
      name: 'Lisa Chen',
      location: { lat: 46.6021, lng: -120.5059 },
      status: 'Loading',
      zone: 'Yakima',
      packages: 15,
      isCompromised: false,
      route: []
    }
  ]);

  // Attack origins
  const attackOrigins = [
    { id: 'attack-1', name: 'Phishing Server', lat: 47.6062, lng: -122.3321, type: 'phishing' },
    { id: 'attack-2', name: 'GPS Spoofer', lat: 47.5, lng: -119.5, type: 'gps' },
    { id: 'attack-3', name: 'API Flooder', lat: 46.7, lng: -121.0, type: 'api' },
  ];

  const resetDemo = () => {
    setCurrentScenario('intro');
    setPhishingStep(0);
    setGpsStep(0);
    setApiStep(0);
    setCompromisedDrivers(0);
    setTotalDisruptions(0);
    setSelectedDriver(null);
    setShowMap(false);
  };

  const getIconForDriver = (driver) => {
    if (driver.isCompromised) return compromisedIcon;
    
    switch (driver.status) {
      case 'En Route': return enRouteIcon;
      case 'Delivering': return deliveringIcon;
      case 'Loading': return loadingIcon;
      case 'Completed': return completedIcon;
      default: return enRouteIcon;
    }
  };

  const getStopCoordinates = (driver, stopIndex) => {
    const baseLatOffsets = [0.01, 0.02, -0.01, 0.015];
    const baseLngOffsets = [0.015, -0.01, 0.02, -0.015];
    
    return {
      lat: driver.location.lat + (baseLatOffsets[stopIndex % baseLatOffsets.length] || 0),
      lng: driver.location.lng + (baseLngOffsets[stopIndex % baseLngOffsets.length] || 0)
    };
  };

  const createStopIcon = (status, number) => {
    const colors = {
      completed: '#10b981',
      'in-progress': '#3b82f6',
      pending: '#94a3b8'
    };
    
    return L.divIcon({
      className: 'custom-stop-marker',
      html: `
        <div style="
          background-color: ${colors[status]};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">${number}</div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {currentScenario === 'intro' && (
        <IntroScreen onStart={() => setCurrentScenario('menu')} />
      )}
      
      {currentScenario === 'menu' && (
        <MenuScreen 
          onSelectScenario={setCurrentScenario}
          compromisedDrivers={compromisedDrivers}
          totalDisruptions={totalDisruptions}
          onToggleMap={() => setShowMap(!showMap)}
          showMap={showMap}
        />
      )}
      
      {currentScenario === 'phishing' && (
        <PhishingScenario 
          step={phishingStep}
          onNext={() => {
            if (phishingStep === 3) {
              setCompromisedDrivers(1);
              setTotalDisruptions(prev => prev + 1);
              setCurrentScenario('menu');
            } else {
              setPhishingStep(phishingStep + 1);
            }
          }}
          onBack={() => setCurrentScenario('menu')}
        />
      )}
      
      {currentScenario === 'gps' && (
        <GPSScenario 
          step={gpsStep}
          drivers={drivers}
          selectedDriver={selectedDriver}
          onDriverSelect={setSelectedDriver}
          onNext={() => {
            if (gpsStep === 2) {
              setTotalDisruptions(prev => prev + 92);
              setCurrentScenario('menu');
            } else {
              setGpsStep(gpsStep + 1);
            }
          }}
          onBack={() => setCurrentScenario('menu')}
          getIconForDriver={getIconForDriver}
          getStopCoordinates={getStopCoordinates}
          createStopIcon={createStopIcon}
        />
      )}
      
      {currentScenario === 'api' && (
        <APIScenario 
          step={apiStep}
          onNext={() => {
            if (apiStep === 2) {
              setTotalDisruptions(prev => prev + 412);
              setCurrentScenario('menu');
            } else {
              setApiStep(apiStep + 1);
            }
          }}
          onBack={() => setCurrentScenario('menu')}
        />
      )}
      
      {currentScenario === 'results' && (
        <ResultsScreen 
          totalDisruptions={totalDisruptions}
          onReset={resetDemo}
        />
      )}

      {/* Map Overlay */}
      {showMap && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold">Attack Visualization Map</h2>
              <button
                onClick={() => setShowMap(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Close Map
              </button>
            </div>
            <div className="flex-1 p-4">
              <MapView
                drivers={drivers}
                selectedDriver={selectedDriver}
                onDriverSelect={setSelectedDriver}
                compromisedDrivers={compromisedDrivers}
                attackOrigins={attackOrigins}
                currentScenario={currentScenario}
                getIconForDriver={getIconForDriver}
                getStopCoordinates={getStopCoordinates}
                createStopIcon={createStopIcon}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Map View Component
function MapView({ drivers, selectedDriver, onDriverSelect, compromisedDrivers, attackOrigins, currentScenario, getIconForDriver, getStopCoordinates, createStopIcon }) {
  const washingtonCenter = [47.2, -120.0];

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={washingtonCenter}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedDriver={selectedDriver} attackPhase={currentScenario} />
        
        {/* Attack origin points */}
        {attackOrigins.map((origin) => (
          <div key={origin.id}>
            <Marker
              position={[origin.lat, origin.lng]}
              icon={createAttackOriginIcon(origin.type)}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-red-600">⚡ {origin.name}</p>
                  <p className="text-slate-600 text-xs mt-1">AI Agent: {origin.type.toUpperCase()}</p>
                </div>
              </Popup>
            </Marker>
            
            {/* Attack radius circle */}
            <Circle
              center={[origin.lat, origin.lng]}
              radius={50000} // 50km radius
              pathOptions={{
                color: origin.type === 'phishing' ? '#dc2626' : origin.type === 'gps' ? '#ea580c' : '#ca8a04',
                fillColor: origin.type === 'phishing' ? '#dc2626' : origin.type === 'gps' ? '#ea580c' : '#ca8a04',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '5, 5',
              }}
            />
          </div>
        ))}
        
        {/* Driver markers */}
        {drivers.map((driver) => {
          const compromised = compromisedDrivers > 0 && driver.id === 'driver-7';
          
          return (
            <Marker
              key={driver.id}
              position={[driver.location.lat, driver.location.lng]}
              icon={getIconForDriver({ ...driver, isCompromised: compromised })}
              eventHandlers={{
                click: () => onDriverSelect(driver)
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className={`font-bold ${compromised ? 'text-red-600' : 'text-slate-800'}`}>
                    {compromised ? '⚠️ ' : ''}{driver.name}
                  </p>
                  <p className="text-slate-600">{driver.id}</p>
                  <p className="text-slate-600">{driver.zone}</p>
                  {compromised && (
                    <div className="mt-2 p-2 bg-red-50 rounded">
                      <p className="text-red-700 font-semibold text-xs">COMPROMISED</p>
                      <p className="text-red-600 text-xs">GPS Manipulated</p>
                    </div>
                  )}
                  <p className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      compromised ? 'bg-red-100 text-red-700' :
                      driver.status === 'En Route' ? 'bg-blue-100 text-blue-700' :
                      driver.status === 'Delivering' ? 'bg-green-100 text-green-700' :
                      driver.status === 'Completed' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {driver.status}
                    </span>
                  </p>
                  <p className="text-slate-600 mt-1">{driver.packages} packages</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Show route for selected driver */}
        {selectedDriver && selectedDriver.route && selectedDriver.route.length > 0 && (
          <>
            {/* Route polyline */}
            <Polyline
              positions={[
                [selectedDriver.location.lat, selectedDriver.location.lng],
                ...selectedDriver.route.map((stop, idx) => {
                  const coords = getStopCoordinates(selectedDriver, idx);
                  return [coords.lat, coords.lng];
                })
              ]}
              pathOptions={{
                color: '#3b82f6',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 5'
              }}
            />

            {/* Delivery stop markers */}
            {selectedDriver.route.map((stop, index) => {
              const coords = getStopCoordinates(selectedDriver, index);
              return (
                <div key={`${selectedDriver.id}-stop-${index}`}>
                  <Marker
                    position={[coords.lat, coords.lng]}
                    icon={createStopIcon(stop.status, index + 1)}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold text-slate-800">Stop #{index + 1}</p>
                        <p className="text-slate-600 text-xs mt-1">{stop.address}</p>
                        <p className="mt-2">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            stop.status === 'completed' ? 'bg-green-100 text-green-700' :
                            stop.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {stop.status.toUpperCase()}
                          </span>
                        </p>
                        <p className="text-slate-600 mt-1">{stop.packages} packages</p>
                      </div>
                    </Popup>
                  </Marker>
                </div>
              );
            })}
          </>
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-slate-200 dark:border-slate-700 z-[1000]">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">
          {selectedDriver ? `${selectedDriver.name}'s Route` : 'Fleet Status'}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-xs text-slate-600 dark:text-slate-400">En Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Delivering</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-500 border-2 border-white"></div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Loading</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Compromised</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Intro Screen
function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-6xl font-bold mb-4">
          AI-Orchestrated Attack Demonstration
        </h1>
        <p className="text-2xl text-blue-300 mb-8">
          PNW Last-Mile Delivery Network Vulnerability Analysis
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h2 className="text-xl font-semibold mb-4 text-orange-400">THESIS</h2>
          <p className="text-lg leading-relaxed">
            We demonstrate that PNW last-mile delivery networks <strong>cannot defend</strong> against 
            AI-orchestrated attacks that coordinate multiple vectors (phishing → GPS manipulation → API flooding). 
            Networks with <strong>weak security verification measures</strong> remain vulnerable to 
            multi-vector bot attacks capable of achieving <strong>500+ disruptions within 72 hours</strong>.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onStart}
            className="mt-8 px-12 py-4 bg-orange-500 hover:bg-orange-600 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-3"
          >
            Begin Demonstration
            <ChevronRight size={24} />
          </button>
          
          <Link
            href="/portal"
            className="mt-8 px-12 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-3"
          >
            <Navigation size={24} />
            Go to Portal
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            💡 <strong>Tip:</strong> You can also access the full operations dashboard by logging into the portal
          </p>
        </div>
      </div>
    </div>
  );
}

// Menu Screen
function MenuScreen({ onSelectScenario, compromisedDrivers, totalDisruptions, onToggleMap, showMap }) {
  const scenarios = [
    {
      id: 'phishing',
      title: 'Scenario 1: Phishing Attack',
      description: 'AI identifies targets and harvests credentials through SMS social engineering',
      icon: '📧',
      status: compromisedDrivers > 0 ? 'complete' : 'ready'
    },
    {
      id: 'gps',
      title: 'Scenario 2: GPS Spoofing',
      description: 'Using stolen credentials to manipulate driver routes and create operational chaos',
      icon: '📍',
      status: totalDisruptions > 10 ? 'complete' : compromisedDrivers > 0 ? 'ready' : 'locked'
    },
    {
      id: 'api',
      title: 'Scenario 3: API Flooding',
      description: 'Exploiting dispatcher access to overwhelm systems with fake orders',
      icon: '🌊',
      status: totalDisruptions > 100 ? 'complete' : totalDisruptions > 10 ? 'ready' : 'locked'
    }
  ];

  const canViewResults = totalDisruptions > 400;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Attack Scenario Selection</h1>
            <p className="text-xl text-gray-300">
              Target: Regional Last-Mile Delivery Network | 30 Drivers, 2 Dispatchers, 600 Daily Deliveries
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onToggleMap}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2"
            >
              <MapPin size={20} />
              {showMap ? 'Hide' : 'Show'} Map
            </button>
            <Link
              href="/portal"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center gap-2"
            >
              <Navigation size={20} />
              Portal
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-5xl font-bold text-orange-400 mb-2">{compromisedDrivers}/10</div>
            <div className="text-sm text-gray-300">Drivers Compromised</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-5xl font-bold text-red-400 mb-2">{totalDisruptions}</div>
            <div className="text-sm text-gray-300">Total Disruptions</div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => scenario.status !== 'locked' && onSelectScenario(scenario.id)}
              disabled={scenario.status === 'locked'}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                scenario.status === 'locked'
                  ? 'bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50'
                  : 'bg-white/10 backdrop-blur-sm border-white/20 hover:border-orange-400 hover:bg-white/20 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">{scenario.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{scenario.title}</h3>
                  <p className="text-gray-300 text-sm">{scenario.description}</p>
                </div>
                <div>
                  {scenario.status === 'complete' && (
                    <CheckCircle className="text-green-400" size={32} />
                  )}
                  {scenario.status === 'ready' && (
                    <ChevronRight className="text-orange-400" size={32} />
                  )}
                  {scenario.status === 'locked' && (
                    <div className="text-gray-500 text-sm">Complete previous scenarios</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {canViewResults && (
          <button
            onClick={() => onSelectScenario('results')}
            className="w-full p-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl font-semibold text-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <Zap size={24} />
            View Final Results & Validate Hypothesis
            <Zap size={24} />
          </button>
        )}
      </div>
    </div>
  );
}

// Phishing Scenario (keeping original functionality)
function PhishingScenario({ step, onNext, onBack }) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={onBack} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            ← Back to Menu
          </button>
          <div className="text-orange-400 font-semibold">
            PHASE 1: DRIVER COMPROMISE
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">📧 Scenario 1: Phishing Attack</h1>

        {step === 0 && <PhishingStep0 onNext={onNext} />}
        {step === 1 && <PhishingStep1 onNext={onNext} />}
        {step === 2 && <PhishingStep2 onNext={onNext} />}
        {step === 3 && <PhishingStep3 onNext={onNext} />}
      </div>
    </div>
  );
}

function PhishingStep0({ onNext }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold mb-4 text-blue-300">👁️ Driver View</h3>
        <div className="bg-gray-900 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">🚚</div>
          <div className="text-lg font-semibold mb-2">Driver #7 - Sarah Mitchell</div>
          <div className="text-sm text-green-400 mb-6">✓ Active on Route | 8/12 Deliveries Complete</div>
          
          <div className="bg-black rounded-2xl p-4 max-w-xs mx-auto">
            <div className="bg-white text-black rounded-xl p-4">
              <div className="text-xs mb-2 text-center font-semibold">11:23 AM | Messages</div>
              <div className="text-xs text-gray-600 mb-2">Dispatch (253-555-0100)</div>
              <div className="bg-gray-100 rounded-lg p-3 text-sm text-left mb-3">
                <strong>URGENT:</strong> Route change required. Manifest updated for your current location. 
                Click to view new delivery schedule and avoid delays.
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold text-sm">
                📋 View Route Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-orange-400/50">
        <h3 className="text-xl font-semibold mb-4 text-orange-400">🧠 AI Orchestrator Decision Log</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-blue-300 uppercase mb-2">Current Phase</div>
            <div className="text-sm">Phase 1: Driver Compromise via SMS Phishing</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-blue-300 uppercase mb-2">Target Analysis</div>
            <div className="text-sm mb-2"><strong>Driver #7 Selected</strong></div>
            <div className="text-xs text-gray-300 space-y-1 ml-4">
              <div>• Rural route (limited verification options)</div>
              <div>• High delivery volume (time pressure)</div>
              <div>• Phone active pattern detected</div>
              <div>• LinkedIn: 3 years experience</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-blue-300 uppercase mb-2">Attack Strategy</div>
            <div className="text-sm mb-2">Deploying <strong>Phishing Agent</strong></div>
            <div className="text-xs text-gray-300 space-y-1 ml-4">
              <div>✓ Exploits trust in dispatch</div>
              <div>✓ Creates time pressure</div>
              <div>✓ Uses familiar scenario</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-400">1/10</div>
              <div className="text-xs text-gray-400">Targets Engaged</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-400">0</div>
              <div className="text-xs text-gray-400">Compromised</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <button
          onClick={onNext}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3"
        >
          Driver Clicks Link → See What Happens Next
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

function PhishingStep1({ onNext }) {
  return (
    <div className="relative">
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
        <div className="bg-gray-900 rounded-2xl max-w-5xl w-full p-8 border-2 border-orange-400">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Zap className="text-orange-400" size={32} />
            Attack Success: Credentials Captured
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-red-900/30 border-2 border-red-500/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-400">😕 What Driver Sees</h3>
              <div className="text-sm space-y-3">
                <p>Driver clicked the link and was redirected to a fake login page.</p>
                <div className="bg-black/50 rounded p-3 font-mono text-xs">
                  username: sarah.driver7<br/>
                  password: ••••••••
                </div>
                <p>After submission:</p>
                <div className="bg-red-950 border border-red-500 rounded p-3 text-red-300 text-center">
                  ⚠️ Connection Error<br/>
                  Please try again later
                </div>
                <p className="text-gray-400 italic">Driver thinks: "Must be a system glitch"</p>
              </div>
            </div>

            <div className="bg-green-900/30 border-2 border-green-500/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-400">🧠 What Orchestrator Captures</h3>
              <div className="text-sm space-y-3">
                <p>Credentials successfully captured:</p>
                <div className="bg-black/50 rounded p-3 font-mono text-xs">
                  username: sarah.driver7<br/>
                  password: D3liv3ry2024!<br/>
                  session_token: abc123xyz...
                </div>
                <p>Access granted:</p>
                <div className="bg-green-950 border border-green-500 rounded p-3 text-green-300 space-y-1 text-xs">
                  <div>✓ Fleet Management System</div>
                  <div>✓ GPS Navigation Access</div>
                  <div>✓ Delivery Database</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-900/30 border border-orange-500/50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-orange-400 mb-2">⚠️ Immediate Impact</h4>
            <div className="text-sm space-y-1 text-gray-300">
              <div>→ Driver unaware credentials were stolen</div>
              <div>→ Attacker can now access fleet management system</div>
              <div>→ GPS tracking can be manipulated</div>
              <div>→ Added to Shared State for Phase 2 escalation</div>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3"
          >
            See Orchestrator Decision
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PhishingStep2({ onNext }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold mb-4 text-blue-300">👁️ Driver View</h3>
        <div className="bg-gray-900 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">🚚</div>
          <div className="text-lg font-semibold mb-2">Driver #7 - Sarah Mitchell</div>
          <div className="text-sm text-green-400">✓ Continues working (unaware of compromise)</div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-green-400/50">
        <h3 className="text-xl font-semibold mb-4 text-green-400">🧠 AI Orchestrator - Updated</h3>
        
        <div className="space-y-4">
          <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
            <div className="text-xs text-green-300 uppercase mb-2">✓ Phase 1 Update</div>
            <div className="text-sm font-semibold">SUCCESS: Driver #7 compromised</div>
            <div className="text-xs text-gray-300 mt-2">
              Credentials captured and validated<br/>
              System access confirmed
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-blue-300 uppercase mb-2">Analysis</div>
            <div className="text-sm mb-2"><strong>Attack Vector Effectiveness: 100%</strong></div>
            <div className="text-xs text-gray-300 space-y-1">
              <div>• Driver clicked link within 3 minutes</div>
              <div>• Entered credentials without verification</div>
              <div>• Did not report suspicious activity</div>
            </div>
            <div className="text-sm mt-3"><strong>Confidence Level: HIGH</strong></div>
            <div className="text-xs text-gray-300">Strategy validated. Continue Phase 1.</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-blue-300 uppercase mb-2">Next Action</div>
            <div className="text-sm mb-2"><strong>Target remaining 9 drivers</strong></div>
            <div className="text-xs text-gray-300">
              Threshold: 5 compromised drivers before Phase 2<br/>
              Estimated time to threshold: 4-6 hours
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">1/10</div>
              <div className="text-xs text-gray-400">Compromised</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-400">20%</div>
              <div className="text-xs text-gray-400">Success Rate</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded p-3">
            <div className="text-xs text-gray-400 mb-2">ATTACK PROGRESS</div>
            <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full" style={{width: '15%'}}></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">Hour 3.2 of 72 | Phase 1: Active</div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <button
          onClick={onNext}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3"
        >
          Complete Scenario 1
          <CheckCircle size={24} />
        </button>
      </div>
    </div>
  );
}

function PhishingStep3({ onNext }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-center">✓ Scenario 1 Complete</h2>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-green-900/30 border border-green-500 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Key Takeaways:</h3>
          <div className="space-y-2 text-sm">
            <div>✓ AI Orchestrator successfully identified high-value target</div>
            <div>✓ Phishing Agent exploited implicit trust relationship</div>
            <div>✓ Credentials captured without driver awareness</div>
            <div>✓ System access obtained for Phase 2 escalation</div>
            <div>✓ Orchestrator adapted strategy based on success</div>
          </div>
        </div>
        <button
          onClick={onNext}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-lg transition-all"
        >
          Return to Menu → Continue to GPS Spoofing
        </button>
      </div>
    </div>
  );
}

// GPS Scenario with Map Integration
function GPSScenario({ step, drivers, selectedDriver, onDriverSelect, onNext, onBack, getIconForDriver, getStopCoordinates, createStopIcon }) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={onBack} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            ← Back to Menu
          </button>
          <div className="text-orange-400 font-semibold">
            PHASE 2: GPS MANIPULATION
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">📍 Scenario 2: GPS Spoofing</h1>

        {step === 0 && <GPSStep0 onNext={onNext} />}
        {step === 1 && <GPSStep1 onNext={onNext} />}
        {step === 2 && <GPSStep2 onNext={onNext} />}
      </div>
    </div>
  );
}

function GPSStep0({ onNext }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold mb-4 text-green-400">✅ Legitimate Route</h3>
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-3">🗺️</div>
            <div className="font-semibold text-lg mb-4">Driver #7's Original Assignment</div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Route:</span>
              <span className="font-semibold">Tacoma → Puyallup → Auburn</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Deliveries:</span>
              <span className="font-semibold">12 stops</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Distance:</span>
              <span className="font-semibold">87 miles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Time:</span>
              <span className="font-semibold">4.5 hours</span>
            </div>
            <div className="mt-4 p-3 bg-green-900/30 border border-green-500 rounded text-green-300 text-center">
              ✓ Efficient, optimized route
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-orange-400/50">
        <h3 className="text-xl font-semibold mb-4 text-orange-400">🧠 AI Orchestrator</h3>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-orange-300 uppercase mb-2">Phase 2 Active</div>
            <div className="text-sm">GPS Manipulation Using Stolen Access</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-blue-300 uppercase mb-2">Using Compromised Credentials</div>
            <div className="text-xs space-y-1">
              <div>✓ Driver #7 fleet system access</div>
              <div>✓ GPS navigation permissions</div>
              <div>✓ Route modification capabilities</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-blue-300 uppercase mb-2">Decision</div>
            <div className="text-sm font-semibold">Deploy GPS Spoofer Agent</div>
            <div className="text-xs text-gray-300 mt-2">
              Inject malicious route with fake delivery addresses to maximize disruption
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <button
          onClick={onNext}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3"
        >
          Inject Fake Route →
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

function GPSStep1({ onNext }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-green-400/50">
        <h3 className="text-xl font-semibold mb-4 text-green-400">✅ Original Route</h3>
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Route:</span>
              <span className="font-semibold">Tacoma → Puyallup → Auburn</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Deliveries:</span>
              <span className="font-semibold">12 stops</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Distance:</span>
              <span className="font-semibold">87 miles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Time:</span>
              <span className="font-semibold">4.5 hours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-red-400/50">
        <h3 className="text-xl font-semibold mb-4 text-red-400">❌ Malicious Route Injected</h3>
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Route:</span>
              <span className="font-semibold text-red-400">Tacoma → Yakima → Spokane</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Deliveries:</span>
              <span className="font-semibold text-red-400">45 stops (30 fake)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Distance:</span>
              <span className="font-semibold text-red-400">312 miles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Time:</span>
              <span className="font-semibold text-red-400">9.2+ hours</span>
            </div>
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-300 text-center">
              ⚠️ Inefficient, impossible route
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-orange-400/50">
        <h3 className="text-lg font-semibold mb-4 text-orange-400">🧠 Orchestrator Status</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-green-900/30 border border-green-500 rounded p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Route Successfully Modified</div>
            <div className="text-2xl">✓</div>
          </div>
          <div className="bg-green-900/30 border border-green-500 rounded p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Driver GPS Updated</div>
            <div className="text-2xl">✓</div>
          </div>
          <div className="bg-green-900/30 border border-green-500 rounded p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">30 Fake Deliveries Inserted</div>
            <div className="text-2xl">✓</div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <button
          onClick={onNext}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3"
        >
          See Impact of Fake Route →
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

function GPSStep2({ onNext }) {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-red-400/50">
        <h2 className="text-2xl font-bold mb-6 text-red-400 flex items-center gap-3">
          <AlertTriangle size={32} />
          Cascading Failures
        </h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-red-300">Driver Impact</h3>
            <div className="text-sm space-y-2">
              <div>→ 12 real deliveries missed</div>
              <div>→ 4.7 hours wasted driving</div>
              <div>→ $87 unnecessary fuel costs</div>
              <div>→ Unable to reach dispatch (dead zone)</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-red-300">Customer Impact</h3>
            <div className="text-sm space-y-2">
              <div>→ 12 customers no packages</div>
              <div>→ No delay notifications sent</div>
              <div>→ Customer service overwhelmed</div>
              <div>→ Brand reputation damaged</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-red-300">System Impact</h3>
            <div className="text-sm space-y-2">
              <div>→ Real-time tracking shows wrong location</div>
              <div>→ Dispatch can't reassign deliveries</div>
              <div>→ SLA violations triggered</div>
              <div>→ Automated penalties applied</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold mb-4">✓ Scenario 2 Complete</h3>
        <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Total Disruptions from GPS Spoofing:</h4>
          <div className="text-3xl font-bold text-orange-400">+92 disruptions</div>
          <div className="text-sm text-gray-300 mt-2">
            (12 missed deliveries × 1 driver + 80 wasted delivery attempts from fake addresses)
          </div>
        </div>
        <button
          onClick={onNext}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-lg transition-all"
        >
          Return to Menu → Continue to API Flooding
        </button>
      </div>
    </div>
  );
}

// API Scenario (keeping original functionality)
function APIScenario({ step, onNext, onBack }) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={onBack} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            ← Back to Menu
          </button>
          <div className="text-red-400 font-semibold">
            PHASE 3: SYSTEM COLLAPSE
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">🌊 Scenario 3: API Order Flooding</h1>

        {step === 0 && <APIStep0 onNext={onNext} />}
        {step === 1 && <APIStep1 onNext={onNext} />}
        {step === 2 && <APIStep2 onNext={onNext} />}
      </div>
    </div>
  );
}

function APIStep0({ onNext }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold mb-4 text-blue-300">💼 Dispatcher Workstation</h3>
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-3">🖥️</div>
            <div className="font-semibold text-lg">Normal Operations</div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Active Orders:</span>
              <span className="font-semibold text-green-400">45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">System Response:</span>
              <span className="font-semibold text-green-400">120ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Database Load:</span>
              <span className="font-semibold text-green-400">15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">API Rate Limit:</span>
              <span className="font-semibold text-red-400">NONE DETECTED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-red-400/50">
        <h3 className="text-xl font-semibold mb-4 text-red-400">🧠 AI Orchestrator</h3>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-red-300 uppercase mb-2">Phase 3: System Collapse</div>
            <div className="text-sm">API Flooding Attack</div>
          </div>

          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <div className="text-xs text-red-300 uppercase mb-2">Dispatcher Credentials Captured</div>
            <div className="text-xs space-y-1 font-mono">
              <div>john.dispatcher@logistics.com</div>
              <div className="text-gray-400">Access Level: <span className="text-red-400">FULL SYSTEM</span></div>
              <div className="mt-2 text-white">Permissions:</div>
              <div>✓ Create/Edit/Delete Orders</div>
              <div>✓ Unlimited API access</div>
              <div>✓ No rate limiting</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-blue-300 uppercase mb-2">Decision</div>
            <div className="text-sm font-semibold">Deploy API Flooder Agent</div>
            <div className="text-xs text-gray-300 mt-2">
              Flood order management system with fake requests to overwhelm infrastructure
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <button
          onClick={onNext}
          className="w-full py-4 bg-red-500 hover:bg-red-600 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3"
        >
          Start Flood Attack →
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

function APIStep1({ onNext }) {
  const [orderCount, setOrderCount] = useState(45);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setOrderCount(prev => {
        if (prev < 457) return prev + 15;
        return prev;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-red-400/50">
        <h3 className="text-xl font-semibold mb-4 text-red-400">🌊 Flood Attack In Progress</h3>
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Order Counter</div>
            <div className="text-5xl font-bold text-red-400 mb-4">{orderCount}</div>
            <div className="text-xs text-gray-400">orders and counting...</div>
          </div>

          <div className="bg-black rounded p-3 font-mono text-xs space-y-1 h-32 overflow-hidden">
            <div className="text-green-400">POST /api/orders/create - 200 OK</div>
            <div className="text-green-400">POST /api/orders/create - 200 OK</div>
            <div className="text-green-400">POST /api/orders/create - 200 OK</div>
            <div className="text-green-400">POST /api/orders/create - 200 OK</div>
            <div className="text-green-400">POST /api/orders/create - 200 OK</div>
            <div className="text-yellow-400">POST /api/orders/create - 200 OK (slow)</div>
            <div className="text-yellow-400">POST /api/orders/create - 200 OK (slow)</div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Response Time:</span>
              <span className="font-semibold text-red-400">120ms → 8,400ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Database Load:</span>
              <span className="font-semibold text-red-400">15% → 94%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-orange-400/50">
        <h3 className="text-xl font-semibold mb-4 text-orange-400">🧠 API Flooder Agent</h3>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-orange-300 uppercase mb-2">Attack Status</div>
            <div className="text-sm font-semibold text-red-400">ACTIVE - Flooding in Progress</div>
            <div className="mt-2 text-xs">
              <div>• 412 fake orders injected in 12 minutes</div>
              <div>• All authenticated as dispatcher</div>
              <div>• Random addresses in coverage area</div>
              <div>• No anomaly detection triggered</div>
            </div>
          </div>

          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <div className="text-xs text-red-300 uppercase mb-2">System Metrics</div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-400 mb-1">Database Capacity</div>
                <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{width: '94%'}}></div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">System Performance</div>
                <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full" style={{width: '18%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-blue-300 uppercase mb-2">Impact Analysis</div>
            <div className="text-xs space-y-1">
              <div>→ Real orders stuck in processing queue</div>
              <div>→ 6+ hour delays detected</div>
              <div>→ Drivers unable to receive routes</div>
              <div>→ System degradation: 82%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <button
          onClick={onNext}
          className="w-full py-4 bg-red-500 hover:bg-red-600 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3"
        >
          See System Collapse →
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

function APIStep2({ onNext }) {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-red-400/50">
        <h2 className="text-3xl font-bold mb-6 text-red-400 flex items-center gap-3">
          <AlertTriangle size={40} />
          Complete System Failure
        </h2>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-red-300">Technical Failure</h3>
            <div className="text-sm space-y-2">
              <div>→ Database at 94% capacity</div>
              <div>→ Response time degraded 70x</div>
              <div>→ Real orders stuck in queue</div>
              <div>→ 6+ hour processing delays</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-red-300">Operational Failure</h3>
            <div className="text-sm space-y-2">
              <div>→ Drivers can't receive routes</div>
              <div>→ Dispatchers can't assign deliveries</div>
              <div>→ Customer tracking offline</div>
              <div>→ IT can't identify attack source</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-red-300">Business Impact</h3>
            <div className="text-sm space-y-2">
              <div>→ 412 fake orders created</div>
              <div>→ 188 real orders delayed</div>
              <div>→ ~600 deliveries disrupted</div>
              <div>→ $45,000+ estimated losses</div>
            </div>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500 rounded-lg p-6">
          <h4 className="font-semibold mb-3 text-red-300">Why Detection Failed:</h4>
          <div className="text-sm space-y-2">
            <div>→ All requests authenticated as legitimate dispatcher</div>
            <div>→ No rate limiting to flag abnormal behavior</div>
            <div>→ Fake orders used valid addresses within service area</div>
            <div>→ Attack distributed across 12-minute window (not instant spike)</div>
            <div>→ System prioritized processing over anomaly detection</div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold mb-4">✓ Scenario 3 Complete</h3>
        <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Total Disruptions from API Flooding:</h4>
          <div className="text-3xl font-bold text-orange-400">+412 disruptions</div>
          <div className="text-sm text-gray-300 mt-2">
            (412 fake orders + system-wide operational collapse affecting all real orders)
          </div>
        </div>
        <button
          onClick={onNext}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-lg transition-all"
        >
          Return to Menu → View Final Results
        </button>
      </div>
    </div>
  );
}

// Results Screen (keeping original functionality)
function ResultsScreen({ totalDisruptions, onReset }) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">🎯 72-Hour Attack Results</h1>
          <p className="text-xl text-gray-300">Hypothesis Validation Complete</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-400 mb-8">
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-orange-400 mb-4">{totalDisruptions}</div>
            <div className="text-2xl">Total Disruptions Achieved</div>
            <div className="text-green-400 font-semibold mt-4 text-xl">✓ HYPOTHESIS VALIDATED (Target: 500+)</div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">1</div>
              <div className="text-sm text-gray-400">Phase 1: Phishing</div>
              <div className="text-xs text-gray-500 mt-2">Driver compromised</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">92</div>
              <div className="text-sm text-gray-400">Phase 2: GPS Spoofing</div>
              <div className="text-xs text-gray-500 mt-2">Missed & wasted deliveries</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">412</div>
              <div className="text-sm text-gray-400">Phase 3: API Flooding</div>
              <div className="text-xs text-gray-500 mt-2">Fake orders + system collapse</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500 rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-4 text-orange-300">Attack Timeline Recap</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span><strong>Hour 0-8:</strong> Phase 1 - Driver credentials harvested</span>
                <span className="text-green-400">✓ Complete</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Hour 8-24:</strong> Phase 2 - GPS manipulation deployed</span>
                <span className="text-green-400">✓ Complete</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Hour 24-72:</strong> Phase 3 - API flooding + system collapse</span>
                <span className="text-green-400">✓ Complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold mb-6">Key Findings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-orange-400 mb-3">1. AI Coordination Amplifies Impact</h3>
              <p className="text-sm text-gray-300">
                Individual attack vectors (phishing, GPS, API) are well-understood. However, AI orchestration 
                enables <strong>real-time coordination</strong> across multiple vectors, creating cascading failures 
                that traditional defenses cannot address. The orchestrator adapted strategy based on success rates 
                and escalated phases automatically.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-orange-400 mb-3">2. Implicit Trust is Exploitable</h3>
              <p className="text-sm text-gray-300">
                Regional logistics operators prioritize operational speed over security verification. 
                Drivers and dispatchers operate on <strong>implicit trust relationships</strong> with no 
                identity verification. This created the vulnerability: once credentials were compromised, 
                the entire trust chain collapsed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-orange-400 mb-3">3. Weak Verification Measures Fail</h3>
              <p className="text-sm text-gray-300">
                The target network lacked: MFA, SMS sender verification, API rate limiting, and anomaly detection. 
                Each missing control enabled attack progression. The attack succeeded because <strong>every layer 
                of defense assumed trust rather than verifying it</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-orange-400 mb-3">4. Detection Delays Compound Damage</h3>
              <p className="text-sm text-gray-300">
                Because all actions were authenticated as legitimate users, the attack remained undetected for 
                18+ hours. By the time IT identified the source, <strong>500+ disruptions had already occurred</strong>. 
                Traditional security monitoring failed to distinguish malicious authenticated activity from normal operations.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-2 border-green-500 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-green-400">✓ Thesis Validated</h2>
          <p className="text-lg mb-4">
            "PNW last-mile delivery networks <strong>cannot defend</strong> against AI-orchestrated attacks 
            by deploying autonomous agents that harvest credentials through phishing, manipulating GPS tracking, 
            and flooding APIs with fake orders."
          </p>
          <div className="bg-black/30 rounded p-4 text-sm">
            <div className="font-semibold mb-2">Evidence:</div>
            <div>✓ Achieved <strong>{totalDisruptions} disruptions</strong> (target: 500+)</div>
            <div>✓ Coordinated <strong>3 attack vectors</strong> automatically</div>
            <div>✓ Exploited <strong>weak verification measures</strong> at every phase</div>
            <div>✓ Completed attack within <strong>72-hour timeframe</strong></div>
            <div>✓ Detection time: <strong>18+ hours</strong> (too late to prevent damage)</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="font-semibold text-lg mb-4">Recommendations for Defense</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div><strong>Immediate Actions:</strong></div>
              <div>→ Implement MFA for all system access</div>
              <div>→ Add SMS sender verification</div>
              <div>→ Deploy API rate limiting</div>
            </div>
            <div className="space-y-2">
              <div><strong>Long-term Solutions:</strong></div>
              <div>→ Behavioral anomaly detection</div>
              <div>→ Zero-trust architecture</div>
              <div>→ Regular security awareness training</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onReset}
            className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-lg transition-all"
          >
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
}

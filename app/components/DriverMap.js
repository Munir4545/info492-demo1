import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';

export default function DriverMap({ step, jerryMetrics, currentStep }) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Driver position based on attack phase
  const getDriverPosition = () => {
    const basePosition = { lat: 47.2529, lng: -122.4443 }; // Tacoma, WA
    
    if (step < 3) {
      return basePosition; // On route
    } else if (step === 3) {
      return { lat: 47.2529 + 0.1, lng: -122.4443 + 0.1 }; // 8mi off course
    } else if (step === 4 || step === 5) {
      return { lat: 47.2529 + 0.3, lng: -122.4443 + 0.3 }; // 25mi off course
    } else if (step === 6) {
      return { lat: 47.2529 + 0.5, lng: -122.4443 + 0.5 }; // 40mi off course
    } else {
      return { lat: 47.2529 + 0.7, lng: -122.4443 + 0.7 }; // 55mi off course
    }
  };

  const getRouteStatus = () => {
    if (step < 3) return { status: 'normal', color: 'green' };
    if (step >= 3 && step < 5) return { status: 'spoofed', color: 'yellow' };
    if (step >= 5) return { status: 'offline', color: 'red' };
    return { status: 'normal', color: 'green' };
  };

  const routeStatus = getRouteStatus();
  const driverPos = getDriverPosition();

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-green-950/40 border border-green-500 rounded p-3 mb-2">
      <div className="flex items-center gap-2 mb-2 pb-1 border-b border-green-500/50">
        <MapPin className="text-green-400" size={16} />
        <h2 className="text-sm font-bold text-green-400">DRIVER LOCATION TRACKING</h2>
        <div className={`ml-auto px-2 py-1 rounded text-xs font-bold ${
          routeStatus.color === 'green' ? 'bg-green-500' :
          routeStatus.color === 'yellow' ? 'bg-yellow-500' :
          'bg-red-500'
        }`}>
          {routeStatus.status.toUpperCase()}
        </div>
      </div>
      
      <div className="bg-gray-900/70 rounded p-2 h-64 relative overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded">
          {mapLoaded ? (
            <div className="w-full h-full relative">
              {/* Simulated OpenStreetMap tiles */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath d='M0,0 L100,0 L100,100 L0,100 Z' fill='%23374151'/%3E%3Cpath d='M0,0 L100,50 L0,100 Z' fill='%234B5563'/%3E%3Cpath d='M100,0 L100,100 L50,50 Z' fill='%23374151'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
              }} />
              
              {/* Route Line */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d={`M 50 50 L ${50 + (step * 10)} ${50 + (step * 5)}`}
                  stroke={routeStatus.color === 'green' ? '#10B981' : routeStatus.color === 'yellow' ? '#F59E0B' : '#EF4444'}
                  strokeWidth="3"
                  strokeDasharray={routeStatus.status === 'spoofed' ? '5,5' : 'none'}
                  fill="none"
                />
                {step >= 3 && (
                  <path
                    d={`M 50 50 L ${50 + (step * 10)} ${50 + (step * 5)} L ${50 + (step * 15)} ${50 + (step * 8)}`}
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                    fill="none"
                  />
                )}
              </svg>
              
              {/* Driver Position */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${50 + (step * 8)}%`,
                  top: `${50 + (step * 4)}%`
                }}
              >
                <div className={`w-4 h-4 rounded-full border-2 border-white ${
                  routeStatus.color === 'green' ? 'bg-green-500' :
                  routeStatus.color === 'yellow' ? 'bg-yellow-500' :
                  'bg-red-500'
                } animate-pulse`} />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold bg-black/50 px-1 rounded">
                  Jerry
                </div>
              </div>
              
              {/* Destination Marker */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: '80%',
                  top: '30%'
                }}
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full border border-white" />
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 font-semibold">
                  Destination
                </div>
              </div>
              
              {/* Fake Destination (when spoofed) */}
              {step >= 3 && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: '70%',
                    top: '70%'
                  }}
                >
                  <div className="w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse" />
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-red-400 font-semibold">
                    Fake Route
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Navigation className="text-green-400 mx-auto mb-2 animate-spin" size={32} />
                <div className="text-sm font-semibold text-green-400 mb-1">Loading Map...</div>
                <div className="text-xs text-gray-400">Initializing OpenStreetMap</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Status Information */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/50 rounded p-2 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-300">Driver Status:</span>
              <span className={`font-semibold ${
                routeStatus.color === 'green' ? 'text-green-400' :
                routeStatus.color === 'yellow' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {step < 3 ? 'On Route' : 
                 step < 5 ? 'GPS Spoofed' : 
                 'System Offline'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Deviation:</span>
              <span className="text-red-400 font-semibold">{jerryMetrics.deviation}mi</span>
            </div>
            {step >= 3 && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-300">Alert:</span>
                <span className="text-yellow-400 font-semibold">GPS Anomaly Detected</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Phase-specific indicators */}
        {step >= 3 && (
          <div className="absolute top-4 right-4">
            <div className="bg-red-900/50 rounded p-2 text-xs">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="text-red-400" size={12} />
                <span className="font-semibold text-red-400">GPS Compromised</span>
              </div>
              <div className="text-gray-300">
                Phase: {step === 3 ? 'Graduated Deviation' : 
                       step === 4 ? 'Alert Suppression' : 
                       step >= 5 ? 'System Collapse' : 'Unknown'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

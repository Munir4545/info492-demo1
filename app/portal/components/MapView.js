'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle map panning when driver is selected
function MapController({ selectedDriver }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedDriver) {
      map.setView([selectedDriver.location.lat, selectedDriver.location.lng], 11, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedDriver, map]);
  
  return null;
}

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons for different driver statuses
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const enRouteIcon = createCustomIcon('#3b82f6'); // blue
const deliveringIcon = createCustomIcon('#10b981'); // green
const loadingIcon = createCustomIcon('#64748b'); // gray
const completedIcon = createCustomIcon('#9333ea'); // purple
const compromisedIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative;">
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
      <div style="
        background-color: #ef4444;
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
      ">⚠</div>
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

// Create icons for delivery stops
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

export default function MapView({ drivers, selectedDriver, onDriverSelect }) {
  // Center of Washington State (roughly between Tacoma and Spokane)
  const washingtonCenter = [47.2, -120.0];
  
  // Key cities for reference
  const cities = [
    { name: 'Tacoma', lat: 47.2529, lng: -122.4443 },
    { name: 'Spokane', lat: 47.6588, lng: -117.4260 },
    { name: 'Yakima', lat: 46.6021, lng: -120.5059 },
    { name: 'Bellevue', lat: 47.6101, lng: -122.2015 },
    { name: 'Olympia', lat: 47.0379, lng: -122.9007 },
  ];

  const getIconForDriver = (driver) => {
    if (driver.isGpsCompromised) return compromisedIcon;
    
    switch (driver.status) {
      case 'En Route': return enRouteIcon;
      case 'Delivering': return deliveringIcon;
      case 'Loading': return loadingIcon;
      case 'Completed': return completedIcon;
      default: return enRouteIcon;
    }
  };

  // Helper to get approximate coordinates for addresses (mock data for demo)
  const getStopCoordinates = (driver, stopIndex) => {
    // Create a simple offset pattern around the driver's main location
    const baseLatoffsets = [0.01, 0.02, -0.01, 0.015];
    const baseLngOffsets = [0.015, -0.01, 0.02, -0.015];
    
    return {
      lat: driver.location.lat + (baseLatoffsets[stopIndex % baseLatoffsets.length] || 0),
      lng: driver.location.lng + (baseLngOffsets[stopIndex % baseLngOffsets.length] || 0)
    };
  };

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
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

        <MapController selectedDriver={selectedDriver} />
        
        {/* Driver markers */}
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            position={[driver.location.lat, driver.location.lng]}
            icon={getIconForDriver(driver)}
            eventHandlers={{
              click: () => onDriverSelect(driver)
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-slate-800">
                  {driver.isGpsCompromised && '⚠️ '}{driver.name}
                </p>
                <p className="text-slate-600">{driver.id}</p>
                <p className="text-slate-600">{driver.zone}</p>
                {driver.isGpsCompromised && (
                  <div className="mt-2 p-2 bg-red-50 rounded">
                    <p className="text-red-700 font-semibold text-xs">GPS COMPROMISED</p>
                    <p className="text-red-600 text-xs">Location data unreliable</p>
                  </div>
                )}
                <p className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    driver.isGpsCompromised ? 'bg-red-100 text-red-700' :
                    driver.status === 'En Route' ? 'bg-blue-100 text-blue-700' :
                    driver.status === 'Delivering' ? 'bg-green-100 text-green-700' :
                    driver.status === 'Completed' ? 'bg-purple-100 text-purple-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {driver.status}
                  </span>
                </p>
                <p className="text-slate-600 mt-1">{driver.packages} packages</p>
                <button 
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDriverSelect(driver);
                  }}
                >
                  View Route Details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Show route for selected driver */}
        {selectedDriver && selectedDriver.route && (
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
                  {stop.isSpoofed && (
                    <Circle
                      center={[coords.lat, coords.lng]}
                      radius={500}
                      pathOptions={{
                        color: '#ef4444',
                        fillColor: '#ef4444',
                        fillOpacity: 0.2,
                        weight: 2,
                        dashArray: '5, 5'
                      }}
                    />
                  )}
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
                        {stop.eta && <p className="text-slate-600 text-xs mt-1">ETA: {stop.eta}</p>}
                      </div>
                    </Popup>
                  </Marker>

                  {/* Highlight circle for in-progress stop */}
                  {stop.status === 'in-progress' && (
                    <Circle
                      center={[coords.lat, coords.lng]}
                      radius={300}
                      pathOptions={{
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.1,
                        weight: 2
                      }}
                    />
                  )}
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
          {!selectedDriver ? (
            <>
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
                <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-white"></div>
                <span className="text-xs text-slate-600 dark:text-slate-400">Completed</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                <span className="text-xs text-slate-600 dark:text-slate-400">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                <span className="text-xs text-slate-600 dark:text-slate-400">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-500 border-2 border-white"></div>
                <span className="text-xs text-slate-600 dark:text-slate-400">Pending</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedDriver.route.filter(s => s.status !== 'completed').length} stops remaining
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

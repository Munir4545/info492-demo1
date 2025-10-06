'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icons for attack visualization
const createAttackIcon = (isCompromised) => {
  const color = isCompromised ? '#ef4444' : '#3b82f6'; // red for compromised, blue for normal
  const pulseColor = isCompromised ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)';
  
  return L.divIcon({
    className: 'custom-attack-marker',
    html: `
      <div style="position: relative;">
        ${isCompromised ? `
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: ${pulseColor};
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "></div>
        ` : ''}
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          position: relative;
          z-index: 10;
        ">
          ${isCompromised ? `
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: 10px;
              font-weight: bold;
            ">⚠</div>
          ` : ''}
        </div>
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

export default function AttackMapView({ drivers, compromisedDrivers = [] }) {
  const washingtonCenter = [47.2, -120.0];
  
  // Check if a driver is compromised
  const isDriverCompromised = (driverId) => {
    return compromisedDrivers.some(cd => cd.id === driverId);
  };

  // Create fake attack origin points (phishing servers, GPS spoofers, etc.)
  const attackOrigins = [
    { id: 'attack-1', name: 'Phishing Server', lat: 47.6062, lng: -122.3321, type: 'phishing' },
    { id: 'attack-2', name: 'GPS Spoofer', lat: 47.5, lng: -119.5, type: 'gps' },
    { id: 'attack-3', name: 'API Flooder', lat: 46.7, lng: -121.0, type: 'api' },
  ];

  const getAttackOriginIcon = (type) => {
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

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-red-300 dark:border-red-800">
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
        
        {/* Attack origin points */}
        {attackOrigins.map((origin) => (
          <div key={origin.id}>
            <Marker
              position={[origin.lat, origin.lng]}
              icon={getAttackOriginIcon(origin.type)}
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
          const compromised = isDriverCompromised(driver.id);
          
          return (
            <Marker
              key={driver.id}
              position={[driver.location.lat, driver.location.lng]}
              icon={createAttackIcon(compromised)}
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
                      <p className="text-red-600 text-xs">
                        {compromisedDrivers.find(cd => cd.id === driver.id)?.compromiseType}
                      </p>
                    </div>
                  )}
                  {!compromised && (
                    <p className="mt-2">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        {driver.status}
                      </span>
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Lines connecting attack origins to compromised drivers */}
        {compromisedDrivers.map((cd, idx) => {
          const driver = drivers.find(d => d.id === cd.id);
          if (!driver) return null;
          
          const origin = attackOrigins[idx % attackOrigins.length];
          
          return (
            <Polyline
              key={`attack-line-${cd.id}`}
              positions={[
                [origin.lat, origin.lng],
                [driver.location.lat, driver.location.lng],
              ]}
              pathOptions={{
                color: '#ef4444',
                weight: 2,
                opacity: 0.6,
                dashArray: '10, 10',
              }}
            />
          );
        })}
      </MapContainer>

      {/* Attack Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border-2 border-red-300 dark:border-red-700 z-[1000]">
        <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">⚠️ Attack Visualization</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Compromised</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white"></div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Attack Origin</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold">{compromisedDrivers.length}</span> units compromised
          </p>
        </div>
      </div>
    </div>
  );
}


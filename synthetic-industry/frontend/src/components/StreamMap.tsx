import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Delivery, Coordinates } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const colorsByCriticality: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#3b82f6',
  standard: '#6b7280'
};

const createDeliveryIcon = (delivery: Delivery, isCurrent: boolean) => {
  const color = colorsByCriticality[delivery.criticality] || colorsByCriticality.standard;
  const size = isCurrent ? 32 : 26;
  const opacity = delivery.status === 'delivered' ? 0.45 : 1;
  const borderColor = delivery.status === 'delivered'
    ? '#10b981'
    : isCurrent
      ? '#38bdf8'
      : '#ffffff';
  const glow = isCurrent ? '0 0 16px rgba(56,189,248,0.9)' : '0 2px 8px rgba(0,0,0,0.35)';

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        opacity: ${opacity};
        border-radius: 50%;
        border: 3px solid ${borderColor};
        box-shadow: ${glow};
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

const startIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      background-color: #0f172a;
      color: #22d3ee;
      border-radius: 8px;
      border: 2px solid #22d3ee;
      padding: 4px 6px;
      font-size: 16px;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(15,23,42,0.6);
    ">🏥</div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const driverIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      background: linear-gradient(135deg, #0ea5e9, #2563eb);
      color: #ffffff;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 4px 14px rgba(14,165,233,0.7);
    ">🚚</div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

interface StreamMapProps {
  deliveries: Delivery[];
  driverLocation: Coordinates | null;
  startLocation: Coordinates | null;
  routeName?: string;
  currentDeliveryId?: string | null;
}

const MapBoundsSetter: React.FC<{
  deliveries: Delivery[];
  startLocation: Coordinates | null;
  driverLocation: Coordinates | null;
}> = ({ deliveries, startLocation, driverLocation }) => {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [];
    if (startLocation) {
      points.push([startLocation.lat, startLocation.lng]);
    }
    deliveries.forEach(delivery => {
      points.push([delivery.destination.lat, delivery.destination.lng]);
    });
    if (driverLocation) {
      points.push([driverLocation.lat, driverLocation.lng]);
    }

    if (points.length > 0) {
      try {
        map.fitBounds(points, { padding: [50, 50], maxZoom: 13 });
      } catch (error) {
        // Ignore fit errors
      }
    }
  }, [deliveries, startLocation, driverLocation, map]);

  return null;
};

const formatStatus = (status: Delivery['status']) =>
  status.replace(/_/g, ' ').toUpperCase();

export const StreamMap: React.FC<StreamMapProps> = ({
  deliveries,
  driverLocation,
  startLocation,
  routeName,
  currentDeliveryId
}) => {
  const mapRef = useRef<L.Map>(null);
  const center: [number, number] = [47.6062, -122.3321];

  const orderedDeliveries = useMemo(
    () => [...deliveries].sort((a, b) => a.sequenceNumber - b.sequenceNumber),
    [deliveries]
  );

  const polylinePoints = useMemo(() => {
    const points: [number, number][] = [];
    if (startLocation) {
      points.push([startLocation.lat, startLocation.lng]);
    }
    orderedDeliveries.forEach(delivery => {
      points.push([delivery.destination.lat, delivery.destination.lng]);
    });
    return points;
  }, [orderedDeliveries, startLocation]);

  const currentDelivery = useMemo(
    () => orderedDeliveries.find(delivery => delivery.id === currentDeliveryId) || null,
    [orderedDeliveries, currentDeliveryId]
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg h-full">
      <h2 className="text-2xl font-bold text-white mb-4">Real-time Map</h2>

      <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBoundsSetter
            deliveries={orderedDeliveries}
            startLocation={startLocation}
            driverLocation={driverLocation}
          />

          {polylinePoints.length > 1 && (
            <Polyline
              positions={polylinePoints}
              color="#38bdf8"
              weight={4}
              opacity={0.6}
              dashArray="6, 12"
            />
          )}

          {startLocation && (
            <Marker position={[startLocation.lat, startLocation.lng]} icon={startIcon}>
              <Popup>
                <div className="p-2">
                  <div className="font-bold text-lg">Start Location</div>
                  <div className="text-sm text-gray-500">Pharmacy / Dispatch</div>
                </div>
              </Popup>
            </Marker>
          )}

          {orderedDeliveries.map(delivery => {
            const isCurrent =
              currentDeliveryId === delivery.id && delivery.status !== 'delivered';
            const icon = createDeliveryIcon(delivery, isCurrent);

            return (
              <Marker
                key={delivery.id}
                position={[delivery.destination.lat, delivery.destination.lng]}
                icon={icon}
              >
                <Popup>
                  <div className="p-2 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">
                        Stop #{delivery.sequenceNumber}
                      </span>
                      <span className="uppercase text-xs tracking-wide text-gray-400">
                        {formatStatus(delivery.status)}
                      </span>
                    </div>
                    <div>
                      <strong>Medication:</strong> {delivery.medication}
                    </div>
                    <div>
                      <strong>Patient:</strong> {delivery.patient}
                    </div>
                    <div>
                      <strong>Criticality:</strong>{' '}
                      <span className="font-semibold">
                        {delivery.criticality.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <strong>ETA:</strong>{' '}
                      {new Date(delivery.estimatedDropoff).toLocaleTimeString()}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {driverLocation && (
            <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
              <Popup>
                <div className="p-2">
                  <div className="font-bold text-lg mb-1">Driver Position</div>
                  {currentDelivery ? (
                    <div className="text-sm">
                      Heading to stop #{currentDelivery.sequenceNumber}:{' '}
                      <strong>{currentDelivery.medication}</strong>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      Route completed or waiting for next assignment.
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
        <div>
          <span className="font-semibold text-white">
            {orderedDeliveries.length}{' '}
            {orderedDeliveries.length === 1 ? 'delivery' : 'deliveries'}
          </span>{' '}
          on {routeName || 'route'}
        </div>
        {currentDelivery && (
          <div>
            Current stop:{' '}
            <span className="font-semibold text-white">
              #{currentDelivery.sequenceNumber} • {currentDelivery.medication}
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
          <span className="text-gray-300">Critical</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
          <span className="text-gray-300">High</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          <span className="text-gray-300">Medium</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-500 rounded-full mr-2" />
          <span className="text-gray-300">Standard</span>
        </div>
      </div>
    </div>
  );
};

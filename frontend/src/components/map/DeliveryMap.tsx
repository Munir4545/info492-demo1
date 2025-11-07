import { MapContainer, TileLayer, Polyline, CircleMarker, Circle, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useMemo } from 'react';
import { useAttackContext } from '../../state/AttackProvider';
import { Delivery } from '../../types/simulation';
import { useDriverPosition, getStatusColor } from './driverMarkers';

const center: [number, number] = [47.6062, -122.3321];

const pharmacyLocations = [
  {
    name: 'Walgreens Capitol Hill',
    coords: [47.6205, -122.3493] as [number, number]
  },
  {
    name: 'CVS University District',
    coords: [47.6575, -122.3107] as [number, number]
  },
  {
    name: 'Rite Aid Downtown',
    coords: [47.6097, -122.3331] as [number, number]
  },
  {
    name: 'Fred Meyer Ballard Pharmacy',
    coords: [47.6699, -122.3761] as [number, number]
  },
  {
    name: 'Seattle Children’s Hospital Pharmacy',
    coords: [47.6624, -122.316] as [number, number]
  }
];

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -36]
});

const pharmacyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -36]
});

function cascadeColor(delivery: Delivery) {
  if (delivery.status === 'compromised') return '#ef4444';
  if (delivery.status === 'delayed' || delivery.status === 'backlog' || delivery.status === 'at_risk') return '#facc15';
  return '#22c55e';
}

const i90Corridor: [number, number][] = [
  [47.6035, -122.335],
  [47.602, -122.32],
  [47.6005, -122.303],
  [47.599, -122.287],
  [47.597, -122.268],
  [47.595, -122.245],
  [47.592, -122.215],
  [47.59, -122.19]
];

const DeliveryMap = () => {
  const { deliveries } = useAttackContext();
  const driverPosition = useDriverPosition();

  const polylines = useMemo(() =>
    deliveries
      .filter((delivery) => delivery.route && delivery.route.length > 1)
      .map((delivery) => delivery.route.map((point) => [point.lat, point.lng]) as [number, number][]),
    [deliveries]
  );

  return (
    <div className="h-[520px] overflow-hidden rounded-lg border border-gray-800">
      <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full" preferCanvas>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <Polyline positions={i90Corridor} pathOptions={{ color: '#facc15', weight: 2, opacity: 0.6, dashArray: '6 8' }} />
        {polylines.map((points, idx) => (
          <Polyline key={`poly-${idx}`} positions={points} pathOptions={{ color: '#38bdf8', weight: 3, opacity: 0.6 }} />
        ))}
        {pharmacyLocations.map((pharmacy) => (
          <Marker key={pharmacy.name} position={pharmacy.coords} icon={pharmacyIcon}>
            <Popup>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-gray-800">{pharmacy.name}</div>
                <div>Seattle Metro</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {deliveries.map((delivery, index) => {
          const [lastPoint] = delivery.route.slice(-1);
          const radius = delivery.cascadeAffected || delivery.status === 'compromised' ? 900 : 0;
          const startPoint = delivery.route[0];
          const progress = Math.min(index / deliveries.length + 0.2, 1);
          const ringRadius = radius ? radius * (1 + Math.sin(progress * Math.PI) * 0.35) : 0;
          return (
            <>
              <CircleMarker
                key={delivery.id}
                center={[lastPoint.lat, lastPoint.lng]}
                radius={8}
                pathOptions={{
                  color: '#0f172a',
                  weight: 2,
                  fillColor: getStatusColor(delivery),
                  fillOpacity: 0.9
                }}
              >
                <Popup>
                  <div className="space-y-1 text-sm">
                    <div className="font-semibold text-gray-800">{delivery.id}</div>
                    <div>Medication: {delivery.medication}</div>
                    <div>Status: {delivery.status.replace('_', ' ')}</div>
                    <div>Driver: {delivery.driver}</div>
                    <div>Patient: {delivery.patient}</div>
                  </div>
                </Popup>
              </CircleMarker>
              {ringRadius > 0 && (
                <Circle
                  key={`${delivery.id}-ripple`}
                  center={[lastPoint.lat, lastPoint.lng]}
                  radius={ringRadius}
                  pathOptions={{
                    color: cascadeColor(delivery),
                    weight: 1,
                    fillOpacity: 0.05
                  }}
                />
              )}
              <Circle
                center={[startPoint.lat, startPoint.lng]}
                radius={200}
                pathOptions={{ color: '#38bdf8', weight: 1, dashArray: '4 4', opacity: 0.4 }}
              />
            </>
          );
        })}
        {driverPosition && (
          <Marker position={[driverPosition.lat, driverPosition.lng]} icon={driverIcon}>
            <Popup>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-gray-800">Driver Position</div>
                <div>{driverPosition.label}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;



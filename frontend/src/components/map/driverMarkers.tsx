import { useMemo } from 'react';
import { useAttackContext } from '../../state/AttackProvider';

const statusToColor: Record<string, string> = {
  compromised: '#ef4444',
  delayed: '#f97316',
  backlog: '#facc15',
  at_risk: '#facc15',
  in_transit: '#22c55e',
  default: '#22c55e'
};

export const useDriverPosition = () => {
  const { deliveries, simulation } = useAttackContext();

  return useMemo(() => {
    if (!simulation.selectedDriver) return null;
    const driverDeliveries = deliveries.filter((delivery) =>
      delivery.driver.toLowerCase().includes(simulation.selectedDriver?.split('_')[1] ?? '')
    );
    if (!driverDeliveries.length) return null;

    const route = driverDeliveries[0].route;
    if (!route.length) return null;

    const progress = Math.min(simulation.elapsedMinutes / 20, 1);
    const index = Math.min(Math.floor(progress * (route.length - 1)), route.length - 1);
    const point = route[index];

    return {
      lat: point.lat,
      lng: point.lng,
      label: `${driverDeliveries[0].driver} @ T+${simulation.elapsedMinutes}m`
    };
  }, [deliveries, simulation.elapsedMinutes, simulation.selectedDriver]);
};

export const getStatusColor = (status: string) => statusToColor[status] ?? statusToColor.default;



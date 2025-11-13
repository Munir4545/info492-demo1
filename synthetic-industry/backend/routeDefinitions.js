// Route Definition - Single main delivery route (I-90 Corridor)

const mainRoute = {
  id: 'main_route',
  name: 'Main Delivery Route (I-90 Corridor)',
  description: 'Primary delivery route through Seattle metro area',
  
  // Pharmacy (starting point)
  pharmacy: {
    name: 'Central Pharmacy Hub',
    coords: { lat: 47.6205, lng: -122.3493 }  // Capitol Hill area
  },
  
  // Main route waypoints following I-90 corridor pattern
  waypoints: [
    { lat: 47.6205, lng: -122.3493 },  // Start (Capitol Hill)
    { lat: 47.6195, lng: -122.3350 },  // Madison St
    { lat: 47.6189, lng: -122.3201 },  // First Hill
    { lat: 47.6150, lng: -122.3000 },  // Central District
    { lat: 47.6100, lng: -122.2800 },  // Madrona
    { lat: 47.6050, lng: -122.2500 },  // Leschi
    { lat: 47.5950, lng: -122.2200 },  // Mercer Island approach
    { lat: 47.5850, lng: -122.2000 },  // Mercer Island
    { lat: 47.5750, lng: -122.1800 },  // East Mercer Island
    { lat: 47.5650, lng: -122.1600 }   // Bellevue approach
  ],
  
  // Geographic bounds for random dropoff generation
  bounds: {
    minLat: 47.5500,
    maxLat: 47.6500,
    minLng: -122.3600,
    maxLng: -122.1500
  },
  
  // Route characteristics
  characteristics: {
    averageDistance: 15,  // miles
    typicalDeliveryCountPerDay: 80,
    urbanSuburbanMix: 'mixed',
    trafficPattern: 'variable'
  }
};

module.exports = { mainRoute };

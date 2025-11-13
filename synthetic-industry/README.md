# Synthetic Industry Generator

**Agentic Pharmaceutical Delivery Data Generation System**

A standalone service that continuously generates and streams synthetic pharmaceutical delivery data over a 24-hour period. The system operates autonomously, simulating real-world delivery operations with time-based scheduling, driver movement, and status updates streamed through Server-Sent Events (SSE).

---

## 🎯 Overview

The Synthetic Industry Generator is an independent service that:

- **Runs autonomously** for 24 hours once started
- **Generates deliveries continuously** based on realistic time-of-day patterns
- **Streams real-time events** via SSE endpoint
- **Simulates driver behavior** with load balancing across a driver pool
- **Varies cargo types** with different criticality levels (critical, high, medium, standard)
- **Updates delivery status** progressively (pickup_scheduled → pickup_in_progress → in_transit → delivered)
- **Tracks driver locations** with realistic movement along routes
- **Can be consumed** by external systems (like pharma-attack-sim) via API

---

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Port:** 3002
- **SSE Streaming:** Real-time event delivery via Server-Sent Events
- **REST API:** Data access endpoints for external consumption
- **Agentic Loop:** Autonomous generation and delivery lifecycle management
- **Driver Pool:** 12 drivers from pharma-attack-sim profiles
- **Medication Pool:** 30+ medications across 4 criticality levels

### Frontend (React + Vite + TypeScript)
- **Port:** 8001
- **Real-time UI:** Live updates via SSE client
- **Interactive Map:** Leaflet-based visualization of active deliveries
- **Event Stream:** Live log of all delivery events
- **Statistics Dashboard:** Real-time metrics and breakdowns
- **Control Panel:** Start/stop/pause simulation controls

---

## 📦 Project Structure

```
synthetic-industry/
├── backend/
│   ├── server.js                  # Express server with SSE streaming
│   ├── synthetic-stream.js        # Streaming endpoint and agentic loop
│   ├── routeGenerator.js          # Delivery generation logic
│   ├── routeDefinitions.js        # Single route definition (I-90 corridor)
│   ├── medicationPool.js          # Medication catalog and assignment
│   ├── driverManager.js           # Driver pool and load balancing
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ControlPanel.tsx        # Start/stop controls
│   │   │   ├── LiveStatistics.tsx      # Real-time stats
│   │   │   ├── EventStream.tsx         # Event log display
│   │   │   └── StreamMap.tsx           # Real-time map with Leaflet
│   │   ├── lib/
│   │   │   └── syntheticStream.ts      # SSE client
│   │   ├── types.ts                    # TypeScript definitions
│   │   ├── App.tsx                     # Main application
│   │   ├── main.tsx                    # Entry point
│   │   └── index.css                   # Tailwind styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Backend Setup

```bash
cd synthetic-industry/backend
npm install
npm start
```

Backend will start on **http://localhost:3002**

### Frontend Setup

```bash
cd synthetic-industry/frontend
npm install
npm run dev
```

Frontend will start on **http://localhost:8001**

### Start the Simulation

1. Open **http://localhost:8001** in your browser
2. Click **"Start 24-Hour Simulation"**
3. Watch deliveries generate and stream in real-time!

---

## 📡 API Endpoints

### Streaming Endpoint

```
GET /api/synthetic/stream
```

Server-Sent Events (SSE) stream providing real-time delivery events.

**Event Types:**
- `connected` - Initial connection with current state
- `delivery_created` - New delivery generated
- `driver_assigned` - Driver assigned to delivery
- `pickup_started` - Driver begins pickup
- `in_transit` - Delivery en route
- `location_update` - Driver position update (every 30s)
- `status_change` - Delivery status changed
- `delivered` - Delivery completed
- `simulation_started` - Simulation began
- `simulation_stopped` - Simulation ended
- `simulation_complete` - 24-hour period finished

### Control Endpoints

```
POST /api/synthetic/start
Body: { "duration": 24 }  # hours
```

Start the agentic simulation.

```
POST /api/synthetic/stop
```

Stop the simulation.

```
POST /api/synthetic/pause
```

Pause the simulation (can be resumed).

```
POST /api/synthetic/resume
```

Resume paused simulation.

### Data Access Endpoints (REST)

```
GET /api/synthetic/stats
```

Get current simulation statistics.

```
GET /api/synthetic/active
```

Get all active deliveries (for external consumption).

```
GET /api/synthetic/completed
```

Get all completed deliveries.

```
GET /api/synthetic/deliveries/:id
```

Get specific delivery by ID.

```
GET /api/synthetic/drivers
```

Get all driver statistics.

```
GET /api/health
```

Health check endpoint.

---

## 🔌 Integration with pharma-attack-sim

The synthetic industry can be consumed by the pharma-attack-sim system:

### Option 1: Direct Stream Consumption

```typescript
// In pharma-attack-sim frontend
const eventSource = new EventSource('http://localhost:3002/api/synthetic/stream');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Use real delivery data in attack simulation
};
```

### Option 2: REST API Polling

```typescript
// In pharma-attack-sim backend
async function fetchActiveDeliveries() {
  const response = await fetch('http://localhost:3002/api/synthetic/active');
  return response.json();
}
```

### CORS Configuration

Backend is configured to accept requests from:
- `http://localhost:8001` (Synthetic industry frontend)
- `http://localhost:5173` (Pharma-attack-sim frontend)
- `http://localhost:3000` (Alternative frontend port)

---

## 📊 Delivery Generation

### Time-Based Patterns

**Peak Hours (8:00-12:00, 14:00-18:00)**
- High frequency: ~2 deliveries per minute
- More critical medications
- Multiple drivers active

**Off-Peak Hours (12:00-14:00, 18:00-22:00)**
- Moderate frequency: ~1 delivery per minute
- Mix of criticality levels

**Low Activity (22:00-8:00)**
- Low frequency: ~1 delivery per 3 minutes
- Primarily emergency/critical only
- Fewer active drivers

### Driver Pool (12 Drivers)

From pharma-attack-sim profiles:
- Jerry (#7) - TIME_PRESSURED
- Sofia (#14) - OVERLOADED
- Marcus (#3) - ROUTINE
- Priya (#11), Noah (#21), Lena (#18), Maya (#5), Elliot (#9), Samir (#12), Kira (#2), Riley (#16), Adrian (#4)

Drivers are randomly assigned with load balancing (2-4 deliveries per driver typical).

### Medication Categories

**Critical (30%)**: Insulin, EpiPen, Chemotherapy kits, Emergency meds  
**High (40%)**: Blood pressure meds, Antiretrovirals, Dialysis supplies  
**Medium (20%)**: Beta blockers, Antibiotics, Routine prescriptions  
**Standard (10%)**: OTC medications, Medical supplies  

### Route

Single main delivery route: **I-90 Corridor** through Seattle metro area
- Multiple waypoints along the route
- Random dropoff generation with perpendicular offsets
- Realistic travel times and location updates

---

## 🎮 Features

### Agentic Operation
- Runs autonomously for 24 hours
- Self-managing delivery lifecycle
- Automatic status transitions
- Periodic location updates

### Real-Time Streaming
- Server-Sent Events (SSE) for low-latency updates
- Auto-reconnection on connection loss
- Event filtering and rate control

### Driver Simulation
- Load balancing across driver pool
- Realistic movement along routes
- Multiple concurrent deliveries per driver

### Variable Cargo
- Random medication assignment
- Criticality-based urgency mapping
- Time-sensitive deliveries

### Progressive Updates
- Status: pickup_scheduled → pickup_in_progress → in_transit → delivered
- Location updates every 30 seconds for in-transit deliveries
- Time remaining calculations

---

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development

```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build  # Outputs to dist/

# Backend
# No build needed - runs directly with Node
```

---

## 📈 Performance Considerations

- **In-memory state management** with periodic cleanup
- **Event rate limiting** to prevent client overload
- **Connection pooling** for SSE clients
- **Efficient broadcasting** to all connected clients
- **Location update batching** (30-second intervals)
- **Completed delivery cleanup** to manage memory

---

## 🔧 Configuration

Backend configuration (currently hardcoded, can be moved to environment variables):

- **Port**: 3002
- **Delivery check interval**: 10 seconds
- **Location update interval**: 30 seconds
- **Max events in frontend**: 200 (rolling window)
- **Route**: I-90 Corridor (Seattle)

---

## 🌟 Key Design Decisions

### Standalone Service
Runs independently from pharma-attack-sim, allowing:
- Independent deployment and scaling
- Multiple consumers
- Isolated development and testing

### Single Route
Simplified design with one main route:
- Easier to understand and visualize
- Realistic dropoff variation via random offsets
- Can be extended to multiple routes in future

### Random Driver Assignment
Each delivery randomly assigns a driver:
- Any driver can carry any medication
- Load balancing prevents overload
- Realistic distribution

### Variable Cargo
Each driver carries different medications:
- More realistic than fixed assignments
- Criticality determines urgency and timing
- Matches pharma-attack-sim structure

---

## 🚧 Future Enhancements

### Phase 2
- Traffic simulation with time-of-day delays
- Weather effects on delivery times
- Multiple pharmacy support
- Driver breaks and shift changes
- Emergency delivery injection

### Phase 3
- Machine learning from patterns
- Historical data generation
- Custom route creation
- 3D elevation-aware routing

---

## 📝 Data Format

Deliveries match the pharma-attack-sim `Delivery` interface for seamless integration:

```typescript
interface Delivery {
  id: string;
  driver: string;
  driverId: string;
  pharmacy: string;
  pharmacyCoords: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  medication: string;
  criticality: 'critical' | 'high' | 'medium' | 'standard';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  status: 'pickup_scheduled' | 'pickup_in_progress' | 'in_transit' | 'delivered';
  timeRemaining: number;
  patient: string;
  route: RoutePoint[];
  scheduledPickupTime: string;
  estimatedArrival: string;
  createdAt: string;
}
```

---

## 🐛 Troubleshooting

**Stream not connecting?**
- Check backend is running on port 3002
- Verify CORS configuration
- Check browser console for errors

**No deliveries generating?**
- Ensure simulation is started (click "Start" button)
- Check time of day (low activity 22:00-8:00)
- Verify backend logs for errors

**Map not loading?**
- Ensure internet connection (loads tiles from OpenStreetMap)
- Check Leaflet CSS is loaded
- Verify deliveries have valid coordinates

---

## 📄 License

MIT

---

## 🤝 Contributing

This is part of the pharma-attack-sim ecosystem. See parent project for contribution guidelines.

---

## 📞 Support

For issues or questions, refer to the main pharma-attack-sim project documentation.

---

**Built with:** Node.js, Express, React, TypeScript, Vite, Tailwind CSS, Leaflet, Server-Sent Events

**Status:** ✅ Production Ready

# Synthetic Industry Generation Plan

## Overview
Create a **standalone agentic synthetic pharmaceutical delivery industry system** that continuously generates and streams delivery data over a 24-hour period. The system operates as an independent service outside of `pharma-attack-sim`, simulating real-world delivery operations with time-based scheduling, driver movement, and status updates streamed through a simple endpoint. This synthetic industry can be consumed by the attack simulation or other systems via API.

## Core Concept

### Continuous Streaming Delivery System
- **Single Route**: One predefined route (e.g., I-90 corridor or main delivery route)
- **Random Driver Assignment**: Each delivery randomly assigns a driver from the available pool
- **Variable Cargo**: Each driver carries different medications (cargo) with varying criticality levels
- **Time-Based Generation**: Deliveries are created throughout the day at realistic intervals
- **Agentic Operation**: System runs autonomously for 24 hours once started
- **Streaming Endpoint**: Real-time data stream via Server-Sent Events (SSE) or WebSocket
- **Progressive Updates**: Deliveries evolve over time (status changes, location updates, completion)
- **Realistic Timing**: Delivery creation, pickup, transit, and completion follow realistic patterns

---

## 1. Route Definition System

### 1.1 Single Route Structure
The system uses one main delivery route defined as:
- **Route Name**: Primary delivery route (e.g., "I-90 Corridor", "Main Delivery Route")
- **Base Coordinates**: Array of waypoints defining the route path
- **Geographic Bounds**: Min/max lat/lng for random dropoff generation along the route
- **Route Characteristics**:
  - Average distance
  - Typical delivery count range
  - Traffic patterns
  - Urban/suburban mix

### 1.2 Route Definition

#### Main Delivery Route (I-90 Corridor)
- **Path**: Primary delivery route through Seattle metro area
- **Coordinates**: Start at [47.60, -122.33], following I-90 corridor pattern
- **Waypoints**: Multiple waypoints along the route for realistic path generation
- **Characteristics**: 
  - Mix of urban and suburban areas
  - Variable delivery density based on time of day
  - Realistic traffic patterns
  - Multiple dropoff locations along the route

---

## 2. Randomization System

### 2.1 Driver Assignment Algorithm
```typescript
function assignDriver(): Driver {
  // Random selection from available driver pool
  // Each driver can handle multiple deliveries
  // Load balancing ensures fair distribution
  const availableDrivers = getAvailableDrivers();
  return availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
}
```

**Driver Pool**: Based on pharma-attack-sim driver profiles:
- Jerry (#7) - TIME_PRESSURED persona
- Sofia (#14) - OVERLOADED persona  
- Marcus (#3) - ROUTINE persona
- Priya (#11), Noah (#21), Lena (#18), Maya (#5), Elliot (#9), etc.

### 2.2 Dropoff Location Generation
For each delivery along the single route:
1. **Select Random Segment**: Pick a random segment along the route polyline
2. **Generate Offset**: Add random perpendicular offset (0-500m) to simulate actual addresses
3. **Validate**: Ensure coordinates are within route bounds
4. **Snap to Road**: Optionally snap to nearest road coordinate (if using routing API)

**Algorithm**:
```typescript
function generateDropoff(route: Route): Coordinates {
  const segmentIndex = Math.floor(Math.random() * (route.waypoints.length - 1));
  const start = route.waypoints[segmentIndex];
  const end = route.waypoints[segmentIndex + 1];
  
  // Interpolate along segment
  const t = Math.random(); // 0 to 1
  const baseLat = start.lat + (end.lat - start.lat) * t;
  const baseLng = start.lng + (end.lng - start.lng) * t;
  
  // Add random offset
  const offsetDistance = Math.random() * 500; // meters
  const offsetAngle = Math.random() * 2 * Math.PI;
  
  // Convert to lat/lng offset (approximate)
  const latOffset = offsetDistance / 111000 * Math.cos(offsetAngle);
  const lngOffset = offsetDistance / (111000 * Math.cos(baseLat * Math.PI / 180)) * Math.sin(offsetAngle);
  
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset
  };
}
```

### 2.3 Cargo (Medication) Assignment
Each driver is assigned variable cargo (medications) with different criticality levels. The cargo can vary per delivery:

**Medication Categories** (matching pharma-attack-sim):
- **Critical (30%)**: Insulin (Humalog), EpiPen (0.3mg), Chemotherapy Adjunct Kit, Emergency medications
- **High (40%)**: Blood Pressure Meds (Lisinopril), Antiretroviral Therapy, Dialysis Supplies, Respiratory Support Kit
- **Medium (20%)**: Beta Blockers, Pediatric Antibiotics, Routine prescriptions
- **Standard (10%)**: Routine Prescription, Medical Supplies, Over-the-counter medications

**Algorithm**:
```typescript
const medicationPool = {
  critical: ['Insulin (Humalog)', 'EpiPen (0.3mg)', 'Chemotherapy Adjunct Kit', 'Oncology Trial Medication', ...],
  high: ['Blood Pressure Meds (Lisinopril)', 'Antiretroviral Therapy', 'Dialysis Supplies', 'Respiratory Support Kit', ...],
  medium: ['Beta Blockers', 'Pediatric Antibiotics', 'Routine Prescription Refill', ...],
  standard: ['Routine Prescription', 'Medical Supplies', 'Over-the-Counter Medications', ...]
};

function assignCargo(): Medication {
  const rand = Math.random();
  if (rand < 0.30) return randomFrom(critical);
  if (rand < 0.70) return randomFrom(high);
  if (rand < 0.90) return randomFrom(medium);
  return randomFrom(standard);
}
```

**Cargo Variation**:
- Each driver can carry different medications on different deliveries
- Same driver may have critical cargo on one delivery, standard on another
- Cargo criticality determines urgency and time sensitivity
- Matches pharma-attack-sim delivery structure

### 2.4 Driver Assignment
- **Random Selection**: Each delivery randomly assigns a driver from the available pool
- **Load Balancing**: Distribute deliveries across drivers (2-4 deliveries per driver typical)
- **Driver Profiles**: Use pharma-attack-sim driver profiles (Jerry, Sofia, Marcus, etc.)
- **Multiple Deliveries**: Each driver can handle multiple deliveries throughout the day
- **Cargo Independence**: Driver assignment is independent of cargo type - any driver can carry any medication

---

## 3. Continuous Streaming Architecture

### 3.1 Agentic Operation Model
The system operates as an autonomous agent that:
- **Runs for 24 hours** from start time
- **Generates deliveries continuously** based on time-of-day patterns
- **Updates existing deliveries** (status changes, location updates)
- **Streams all events** through a single endpoint
- **Maintains state** of all active deliveries and drivers

### 3.2 Time-Based Delivery Generation
Deliveries are created throughout the day following realistic patterns:

**Peak Hours (8:00-12:00, 14:00-18:00)**:
- Higher delivery frequency (1-2 per minute)
- More critical medications
- Multiple drivers active

**Off-Peak Hours (12:00-14:00, 18:00-22:00)**:
- Moderate frequency (1 per 2-3 minutes)
- Mix of criticality levels

**Low Activity (22:00-8:00)**:
- Low frequency (1 per 5-10 minutes)
- Primarily emergency/critical only
- Fewer active drivers

**Algorithm**:
```typescript
function shouldGenerateDelivery(currentTime: Date, config: Config): boolean {
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  
  // Peak hours: 8-12, 14-18
  if ((hour >= 8 && hour < 12) || (hour >= 14 && hour < 18)) {
    return Math.random() < 0.7; // 70% chance per minute
  }
  
  // Off-peak: 12-14, 18-22
  if ((hour >= 12 && hour < 14) || (hour >= 18 && hour < 22)) {
    return Math.random() < 0.3; // 30% chance per minute
  }
  
  // Low activity: 22-8
  return Math.random() < 0.1; // 10% chance per minute
}
```

### 3.3 Delivery Lifecycle
Each delivery progresses through states over time:

```
1. CREATED (t=0)
   └─> Stream: { type: 'delivery_created', delivery: {...} }
   
2. PICKUP_SCHEDULED (t=0)
   └─> Stream: { type: 'pickup_scheduled', deliveryId, scheduledTime }
   
3. PICKUP_IN_PROGRESS (t=+5min)
   └─> Stream: { type: 'pickup_started', deliveryId, driverId }
   
4. IN_TRANSIT (t=+10min)
   └─> Stream: { type: 'in_transit', deliveryId, location: {...} }
   └─> Stream: { type: 'location_update', deliveryId, location: {...} } (every 30s)
   
5. DELIVERED (t=+45min)
   └─> Stream: { type: 'delivered', deliveryId, timestamp }
   
6. COMPLETED (t=+50min)
   └─> Stream: { type: 'completed', deliveryId }
```

### 3.4 Streaming Endpoint Design

#### Server-Sent Events (SSE) Approach
```
GET /api/synthetic/stream
```

**Response Format**:
```
data: {"type": "delivery_created", "timestamp": "2024-11-07T14:23:15Z", "data": {...}}

data: {"type": "location_update", "timestamp": "2024-11-07T14:23:45Z", "data": {...}}

data: {"type": "status_change", "timestamp": "2024-11-07T14:24:10Z", "data": {...}}
```

**Event Types**:
- `delivery_created` - New delivery generated
- `pickup_scheduled` - Pickup time assigned
- `pickup_started` - Driver begins pickup
- `in_transit` - Delivery en route
- `location_update` - Driver position update
- `status_change` - Delivery status changed
- `delivered` - Delivery completed
- `driver_assigned` - Driver assigned to delivery

### 3.5 Driver Movement Simulation
Active drivers move along routes in real-time:

```typescript
function updateDriverPositions(activeDeliveries: Delivery[], elapsedSeconds: number) {
  for (const delivery of activeDeliveries) {
    if (delivery.status === 'in_transit') {
      const progress = calculateProgress(delivery, elapsedSeconds);
      const currentLocation = interpolateRoute(delivery.route, progress);
      
      // Stream location update
      streamEvent({
        type: 'location_update',
        deliveryId: delivery.id,
        location: currentLocation,
        progress: progress
      });
    }
  }
}
```

**Update Frequency**:
- Location updates: Every 30 seconds for active deliveries
- Status checks: Every 10 seconds
- New delivery generation: Based on time-of-day patterns

---

## 4. Simple UI Design

### 4.1 Main Interface Layout
```
┌─────────────────────────────────────────────────────┐
│      Synthetic Industry Stream (24-Hour Agent)      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Control Panel]                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ Status: ● RUNNING | Elapsed: 3h 24m         │   │
│  │ Start Time: 2024-11-07 08:00:00             │   │
│  │ End Time: 2024-11-08 08:00:00               │   │
│  │                                             │   │
│  │ [▶ Start]  [⏸ Pause]  [⏹ Stop]  [🔄 Reset] │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Live Statistics]                                   │
│  ┌─────────────────────────────────────────────┐   │
│  │ Active Deliveries: 12                        │   │
│  │ Completed Today: 47                          │   │
│  │ Active Drivers: 5                           │   │
│  │ Critical: 4 | High: 5 | Med: 2 | Std: 1    │   │
│  │                                             │   │
│  │ Stream Status: ● Connected                  │   │
│  │ Events Received: 1,247                      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Live Event Stream]                                 │
│  ┌─────────────────────────────────────────────┐   │
│  │ 14:23:15 - Delivery D_001 created          │   │
│  │ 14:23:20 - Driver Jerry assigned to D_001  │   │
│  │ 14:23:45 - D_001 location: [47.62, -122.35]│   │
│  │ 14:24:10 - D_001 status: in_transit         │   │
│  │ 14:24:40 - Delivery D_002 created          │   │
│  │ ...                                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Map View]                                         │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │        [Real-time Map with Live Updates]    │   │
│  │        (Shows active deliveries, drivers)    │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 4.2 UI Components

#### Control Panel
- **Status Indicator**: Running/Paused/Stopped
- **Time Display**: Elapsed time, start/end times
- **Control Buttons**:
  - Start: Begin 24-hour simulation
  - Pause: Temporarily halt generation
  - Stop: End simulation early
  - Reset: Clear state and restart

#### Live Statistics Panel
- **Real-time Metrics**:
  - Active deliveries count
  - Completed deliveries today
  - Active drivers
  - Route distribution
  - Stream connection status
  - Total events received

#### Live Event Stream
- **Event Log**: Scrollable list of recent events
- **Auto-scroll**: Follows latest events
- **Filter Options**: Filter by event type
- **Color Coding**: Different colors for event types
- **Timestamp**: Each event shows precise time

#### Real-time Map
- **Live Updates**: Updates as events stream in
- **Driver Positions**: Real-time location markers
- **Delivery Status**: Color-coded by status
- **Route Visualization**: Show active routes
- **Click for Details**: Popup with delivery info

### 4.3 Visual Design
- **Clean, minimal interface**
- **Color coding**:
  - Route A: Blue
  - Route B: Green
  - Route C: Orange
  - Critical deliveries: Red markers
  - High priority: Yellow markers
  - Standard: Gray markers
- **Responsive layout**: Works on desktop and tablet

---

## 5. Implementation Details

### 5.1 Project Structure
```
info492-demo1/
├── pharma-attack-sim/          # Existing attack simulation (separate)
│   └── ...
│
└── synthetic-industry/         # NEW: Standalone synthetic industry generator
    ├── backend/
    │   ├── server.js            # Express server with SSE streaming
    │   ├── synthetic-stream.js  # Streaming endpoint and agentic loop
    │   ├── routeGenerator.js    # Route and delivery generation logic
    │   ├── routeDefinitions.js  # 3 route definitions
    │   ├── medicationPool.js    # Medication catalog
    │   ├── driverManager.js     # Driver assignment and management
    │   ├── package.json
    │   └── .env                 # Configuration
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── ControlPanel.tsx        # Start/stop controls
    │   │   │   ├── LiveStatistics.tsx      # Real-time stats
    │   │   │   ├── EventStream.tsx         # Event log display
    │   │   │   └── StreamMap.tsx           # Real-time map
    │   │   ├── lib/
    │   │   │   └── syntheticStream.ts      # SSE client
    │   │   ├── App.tsx
    │   │   └── main.tsx
    │   ├── package.json
    │   ├── vite.config.ts
    │   └── index.html
    │
    ├── README.md
    └── .gitignore
```

**Key Points**:
- **Standalone Project**: Independent from pharma-attack-sim
- **Separate Backend**: Own Express server (different port)
- **Separate Frontend**: Own React app (different port)
- **API Integration**: Can be consumed by pharma-attack-sim via API
- **Independent Deployment**: Can be deployed separately

### 5.2 Core Functions

#### `generateDelivery(currentTime: Date): Delivery`
Main generation function that:
1. Selects single route (always the same route)
2. Generates dropoff location along route
3. Assigns cargo (medication) with random criticality
4. Randomly assigns driver from pool
5. Generates route points from pharmacy to dropoff
6. Creates Delivery object matching pharma-attack-sim structure
7. Returns single delivery

#### `generateRoutePoints(route: Route, start: Coordinates, end: Coordinates): RoutePoint[]`
Generates intermediate waypoints along route path:
- Calculates distance
- Divides into 3-5 segments
- Interpolates coordinates
- Assigns timestamps based on speed

#### `assignDriver(): Driver`
Random driver assignment:
- Randomly selects from available driver pool
- Uses pharma-attack-sim driver names and IDs
- Balances load across drivers (prefers drivers with fewer active deliveries)
- Returns driver object with id and name

### 5.3 Streaming Endpoint Implementation

#### Backend Server-Sent Events (SSE)
```javascript
// synthetic-industry/backend/synthetic-stream.js
const express = require('express');
const router = express.Router();

let streamClients = [];
let simulationState = {
  running: false,
  startTime: null,
  endTime: null,
  activeDeliveries: new Map(),
  completedDeliveries: [],
  drivers: []
};

// SSE endpoint
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const clientId = Date.now();
  streamClients.push({ id: clientId, res });
  
  // Send initial state
  res.write(`data: ${JSON.stringify({
    type: 'connected',
    clientId,
    state: simulationState
  })}\n\n`);
  
  req.on('close', () => {
    streamClients = streamClients.filter(c => c.id !== clientId);
  });
});

// Start simulation
router.post('/start', (req, res) => {
  const { duration = 24 } = req.body; // hours
  simulationState.running = true;
  simulationState.startTime = new Date();
  simulationState.endTime = new Date(Date.now() + duration * 3600000);
  
  // Start agentic loop
  startAgenticLoop();
  
  res.json({ success: true, startTime: simulationState.startTime });
});

// Stop simulation
router.post('/stop', (req, res) => {
  simulationState.running = false;
  broadcastEvent({ type: 'simulation_stopped' });
  res.json({ success: true });
});

// Broadcast event to all connected clients
function broadcastEvent(event) {
  const message = `data: ${JSON.stringify({
    ...event,
    timestamp: new Date().toISOString()
  })}\n\n`;
  
  streamClients.forEach(client => {
    client.res.write(message);
  });
}

// Agentic loop - runs continuously
function startAgenticLoop() {
  const interval = setInterval(() => {
    if (!simulationState.running) {
      clearInterval(interval);
      return;
    }
    
    const now = new Date();
    if (now >= simulationState.endTime) {
      simulationState.running = false;
      broadcastEvent({ type: 'simulation_complete' });
      clearInterval(interval);
      return;
    }
    
    // Generate new deliveries based on time
    if (shouldGenerateDelivery(now)) {
      const delivery = generateDelivery(now);
      simulationState.activeDeliveries.set(delivery.id, delivery);
      broadcastEvent({
        type: 'delivery_created',
        data: delivery
      });
    }
    
    // Update existing deliveries
    updateActiveDeliveries(now);
    
  }, 1000); // Check every second
}

function updateActiveDeliveries(now) {
  for (const [id, delivery] of simulationState.activeDeliveries) {
    // Update location if in transit
    if (delivery.status === 'in_transit') {
      const location = calculateCurrentLocation(delivery, now);
      broadcastEvent({
        type: 'location_update',
        deliveryId: id,
        data: location
      });
    }
    
    // Check for status transitions
    const newStatus = checkStatusTransition(delivery, now);
    if (newStatus !== delivery.status) {
      delivery.status = newStatus;
      broadcastEvent({
        type: 'status_change',
        deliveryId: id,
        data: { status: newStatus }
      });
      
      if (newStatus === 'delivered') {
        simulationState.completedDeliveries.push(delivery);
        simulationState.activeDeliveries.delete(id);
      }
    }
  }
}

module.exports = router;
```

#### Frontend SSE Client
```typescript
// synthetic-industry/frontend/src/lib/syntheticStream.ts
export class SyntheticStreamClient {
  private eventSource: EventSource | null = null;
  private callbacks: Map<string, Function[]> = new Map();
  
  connect() {
    this.eventSource = new EventSource('/api/synthetic/stream');
    
    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleEvent(data);
    };
    
    this.eventSource.onerror = (error) => {
      console.error('Stream error:', error);
      // Reconnect logic
    };
  }
  
  on(eventType: string, callback: Function) {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, []);
    }
    this.callbacks.get(eventType)!.push(callback);
  }
  
  private handleEvent(data: any) {
    const callbacks = this.callbacks.get(data.type) || [];
    callbacks.forEach(cb => cb(data));
  }
  
  start(duration: number = 24) {
    return fetch('/api/synthetic/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration })
    });
  }
  
  stop() {
    return fetch('/api/synthetic/stop', {
      method: 'POST'
    });
  }
  
  disconnect() {
    this.eventSource?.close();
  }
}
```

### 5.4 Integration Points

#### Standalone Architecture
- **Independent Service**: Runs on separate ports (e.g., backend: 3002, frontend: 8001)
- **API Access**: pharma-attack-sim can consume stream via `/api/synthetic/stream`
- **Data Format**: Streamed deliveries match `Delivery` interface for compatibility
- **Cross-Service Communication**: pharma-attack-sim connects to synthetic-industry API

#### Integration with pharma-attack-sim
The synthetic industry can be consumed by the attack simulation in two ways:

**Option 1: Direct Stream Consumption**
```typescript
// In pharma-attack-sim frontend
const streamClient = new EventSource('http://localhost:3002/api/synthetic/stream');
streamClient.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update attack simulation state with real delivery data
};
```

**Option 2: API Polling**
```typescript
// In pharma-attack-sim backend
async function fetchActiveDeliveries() {
  const response = await fetch('http://localhost:3002/api/synthetic/active');
  return response.json();
}
```

**API Endpoints for External Consumption**:
- `GET /api/synthetic/stream` - SSE stream (for real-time)
- `GET /api/synthetic/active` - Get all active deliveries (REST)
- `GET /api/synthetic/deliveries/:id` - Get specific delivery
- `GET /api/synthetic/stats` - Get current statistics

---

## 6. Technical Considerations

### 6.1 Coordinate System
- Use WGS84 (standard lat/lng)
- Ensure coordinates are within Seattle metro bounds
- Validate dropoff locations are reasonable (not in water, etc.)

### 6.2 Performance & Scalability
- **Server-side Generation**: All generation happens on backend
- **Efficient Broadcasting**: Use connection pooling for SSE clients
- **State Management**: In-memory state with periodic persistence
- **Rate Limiting**: Limit events per second to prevent overload
- **Connection Management**: Handle client disconnects gracefully
- **Memory Management**: Clean up completed deliveries periodically
- **Optimized Updates**: Batch location updates if needed
- **Separate Ports**: Runs independently (backend: 3002, frontend: 8001)
- **CORS Configuration**: Allow cross-origin requests from pharma-attack-sim

### 6.3 Randomness
- Use seeded random for reproducibility (optional)
- Ensure good distribution across routes
- Avoid clustering of dropoff locations

### 6.4 Data Quality
- Validate all generated data
- Ensure route points are sequential
- Check timestamps are logical
- Verify medication criticality matches urgency

---

## 7. User Workflow

### 7.1 Basic Flow
1. **Open Stream UI**
2. **Connect to Stream**: Automatically connects to `/api/synthetic/stream`
3. **Start Simulation**: Click "Start" button
   - System begins 24-hour agentic operation
   - Deliveries start generating based on time patterns
4. **Monitor Live Stream**:
   - Watch events appear in real-time
   - View statistics updating
   - See map updates as deliveries progress
5. **Let It Run**: System operates autonomously for 24 hours
6. **Stop/Pause**: Can pause or stop at any time

### 7.2 Advanced Usage
1. **Customize Time Patterns**: Adjust delivery frequency curves
2. **Set Route Weights**: Control route distribution
3. **Configure Driver Pool**: Set number of active drivers
4. **Adjust Speed**: Speed up simulation (e.g., 24 hours in 1 hour)
5. **Export Data**: Export all generated deliveries at any point
6. **Filter Events**: Filter event stream by type
7. **Replay Mode**: Replay past events from log

---

## 8. Future Enhancements

### 8.1 Phase 2 Features
- **Traffic Simulation**: Add delays based on time of day and route
- **Weather Effects**: Impact on delivery times and route selection
- **Multiple Pharmacies**: Random pharmacy selection per delivery
- **Driver Breaks**: Simulate driver breaks and shift changes
- **Emergency Deliveries**: Inject urgent deliveries at random intervals
- **Route Optimization**: Drivers optimize routes with multiple deliveries

### 8.3 Phase 3 Features
- **Machine Learning**: Learn from real delivery patterns
- **Historical Data**: Generate based on past deliveries
- **Custom Routes**: User-defined route creation
- **3D Visualization**: Elevation-aware route generation

---

## 9. Testing Strategy

### 9.1 Unit Tests
- Route selection randomness
- Dropoff location generation
- Medication assignment distribution
- Route point interpolation

### 9.2 Integration Tests
- Full delivery generation pipeline
- Data format compatibility
- Map rendering with generated data
- Export/import functionality

### 9.3 Validation Tests
- Coordinate bounds checking
- Route point sequence validation
- Timestamp logic verification
- Driver load balancing

---

## 10. Success Criteria

### 10.1 Functional Requirements
✅ Stream deliveries continuously over 24-hour period
✅ Agentic operation - runs autonomously once started
✅ Time-based delivery generation following realistic patterns
✅ Real-time event streaming via SSE endpoint
✅ Progressive delivery updates (status, location)
✅ Driver movement simulation
✅ Live statistics and monitoring
✅ Pause/resume/stop controls
✅ Real-time map visualization
✅ Event log with filtering

### 10.2 Quality Requirements
✅ Generated data matches existing `Delivery` interface
✅ Coordinates are within Seattle metro area
✅ Route points are sequential and logical
✅ No duplicate deliveries
✅ Good distribution across drivers
✅ Varied cargo types per driver
✅ Realistic medication-to-criticality mapping

### 10.3 UX Requirements
✅ Simple, intuitive interface
✅ Real-time visual feedback
✅ Clear connection status indicators
✅ Smooth map updates without lag
✅ Easy start/stop controls
✅ Responsive design
✅ Event stream easy to read and filter

---

## 11. Implementation Priority

### Phase 1 (MVP) - Core Streaming Functionality
1. **Setup Standalone Project**: Create `synthetic-industry/` directory structure
2. **Backend Setup**: Express server on port 3002
3. Define single route (I-90 corridor or main delivery route)
4. Implement driver pool matching pharma-attack-sim drivers
5. Implement cargo (medication) assignment with criticality levels
6. Implement SSE streaming endpoint
7. Implement time-based delivery generation
8. Implement agentic loop (24-hour operation)
9. Implement delivery lifecycle (created → in_transit → delivered)
10. **Frontend Setup**: React app on port 8001
11. Basic UI with start/stop controls and event stream
12. Real-time statistics display (cargo distribution instead of route distribution)
13. Basic map integration with live updates
14. **CORS Configuration**: Allow pharma-attack-sim to consume API

### Phase 2 - Enhanced Features
1. Driver movement simulation with location updates
2. Advanced configuration options (time patterns, cargo distribution weights)
3. Driver load balancing and shift management
4. Route point generation with realistic timestamps
5. Event filtering and search
6. Data persistence and replay capability
7. **Driver Profile Integration**: Use pharma-attack-sim driver profiles with vulnerability scores
8. **Cargo Impact Simulation**: Different cargo types affect delivery urgency and timing
9. **REST API Endpoints**: For pharma-attack-sim integration
10. **API Documentation**: OpenAPI/Swagger docs
11. **Health Check Endpoint**: `/api/health` for monitoring
12. **Configuration API**: Allow runtime configuration changes

### Phase 3 - Polish
1. UI/UX improvements
2. Performance optimization
3. Error handling and validation
4. Documentation
5. Testing suite

---

## 12. Example Stream Events

### Event: Delivery Created
```json
{
  "type": "delivery_created",
  "timestamp": "2024-11-07T14:23:15.123Z",
  "data": {
    "id": "D_SYN_001",
    "driver": "Jerry (#7)",
    "driverId": "driver_7",
    "pharmacy": "Walgreens Capitol Hill",
    "pharmacyCoords": { "lat": 47.6205, "lng": -122.3493 },
    "destination": { "lat": 47.6342, "lng": -122.3187 },
    "medication": "Insulin (Humalog)",
    "criticality": "critical",
    "urgency": "critical",
    "status": "pickup_scheduled",
    "scheduledPickupTime": "2024-11-07T14:28:00.000Z",
    "patient": "Sarah Chen",
    "route": "Main Delivery Route (I-90 Corridor)"
  }
}
```

### Event: Location Update
```json
{
  "type": "location_update",
  "timestamp": "2024-11-07T14:23:45.456Z",
  "deliveryId": "D_SYN_001",
  "data": {
    "location": { "lat": 47.6250, "lng": -122.3350 },
    "progress": 0.25,
    "speed": 45,
    "estimatedArrival": "2024-11-07T14:38:00.000Z"
  }
}
```

### Event: Status Change
```json
{
  "type": "status_change",
  "timestamp": "2024-11-07T14:24:10.789Z",
  "deliveryId": "D_SYN_001",
  "data": {
    "oldStatus": "pickup_in_progress",
    "newStatus": "in_transit",
    "driverId": "driver_7"
  }
}
```

### Event: Delivery Completed
```json
{
  "type": "delivered",
  "timestamp": "2024-11-07T14:38:22.012Z",
  "deliveryId": "D_SYN_001",
  "data": {
    "deliveredAt": "2024-11-07T14:38:20.000Z",
    "actualDuration": 15.08,
    "onTime": true
  }
}
```

---

## Summary

This plan outlines a comprehensive **agentic streaming system** for generating synthetic pharmaceutical delivery data continuously over 24 hours:

### Key Features:
- **Single route** with multiple dropoff locations along the path
- **Random driver assignment** from pharma-attack-sim driver pool
- **Variable cargo** - each driver carries different medications with varying criticality
- **Time-based generation** following realistic delivery patterns throughout the day
- **Agentic operation** - runs autonomously for 24 hours once started
- **Streaming endpoint** (SSE) for real-time event delivery
- **Progressive updates** - deliveries evolve over time with status changes and location updates
- **Driver movement simulation** - real-time position tracking
- **Simple UI** for monitoring and control
- **Seamless integration** with existing pharma-attack-sim system

### Architecture:
- **Standalone Service**: Independent project outside pharma-attack-sim
- **Backend**: Node.js/Express with SSE streaming (port 3002)
- **Frontend**: React with EventSource client (port 8001)
- **State Management**: In-memory with periodic cleanup
- **Event Types**: delivery_created, location_update, status_change, delivered, etc.
- **API Integration**: Can be consumed by pharma-attack-sim or other services
- **CORS Enabled**: Allows cross-origin requests

### Deployment:
- **Development**: Run both services locally on different ports
- **Production**: Can be deployed separately (different servers/containers)
- **Communication**: pharma-attack-sim connects to synthetic-industry API

The system operates like a real delivery service, generating and updating deliveries continuously, making it perfect for long-running simulations and testing scenarios. As a standalone service, it can be used by multiple consumers and scaled independently.


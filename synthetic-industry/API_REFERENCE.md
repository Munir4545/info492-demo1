# API Reference

Complete API documentation for the Synthetic Industry Generator.

Base URL: `http://localhost:3002`

---

## 🌊 Streaming Endpoint

### GET `/api/synthetic/stream`

Server-Sent Events (SSE) stream for real-time delivery events.

**Headers:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Event Format:**
```json
{
  "type": "event_type",
  "timestamp": "2024-11-13T12:00:00.000Z",
  "eventId": 123,
  "data": { ... }
}
```

**Event Types:**

#### `connected`
Initial connection event with current state.
```json
{
  "type": "connected",
  "clientId": 1699900000000,
  "state": {
    "running": false,
    "activeDeliveries": 0,
    "completedDeliveries": 0,
    ...
  },
  "activeDeliveries": []
}
```

#### `delivery_created`
New delivery generated.
```json
{
  "type": "delivery_created",
  "data": {
    "id": "D_SYN_0001",
    "driver": "Jerry (#7)",
    "medication": "Insulin (Humalog)",
    "criticality": "critical",
    "status": "pickup_scheduled",
    ...
  }
}
```

#### `driver_assigned`
Driver assigned to delivery.
```json
{
  "type": "driver_assigned",
  "deliveryId": "D_SYN_0001",
  "driverId": "driver_7",
  "driverName": "Jerry (#7)"
}
```

#### `pickup_started`
Driver begins pickup.
```json
{
  "type": "pickup_started",
  "deliveryId": "D_SYN_0001",
  "driverId": "driver_7",
  "driverName": "Jerry (#7)"
}
```

#### `in_transit`
Delivery en route.
```json
{
  "type": "in_transit",
  "deliveryId": "D_SYN_0001",
  "location": { "lat": 47.6205, "lng": -122.3493 }
}
```

#### `location_update`
Driver position update (every 30 seconds).
```json
{
  "type": "location_update",
  "deliveryId": "D_SYN_0001",
  "data": {
    "location": { "lat": 47.6250, "lng": -122.3350 },
    "progress": 0.25,
    "timeRemaining": 15,
    "estimatedArrival": "2024-11-13T12:15:00.000Z"
  }
}
```

#### `status_change`
Delivery status changed.
```json
{
  "type": "status_change",
  "deliveryId": "D_SYN_0001",
  "data": {
    "oldStatus": "pickup_in_progress",
    "newStatus": "in_transit",
    "driverId": "driver_7"
  }
}
```

#### `delivered`
Delivery completed.
```json
{
  "type": "delivered",
  "deliveryId": "D_SYN_0001",
  "data": {
    "deliveredAt": "2024-11-13T12:20:00.000Z",
    "medication": "Insulin (Humalog)",
    "patient": "Sarah Chen"
  }
}
```

#### `simulation_started`
Simulation began.
```json
{
  "type": "simulation_started",
  "startTime": "2024-11-13T12:00:00.000Z",
  "endTime": "2024-11-14T12:00:00.000Z",
  "duration": 24
}
```

#### `simulation_stopped`
Simulation ended.
```json
{
  "type": "simulation_stopped",
  "stats": { ... }
}
```

#### `simulation_complete`
24-hour period finished.
```json
{
  "type": "simulation_complete",
  "message": "24-hour simulation completed",
  "stats": { ... }
}
```

---

## 🎮 Control Endpoints

### POST `/api/synthetic/start`

Start the agentic simulation.

**Request Body:**
```json
{
  "duration": 24  // hours (optional, defaults to 24)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Simulation started for 24 hours",
  "stats": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Simulation already running"
}
```

---

### POST `/api/synthetic/stop`

Stop the simulation.

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Simulation stopped",
  "stats": { ... }
}
```

---

### POST `/api/synthetic/pause`

Pause the simulation.

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Simulation paused"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Simulation not running"
}
```

---

### POST `/api/synthetic/resume`

Resume paused simulation.

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Simulation resumed"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Simulation already running"
}
```

---

## 📊 Data Access Endpoints

### GET `/api/synthetic/stats`

Get current simulation statistics.

**Response:**
```json
{
  "running": true,
  "activeDeliveries": 12,
  "completedDeliveries": 47,
  "totalGenerated": 59,
  "criticalityBreakdown": {
    "critical": 4,
    "high": 5,
    "medium": 2,
    "standard": 1
  },
  "activeDrivers": 5,
  "elapsedTime": 12340,
  "eventCount": 1247,
  "startTime": "2024-11-13T12:00:00.000Z",
  "endTime": "2024-11-14T12:00:00.000Z"
}
```

---

### GET `/api/synthetic/active`

Get all active deliveries.

**Response:**
```json
{
  "deliveries": [
    {
      "id": "D_SYN_0001",
      "driver": "Jerry (#7)",
      "driverId": "driver_7",
      "pharmacy": "Walgreens Capitol Hill",
      "pharmacyCoords": { "lat": 47.6205, "lng": -122.3493 },
      "destination": { "lat": 47.6342, "lng": -122.3187 },
      "medication": "Insulin (Humalog)",
      "criticality": "critical",
      "urgency": "critical",
      "status": "in_transit",
      "timeRemaining": 15,
      "patient": "Sarah Chen",
      "route": [ ... ],
      "routeName": "Main Delivery Route (I-90 Corridor)",
      "scheduledPickupTime": "2024-11-13T12:05:00.000Z",
      "estimatedArrival": "2024-11-13T12:20:00.000Z",
      "estimatedDuration": 15,
      "createdAt": "2024-11-13T12:00:00.000Z"
    },
    ...
  ],
  "count": 12
}
```

---

### GET `/api/synthetic/completed`

Get all completed deliveries.

**Response:**
```json
{
  "deliveries": [ ... ],
  "count": 47
}
```

---

### GET `/api/synthetic/deliveries/:id`

Get specific delivery by ID.

**Parameters:**
- `id` (path): Delivery ID (e.g., "D_SYN_0001")

**Response:**
```json
{
  "id": "D_SYN_0001",
  "driver": "Jerry (#7)",
  ...
}
```

**Error Response (404):**
```json
{
  "error": "Delivery not found",
  "id": "D_SYN_9999"
}
```

---

### GET `/api/synthetic/drivers`

Get all driver statistics.

**Response:**
```json
{
  "drivers": [
    {
      "id": "driver_7",
      "name": "Jerry",
      "displayName": "Jerry (#7)",
      "number": 7,
      "persona": "TIME_PRESSURED",
      "vulnerabilityScore": 92,
      "activeDeliveries": 2
    },
    ...
  ]
}
```

---

## 🏥 Health Check

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "synthetic-industry",
  "version": "1.0.0",
  "uptime": 12340.567,
  "timestamp": "2024-11-13T12:00:00.000Z"
}
```

---

## 🏠 Root Endpoint

### GET `/`

Service information and endpoint list.

**Response:**
```json
{
  "service": "Synthetic Industry Generator",
  "version": "1.0.0",
  "description": "Agentic pharmaceutical delivery data generation system",
  "endpoints": {
    "stream": "GET /api/synthetic/stream (SSE)",
    "start": "POST /api/synthetic/start",
    "stop": "POST /api/synthetic/stop",
    ...
  }
}
```

---

## 🔧 CORS Configuration

Backend accepts requests from:
- `http://localhost:8001` (Synthetic industry frontend)
- `http://localhost:5173` (Pharma-attack-sim frontend)
- `http://localhost:3000` (Alternative frontend port)

Credentials are enabled for all CORS origins.

---

## 📝 Data Types

### Delivery

```typescript
interface Delivery {
  id: string;                           // "D_SYN_0001"
  driver: string;                       // "Jerry (#7)"
  driverId: string;                     // "driver_7"
  driverNumber: number;                 // 7
  driverPersona: string;                // "TIME_PRESSURED"
  pharmacy: string;                     // "Walgreens Capitol Hill"
  pharmacyCoords: Coordinates;
  destination: Coordinates;
  medication: string;                   // "Insulin (Humalog)"
  criticality: Criticality;             // "critical"
  urgency: Urgency;                     // "critical"
  status: DeliveryStatus;               // "in_transit"
  timeRemaining: number;                // minutes
  patient: string;                      // "Sarah Chen"
  route: RoutePoint[];
  routeName: string;                    // "Main Delivery Route (I-90 Corridor)"
  scheduledPickupTime: string;          // ISO timestamp
  estimatedArrival: string;             // ISO timestamp
  estimatedDuration: number;            // minutes
  createdAt: string;                    // ISO timestamp
  compromiseHistory: any[];
  cascadeAffected: boolean;
  currentRouteIndex: number;
}
```

### Criticality

```typescript
type Criticality = 'critical' | 'high' | 'medium' | 'standard';
```

### Urgency

```typescript
type Urgency = 'critical' | 'high' | 'medium' | 'low';
```

### DeliveryStatus

```typescript
type DeliveryStatus = 
  | 'pickup_scheduled' 
  | 'pickup_in_progress' 
  | 'in_transit' 
  | 'delivered';
```

### RoutePoint

```typescript
interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: string;  // ISO timestamp
}
```

### Coordinates

```typescript
interface Coordinates {
  lat: number;
  lng: number;
}
```

---

## 📡 Client Examples

### JavaScript (Browser)

```javascript
// SSE Stream
const eventSource = new EventSource('http://localhost:3002/api/synthetic/stream');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data.type, data);
};

eventSource.onerror = (error) => {
  console.error('Stream error:', error);
};

// Start simulation
fetch('http://localhost:3002/api/synthetic/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ duration: 24 })
})
  .then(res => res.json())
  .then(data => console.log('Started:', data));

// Get active deliveries
fetch('http://localhost:3002/api/synthetic/active')
  .then(res => res.json())
  .then(data => console.log('Active deliveries:', data.deliveries));
```

### Node.js

```javascript
const EventSource = require('eventsource');

// SSE Stream
const es = new EventSource('http://localhost:3002/api/synthetic/stream');

es.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data.type, data);
};

// REST API
const fetch = require('node-fetch');

async function getStats() {
  const response = await fetch('http://localhost:3002/api/synthetic/stats');
  return response.json();
}
```

### Python

```python
import requests
import json
import sseclient

# SSE Stream
response = requests.get('http://localhost:3002/api/synthetic/stream', stream=True)
client = sseclient.SSEClient(response)

for event in client.events():
    data = json.loads(event.data)
    print(f"Event: {data['type']}", data)

# REST API
def get_stats():
    response = requests.get('http://localhost:3002/api/synthetic/stats')
    return response.json()

def start_simulation(duration=24):
    response = requests.post(
        'http://localhost:3002/api/synthetic/start',
        json={'duration': duration}
    )
    return response.json()
```

### cURL

```bash
# Stream events (watch in real-time)
curl -N http://localhost:3002/api/synthetic/stream

# Start simulation
curl -X POST http://localhost:3002/api/synthetic/start \
  -H "Content-Type: application/json" \
  -d '{"duration": 24}'

# Get statistics
curl http://localhost:3002/api/synthetic/stats

# Get active deliveries
curl http://localhost:3002/api/synthetic/active

# Stop simulation
curl -X POST http://localhost:3002/api/synthetic/stop
```

---

## 🔄 Rate Limits

No rate limits currently implemented. The system naturally throttles:
- **Delivery generation**: Time-based (varies by hour)
- **Location updates**: Every 30 seconds
- **Status checks**: Every 10 seconds

---

## ⚠️ Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Or for 404s:

```json
{
  "error": "Resource not found",
  "id": "resource_id"
}
```

---

## 📚 Additional Resources

- [README.md](./README.md) - Full documentation
- [QUICK_START.md](./QUICK_START.md) - Quick setup guide
- [pharma-attack-sim](../pharma-attack-sim/) - Parent project

---

**Version:** 1.0.0  
**Last Updated:** November 2024


# Synthetic Industry Model Explanation

## 🎯 Core Concept

The synthetic industry generator simulates a **real pharmaceutical delivery route** where:

- **ONE driver** is assigned per simulation run
- That driver has **multiple deliveries** (5-10 pharmaceutical packages)
- All deliveries are along **ONE route** with multiple dropoff locations
- A **dispatcher** coordinates with the driver about each delivery
- Each simulation run can be **completely different** (different driver, different cargo, different stops)

---

## 🚚 How It Works

### 1. Simulation Start

When you click "Start Simulation":

```
1. System randomly selects ONE driver (e.g., Jamie)
2. Generates 5-10 deliveries for that driver
3. Each delivery has:
   - A medication (e.g., Insulin, EpiPen, Blood Pressure Meds)
   - A patient (e.g., Sarah Chen)
   - A dropoff location along the route
   - A criticality level (critical, high, medium, standard)
4. Orders deliveries along the route (driver visits in sequence)
5. Driver starts from the pharmacy
```

### 2. Route Progression

The driver progresses through deliveries:

```
Pharmacy (Start)
  ↓
Delivery #1: Insulin for Sarah Chen (CRITICAL)
  ↓ (5-15 min travel)
Delivery #2: Blood Pressure Meds for John Martinez (HIGH)
  ↓ (5-15 min travel)
Delivery #3: EpiPen for Maria Thompson (CRITICAL)
  ↓ (5-15 min travel)
Delivery #4: Antibiotics for Robert Wilson (MEDIUM)
  ↓ (5-15 min travel)
Delivery #5: Routine Prescription for Lisa Anderson (STANDARD)
  ↓
Route Complete
```

### 3. Delivery States

Each delivery progresses through states:

- **`planned`** - Queued for delivery
- **`en_route`** - Driver is traveling to this location
- **`at_location`** - Driver has arrived
- **`delivered`** - Package delivered to patient

### 4. Dispatcher Coordination

The dispatcher sends messages about each delivery:

```
📢 "Driver en route to delivery 1/5. Insulin (Humalog) for Sarah Chen. ETA: 2:15 PM"
📢 "Driver arrived at delivery location 1/5. Delivering Insulin to Sarah Chen."
📢 "Delivery 1/5 completed. Insulin delivered to Sarah Chen. 4 remaining."
```

---

## 🔄 Next Simulation = Different Everything

When you **restart the simulation**, everything changes:

### Run 1 (Jamie):
- Driver: **Jamie (#7)** - TIME_PRESSURED persona
- Deliveries: 7 stops
  - Stop 1: Insulin for Sarah
  - Stop 2: EpiPen for John
  - Stop 3: Chemo Kit for Maria
  - ...

### Run 2 (Robert):
- Driver: **Robert (#3)** - ROUTINE persona  
- Deliveries: 5 stops
  - Stop 1: Blood Pressure Meds for David
  - Stop 2: Dialysis Supplies for Emma
  - Stop 3: Antibiotics for Carlos
  - ...

**Every run is unique!**

---

## 🗺️ Route Details

### Single Route Model

- **One main route**: I-90 Corridor through Seattle
- **Multiple dropoff locations**: Randomly generated along the route
- **Sequential stops**: Driver visits locations in order
- **Realistic timing**: 3-15 minutes between stops
- **Random cargo distribution**:
  - 30% Critical (Insulin, EpiPen, Chemo)
  - 40% High (Blood Pressure, Dialysis, Antiretrovirals)
  - 20% Medium (Antibiotics, Beta Blockers)
  - 10% Standard (Routine prescriptions, OTC)

---

## 💬 Dispatcher Role

The dispatcher:

1. **Briefs driver at start**: "Route briefing for Jamie (#7): 7 deliveries scheduled. 3 critical priority items."
2. **Tracks progress**: Sends updates as driver approaches each stop
3. **Confirms completions**: Acknowledges each successful delivery
4. **Coordinates timing**: Monitors ETAs and critical deliveries

---

## 📊 What You See

### Live Statistics Panel
- Current driver and persona
- Route progress (% complete)
- Current delivery being worked on
- Cargo breakdown (critical/high/medium/standard counts)
- Completed vs total deliveries

### Event Stream
- Simulation start with driver assignment
- Route manifest (all planned stops)
- Dispatcher messages about each delivery
- Location updates as driver travels
- Delivery completions
- Route completion

### Map
- All dropoff locations shown
- Color-coded by criticality (red=critical, yellow=high, blue=medium, gray=standard)
- Current driver position updates in real-time
- Popup details for each delivery

---

## 🎮 User Interaction

### Start Simulation
Generates a complete new route with:
- Random driver selection
- Random number of deliveries (5-10)
- Random cargo for each delivery
- Random dropoff locations along route

### Stop Simulation
- Ends current route
- Can start fresh with new driver and deliveries

### Pause/Resume
- Temporarily halts progression
- Resume continues from current position

---

## 🔌 Integration with pharma-attack-sim

The pharma-attack-sim system can:

1. **Consume the stream**: Listen to real-time delivery events
2. **Target the driver**: Plan attacks on the active driver
3. **Intercept cargo**: Identify critical medications being delivered
4. **Disrupt dispatcher**: Interfere with driver-dispatcher communication
5. **Reroute deliveries**: Send fake dispatcher messages

Example integration:
```javascript
const stream = new EventSource('http://localhost:3002/api/synthetic/stream');
stream.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'simulation_started') {
    // Identify target driver and their cargo
    console.log('Driver:', data.data.driver);
    console.log('Critical deliveries:', data.data.criticalityBreakdown.critical);
  }
  
  if (data.type === 'dispatcher_message') {
    // Intercept dispatcher communications
    console.log('Dispatcher message:', data.data.message);
  }
  
  if (data.type === 'delivery_en_route') {
    // Track which medications are in transit
    console.log('En route:', data.data.medication, 'for', data.data.patient);
  }
};
```

---

## 📝 Data Format

### Route Manifest
```json
{
  "routeId": "ROUTE_1699900000000",
  "driver": {
    "id": "driver_7",
    "name": "Jamie",
    "displayName": "Jamie (#7)",
    "persona": "TIME_PRESSURED"
  },
  "routeName": "Main Delivery Route (I-90 Corridor)",
  "totalDeliveries": 7,
  "deliveries": [
    {
      "id": "D_001",
      "sequenceNumber": 1,
      "medication": "Insulin (Humalog)",
      "criticality": "critical",
      "patient": "Sarah Chen",
      "status": "planned",
      ...
    },
    ...
  ],
  "criticalityBreakdown": {
    "critical": 3,
    "high": 2,
    "medium": 1,
    "standard": 1
  }
}
```

---

## 🎯 Key Differences from Multi-Driver Model

| Aspect | Multi-Driver Model (Old) | Single-Driver Model (New) |
|--------|---------------------------|---------------------------|
| **Drivers** | Many drivers active simultaneously | ONE driver per simulation |
| **Deliveries** | Each driver has 1 delivery | ONE driver has 5-10 deliveries |
| **Coordination** | Independent deliveries | Sequential stops on a route |
| **Dispatcher** | Less involvement | Active coordination role |
| **Restart** | Same pool of drivers | Completely new driver & cargo |
| **Realism** | Simulates industry-wide | Simulates single route/shift |

---

## 🚀 Why This Model?

This model better simulates:

1. **Real delivery routes**: Drivers don't do one delivery, they have routes with multiple stops
2. **Dispatcher role**: Dispatchers coordinate with drivers throughout their shift
3. **Attack targeting**: Attackers target specific drivers with valuable cargo
4. **Route disruption**: More interesting to disrupt an entire route than one delivery
5. **Variability**: Each run is completely different for testing various scenarios

---

## 🎓 Summary

**Think of it like a real delivery shift:**

- A dispatcher assigns a driver (e.g., Jamie) to a route with 7 stops
- Jamie loads all 7 packages into the vehicle
- Jamie visits each location in sequence
- Dispatcher tracks Jamie's progress and sends updates
- When Jamie finishes, the route is complete
- Next shift could be a different driver (Robert) with completely different stops

**This is what the synthetic industry generator simulates!** 🚚💊



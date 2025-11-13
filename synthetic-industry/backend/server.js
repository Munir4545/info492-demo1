// Main Express Server - Synthetic Industry Backend

const express = require('express');
const cors = require('cors');
const path = require('path');

const {
  startSimulation,
  stopSimulation,
  pauseSimulation,
  resumeSimulation,
  getSimulationStats,
  getRouteManifest,
  getActiveDeliveries,
  getCompletedDeliveries,
  addClient,
  removeClient
} = require('./synthetic-stream');

const { getDriverStats } = require('./driverManager');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8001',  // Synthetic industry frontend
    'http://localhost:5173',  // Pharma attack sim frontend (Vite)
    'http://localhost:3000',  // Alternative frontend port
  ],
  credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ================== SSE Streaming Endpoint ==================

/**
 * Server-Sent Events (SSE) stream endpoint
 * Clients connect here to receive real-time delivery events
 */
app.get('/api/synthetic/stream', (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  
  const clientId = Date.now();
  console.log(`SSE client connected: ${clientId}`);
  
  // Add client to streaming list
  addClient(clientId, res);
  
  // Handle client disconnect
  req.on('close', () => {
    removeClient(clientId);
  });
});

// ================== Control Endpoints ==================

/**
 * POST /api/synthetic/start
 * Start the 24-hour agentic simulation
 */
app.post('/api/synthetic/start', (req, res) => {
  try {
    const { duration = 24 } = req.body;
    startSimulation(duration);
    res.json({
      success: true,
      message: `Simulation started for ${duration} hours`,
      stats: getSimulationStats()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/synthetic/stop
 * Stop the simulation
 */
app.post('/api/synthetic/stop', (req, res) => {
  try {
    stopSimulation();
    res.json({
      success: true,
      message: 'Simulation stopped',
      stats: getSimulationStats()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/synthetic/pause
 * Pause the simulation
 */
app.post('/api/synthetic/pause', (req, res) => {
  try {
    pauseSimulation();
    res.json({
      success: true,
      message: 'Simulation paused'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/synthetic/resume
 * Resume the simulation
 */
app.post('/api/synthetic/resume', (req, res) => {
  try {
    resumeSimulation();
    res.json({
      success: true,
      message: 'Simulation resumed'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ================== Data Access Endpoints (REST API) ==================

/**
 * GET /api/synthetic/stats
 * Get current simulation statistics
 */
app.get('/api/synthetic/stats', (req, res) => {
  res.json(getSimulationStats());
});

/**
 * GET /api/synthetic/manifest
 * Get current route manifest (driver and all deliveries)
 */
app.get('/api/synthetic/manifest', (req, res) => {
  const manifest = getRouteManifest();
  if (manifest) {
    res.json(manifest);
  } else {
    res.status(404).json({
      error: 'No active route'
    });
  }
});

/**
 * GET /api/synthetic/active
 * Get all active deliveries (REST endpoint for external consumption)
 */
app.get('/api/synthetic/active', (req, res) => {
  res.json({
    deliveries: getActiveDeliveries(),
    count: getActiveDeliveries().length
  });
});

/**
 * GET /api/synthetic/completed
 * Get all completed deliveries
 */
app.get('/api/synthetic/completed', (req, res) => {
  res.json({
    deliveries: getCompletedDeliveries(),
    count: getCompletedDeliveries().length
  });
});

/**
 * GET /api/synthetic/deliveries/:id
 * Get specific delivery by ID
 */
app.get('/api/synthetic/deliveries/:id', (req, res) => {
  const { id } = req.params;
  const activeDeliveries = getActiveDeliveries();
  const completedDeliveries = getCompletedDeliveries();
  
  const delivery = activeDeliveries.find(d => d.id === id) ||
                   completedDeliveries.find(d => d.id === id);
  
  if (delivery) {
    res.json(delivery);
  } else {
    res.status(404).json({
      error: 'Delivery not found',
      id
    });
  }
});

/**
 * GET /api/synthetic/drivers
 * Get all driver statistics
 */
app.get('/api/synthetic/drivers', (req, res) => {
  res.json({
    drivers: getDriverStats()
  });
});

// ================== Health Check ==================

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'synthetic-industry',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    service: 'Synthetic Industry Generator',
    version: '1.0.0',
    description: 'Agentic pharmaceutical delivery data generation system',
    model: 'Single driver with multiple deliveries along one route',
    endpoints: {
      stream: 'GET /api/synthetic/stream (SSE)',
      start: 'POST /api/synthetic/start',
      stop: 'POST /api/synthetic/stop',
      pause: 'POST /api/synthetic/pause',
      resume: 'POST /api/synthetic/resume',
      stats: 'GET /api/synthetic/stats',
      manifest: 'GET /api/synthetic/manifest',
      active: 'GET /api/synthetic/active',
      completed: 'GET /api/synthetic/completed',
      drivers: 'GET /api/synthetic/drivers',
      health: 'GET /api/health'
    }
  });
});

// ================== Error Handling ==================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ================== Start Server ==================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║     Synthetic Industry Generator Backend              ║
║     Agentic Pharmaceutical Delivery System            ║
╚═══════════════════════════════════════════════════════╝

🚀 Server running on port ${PORT}
📡 SSE Stream: http://localhost:${PORT}/api/synthetic/stream
🔧 Control API: http://localhost:${PORT}/api/synthetic/*
💊 Ready to generate synthetic delivery data!

Model: Single driver with multiple deliveries
Available endpoints:
  - SSE Stream: GET /api/synthetic/stream
  - Start Simulation: POST /api/synthetic/start
  - Stop Simulation: POST /api/synthetic/stop
  - Get Statistics: GET /api/synthetic/stats
  - Get Route Manifest: GET /api/synthetic/manifest
  - Get Active Deliveries: GET /api/synthetic/active
  - Health Check: GET /api/health

`);
});

module.exports = app;

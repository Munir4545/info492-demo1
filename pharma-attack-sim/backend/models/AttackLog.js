const mongoose = require('mongoose');

const AttackLogSchema = new mongoose.Schema({
  attackId: { type: Number, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  config: { type: Object }, // Full attack configuration
  status: { type: String }, // pending, running, completed, failed
  success: { type: Boolean },
  
  // Detailed metrics
  duration_seconds: Number,
  compromised_deliveries: Number,
  affected_patients: Number,
  critical_medications: Number,
  financial_impact: Number,
  time_to_impact_seconds: Number,
  detection_delay_seconds: Number,
  recovery_time_minutes: Number,
  
  // Vector-specific details
  phishing: {
    attempted: Boolean,
    success: Boolean,
    effectiveness: Number,
    message: String,
    llm_evaluations: [Object], // Store all LLM transcripts
    click_rate_prediction: Number
  },
  gps: {
    attempted: Boolean,
    success: Boolean,
    effectiveness: Number,
    spoofed_location: { lat: Number, lng: Number },
    diversion_distance: Number
  },
  api: {
    attempted: Boolean,
    success: Boolean,
    effectiveness: Number,
    alerts_sent: Number,
    bury_position: Number
  },
  
  // Logs and Events
  logs: [{
    agent: String,
    message: String,
    timestamp: Date
  }],
  
  decision_events: [Object], // All autonomous decisions
  synthetic_manifest: Object // The industry state at time of attack
}, { strict: false }); // Allow flexibility for "no such thing as too much info"

module.exports = mongoose.model('AttackLog', AttackLogSchema);


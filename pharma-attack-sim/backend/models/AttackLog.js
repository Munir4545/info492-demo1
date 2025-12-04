/**
 * AttackLog Model for ChromaDB
 * Provides a consistent interface for attack log operations using vector database
 */
const chromaClient = require('../chroma-client');

/**
 * AttackLog class - mimics the mongoose model interface for ChromaDB
 */
class AttackLog {
  constructor(data) {
    this.attackId = data.attackId;
    this.timestamp = data.timestamp || new Date();
    this.config = data.config || {};
    this.status = data.status || 'pending';
    this.success = data.success || false;
    
    // Metrics
    this.duration_seconds = data.duration_seconds;
    this.compromised_deliveries = data.compromised_deliveries || 0;
    this.affected_patients = data.affected_patients || 0;
    this.critical_medications = data.critical_medications || 0;
    this.financial_impact = data.financial_impact || 0;
    this.time_to_impact_seconds = data.time_to_impact_seconds;
    this.detection_delay_seconds = data.detection_delay_seconds;
    this.recovery_time_minutes = data.recovery_time_minutes;
    
    // Vector details
    this.phishing = data.phishing || {
      attempted: false,
      success: false,
      effectiveness: 0,
      message: '',
      llm_evaluations: [],
      click_rate_prediction: 0
    };
    
    this.gps = data.gps || {
      attempted: false,
      success: false,
      effectiveness: 0,
      spoofed_location: null,
      diversion_distance: 0
    };
    
    this.api = data.api || {
      attempted: false,
      success: false,
      effectiveness: 0,
      alerts_sent: 0,
      bury_position: 0
    };
    
    // Logs and events
    this.logs = data.logs || [];
    this.decision_events = data.decision_events || [];
    this.synthetic_manifest = data.synthetic_manifest;
    
    // Error info
    this.error = data.error;
  }
  
  /**
   * Save the attack log to ChromaDB as an embedding
   * Non-blocking: failures are logged but don't throw
   */
  async save() {
    try {
      const attackData = this.toJSON();
      await chromaClient.saveAttack(this.attackId, attackData);
      return this;
    } catch (error) {
      // Log but don't throw - ChromaDB failures shouldn't break the attack flow
      console.warn(`⚠️ ChromaDB save failed for attack ${this.attackId}: ${error.message}`);
      return this; // Return anyway so the attack continues
    }
  }
  
  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      attackId: this.attackId,
      timestamp: this.timestamp,
      config: this.config,
      status: this.status,
      success: this.success,
      duration_seconds: this.duration_seconds,
      compromised_deliveries: this.compromised_deliveries,
      affected_patients: this.affected_patients,
      critical_medications: this.critical_medications,
      financial_impact: this.financial_impact,
      time_to_impact_seconds: this.time_to_impact_seconds,
      detection_delay_seconds: this.detection_delay_seconds,
      recovery_time_minutes: this.recovery_time_minutes,
      phishing: this.phishing,
      gps: this.gps,
      api: this.api,
      logs: this.logs,
      decision_events: this.decision_events,
      synthetic_manifest: this.synthetic_manifest,
      error: this.error
    };
  }
  
  /**
   * Static method to find attacks (mimics mongoose find)
   */
  static async find(query = {}) {
    try {
      const results = await chromaClient.getAllAttacks();
      
      if (!results.metadatas || results.metadatas.length === 0) {
        return [];
      }
      
      // Convert ChromaDB results to AttackLog instances
      return results.metadatas.map((metadata, index) => {
        return AttackLog.fromChromaMetadata(metadata, results.documents?.[index]);
      });
    } catch (error) {
      console.error('Failed to find attacks:', error);
      return [];
    }
  }
  
  /**
   * Find attacks within a time range (useful for pattern analysis)
   */
  static async findByTimeRange(hours = 24) {
    try {
      const results = await chromaClient.getAttacksByTimeRange(hours);
      
      if (!results.metadatas || results.metadatas.length === 0) {
        return [];
      }
      
      return results.metadatas.map((metadata, index) => {
        return AttackLog.fromChromaMetadata(metadata, results.documents?.[index]);
      });
    } catch (error) {
      console.error('Failed to find attacks by time range:', error);
      return [];
    }
  }
  
  /**
   * Find similar attacks using semantic search
   */
  static async findSimilar(queryPattern, nResults = 10) {
    try {
      const results = await chromaClient.findSimilarAttackPatterns(queryPattern, nResults);
      
      if (!results.metadatas || results.metadatas[0]?.length === 0) {
        return [];
      }
      
      return results.metadatas[0].map((metadata, index) => {
        const attackLog = AttackLog.fromChromaMetadata(metadata, results.documents?.[0]?.[index]);
        attackLog._similarity = 1 - (results.distances?.[0]?.[index] || 0); // Convert distance to similarity
        return attackLog;
      });
    } catch (error) {
      console.error('Failed to find similar attacks:', error);
      return [];
    }
  }
  
  /**
   * Convert ChromaDB metadata to AttackLog instance
   */
  static fromChromaMetadata(metadata, document = null) {
    const vectors = metadata.vectors ? JSON.parse(metadata.vectors) : [];
    
    return new AttackLog({
      attackId: metadata.attackId,
      timestamp: new Date(metadata.timestamp),
      config: {
        targetDriver: metadata.targetDriver,
        targetTier: metadata.targetTier,
        vectorPlan: vectors
      },
      status: metadata.status,
      success: metadata.success === 'true',
      duration_seconds: parseInt(metadata.duration_seconds) || 0,
      compromised_deliveries: parseInt(metadata.compromised_deliveries) || 0,
      affected_patients: parseInt(metadata.affected_patients) || 0,
      financial_impact: parseInt(metadata.financial_impact) || 0,
      phishing: {
        attempted: true,
        success: metadata.phishing_success === 'true',
        effectiveness: parseInt(metadata.phishing_effectiveness) || 0
      },
      gps: {
        attempted: true,
        success: metadata.gps_success === 'true',
        effectiveness: parseInt(metadata.gps_effectiveness) || 0
      },
      api: {
        attempted: true,
        success: metadata.api_success === 'true',
        effectiveness: parseInt(metadata.api_effectiveness) || 0
      },
      _document: document // Store original embedding text
    });
  }
  
  /**
   * Count total attacks
   */
  static async count() {
    try {
      const stats = await chromaClient.getCollectionStats();
      return stats.documentCount;
    } catch (error) {
      console.error('Failed to count attacks:', error);
      return 0;
    }
  }
  
  /**
   * Delete an attack by ID
   */
  static async deleteOne(attackId) {
    try {
      await chromaClient.deleteAttack(attackId);
      return { deletedCount: 1 };
    } catch (error) {
      console.error('Failed to delete attack:', error);
      return { deletedCount: 0 };
    }
  }
}

module.exports = AttackLog;

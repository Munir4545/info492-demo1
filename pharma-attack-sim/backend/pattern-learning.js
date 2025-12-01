/**
 * Pattern Learning System
 * Analyzes past attack runs from ChromaDB vector database to identify patterns and improve strategy
 * Uses semantic similarity to find related attack patterns
 */
const chromaClient = require('./chroma-client');
const AttackLog = require('./models/AttackLog');

class PatternLearningSystem {
  constructor() {
    this.connected = false;
  }

  async connect() {
    if (this.connected) return;

    try {
      await chromaClient.initChroma();
      this.connected = true;
      console.log('✅ Pattern Learning System connected to ChromaDB');
    } catch (error) {
      console.error('❌ Pattern Learning System connection error:', error);
      throw error;
    }
  }

  /**
   * Analyze patterns from past attacks using vector similarity
   * Returns insights for strategy improvement
   */
  async analyzePatterns(hours = 24) {
    if (!this.connected) await this.connect();

    try {
      // Get recent attacks from ChromaDB
      const results = await chromaClient.getAttacksByTimeRange(hours, 500);
      
      if (!results.metadatas || results.metadatas.length === 0) {
        return {
          totalAttacks: 0,
          insights: [],
          recommendations: ['No historical data available. Starting fresh campaign.']
        };
      }

      const attacks = results.metadatas;

      const insights = {
        totalAttacks: attacks.length,
        successRate: 0,
        detectionRate: 0,
        bestVectors: {},
        worstVectors: {},
        timePatterns: {},
        targetPatterns: {},
        decisionPatterns: {},
        semanticClusters: [],
        recommendations: []
      };

      // Calculate success and detection rates
      let successful = 0;
      let detected = 0;
      const vectorSuccess = {};
      const vectorFailure = {};
      const timeOfDay = {};
      const targetSuccess = {};

      attacks.forEach(attack => {
        const isSuccess = attack.success === 'true';
        if (isSuccess) successful++;
        if (attack.detected === 'true') detected++;

        // Vector analysis
        let vectors = [];
        try {
          vectors = JSON.parse(attack.vectors || '[]');
        } catch (e) {
          vectors = [];
        }
        
        vectors.forEach(vector => {
          if (isSuccess) {
            vectorSuccess[vector] = (vectorSuccess[vector] || 0) + 1;
          } else {
            vectorFailure[vector] = (vectorFailure[vector] || 0) + 1;
          }
        });

        // Time pattern analysis
        const timestamp = new Date(attack.timestamp);
        const hour = timestamp.getHours();
        const timeSlot = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
        if (!timeOfDay[timeSlot]) timeOfDay[timeSlot] = { success: 0, total: 0 };
        timeOfDay[timeSlot].total++;
        if (isSuccess) timeOfDay[timeSlot].success++;

        // Target analysis
        const target = attack.targetDriver || 'unknown';
        if (!targetSuccess[target]) targetSuccess[target] = { success: 0, total: 0 };
        targetSuccess[target].total++;
        if (isSuccess) targetSuccess[target].success++;
      });

      insights.successRate = attacks.length > 0 ? (successful / attacks.length) * 100 : 0;
      insights.detectionRate = attacks.length > 0 ? (detected / attacks.length) * 100 : 0;

      // Identify best/worst vectors
      Object.keys(vectorSuccess).forEach(vector => {
        const success = vectorSuccess[vector] || 0;
        const failure = vectorFailure[vector] || 0;
        const total = success + failure;
        if (total > 0) {
          const rate = (success / total) * 100;
          if (rate >= 70) {
            insights.bestVectors[vector] = { rate, total };
          } else if (rate <= 30) {
            insights.worstVectors[vector] = { rate, total };
          }
        }
      });

      // Time patterns
      Object.keys(timeOfDay).forEach(slot => {
        const data = timeOfDay[slot];
        insights.timePatterns[slot] = {
          successRate: data.total > 0 ? (data.success / data.total) * 100 : 0,
          total: data.total
        };
      });

      // Target patterns
      Object.keys(targetSuccess).forEach(target => {
        const data = targetSuccess[target];
        const rate = data.total > 0 ? (data.success / data.total) * 100 : 0;
        insights.targetPatterns[target] = {
          successRate: rate,
          total: data.total,
          recommendation: rate >= 70 ? 'high_priority' : rate <= 30 ? 'avoid' : 'moderate'
        };
      });

      // Generate recommendations
      if (insights.successRate < 50) {
        insights.recommendations.push('⚠️ Low success rate detected. Consider adjusting attack vectors or timing.');
      }

      if (insights.detectionRate > 60) {
        insights.recommendations.push('🚨 High detection rate. Reduce attack intensity or improve stealth tactics.');
      }

      const bestVector = Object.keys(insights.bestVectors).sort((a, b) => 
        insights.bestVectors[b].rate - insights.bestVectors[a].rate
      )[0];
      if (bestVector) {
        insights.recommendations.push(`✅ Best performing vector: ${bestVector} (${insights.bestVectors[bestVector].rate.toFixed(1)}% success)`);
      }

      const bestTimeSlot = Object.keys(insights.timePatterns).sort((a, b) =>
        insights.timePatterns[b].successRate - insights.timePatterns[a].successRate
      )[0];
      if (bestTimeSlot) {
        insights.recommendations.push(`⏰ Optimal attack time: ${bestTimeSlot} (${insights.timePatterns[bestTimeSlot].successRate.toFixed(1)}% success)`);
      }

      const highPriorityTargets = Object.keys(insights.targetPatterns)
        .filter(t => insights.targetPatterns[t].recommendation === 'high_priority')
        .slice(0, 3);
      if (highPriorityTargets.length > 0) {
        insights.recommendations.push(`🎯 High-priority targets: ${highPriorityTargets.join(', ')}`);
      }

      return insights;
    } catch (error) {
      console.error('❌ Error analyzing patterns:', error);
      throw error;
    }
  }

  /**
   * Find similar successful attacks using semantic search
   * Helps identify what worked before for similar scenarios
   */
  async findSimilarSuccessfulAttacks(currentAttackPattern, nResults = 5) {
    if (!this.connected) await this.connect();

    try {
      const queryText = chromaClient.attackToEmbeddingText(currentAttackPattern);
      
      const results = await chromaClient.querySimilarAttacks(queryText, nResults * 2, {
        success: 'true'
      });

      if (!results.metadatas || results.metadatas[0]?.length === 0) {
        return [];
      }

      return results.metadatas[0].slice(0, nResults).map((metadata, idx) => ({
        ...metadata,
        similarity: 1 - (results.distances?.[0]?.[idx] || 0),
        document: results.documents?.[0]?.[idx]
      }));
    } catch (error) {
      console.error('❌ Error finding similar attacks:', error);
      return [];
    }
  }

  /**
   * Get learned strategy recommendations based on patterns
   */
  async getStrategyRecommendations() {
    const patterns = await this.analyzePatterns(24);
    
    const strategy = {
      preferredVectors: Object.keys(patterns.bestVectors).slice(0, 3),
      avoidVectors: Object.keys(patterns.worstVectors).slice(0, 2),
      optimalTimeSlots: Object.keys(patterns.timePatterns)
        .sort((a, b) => patterns.timePatterns[b].successRate - patterns.timePatterns[a].successRate)
        .slice(0, 2),
      priorityTargets: Object.keys(patterns.targetPatterns)
        .filter(t => patterns.targetPatterns[t].recommendation === 'high_priority')
        .slice(0, 5),
      avoidTargets: Object.keys(patterns.targetPatterns)
        .filter(t => patterns.targetPatterns[t].recommendation === 'avoid')
        .slice(0, 3),
      decisionPreferences: patterns.decisionPatterns ? Object.keys(patterns.decisionPatterns)
        .filter(k => patterns.decisionPatterns[k].recommendation === 'preferred')
        .reduce((acc, key) => {
          const [triggerId, option] = key.split(':');
          if (!acc[triggerId]) acc[triggerId] = [];
          acc[triggerId].push(option);
          return acc;
        }, {}) : {}
    };

    return {
      patterns,
      strategy,
      confidence: patterns.totalAttacks > 10 ? 'high' : patterns.totalAttacks > 5 ? 'medium' : 'low'
    };
  }

  /**
   * Use semantic search to recommend next steps based on similar past attacks
   */
  async getSemanticRecommendations(currentState) {
    if (!this.connected) await this.connect();

    try {
      // Find attacks similar to current state
      const similarAttacks = await this.findSimilarSuccessfulAttacks(currentState, 10);
      
      if (similarAttacks.length === 0) {
        return {
          recommendations: ['No similar successful patterns found. Trying standard approach.'],
          confidence: 'low',
          similarPatterns: []
        };
      }

      // Analyze what vectors worked in similar attacks
      const vectorUsage = {};
      similarAttacks.forEach(attack => {
        let vectors = [];
        try {
          vectors = JSON.parse(attack.vectors || '[]');
        } catch (e) {
          vectors = [];
        }
        vectors.forEach(v => {
          vectorUsage[v] = (vectorUsage[v] || 0) + 1;
        });
      });

      const recommendations = [];
      const sortedVectors = Object.entries(vectorUsage)
        .sort((a, b) => b[1] - a[1]);

      if (sortedVectors.length > 0) {
        recommendations.push(`🎯 Most effective vectors in similar scenarios: ${sortedVectors.slice(0, 3).map(([v]) => v).join(', ')}`);
      }

      // Analyze financial impact patterns
      const avgImpact = similarAttacks.reduce((sum, a) => sum + (parseInt(a.financial_impact) || 0), 0) / similarAttacks.length;
      if (avgImpact > 0) {
        recommendations.push(`💰 Average financial impact in similar attacks: $${avgImpact.toFixed(0)}`);
      }

      return {
        recommendations,
        confidence: similarAttacks.length >= 5 ? 'high' : 'medium',
        similarPatterns: similarAttacks.slice(0, 5)
      };
    } catch (error) {
      console.error('❌ Error getting semantic recommendations:', error);
      return {
        recommendations: ['Error analyzing patterns'],
        confidence: 'low',
        similarPatterns: []
      };
    }
  }

  /**
   * Export full analysis report
   */
  async generateReport(hours = 24) {
    const patterns = await this.analyzePatterns(hours);
    const strategy = await this.getStrategyRecommendations();
    const stats = await chromaClient.getCollectionStats();

    return {
      generatedAt: new Date().toISOString(),
      analysisPeriod: `${hours} hours`,
      vectorDatabase: {
        type: 'ChromaDB',
        collection: stats.collectionName,
        totalDocuments: stats.documentCount,
        connected: stats.connected
      },
      summary: {
        totalAttacks: patterns.totalAttacks,
        successRate: patterns.successRate.toFixed(2) + '%',
        detectionRate: patterns.detectionRate.toFixed(2) + '%',
        confidence: strategy.confidence
      },
      patterns,
      strategy,
      recommendations: patterns.recommendations
    };
  }
}

module.exports = PatternLearningSystem;

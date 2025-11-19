const mongoose = require('mongoose');

/**
 * Pattern Learning System
 * Analyzes past attack runs from MongoDB to identify patterns and improve strategy
 */
class PatternLearningSystem {
  constructor(mongodbUri) {
    this.mongodbUri = mongodbUri;
    this.attackLogSchema = null;
    this.AttackLog = null;
    this.connected = false;
  }

  async connect() {
    if (this.connected) return;

    // Define schema if not already defined
    if (!this.attackLogSchema) {
      this.attackLogSchema = new mongoose.Schema({
        attackId: { type: String, required: true, index: true },
        timestamp: { type: Date, default: Date.now, index: true },
        targetDriver: String,
        targetRole: String,
        vectors: [String],
        success: Boolean,
        detected: Boolean,
        compromiseRate: Number,
        detectionRisk: Number,
        campaignDay: Number,
        decisionEvents: [{
          triggerId: String,
          time: Number,
          selectedOption: String,
          success: Boolean
        }],
        finalMetrics: {
          compromisedDeliveries: Number,
          affectedPatients: Number,
          financialImpact: Number
        }
      }, { collection: 'attack_logs' });
    }

    try {
      await mongoose.connect(this.mongodbUri);
      this.AttackLog = mongoose.model('AttackLog', this.attackLogSchema);
      this.connected = true;
      console.log('✅ Pattern Learning System connected to MongoDB');
    } catch (error) {
      console.error('❌ Pattern Learning System connection error:', error);
      throw error;
    }
  }

  /**
   * Analyze patterns from past attacks
   * Returns insights for strategy improvement
   */
  async analyzePatterns(hours = 24) {
    if (!this.connected) await this.connect();

    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    try {
      const attacks = await this.AttackLog.find({
        timestamp: { $gte: cutoffTime }
      }).sort({ timestamp: -1 });

      if (attacks.length === 0) {
        return {
          totalAttacks: 0,
          insights: [],
          recommendations: ['No historical data available. Starting fresh campaign.']
        };
      }

      const insights = {
        totalAttacks: attacks.length,
        successRate: 0,
        detectionRate: 0,
        bestVectors: {},
        worstVectors: {},
        timePatterns: {},
        targetPatterns: {},
        decisionPatterns: {},
        recommendations: []
      };

      // Calculate success and detection rates
      let successful = 0;
      let detected = 0;
      const vectorSuccess = {};
      const vectorFailure = {};
      const timeOfDay = {};
      const targetSuccess = {};
      const decisionSuccess = {};

      attacks.forEach(attack => {
        if (attack.success) successful++;
        if (attack.detected) detected++;

        // Vector analysis
        attack.vectors?.forEach(vector => {
          if (attack.success) {
            vectorSuccess[vector] = (vectorSuccess[vector] || 0) + 1;
          } else {
            vectorFailure[vector] = (vectorFailure[vector] || 0) + 1;
          }
        });

        // Time pattern analysis
        const hour = new Date(attack.timestamp).getHours();
        const timeSlot = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
        if (!timeOfDay[timeSlot]) timeOfDay[timeSlot] = { success: 0, total: 0 };
        timeOfDay[timeSlot].total++;
        if (attack.success) timeOfDay[timeSlot].success++;

        // Target analysis
        const target = attack.targetDriver || 'unknown';
        if (!targetSuccess[target]) targetSuccess[target] = { success: 0, total: 0 };
        targetSuccess[target].total++;
        if (attack.success) targetSuccess[target].success++;

        // Decision pattern analysis
        attack.decisionEvents?.forEach(decision => {
          const key = `${decision.triggerId}:${decision.selectedOption}`;
          if (!decisionSuccess[key]) decisionSuccess[key] = { success: 0, total: 0 };
          decisionSuccess[key].total++;
          if (decision.success) decisionSuccess[key].success++;
        });
      });

      insights.successRate = (successful / attacks.length) * 100;
      insights.detectionRate = (detected / attacks.length) * 100;

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
          successRate: (data.success / data.total) * 100,
          total: data.total
        };
      });

      // Target patterns
      Object.keys(targetSuccess).forEach(target => {
        const data = targetSuccess[target];
        insights.targetPatterns[target] = {
          successRate: (data.success / data.total) * 100,
          total: data.total,
          recommendation: data.successRate >= 70 ? 'high_priority' : data.successRate <= 30 ? 'avoid' : 'moderate'
        };
      });

      // Decision patterns
      Object.keys(decisionSuccess).forEach(key => {
        const data = decisionSuccess[key];
        const rate = (data.success / data.total) * 100;
        if (data.total >= 3) { // Only consider decisions made multiple times
          insights.decisionPatterns[key] = {
            successRate: rate,
            total: data.total,
            recommendation: rate >= 70 ? 'preferred' : rate <= 30 ? 'avoid' : 'neutral'
          };
        }
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
      decisionPreferences: Object.keys(patterns.decisionPatterns)
        .filter(k => patterns.decisionPatterns[k].recommendation === 'preferred')
        .reduce((acc, key) => {
          const [triggerId, option] = key.split(':');
          if (!acc[triggerId]) acc[triggerId] = [];
          acc[triggerId].push(option);
          return acc;
        }, {})
    };

    return {
      patterns,
      strategy,
      confidence: patterns.totalAttacks > 10 ? 'high' : patterns.totalAttacks > 5 ? 'medium' : 'low'
    };
  }

  /**
   * Export full analysis report
   */
  async generateReport(hours = 24) {
    const patterns = await this.analyzePatterns(hours);
    const strategy = await this.getStrategyRecommendations();

    return {
      generatedAt: new Date().toISOString(),
      analysisPeriod: `${hours} hours`,
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


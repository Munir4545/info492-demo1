#!/usr/bin/env node

/**
 * 24-Hour Data Analysis Script
 * Analyzes attack data from MongoDB after 24 hours of runtime
 */

const PatternLearningSystem = require('../pattern-learning');
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const MONGODB_URI = `mongodb+srv://emammunir_db_user:${process.env.MONGODB_PASSWORD}@cluster0.mqsnysc.mongodb.net/pharma-attack-sim?retryWrites=true&w=majority&appName=Cluster0`;

async function main() {
  console.log('📊 Starting 24-Hour Attack Data Analysis...\n');

  const learningSystem = new PatternLearningSystem(MONGODB_URI);

  try {
    await learningSystem.connect();

    // Generate comprehensive report
    const report = await learningSystem.generateReport(24);

    console.log('='.repeat(80));
    console.log('📈 24-HOUR ATTACK ANALYSIS REPORT');
    console.log('='.repeat(80));
    console.log(`Generated: ${report.generatedAt}`);
    console.log(`Analysis Period: ${report.analysisPeriod}`);
    console.log('\n📊 SUMMARY');
    console.log('-'.repeat(80));
    console.log(`Total Attacks: ${report.summary.totalAttacks}`);
    console.log(`Success Rate: ${report.summary.successRate}`);
    console.log(`Detection Rate: ${report.summary.detectionRate}`);
    console.log(`Confidence Level: ${report.summary.confidence.toUpperCase()}`);

    console.log('\n🎯 KEY INSIGHTS');
    console.log('-'.repeat(80));
    report.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });

    if (Object.keys(report.patterns.bestVectors).length > 0) {
      console.log('\n✅ BEST PERFORMING ATTACK VECTORS');
      console.log('-'.repeat(80));
      Object.entries(report.patterns.bestVectors)
        .sort((a, b) => b[1].rate - a[1].rate)
        .forEach(([vector, data]) => {
          console.log(`  ${vector}: ${data.rate.toFixed(1)}% success (${data.total} attempts)`);
        });
    }

    if (Object.keys(report.patterns.worstVectors).length > 0) {
      console.log('\n❌ WORST PERFORMING ATTACK VECTORS');
      console.log('-'.repeat(80));
      Object.entries(report.patterns.worstVectors)
        .sort((a, b) => a[1].rate - b[1].rate)
        .forEach(([vector, data]) => {
          console.log(`  ${vector}: ${data.rate.toFixed(1)}% success (${data.total} attempts)`);
        });
    }

    if (Object.keys(report.patterns.timePatterns).length > 0) {
      console.log('\n⏰ TIME-BASED PATTERNS');
      console.log('-'.repeat(80));
      Object.entries(report.patterns.timePatterns)
        .sort((a, b) => b[1].successRate - a[1].successRate)
        .forEach(([slot, data]) => {
          console.log(`  ${slot}: ${data.successRate.toFixed(1)}% success (${data.total} attacks)`);
        });
    }

    if (Object.keys(report.patterns.targetPatterns).length > 0) {
      console.log('\n👥 TARGET ANALYSIS');
      console.log('-'.repeat(80));
      const highPriority = Object.entries(report.patterns.targetPatterns)
        .filter(([_, data]) => data.recommendation === 'high_priority')
        .slice(0, 5);
      
      if (highPriority.length > 0) {
        console.log('  High-Priority Targets:');
        highPriority.forEach(([target, data]) => {
          console.log(`    • ${target}: ${data.successRate.toFixed(1)}% success (${data.total} attacks)`);
        });
      }
    }

    if (Object.keys(report.strategy.decisionPreferences).length > 0) {
      console.log('\n🧠 LEARNED DECISION PATTERNS');
      console.log('-'.repeat(80));
      Object.entries(report.strategy.decisionPreferences).forEach(([triggerId, options]) => {
        console.log(`  ${triggerId}: Prefer ${options.join(', ')}`);
      });
    }

    console.log('\n💡 STRATEGY RECOMMENDATIONS');
    console.log('-'.repeat(80));
    console.log(`Preferred Vectors: ${report.strategy.preferredVectors.join(', ') || 'None identified'}`);
    console.log(`Avoid Vectors: ${report.strategy.avoidVectors.join(', ') || 'None identified'}`);
    console.log(`Optimal Time Slots: ${report.strategy.optimalTimeSlots.join(', ') || 'None identified'}`);
    console.log(`Priority Targets: ${report.strategy.priorityTargets.join(', ') || 'None identified'}`);

    console.log('\n' + '='.repeat(80));
    console.log('✅ Analysis Complete');
    console.log('='.repeat(80));

    // Save report to file
    const fs = require('fs');
    const reportPath = require('path').join(__dirname, '..', '..', 'analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Full report saved to: ${reportPath}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

main();


const fs = require('fs');
const path = require('path');

class CampaignManager {
  constructor(db) {
    this.db = db;
    this.initDb();
  }

  initDb() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS campaign_state (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS driver_profiles (
        name TEXT PRIMARY KEY,
        compromised_count INTEGER DEFAULT 0,
        last_attacked_at DATETIME,
        susceptibility_score REAL DEFAULT 0.5,
        detected_attacks INTEGER DEFAULT 0
      );
    `);
  }

  getState(key, defaultValue = null) {
    const stmt = this.db.prepare('SELECT value FROM campaign_state WHERE key = ?');
    const row = stmt.get(key);
    return row ? JSON.parse(row.value) : defaultValue;
  }

  setState(key, value) {
    const stmt = this.db.prepare('INSERT OR REPLACE INTO campaign_state (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
    stmt.run(key, JSON.stringify(value));
  }

  getDriverProfile(name) {
    const stmt = this.db.prepare('SELECT * FROM driver_profiles WHERE name = ?');
    return stmt.get(name);
  }

  updateDriverProfile(name, updates) {
    const current = this.getDriverProfile(name) || {
      name,
      compromised_count: 0,
      susceptibility_score: 0.5,
      detected_attacks: 0
    };
    
    const updated = { ...current, ...updates };
    
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO driver_profiles 
      (name, compromised_count, last_attacked_at, susceptibility_score, detected_attacks)
      VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)
    `);
    
    stmt.run(updated.name, updated.compromised_count, updated.susceptibility_score, updated.detected_attacks);
    return updated;
  }

  selectTarget(manifest) {
    // Get all available drivers/dispatchers from manifest
    const candidates = [];
    
    if (manifest.driver) {
      candidates.push({ type: 'driver', data: manifest.driver });
    }
    
    if (manifest.dispatcher) {
      candidates.push({ type: 'dispatcher', data: manifest.dispatcher });
    }

    // Score them based on profiles
    let bestTarget = null;
    let highestScore = -1;

    for (const candidate of candidates) {
      const name = candidate.data.displayName || candidate.data.name;
      const profile = this.getDriverProfile(name) || { susceptibility_score: 0.5, detected_attacks: 0 };
      
      // Strategy: Target vulnerable users, but avoid those who have recently detected us (high alert)
      let score = profile.susceptibility_score;
      
      // Reduce score if they have high detection count (they are vigilant)
      score -= (profile.detected_attacks * 0.1);
      
      // Random noise to vary attacks
      score += (Math.random() * 0.2 - 0.1);

      if (score > highestScore) {
        highestScore = score;
        bestTarget = candidate;
      }
    }

    return bestTarget || candidates[0];
  }

  recordAttackResult(targetName, success, detected) {
    const profile = this.getDriverProfile(targetName) || {
      name: targetName,
      compromised_count: 0,
      susceptibility_score: 0.5,
      detected_attacks: 0
    };

    if (success) {
      profile.compromised_count += 1;
      // If we succeeded, they are vulnerable
      profile.susceptibility_score = Math.min(0.95, profile.susceptibility_score + 0.1);
    } else {
      // Failed attempt
      profile.susceptibility_score = Math.max(0.1, profile.susceptibility_score - 0.05);
    }

    if (detected) {
      profile.detected_attacks += 1;
      // If detected, they become much harder to hack next time
      profile.susceptibility_score = Math.max(0.1, profile.susceptibility_score - 0.2);
    }

    this.updateDriverProfile(targetName, profile);
  }
  
  incrementCampaignDay() {
    const currentDay = this.getState('campaign_day', 1);
    this.setState('campaign_day', currentDay + 1);
    return currentDay + 1;
  }
  
  getCampaignDay() {
    return this.getState('campaign_day', 1);
  }
}

module.exports = CampaignManager;


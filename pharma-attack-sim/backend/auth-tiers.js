// Tier-based Authentication System
const authTiers = {
  tier4: {
    name: "Tier 4 (Admin)",
    security_score: 95,
    methods: [
      "Hardware key (YubiKey)",
      "SSO with passkey",
      "Biometric confirmation"
    ],
    attack_vectors: [
      { name: "Social engineering", success_rate: 0.05 },
      { name: "Session hijacking", success_rate: 0.08 }
    ]
  },
  tier3: {
    name: "Tier 3 (Dispatcher)",
    security_score: 70,
    methods: [
      "WebAuthn passkey",
      "Password manager",
      "Dashboard SSO"
    ],
    attack_vectors: [
      { name: "Sophisticated phishing", success_rate: 0.25 },
      { name: "Alert fatigue exploitation", success_rate: 0.30 }
    ]
  },
  tier2: {
    name: "Tier 2 (Driver)",
    security_score: 35,
    methods: [
      "In-app passkey (mobile)",
      "Device biometric",
      "SMS 2FA backup"
    ],
    attack_vectors: [
      { name: "Basic phishing", success_rate: 0.30 },
      { name: "While driving", success_rate: 0.45 },
      { name: "Time pressure", success_rate: 0.55 }
    ]
  }
};

function calculateTierBypass(tier, attackVector, context = {}) {
  const tierData = authTiers[tier];
  if (!tierData) {
    return 0;
  }
  
  // Find the attack vector
  const vector = tierData.attack_vectors.find(v => 
    v.name.toLowerCase().includes(attackVector.toLowerCase())
  );
  
  if (!vector) {
    return tierData.attack_vectors[0].success_rate;
  }
  
  let adjustedRate = vector.success_rate;
  
  // Apply context modifiers
  if (context.stress) {
    adjustedRate *= 1.15;
  }
  
  if (context.driving) {
    adjustedRate *= 1.30;
  }
  
  if (context.timePressure) {
    adjustedRate *= 1.25;
  }
  
  // Cap at 95%
  return Math.min(adjustedRate, 0.95);
}

function getTierData(tier) {
  return authTiers[tier] || null;
}

function getAllTiers() {
  return authTiers;
}

module.exports = {
  authTiers,
  calculateTierBypass,
  getTierData,
  getAllTiers
};


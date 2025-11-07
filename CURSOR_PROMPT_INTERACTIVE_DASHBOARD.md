### ANALYZE MODE: SYSTEM DISRUPTION → HUMAN IMPACT CORRELATION

The ANALYZE mode should provide deep insights into how technical system disruptions translate to real patient health impacts. This is critical for demonstrating the human cost of attacks.

#### Layout for Analyze Mode

┌─────────────────────────────────────────────────────────────────┐
│  📊 ATTACK ANALYSIS - System Disruption → Human Impact          │
├─────────────────────────┬───────────────────────────────────────┤
│  SYSTEM METRICS         │  PATIENT HEALTH IMPACT                │
│  ─────────────────      │  ─────────────────────────            │
│  ● 30% Compromise       │  ● 5 Critical Patients Affected       │
│  ● 5/15 Deliveries      │  ● Avg Health Score: 62/100           │
│  ● 17 min Detection     │  ● Emergency Events: 18% probability  │
│  ● 2.1 Cascade Ratio    │  ● Healthcare Strain: Moderate        │
├─────────────────────────┴───────────────────────────────────────┤
│  CORRELATION VISUALIZATION                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  System Compromise vs Patient Health Impact              │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 100│                                  ╱╲            │ │ │
│  │  │    │                               ╱    ╲           │ │ │
│  │  │  H │                            ╱        ╲          │ │ │
│  │  │  e │                         ╱            ╲         │ │ │
│  │  │  a │                      ╱                ╲        │ │ │
│  │  │  l │ Health Score      ╱                    ╲       │ │ │
│  │  │  t │                ╱                          ╲     │ │ │
│  │  │  h │             ╱                              ╲    │ │ │
│  │  │    │ ─────────╱                                  ╲── │ │ │
│  │  │  0 │────┬────┬────┬────┬────┬────┬────┬────┬────┬─ │ │ │
│  │  │    0   10%  20%  30%  40%  50%  60%  70%  80%  90%│ │ │
│  │  │              System Compromise Level               │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  Current State: 30% → Avg Health Score: 62             │ │
│  └───────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  INDIVIDUAL PATIENT IMPACTS                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Sarah Chen | Insulin | D001 COMPROMISED                 │   │
│  │ ├─ Time Since Expected Dose: 4.2 hours                  │   │
│  │ ├─ Health Status: ⚠️ SERIOUS (45/100)                   │   │
│  │ ├─ Current Symptoms: Extreme thirst, nausea, confusion  │   │
│  │ ├─ Medical Risk: HIGH                                    │   │
│  │ ├─ Actions Taken:                                        │   │
│  │ │  ✓ Called pharmacy (3x)                               │   │
│  │ │  ✓ Contacted doctor                                   │   │
│  │ │  ⚠️ Considering ER visit                              │   │
│  │ └─ Projected Outcome:                                    │   │
│  │    • ER Visit: 35% probability ($3,200 cost)            │   │
│  │    • Emergency Refill: 60% probability ($85 cost)       │   │
│  │    • If delay continues 2+ hours: DKA risk              │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ James Rodriguez | EpiPen | D002 COMPROMISED             │   │
│  │ ├─ Time Without Medication: 1.5 hours                   │   │
│  │ ├─ Health Status: ⚠️ AT RISK (100/100 until exposure)   │   │
│  │ ├─ Current Situation: No symptoms, but VULNERABLE       │   │
│  │ ├─ Medical Risk: LIFE-THREATENING if allergen exposure  │   │
│  │ ├─ Actions Taken:                                        │   │
│  │ │  ✓ Called pharmacy (2x)                               │   │
│  │ │  ✓ Checking alternative pharmacies                    │   │
│  │ │  ⚠️ Avoiding high-risk environments (restaurant)      │   │
│  │ └─ Projected Outcome:                                    │   │
│  │    • Emergency Refill: 40% probability ($120 cost)      │   │
│  │    • If exposure occurs: 911 call, $4,500 ER cost       │   │
│  │    • Death risk: 5-15 minutes without EpiPen            │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  HEALTHCARE SYSTEM STRAIN                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Current System Compromise: 30%                          │   │
│  │                                                          │   │
│  │ Pharmacy Call Volume:                                   │   │
│  │ ████████████████░░░░░░░░ 189 calls/hour (baseline: 45) │   │
│  │ +320% increase                                          │   │
│  │                                                          │   │
│  │ Emergency Room Admissions:                              │   │
│  │ ████████░░░░░░░░░░░░░░░░ 14 today (baseline: 12)       │   │
│  │ +17% increase, wait time: +45 minutes                   │   │
│  │                                                          │   │
│  │ Ambulance Dispatches:                                   │   │
│  │ ██████░░░░░░░░░░░░░░░░░░ 9 today (baseline: 8)         │   │
│  │ +12% increase, response delay: +8 minutes               │   │
│  │                                                          │   │
│  │ Alternative Care Utilization:                           │   │
│  │ • Urgent Care Visits: ↑ 40%                             │   │
│  │ • Telehealth Attempts: ↑ 25%                            │   │
│  │ • Alt. Pharmacy Visits: ↑ 55%                           │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  FINANCIAL IMPACT BREAKDOWN                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Direct Medical Costs:                                   │   │
│  │ • ER Visits (projected): 1.8 × $3,200 = $5,760         │   │
│  │ • Urgent Care: 2.0 × $350 = $700                        │   │
│  │ • Ambulance: 0.7 × $1,800 = $1,260                      │   │
│  │ • Lab Work: 4.2 × $150 = $630                           │   │
│  │                                                          │   │
│  │ Indirect Costs:                                         │   │
│  │ • Productivity Loss: 5 patients × $520 = $2,600         │   │
│  │ • Alternative Medications: $540                         │   │
│  │ • Transportation: $275                                   │   │
│  │                                                          │   │
│  │ Total Estimated Cost: $11,765                           │   │
│  │ (For 5 compromised critical deliveries)                 │   │
│  │                                                          │   │
│  │ Projected at Full 30% Compromise: $49,725               │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  TEMPORAL PROGRESSION ANALYSIS                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ T+0 to T+2 hours:                                       │   │
│  │ • Patients unaware: 80%                                 │   │
│  │ • Health impact: Minimal                                │   │
│  │ • System response: Normal operations                    │   │
│  │                                                          │   │
│  │ T+2 to T+4 hours: ◀── CURRENT STATE                    │   │
│  │ • Patients aware: 100%                                  │   │
│  │ • Health impact: Early symptoms (critical meds)         │   │
│  │ • System response: Increased call volume                │   │
│  │ • Pharmacy calls: +320%                                 │   │
│  │                                                          │   │
│  │ T+4 to T+8 hours (projected):                           │   │
│  │ • Health impact: Moderate-severe symptoms               │   │
│  │ • ER visits: 35% of critical patients                   │   │
│  │ • Urgent care: 40% seeking alternatives                 │   │
│  │ • System strain: Moderate                               │   │
│  │                                                          │   │
│  │ T+8+ hours (projected):                                 │   │
│  │ • Health impact: Critical events, hospitalization       │   │
│  │ • Ambulance calls: 15% of critical patients             │   │
│  │ • Media attention: LIKELY                               │   │
│  │ • Public health response: Emergency protocols           │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  KEY INSIGHTS                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. CORRELATION STRENGTH                                 │   │
│  │    30% system compromise → 62/100 avg patient health    │   │
│  │    Strong linear correlation (r = -0.89)                │   │
│  │                                                          │   │
│  │ 2. CASCADE AMPLIFICATION                                │   │
│  │    Each compromised delivery affects 2.1 adjacent       │   │
│  │    → 5 direct compromises = 10.5 total affected         │   │
│  │                                                          │   │
│  │ 3. HEALTHCARE SYSTEM THRESHOLD                          │   │
│  │    30% represents "moderate strain" threshold           │   │
│  │    40%+ would trigger public health emergency           │   │
│  │                                                          │   │
│  │ 4. TIME-CRITICAL WINDOW                                 │   │
│  │    4-8 hour window: transition from manageable to       │   │
│  │    serious health events for critical medications       │   │
│  │                                                          │   │
│  │ 5. FINANCIAL MULTIPLIER                                 │   │
│  │    $3,315 average cost per critical medication missed   │   │
│  │    Attack creates 15x cost vs. normal delivery ($220)   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

#### Implementation Requirements for Analyze Mode

1. **Correlation Visualization**
   - Use Recharts or similar library for line/area charts
   - X-axis: System compromise percentage (0-100%)
   - Y-axis: Average patient health score (0-100)
   - Show current state marker at 30% compromise
   - Color gradient: green (healthy) → yellow → orange → red (critical)

2. **Individual Patient Impact Cards**
   - For each compromised delivery, show:
     - Patient name and medication
     - Time since expected dose
     - Current health score with color indicator
     - Symptom progression
     - Actions taken by patient
     - Projected outcomes with probabilities and costs

3. **Healthcare System Strain Metrics**
   - Real-time bars showing:
     - Pharmacy call volume vs baseline
     - ER admissions vs baseline
     - Ambulance dispatches
     - Alternative care utilization percentages
   - Use percentage increases with visual indicators

4. **Financial Impact Calculator**
   - Itemized breakdown:
     - Direct medical costs (ER, urgent care, ambulance, labs)
     - Indirect costs (productivity loss, transportation, alternatives)
   - Show per-patient and total costs
   - Extrapolate to full 30% compromise scenario

5. **Temporal Progression Timeline**
   - Show health degradation over time
   - Mark current state in timeline
   - Project future states with health impacts
   - Show when critical thresholds are crossed

6. **Key Insights Summary**
   - Correlation strength (statistical r-value)
   - Cascade amplification factor
   - Healthcare system threshold analysis
   - Time-critical windows
   - Financial multiplier vs normal operations

#### Data Integration

```javascript
import { 
  patientHealthImpacts,
  disruptionCorrelationModel,
  patientJourneyStates
} from './data/syntheticAttackData';


// Calculate patient health score based on time and medication
const calculateHealthImpact = (delivery, timeSinceMissed) => {
  const medicationData = patientHealthImpacts[delivery.medication];
  
  // Find appropriate time bracket
  let timeWindow;
  if (timeSinceMissed < 120) timeWindow = "0-2 hours";
  else if (timeSinceMissed < 240) timeWindow = "2-4 hours";
  else if (timeSinceMissed < 480) timeWindow = "4-8 hours";
  else timeWindow = "8+ hours";
  
  const impact = medicationData.missedDoseImpact[timeWindow];
  
  return {
    healthScore: impact.healthScore,
    severity: impact.severity,
    symptoms: impact.symptoms,
    medicalRisk: impact.medicalRisk,
    interventionNeeded: impact.interventionNeeded,
    alternativeAction: impact.alternativeAction
  };
};


// Calculate correlation metrics
const calculateCorrelation = (compromisePercentage) => {
  // Find appropriate bracket
  let bracket;
  if (compromisePercentage < 10) bracket = "0-10%";
  else if (compromisePercentage < 20) bracket = "10-20%";
  else if (compromisePercentage < 30) bracket = "20-30%";
  else if (compromisePercentage < 40) bracket = "30-40%";
  else bracket = "40%+";
  
  return disruptionCorrelationModel.impactScaling[bracket];
};


// Calculate healthcare system strain
const calculateSystemStrain = (compromisedCount, compromisePercentage) => {
  const strain = disruptionCorrelationModel.healthcareSystemStrain;
  
  return {
    pharmacyCallVolume: strain.pharmacyCallVolume.baseline + 
                       (compromisedCount * strain.pharmacyCallVolume.perCompromisedDelivery),
    erAdmissions: strain.emergencyRoomAdmissions.baseline + 
                 (compromisedCount * strain.emergencyRoomAdmissions.perCompromisedCritical),
    ambulanceDispatches: strain.ambulanceDispatch.baseline + 
                        (compromisedCount * strain.ambulanceDispatch.perCompromisedCritical),
    waitTimeIncrease: (compromisePercentage / 10) * 45 // 45 min per 10%
  };
};
```

#### Visual Design

- Use RED for critical health impacts
- Use ORANGE for moderate health degradation  
- Use YELLOW for early warning signs
- Use GREEN for stable/healthy states
- Show downward arrows (↓) for health decline
- Show upward arrows (↑) for system strain increases
- Use pulsing animations for critical patients
- Highlight time-critical medications with urgency indicators

#### User Interactions

- Click on patient cards to expand full health journey
- Hover over correlation chart to see exact values
- Toggle between individual patient view and aggregate view
- Export detailed impact report as PDF
- Filter by medication type or severity level
- Show/hide projected vs actual outcomes

#### Success Metrics

The analyze mode should clearly demonstrate:

- ✅ 30% system compromise correlates to 62/100 avg health score
- ✅ Individual patient deterioration over time
- ✅ Healthcare system strain at multiple levels
- ✅ Financial costs 15x higher than normal delivery
- ✅ Time-critical windows where intervention needed
- ✅ Cascade effects creating compounding patient impacts

```text
Patient Health Over Time (example) and Healthcare System Strain ASCII diagrams available in specification for quick reference.
```



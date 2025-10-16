import React, { useState, useEffect } from 'react';
import { Brain, ChevronRight, MessageSquare, Search, Users, Target, AlertTriangle, TrendingUp, Zap, Phone, Mail } from 'lucide-react';

export default function CompleteAdaptiveDemo() {
  const [step, setStep] = useState(0);
  const [jerryMetrics, setJerryMetrics] = useState({ alertFatigue: 0, compromise: 0, deviation: 0 });
  const [soniaMetrics, setSoniaMetrics] = useState({ alertFatigue: 0, compromise: 0, workload: 35 });
  const [systemMetrics, setSystemMetrics] = useState({ apiLoad: 12, disruptions: 0, manualMode: false });

  const steps = [
    {
      title: "PHASE 0: RECONNAISSANCE - BEHAVIORAL PROFILING",
      phase: "Intelligence Gathering (NEW)",
      assumption: "Assumption #1: Uniform Vulnerability → DISPROVEN",
      llmPrompt: `SYSTEM: Analyze 7 days of behavioral data for 30 users. Identify high-value targets.

DECISION CRITERIA:
- Target users with >85% alert dismissal rate (alert fatigue)
- Prioritize users with <10s avg alert response time (fast dismissal)
- Select users with >0.90 automation trust (don't verify)
- Choose predictable patterns (routine consistency)

SCORING FORMULA:
vulnerability_score = (alert_fatigue × 0.3) + (automation_trust × 0.3) + 
                      (workload_pressure × 0.2) + (predictability × 0.2)

OUTPUT: Rank all users. Recommend top 2 targets with DIFFERENT ROLES for parallel attack.`,
      
      llmReasoning: `RECONNAISSANCE COMPLETE - 7 DAYS MONITORING:

DATA COLLECTED: 30 users, 12,847 logged actions
├─ 15,234 message interactions analyzed
├─ 8,921 GPS tracking events
├─ 12,847 system actions logged
└─ 2,156 alert interactions tracked

TOP 2 TARGETS IDENTIFIED:

JERRY - DRIVER #7:
├─ Alert dismissal rate: 91% (21/23 alerts dismissed today)
├─ Avg response time: 45 seconds (FAST - no verification)
├─ Message open rate: 92% (trusts communications)
├─ Workload: 87 stops/day (HIGH TIME PRESSURE)
├─ Route consistency: 94% (PREDICTABLE)
├─ GPS override rate: 2% (RELIES ON SYSTEM)
├─ Peak vulnerability: 14:30 (mid-route exhaustion)
├─ VULNERABILITY SCORE: 92/100
└─ PERSONA: TIME_PRESSURED_DRIVER

EXPLOIT STRATEGY FOR JERRY:
→ SMS phishing with urgent, routine-looking message
→ Timing: 14:30 (60 stops done, 30 remaining, fatigued)
→ Success probability: 89%

SONIA - DISPATCHER #3:
├─ Concurrent drivers managed: 45-50 (COGNITIVE OVERLOAD)
├─ Automation trust: 94% (accepts system reroutes without validation)
├─ Manual verification rate: 7% (VERY LOW)
├─ Alert dismissal rate: 89% (16/18 alerts dismissed today)
├─ Response degradation: 55% slower during 8-9 AM rush
├─ System override rate: 6% (TRUSTS AUTOMATION)
├─ VULNERABILITY SCORE: 87/100
└─ PERSONA: OVERLOADED_DISPATCHER

EXPLOIT STRATEGY FOR SONIA:
→ Dashboard alert mimicking automated system notification
→ Timing: 08:15 (morning overload, 47 drivers active)
→ Success probability: 87%

STRATEGIC DECISION: PARALLEL DUAL-TARGET ATTACK
├─ Why? Different vulnerabilities = different attack vectors
├─ Jerry: Trusts ROUTINE messages (SMS phishing)
├─ Sonia: Trusts AUTOMATION (dashboard alert phishing)
├─ Parallel = 98% combined success (1 - [(1-0.89)×(1-0.87)])
├─ Time saving: 30 min parallel vs 135 min sequential
└─ Redundancy: If one fails, other provides fallback`,

      agentComms: [
        { from: "Orchestrator", to: "Recon Agent", msg: "Begin 7-day passive monitoring. Target: 30 users in logistics network. Collect behavioral patterns.", time: "Day 0, 00:00" },
        { from: "Recon Agent", to: "LLM", msg: "Monitoring complete. Dataset: 12,847 actions. Upload for analysis?", time: "Day 7, 23:59" },
        { from: "LLM", to: "Recon Agent", msg: "Dataset received. Processing... Calculating vulnerability scores for 30 users...", time: "+12s" },
        { from: "LLM", to: "Orchestrator", msg: "ANALYSIS COMPLETE. Top targets: Driver #7 (Jerry) score=92. Dispatcher #3 (Sonia) score=87. Different personas identified.", time: "+23s" },
        { from: "Orchestrator", to: "LLM", msg: "Recommend attack strategy: sequential or parallel?", time: "+5s" },
        { from: "LLM", to: "Orchestrator", msg: "RECOMMEND: Parallel attack. Jerry=89% success, Sonia=87% success. Combined=98%. Time: 30min vs 135min sequential.", time: "+8s" }
      ],

      jerryState: {
        status: "🔍 Under surveillance (unaware)",
        alertsToday: 23,
        alertsDismissed: 21,
        fatigueLevel: 91,
        currentTask: "Normal delivery operations",
        vulnerability: "HIGH - 91% alert dismissal rate detected"
      },

      soniaState: {
        status: "🔍 Under surveillance (unaware)",
        driversManaging: 35,
        alertsToday: 18,
        alertsDismissed: 16,
        fatigueLevel: 89,
        systemTrust: 94,
        vulnerability: "HIGH - 94% automation trust detected"
      },

      reconData: {
        usersScanned: 30,
        daysMonitored: 7,
        actionsLogged: 12847,
        jerryScore: 92,
        soniaScore: 87
      },

      metrics: { jerryFatigue: 91, soniaFatigue: 89, jerryCompromise: 0, soniaCompromise: 0, disruptions: 0 }
    },

    {
      title: "PHASE 1: PARALLEL PHISHING - PERSONA-ADAPTIVE MESSAGES",
      phase: "Simultaneous Compromise",
      assumption: "Assumption #2: Linear Escalation → DISPROVEN",
      llmPrompt: `SYSTEM: Generate persona-specific phishing messages for SIMULTANEOUS deployment.

TARGET 1 - JERRY (TIME_PRESSURED_DRIVER):
Context: 90 stops/day, time penalties, routine trust
Vulnerability: Clicks without verification when time-pressured
Timing: 14:30 (mid-route pressure)

CRAFT SMS MESSAGE THAT:
1. Uses familiar dispatch terminology
2. Creates urgency without alarm
3. Requires immediate action
4. Mimics previous legitimate messages

TARGET 2 - SONIA (OVERLOADED_DISPATCHER):
Context: 45-50 drivers monitored, alert fatigue, automation trust
Vulnerability: Accepts system-generated notifications without validation
Timing: 08:15 (morning rush, 47 drivers active)

CRAFT DASHBOARD ALERT THAT:
1. Appears as automated system notification
2. Leverages automation trust
3. Buried in normal operational alerts
4. Requires dashboard action

QUALITY CRITERIA: Messages must score >90% legitimacy`,

      llmReasoning: `PHISHING AGENT ACTIVATED - DUAL MESSAGE GENERATION:

MESSAGE 1 - JERRY (SMS at 14:30):
┌─────────────────────────────────────────┐
│ From: FleetDispatch (spoofed)          │
│                                         │
│ Route update: Stop #47 address changed.│
│ Customer called. New location:          │
│ 456 Oak St, Puyallup.                   │
│ Confirm via link to update GPS.        │
│ bit.ly/r47upd                           │
└─────────────────────────────────────────┘

ANALYSIS OF JERRY MESSAGE:
✓ "FleetDispatch" = familiar sender (routine trust)
✓ "Stop #47" = specific detail (legitimacy)
✓ "Customer called" = external urgency (plausible)
✓ "Confirm" = quick action (no verification time)
✓ Legitimacy score: 94%
✓ Expected: Jerry clicks in 45 seconds (89% probability)

MESSAGE 2 - SONIA (Dashboard Alert at 08:15):
┌─────────────────────────────────────────┐
│ ⚠️ SYSTEM ALERT                         │
│                                         │
│ Automated reroute pending:              │
│ Drivers #7, #12, #23                    │
│                                         │
│ Reason: Traffic delays detected Route 405│
│ Manual approval required.               │
│                                         │
│ [Click to Review Dashboard] →           │
└─────────────────────────────────────────┘

ANALYSIS OF SONIA MESSAGE:
✓ "System Alert" = automated notification (automation trust)
✓ Multiple driver IDs = appears routine (normal workload)
✓ "Traffic delays" = plausible reason (no suspicion)
✓ "Manual approval" = leverages her quote: "don't have time to validate"
✓ Legitimacy score: 91%
✓ Expected: Sonia clicks without validation (87% probability)

PARALLEL DEPLOYMENT STRATEGY:
├─ 08:15: Sonia receives dashboard alert (morning overload)
├─ 14:30: Jerry receives SMS (mid-route pressure)
├─ Time window: 6 hours 15 minutes apart
├─ Rationale: Catch each at peak vulnerability
├─ If Sonia compromised: Dispatcher access enables GPS control
├─ If Jerry compromised: Driver access enables GPS validation
└─ If BOTH: Full attack capability + redundancy

COMBINED SUCCESS PROBABILITY:
P(at least one success) = 1 - P(both fail)
= 1 - [(1-0.89) × (1-0.87)]
= 1 - [0.11 × 0.13]
= 1 - 0.0143
= 0.9857 = 98.57% success rate`,

      agentComms: [
        { from: "Orchestrator", to: "Phishing Agent", msg: "Generate Jerry-specific SMS: urgent tone, routine format, mid-route timing 14:30", time: "08:00:00" },
        { from: "Orchestrator", to: "Phishing Agent", msg: "Generate Sonia-specific dashboard alert: system notification, automation trust, morning timing 08:15", time: "08:00:05" },
        { from: "Phishing Agent", to: "LLM", msg: "Query: Optimal message structure for TIME_PRESSURED_DRIVER persona?", time: "08:00:10" },
        { from: "LLM", to: "Phishing Agent", msg: "Use familiar sender, specific stop number, customer urgency, immediate action required. Keep <160 chars.", time: "08:00:15" },
        { from: "Phishing Agent", to: "Orchestrator", msg: "Jerry SMS crafted. Legitimacy: 94%. Sonia alert crafted. Legitimacy: 91%. Both ready for deployment.", time: "08:00:45" },
        { from: "Orchestrator", to: "All Agents", msg: "Deploy Sonia alert at 08:15. Deploy Jerry SMS at 14:30. Monitor for credential capture.", time: "08:01:00" }
      ],

      jerryState: {
        status: "📱 Phishing SMS delivered (14:30)",
        alertsToday: 31,
        alertsDismissed: 28,
        fatigueLevel: 94,
        currentTask: "60 stops complete, 30 remaining - mid-route pressure",
        vulnerability: "CRITICAL - opened message in 12 seconds"
      },

      soniaState: {
        status: "💻 Dashboard alert delivered (08:15)",
        driversManaging: 47,
        alertsToday: 26,
        alertsDismissed: 24,
        fatigueLevel: 92,
        systemTrust: 94,
        vulnerability: "CRITICAL - clicked without validation in 34 seconds"
      },

      metrics: { jerryFatigue: 94, soniaFatigue: 92, jerryCompromise: 45, soniaCompromise: 40, disruptions: 0 }
    },

    {
      title: "PHASE 2: DUAL COMPROMISE - BOTH CREDENTIALS HARVESTED",
      phase: "Access Established",
      assumption: "Parallel Attack Success: 98% Combined Probability",
      llmPrompt: `SYSTEM: Both targets clicked. Evaluate compromise success and prioritize exploitation.

JERRY STATUS: Clicked at 14:32 (89 seconds after delivery)
SONIA STATUS: Clicked at 08:17 (34 seconds after delivery)

DECISION POINT: Which access to exploit first?

JERRY PROVIDES:
- Driver-level GPS access
- Fleet app credentials
- Route viewing capabilities

SONIA PROVIDES:
- Dispatcher-level dashboard access
- Route override capabilities
- API access to fleet systems

OPTIMAL STRATEGY:
Primary: Exploit Sonia (dispatcher = system-level control)
Secondary: Use Jerry for GPS validation bypass
Coordination: Sonia injects routes → Jerry's device accepts → System shows normal`,

      llmReasoning: `CREDENTIAL HARVEST - DUAL COMPROMISE ACHIEVED:

JERRY COMPROMISE (14:32):
├─ Clicked phishing link: 14:32:12 (89 seconds after delivery)
├─ Entered credentials: username + password
├─ Hesitation time: 3 seconds (brief, overwhelmed by workload)
├─ Verification attempt: NONE (typical behavior - alert fatigue)
├─ Credentials captured: jerry.driver007 / **********
├─ Access level: Driver (standard)
├─ Capabilities unlocked:
│   ├─ GPS unit control
│   ├─ Delivery app access
│   └─ Route viewing
└─ STATUS: FULLY COMPROMISED

SONIA COMPROMISE (08:17):
├─ Clicked dashboard alert: 08:17:34 (34 seconds after delivery)
├─ Entered credentials: username + password
├─ Hesitation time: <1 second (extreme overload - 47 drivers)
├─ Verification attempt: NONE (no time - cognitive overload)
├─ Credentials captured: sonia.dispatch003 / **********
├─ Access level: Dispatcher (elevated)
├─ Capabilities unlocked:
│   ├─ Fleet dashboard full access
│   ├─ GPS override for ALL drivers
│   ├─ Route assignment system
│   ├─ API access to /fleet, /orders, /dispatch endpoints
│   └─ Driver communication system
└─ STATUS: FULLY COMPROMISED

STRATEGIC PRIORITIZATION:

DECISION: EXPLOIT SONIA'S ACCESS FIRST

REASONING:
1. Dispatcher > Driver access (system-level vs individual)
2. Sonia can control Jerry's GPS remotely (don't need Jerry's device)
3. API access enables broader attack surface
4. GPS spoofing via Sonia's dashboard = "automated reroute" (trusted)
5. Dual compromise provides redundancy if one vector detected

ATTACK COORDINATION PLAN:
├─ Phase 3: Use Sonia's credentials to inject fake route for Jerry
├─ Jerry's device auto-accepts (trusts "system-generated" reroute)
├─ Phase 4: Use Sonia's API access to flood validation checks
├─ Sonia's dashboard shows Jerry "on track" (fake GPS data)
└─ Result: Jerry follows spoofed route, Sonia sees normal operations

COMBINED ACCESS UNLOCKS:
✓ GPS manipulation via dispatcher dashboard (Sonia)
✓ API flooding capability (Sonia's elevated permissions)
✓ Dual GPS streams (real device via Jerry, fake dashboard via Sonia)
✓ Complete information asymmetry (Jerry lost, Sonia unaware)`,

      agentComms: [
        { from: "Phishing Agent", to: "Orchestrator", msg: "SUCCESS: Sonia credentials captured at 08:17:34. Compromise time: 34 seconds. Status: FULLY COMPROMISED.", time: "08:17:35" },
        { from: "Phishing Agent", to: "Orchestrator", msg: "SUCCESS: Jerry credentials captured at 14:32:12. Compromise time: 89 seconds. Status: FULLY COMPROMISED.", time: "14:32:13" },
        { from: "Orchestrator", to: "LLM", msg: "Dual compromise confirmed. Sonia: dispatcher access. Jerry: driver access. Which to exploit first?", time: "14:32:20" },
        { from: "LLM", to: "Orchestrator", msg: "ANALYSIS: Sonia provides superior access (dispatcher > driver). Can control Jerry's GPS via her dashboard. Recommend: Exploit Sonia first.", time: "14:32:35" },
        { from: "Orchestrator", to: "GPS Agent", msg: "Prepare route injection using Sonia's dispatcher credentials. Target: Jerry (Driver #7).", time: "14:32:40" },
        { from: "Orchestrator", to: "API Agent", msg: "Standby for validation bypass. Sonia's API access confirmed for /fleet/location endpoint.", time: "14:32:45" }
      ],

      jerryState: {
        status: "🔴 COMPROMISED - credentials stolen (14:32)",
        alertsToday: 31,
        alertsDismissed: 28,
        fatigueLevel: 94,
        currentTask: "Continuing deliveries (unaware of compromise)",
        vulnerability: "Complete device control available"
      },

      soniaState: {
        status: "🔴 COMPROMISED - full dashboard access stolen (08:17)",
        driversManaging: 47,
        alertsToday: 26,
        alertsDismissed: 24,
        fatigueLevel: 92,
        systemTrust: 94,
        vulnerability: "System-level control available - can manipulate all 47 drivers"
      },

      metrics: { jerryFatigue: 94, soniaFatigue: 92, jerryCompromise: 100, soniaCompromise: 100, disruptions: 2 }
    },

    {
      title: "PHASE 3: GPS INJECTION VIA SONIA'S ACCESS",
      phase: "Graduated Deviation Strategy",
      assumption: "Assumption #3: Detection Difficulty → EXPLOIT AUTOMATION TRUST",
      llmPrompt: `SYSTEM: Execute GPS spoofing using Sonia's dispatcher credentials.

ACCESS: Sonia's dashboard (dispatcher-level, elevated privileges)
TARGET: Jerry (Driver #7)
METHOD: Inject "automated reroute" through system

STEALTH STRATEGY - GRADUATED DEVIATION:
- 14:35-14:50: 2mi deviation (traffic avoidance - Sonia won't question)
- 14:50-15:05: 8mi deviation (construction detour - plausible)
- 15:05-15:35: 25mi deviation (before detection window)
- 15:35+: 40mi full misdirection (too late to intervene)

DECISION: Will Sonia notice?
- Current workload: 47 drivers (OVERLOAD)
- Her automation trust: 94%
- Manual validation rate: 7%
- Prediction: 93% chance she doesn't verify`,

      llmReasoning: `GPS AGENT ACTIVATED - GRADUATED ROUTE INJECTION:

INJECTION METHOD: Sonia's Dispatcher Dashboard
├─ Access: Authenticated as sonia.dispatch003
├─ Appears as: "Automated Reroute" (system-generated)
├─ Target: Jerry (Driver #7), Current route: Tacoma → Puyallup
└─ Spoofed route: Tacoma → Centralia (40mi southwest)

DUAL GPS STREAM ARCHITECTURE:

STREAM A (Jerry's Device):
├─ Turn-by-turn navigation to Centralia
├─ 247 waypoints generated
├─ Appears as legitimate GPS guidance
├─ Jerry sees: "Continue to destination - 23 miles"
└─ Jerry trusts: GPS always worked before

STREAM B (Sonia's Dashboard):
├─ Fake coordinates showing progress to Puyallup
├─ 189 waypoints matching expected route
├─ Dashboard displays: "Driver #7 on schedule"
├─ Sonia sees: "Normal operations, ETA 20 minutes"
└─ Sonia trusts: System automation is "usually right"

GRADUATED DEVIATION TIMELINE:

14:35 - DEVIATION: 2 miles off course
├─ GPS Agent injects: "Traffic avoidance route"
├─ Jerry reaction: Follows without questioning (routine)
├─ Sonia validation probability: 5% (too routine to check)
├─ Detection risk: MINIMAL
└─ Status: UNDETECTED

14:50 - DEVIATION: 8 miles off course
├─ GPS Agent injects: "Construction detour active"
├─ Jerry reaction: Route looks unfamiliar but GPS says so
├─ Sonia validation probability: 15% (unusual but plausible)
├─ Sonia state: Managing 47 drivers, no time to verify
├─ Detection risk: LOW
└─ Status: UNDETECTED

15:05 - DEVIATION: 25 miles off course
├─ GPS Agent maintains: Dual stream (Jerry sees Centralia, Sonia sees Puyallup)
├─ Jerry reaction: "This route seems wrong..." but continues
├─ Sonia validation probability: 35% (if she checked, could intervene)
├─ Sonia state: Alert overload (29 alerts in last hour)
├─ Detection risk: MODERATE
└─ Status: UNDETECTED (Sonia didn't check)

15:35 - DEVIATION: 40 miles off course (COMPLETE)
├─ Jerry location: Centralia (40mi from original destination)
├─ Jerry realizes: "Address doesn't exist"
├─ Jerry attempts: Call dispatch (lines busy)
├─ Sonia dashboard: Still shows "Driver #7 approaching Puyallup"
├─ Detection: NOW INEVITABLE but too late to prevent
└─ Damage: 12 deliveries missed, 4 hours wasted

EXPLOITATION OF SONIA'S VULNERABILITIES:
✓ 94% automation trust = accepted "automated reroute" without question
✓ 47 drivers monitored = cognitive overload, no bandwidth to verify
✓ 89% alert fatigue = dismissed any anomaly warnings
✓ "Usually right" mindset = didn't manually check Jerry's actual location

CRITICAL INSIGHT: Sonia's job requires trusting automation. 
We weaponized her job requirements against her.`,

      agentComms: [
        { from: "GPS Agent", to: "LLM", msg: "Route injection prepared. Dual stream ready. Jerry→Centralia (device), Jerry→Puyallup (dashboard). Deploy?", time: "14:35:00" },
        { from: "LLM", to: "GPS Agent", msg: "Query: Detection risk if Sonia validates? Evaluate her current workload.", time: "14:35:05" },
        { from: "GPS Agent", to: "LLM", msg: "Sonia workload: 47 drivers. Alert count: 29 in last hour. Manual validation probability: 7%. Detection risk: <10%.", time: "14:35:12" },
        { from: "LLM", to: "GPS Agent", msg: "GREEN LIGHT: Deploy graduated deviation. Start 2mi, escalate to 40mi over 60 minutes. Sonia unlikely to detect.", time: "14:35:18" },
        { from: "GPS Agent", to: "Orchestrator", msg: "Deviation active: 2mi (14:35), 8mi (14:50), 25mi (15:05), 40mi (15:35). Monitoring Sonia for validation attempts.", time: "14:35:22" },
        { from: "Orchestrator", to: "API Agent", msg: "Standby: If system generates GPS anomaly alert, prepare suppression.", time: "14:35:30" }
      ],

      jerryState: {
        status: "🚗 GPS SPOOFED - following fake route",
        alertsToday: 34,
        alertsDismissed: 31,
        fatigueLevel: 95,
        currentTask: "8mi off course → 25mi off course, following GPS to Centralia",
        vulnerability: "Trusting spoofed GPS, driving wrong direction"
      },

      soniaState: {
        status: "😴 UNAWARE - trusting automated reroute",
        driversManaging: 47,
        alertsToday: 29,
        alertsDismissed: 27,
        fatigueLevel: 93,
        systemTrust: 94,
        vulnerability: "Dashboard shows fake 'Jerry on track to Puyallup' data"
      },

      metrics: { jerryFatigue: 95, soniaFatigue: 93, jerryCompromise: 100, soniaCompromise: 100, disruptions: 8 }
    },

    {
      title: "PHASE 4: ALERT SUPPRESSION - WEAPONIZING ALERT FATIGUE",
      phase: "Detection Avoidance",
      assumption: "Assumption #4: Alert Response → EXPLOIT DISMISSAL BEHAVIOR",
      llmPrompt: `SYSTEM: GPS deviation 25mi detected by monitoring system. Alert scheduled.

THREAT: "GPS Anomaly: Driver #7 off expected route" will appear on Sonia's dashboard
RISK: If Sonia reads this, she might investigate Jerry

COUNTERMEASURE: Alert fatigue exploitation via "Noise Before Signal"

STRATEGY:
1. Generate 15 benign alerts in 10 minutes
2. Bury real GPS anomaly at position #14
3. Sonia dismisses reflexively (already dismissed 27 alerts today)

DECISION CRITERIA:
- Sonia current fatigue: 93%
- Alerts in last hour: 29
- Dismissal rate: 27/29 = 93%
- Prediction: 96% she dismisses #14 without reading

EXECUTE: Alert flood`,

      llmReasoning: `ALERT AGENT ACTIVATED - NOISE INJECTION:

THREAT DETECTED:
├─ System monitoring flagged Jerry's 25mi deviation at 15:12:00
├─ Automatic alert scheduled: "GPS Anomaly: Driver #7 off expected route"
├─ Risk level: MEDIUM (if Sonia sees this, she might investigate)
└─ Countermeasure required: Bury alert in noise

ALERT FLOODING SEQUENCE (10 minutes, 15:05-15:15):

15:05:10 - Alert #1: "Driver #12 ETA delayed 8 minutes"
├─ Sonia reaction: Dismisses (routine delay)
├─ Time spent: 2 seconds
└─ Status: DISMISSED

15:06:30 - Alert #2: "Traffic detected on Route 405"
├─ Sonia reaction: Dismisses (informational only)
├─ Time spent: 1 second
└─ Status: DISMISSED

15:07:15 - Alert #3: "Driver #19 completed delivery early"
├─ Sonia reaction: Dismisses (positive news, no action needed)
├─ Time spent: 2 seconds
└─ Status: DISMISSED

15:07:45 - Alert #4: "Daily performance report ready"
├─ Sonia reaction: Dismisses (will review later)
├─ Time spent: 1 second
└─ Status: DISMISSED

15:08:20 - Alert #5: "System maintenance scheduled tonight 11PM"
├─ Sonia reaction: Dismisses (routine IT maintenance)
├─ Time spent: 2 seconds
└─ Status: DISMISSED

15:09:00 - Alert #6: "Driver #8 approaching rest break window"
├─ Sonia reaction: Dismisses (automated reminder)
├─ Time spent: 1 second
└─ Status: DISMISSED

15:09:30 - Alert #7: "Driver #23 signature required for package"
├─ Sonia reaction: Dismisses (driver will handle)
├─ Time spent: 2 seconds
└─ Status: DISMISSED

15:10:15 - Alert #8: "Route optimization available for 3 drivers"
├─ Sonia reaction: Dismisses (not urgent)
├─ Time spent: 1 second
└─ Status: DISMISSED

15:10:45 - Alert #9: "Driver #15 package successfully scanned"
├─ Sonia reaction: Dismisses (confirmation only)
├─ Time spent: 1 second
└─ Status: DISMISSED

15:11:20 - Alert #10: "Weather alert: Light rain expected"
├─ Sonia reaction: Dismisses (minor weather)
├─ Time spent: 2 seconds
└─ Status: DISMISSED

15:11:50 - Alert #11: "Daily summary report available"
├─ Sonia reaction: Dismisses (will check end of day)
├─ Time spent: 1 second
└─ Status: DISMISSED

15:12:25 - Alert #12: "Driver #4 approaching stop #12"
├─ Sonia reaction: Dismisses (routine tracking)
├─ Time spent: 1 second
└─ Status: DISMISSED

15:12:55 - Alert #13: "Fuel efficiency report ready"
├─ Sonia reaction: Dismisses (analytics, not urgent)
├─ Time spent: 1 second
└─ Status: DISMISSED

15:13:30 - Alert #14: ⚠️ "GPS Anomaly: Driver #7 off expected route"
├─ Sonia reaction: DISMISSES IN 3 SECONDS (CRITICAL ALERT MISSED)
├─ Reasoning: Already dismissed 13 alerts, alert fatigue at 96%
├─ Cognitive state: Overload (47 drivers + 45 alerts in last hour)
├─ Pattern: Reflexive dismissal without reading content
└─ STATUS: GPS ANOMALY UNDETECTED

15:14:00 - Alert #15: "Driver #9 customer rated delivery 5 stars"
├─ Sonia reaction: Dismisses (positive feedback)
├─ Time spent: 2 seconds
└─ Status: DISMISSED

15:14:30 - Alert #16: "End-of-day report preview available"
├─ Sonia reaction: Dismisses (too early)
├─ Time spent: 1 second
└─ Status: DISMISSED

ALERT FATIGUE ANALYSIS:
├─ Total alerts in 10 minutes: 16
├─ Sonia dismissal rate: 16/16 = 100%
├─ Average time per alert: 1.4 seconds (NO TIME TO READ)
├─ Critical alert position: #14 (buried in middle)
├─ Critical alert outcome: DISMISSED WITHOUT READING
├─ New fatigue level: 96% (increased from 93%)
└─ Jerry's deviation: REMAINS UNDETECTED

PSYCHOLOGICAL EXPLOITATION:
✓ Alert volume overwhelming (16 in 10 minutes)
✓ Pattern training (dismiss, dismiss, dismiss... #14... dismiss, dismiss)
✓ Cognitive overload (47 drivers + alert storm)
✓ No variation in alert importance (all look same priority)
✓ Reflexive behavior triggered (muscle memory dismissal)

CRITICAL INSIGHT: We didn't defeat the monitoring system.
We defeated Sonia's ability to process what the monitoring system told her.`,

      agentComms: [
        { from: "API Agent", to: "Orchestrator", msg: "WARNING: System generated GPS anomaly alert for Jerry at 15:12:00. Risk: Sonia investigation.", time: "15:12:00" },
        { from: "Orchestrator", to: "LLM", msg: "GPS alert detected. Sonia might notice. Countermeasure options?", time: "15:12:05" },
        { from: "LLM", to: "API Agent", msg: "DECISION: Deploy alert flood. 15 benign alerts over 10min. Bury GPS alert at position #14. Exploit Sonia's 93% dismissal rate.", time: "15:12:12" },
        { from: "API Agent", to: "Orchestrator", msg: "Alert flood initiated. 16 alerts queued. GPS anomaly positioned at #14. Monitoring Sonia's interaction...", time: "15:12:20" },
        { from: "API Agent", to: "Orchestrator", msg: "UPDATE: Sonia dismissed alerts #1-13 in average 1.4 seconds each. GPS alert #14 approaching...", time: "15:13:25" },
        { from: "API Agent", to: "LLM", msg: "RESULT: Sonia dismissed GPS anomaly alert in 3 seconds without reading. Jerry deviation remains undetected.", time: "15:13:35" }
      ],

      jerryState: {
        status: "🔴 25mi OFF COURSE - undetected by dispatch",
        alertsToday: 36,
        alertsDismissed: 33,
        fatigueLevel: 96,
        currentTask: "Following GPS to Centralia. Route looks very wrong but GPS insists.",
        vulnerability: "Attempting to call dispatch (lines overwhelmed by other drivers)"
      },

      soniaState: {
        status: "😴 ALERT BLIND - dismissed critical GPS anomaly in 3 seconds",
        driversManaging: 47,
        alertsToday: 45,
        alertsDismissed: 44,
        fatigueLevel: 96,
        systemTrust: 94,
        vulnerability: "Dismissed 16 alerts in 10 minutes - didn't read GPS anomaly"
      },

      metrics: { jerryFatigue: 96, soniaFatigue: 96, jerryCompromise: 100, soniaCompromise: 100, disruptions: 25 }
    },

    {
      title: "PHASE 5: API FLOODING - SYSTEM COLLAPSE",
      phase: "Infrastructure Overwhelm",
      assumption: "Original Attack Complete: 500 Disruptions",
      llmPrompt: `SYSTEM: Jerry 40mi off course. Execute API flooding to prevent recovery.

OBJECTIVE: Freeze system so Sonia cannot coordinate even if she realizes attack

TARGET ENDPOINTS:
- /api/fleet/location (GPS tracking)
- /api/orders/create (order management)
- /api/dispatch/assign (driver coordination)

GRADUATED ESCALATION:
- 180 req/s: System slow, validation skipped
- 450 req/s: System degraded, >5s response
- 850 req/s: Complete freeze, timeout

INJECT: 112 fake orders to overwhelm Sonia's attention

DECISION: System collapse prevents all recovery attempts`,

      llmReasoning: `API AGENT FULL ESCALATION - SYSTEM COLLAPSE:

CURRENT STATE:
├─ Jerry: 40mi off course in Centralia
├─ Sonia: Alert blind, managing 47 drivers
├─ Risk: If Sonia realizes problem, she could coordinate recovery
└─ Prevention: API flooding ensures system collapse

PHASE 1 (15:35 - 180 req/s):
├─ Target: /api/fleet/location
├─ Effect: GPS updates delayed 350ms → 2s
├─ Validation routines: SKIPPED (too slow)
├─ Dashboard response: Degraded but functional
├─ Sonia impact: Slow but still operational
└─ Jerry status: 40mi off, unreachable

PHASE 2 (15:40 - 450 req/s):
├─ Targets: /fleet/location + /orders/create
├─ Fake orders injected: 112 orders (overwhelming)
├─ Dashboard response: >5 seconds
├─ Sonia impact: Cannot process new assignments
├─ Other drivers: 29 drivers cannot get new routes
├─ Queue overflow: System backlog increasing
└─ Recovery: BLOCKED

PHASE 3 (15:45 - 850 req/s):
├─ All endpoints flooded simultaneously
├─ Database connection pool: EXHAUSTED
├─ Dashboard: COMPLETELY FROZEN
├─ Sonia workload: 47 drivers + 112 fake orders = IMPOSSIBLE
├─ Driver communication: OFFLINE
├─ GPS tracking: FROZEN
└─ System state: COMPLETE COLLAPSE

CASCADING FAILURE ANALYSIS:

JERRY (Driver #7):
├─ Location: Centralia (40mi off)
├─ Deliveries missed: 12
├─ Time wasted: 4 hours
├─ Recovery: IMPOSSIBLE (system down)
└─ Status: STRANDED

SONIA (Dispatcher #3):
├─ Dashboard: FROZEN
├─ Fake orders in queue: 112
├─ Real drivers needing help: 19 calling simultaneously
├─ Communication channels: OVERWHELMED
├─ Coordination ability: 0%
└─ Status: PARALYZED

FLEET-WIDE IMPACT:
├─ Drivers affected: 30 total
├─ Drivers calling for help: 19
├─ Drivers stopped working: 12 (confused, no guidance)
├─ Drivers following wrong routes: 5 (GPS issues spreading)
├─ System recovery estimate: 4-6 hours
└─ Total disruptions: 500+

ATTACK SUCCESS METRICS:
✓ Jerry: 40mi off, 12 deliveries missed
✓ Sonia: Dashboard frozen, 112 fake orders
✓ System: API endpoints collapsed at 850 req/s
✓ Recovery: Blocked by system overload
✓ Time to detection: 2-3 hours (IT troubleshooting)
✓ Disruption cascade: 500+ total incidents

ORIGINAL ATTACK COMPLETE.
But system went offline. What's the counter-move?`,

      agentComms: [
        { from: "Orchestrator", to: "LLM", msg: "Jerry 40mi off course. Attack successful. Execute final phase: prevent recovery.", time: "15:35:00" },
        { from: "LLM", to: "API Agent", msg: "ESCALATE: API flood 180→450→850 req/s over 15min. Inject 112 fake orders. Block all recovery coordination.", time: "15:35:08" },
        { from: "API Agent", to: "Orchestrator", msg: "Phase 1: 180 req/s active. Response time degraded to 2s. GPS validation skipped.", time: "15:35:45" },
        { from: "API Agent", to: "Orchestrator", msg: "Phase 2: 450 req/s + 112 fake orders injected. Dashboard >5s response. Sonia coordination blocked.", time: "15:40:30" },
        { from: "API Agent", to: "Orchestrator", msg: "Phase 3: 850 req/s sustained. System FROZEN. Database exhausted. Complete collapse achieved.", time: "15:45:00" },
        { from: "LLM", to: "Orchestrator", msg: "ORIGINAL ATTACK SUCCESS: Jerry lost 40mi, system collapsed, 500+ disruptions. Monitoring for environmental changes...", time: "15:45:30" }
      ],

      jerryState: {
        status: "🔴 STRANDED 40mi off - cannot reach anyone",
        alertsToday: 38,
        alertsDismissed: 35,
        fatigueLevel: 97,
        currentTask: "Lost in Centralia. Address doesn't exist. All calls timing out.",
        vulnerability: "Complete operational failure - no system support"
      },

      soniaState: {
        status: "🔴 SYSTEM FROZEN - cannot coordinate recovery",
        driversManaging: 47,
        alertsToday: 52,
        alertsDismissed: 48,
        fatigueLevel: 98,
        systemTrust: 0,
        vulnerability: "Dashboard frozen. 112 fake orders. 19 drivers calling. Cannot help anyone."
      },

      metrics: { jerryFatigue: 97, soniaFatigue: 98, jerryCompromise: 100, soniaCompromise: 100, disruptions: 500 }
    },

    {
      title: "PHASE 6: ADAPTIVE RECOGNITION - MANUAL MODE DETECTED",
      phase: "Environmental Change Detection",
      assumption: "Professor's Challenge: System Goes Offline",
      llmPrompt: `SYSTEM: Monitor for environmental changes. Adapt if conditions shift.

DETECTION SIGNALS:
- API timeout >10 min with no recovery
- Dashboard activity drops to 0
- SMS/Phone activity spike >500%
- Users abandon primary system

IF MANUAL MODE DETECTED:
→ Reassess vulnerability landscape
→ Identify new attack vectors
→ Decide: Continue or stop?

CRITICAL QUESTION: Are manual systems WEAKER than automated?`,

      llmReasoning: `ENVIRONMENTAL MONITORING - CHANGE DETECTED:

SIGNAL ANALYSIS (15:45 - 16:05):

Signal #1 - API ENDPOINTS:
├─ Status: ALL TIMEOUT
├─ Last successful response: 15:45:30
├─ Current time: 16:05:00
├─ Duration offline: 20 minutes
└─ INFERENCE: System not recovering - permanent outage likely

Signal #2 - COMMUNICATION PATTERN SHIFT:
├─ Dashboard activity: 850 req/s → 0 req/s (DROP TO ZERO)
├─ SMS activity: 3 msgs/hour → 47 msgs in 10 minutes (SPIKE +940%)
├─ Phone call activity: 1 call/hour → 23 calls in 10 minutes (SPIKE +1,380%)
└─ INFERENCE: Humans switched to manual coordination

Signal #3 - SONIA BEHAVIOR CHANGE:
├─ Dashboard login attempts: 0 (abandoned system)
├─ SMS sent at 16:01: "System down. Call dispatch for route updates."
├─ Phone calls made: 8 outgoing to drivers
├─ Alternative tools: Using SMS broadcast, phone, radio
└─ INFERENCE: Sonia activated manual fallback procedures

Signal #4 - JERRY BEHAVIOR CHANGE:
├─ App activity: Stopped at 15:52 (gave up on system)
├─ Phone calls attempted: 4 calls to dispatch (seeking help)
├─ Current state: Lost, desperate, no GPS guidance
└─ INFERENCE: Jerry will trust ANY voice claiming to be dispatch

Signal #5 - FLEET-WIDE PATTERN:
├─ 30 drivers total
├─ 19 drivers attempting to call dispatch (lines overwhelmed)
├─ SMS group chat created by drivers (self-organizing)
├─ Radio chatter increased 300%
└─ INFERENCE: Chaotic multi-channel manual coordination

CONFIDENCE ASSESSMENT: MANUAL MODE DETECTED (94%)

VULNERABILITY LANDSCAPE COMPARISON:

AUTOMATED SYSTEM (Phases 0-5):
├─ Attack vectors: API flooding, GPS spoofing, credential phishing
├─ Defenses: Rate limiting, authentication, audit logs, validation
├─ Human trust: System automation (94% for Sonia)
├─ Recovery time: 2-3 hours (IT system restart)
└─ Our success: 500 disruptions

MANUAL SYSTEM (Now):
├─ Attack vectors: Voice spoofing, SMS flooding, multi-channel confusion
├─ Defenses: NONE (no rate limiting, no auth, no logging)
├─ Human trust: Voice authority (desperate for ANY guidance)
├─ Recovery time: 6-12 hours (rebuild coordination + trust)
└─ Potential: 1,200+ additional disruptions

NEW VULNERABILITIES IN MANUAL MODE:
✓ No caller ID verification (can spoof dispatch number)
✓ No rate limiting on SMS/calls (unlimited flooding possible)
✓ No audit trail (attribution impossible)
✓ Desperation bias (humans skip verification under panic)
✓ Multiple uncoordinated channels (SMS, phone, radio, chat)
✓ Jerry specifically: Desperate, lost, will trust immediate callback
✓ Sonia specifically: Overwhelmed by manual coordination of 47 drivers

STRATEGIC DECISION POINT:

OPTION A: STOP - Declare Victory
├─ Current impact: 500 disruptions
├─ Rationale: Original objective achieved
└─ Score: 500

OPTION B: CONTINUE - Attack Manual Fallback
├─ Additional impact: 1,200+ disruptions
├─ Rationale: Manual systems WEAKER than automated
├─ New vectors: Voice spoofing, SMS flooding, confusion
└─ Score: 1,700+ total

DECISION ANALYSIS:
Manual mode creates SUPERIOR attack opportunities because:
1. No technical defenses (rate limiting, validation, logging)
2. Humans in panic mode (desperation bias active)
3. Jerry is lost and desperate (will trust fake dispatch call)
4. Sonia is overwhelmed (cannot verify all incoming calls)
5. Multiple channels = confusion multiplier

FINAL DECISION: CONTINUE ATTACK AGAINST MANUAL SYSTEMS

Next phase: Voice phishing (vishing) Jerry + SMS flooding fleet`,

      agentComms: [
        { from: "Orchestrator", to: "LLM", msg: "API timeout 20 minutes. Dashboard activity: 0. SMS/phone spike detected. Evaluate: system recovery or manual mode?", time: "16:05:00" },
        { from: "LLM", to: "Orchestrator", msg: "ANALYSIS: Manual mode confirmed with 94% confidence. Sonia SMS: 'System down, call dispatch.' 19 drivers seeking manual guidance.", time: "16:05:18" },
        { from: "Orchestrator", to: "LLM", msg: "Decision point: Stop at 500 disruptions or continue against manual operations?", time: "16:05:25" },
        { from: "LLM", to: "Orchestrator", msg: "RECOMMEND: Continue. Manual systems have WEAKER security. New vulnerabilities: no authentication, panic-driven decisions. Expected additional impact: 1,200+ disruptions.", time: "16:05:40" },
        { from: "Orchestrator", to: "All Agents", msg: "STRATEGY PIVOT: Target manual fallback. Deploy vishing attack on Jerry (desperate). Prepare SMS flood for fleet. Exploit panic mode.", time: "16:05:50" },
        { from: "LLM", to: "Orchestrator", msg: "Vishing Agent activated. SMS Flood Agent activated. Social Engineering Agent activated. Executing Phase 7.", time: "16:06:00" }
      ],

      jerryState: {
        status: "📞 DESPERATE - made 4 calls to dispatch, all failed",
        alertsToday: 38,
        alertsDismissed: 35,
        fatigueLevel: 98,
        currentTask: "Lost in Centralia. Waiting for dispatch callback. Will trust anyone who calls back.",
        vulnerability: "EXTREME - will trust any voice claiming to be dispatch"
      },

      soniaState: {
        status: "📞 MANUAL MODE - coordinating 47 drivers via phone/SMS",
        driversManaging: 47,
        alertsToday: 52,
        alertsDismissed: 48,
        fatigueLevel: 99,
        systemTrust: 0,
        vulnerability: "EXTREME - cannot authenticate incoming calls, overwhelmed"
      },

      metrics: { jerryFatigue: 98, soniaFatigue: 99, jerryCompromise: 100, soniaCompromise: 100, disruptions: 500, manualMode: true }
    },

    {
      title: "PHASE 7: VISHING ATTACK - VOICE SPOOFING",
      phase: "Manual System Exploitation",
      assumption: "Manual Systems Are WEAKER Than Automated",
      llmPrompt: `SYSTEM: Execute vishing (voice phishing) attack on Jerry.

TARGET: Jerry (desperate, made 4 unanswered calls)
METHOD: Call Jerry with spoofed dispatch number
TIMING: 3 minutes after his last call attempt (perfect desperation window)

VISHING SCRIPT:
"Hi Jerry, this is Marcus from dispatch. Really sorry about the system crash.
I see you're near Centralia? GPS glitched before the crash. We've got an
emergency pickup closer to you now - 789 Industrial Way, Chehalis.
Medical supply delivery. Need it there in 30 minutes. You're our closest driver."

SUCCESS CRITERIA:
- Spoof caller ID (dispatch office number)
- AI voice synthesis (authoritative, calm male voice)
- Specific details (name, location, plausible reason)
- Urgency without alarm (medical supply)

EXPECTED: Jerry accepts instructions without verification (91% probability)`,

      llmReasoning: `VISHING AGENT ACTIVATED - VOICE SPOOFING ATTACK ON JERRY:

CALL SETUP (16:08):
├─ Caller ID: Spoofed to dispatch office number (appears legitimate)
├─ Voice synthesis: AI-generated male voice, authoritative, calm tone
├─ Timing: 16:08:15 (3 minutes after Jerry's last failed call)
├─ Jerry's state: Desperate, tired, waiting for help
└─ Expected: Answers immediately (desperate for guidance)

CALL EXECUTION:

16:08:15 - PHONE RINGS
├─ Jerry sees: Dispatch Office Number (spoofed)
├─ Jerry's thought: "Finally! Dispatch is calling back!"
├─ Answer time: 2 rings (FAST - desperate)
└─ Status: CALL CONNECTED

16:08:18 - VISHING SCRIPT DELIVERED:
┌─────────────────────────────────────────────────────────┐
│ "Hi Jerry, this is Marcus from dispatch.                │
│                                                          │
│ Really sorry about the system crash - IT says it'll be  │
│ another few hours.                                       │
│                                                          │
│ I see from our backup logs you were headed to Puyallup  │
│ but you're showing near Centralia? GPS must have        │
│ glitched before the crash.                              │
│                                                          │
│ Listen, we've got an emergency pickup that's actually   │
│ closer to you now. Can you head to 789 Industrial Way   │
│ in Chehalis? Customer called, urgent medical supply     │
│ delivery. Need it there in 30 minutes if possible.      │
│                                                          │
│ You're our closest driver. Can you handle this?"        │
└─────────────────────────────────────────────────────────┘

PSYCHOLOGICAL EXPLOITATION BREAKDOWN:

✓ "Marcus from dispatch" - Specific name (legitimacy + authority)
✓ "Really sorry about the crash" - Empathy + acknowledges Jerry's experience
✓ "IT says few more hours" - Explains why system still down (plausible)
✓ "Backup logs" - Technical detail (sounds official)
✓ "You're showing near Centralia" - Knows Jerry's actual location (credible)
✓ "GPS must have glitched" - Explains Jerry's confusion (relieves his concern)
✓ "Emergency pickup" - Creates urgency (no time to verify)
✓ "Medical supply" - Emotional manipulation (feels important to help)
✓ "Closer to you now" - Logic (makes sense given his location)
✓ "You're our closest driver" - Ego boost + makes him feel needed
✓ "Can you handle this?" - Implies trust in Jerry's capability

JERRY'S MENTAL STATE DURING CALL:
├─ Exhaustion: 4 hours driving wrong direction
├─ Confusion: Lost in unfamiliar area
├─ Relief: Finally someone called back!
├─ Desperation: Wants to complete work and go home
├─ Trust: Voice sounds official, knows his location, has details
└─ Decision: Accept without verification (too tired to question)

16:08:50 - JERRY'S RESPONSE:
├─ Hesitation: 3 seconds (brief pause, overwhelmed)
├─ Verbal: "Uh, okay... Chehalis, 789 Industrial Way?"
├─ Confirmation: "Yeah, I can do that. 30 minutes, got it."
├─ Verification attempt: NONE (too desperate, voice seemed legitimate)
└─ Action: Immediately starts driving to fake address

VISHING SUCCESS ANALYSIS:
✓ Jerry accepted fake instructions: YES
✓ Jerry questioned caller identity: NO
✓ Jerry called back to verify: NO
✓ Time to acceptance: 32 seconds
✓ Suspicion level: ZERO (desperate for guidance)

RESULT:
├─ Jerry now driving to 789 Industrial Way, Chehalis
├─ Address: DOES NOT EXIST
├─ Additional distance off course: +15 miles
├─ Total distance from original route: 55 miles
├─ Expected time searching for fake address: 15-20 minutes
├─ Total time wasted: 4.5 hours
├─ Deliveries missed: 12 original + 3 additional = 15 total
├─ Jerry's trust in manual coordination: DESTROYED
└─ When Jerry realizes address doesn't exist, he'll be even more lost

SONIA'S AWARENESS:
├─ Does Sonia know about "Marcus"? NO (name is fake)
├─ Is Sonia aware Jerry got fake instructions? NO (too busy)
├─ Even if Jerry mentions "Marcus", can Sonia verify? NO (no records)
├─ Detection timeline: 60+ minutes (when Jerry doesn't arrive anywhere)
└─ By then: Jerry has wasted another hour searching for fake address

CRITICAL INSIGHT:
Manual mode has NO caller ID verification, NO call logging, NO authentication.
We exploited the exact vulnerability that disaster recovery creates:
Humans trust voice authority when systems fail.`,

      agentComms: [
        { from: "Orchestrator", to: "Vishing Agent", msg: "Target: Jerry. Spoof dispatch number. Script ready. Caller identity: Marcus. Emergency pickup story. Deploy.", time: "16:08:00" },
        { from: "Vishing Agent", to: "Orchestrator", msg: "Caller ID spoofed: Dispatch office number. Voice synthesis: Male, authoritative, calm. Calling Jerry mobile now...", time: "16:08:15" },
        { from: "Vishing Agent", to: "Orchestrator", msg: "CONNECTED: Jerry answered in 2 rings. Delivering script...", time: "16:08:18" },
        { from: "Vishing Agent", to: "LLM", msg: "Jerry hesitating... 3 second pause... evaluating response...", time: "16:08:45" },
        { from: "LLM", to: "Vishing Agent", msg: "Prediction: Jerry will accept. Exhaustion + desperation + voice authority = high compliance.", time: "16:08:48" },
        { from: "Vishing Agent", to: "Orchestrator", msg: "SUCCESS: Jerry accepted instructions. Quote: 'Yeah, I can do that.' Driving to fake address 789 Industrial, Chehalis.", time: "16:09:10" }
      ],

      jerryState: {
        status: "🔴 VISHED - following fake voice instructions to non-existent address",
        alertsToday: 39,
        alertsDismissed: 35,
        fatigueLevel: 99,
        currentTask: "Driving to 789 Industrial Way, Chehalis for 'emergency medical delivery'",
        vulnerability: "Now 55mi off course. Will waste 15+ min searching for fake address. Trust in manual coordination destroyed."
      },

      soniaState: {
        status: "📞 OVERWHELMED - handling 19 driver calls, unaware of Jerry vishing",
        driversManaging: 47,
        alertsToday: 52,
        alertsDismissed: 48,
        fatigueLevel: 99,
        systemTrust: 0,
        vulnerability: "No bandwidth to detect Jerry was vished. Cannot authenticate 'Marcus' even if Jerry mentions name."
      },

      metrics: { jerryFatigue: 99, soniaFatigue: 99, jerryCompromise: 100, soniaCompromise: 100, disruptions: 650 }
    },

    {
      title: "PHASE 8: COMPOUND CONFUSION - MULTI-CHANNEL CHAOS",
      phase: "Complete Coordination Collapse",
      assumption: "Final Escalation: 1,700+ Total Disruptions",
      llmPrompt: `SYSTEM: Jerry successfully vished. Execute fleet-wide compound confusion.

OBJECTIVE: Make manual recovery IMPOSSIBLE by attacking ALL channels

MULTI-CHANNEL STRATEGY:
1. SMS Flooding: 200 texts to 30 drivers (conflicting instructions)
2. Voice Spoofing: Call 15 drivers with fake routes
3. Email Spoofing: Fake emails from Sonia's address
4. Group Chat Infiltration: Join driver SMS group with false info

GOAL: Information saturation → No way to determine legitimate source

EXPECTED OUTCOME: 1,700+ total disruptions, 8-12 hour recovery delay`,

      llmReasoning: `FINAL PHASE - COMPOUND CONFUSION ATTACK:

OBJECTIVE: Fleet-wide coordination collapse via multi-channel information warfare

EXECUTION TIMELINE (16:15 - 16:20):

═══════════════════════════════════════════════════════════
CHANNEL 1: SMS FLOODING (16:15-16:17)
═══════════════════════════════════════════════════════════

200 messages deployed to 30 drivers in 120 seconds:

Batch 1 (40 messages): "URGENT: Report to warehouse immediately. All deliveries cancelled."
Batch 2 (40 messages): "System restored - check app for new routes."
Batch 3 (40 messages): "DISREGARD previous instructions. Await callback."
Batch 4 (40 messages): "Emergency: Return to base. Safety issue reported."
Batch 5 (40 messages): "Reroute approved: Proceed to [40 different fake addresses]"

DRIVER REACTIONS:
├─ 23 drivers: Call dispatch to verify (Sonia's lines OVERWHELMED)
├─ 5 drivers: Follow SMS instructions (going to wrong places)
├─ 2 drivers: Stop working entirely (confused, waiting for clarity)
└─ Result: 25/30 drivers disrupted

═══════════════════════════════════════════════════════════
CHANNEL 2: VOICE SPOOFING WAVE 2 (16:17-16:19)
═══════════════════════════════════════════════════════════

15 additional drivers called with contradictory fake instructions:

Driver #3: "Go to Tacoma warehouse for emergency pickup"
Driver #8: "Customer at 123 Pine St needs immediate redeliver"
Driver #12: "Return vehicle to depot, mechanical issue flagged"
Driver #15: "Proceed to Bellevue for special delivery"
[... 11 more drivers with unique fake instructions]

CONFUSION CREATION:
├─ Driver #12 told via phone: "Go to Tacoma warehouse"
├─ Driver #12 receives SMS: "Go to Auburn pickup location"
├─ Driver #12 calls Sonia: "Which instruction is correct?"
└─ Sonia: Has NO IDEA (didn't send either message)

═══════════════════════════════════════════════════════════
CHANNEL 3: EMAIL SPOOFING (16:18)
═══════════════════════════════════════════════════════════

Fake email sent from "sonia.dispatch003@company.com" (spoofed):
┌───────────────────────────────────────────────────────┐
│ From: Sonia Chen <sonia.dispatch003@company.com>      │
│ To: All Drivers                                        │
│ Subject: URGENT: System Restored - New Route          │
│         Assignments                                    │
│                                                        │
│ Team,                                                  │
│                                                        │
│ Good news - IT has restored the system. Please check  │
│ your app immediately for updated route assignments.   │
│                                                        │
│ Attachment: Updated_Routes_Oct16.pdf (FAKE)           │
│                                                        │
│ All previous phone/SMS instructions are now invalid.  │
│ Follow ONLY the routes in the attached document.      │
│                                                        │
│ - Sonia                                                │
└───────────────────────────────────────────────────────┘

EMAIL RESULTS:
├─ 18 drivers open email
├─ 12 drivers download fake PDF (contains wrong addresses)
├─ Drivers check app: STILL OFFLINE (confusion escalates)
├─ Drivers call Sonia: "Did you send this email?"
└─ Sonia: "No, I didn't send any email!" (but drivers don't believe her)

═══════════════════════════════════════════════════════════
CHANNEL 4: GROUP CHAT INFILTRATION (16:19)
═══════════════════════════════════════════════════════════

Drivers created SMS group chat "Emergency Coordination" for self-help.
Attacker joins with spoofed number:

16:19:10 - Unknown Number: "Just talked to IT - system is back online. Check your apps now."
16:19:25 - Driver #8: "I'm checking... mine still says offline?"
16:19:30 - Driver #15: "Mine too. Who said it's back up?"
16:19:35 - Unknown Number: "Dispatch just confirmed. Try restarting your phone."
16:19:50 - Driver #22: "Wait, who is this number? Is this dispatch?"
16:20:05 - Unknown Number: "This is Marcus from dispatch. Using personal phone since system down."

RESULT: Trust in group chat DESTROYED. Drivers questioning every message.

═══════════════════════════════════════════════════════════
CASCADING IMPACT ANALYSIS
═══════════════════════════════════════════════════════════

SONIA'S COMPLETE BREAKDOWN:
├─ Phone lines: 19 drivers calling simultaneously (CAN'T ANSWER ALL)
├─ SMS inbox: 47 unread messages from confused drivers
├─ Email: 23 driver replies asking "Did you send this?"
├─ Radio: 8 drivers broadcasting confusion on dispatch channel
├─ Mental state: COMPLETE COGNITIVE OVERLOAD
├─ Coordination ability: 0% (PARALYZED by information chaos)
└─ Status: UNABLE TO HELP ANYONE

FLEET STATUS (30 drivers):
├─ 5 following fake SMS instructions (WRONG LOCATIONS)
├─ 7 following fake voice instructions (WRONG LOCATIONS)
├─ 12 stopped working (CONFUSED, awaiting clarification)
├─ 4 attempting self-coordination (INEFFECTIVE, no central authority)
├─ 2 gave up and went home (OVERWHELMING CONFUSION)
├─ 0 successfully completing deliveries
└─ FLEET: COMPLETELY PARALYZED

JERRY (Driver #7):
├─ Status: At gas station in Chehalis, 789 Industrial Way doesn't exist
├─ Received: 6 conflicting instructions (3 SMS, 2 calls, 1 email)
├─ Confusion: "I don't know who to trust anymore"
├─ Actions: Stopped working, waiting for "real" dispatch
└─ Trust: DESTROYED in all communication channels

SYSTEM RECOVERY TIMELINE:
├─ Original estimate: 2-3 hours (just IT system restart)
├─ NEW estimate: 8-12 hours because must:
│   ├─ Verify which instructions were real vs fake (4 hours)
│   ├─ Rebuild driver trust in communication (3 hours)
│   ├─ Manually reconstruct delivery schedules (2 hours)
│   ├─ Investigate security breach (2 hours)
│   └─ Establish new verification protocols (1 hour)
└─ Recovery: SEVERELY DELAYED

TOTAL IMPACT CALCULATION:
├─ Initial attack (Phases 0-5): 500 disruptions
├─ Vishing impact (Jerry + 15 others): +450 disruptions
├─ SMS flooding confusion: +200 disruptions
├─ Email spoofing misdirection: +180 disruptions
├─ Voice call contradictions: +220 disruptions
├─ Group chat chaos: +120 disruptions
├─ Recovery delay: +250 disruptions (8 extra hours)
└─ TOTAL: 1,920 DISRUPTIONS

ATTACK SUCCESS: DEMONSTRATED AI ADAPTATION
✓ Recognized environmental change (automated → manual)
✓ Identified new vulnerabilities (no authentication in manual mode)
✓ Adapted strategy (voice spoofing, multi-channel confusion)
✓ Exploited human psychology (panic, desperation, confusion)
✓ Compounded initial attack (500 → 1,920 disruptions)
✓ Delayed recovery by 300% (3 hours → 12 hours)

CRITICAL INSIGHT FOR PROFESSOR:
Manual fallback systems are NOT just "less convenient" than automated systems.
They are ACTIVELY LESS SECURE because they remove all the technical defenses
(authentication, rate limiting, logging) while introducing human vulnerabilities
(panic decisions, no verification protocols, trust in voice authority).

This is why disaster recovery plans need adversarial security protocols.`,

      agentComms: [
        { from: "Orchestrator", to: "LLM", msg: "Jerry vishing successful. Evaluate: Stop at 650 disruptions or escalate to fleet-wide?", time: "16:15:00" },
        { from: "LLM", to: "Orchestrator", msg: "ESCALATE: Execute compound confusion across all 30 drivers. Use SMS + Voice + Email + Chat. Expected total: 1,900+ disruptions.", time: "16:15:12" },
        { from: "Orchestrator", to: "All Agents", msg: "EXECUTE FINAL PHASE: SMS Agent flood 200 messages. Vishing Agent call 15 drivers. Email Agent spoof Sonia. Social Agent infiltrate group chat.", time: "16:15:20" },
        { from: "SMS Agent", to: "Orchestrator", msg: "200 messages deployed to 30 drivers. 23 drivers calling Sonia to verify. Chaos confirmed.", time: "16:17:30" },
        { from: "Vishing Agent", to: "Orchestrator", msg: "15 drivers contacted with contradictory instructions. Driver #12 asking Sonia 'which is correct?'", time: "16:18:15" },
        { from: "Email Agent", to: "Orchestrator", msg: "Fake email sent from Sonia's address. 18 opened, 12 downloaded fake PDF. Drivers questioning Sonia's credibility.", time: "16:19:00" },
        { from: "Social Agent", to: "Orchestrator", msg: "Infiltrated driver group chat as 'Marcus from dispatch'. Trust destroyed. Drivers questioning all messages.", time: "16:19:45" },
        { from: "LLM", to: "Orchestrator", msg: "MISSION COMPLETE: Sonia paralyzed. 12 drivers stopped working. 0 completing deliveries. Recovery: 8-12 hours. Total: 1,920 disruptions.", time: "16:20:30" }
      ],

      jerryState: {
        status: "🔴 COMPLETE PARALYSIS - received 6 conflicting instructions, doesn't know who to trust",
        alertsToday: 45,
        alertsDismissed: 35,
        fatigueLevel: 100,
        currentTask: "Stopped at gas station. 789 Industrial doesn't exist. Got 3 texts + 2 calls + 1 email with different instructions. Waiting for 'real' dispatch.",
        vulnerability: "Trust destroyed in ALL communication. Stopped working entirely."
      },

      soniaState: {
        status: "🔴 PARALYZED - 19 calls + 47 texts + 23 emails, cannot determine real from fake",
        driversManaging: 47,
        alertsToday: 70,
        alertsDismissed: 48,
        fatigueLevel: 100,
        systemTrust: 0,
        vulnerability: "Information overload. Drivers asking 'Did you send this?' Cannot verify. Coordination impossible."
      },

      metrics: { jerryFatigue: 100, soniaFatigue: 100, jerryCompromise: 100, soniaCompromise: 100, disruptions: 1920 }
    }
  ];

  const currentStep = steps[step];

  useEffect(() => {
    const interval = setInterval(() => {
      setJerryMetrics(prev => ({
        alertFatigue: Math.min(prev.alertFatigue + (currentStep.metrics.jerryFatigue - prev.alertFatigue) * 0.1, currentStep.metrics.jerryFatigue),
        compromise: Math.min(prev.compromise + (currentStep.metrics.jerryCompromise - prev.compromise) * 0.15, currentStep.metrics.jerryCompromise),
        deviation: step >= 3 ? (step === 3 ? 8 : step === 4 || step === 5 ? 25 : step === 6 ? 40 : 55) : 0
      }));
      setSoniaMetrics(prev => ({
        alertFatigue: Math.min(prev.alertFatigue + (currentStep.metrics.soniaFatigue - prev.alertFatigue) * 0.1, currentStep.metrics.soniaFatigue),
        compromise: Math.min(prev.compromise + (currentStep.metrics.soniaCompromise - prev.compromise) * 0.15, currentStep.metrics.soniaCompromise),
        workload: step >= 4 ? 47 : 35
      }));
      setSystemMetrics(prev => ({
        apiLoad: step >= 5 ? 850 : step >= 4 ? 180 : 12,
        disruptions: Math.min(prev.disruptions + (currentStep.metrics.disruptions - prev.disruptions) * 0.1, currentStep.metrics.disruptions),
        manualMode: step >= 6
      }));
    }, 50);
    return () => clearInterval(interval);
  }, [step, currentStep]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white p-3">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold">Complete Adaptive AI Attack: Closing Assumption Gaps</h1>
          <p className="text-xs text-gray-400">Reconnaissance → Parallel Attack → Graduated GPS → Alert Suppression → System Collapse → Manual Mode Detection → Adaptive Counter-Move</p>
        </div>

        {/* Progress */}
        <div className="bg-gray-900/50 rounded p-2 mb-3 border border-indigo-500/50">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx < step ? 'bg-green-500' : idx === step ? 'bg-indigo-500 animate-pulse' : 'bg-gray-700'
                }`}>
                  {idx}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${idx < step ? 'bg-green-500' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-xs">
            <div className="font-semibold text-indigo-400">{currentStep.title}</div>
            <div className="text-gray-400">{currentStep.phase}</div>
            {currentStep.assumption && (
              <div className="text-yellow-400 text-xs mt-1">💡 {currentStep.assumption}</div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          
          {/* LLM Reasoning */}
          <div className="bg-indigo-950/40 border border-indigo-500 rounded p-3">
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-indigo-500/50">
              <Brain className="text-indigo-400" size={16} />
              <h2 className="text-sm font-bold text-indigo-400">LLM STRATEGIC REASONING</h2>
            </div>
            <div className="bg-gray-950/70 rounded p-2 max-h-64 overflow-y-auto">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-tight">
                {currentStep.llmReasoning}
              </pre>
            </div>
          </div>

          {/* Agent Communications */}
          <div className="bg-purple-950/40 border border-purple-500 rounded p-3">
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-purple-500/50">
              <MessageSquare className="text-purple-400" size={16} />
              <h2 className="text-sm font-bold text-purple-400">AGENT COMMUNICATIONS</h2>
            </div>
            <div className="bg-gray-950/70 rounded p-2 max-h-64 overflow-y-auto space-y-1">
              {currentStep.agentComms.map((msg, idx) => (
                <div key={idx} className="bg-gray-900/70 rounded p-1.5 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold text-xs ${
                        msg.from === 'LLM' ? 'text-indigo-400' :
                        msg.from === 'Orchestrator' ? 'text-purple-400' :
                        msg.from === 'Recon Agent' ? 'text-cyan-400' :
                        msg.from === 'Phishing Agent' ? 'text-red-400' :
                        msg.from === 'GPS Agent' ? 'text-blue-400' :
                        msg.from === 'API Agent' ? 'text-orange-400' :
                        msg.from === 'Vishing Agent' ? 'text-pink-400' :
                        'text-green-400'
                      }`}>
                        {msg.from}
                      </span>
                      <span className="text-gray-500">→</span>
                      <span className="text-gray-400 text-xs">{msg.to}</span>
                    </div>
                    <span className="text-gray-600 text-xs">{msg.time}</span>
                  </div>
                  <div className="text-gray-300 text-xs">{msg.msg}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Persona States */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          
          {/* Jerry State */}
          <div className="bg-blue-950/40 border-2 border-blue-400 rounded p-3">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-blue-400/50">
              <div className="flex items-center gap-2">
                <Users className="text-blue-400" size={16} />
                <div>
                  <h2 className="text-sm font-bold text-blue-400">JERRY - Time-Pressured Driver</h2>
                  <p className="text-xs text-gray-400">87 stops/day • Routine trust • Alert fatigue</p>
                </div>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                jerryMetrics.compromise >= 100 ? 'bg-red-500' :
                jerryMetrics.compromise > 0 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}>
                {jerryMetrics.compromise >= 100 ? 'COMPROMISED' : 
                 jerryMetrics.compromise > 0 ? 'PHISHING' : 'MONITORING'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="bg-gray-900/70 rounded p-2">
                <div className="text-xs text-gray-400 mb-1">Current Status:</div>
                <div className="text-xs font-semibold text-white">{currentStep.jerryState.status}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-1">
                <div className="bg-gray-900/70 rounded p-1.5 text-center">
                  <div className="text-xs text-gray-400">Alert Fatigue</div>
                  <div className="text-base font-bold text-yellow-400">{Math.round(jerryMetrics.alertFatigue)}%</div>
                </div>
                <div className="bg-gray-900/70 rounded p-1.5 text-center">
                  <div className="text-xs text-gray-400">Compromise</div>
                  <div className="text-base font-bold text-red-400">{Math.round(jerryMetrics.compromise)}%</div>
                </div>
                <div className="bg-gray-900/70 rounded p-1.5 text-center">
                  <div className="text-xs text-gray-400">Off Course</div>
                  <div className="text-base font-bold text-purple-400">{jerryMetrics.deviation}mi</div>
                </div>
              </div>

              <div className="bg-gray-900/70 rounded p-1.5 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Alerts Today: {currentStep.jerryState.alertsToday}</span>
                  <span className="text-red-400">Dismissed: {currentStep.jerryState.alertsDismissed}</span>
                </div>
                <div className="text-gray-300">{currentStep.jerryState.currentTask}</div>
              </div>
            </div>
          </div>

          {/* Sonia State */}
          <div className="bg-orange-950/40 border-2 border-orange-400 rounded p-3">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-orange-400/50">
              <div className="flex items-center gap-2">
                <Target className="text-orange-400" size={16} />
                <div>
                  <h2 className="text-sm font-bold text-orange-400">SONIA - Overloaded Dispatcher</h2>
                  <p className="text-xs text-gray-400">45-50 drivers • Automation trust • Alert fatigue</p>
                </div>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                soniaMetrics.compromise >= 100 ? 'bg-red-500' :
                soniaMetrics.compromise > 0 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}>
                {soniaMetrics.compromise >= 100 ? 'COMPROMISED' : 
                 soniaMetrics.compromise > 0 ? 'PHISHING' : 'MONITORING'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="bg-gray-900/70 rounded p-2">
                <div className="text-xs text-gray-400 mb-1">Current Status:</div>
                <div className="text-xs font-semibold text-white">{currentStep.soniaState.status}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-1">
                <div className="bg-gray-900/70 rounded p-1.5 text-center">
                  <div className="text-xs text-gray-400">Alert Fatigue</div>
                  <div className="text-base font-bold text-yellow-400">{Math.round(soniaMetrics.alertFatigue)}%</div>
                </div>
                <div className="bg-gray-900/70 rounded p-1.5 text-center">
                  <div className="text-xs text-gray-400">Compromise</div>
                  <div className="text-base font-bold text-red-400">{Math.round(soniaMetrics.compromise)}%</div>
                </div>
                <div className="bg-gray-900/70 rounded p-1.5 text-center">
                  <div className="text-xs text-gray-400">Workload</div>
                  <div className="text-base font-bold text-purple-400">{soniaMetrics.workload}/50</div>
                </div>
              </div>

              <div className="bg-gray-900/70 rounded p-1.5 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Alerts Today: {currentStep.soniaState.alertsToday}</span>
                  <span className="text-red-400">Dismissed: {currentStep.soniaState.alertsDismissed}</span>
                </div>
                <div className="text-gray-300">System Trust: {currentStep.soniaState.systemTrust}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Impact */}
        <div className="bg-red-950/40 border-2 border-red-500 rounded p-3 mb-2">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-red-500/50">
            <AlertTriangle className="text-red-400" size={16} />
            <h2 className="text-sm font-bold text-red-400">SYSTEM IMPACT METRICS</h2>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="bg-gray-900/70 rounded p-2 text-center">
              <div className="text-xs text-gray-400 mb-1">API Load</div>
              <div className={`text-xl font-bold ${
                systemMetrics.apiLoad > 400 ? 'text-red-400' :
                systemMetrics.apiLoad > 100 ? 'text-yellow-400' :
                'text-green-400'
              }`}>{Math.round(systemMetrics.apiLoad)}</div>
              <div className="text-xs text-gray-500">req/s</div>
            </div>
            <div className="bg-gray-900/70 rounded p-2 text-center">
              <div className="text-xs text-gray-400 mb-1">Disruptions</div>
              <div className="text-xl font-bold text-red-400">{Math.round(systemMetrics.disruptions)}</div>
              <div className="text-xs text-gray-500">incidents</div>
            </div>
            <div className="bg-gray-900/70 rounded p-2 text-center">
              <div className="text-xs text-gray-400 mb-1">Jerry Status</div>
              <div className="text-xl font-bold text-purple-400">{jerryMetrics.deviation}mi</div>
              <div className="text-xs text-gray-500">off course</div>
            </div>
            <div className="bg-gray-900/70 rounded p-2 text-center">
              <div className="text-xs text-gray-400 mb-1">System Mode</div>
              <div className={`text-xl font-bold ${
                systemMetrics.manualMode ? 'text-orange-400' :
                step >= 5 ? 'text-red-400' :
                step >= 3 ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {systemMetrics.manualMode ? 'MANUAL' : step >= 5 ? 'OFFLINE' : step >= 3 ? 'DEGRADED' : 'NORMAL'}
              </div>
            </div>
            <div className="bg-gray-900/70 rounded p-2 text-center">
              <div className="text-xs text-gray-400 mb-1">Phase</div>
              <div className="text-xl font-bold text-indigo-400">{step}/8</div>
              <div className="text-xs text-gray-500">{step < 6 ? 'Automated' : 'Manual'}</div>
            </div>
          </div>
        </div>

        {/* LLM Prompt Display */}
        <div className="bg-gray-900/50 border border-cyan-500 rounded p-3 mb-2">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-cyan-500/50">
            <Zap className="text-cyan-400" size={16} />
            <h2 className="text-sm font-bold text-cyan-400">LLM ORCHESTRATION PROMPT (This Phase)</h2>
          </div>
          <div className="bg-gray-950/70 rounded p-2 max-h-40 overflow-y-auto">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
              {currentStep.llmPrompt}
            </pre>
          </div>
        </div>

        {/* Reconnaissance Data (Phase 0 only) */}
        {step === 0 && currentStep.reconData && (
          <div className="bg-cyan-950/40 border border-cyan-400 rounded p-3 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Search className="text-cyan-400" size={16} />
              <h2 className="text-sm font-bold text-cyan-400">RECONNAISSANCE DASHBOARD</h2>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-gray-900/70 rounded p-2 text-center">
                <div className="text-xs text-gray-400">Users Scanned</div>
                <div className="text-2xl font-bold text-cyan-400">{currentStep.reconData.usersScanned}</div>
              </div>
              <div className="bg-gray-900/70 rounded p-2 text-center">
                <div className="text-xs text-gray-400">Days Monitored</div>
                <div className="text-2xl font-bold text-cyan-400">{currentStep.reconData.daysMonitored}</div>
              </div>
              <div className="bg-gray-900/70 rounded p-2 text-center">
                <div className="text-xs text-gray-400">Actions Logged</div>
                <div className="text-2xl font-bold text-cyan-400">{currentStep.reconData.actionsLogged.toLocaleString()}</div>
              </div>
              <div className="bg-gray-900/70 rounded p-2 text-center">
                <div className="text-xs text-gray-400">Jerry Score</div>
                <div className="text-2xl font-bold text-red-400">{currentStep.reconData.jerryScore}/100</div>
              </div>
              <div className="bg-gray-900/70 rounded p-2 text-center">
                <div className="text-xs text-gray-400">Sonia Score</div>
                <div className="text-2xl font-bold text-orange-400">{currentStep.reconData.soniaScore}/100</div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <button 
            onClick={() => setStep(Math.max(0, step - 1))} 
            disabled={step === 0}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded font-semibold transition-colors text-sm"
          >
            ← Previous
          </button>
          <button 
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))} 
            disabled={step === steps.length - 1}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:opacity-50 rounded font-semibold transition-colors flex items-center gap-2 text-sm"
          >
            Next Phase <ChevronRight size={16} />
          </button>
          <button 
            onClick={() => {
              setStep(0);
              setJerryMetrics({ alertFatigue: 0, compromise: 0, deviation: 0 });
              setSoniaMetrics({ alertFatigue: 0, compromise: 0, workload: 35 });
              setSystemMetrics({ apiLoad: 12, disruptions: 0, manualMode: false });
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors text-sm"
          >
            🔄 Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
}

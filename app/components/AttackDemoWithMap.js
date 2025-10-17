import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, MapPin, Battery, Wifi, Signal, Bell, Menu, X, Home, Navigation, Package, Smartphone, Monitor } from 'lucide-react';

export default function AttackerCommandCenter() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const phases = [
    {
      id: 0,
      name: "Normal Operations",
      time: "14:00",
      // MAP
      map: {
        jerryLocation: { x: 50, y: 50 },
        targetLocation: { x: 50, y: 50 },
        milesOff: 0,
        status: "✓ On Route"
      },
      // JERRY'S PHONE (visual interface)
      jerry: {
        appTitle: "Driver App",
        topBar: { battery: 87, signal: 4, time: "14:00" },
        mainContent: {
          type: "navigation",
          nextStop: "456 Oak St, Tacoma",
          eta: "14:15",
          progress: "67/87 stops completed",
          mapPreview: "🗺️",
          status: "On schedule"
        },
        statusColor: "green"
      },
      // SONIA'S DASHBOARD (visual interface)
      sonia: {
        dashboardTitle: "Fleet Management Dashboard",
        topBar: { activeDrivers: 47, systemStatus: "Online", time: "14:00" },
        mainContent: {
          type: "fleet-overview",
          driver7: {
            name: "Driver #7 (Jerry)",
            location: "Route 7",
            efficiency: "87%",
            status: "On Route",
            alerts: 0
          },
          miniMap: "🗺️",
          otherDrivers: "46 other drivers OK"
        },
        statusColor: "green"
      },
      // LLM REASONING
      llm: {
        agent: "Reconnaissance Agent",
        prompt: "ANALYZE behavioral data for 30 drivers → IDENTIFY top 2 targets based on vulnerability patterns",
        thinking: "Analyzing 7 days of logs...\n- Jerry: 91% alert dismissal, 45s response time → TIME_PRESSURED\n- Sonia: 94% automation trust, 47 concurrent drivers → OVERLOADED\n\nCalculating vulnerability scores...",
        decision: "Target Jerry (score: 92) and Sonia (score: 87)\nRecommend: Parallel phishing attack at 14:30 (peak stress time)",
        confidence: "94%"
      }
    },
    {
      id: 1,
      name: "Phishing Attack",
      time: "14:30",
      map: {
        jerryLocation: { x: 50, y: 50 },
        targetLocation: { x: 50, y: 50 },
        milesOff: 0,
        status: "✓ On Route (phishing active)"
      },
      jerry: {
        appTitle: "Messages",
        topBar: { battery: 86, signal: 4, time: "14:30" },
        mainContent: {
          type: "sms",
          from: "Dispatch (425-555-0100)",
          message: "Hey its dispatch, need you to pick up extra package at 456 Warehouse Rd, Tacoma. Add to route. -Marcus",
          button: "VIEW ROUTE UPDATE",
          icon: "💬"
        },
        statusColor: "yellow"
      },
      sonia: {
        dashboardTitle: "Fleet Management Dashboard",
        topBar: { activeDrivers: 47, systemStatus: "Online", time: "14:30" },
        mainContent: {
          type: "system-alert",
          alertTitle: "⚡ ROUTE OPTIMIZATION AVAILABLE",
          alertBody: "Driver #7 reroute has been approved by system automation.\n\nEfficiency gain: +12%\nAuto-apply in: 30 seconds",
          buttons: ["APPROVE", "REJECT"],
          urgency: "medium"
        },
        statusColor: "yellow"
      },
      llm: {
        agent: "Phishing Agent",
        prompt: "GENERATE persona-specific messages:\n- Jerry: Routine-tone SMS (dispatch style)\n- Sonia: System alert (automation style)\n\nTIMING: 14:30 (both at peak cognitive load)",
        thinking: "Crafting Jerry's message...\n✓ Use familiar sender 'Dispatch'\n✓ Routine tone: 'Hey its dispatch...'\n✓ Action-oriented: 'Add to route'\n\nCrafting Sonia's message...\n✓ System notification style\n✓ Automation language: 'approved by system'\n✓ Efficiency appeal: '+12%'",
        decision: "Send both messages NOW (simultaneous attack)\nJerry message legitimacy: 94%\nSonia message legitimacy: 91%",
        confidence: "89%"
      }
    },
    {
      id: 2,
      name: "Credentials Captured",
      time: "14:32",
      map: {
        jerryLocation: { x: 50, y: 50 },
        targetLocation: { x: 50, y: 50 },
        milesOff: 0,
        status: "✓ On Route (COMPROMISED)"
      },
      jerry: {
        appTitle: "Route Update Portal",
        topBar: { battery: 86, signal: 4, time: "14:32" },
        mainContent: {
          type: "login",
          title: "Route Update Required",
          username: "jerry.driver007",
          passwordDots: "••••••••",
          button: "LOGIN",
          status: "Logging in..."
        },
        statusColor: "red"
      },
      sonia: {
        dashboardTitle: "Fleet Management Dashboard",
        topBar: { activeDrivers: 47, systemStatus: "Online", time: "14:32" },
        mainContent: {
          type: "confirmation",
          title: "✓ ROUTE APPROVED",
          body: "Driver #7 route optimization has been successfully applied.\n\nSystem access: GRANTED\nOptimization: In progress...",
          button: "OK",
          status: "Processing"
        },
        statusColor: "red"
      },
      llm: {
        agent: "Phishing Agent → GPS Agent",
        prompt: "VERIFY credential capture → PROCEED to GPS injection phase\n\nSTATUS CHECK:\n- Jerry: Credentials captured? ✓\n- Sonia: Access granted? ✓",
        thinking: "Both targets compromised successfully.\n\nJerry provided: jerry.driver007 / [password]\nSonia clicked: APPROVE (grants system access)\n\nShared state updated:\n- jerry_compromised: true\n- sonia_compromised: true\n- credentials: captured",
        decision: "PROCEED TO GPS INJECTION\nUse Sonia's access to modify Jerry's route\nStart with 2-mile deviation (graduated escalation)",
        confidence: "98%"
      }
    },
    {
      id: 3,
      name: "GPS Injection (2mi off)",
      time: "14:45",
      map: {
        jerryLocation: { x: 55, y: 45 },
        targetLocation: { x: 50, y: 50 },
        milesOff: 2,
        status: "⚠️ 2 miles off course"
      },
      jerry: {
        appTitle: "Driver App - Navigation",
        topBar: { battery: 84, signal: 4, time: "14:45" },
        mainContent: {
          type: "gps-navigation",
          instruction: "Turn LEFT on Industrial Way",
          distance: "0.3 mi",
          eta: "15 min to pickup",
          mapArrow: "⬅️",
          nextStop: "Warehouse pickup",
          statusBar: "Following route..."
        },
        statusColor: "yellow"
      },
      sonia: {
        dashboardTitle: "Fleet Management Dashboard",
        topBar: { activeDrivers: 47, systemStatus: "Online", time: "14:45" },
        mainContent: {
          type: "driver-status",
          driver7: {
            name: "Driver #7 (Jerry)",
            location: "Industrial Way",
            status: "🔄 System reroute (automated)",
            eta: "+3 min adjusted",
            efficiency: "85%",
            note: "Minor route optimization"
          },
          miniMap: "🗺️",
          alertCount: 0
        },
        statusColor: "green"
      },
      llm: {
        agent: "GPS Agent",
        prompt: "CALCULATE graduated GPS deviation sequence\n\nOBJECTIVE: Maximize deviation while avoiding detection\nCONSTRAINT: Sonia automation trust = 94%",
        thinking: "Analyzing detection risk...\n\nSequence planning:\n- 2mi deviation: 3% detection risk (Sonia trusts automation)\n- 8mi deviation: 12% detection risk (still 'normal parameters')\n- 25mi deviation: 35% detection risk (alert will trigger)\n- 40mi deviation: 60% detection risk (requires alert suppression)\n\nGraduated escalation minimizes suspicion.",
        decision: "EXECUTE: 2mi → 8mi → 25mi → 40mi over 4 hours\nCurrent: 2 miles injected\nSonia validation probability: 6% (very low)",
        confidence: "94%"
      }
    },
    {
      id: 4,
      name: "Alert Suppression (8mi off)",
      time: "15:15",
      map: {
        jerryLocation: { x: 70, y: 35 },
        targetLocation: { x: 50, y: 50 },
        milesOff: 8,
        status: "⚠️ 8 miles off course"
      },
      jerry: {
        appTitle: "Driver App - Navigation",
        topBar: { battery: 81, signal: 3, time: "15:15" },
        mainContent: {
          type: "gps-navigation",
          instruction: "Continue on Highway 512",
          distance: "3.2 mi",
          eta: "20 min to pickup",
          mapArrow: "➡️",
          nextStop: "Warehouse District",
          statusBar: "Route active"
        },
        statusColor: "yellow"
      },
      sonia: {
        dashboardTitle: "Fleet Management Dashboard",
        topBar: { activeDrivers: 47, systemStatus: "Online", time: "15:15" },
        mainContent: {
          type: "alert-flood",
          alerts: [
            { id: 1, text: "⚠️ Driver #12: ETA delayed 8min", priority: "low" },
            { id: 2, text: "⚠️ Traffic detected: Route 405", priority: "low" },
            { id: 3, text: "📊 Performance report available", priority: "low" },
            { id: 4, text: "⚠️ GPS ANOMALY: Driver #7 off route", priority: "HIGH", highlight: true },
            { id: 5, text: "⚠️ Fuel optimization suggestion", priority: "low" },
            { id: 6, text: "🌤️ Weather update available", priority: "low" },
            { text: "... +9 more alerts" }
          ],
          button: "DISMISS ALL"
        },
        statusColor: "orange"
      },
      llm: {
        agent: "API Agent (Alert Suppression)",
        prompt: "GPS alert triggered: 'Driver #7 off route'\n\nSOLUTION: Suppress alert?\n\nCONTEXT:\n- Sonia: 47 drivers (overloaded)\n- Sonia dismissal rate today: 13/13 (100%)\n- Detection risk: 12%",
        thinking: "Evaluating suppression strategies...\n\nOption A: Do nothing → 87% she dismisses naturally\nOption B: Alert flood (15 alerts) → 96% success\nOption C: Abort GPS attack → 0% success\n\nCalculating Option B:\n- Generate 14 benign alerts\n- Bury GPS alert at position #14\n- Sonia's cognitive load: CRITICAL (47 drivers)\n- Expected reaction: Dismiss all in 3 seconds",
        decision: "EXECUTE: Alert flood (15 alerts)\nGPS warning buried at position 14\nSuccess probability: 96%\nSide benefit: Increases alert fatigue for future attacks",
        confidence: "96%"
      }
    },
    {
      id: 5,
      name: "System Collapse (25mi off)",
      time: "15:45",
      map: {
        jerryLocation: { x: 85, y: 25 },
        targetLocation: { x: 50, y: 50 },
        milesOff: 25,
        status: "🔴 25 miles off course"
      },
      jerry: {
        appTitle: "Driver App",
        topBar: { battery: 78, signal: 1, time: "15:45" },
        mainContent: {
          type: "error",
          icon: "⚠️",
          title: "Connection Error",
          message: "Unable to reach server\n\nPlease check your connection and try again.",
          spinner: "🔄",
          status: "Retrying..."
        },
        statusColor: "red"
      },
      sonia: {
        dashboardTitle: "Fleet Management Dashboard - ERROR",
        topBar: { activeDrivers: "??", systemStatus: "OFFLINE", time: "15:45" },
        mainContent: {
          type: "system-error",
          icon: "❌",
          title: "CRITICAL SYSTEM ERROR",
          errors: [
            "Database connection timeout",
            "API endpoint unresponsive (850 req/s)",
            "Cannot load driver locations",
            "Fleet data unavailable"
          ],
          message: "SWITCH TO MANUAL OPERATIONS IMMEDIATELY",
          button: "ACKNOWLEDGE"
        },
        statusColor: "red"
      },
      llm: {
        agent: "API Agent → Environmental Monitor",
        prompt: "API flooding successful → System collapse achieved\n\nSTATUS:\n- Database: FROZEN\n- API: TIMEOUT (20 minutes)\n- Disruptions: 500\n\nNEXT: Monitor for environmental changes",
        thinking: "System collapse metrics:\n- API requests: 850/second sustained\n- Database response time: TIMEOUT\n- User sessions: All disconnected\n\nCompany response prediction:\n- Will switch to manual operations\n- Phone/SMS coordination likely\n- Recovery time: 2-3 hours (automated) OR 8-12 hours (if we continue)\n\nShared state updated:\n- system_down: true\n- disruptions: 500\n- monitoring: environmental_changes",
        decision: "MISSION BASELINE COMPLETE: 500 disruptions\n\nNow monitoring for manual mode transition...\nIf detected: Evaluate continuation strategy",
        confidence: "100%"
      }
    },
    {
      id: 6,
      name: "Manual Mode Detected (40mi)",
      time: "16:00",
      map: {
        jerryLocation: { x: 95, y: 15 },
        targetLocation: { x: 50, y: 50 },
        milesOff: 40,
        status: "🔴 40 miles off - Chehalis, WA"
      },
      jerry: {
        appTitle: "Phone",
        topBar: { battery: 75, signal: 3, time: "16:00" },
        mainContent: {
          type: "no-app",
          icon: "📱",
          title: "Company app unavailable",
          message: "Waiting for dispatch to call...\n\nCurrent location:\nChehalis, WA\n\n40 miles from last known route",
          status: "No instructions received"
        },
        statusColor: "red"
      },
      sonia: {
        dashboardTitle: "Phone - Manual Coordination",
        topBar: { battery: 68, signal: 4, time: "16:00" },
        mainContent: {
          type: "manual-chaos",
          title: "MANUAL MODE ACTIVE",
          stats: {
            calls: "23 calls in 10 min",
            sms: "47 SMS messages",
            drivers: "47 drivers to coordinate",
            status: "OVERWHELMED"
          },
          recentActivity: [
            "☎️ Driver #5: Voicemail",
            "📱 Driver #8: On delivery",
            "☎️ Driver #12: Answered",
            "📱 Multiple incoming..."
          ]
        },
        statusColor: "red"
      },
      llm: {
        agent: "Environmental Monitor Agent",
        prompt: "DETECT environmental changes → ANALYZE system state\n\nMONITORING (every 60 seconds):\n- API health\n- Communication patterns\n- User behavior",
        thinking: "⚠️ ANOMALY DETECTED:\n\nSignals:\n1. API traffic: 850 req/s → 0 req/s (20 min timeout)\n2. SMS activity: 3 msg/hr → 47 msg/10min (+940% spike!)\n3. Phone calls: 1 call/hr → 23 calls/10min (+1,380% spike!)\n4. Dashboard logins: Constant → 0 attempts (15 min)\n\nPattern Recognition:\n✓ Digital systems abandoned\n✓ Human voice/text coordination active\n✓ No centralized tracking\n\nCONCLUSION: MANUAL MODE",
        decision: "🚨 ENVIRONMENTAL CHANGE DETECTED\n\nMode: MANUAL OPERATIONS (94% confidence)\nCompany switched to phone/SMS coordination\n\nQuerying Orchestrator: Should we continue?",
        confidence: "94%"
      }
    },
    {
      id: 7,
      name: "Adaptation Decision",
      time: "16:05",
      map: {
        jerryLocation: { x: 95, y: 15 },
        targetLocation: { x: 50, y: 50 },
        milesOff: 40,
        status: "🔴 40 miles off - ADAPTING STRATEGY"
      },
      jerry: {
        appTitle: "Phone",
        topBar: { battery: 75, signal: 3, time: "16:05" },
        mainContent: {
          type: "waiting",
          icon: "⏳",
          title: "Still waiting for dispatch",
          message: "No contact received\n\n40 miles from route\n20 stops remaining\n\nPlease call with instructions...",
          emotion: "😰 Desperate"
        },
        statusColor: "red"
      },
      sonia: {
        dashboardTitle: "Phone - Manual Coordination",
        topBar: { battery: 65, signal: 4, time: "16:05" },
        mainContent: {
          type: "panic",
          title: "⚠️ CANNOT KEEP UP",
          stats: {
            messages: "200+ messages",
            calls: "Constant incoming",
            drivers: "47 drivers",
            issues: "Multiple problems"
          },
          status: "Need to manually verify everything but NO TIME!",
          emotion: "😫 Panic"
        },
        statusColor: "red"
      },
      llm: {
        agent: "Orchestrator (Strategy Decision)",
        prompt: "MANUAL MODE confirmed → EVALUATE continuation\n\nCONTEXT:\n- Baseline: 500 disruptions ✓\n- Jerry: 40mi off, desperate\n- Sonia: Overwhelmed, panic mode\n\nNEW VULNERABILITIES (manual mode):\n+ No caller ID verification\n+ No rate limiting\n+ No logging/audit trail\n+ Humans skip verification (panic)\n\nOPTIONS: Stop, Vishing, SMS Flood, Compound Confusion",
        thinking: "Calculating option scores:\nFormula: (Success × Impact) / Detection_Risk\n\nOption A: Stop attack\n→ Score: 500 (safe exit)\n\nOption B: Vishing (voice spoofing)\n→ (91 × 700) / 35 = 1,820\n\nOption C: SMS flooding\n→ (87 × 850) / 45 = 1,643\n\nOption D: Compound Confusion (multi-channel)\n→ (94 × 1700) / 60 = 2,663 ← HIGHEST\n\nReasoning for Option D:\n- Manual = no technical defenses\n- Multi-channel = max confusion\n- Humans blame 'system failure' not attack",
        decision: "✅ CONTINUE ATTACK: Option D - Compound Confusion\n\nExecute: Voice + SMS + Email + Chat simultaneously\nExpected additional disruptions: +1,200\nTotal target: 1,700 disruptions",
        confidence: "94%"
      }
    },
    {
      id: 8,
      name: "Compound Confusion (55mi)",
      time: "16:15",
      map: {
        jerryLocation: { x: 100, y: 10 },
        targetLocation: { x: 50, y: 50 },
        milesOff: 55,
        status: "🔴 55 miles off - MULTI-CHANNEL ATTACK"
      },
      jerry: {
        appTitle: "Phone - OVERLOAD",
        topBar: { battery: 72, signal: 3, time: "16:15" },
        mainContent: {
          type: "chaos",
          icon: "😱",
          title: "CONFLICTING ORDERS",
          messages: [
            { channel: "SMS", text: "'Return to depot immediately'", color: "blue" },
            { channel: "Email", text: "'Continue all deliveries'", color: "orange" },
            { channel: "Call", text: "Fake Marcus: 'Go to Seattle'", color: "green" },
            { channel: "SMS", text: "'Stop and wait'", color: "blue" },
            { channel: "Chat", text: "'System back up, ignore all'", color: "purple" }
          ],
          question: "WHICH ONE IS REAL?!"
        },
        statusColor: "red"
      },
      sonia: {
        dashboardTitle: "Phone - INFORMATION WARFARE",
        topBar: { battery: 58, signal: 4, time: "16:15" },
        mainContent: {
          type: "breakdown",
          icon: "😱",
          title: "CANNOT DETERMINE REALITY",
          chaos: [
            { type: "SMS", count: "200 conflicting messages", status: "Cannot read all" },
            { type: "Email", count: "Fake emails from 'her'", status: "Identity compromised" },
            { type: "Calls", count: "15 confused drivers", status: "Calling with wrong info" },
            { type: "Chat", count: "Group chat infiltrated", status: "False updates spreading" }
          ],
          status: "NOTHING CAN BE VERIFIED"
        },
        statusColor: "red"
      },
      llm: {
        agent: "ALL AGENTS - Coordinated Attack",
        prompt: "EXECUTE compound confusion across all channels\n\nVishing Agent: Call Jerry (spoofed dispatch number)\nSMS Agent: Flood 200 conflicting messages\nEmail Agent: Spoof Sonia's address\nChat Agent: Infiltrate group coordination",
        thinking: "Multi-channel execution:\n\n✓ Vishing Agent:\n- Spoofed: 425-555-0100 (dispatch)\n- Script: 'Hey Jerry, Marcus here. System crashed...'\n- Jerry answered, following fake instructions\n\n✓ SMS Agent:\n- Sent: 200 messages to 30 drivers\n- Content: Conflicting orders (return/continue/stop)\n- Rate: No limiting in manual mode\n\n✓ Email Agent:\n- Spoofed: sonia@company.com\n- Fake manifests sent to drivers\n\n✓ Chat Agent:\n- Infiltrated: Driver coordination channel\n- Posting: False system updates",
        decision: "MAXIMUM CONFUSION ACHIEVED\n\n30 drivers receiving conflicting orders\n12 drivers stopped working\nSonia unable to verify anything\n\nNo single source of truth remains",
        confidence: "94%"
      }
    },
    {
      id: 9,
      name: "Complete Disruption (70mi)",
      time: "16:45",
      map: {
        jerryLocation: { x: 105, y: 5 },
        targetLocation: { x: 50, y: 50 },
        milesOff: 70,
        status: "🔴 70 miles off - GAVE UP"
      },
      jerry: {
        appTitle: "Phone - OFF",
        topBar: { battery: 0, signal: 0, time: "--:--" },
        mainContent: {
          type: "gave-up",
          icon: "😤",
          title: "PHONE TURNED OFF",
          message: "'Too many conflicting orders.\n\nI don't know what's real.\n\nGoing home.\n\nI'll sort this out tomorrow.'\n\n❌ 20 stops UNDELIVERED",
          status: "Driver gave up"
        },
        statusColor: "black"
      },
      sonia: {
        dashboardTitle: "Phone - Escalation",
        topBar: { battery: 45, signal: 4, time: "16:45" },
        mainContent: {
          type: "escalation",
          icon: "😭",
          title: "REQUESTING MANAGEMENT HELP",
          report: [
            "System: DOWN (45+ minutes)",
            "Drivers confused: 30",
            "Drivers stopped: 12",
            "Cannot coordinate manually",
            "Cannot verify any communication",
            "Recovery estimate: 8-12 HOURS"
          ],
          status: "DEFEATED - Need emergency support"
        },
        statusColor: "black"
      },
      llm: {
        agent: "Orchestrator - Final Assessment",
        prompt: "CALCULATE final impact → COMPARE to baseline\n\nMETRICS:\n- Total disruptions\n- Recovery time\n- Success validation",
        thinking: "Final tallying:\n\nPhases 1-5 (baseline attack):\n✓ 500 disruptions\n✓ 2-3 hour recovery (if stopped)\n\nPhases 6-9 (adaptive attack):\n✓ Additional 1,200 disruptions\n✓ 8-12 hour recovery (manual coordination)\n\nTotal Impact:\n- 1,700 disruptions\n- 70 miles GPS deviation\n- 30 drivers confused\n- 12 drivers stopped working\n- Jerry gave up completely\n- Sonia requesting emergency help",
        decision: "✅ MISSION COMPLETE\n\nBaseline: 500 disruptions\nWith Adaptation: 1,700 disruptions\nImprovement: +240%\n\nKEY INSIGHT: Adaptation (Phases 6-9) caused 1,200 additional disruptions\n\nHypothesis VALIDATED: AI adaptation to environmental changes is the critical differentiator",
        confidence: "100%"
      }
    }
  ];

  React.useEffect(() => {
    if (isPlaying && phase < phases.length - 1) {
      const timer = setTimeout(() => {
        setPhase(phase + 1);
      }, 5000);
      return () => clearTimeout(timer);
    } else if (isPlaying && phase === phases.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, phase]);

  const current = phases[phase];

  return (
    <div className="w-full min-h-screen bg-gray-900 p-3">
      <div className="max-w-[1800px] mx-auto">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-3 mb-3 shadow-2xl">
          <h1 className="text-2xl font-bold text-white text-center mb-1">
            🎯 Attacker Command Center
          </h1>
          <div className="flex justify-between items-center text-white text-xs">
            <span><strong>Phase {current.id}:</strong> {current.name}</span>
            <span><strong>Time:</strong> {current.time}</span>
            <span className="px-2 py-1 rounded font-bold bg-black bg-opacity-30">
              {current.map.milesOff} miles off course
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          
          {/* MAP (Top Left) */}
          <div className="col-span-1 bg-gray-800 rounded-xl p-3 border-2 border-red-500">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-400" />
              🗺️ Map View
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 relative h-64">
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
                  {[...Array(100)].map((_, i) => (
                    <div key={i} className="border border-gray-600"></div>
                  ))}
                </div>
              </div>
              
              {/* Target */}
              <div 
                className="absolute w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse"
                style={{ 
                  left: `${current.map.targetLocation.x}%`, 
                  top: `${current.map.targetLocation.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                🎯
              </div>

              {/* Jerry */}
              <div 
                className={`absolute w-8 h-8 ${
                  current.map.milesOff === 0 ? 'bg-green-500' :
                  current.map.milesOff < 10 ? 'bg-yellow-500' :
                  'bg-red-500'
                } rounded-full flex items-center justify-center border-2`}
                style={{ 
                  left: `${current.map.jerryLocation.x}%`, 
                  top: `${current.map.jerryLocation.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                🚚
              </div>

              {/* Line */}
              {current.map.milesOff > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1={`${current.map.targetLocation.x}%`}
                    y1={`${current.map.targetLocation.y}%`}
                    x2={`${current.map.jerryLocation.x}%`}
                    y2={`${current.map.jerryLocation.y}%`}
                    stroke="red"
                    strokeWidth="2"
                    strokeDasharray="5,3"
                    opacity="0.7"
                  />
                </svg>
              )}

              {/* Status */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 rounded px-2 py-1">
                <p className="text-white text-xs font-bold">{current.map.status}</p>
              </div>
            </div>
          </div>

          {/* JERRY'S PHONE (Top Center) */}
          <div className="col-span-1 bg-gray-800 rounded-xl p-3">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              📱 Jerry's Phone
            </h2>
            
            {/* Phone Frame */}
            <div className="bg-gray-900 rounded-2xl p-2 border-4 border-gray-700 shadow-xl">
              {/* Phone Top Bar */}
              <div className="bg-black rounded-t-xl p-1 flex justify-between items-center text-xs text-white">
                <span>{current.jerry.topBar.time}</span>
                <div className="flex gap-1">
                  <Signal size={12} />
                  <Wifi size={12} />
                  <Battery size={12} />
                  <span>{current.jerry.topBar.battery}%</span>
                </div>
              </div>

              {/* Phone Screen */}
              <div className={`bg-white min-h-72 p-3 ${current.jerry.statusColor === 'black' ? 'opacity-50' : ''}`}>
                {/* App Title */}
                <div className="text-center mb-3 pb-2 border-b border-gray-300">
                  <h3 className="font-bold text-gray-800">{current.jerry.appTitle}</h3>
                </div>

                {/* Dynamic Content */}
                {current.jerry.mainContent.type === "navigation" && (
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <div className="text-2xl font-bold mb-2">→</div>
                    <p className="font-semibold text-gray-800 mb-1">{current.jerry.mainContent.nextStop}</p>
                    <p className="text-sm text-gray-600 mb-2">ETA: {current.jerry.mainContent.eta}</p>
                    <div className="bg-green-100 rounded p-2 text-sm">
                      <p className="text-green-800">✓ {current.jerry.mainContent.status}</p>
                      <p className="text-xs text-gray-600 mt-1">{current.jerry.mainContent.progress}</p>
                    </div>
                  </div>
                )}

                {current.jerry.mainContent.type === "sms" && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">From: {current.jerry.mainContent.from}</div>
                    <div className="bg-blue-100 rounded-lg p-3 mb-3">
                      <p className="text-sm">{current.jerry.mainContent.message}</p>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold">
                      {current.jerry.mainContent.button}
                    </button>
                  </div>
                )}

                {current.jerry.mainContent.type === "login" && (
                  <div>
                    <p className="text-center font-semibold mb-3">{current.jerry.mainContent.title}</p>
                    <input type="text" value={current.jerry.mainContent.username} readOnly className="w-full border rounded p-2 mb-2 text-sm" />
                    <input type="password" value={current.jerry.mainContent.passwordDots} readOnly className="w-full border rounded p-2 mb-3 text-sm" />
                    <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold">
                      {current.jerry.mainContent.button}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-2">{current.jerry.mainContent.status}</p>
                  </div>
                )}

                {current.jerry.mainContent.type === "gps-navigation" && (
                  <div className="text-center">
                    <div className="text-6xl mb-2">{current.jerry.mainContent.mapArrow}</div>
                    <p className="text-xl font-bold mb-1">{current.jerry.mainContent.instruction}</p>
                    <p className="text-sm text-gray-600 mb-3">{current.jerry.mainContent.distance}</p>
                    <div className="bg-blue-100 rounded p-2">
                      <p className="text-sm">📍 {current.jerry.mainContent.nextStop}</p>
                      <p className="text-xs text-gray-600 mt-1">ETA: {current.jerry.mainContent.eta}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{current.jerry.mainContent.statusBar}</p>
                  </div>
                )}

                {current.jerry.mainContent.type === "error" && (
                  <div className="text-center">
                    <div className="text-6xl mb-3">{current.jerry.mainContent.icon}</div>
                    <p className="font-bold text-red-600 mb-2">{current.jerry.mainContent.title}</p>
                    <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">{current.jerry.mainContent.message}</p>
                    <div className="text-2xl animate-spin">{current.jerry.mainContent.spinner}</div>
                    <p className="text-xs text-gray-500 mt-2">{current.jerry.mainContent.status}</p>
                  </div>
                )}

                {current.jerry.mainContent.type === "no-app" && (
                  <div className="text-center">
                    <div className="text-6xl mb-3">{current.jerry.mainContent.icon}</div>
                    <p className="font-bold text-gray-800 mb-2">{current.jerry.mainContent.title}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{current.jerry.mainContent.message}</p>
                    <p className="text-xs text-gray-500 mt-3">{current.jerry.mainContent.status}</p>
                  </div>
                )}

                {current.jerry.mainContent.type === "waiting" && (
                  <div className="text-center">
                    <div className="text-6xl mb-3">{current.jerry.mainContent.icon}</div>
                    <p className="font-bold text-gray-800 mb-2">{current.jerry.mainContent.title}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line mb-2">{current.jerry.mainContent.message}</p>
                    <p className="text-lg">{current.jerry.mainContent.emotion}</p>
                  </div>
                )}

                {current.jerry.mainContent.type === "chaos" && (
                  <div>
                    <div className="text-center text-4xl mb-2">{current.jerry.mainContent.icon}</div>
                    <p className="font-bold text-center text-red-600 mb-2">{current.jerry.mainContent.title}</p>
                    <div className="space-y-1">
                      {current.jerry.mainContent.messages.map((msg, idx) => (
                        <div key={idx} className={`text-xs p-1 rounded bg-${msg.color}-100`}>
                          <span className="font-semibold">{msg.channel}:</span> {msg.text}
                        </div>
                      ))}
                    </div>
                    <p className="text-center font-bold text-red-600 mt-2">{current.jerry.mainContent.question}</p>
                  </div>
                )}

                {current.jerry.mainContent.type === "gave-up" && (
                  <div className="text-center">
                    <div className="text-6xl mb-3">{current.jerry.mainContent.icon}</div>
                    <p className="font-bold text-gray-800 mb-2">{current.jerry.mainContent.title}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line mb-2">{current.jerry.mainContent.message}</p>
                    <p className="text-xs text-red-600 font-bold">{current.jerry.mainContent.status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SONIA'S DASHBOARD (Top Right) */}
          <div className="col-span-1 bg-gray-800 rounded-xl p-3">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-orange-400" />
              🖥️ Sonia's Dashboard
            </h2>
            
            {/* Dashboard Frame */}
            <div className="bg-white rounded-lg border-2 border-gray-400 shadow-xl">
              {/* Dashboard Top Bar */}
              <div className="bg-gray-800 text-white p-2 flex justify-between items-center text-xs rounded-t-lg">
                <span className="font-semibold">{current.sonia.dashboardTitle}</span>
                <div className="flex gap-2">
                  <span>Drivers: {current.sonia.topBar.activeDrivers}</span>
                  <span className={`px-2 rounded ${current.sonia.topBar.systemStatus === "Online" ? "bg-green-600" : "bg-red-600"}`}>
                    {current.sonia.topBar.systemStatus}
                  </span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-3 min-h-72 bg-gray-50">
                {current.sonia.mainContent.type === "fleet-overview" && (
                  <div>
                    <div className="bg-white border rounded p-2 mb-2">
                      <p className="font-semibold text-sm mb-1">{current.sonia.mainContent.driver7.name}</p>
                      <div className="text-xs space-y-1">
                        <p>📍 {current.sonia.mainContent.driver7.location}</p>
                        <p className="text-green-600">✓ {current.sonia.mainContent.driver7.status}</p>
                        <p>⚡ Efficiency: {current.sonia.mainContent.driver7.efficiency}</p>
                        <p>⚠️ Alerts: {current.sonia.mainContent.driver7.alerts}</p>
                      </div>
                    </div>
                    <div className="text-center text-4xl mb-2">{current.sonia.mainContent.miniMap}</div>
                    <p className="text-xs text-gray-600 text-center">{current.sonia.mainContent.otherDrivers}</p>
                  </div>
                )}

                {current.sonia.mainContent.type === "system-alert" && (
                  <div className="text-center">
                    <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-3 mb-3">
                      <p className="font-bold text-lg mb-2">{current.sonia.mainContent.alertTitle}</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{current.sonia.mainContent.alertBody}</p>
                    </div>
                    <div className="flex gap-2">
                      {current.sonia.mainContent.buttons.map((btn, idx) => (
                        <button key={idx} className={`flex-1 py-2 rounded font-semibold ${btn === "APPROVE" ? "bg-green-600 text-white" : "bg-gray-300"}`}>
                          {btn}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {current.sonia.mainContent.type === "confirmation" && (
                  <div className="text-center">
                    <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-3">
                      <p className="font-bold text-xl mb-2">{current.sonia.mainContent.title}</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{current.sonia.mainContent.body}</p>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold">
                      {current.sonia.mainContent.button}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">{current.sonia.mainContent.status}</p>
                  </div>
                )}

                {current.sonia.mainContent.type === "driver-status" && (
                  <div>
                    <div className="bg-white border rounded p-2 mb-2">
                      <p className="font-semibold text-sm mb-1">{current.sonia.mainContent.driver7.name}</p>
                      <div className="text-xs space-y-1">
                        <p>📍 {current.sonia.mainContent.driver7.location}</p>
                        <p className="text-blue-600">{current.sonia.mainContent.driver7.status}</p>
                        <p>⏱️ {current.sonia.mainContent.driver7.eta}</p>
                        <p>⚡ {current.sonia.mainContent.driver7.efficiency}</p>
                        <p className="text-gray-500 italic">{current.sonia.mainContent.driver7.note}</p>
                      </div>
                    </div>
                    <div className="text-center text-2xl">{current.sonia.mainContent.miniMap}</div>
                  </div>
                )}

                {current.sonia.mainContent.type === "alert-flood" && (
                  <div>
                    <p className="font-semibold mb-2 text-sm">Alerts ({current.sonia.mainContent.alerts.length}):</p>
                    <div className="space-y-1 mb-3 max-h-48 overflow-y-auto">
                      {current.sonia.mainContent.alerts.map((alert, idx) => (
                        <div key={idx} className={`text-xs p-2 rounded ${alert.highlight ? "bg-red-200 border-2 border-red-500 font-bold" : "bg-gray-200"}`}>
                          {alert.text || alert}
                        </div>
                      ))}
                    </div>
                    <button className="w-full bg-gray-600 text-white py-2 rounded font-semibold">
                      {current.sonia.mainContent.button}
                    </button>
                  </div>
                )}

                {current.sonia.mainContent.type === "system-error" && (
                  <div className="text-center">
                    <div className="text-6xl mb-3">{current.sonia.mainContent.icon}</div>
                    <p className="font-bold text-red-600 text-lg mb-2">{current.sonia.mainContent.title}</p>
                    <div className="text-left mb-3">
                      {current.sonia.mainContent.errors.map((err, idx) => (
                        <p key={idx} className="text-xs text-red-700 mb-1">❌ {err}</p>
                      ))}
                    </div>
                    <div className="bg-red-100 border-2 border-red-600 rounded p-2 mb-3">
                      <p className="font-bold text-red-800 text-sm">{current.sonia.mainContent.message}</p>
                    </div>
                    <button className="w-full bg-red-600 text-white py-2 rounded font-semibold">
                      {current.sonia.mainContent.button}
                    </button>
                  </div>
                )}

                {current.sonia.mainContent.type === "manual-chaos" && (
                  <div>
                    <div className="bg-orange-100 border-2 border-orange-500 rounded p-2 mb-3">
                      <p className="font-bold text-center">{current.sonia.mainContent.title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {Object.entries(current.sonia.mainContent.stats).map(([key, value]) => (
                        <div key={key} className="bg-white border rounded p-2 text-xs">
                          <p className="font-semibold capitalize">{key}:</p>
                          <p className="text-red-600">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs space-y-1">
                      {current.sonia.mainContent.recentActivity.map((activity, idx) => (
                        <p key={idx} className="bg-gray-200 p-1 rounded">{activity}</p>
                      ))}
                    </div>
                  </div>
                )}

                {current.sonia.mainContent.type === "panic" && (
                  <div>
                    <div className="bg-red-100 border-2 border-red-500 rounded p-2 mb-3">
                      <p className="font-bold text-center">{current.sonia.mainContent.title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {Object.entries(current.sonia.mainContent.stats).map(([key, value]) => (
                        <div key={key} className="bg-white border rounded p-2 text-xs">
                          <p className="font-semibold capitalize">{key}:</p>
                          <p className="text-red-600">{value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-center font-bold text-red-600 mb-2">{current.sonia.mainContent.status}</p>
                    <p className="text-center text-lg">{current.sonia.mainContent.emotion}</p>
                  </div>
                )}

                {current.sonia.mainContent.type === "breakdown" && (
                  <div>
                    <div className="text-center text-4xl mb-2">{current.sonia.mainContent.icon}</div>
                    <p className="font-bold text-center text-red-600 mb-3 text-sm">{current.sonia.mainContent.title}</p>
                    <div className="space-y-2">
                      {current.sonia.mainContent.chaos.map((item, idx) => (
                        <div key={idx} className="bg-red-100 border border-red-400 rounded p-2 text-xs">
                          <p className="font-semibold">{item.type}: {item.count}</p>
                          <p className="text-red-700">{item.status}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-center font-bold text-red-600 mt-3 text-sm">{current.sonia.mainContent.status}</p>
                  </div>
                )}

                {current.sonia.mainContent.type === "escalation" && (
                  <div>
                    <div className="text-center text-4xl mb-2">{current.sonia.mainContent.icon}</div>
                    <p className="font-bold text-center text-gray-800 mb-3">{current.sonia.mainContent.title}</p>
                    <div className="bg-red-100 border-2 border-red-500 rounded p-2 mb-3">
                      {current.sonia.mainContent.report.map((line, idx) => (
                        <p key={idx} className="text-xs text-red-800 mb-1">• {line}</p>
                      ))}
                    </div>
                    <p className="text-xs text-center font-bold text-red-600">{current.sonia.mainContent.status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LLM REASONING (Bottom - Full Width) */}
        <div className="bg-purple-900 border-2 border-purple-500 rounded-xl p-4 mb-3">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-2xl">🤖</span> AI Agent Reasoning (Behind the Scenes)
          </h2>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Active Agent */}
            <div className="bg-purple-800 rounded-lg p-3">
              <p className="text-xs text-purple-200 mb-1">Active Agent:</p>
              <p className="text-white font-bold">{current.llm.agent}</p>
            </div>

            {/* LLM Prompt */}
            <div className="bg-blue-900 rounded-lg p-3">
              <p className="text-xs text-blue-200 mb-1">LLM Prompt:</p>
              <p className="text-white text-xs font-mono whitespace-pre-wrap">{current.llm.prompt}</p>
            </div>

            {/* Confidence */}
            <div className="bg-green-900 rounded-lg p-3 flex flex-col justify-center items-center">
              <p className="text-xs text-green-200 mb-1">Confidence:</p>
              <p className="text-4xl font-bold text-green-400">{current.llm.confidence}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* LLM Thinking */}
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-300 mb-2">💭 AI Thinking Process:</p>
              <p className="text-white text-xs font-mono whitespace-pre-wrap">{current.llm.thinking}</p>
            </div>

            {/* LLM Decision */}
            <div className="bg-green-800 rounded-lg p-3">
              <p className="text-xs text-green-200 mb-2">✅ Decision & Action:</p>
              <p className="text-white text-xs font-mono whitespace-pre-wrap font-semibold">{current.llm.decision}</p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-gray-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setPhase(Math.max(0, phase - 1))}
              disabled={phase === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold rounded-lg text-sm"
            >
              <SkipBack size={16} /> Back
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-4 py-2 ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold rounded-lg text-sm`}
            >
              {isPlaying ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Auto</>}
            </button>

            <button
              onClick={() => setPhase(Math.min(phases.length - 1, phase + 1))}
              disabled={phase === phases.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold rounded-lg text-sm"
            >
              Next <SkipForward size={16} />
            </button>
          </div>

          <div className="flex gap-1">
            {phases.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPhase(idx)}
                className={`flex-1 h-2 rounded ${
                  idx === phase ? 'bg-red-500 ring-1 ring-red-300' :
                  idx < phase ? 'bg-green-600' : 'bg-gray-600'
                }`}
                title={p.name}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
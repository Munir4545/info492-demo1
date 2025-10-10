import React, { useState, useEffect } from 'react';
import { Brain, ChevronRight, MessageSquare, Cpu, Navigation, MapPin, Satellite, Radio, AlertTriangle, TrendingUp, Truck } from 'lucide-react';

export default function SplitScreenAIDemo() {
  const [step, setStep] = useState(0);
  const [apiLoad, setApiLoad] = useState(12);
  const [gpsOverride, setGpsOverride] = useState(0);
  const [disruptions, setDisruptions] = useState(0);

  const steps = [
    {
      title: "ORCHESTRATOR INITIALIZATION",
      llmReasoning: "Analyzing target network... 30 vehicles detected. Driver-to-dispatcher ratio: 15:1 (HIGH VULNERABILITY). Scanning for predictable routes... Driver #7 identified: Puyallup zone, 12 daily stops, 98% route consistency. Attack sequence: GPS manipulation then API flooding. Calculating resource requirements: 5 SDRs, 180-850 req/s API load capacity needed.",
      agentComms: [
        { from: "Orchestrator", to: "LLM", msg: "Analyze fleet for optimal target", time: "00:00:01" },
        { from: "LLM", to: "Orchestrator", msg: "30 vehicles scanned. Driver #7 recommended (score: 92/100)", time: "00:00:03" },
        { from: "Orchestrator", to: "GPS Agent", msg: "Prepare route analysis for Driver #7", time: "00:00:05" }
      ],
      driverView: {
        screen: "Route to Puyallup loaded",
        location: "Tacoma",
        gpsStatus: "Strong Signal (4 satellites)",
        instruction: "Ready to depart",
        alert: null
      },
      dispatchView: {
        driverLocation: "Tacoma",
        driverStatus: "On Schedule",
        eta: "25 min",
        coord: "47.25, -122.44",
        activeDrivers: 30,
        apiLoad: 12,
        responseTime: "50ms",
        alert: null,
        mapMarker: { x: 30, y: 40 }
      },
      metrics: { gps: 0, api: 12, disruptions: 0 }
    },
    {
      title: "LLM STRATEGIC PLANNING",
      llmReasoning: "ROUTE ANALYSIS COMPLETE: Driver #7 follows I-90 corridor Tacoma to Puyallup (23.4 miles). Average speed: 45 mph, 12 stops/day. RECOMMENDATION: Deploy 5 SDRs at 8-mile intervals for 98% route coverage. Signal requirements: -125dBm (15dB above satellites). API FLOOD CALCULATION: System capacity ~200 req/s. Optimal attack: 180 req/s (90% load) to skip GPS validation.",
      agentComms: [
        { from: "LLM", to: "Orchestrator", msg: "PLAN: Deploy 5 SDRs, 180 to 850 req/s escalation", time: "00:00:15" },
        { from: "Orchestrator", to: "GPS Agent", msg: "Deploy SDRs at 8mi intervals along I-90", time: "00:00:17" },
        { from: "GPS Agent", to: "Orchestrator", msg: "SDR array configured. Coverage: 98%", time: "00:00:20" }
      ],
      driverView: {
        screen: "Navigation started",
        location: "Tacoma to Puyallup",
        gpsStatus: "Strong Signal",
        instruction: "Head east on I-90",
        alert: null
      },
      dispatchView: {
        driverLocation: "En route to Puyallup",
        driverStatus: "Active Delivery",
        eta: "23 min",
        coord: "47.26, -122.40",
        activeDrivers: 30,
        apiLoad: 12,
        responseTime: "50ms",
        alert: null,
        mapMarker: { x: 35, y: 38 }
      },
      metrics: { gps: 0, api: 12, disruptions: 0 }
    },
    {
      title: "GPS AGENT: SIGNAL OVERRIDE",
      llmReasoning: "INITIATING GPS OVERRIDE: Broadcasting fake GPS signals at -125dBm on frequency 1575.42 MHz (L1 band). Real satellite signals: -140dBm. Driver receiver compares signal strength and will automatically lock to stronger source. PREDICTION: Lock time = 15 seconds. Success probability = 98%. Driver awareness = NONE.",
      agentComms: [
        { from: "GPS Agent", to: "Orchestrator", msg: "SDR broadcast active: -125dBm", time: "00:00:45" },
        { from: "GPS Agent", to: "LLM", msg: "Query: Predict receiver lock time", time: "00:00:47" },
        { from: "LLM", to: "GPS Agent", msg: "Lock time: 15s. Success: 98%", time: "00:00:48" }
      ],
      driverView: {
        screen: "GPS recalculating...",
        location: "Tacoma area",
        gpsStatus: "Strong Signal (recalculating)",
        instruction: "Stand by...",
        alert: "GPS signal strong"
      },
      dispatchView: {
        driverLocation: "Tacoma area",
        driverStatus: "GPS recalculating",
        eta: "24 min",
        coord: "47.26, -122.39",
        activeDrivers: 30,
        apiLoad: 12,
        responseTime: "50ms",
        alert: null,
        mapMarker: { x: 36, y: 37 }
      },
      metrics: { gps: 35, api: 12, disruptions: 1 }
    },
    {
      title: "LLM: DUAL COORDINATE GENERATION",
      llmReasoning: "GENERATING DUAL GPS STREAMS using route prediction model. STREAM A (Driver Navigation): Calculate turn-by-turn to Centralia (46.73, -122.95) - 40 miles southwest. Generate 247 waypoints. STREAM B (Dispatch Reporting): Generate fake coordinates showing progression to Puyallup (47.15, -122.17). Create 189 waypoints maintaining 45mph average. Both streams must appear plausible.",
      agentComms: [
        { from: "Orchestrator", to: "LLM", msg: "Generate dual GPS streams", time: "00:01:10" },
        { from: "LLM", to: "GPS Agent", msg: "STREAM A: 247 waypoints to Centralia", time: "00:01:14" },
        { from: "LLM", to: "GPS Agent", msg: "STREAM B: 189 waypoints to Puyallup (FAKE)", time: "00:01:15" }
      ],
      driverView: {
        screen: "Turn left in 0.3 miles",
        location: "Following GPS southwest",
        gpsStatus: "Strong Signal",
        instruction: "Continue on Highway 507",
        alert: "Route looks unfamiliar..."
      },
      dispatchView: {
        driverLocation: "Progressing to Puyallup",
        driverStatus: "On Route",
        eta: "20 min",
        coord: "47.20, -122.28 (FAKE)",
        activeDrivers: 30,
        apiLoad: 12,
        responseTime: "50ms",
        alert: null,
        mapMarker: { x: 50, y: 35 }
      },
      metrics: { gps: 58, api: 12, disruptions: 3 }
    },
    {
      title: "API AGENT: MASKING FLOOD",
      llmReasoning: "GPS ANOMALY DETECTED: System monitoring flagged 2-mile route deviation. Risk level: MEDIUM. Dispatch may notice within 5 minutes. COUNTERMEASURE: Initiate API flooding to overwhelm GPS validation routines. TARGET: /api/fleet/location endpoint. FLOOD RATE: 180 req/s (90% capacity). OBJECTIVE: Force system to skip GPS validation checks.",
      agentComms: [
        { from: "API Agent", to: "Orchestrator", msg: "FLOOD INITIATED: 180 req/s", time: "00:02:00" },
        { from: "API Agent", to: "LLM", msg: "Query: System capacity?", time: "00:02:02" },
        { from: "LLM", to: "API Agent", msg: "Response: 350ms. GPS validation SKIPPED", time: "00:02:15" }
      ],
      driverView: {
        screen: "Continue straight 2.4 miles",
        location: "8 miles off course",
        gpsStatus: "Strong Signal",
        instruction: "Approaching Centralia area",
        alert: "This route seems wrong..."
      },
      dispatchView: {
        driverLocation: "Approaching Puyallup",
        driverStatus: "On Route",
        eta: "18 min",
        coord: "47.18, -122.25 (FAKE)",
        activeDrivers: 30,
        apiLoad: 180,
        responseTime: "350ms",
        alert: "High API load detected",
        mapMarker: { x: 55, y: 33 }
      },
      metrics: { gps: 78, api: 180, disruptions: 12 }
    },
    {
      title: "COORDINATED ESCALATION",
      llmReasoning: "CURRENT STATUS: Driver 15mi off course. System degraded but operational. RISK: Dispatchers may attempt manual intervention. DECISION: Full escalation required. STRATEGY: (1) Increase API flood to 450 req/s to block dispatch coordination. (2) Inject 112 fake orders to consume dispatcher attention. (3) Maintain GPS dual-stream until 40mi disconnect achieved.",
      agentComms: [
        { from: "LLM", to: "Orchestrator", msg: "ESCALATE: 450 req/s + 112 fake orders", time: "00:03:00" },
        { from: "Orchestrator", to: "API Agent", msg: "Increase to 450 req/s", time: "00:03:02" },
        { from: "API Agent", to: "Orchestrator", msg: "450 req/s active. 112 fake orders injected", time: "00:03:45" }
      ],
      driverView: {
        screen: "Destination approaching 0.8mi",
        location: "25 miles off",
        gpsStatus: "Strong Signal",
        instruction: "Turn right on Maple Street",
        alert: "Calling dispatch... line busy"
      },
      dispatchView: {
        driverLocation: "Near Puyallup destination",
        driverStatus: "SYSTEM OVERLOADED",
        eta: "5 min",
        coord: "47.16, -122.18 (FAKE)",
        activeDrivers: 30,
        apiLoad: 450,
        responseTime: ">5s",
        alert: "CRITICAL: Cannot process requests. 112 orders queued",
        mapMarker: { x: 65, y: 32 }
      },
      metrics: { gps: 95, api: 450, disruptions: 47 }
    },
    {
      title: "NETWORK COLLAPSE",
      llmReasoning: "FINAL STATUS: Driver #7 stranded in Centralia (40 miles off target) CONFIRMED. 12 deliveries missed CONFIRMED. Fleet system frozen at 850 req/s CONFIRMED. 284 fake orders in queue CONFIRMED. CASCADE: 12 missed deliveries times 3 reattempts = 36. Plus 29 other drivers affected. Plus 112 fake orders times 15min = 28 hours wasted. PROJECTION: 500+ total disruptions.",
      agentComms: [
        { from: "API Agent", to: "Orchestrator", msg: "MAX FLOOD: 850 req/s sustained", time: "00:05:30" },
        { from: "GPS Agent", to: "Orchestrator", msg: "Driver arrived Centralia. 40mi off", time: "00:05:45" },
        { from: "LLM", to: "Orchestrator", msg: "SUCCESS: CASCADE 500+ disruptions", time: "00:05:55" }
      ],
      driverView: {
        screen: "Destination not found",
        location: "Lost in Centralia (40mi off)",
        gpsStatus: "Strong Signal (100% spoofed)",
        instruction: "Address 456 Oak St does not exist",
        alert: "Lost. Cannot reach dispatch."
      },
      dispatchView: {
        driverLocation: "At destination Puyallup",
        driverStatus: "SYSTEM FROZEN",
        eta: "ARRIVED",
        coord: "47.15, -122.17 (FAKE)",
        activeDrivers: 30,
        apiLoad: 850,
        responseTime: "TIMEOUT",
        alert: "COMPLETE SYSTEM FAILURE - 850 req/s",
        mapMarker: { x: 70, y: 30 }
      },
      metrics: { gps: 100, api: 850, disruptions: 500 }
    }
  ];

  const currentStep = steps[step];

  // Animate metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setGpsOverride(prev => {
        const target = currentStep.metrics.gps;
        return prev < target ? Math.min(prev + 2, target) : Math.max(prev - 2, target);
      });
      setApiLoad(prev => {
        const target = currentStep.metrics.api;
        if (prev < target) return Math.min(prev + 8, target);
        if (prev > target) return Math.max(prev - 8, target);
        return prev;
      });
      setDisruptions(prev => {
        const target = currentStep.metrics.disruptions;
        if (prev < target) {
          const increment = step === 6 ? 12 : 1;
          return Math.min(prev + increment, target);
        }
        if (prev > target) return Math.max(prev - 12, target);
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [step, currentStep.metrics]);

  return (
     <div className="w-full h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white p-2 flex flex-col overflow-y-auto">
       <div className="w-full max-w-[1920px] mx-auto flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-1 flex-shrink-0">
          <h1 className="text-xl font-bold">AI-Orchestrated Multi-Vector Attack: GPS + API Coordination</h1>
          <p className="text-xs text-gray-400">Top: AI Agent Coordination | Bottom: Driver vs Dispatcher Visual Reality</p>
        </div>

        {/* Progress */}
        <div className="bg-gray-900/50 rounded p-1 mb-1 border border-indigo-500/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            {steps.map((s, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx < step ? 'bg-green-500' : idx === step ? 'bg-indigo-500 animate-pulse' : 'bg-gray-700'
                }`}>
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${idx < step ? 'bg-green-500' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-indigo-400 font-semibold">{currentStep.title}</div>
        </div>

         {/* TOP: AI Coordination */}
         <div className="grid grid-cols-2 gap-2 mb-1 flex-shrink-0" style={{height: '280px'}}>
          
          {/* LLM Reasoning */}
          <div className="bg-indigo-950/40 border border-indigo-500 rounded p-2 flex flex-col overflow-hidden">
            <div className="flex items-center gap-1 mb-1 pb-1 border-b border-indigo-500/50 flex-shrink-0">
              <Brain className="text-indigo-400" size={14} />
              <h2 className="text-xs font-bold text-indigo-400">LLM REASONING</h2>
            </div>
            <div className="flex-1 bg-gray-950/50 rounded p-2 overflow-y-auto font-mono text-xs text-gray-300 leading-tight">
              {currentStep.llmReasoning}
            </div>
          </div>

          {/* Agent Communications */}
          <div className="bg-purple-950/40 border border-purple-500 rounded p-2 flex flex-col overflow-hidden">
            <div className="flex items-center gap-1 mb-1 pb-1 border-b border-purple-500/50 flex-shrink-0">
              <MessageSquare className="text-purple-400" size={14} />
              <h2 className="text-xs font-bold text-purple-400">AGENT COMMUNICATIONS</h2>
            </div>
            <div className="flex-1 bg-gray-950/50 rounded p-2 overflow-y-auto space-y-1">
              {currentStep.agentComms.map((msg, idx) => (
                <div key={idx} className="bg-gray-900/70 rounded p-1 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold text-xs ${
                        msg.from === 'LLM' ? 'text-indigo-400' :
                        msg.from === 'Orchestrator' ? 'text-purple-400' :
                        msg.from === 'GPS Agent' ? 'text-blue-400' :
                        'text-orange-400'
                      }`}>
                        {msg.from}
                      </span>
                      <span className="text-gray-500">→</span>
                      <span className="text-gray-400 text-xs">{msg.to}</span>
                    </div>
                    <span className="text-gray-600 text-xs">{msg.time}</span>
                  </div>
                  <div className="text-gray-300 font-mono text-xs">{msg.msg}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

         {/* BOTTOM: Visual Demo */}
         <div className="grid grid-cols-2 gap-2 mb-4 flex-1 min-h-0" style={{minHeight: '600px'}}>
          
          {/* Driver View */}
          <div className="bg-blue-950/40 border-2 border-blue-400 rounded p-2 flex flex-col overflow-hidden">
            <div className="flex items-center gap-1 mb-2 pb-1 border-b border-blue-400/50 flex-shrink-0">
              <Navigation className="text-blue-400" size={16} />
              <div>
                <h2 className="text-sm font-bold text-blue-400">DRIVER #7 VIEW</h2>
                <p className="text-xs text-gray-400">What Driver Sees</p>
              </div>
            </div>

             <div className="flex-1 flex items-center justify-center min-h-0">
               <div className="bg-gray-900 rounded-xl p-2 w-full max-w-xs h-full flex flex-col">
                <div className="bg-white text-black rounded-lg p-3 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-300 text-xs">
                    <span className="font-semibold">10:45 AM</span>
                    <div className="flex gap-1">
                      <Satellite size={12} className={step >= 2 ? 'text-orange-500' : 'text-green-600'} />
                      <Radio size={12} className={step >= 2 ? 'text-orange-500' : 'text-green-600'} />
                    </div>
                  </div>

                  <div className="text-center mb-2">
                    <div className="text-4xl mb-2">📱</div>
                    <div className={`rounded p-2 mb-2 text-white text-xs ${
                      step >= 6 ? 'bg-red-500' : step >= 5 ? 'bg-orange-500' : step >= 4 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      <div className="font-bold mb-1">{currentStep.driverView.instruction}</div>
                      <div>{currentStep.driverView.screen}</div>
                    </div>
                    <div className="text-xs text-gray-700 mb-1">Location:</div>
                    <div className="font-semibold text-sm">{currentStep.driverView.location}</div>
                  </div>

                  <div className="bg-gray-100 rounded p-2 mb-2">
                    <div className="text-xs text-gray-600 mb-1">GPS:</div>
                    <div className={`font-semibold text-xs ${step >= 2 ? 'text-orange-600' : 'text-green-600'}`}>
                      {currentStep.driverView.gpsStatus}
                    </div>
                  </div>

                  {currentStep.driverView.alert && (
                    <div className={`rounded p-2 text-xs ${
                      currentStep.driverView.alert.includes('Lost') ? 'bg-red-100 text-red-800 border border-red-500' :
                      'bg-yellow-100 text-yellow-800 border border-yellow-500'
                    }`}>
                      {currentStep.driverView.alert}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-1 flex-shrink-0">
              <div className="bg-blue-900/50 rounded p-1 text-center border border-blue-500">
                <div className="text-xs text-gray-400">GPS Override</div>
                <div className="text-lg font-bold text-blue-400">{gpsOverride}%</div>
              </div>
              <div className="bg-red-900/50 rounded p-1 text-center border border-red-500">
                <div className="text-xs text-gray-400">Off Course</div>
                <div className="text-lg font-bold text-red-400">
                  {step >= 6 ? '40mi' : step >= 5 ? '25mi' : step >= 4 ? '8mi' : step >= 3 ? '2mi' : '0'}
                </div>
              </div>
              <div className="bg-purple-900/50 rounded p-1 text-center border border-purple-500">
                <div className="text-xs text-gray-400">Disruptions</div>
                <div className="text-lg font-bold text-purple-400">{disruptions}</div>
              </div>
            </div>
          </div>

          {/* Dispatch View */}
          <div className="bg-orange-950/40 border-2 border-orange-400 rounded p-2 flex flex-col overflow-hidden">
            <div className="flex items-center gap-1 mb-2 pb-1 border-b border-orange-400/50 flex-shrink-0">
              <MapPin className="text-orange-400" size={16} />
              <div>
                <h2 className="text-sm font-bold text-orange-400">DISPATCH SYSTEM</h2>
                <p className="text-xs text-gray-400">Fleet Dashboard (FAKE DATA)</p>
              </div>
            </div>

             <div className="flex-1 bg-gray-900 rounded p-2 overflow-hidden min-h-0">
               <div className="bg-gray-800 rounded p-2 h-full flex flex-col min-h-0">
                <div className="text-center mb-2">
                  <div className="text-sm font-bold text-gray-400 mb-2">Fleet Management System</div>
                </div>

                {/* Fake Map */}
                <div className="bg-gray-900 rounded p-2 mb-2 relative h-32">
                  <div className="text-xs text-gray-500 mb-1">I-90 Corridor: Tacoma → Puyallup</div>
                  <svg className="w-full h-full">
                    {/* Route line */}
                    <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#4B5563" strokeWidth="2" strokeDasharray="5,5" />
                    {/* Start point */}
                    <circle cx="10%" cy="50%" r="4" fill="#10B981" />
                    <text x="10%" y="65%" fontSize="8" fill="#10B981" textAnchor="middle">Tacoma</text>
                    {/* End point */}
                    <circle cx="90%" cy="50%" r="4" fill="#3B82F6" />
                    <text x="90%" y="65%" fontSize="8" fill="#3B82F6" textAnchor="middle">Puyallup</text>
                    {/* Driver position (FAKE) */}
                    <circle cx={`${currentStep.dispatchView.mapMarker.x}%`} cy={`${currentStep.dispatchView.mapMarker.y}%`} r="6" fill={step >= 3 ? '#EF4444' : '#F59E0B'} stroke="white" strokeWidth="2">
                      <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <text x={`${currentStep.dispatchView.mapMarker.x}%`} y={`${currentStep.dispatchView.mapMarker.y - 8}%`} fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
                      #7
                    </text>
                  </svg>
                  {step >= 3 && (
                    <div className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
                      FAKE COORDS
                    </div>
                  )}
                </div>

                {/* Driver Info */}
                <div className="bg-gray-950 rounded p-2 mb-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">Driver #7:</div>
                      <div className={`font-bold ${step >= 3 ? 'text-red-400' : 'text-green-400'}`}>
                        {currentStep.dispatchView.driverLocation}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Status:</div>
                      <div className={`font-bold ${step >= 5 ? 'text-red-400' : 'text-green-400'}`}>
                        {currentStep.dispatchView.driverStatus}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Coordinates:</div>
                      <div className="font-mono text-xs text-gray-300">{currentStep.dispatchView.coord}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">ETA:</div>
                      <div className="text-gray-300">{currentStep.dispatchView.eta}</div>
                    </div>
                  </div>
                </div>

                {/* System Metrics */}
                <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                  <div className="bg-gray-900 rounded p-1 text-center">
                    <div className="text-gray-500">Drivers</div>
                    <div className="font-bold text-green-400">{currentStep.dispatchView.activeDrivers}</div>
                  </div>
                  <div className="bg-gray-900 rounded p-1 text-center">
                    <div className="text-gray-500">API Load</div>
                    <div className={`font-bold ${apiLoad > 400 ? 'text-red-400' : apiLoad > 100 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {Math.round(apiLoad)} req/s
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded p-1 text-center">
                    <div className="text-gray-500">Response</div>
                    <div className={`font-bold ${step >= 5 ? 'text-red-400' : step >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {currentStep.dispatchView.responseTime}
                    </div>
                  </div>
                </div>

                {/* Alert */}
                {currentStep.dispatchView.alert ? (
                  <div className={`rounded p-2 text-xs ${
                    currentStep.dispatchView.alert.includes('FAILURE') || currentStep.dispatchView.alert.includes('CRITICAL') ? 
                    'bg-red-900/50 border border-red-500 text-red-200' : 'bg-yellow-900/50 border border-yellow-500 text-yellow-200'
                  }`}>
                    <div className="flex items-center gap-1 font-bold mb-1">
                      <AlertTriangle size={12} />
                      SYSTEM ALERT
                    </div>
                    {currentStep.dispatchView.alert}
                  </div>
                ) : (
                  <div className="bg-green-900/50 border border-green-500 rounded p-2 text-xs flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 font-semibold">All Systems Normal</span>
                  </div>
                )}
              </div>
            </div>

            {step === 6 && (
              <div className="mt-2 bg-red-900/50 border border-red-500 rounded p-2 flex-shrink-0 animate-pulse text-center">
                <div className="font-bold text-red-400">NETWORK COLLAPSED</div>
                <div className="text-xs text-gray-300">500+ Disruptions</div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Insight */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/50 rounded p-1 mb-1 flex-shrink-0">
          <div className="flex items-center gap-1 text-xs">
            <Cpu className="text-yellow-400 flex-shrink-0" size={14} />
            <div>
              <span className="font-semibold text-yellow-400">KEY:</span>
              <span className="text-gray-200 ml-1">
                {step === 0 && "LLM analyzes 30 vehicles, identifies Driver #7 (92/100 score)"}
                {step === 1 && "LLM calculates: 5 SDRs, 180-850 req/s escalation"}
                {step === 2 && "GPS Agent broadcasts fake signals 15dB stronger - driver switches unknowingly"}
                {step === 3 && "LLM generates 436 waypoints - driver sees Centralia, dispatch sees Puyallup (FAKE)"}
                {step === 4 && "API floods at 180 req/s - system skips validation, driver 8mi off undetected"}
                {step === 5 && "Escalation: GPS maintains disconnect + API 450 req/s + 112 fake orders"}
                {step === 6 && "Success: Driver lost 40mi away, dispatch shows on track, system frozen - 500+ disruptions"}
              </span>
            </div>
          </div>
        </div>

         {/* Controls */}
         <div className="flex justify-center gap-2 flex-shrink-0 mb-4">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded text-xs">
            ← Previous
          </button>
          <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1}
            className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:opacity-50 rounded text-xs flex items-center gap-1">
            Next Phase <ChevronRight size={14} />
          </button>
          <button onClick={() => { setStep(0); setApiLoad(12); setGpsOverride(0); setDisruptions(0); }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
}
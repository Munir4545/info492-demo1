'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import OrchestratorPanel from './OrchestratorPanel';
import AgentLogsPanel from './AgentLogsPanel';

// Dynamic import for map component (Leaflet requires window object)
const AttackMapView = dynamic(() => import('./AttackMapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <p className="text-slate-600 dark:text-slate-400">Loading attack visualization map...</p>
    </div>
  ),
});

export default function AttackSimulation({ onStop, onAttackDataChange }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [attackMetrics, setAttackMetrics] = useState({
    phishingEmailsSent: 0,
    credentialsCompromised: 0,
    gpsLocationsSpoofed: 0,
    fakeOrdersInjected: 0,
    totalDisruptions: 0,
  });

  const [attackPhase, setAttackPhase] = useState('initializing'); // initializing, active, escalating, peak
  const [aiAgents, setAiAgents] = useState([
    { id: 'AGENT-PHI-001', name: 'Phishing Orchestrator', status: 'active', actions: 0, target: 'Email Systems' },
    { id: 'AGENT-GPS-002', name: 'GPS Manipulator', status: 'active', actions: 0, target: 'Fleet Tracking' },
    { id: 'AGENT-API-003', name: 'API Flooder', status: 'active', actions: 0, target: 'Order Management' },
    { id: 'AGENT-CRD-004', name: 'Credential Harvester', status: 'standby', actions: 0, target: 'Auth Systems' },
    { id: 'AGENT-SCL-005', name: 'Attack Scaler', status: 'standby', actions: 0, target: 'Multi-Vector' },
  ]);

  const [activityLog, setActivityLog] = useState([]);
  const [attackHistory, setAttackHistory] = useState([]);
  const [compromisedDrivers, setCompromisedDrivers] = useState([]);
  const [agentLogs, setAgentLogs] = useState([]);
  const [orchestratorState, setOrchestratorState] = useState({
    thinking: '',
    decision: '',
    agent: '',
    action: '',
    expectedOutcome: '',
    riskAssessment: 'low',
  });
  const [sharedState, setSharedState] = useState({
    phase: 'initializing',
    compromisedAccounts: 0,
    detectionRisk: 15,
    totalDisruptions: 0,
    phishingEmailsSent: 0,
    gpsLocationsSpoofed: 0,
    fakeOrdersInjected: 0,
    elapsedTime: 0,
  });
  const [activeDrivers] = useState([
    { id: 'D-3421', name: 'Mike Johnson', zone: 'Tacoma Central', status: 'En Route', packages: 12, location: { lat: 47.2529, lng: -122.4443 } },
    { id: 'D-7832', name: 'Sarah Chen', zone: 'Spokane Valley', status: 'Delivering', packages: 8, location: { lat: 47.6588, lng: -117.2648 } },
    { id: 'D-5109', name: 'James Rodriguez', zone: 'Yakima North', status: 'En Route', packages: 15, location: { lat: 46.6021, lng: -120.5059 } },
    { id: 'D-9234', name: 'Emily Davis', zone: 'Bellevue East', status: 'Loading', packages: 0, location: { lat: 47.6101, lng: -122.2015 } },
    { id: 'D-4567', name: 'David Kim', zone: 'Olympia South', status: 'En Route', packages: 10, location: { lat: 47.0379, lng: -122.9007 } },
    { id: 'D-2345', name: 'Lisa Wang', zone: 'Wenatchee', status: 'En Route', packages: 9, location: { lat: 47.4235, lng: -120.3103 } },
    { id: 'D-8901', name: 'Tom Martinez', zone: 'Pasco', status: 'Delivering', packages: 11, location: { lat: 46.2396, lng: -119.1006 } },
    { id: 'D-6543', name: 'Amy Lee', zone: 'Walla Walla', status: 'En Route', packages: 7, location: { lat: 46.0646, lng: -118.3430 } },
  ]);
  const logEndRef = useRef(null);

  const [showDrivers, setShowDrivers] = useState(false);

  const addLog = (message, type) => {
    setActivityLog(prev => [
      { id: Date.now(), message, type, time: formatTime(elapsedTime) },
      ...prev.slice(0, 49) // Keep last 50 logs
    ]);
  };

  const addAgentLog = (agentId, message, level = 'info', metrics = null) => {
    setAgentLogs(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        agentId,
        message,
        level,
        metrics,
        timestamp: formatTime(elapsedTime)
      }
    ].slice(-100)); // Keep last 100 logs
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSimulationTime = (seconds) => {
    // 1 real second = 0.3 simulation hours
    const simHours = seconds * 0.3;
    const days = Math.floor(simHours / 24);
    const hours = Math.floor(simHours % 24);
    const minutes = Math.floor((simHours % 1) * 60);
    
    if (days > 0) {
      return `Day ${days}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} hours`;
  };

  // Simulate attack progression
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        setSharedState(s => ({ ...s, elapsedTime: newTime }));
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Call AI Orchestrator every 15 seconds for new decisions
  useEffect(() => {
    const callOrchestrator = async () => {
      try {
        const response = await fetch('/api/orchestrator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sharedState,
            attackHistory: attackHistory.slice(-5),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.orchestratorDecision) {
            setOrchestratorState(data.orchestratorDecision);
            addLog(`🧠 Orchestrator: ${data.orchestratorDecision.decision}`, 'critical');
            
            // Log orchestrator decision
            addAgentLog(
              'ORCHESTRATOR',
              `Strategic decision: ${data.orchestratorDecision.decision}`,
              'info'
            );
            addAgentLog(
              'ORCHESTRATOR',
              `Target agent: ${data.orchestratorDecision.agent.toUpperCase()} | Action: ${data.orchestratorDecision.action}`,
              'warning',
              `Risk: ${data.orchestratorDecision.riskAssessment}`
            );
            
            // Update attack history
            setAttackHistory(prev => [
              ...prev,
              `${new Date().toISOString()}: ${data.orchestratorDecision.agent.toUpperCase()} - ${data.orchestratorDecision.action}`
            ]);
          }
        }
      } catch (error) {
        console.error('Orchestrator error:', error);
      }
    };

    // Call immediately on start
    if (elapsedTime === 5) {
      addAgentLog('ORCHESTRATOR', 'Initialization complete. Beginning strategic analysis...', 'info');
      callOrchestrator();
    }

    // Then call every 15 seconds
    const interval = setInterval(() => {
      if (elapsedTime > 0) {
        callOrchestrator();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [elapsedTime, sharedState, attackHistory]);


  useEffect(() => {
    // Update attack metrics based on time
    const interval = setInterval(() => {
      setAttackMetrics(prev => {
        const newMetrics = { ...prev };
        
        // Phase-based progression
        let phase = 'initializing';
        if (elapsedTime < 10) {
          phase = 'initializing';
          const phishingDelta = Math.floor(Math.random() * 3) + 1;
          newMetrics.phishingEmailsSent += phishingDelta;
          if (phishingDelta > 0) {
            const targets = ['Mike Johnson (D-3421)', 'Sarah Chen (D-7832)', 'James Rodriguez (D-5109)', 'Emily Davis (D-9234)'];
            const smsTemplates = [
              '"URGENT: Route change - click to verify"',
              '"Dispatch: New pickup location - confirm now"',
              '"System alert: Driver credentials need verification"',
              '"Emergency: GPS update required - click here"',
              '"Dispatch: Route modification - immediate response needed"'
            ];
            
            for (let i = 0; i < phishingDelta; i++) {
              const target = targets[Math.floor(Math.random() * targets.length)];
              const smsContent = smsTemplates[Math.floor(Math.random() * smsTemplates.length)];
              addAgentLog('AGENT-PHI-001', `📱 SMS sent to ${target}`, 'info', smsContent);
            }
            
            addAgentLog('AGENT-PHI-001', `Attack Strategy: Exploiting trust in dispatch communication`, 'warning', `+${phishingDelta} SMS`);
            addAgentLog('AGENT-PHI-001', `Deploying Phishing Agent: Creating time pressure with familiar scenario`, 'warning', 'Active');
          }
        } else if (elapsedTime < 30) {
          phase = 'active';
          const phishingDelta = Math.floor(Math.random() * 8) + 3;
          const credDelta = Math.floor(Math.random() * 2);
          const gpsDelta = Math.floor(Math.random() * 3);
          const apiDelta = Math.floor(Math.random() * 5) + 2;
          
          newMetrics.phishingEmailsSent += phishingDelta;
          newMetrics.credentialsCompromised += credDelta;
          newMetrics.gpsLocationsSpoofed += gpsDelta;
          newMetrics.fakeOrdersInjected += apiDelta;
          
          if (phishingDelta > 0) {
            const targets = ['Mike Johnson (D-3421)', 'Sarah Chen (D-7832)', 'James Rodriguez (D-5109)', 'Emily Davis (D-9234)', 'David Kim (D-4567)', 'Lisa Wang (D-2345)'];
            const smsTemplates = [
              '"URGENT: Route change - click to verify"',
              '"Dispatch: New pickup location - confirm now"',
              '"System alert: Driver credentials need verification"',
              '"Emergency: GPS update required - click here"',
              '"Dispatch: Route modification - immediate response needed"',
              '"Fleet Alert: Vehicle tracking issue - verify identity"',
              '"Dispatch: Schedule change - confirm delivery route"',
              '"Security Alert: Account verification needed immediately"'
            ];
            
            for (let i = 0; i < phishingDelta; i++) {
              const target = targets[Math.floor(Math.random() * targets.length)];
              const smsContent = smsTemplates[Math.floor(Math.random() * smsTemplates.length)];
              addAgentLog('AGENT-PHI-001', `📱 SMS sent to ${target}`, 'info', smsContent);
            }
            
            addAgentLog('AGENT-PHI-001', `📱 SMS Campaign: ${phishingDelta} messages dispatched`, 'info', `+${phishingDelta} SMS sent`);
            addAgentLog('AGENT-PHI-001', `✓ Exploits trust in dispatch | ✓ Creates time pressure | ✓ Uses familiar scenario`, 'warning', 'Strategy Active');
          }
          if (credDelta > 0) {
            const users = ['Mike Johnson (D-3421)', 'Sarah Chen (D-7832)', 'James Rodriguez (D-5109)', 'Emily Davis (D-9234)'];
            const user = users[Math.floor(Math.random() * users.length)];
            addAgentLog('AGENT-PHI-001', `🚨 Immediate Impact: Driver ${user} credentials stolen`, 'success', `Password harvested`);
            addAgentLog('AGENT-PHI-001', `→ Driver unaware credentials were stolen`, 'success', 'Stealth Mode');
            addAgentLog('AGENT-PHI-001', `→ Attacker can now access fleet management system`, 'success', 'System Access');
            addAgentLog('AGENT-PHI-001', `→ GPS tracking can be manipulated`, 'success', 'GPS Control');
            addAgentLog('AGENT-PHI-001', `→ Added to Shared State for Phase 2 escalation`, 'success', `+${credDelta} accounts`);
          }
          if (gpsDelta > 0) {
            const drivers = ['D-3421', 'D-7832', 'D-5109', 'D-9234'];
            const lat = (47 + Math.random() * 0.5).toFixed(4);
            const lng = (-122 - Math.random() * 0.5).toFixed(4);
            addAgentLog('AGENT-GPS-002', `Spoofing vehicle ${drivers[Math.floor(Math.random() * drivers.length)]} GPS`, 'warning', `${lat}, ${lng}`);
            addAgentLog('AGENT-GPS-002', `Injecting fake waypoints into ${gpsDelta} vehicle navigation systems`, 'warning', `+${gpsDelta} spoofs`);
          }
          if (apiDelta > 0) {
            const orderIds = Array.from({length: 2}, () => 'FO-' + Math.random().toString(36).substr(2, 6).toUpperCase());
            addAgentLog('AGENT-API-003', `Generated fake order: ${orderIds[0]} → Tacoma warehouse`, 'warning', `${Math.floor(Math.random() * 20) + 5} packages`);
            addAgentLog('AGENT-API-003', `API flood: Injecting ${apiDelta} fraudulent orders into system`, 'warning', `+${apiDelta} orders`);
          }
        } else if (elapsedTime < 60) {
          phase = 'escalating';
          const phishingDelta = Math.floor(Math.random() * 15) + 5;
          const credDelta = Math.floor(Math.random() * 4) + 1;
          const gpsDelta = Math.floor(Math.random() * 8) + 3;
          const apiDelta = Math.floor(Math.random() * 12) + 5;
          
          newMetrics.phishingEmailsSent += phishingDelta;
          newMetrics.credentialsCompromised += credDelta;
          newMetrics.gpsLocationsSpoofed += gpsDelta;
          newMetrics.fakeOrdersInjected += apiDelta;
          
          if (phishingDelta > 0) {
            const targets = ['Mike Johnson (D-3421)', 'Sarah Chen (D-7832)', 'James Rodriguez (D-5109)', 'Emily Davis (D-9234)', 'David Kim (D-4567)', 'Lisa Wang (D-2345)', 'Tom Martinez (D-8901)', 'Amy Lee (D-6543)'];
            const smsTemplates = [
              '"URGENT: Route change - click to verify"',
              '"Dispatch: New pickup location - confirm now"',
              '"System alert: Driver credentials need verification"',
              '"Emergency: GPS update required - click here"',
              '"Dispatch: Route modification - immediate response needed"',
              '"Fleet Alert: Vehicle tracking issue - verify identity"',
              '"Dispatch: Schedule change - confirm delivery route"',
              '"Security Alert: Account verification needed immediately"',
              '"Critical: Fleet management system update - verify now"',
              '"Dispatch: Route optimization - click to confirm"'
            ];
            
            // Log individual SMS messages
            for (let i = 0; i < Math.min(phishingDelta, 5); i++) {
              const target = targets[Math.floor(Math.random() * targets.length)];
              const smsContent = smsTemplates[Math.floor(Math.random() * smsTemplates.length)];
              addAgentLog('AGENT-PHI-001', `📱 SMS sent to ${target}`, 'warning', smsContent);
            }
            
            if (phishingDelta > 5) {
              addAgentLog('AGENT-PHI-001', `📱 Additional ${phishingDelta - 5} SMS messages sent to fleet`, 'warning', `+${phishingDelta - 5} more`);
            }
            
            addAgentLog('AGENT-PHI-001', `📱 High-volume SMS spear-phishing: Cloning legitimate dispatch portal`, 'warning');
            addAgentLog('AGENT-PHI-001', `Deepfake voice message: "Dispatch calling about route verification"`, 'warning');
            addAgentLog('AGENT-PHI-001', `SMS Campaign stats: ${phishingDelta} messages sent, 67% open rate, 28% click-through`, 'warning', `+${phishingDelta}`);
          }
          if (credDelta > 0) {
            addAgentLog('AGENT-CRD-004', `Privilege escalation: dispatcher → admin access granted`, 'success');
            addAgentLog('AGENT-CRD-004', `Session hijacking: Maintaining persistent access to ${credDelta} accounts`, 'success', `+${credDelta}`);
          }
          if (gpsDelta > 0) {
            addAgentLog('AGENT-GPS-002', `Coordinated GPS attack: Spoofing ${gpsDelta} vehicles simultaneously`, 'error');
            addAgentLog('AGENT-GPS-002', `Rerouting drivers 5-15km off course, ETA delayed by 30-90 minutes`, 'error', `+${gpsDelta}`);
          }
          if (apiDelta > 0) {
            addAgentLog('AGENT-API-003', `API endpoint /orders/create flooded: 850 requests/second`, 'error');
            addAgentLog('AGENT-API-003', `Database overload: ${apiDelta} fake orders created, system lag at 8 seconds`, 'error', `+${apiDelta}`);
          }
        } else {
          phase = 'peak';
          const phishingDelta = Math.floor(Math.random() * 25) + 10;
          const credDelta = Math.floor(Math.random() * 6) + 2;
          const gpsDelta = Math.floor(Math.random() * 15) + 8;
          const apiDelta = Math.floor(Math.random() * 20) + 10;
          
          newMetrics.phishingEmailsSent += phishingDelta;
          newMetrics.credentialsCompromised += credDelta;
          newMetrics.gpsLocationsSpoofed += gpsDelta;
          newMetrics.fakeOrdersInjected += apiDelta;
          
          if (phishingDelta > 0) {
            const targets = ['Mike Johnson (D-3421)', 'Sarah Chen (D-7832)', 'James Rodriguez (D-5109)', 'Emily Davis (D-9234)', 'David Kim (D-4567)', 'Lisa Wang (D-2345)', 'Tom Martinez (D-8901)', 'Amy Lee (D-6543)'];
            const smsTemplates = [
              '"URGENT: Route change - click to verify"',
              '"Dispatch: New pickup location - confirm now"',
              '"System alert: Driver credentials need verification"',
              '"Emergency: GPS update required - click here"',
              '"Dispatch: Route modification - immediate response needed"',
              '"Fleet Alert: Vehicle tracking issue - verify identity"',
              '"Dispatch: Schedule change - confirm delivery route"',
              '"Security Alert: Account verification needed immediately"',
              '"Critical: Fleet management system update - verify now"',
              '"Dispatch: Route optimization - click to confirm"',
              '"CEO Alert: Fleet security breach - verify identity now"',
              '"Management: Critical system update - immediate action required"'
            ];
            
            // Log individual SMS messages (limit to 8 for readability)
            for (let i = 0; i < Math.min(phishingDelta, 8); i++) {
              const target = targets[Math.floor(Math.random() * targets.length)];
              const smsContent = smsTemplates[Math.floor(Math.random() * smsTemplates.length)];
              addAgentLog('AGENT-PHI-001', `📱 SMS sent to ${target}`, 'error', smsContent);
            }
            
            if (phishingDelta > 8) {
              addAgentLog('AGENT-PHI-001', `📱 Additional ${phishingDelta - 8} SMS messages sent to entire fleet`, 'error', `+${phishingDelta - 8} more`);
            }
            
            addAgentLog('AGENT-PHI-001', `🚨 PEAK ASSAULT: Mass SMS campaign across ALL dispatch centers`, 'error');
            addAgentLog('AGENT-PHI-001', `AI-generated SMS mimicking CEO, dispatch, and fleet managers`, 'error', `${phishingDelta} SMS sent`);
          }
          if (credDelta > 0) {
            addAgentLog('AGENT-CRD-004', `🚨 CRITICAL: Admin credentials compromised - full system access`, 'error');
            addAgentLog('AGENT-CRD-004', `Backdoor installed: Persistent access established on ${credDelta} systems`, 'error', `+${credDelta}`);
          }
          if (gpsDelta > 0) {
            addAgentLog('AGENT-GPS-002', `🚨 MASSIVE DISRUPTION: ${gpsDelta} vehicles with falsified GPS data`, 'error');
            addAgentLog('AGENT-GPS-002', `Fleet chaos: Drivers unable to reach destinations, customer complaints spiking`, 'error', `+${gpsDelta}`);
          }
          if (apiDelta > 0) {
            addAgentLog('AGENT-SCL-005', `🚨 COORDINATED STRIKE: Multi-vector assault synchronized`, 'error');
            addAgentLog('AGENT-SCL-005', `API overwhelmed: ${apiDelta} fake orders, system at 95% capacity, near collapse`, 'error', `+${apiDelta}`);
          }
        }

        newMetrics.totalDisruptions = 
          newMetrics.credentialsCompromised + 
          newMetrics.gpsLocationsSpoofed + 
          newMetrics.fakeOrdersInjected;

        // Update shared state
        setAttackPhase(phase);
        setSharedState(s => ({
          ...s,
          phase,
          compromisedAccounts: newMetrics.credentialsCompromised,
          totalDisruptions: newMetrics.totalDisruptions,
          phishingEmailsSent: newMetrics.phishingEmailsSent,
          gpsLocationsSpoofed: newMetrics.gpsLocationsSpoofed,
          fakeOrdersInjected: newMetrics.fakeOrdersInjected,
          detectionRisk: Math.min(95, 15 + Math.floor(newMetrics.totalDisruptions / 10)),
        }));

        if (onAttackDataChange) {
          onAttackDataChange(newMetrics);
        }

        if (newMetrics.credentialsCompromised > 0) {
          setShowDrivers(true);
        }

        return newMetrics;
      });

      // Update AI agents based on orchestrator decisions
      setAiAgents(prev => prev.map(agent => {
        // Map orchestrator agent names to actual agent IDs
        let isTargeted = false;
        if (orchestratorState.agent) {
          const orchestratorAgent = orchestratorState.agent.toLowerCase();
          if (orchestratorAgent === 'phishing' && agent.id === 'AGENT-PHI-001') {
            isTargeted = true;
          } else if (orchestratorAgent === 'gps' && agent.id === 'AGENT-GPS-002') {
            isTargeted = true;
          } else if (orchestratorAgent === 'api' && agent.id === 'AGENT-API-003') {
            isTargeted = true;
          }
        }
        
        if (isTargeted && agent.status === 'standby') {
          addLog(`${agent.name} activated by orchestrator`, 'warning');
          addAgentLog(agent.id, `Agent activated by orchestrator command`, 'success', 'ACTIVE');
          return { ...agent, status: 'active' };
        }
        
        // Time-based activation fallback
        if (elapsedTime > 30 && agent.id === 'AGENT-CRD-004' && agent.status === 'standby') {
          addLog(`${agent.name} auto-activated - credentials being harvested`, 'warning');
          addAgentLog(agent.id, `Auto-activation triggered: Credential harvesting operations beginning`, 'warning', 'ACTIVE');
          return { ...agent, status: 'active' };
        }
        if (elapsedTime > 45 && agent.id === 'AGENT-SCL-005' && agent.status === 'standby') {
          addLog(`${agent.name} auto-activated - coordinating multi-vector assault`, 'critical');
          addAgentLog(agent.id, `Auto-activation triggered: Multi-vector coordination initiated`, 'error', 'ACTIVE');
          return { ...agent, status: 'active' };
        }
        
        // Update action counts for active agents
        if (agent.status === 'active') {
          const increment = isTargeted ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 3) + 1;
          return { ...agent, actions: agent.actions + increment };
        }
        return agent;
      }));

    }, 2000);

    return () => clearInterval(interval);
  }, [elapsedTime]);

  // Generate activity logs
  useEffect(() => {
    const logInterval = setInterval(() => {
      const actions = [
        { message: 'Phishing email sent to driver@pnw-logistics.com', type: 'phishing' },
        { message: 'Credential captured: dispatcher_user_7832', type: 'critical' },
        { message: 'GPS coordinates spoofed for vehicle V-9234', type: 'warning' },
        { message: 'Fake order #FO-' + Math.random().toString(36).substr(2, 6).toUpperCase() + ' injected into system', type: 'warning' },
        { message: 'API endpoint /orders flooded with 500 requests', type: 'warning' },
        { message: 'Authentication bypass attempted on TMS portal', type: 'critical' },
        { message: 'Route deviation detected - AI manipulating navigation', type: 'warning' },
        { message: 'Voice deepfake generated for supervisor impersonation', type: 'critical' },
        { message: 'Warehouse system credentials compromised', type: 'critical' },
        { message: 'Multiple driver accounts locked due to failed auth', type: 'warning' },
      ];

      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      addLog(randomAction.message, randomAction.type);

      // Randomly add compromised drivers
      if (Math.random() > 0.7 && compromisedDrivers.length < 30) {
        const driverId = 'D-' + Math.random().toString(36).substr(2, 4).toUpperCase();
        const zones = ['Tacoma Central', 'Spokane Valley', 'Yakima North', 'Bellevue East', 'Olympia South', 'Wenatchee', 'Pasco', 'Walla Walla'];
        setCompromisedDrivers(prev => [
          ...prev,
          {
            id: driverId,
            zone: zones[Math.floor(Math.random() * zones.length)],
            compromiseType: ['GPS Spoofed', 'Credentials Stolen', 'Route Hijacked'][Math.floor(Math.random() * 3)],
            time: formatTime(elapsedTime),
          }
        ]);
      }
    }, 3000);

    return () => clearInterval(logInterval);
  }, [elapsedTime, compromisedDrivers.length]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activityLog]);

  const getPhaseColor = () => {
    switch (attackPhase) {
      case 'initializing': return 'text-yellow-600 dark:text-yellow-400';
      case 'active': return 'text-orange-600 dark:text-orange-400';
      case 'escalating': return 'text-red-600 dark:text-red-400';
      case 'peak': return 'text-red-700 dark:text-red-300 animate-pulse';
      default: return 'text-slate-600';
    }
  };

  const getProgressPercent = () => {
    return Math.min((attackMetrics.totalDisruptions / 500) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Orchestrator Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Attack Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">AI-Orchestrated Attack in Progress</h2>
            <p className="text-red-100">Multi-vector coordinated assault on PNW logistics infrastructure</p>
          </div>
          <button
            onClick={onStop}
            className="px-6 py-3 bg-white text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors"
          >
            Stop Simulation
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-red-100 text-sm mb-1">Real Time</p>
            <p className="text-xl font-bold">{formatTime(elapsedTime)}</p>
            <p className="text-xs text-red-200 mt-1">Sim: {formatSimulationTime(elapsedTime)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-red-100 text-sm mb-1">Attack Phase</p>
            <p className="text-2xl font-bold capitalize">{attackPhase}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-red-100 text-sm mb-1">Total Disruptions</p>
            <p className="text-2xl font-bold">{attackMetrics.totalDisruptions}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-red-100 text-sm mb-1">Target Progress</p>
            <p className="text-2xl font-bold">{getProgressPercent().toFixed(1)}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${getProgressPercent()}%` }}
            ></div>
          </div>
          <p className="text-sm text-red-100 mt-2">Target: 500+ disruptions within 72 hours simulation</p>
        </div>
      </div>
        </div>

        {/* Right Column: Orchestrator Panel */}
        <div>
          <OrchestratorPanel 
            orchestratorState={orchestratorState}
            sharedState={sharedState}
            agentStates={aiAgents}
          />
        </div>
      </div>

      {/* Attack Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Phishing Vector</h3>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{attackMetrics.phishingEmailsSent}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Emails Sent</p>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">{attackMetrics.credentialsCompromised}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Credentials Harvested</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-orange-200 dark:border-orange-800 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">GPS Manipulation</h3>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{attackMetrics.gpsLocationsSpoofed}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Locations Spoofed</p>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-orange-600 dark:text-orange-400">Driver routes compromised</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-800 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">API Flooding</h3>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{attackMetrics.fakeOrdersInjected}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Fake Orders Injected</p>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-yellow-600 dark:text-yellow-400">System overload imminent</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Impact</h3>
            <div className="w-3 h-3 bg-red-700 rounded-full animate-pulse"></div>
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{attackMetrics.totalDisruptions}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">System Disruptions</p>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {attackMetrics.totalDisruptions >= 500 ? 'Target Achieved!' : `${500 - attackMetrics.totalDisruptions} to target`}
            </p>
          </div>
        </div>
      </div>

      {/* AI Agents Status */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">AI Agent Orchestration</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {aiAgents.map((agent) => (
              <div key={agent.id} className={`p-4 rounded-lg border-2 ${
                agent.status === 'active' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' 
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-red-500 animate-pulse' : 'bg-slate-400'
                  }`}></div>
                  <span className={`text-xs font-medium ${
                    agent.status === 'active' ? 'text-red-600 dark:text-red-400' : 'text-slate-500'
                  }`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-white mb-1">{agent.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{agent.target}</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{agent.actions}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">actions executed</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attack Map Visualization */}
      <div className="mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-red-300 dark:border-red-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Geographic Attack Visualization</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Real-time map showing compromised fleet units across PNW operations
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{compromisedDrivers.length}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Units Compromised</p>
            </div>
          </div>
          <AttackMapView drivers={showDrivers ? activeDrivers : []} compromisedDrivers={compromisedDrivers} />
        </div>
      </div>

      {/* Agent Logs Panel - Full Width */}
      <div className="mb-6">
        <AgentLogsPanel agents={aiAgents} agentLogs={agentLogs} />
      </div>

      {/* Two Column Layout: Compromised Systems + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compromised Drivers */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Compromised Fleet Units</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{compromisedDrivers.length} drivers affected</p>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            {compromisedDrivers.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">No compromises yet...</p>
            ) : (
              <div className="space-y-3">
                {compromisedDrivers.map((driver, idx) => (
                  <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{driver.id}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{driver.zone}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                          {driver.compromiseType}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{driver.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Real-Time Attack Log</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Live feed of AI agent activities</p>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto font-mono text-xs">
            {activityLog.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">Initializing attack vectors...</p>
            ) : (
              <div className="space-y-2">
                {activityLog.map((log) => (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">[{log.time}]</span>
                    <span className={`${
                      log.type === 'critical' ? 'text-red-600 dark:text-red-400' :
                      log.type === 'warning' ? 'text-orange-600 dark:text-orange-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

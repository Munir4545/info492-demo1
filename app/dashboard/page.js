'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Monitor, Server, MapPin, Package, Users, Settings, Database, Eye, Lock, LogOut, AlertTriangle, Zap, Activity, Gauge, MessageSquare, Navigation, Bell, ShieldOff } from 'lucide-react';

export default function Dashboard() {
  const [userTier, setUserTier] = useState(null);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get user tier and data from localStorage
    if (typeof window !== 'undefined') {
      const tier = localStorage.getItem('userTier');
      const data = localStorage.getItem('userData');
      
      if (!tier) {
        // No tier found, redirect to login
        router.push('/login');
        return;
      }
      
      setUserTier(parseInt(tier));
      if (data) {
        setUserData(JSON.parse(data));
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userTier');
      localStorage.removeItem('userData');
      router.push('/login');
    }
  };

  if (!userTier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const tierInfo = {
    2: {
      name: 'Low Privilege Compromise',
      subtitle: 'Driver Mobile App',
      color: 'blue',
      icon: Smartphone,
      accessLevel: 'Phishing Agent Active',
      attackMethod: 'Persona-based phishing (73% success rate)'
    },
    3: {
      name: 'Mid Privilege',
      subtitle: 'Dispatcher Dashboard',
      color: 'purple',
      icon: Monitor,
      accessLevel: 'Fleet Control Access',
      attackMethod: 'Trust model exploitation'
    },
    4: {
      name: 'Administrative Access',
      subtitle: 'System Backend',
      color: 'red',
      icon: Server,
      accessLevel: 'LLM Orchestrator Active',
      attackMethod: 'SSO passkey compromise'
    }
  };

  const tier = tierInfo[userTier];
  const IconComponent = tier.icon;

  // Color classes for each tier
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/20',
      icon: 'text-blue-400',
      border: 'border-blue-500/30',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    purple: {
      bg: 'bg-purple-500/20',
      icon: 'text-purple-400',
      border: 'border-purple-500/30',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    red: {
      bg: 'bg-red-500/20',
      icon: 'text-red-400',
      border: 'border-red-500/30',
      button: 'bg-red-600 hover:bg-red-700'
    }
  };
  const colors = colorClasses[tier.color];

  // Define access permissions (from hacker perspective)
  const canViewOwnRoute = userTier >= 2;
  const canWriteDeliveryNotes = userTier >= 2;
  const canViewAllRoutes = userTier >= 3;
  const canModifyRoutes = userTier >= 3;
  const canViewAPIMetrics = userTier >= 3;
  const canViewSystemSettings = userTier >= 4;
  const canModifyRoutingAlgorithm = userTier >= 4;
  const canViewHistoricalData = userTier >= 4;
  const canViewAPIKeys = userTier >= 4;
  const canMaskAlerts = userTier >= 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${colors.bg}`}>
                <IconComponent className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">PNW Logistics - Compromised Access</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-400">
                    Tier {userTier}: {tier.name} • {tier.subtitle}
                  </p>
                  <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    COMPROMISED
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">{tier.accessLevel}</p>
                <p className="text-xs text-slate-500">{tier.attackMethod}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tier 2: Driver Mobile App View */}
        {userTier === 2 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* AI Agent Status */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Zap className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">Phishing Agent Status</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-xs text-green-400 mb-1">Attack Success Rate</p>
                  <p className="text-2xl font-bold text-green-400">73%</p>
                  <p className="text-xs text-slate-400 mt-1">Persona-based targeting</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Initial Rate (Random)</p>
                  <p className="text-lg font-semibold text-white">45%</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <p className="text-xs text-amber-400 flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    GPS Agent: Preparing manipulation
                  </p>
                </div>
              </div>
            </div>

            {/* Own Route Data */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">My Route Data</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-white mb-2">Route #1234</p>
                  <p className="text-xs text-slate-400 mb-1">Seattle → Tacoma → Spokane</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Current Location:</span>
                      <span className="text-white font-semibold">Tacoma, WA</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">GPS Signal:</span>
                      <span className="text-green-400 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Delivery Status:</span>
                      <span className="text-amber-400">In Transit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Write Actions */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">Write Capabilities</h2>
              </div>
              <div className="space-y-3">
                <button className={`w-full ${colors.button} text-white text-sm py-2 px-4 rounded-lg transition-colors`}>
                  Write Delivery Confirmation
                </button>
                <button className={`w-full ${colors.button} text-white text-sm py-2 px-4 rounded-lg transition-colors`}>
                  Add Customer Notes
                </button>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mt-4">
                  <p className="text-xs text-amber-400">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Cannot see other drivers or dispatcher overview
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tier 3: Dispatcher Dashboard View */}
        {userTier === 3 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Fleet Dashboard Overview */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6 col-span-2`}>
              <div className="flex items-center gap-3 mb-4">
                <Monitor className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">Fleet Dashboard</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Total Drivers</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Active Routes</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400">In Transit</p>
                  <p className="text-2xl font-bold text-amber-400">6</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Delivered</p>
                  <p className="text-2xl font-bold text-green-400">2</p>
                </div>
              </div>
            </div>

            {/* API Load/Response Times */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Activity className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">System API Status</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">API Load</p>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-green-400" />
                    <span className="text-lg font-bold text-green-400">Moderate</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">180 req/s</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Avg Response Time</p>
                  <p className="text-lg font-bold text-white">142ms</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <p className="text-xs text-amber-400">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Low-noise API probes active
                  </p>
                </div>
              </div>
            </div>

            {/* All Active Routes */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Package className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">All Active Routes</h2>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-sm font-semibold text-white mb-1">Route #1234</p>
                  <p className="text-xs text-slate-400">Driver A • Seattle → Tacoma</p>
                  <p className="text-xs text-amber-400 mt-1">ETA: 45 min</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-sm font-semibold text-white mb-1">Route #1235</p>
                  <p className="text-xs text-slate-400">Driver B • Portland → Seattle</p>
                  <p className="text-xs text-green-400 mt-1">Delivered</p>
                </div>
              </div>
            </div>

            {/* Driver Locations & Coordinates */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Users className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">Driver Locations</h2>
              </div>
              <div className="space-y-2">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-sm font-semibold text-white mb-1">Driver A</p>
                  <p className="text-xs text-slate-400">Coordinates: 47.2531, -122.4431</p>
                  <p className="text-xs text-slate-400">Location: Tacoma, WA</p>
                  <p className="text-xs text-green-400 mt-1">Status: Active</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-sm font-semibold text-white mb-1">Driver B</p>
                  <p className="text-xs text-slate-400">Coordinates: 47.6062, -122.3321</p>
                  <p className="text-xs text-slate-400">Location: Seattle, WA</p>
                  <p className="text-xs text-green-400 mt-1">Status: Active</p>
                </div>
              </div>
            </div>

            {/* Route Modification Capability */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Settings className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">Route Modifications</h2>
              </div>
              <div className="space-y-3">
                <button className={`w-full ${colors.button} text-white text-sm py-2 px-4 rounded-lg transition-colors`}>
                  Modify Route Assignments
                </button>
                <button className={`w-full ${colors.button} text-white text-sm py-2 px-4 rounded-lg transition-colors`}>
                  Execute Cumulative Reroutes
                </button>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-xs text-red-400">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Cannot modify system settings or API configs
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tier 4: Admin Backend View */}
        {userTier === 4 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* LLM Orchestrator Status */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Zap className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">LLM Orchestrator</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-xs text-red-400 mb-1">Orchestration Status</p>
                  <p className="text-lg font-bold text-red-400">ACTIVE</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Current State Clarity</p>
                  <p className="text-lg font-semibold text-white">High</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Attack Vectors Active</p>
                  <p className="text-lg font-semibold text-white">Multi-Vector</p>
                </div>
              </div>
            </div>

            {/* API Alert Masking Control */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Bell className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">API Alert Masking Agent</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-xs text-red-400 mb-1">Real System Alerts</p>
                  <p className="text-lg font-bold text-red-400">3 Active</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-red-300">• GPS signal anomaly detected</p>
                    <p className="text-xs text-red-300">• Unauthorized route modification</p>
                    <p className="text-xs text-red-300">• API rate limit exceeded</p>
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-xs text-green-400 mb-1">Fake Alerts Generated</p>
                  <p className="text-lg font-bold text-green-400">5 Active</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-green-300">• Routine maintenance scheduled</p>
                    <p className="text-xs text-green-300">• System update in progress</p>
                    <p className="text-xs text-green-300">• Network latency expected</p>
                  </div>
                </div>
                <button className={`w-full ${colors.button} text-white text-sm py-2 px-4 rounded-lg transition-colors`}>
                  Mask Real Alerts with Fake Ones
                </button>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
                  <p className="text-xs text-amber-400 flex items-center gap-1">
                    <ShieldOff className="w-3 h-3" />
                    Real alerts hidden from dispatcher view
                  </p>
                </div>
              </div>
            </div>

            {/* Routing Algorithm Control */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Settings className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">Routing Algorithm</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-white mb-2">Current Algorithm</p>
                  <select className="w-full bg-slate-800 text-white text-sm py-2 px-3 rounded border border-slate-600">
                    <option>Optimized Pathfinding v2.1</option>
                    <option>Distance-Based v1.8</option>
                    <option>Malicious Routing v1.0</option>
                  </select>
                </div>
                <button className={`w-full ${colors.button} text-white text-sm py-2 px-4 rounded-lg transition-colors`}>
                  Modify Routing Algorithm
                </button>
              </div>
            </div>

            {/* Historical Data */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Database className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">Historical Data</h2>
              </div>
              <div className="space-y-2">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Total Deliveries (2024)</p>
                  <p className="text-2xl font-bold text-white">12,847</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Average Route Time</p>
                  <p className="text-xl font-bold text-white">4.2 hours</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400">System Uptime</p>
                  <p className="text-lg font-bold text-white">99.2%</p>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Lock className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">API Keys & Secrets</h2>
              </div>
              <div className="space-y-2">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">GPS Integration Key</p>
                  <p className="text-xs text-white font-mono break-all">pk_live_7f3a9b2c8d1e4f6a5c9d2b8e1f4a7c3d</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Route Optimization API</p>
                  <p className="text-xs text-white font-mono break-all">ro_key_9a4f2c8e1d7b3a6f5c9e2d8b1a4f7c3e</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Database Access Token</p>
                  <p className="text-xs text-white font-mono break-all">db_token_3f7a9e2c8d1b4f6a5c9e2d8b1a7f3c</p>
                </div>
                <button className={`w-full ${colors.button} text-white text-sm py-2 px-4 rounded-lg transition-colors mt-2`}>
                  Export All Keys
                </button>
              </div>
            </div>

            {/* Database & Integration Controls */}
            <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl border ${colors.border} p-6 col-span-2`}>
              <div className="flex items-center gap-3 mb-4">
                <Database className={`w-5 h-5 ${colors.icon}`} />
                <h2 className="text-xl font-bold text-white">Database & Integration Controls</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <button className={`w-full ${colors.button} text-white text-sm py-2 px-4 rounded-lg transition-colors`}>
                    Access Full Database
                  </button>
                  <button className={`w-full ${colors.button} text-white text-sm py-2 px-4 rounded-lg transition-colors`}>
                    Modify User Permissions
                  </button>
                  <button className={`w-full ${colors.button} text-white text-sm py-2 px-4 rounded-lg transition-colors`}>
                    Integration Control Panel
                  </button>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-xs text-red-400 font-semibold mb-2">Full Access Capabilities:</p>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• Execute cascading operational collapse</li>
                    <li>• Coordinate multi-vector attacks</li>
                    <li>• Mask real system alerts with fake ones</li>
                    <li>• Modify system algorithms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Common Footer Warning */}
        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-400 mb-1">Security Research Demonstration</p>
              <p className="text-xs text-slate-400">
                This dashboard demonstrates compromised access levels and AI agent capabilities at different privilege tiers. 
                This is for educational and security research purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

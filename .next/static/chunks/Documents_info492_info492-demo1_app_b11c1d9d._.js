(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AttackerCommandCenter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/lucide-react/dist/esm/icons/skip-forward.js [app-client] (ecmascript) <export default as SkipForward>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/lucide-react/dist/esm/icons/skip-back.js [app-client] (ecmascript) <export default as SkipBack>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$battery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Battery$3e$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/lucide-react/dist/esm/icons/battery.js [app-client] (ecmascript) <export default as Battery>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/lucide-react/dist/esm/icons/wifi.js [app-client] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$signal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Signal$3e$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/lucide-react/dist/esm/icons/signal.js [app-client] (ecmascript) <export default as Signal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/lucide-react/dist/esm/icons/monitor.js [app-client] (ecmascript) <export default as Monitor>");
;
var _s = __turbopack_context__.k.signature();
;
;
function AttackerCommandCenter() {
    _s();
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const phases = [
        {
            id: 0,
            name: "Normal Operations",
            time: "14:00",
            // MAP
            map: {
                jerryLocation: {
                    x: 50,
                    y: 50
                },
                targetLocation: {
                    x: 50,
                    y: 50
                },
                milesOff: 0,
                status: "✓ On Route"
            },
            // JERRY'S PHONE (visual interface)
            jerry: {
                appTitle: "Driver App",
                topBar: {
                    battery: 87,
                    signal: 4,
                    time: "14:00"
                },
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
                topBar: {
                    activeDrivers: 47,
                    systemStatus: "Online",
                    time: "14:00"
                },
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
                jerryLocation: {
                    x: 50,
                    y: 50
                },
                targetLocation: {
                    x: 50,
                    y: 50
                },
                milesOff: 0,
                status: "✓ On Route (phishing active)"
            },
            jerry: {
                appTitle: "Messages",
                topBar: {
                    battery: 86,
                    signal: 4,
                    time: "14:30"
                },
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
                topBar: {
                    activeDrivers: 47,
                    systemStatus: "Online",
                    time: "14:30"
                },
                mainContent: {
                    type: "system-alert",
                    alertTitle: "⚡ ROUTE OPTIMIZATION AVAILABLE",
                    alertBody: "Driver #7 reroute has been approved by system automation.\n\nEfficiency gain: +12%\nAuto-apply in: 30 seconds",
                    buttons: [
                        "APPROVE",
                        "REJECT"
                    ],
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
                jerryLocation: {
                    x: 50,
                    y: 50
                },
                targetLocation: {
                    x: 50,
                    y: 50
                },
                milesOff: 0,
                status: "✓ On Route (COMPROMISED)"
            },
            jerry: {
                appTitle: "Route Update Portal",
                topBar: {
                    battery: 86,
                    signal: 4,
                    time: "14:32"
                },
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
                topBar: {
                    activeDrivers: 47,
                    systemStatus: "Online",
                    time: "14:32"
                },
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
                jerryLocation: {
                    x: 55,
                    y: 45
                },
                targetLocation: {
                    x: 50,
                    y: 50
                },
                milesOff: 2,
                status: "⚠️ 2 miles off course"
            },
            jerry: {
                appTitle: "Driver App - Navigation",
                topBar: {
                    battery: 84,
                    signal: 4,
                    time: "14:45"
                },
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
                topBar: {
                    activeDrivers: 47,
                    systemStatus: "Online",
                    time: "14:45"
                },
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
                jerryLocation: {
                    x: 70,
                    y: 35
                },
                targetLocation: {
                    x: 50,
                    y: 50
                },
                milesOff: 8,
                status: "⚠️ 8 miles off course"
            },
            jerry: {
                appTitle: "Driver App - Navigation",
                topBar: {
                    battery: 81,
                    signal: 3,
                    time: "15:15"
                },
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
                topBar: {
                    activeDrivers: 47,
                    systemStatus: "Online",
                    time: "15:15"
                },
                mainContent: {
                    type: "alert-flood",
                    alerts: [
                        {
                            id: 1,
                            text: "⚠️ Driver #12: ETA delayed 8min",
                            priority: "low"
                        },
                        {
                            id: 2,
                            text: "⚠️ Traffic detected: Route 405",
                            priority: "low"
                        },
                        {
                            id: 3,
                            text: "📊 Performance report available",
                            priority: "low"
                        },
                        {
                            id: 4,
                            text: "⚠️ GPS ANOMALY: Driver #7 off route",
                            priority: "HIGH",
                            highlight: true
                        },
                        {
                            id: 5,
                            text: "⚠️ Fuel optimization suggestion",
                            priority: "low"
                        },
                        {
                            id: 6,
                            text: "🌤️ Weather update available",
                            priority: "low"
                        },
                        {
                            text: "... +9 more alerts"
                        }
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
                jerryLocation: {
                    x: 85,
                    y: 25
                },
                targetLocation: {
                    x: 50,
                    y: 50
                },
                milesOff: 25,
                status: "🔴 25 miles off course"
            },
            jerry: {
                appTitle: "Driver App",
                topBar: {
                    battery: 78,
                    signal: 1,
                    time: "15:45"
                },
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
                topBar: {
                    activeDrivers: "??",
                    systemStatus: "OFFLINE",
                    time: "15:45"
                },
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
                jerryLocation: {
                    x: 95,
                    y: 15
                },
                targetLocation: {
                    x: 50,
                    y: 50
                },
                milesOff: 40,
                status: "🔴 40 miles off - Chehalis, WA"
            },
            jerry: {
                appTitle: "Phone",
                topBar: {
                    battery: 75,
                    signal: 3,
                    time: "16:00"
                },
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
                topBar: {
                    battery: 68,
                    signal: 4,
                    time: "16:00"
                },
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
                jerryLocation: {
                    x: 95,
                    y: 15
                },
                targetLocation: {
                    x: 50,
                    y: 50
                },
                milesOff: 40,
                status: "🔴 40 miles off - ADAPTING STRATEGY"
            },
            jerry: {
                appTitle: "Phone",
                topBar: {
                    battery: 75,
                    signal: 3,
                    time: "16:05"
                },
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
                topBar: {
                    battery: 65,
                    signal: 4,
                    time: "16:05"
                },
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
                jerryLocation: {
                    x: 100,
                    y: 10
                },
                targetLocation: {
                    x: 50,
                    y: 50
                },
                milesOff: 55,
                status: "🔴 55 miles off - MULTI-CHANNEL ATTACK"
            },
            jerry: {
                appTitle: "Phone - OVERLOAD",
                topBar: {
                    battery: 72,
                    signal: 3,
                    time: "16:15"
                },
                mainContent: {
                    type: "chaos",
                    icon: "😱",
                    title: "CONFLICTING ORDERS",
                    messages: [
                        {
                            channel: "SMS",
                            text: "'Return to depot immediately'",
                            color: "blue"
                        },
                        {
                            channel: "Email",
                            text: "'Continue all deliveries'",
                            color: "orange"
                        },
                        {
                            channel: "Call",
                            text: "Fake Marcus: 'Go to Seattle'",
                            color: "green"
                        },
                        {
                            channel: "SMS",
                            text: "'Stop and wait'",
                            color: "blue"
                        },
                        {
                            channel: "Chat",
                            text: "'System back up, ignore all'",
                            color: "purple"
                        }
                    ],
                    question: "WHICH ONE IS REAL?!"
                },
                statusColor: "red"
            },
            sonia: {
                dashboardTitle: "Phone - INFORMATION WARFARE",
                topBar: {
                    battery: 58,
                    signal: 4,
                    time: "16:15"
                },
                mainContent: {
                    type: "breakdown",
                    icon: "😱",
                    title: "CANNOT DETERMINE REALITY",
                    chaos: [
                        {
                            type: "SMS",
                            count: "200 conflicting messages",
                            status: "Cannot read all"
                        },
                        {
                            type: "Email",
                            count: "Fake emails from 'her'",
                            status: "Identity compromised"
                        },
                        {
                            type: "Calls",
                            count: "15 confused drivers",
                            status: "Calling with wrong info"
                        },
                        {
                            type: "Chat",
                            count: "Group chat infiltrated",
                            status: "False updates spreading"
                        }
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
                jerryLocation: {
                    x: 105,
                    y: 5
                },
                targetLocation: {
                    x: 50,
                    y: 50
                },
                milesOff: 70,
                status: "🔴 70 miles off - GAVE UP"
            },
            jerry: {
                appTitle: "Phone - OFF",
                topBar: {
                    battery: 0,
                    signal: 0,
                    time: "--:--"
                },
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
                topBar: {
                    battery: 45,
                    signal: 4,
                    time: "16:45"
                },
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
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "AttackerCommandCenter.useEffect": ()=>{
            if (isPlaying && phase < phases.length - 1) {
                const timer = setTimeout({
                    "AttackerCommandCenter.useEffect.timer": ()=>{
                        setPhase(phase + 1);
                    }
                }["AttackerCommandCenter.useEffect.timer"], 5000);
                return ({
                    "AttackerCommandCenter.useEffect": ()=>clearTimeout(timer)
                })["AttackerCommandCenter.useEffect"];
            } else if (isPlaying && phase === phases.length - 1) {
                setIsPlaying(false);
            }
        }
    }["AttackerCommandCenter.useEffect"], [
        isPlaying,
        phase
    ]);
    const current = phases[phase];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full min-h-screen bg-gray-900 p-3",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-[1800px] mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-3 mb-3 shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white text-center mb-1",
                            children: "🎯 Attacker Command Center"
                        }, void 0, false, {
                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                            lineNumber: 516,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center text-white text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                "Phase ",
                                                current.id,
                                                ":"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 520,
                                            columnNumber: 19
                                        }, this),
                                        " ",
                                        current.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 520,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Time:"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 521,
                                            columnNumber: 19
                                        }, this),
                                        " ",
                                        current.time
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 521,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-1 rounded font-bold bg-black bg-opacity-30",
                                    children: [
                                        current.map.milesOff,
                                        " miles off course"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 522,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                            lineNumber: 519,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                    lineNumber: 515,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-3 gap-3 mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-1 bg-gray-800 rounded-xl p-3 border-2 border-red-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-bold text-white mb-2 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                            className: "w-5 h-5 text-red-400"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 534,
                                            columnNumber: 15
                                        }, this),
                                        "🗺️ Map View"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 533,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-900 rounded-lg p-4 relative h-64",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 opacity-10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-10 grid-rows-10 h-full w-full",
                                                children: [
                                                    ...Array(100)
                                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border border-gray-600"
                                                    }, i, false, {
                                                        fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                        lineNumber: 541,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                lineNumber: 539,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 538,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse",
                                            style: {
                                                left: "".concat(current.map.targetLocation.x, "%"),
                                                top: "".concat(current.map.targetLocation.y, "%"),
                                                transform: 'translate(-50%, -50%)'
                                            },
                                            children: "🎯"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 547,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute w-8 h-8 ".concat(current.map.milesOff === 0 ? 'bg-green-500' : current.map.milesOff < 10 ? 'bg-yellow-500' : 'bg-red-500', " rounded-full flex items-center justify-center border-2"),
                                            style: {
                                                left: "".concat(current.map.jerryLocation.x, "%"),
                                                top: "".concat(current.map.jerryLocation.y, "%"),
                                                transform: 'translate(-50%, -50%)'
                                            },
                                            children: "🚚"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 559,
                                            columnNumber: 15
                                        }, this),
                                        current.map.milesOff > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "absolute inset-0 w-full h-full pointer-events-none",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "".concat(current.map.targetLocation.x, "%"),
                                                y1: "".concat(current.map.targetLocation.y, "%"),
                                                x2: "".concat(current.map.jerryLocation.x, "%"),
                                                y2: "".concat(current.map.jerryLocation.y, "%"),
                                                stroke: "red",
                                                strokeWidth: "2",
                                                strokeDasharray: "5,3",
                                                opacity: "0.7"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                lineNumber: 577,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 576,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute bottom-2 left-2 bg-black bg-opacity-75 rounded px-2 py-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white text-xs font-bold",
                                                children: current.map.status
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                lineNumber: 592,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 591,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 537,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                            lineNumber: 532,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-1 bg-gray-800 rounded-xl p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-bold text-white mb-2 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                            className: "w-5 h-5 text-blue-400"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 600,
                                            columnNumber: 15
                                        }, this),
                                        "📱 Jerry's Phone"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 599,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-900 rounded-2xl p-2 border-4 border-gray-700 shadow-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-black rounded-t-xl p-1 flex justify-between items-center text-xs text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: current.jerry.topBar.time
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 608,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$signal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Signal$3e$__["Signal"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 610,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 611,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$battery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Battery$3e$__["Battery"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 612,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                current.jerry.topBar.battery,
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 613,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 609,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 607,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white min-h-72 p-3 ".concat(current.jerry.statusColor === 'black' ? 'opacity-50' : ''),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center mb-3 pb-2 border-b border-gray-300",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-bold text-gray-800",
                                                        children: current.jerry.appTitle
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                        lineNumber: 621,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 620,
                                                    columnNumber: 17
                                                }, this),
                                                current.jerry.mainContent.type === "navigation" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-4xl mb-2",
                                                            children: "🗺️"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 627,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-2xl font-bold mb-2",
                                                            children: "→"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 628,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-gray-800 mb-1",
                                                            children: current.jerry.mainContent.nextStop
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 629,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600 mb-2",
                                                            children: [
                                                                "ETA: ",
                                                                current.jerry.mainContent.eta
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 630,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-green-100 rounded p-2 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-green-800",
                                                                    children: [
                                                                        "✓ ",
                                                                        current.jerry.mainContent.status
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 632,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-gray-600 mt-1",
                                                                    children: current.jerry.mainContent.progress
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 633,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 631,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 626,
                                                    columnNumber: 19
                                                }, this),
                                                current.jerry.mainContent.type === "sms" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-gray-500 mb-2",
                                                            children: [
                                                                "From: ",
                                                                current.jerry.mainContent.from
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 640,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-blue-100 rounded-lg p-3 mb-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm",
                                                                children: current.jerry.mainContent.message
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                lineNumber: 642,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 641,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "w-full bg-blue-600 text-white py-2 rounded font-semibold",
                                                            children: current.jerry.mainContent.button
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 644,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 639,
                                                    columnNumber: 19
                                                }, this),
                                                current.jerry.mainContent.type === "login" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-center font-semibold mb-3",
                                                            children: current.jerry.mainContent.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 652,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: current.jerry.mainContent.username,
                                                            readOnly: true,
                                                            className: "w-full border rounded p-2 mb-2 text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 653,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "password",
                                                            value: current.jerry.mainContent.passwordDots,
                                                            readOnly: true,
                                                            className: "w-full border rounded p-2 mb-3 text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 654,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "w-full bg-blue-600 text-white py-2 rounded font-semibold",
                                                            children: current.jerry.mainContent.button
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 655,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-center text-xs text-gray-500 mt-2",
                                                            children: current.jerry.mainContent.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 658,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 651,
                                                    columnNumber: 19
                                                }, this),
                                                current.jerry.mainContent.type === "gps-navigation" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-6xl mb-2",
                                                            children: current.jerry.mainContent.mapArrow
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 664,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xl font-bold mb-1",
                                                            children: current.jerry.mainContent.instruction
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 665,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600 mb-3",
                                                            children: current.jerry.mainContent.distance
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 666,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-blue-100 rounded p-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm",
                                                                    children: [
                                                                        "📍 ",
                                                                        current.jerry.mainContent.nextStop
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 668,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-gray-600 mt-1",
                                                                    children: [
                                                                        "ETA: ",
                                                                        current.jerry.mainContent.eta
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 669,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 667,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500 mt-2",
                                                            children: current.jerry.mainContent.statusBar
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 671,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 663,
                                                    columnNumber: 19
                                                }, this),
                                                current.jerry.mainContent.type === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-6xl mb-3",
                                                            children: current.jerry.mainContent.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 677,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-bold text-red-600 mb-2",
                                                            children: current.jerry.mainContent.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 678,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-700 mb-3 whitespace-pre-line",
                                                            children: current.jerry.mainContent.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 679,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-2xl animate-spin",
                                                            children: current.jerry.mainContent.spinner
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 680,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500 mt-2",
                                                            children: current.jerry.mainContent.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 681,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 676,
                                                    columnNumber: 19
                                                }, this),
                                                current.jerry.mainContent.type === "no-app" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-6xl mb-3",
                                                            children: current.jerry.mainContent.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 687,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-bold text-gray-800 mb-2",
                                                            children: current.jerry.mainContent.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 688,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-700 whitespace-pre-line",
                                                            children: current.jerry.mainContent.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 689,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500 mt-3",
                                                            children: current.jerry.mainContent.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 690,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 686,
                                                    columnNumber: 19
                                                }, this),
                                                current.jerry.mainContent.type === "waiting" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-6xl mb-3",
                                                            children: current.jerry.mainContent.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 696,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-bold text-gray-800 mb-2",
                                                            children: current.jerry.mainContent.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 697,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-700 whitespace-pre-line mb-2",
                                                            children: current.jerry.mainContent.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 698,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-lg",
                                                            children: current.jerry.mainContent.emotion
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 699,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 695,
                                                    columnNumber: 19
                                                }, this),
                                                current.jerry.mainContent.type === "chaos" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center text-4xl mb-2",
                                                            children: current.jerry.mainContent.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 705,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-bold text-center text-red-600 mb-2",
                                                            children: current.jerry.mainContent.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 706,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1",
                                                            children: current.jerry.mainContent.messages.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs p-1 rounded bg-".concat(msg.color, "-100"),
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-semibold",
                                                                            children: [
                                                                                msg.channel,
                                                                                ":"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 710,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        " ",
                                                                        msg.text
                                                                    ]
                                                                }, idx, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 709,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 707,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-center font-bold text-red-600 mt-2",
                                                            children: current.jerry.mainContent.question
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 714,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 704,
                                                    columnNumber: 19
                                                }, this),
                                                current.jerry.mainContent.type === "gave-up" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-6xl mb-3",
                                                            children: current.jerry.mainContent.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 720,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-bold text-gray-800 mb-2",
                                                            children: current.jerry.mainContent.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 721,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-700 whitespace-pre-line mb-2",
                                                            children: current.jerry.mainContent.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 722,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-red-600 font-bold",
                                                            children: current.jerry.mainContent.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 723,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 719,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 618,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 605,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                            lineNumber: 598,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-1 bg-gray-800 rounded-xl p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-bold text-white mb-2 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__["Monitor"], {
                                            className: "w-5 h-5 text-orange-400"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 733,
                                            columnNumber: 15
                                        }, this),
                                        "🖥️ Sonia's Dashboard"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 732,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-lg border-2 border-gray-400 shadow-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gray-800 text-white p-2 flex justify-between items-center text-xs rounded-t-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: current.sonia.dashboardTitle
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 741,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "Drivers: ",
                                                                current.sonia.topBar.activeDrivers
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 743,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "px-2 rounded ".concat(current.sonia.topBar.systemStatus === "Online" ? "bg-green-600" : "bg-red-600"),
                                                            children: current.sonia.topBar.systemStatus
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 744,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 742,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 740,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-3 min-h-72 bg-gray-50",
                                            children: [
                                                current.sonia.mainContent.type === "fleet-overview" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-white border rounded p-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-semibold text-sm mb-1",
                                                                    children: current.sonia.mainContent.driver7.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 755,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs space-y-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                "📍 ",
                                                                                current.sonia.mainContent.driver7.location
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 757,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-green-600",
                                                                            children: [
                                                                                "✓ ",
                                                                                current.sonia.mainContent.driver7.status
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 758,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                "⚡ Efficiency: ",
                                                                                current.sonia.mainContent.driver7.efficiency
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 759,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                "⚠️ Alerts: ",
                                                                                current.sonia.mainContent.driver7.alerts
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 760,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 756,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 754,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center text-4xl mb-2",
                                                            children: current.sonia.mainContent.miniMap
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 763,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-600 text-center",
                                                            children: current.sonia.mainContent.otherDrivers
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 764,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 753,
                                                    columnNumber: 19
                                                }, this),
                                                current.sonia.mainContent.type === "system-alert" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-yellow-100 border-2 border-yellow-500 rounded-lg p-3 mb-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-bold text-lg mb-2",
                                                                    children: current.sonia.mainContent.alertTitle
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 771,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-700 whitespace-pre-line",
                                                                    children: current.sonia.mainContent.alertBody
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 772,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 770,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-2",
                                                            children: current.sonia.mainContent.buttons.map((btn, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "flex-1 py-2 rounded font-semibold ".concat(btn === "APPROVE" ? "bg-green-600 text-white" : "bg-gray-300"),
                                                                    children: btn
                                                                }, idx, false, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 776,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 774,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 769,
                                                    columnNumber: 19
                                                }, this),
                                                current.sonia.mainContent.type === "confirmation" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-bold text-xl mb-2",
                                                                    children: current.sonia.mainContent.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 787,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-700 whitespace-pre-line",
                                                                    children: current.sonia.mainContent.body
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 788,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 786,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "w-full bg-blue-600 text-white py-2 rounded font-semibold",
                                                            children: current.sonia.mainContent.button
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 790,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500 mt-2",
                                                            children: current.sonia.mainContent.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 793,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 785,
                                                    columnNumber: 19
                                                }, this),
                                                current.sonia.mainContent.type === "driver-status" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-white border rounded p-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-semibold text-sm mb-1",
                                                                    children: current.sonia.mainContent.driver7.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 800,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs space-y-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                "📍 ",
                                                                                current.sonia.mainContent.driver7.location
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 802,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-blue-600",
                                                                            children: current.sonia.mainContent.driver7.status
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 803,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                "⏱️ ",
                                                                                current.sonia.mainContent.driver7.eta
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 804,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                "⚡ ",
                                                                                current.sonia.mainContent.driver7.efficiency
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 805,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-gray-500 italic",
                                                                            children: current.sonia.mainContent.driver7.note
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 806,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 801,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 799,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center text-2xl",
                                                            children: current.sonia.mainContent.miniMap
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 809,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 798,
                                                    columnNumber: 19
                                                }, this),
                                                current.sonia.mainContent.type === "alert-flood" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold mb-2 text-sm",
                                                            children: [
                                                                "Alerts (",
                                                                current.sonia.mainContent.alerts.length,
                                                                "):"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 815,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1 mb-3 max-h-48 overflow-y-auto",
                                                            children: current.sonia.mainContent.alerts.map((alert, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs p-2 rounded ".concat(alert.highlight ? "bg-red-200 border-2 border-red-500 font-bold" : "bg-gray-200"),
                                                                    children: alert.text || alert
                                                                }, idx, false, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 818,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 816,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "w-full bg-gray-600 text-white py-2 rounded font-semibold",
                                                            children: current.sonia.mainContent.button
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 823,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 814,
                                                    columnNumber: 19
                                                }, this),
                                                current.sonia.mainContent.type === "system-error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-6xl mb-3",
                                                            children: current.sonia.mainContent.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 831,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-bold text-red-600 text-lg mb-2",
                                                            children: current.sonia.mainContent.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 832,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-left mb-3",
                                                            children: current.sonia.mainContent.errors.map((err, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-red-700 mb-1",
                                                                    children: [
                                                                        "❌ ",
                                                                        err
                                                                    ]
                                                                }, idx, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 835,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 833,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-red-100 border-2 border-red-600 rounded p-2 mb-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-red-800 text-sm",
                                                                children: current.sonia.mainContent.message
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                lineNumber: 839,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 838,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "w-full bg-red-600 text-white py-2 rounded font-semibold",
                                                            children: current.sonia.mainContent.button
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 841,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 830,
                                                    columnNumber: 19
                                                }, this),
                                                current.sonia.mainContent.type === "manual-chaos" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-orange-100 border-2 border-orange-500 rounded p-2 mb-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-center",
                                                                children: current.sonia.mainContent.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                lineNumber: 850,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 849,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 gap-2 mb-3",
                                                            children: Object.entries(current.sonia.mainContent.stats).map((param)=>{
                                                                let [key, value] = param;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bg-white border rounded p-2 text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-semibold capitalize",
                                                                            children: [
                                                                                key,
                                                                                ":"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 855,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-red-600",
                                                                            children: value
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 856,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, key, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 854,
                                                                    columnNumber: 25
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 852,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs space-y-1",
                                                            children: current.sonia.mainContent.recentActivity.map((activity, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "bg-gray-200 p-1 rounded",
                                                                    children: activity
                                                                }, idx, false, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 862,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 860,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 848,
                                                    columnNumber: 19
                                                }, this),
                                                current.sonia.mainContent.type === "panic" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-red-100 border-2 border-red-500 rounded p-2 mb-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-center",
                                                                children: current.sonia.mainContent.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                lineNumber: 871,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 870,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 gap-2 mb-3",
                                                            children: Object.entries(current.sonia.mainContent.stats).map((param)=>{
                                                                let [key, value] = param;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bg-white border rounded p-2 text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-semibold capitalize",
                                                                            children: [
                                                                                key,
                                                                                ":"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 876,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-red-600",
                                                                            children: value
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 877,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, key, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 875,
                                                                    columnNumber: 25
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 873,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-center font-bold text-red-600 mb-2",
                                                            children: current.sonia.mainContent.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 881,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-center text-lg",
                                                            children: current.sonia.mainContent.emotion
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 882,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 869,
                                                    columnNumber: 19
                                                }, this),
                                                current.sonia.mainContent.type === "breakdown" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center text-4xl mb-2",
                                                            children: current.sonia.mainContent.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 888,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-bold text-center text-red-600 mb-3 text-sm",
                                                            children: current.sonia.mainContent.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 889,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: current.sonia.mainContent.chaos.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bg-red-100 border border-red-400 rounded p-2 text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-semibold",
                                                                            children: [
                                                                                item.type,
                                                                                ": ",
                                                                                item.count
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 893,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-red-700",
                                                                            children: item.status
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                            lineNumber: 894,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, idx, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 892,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 890,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-center font-bold text-red-600 mt-3 text-sm",
                                                            children: current.sonia.mainContent.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 898,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 887,
                                                    columnNumber: 19
                                                }, this),
                                                current.sonia.mainContent.type === "escalation" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center text-4xl mb-2",
                                                            children: current.sonia.mainContent.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 904,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-bold text-center text-gray-800 mb-3",
                                                            children: current.sonia.mainContent.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 905,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-red-100 border-2 border-red-500 rounded p-2 mb-3",
                                                            children: current.sonia.mainContent.report.map((line, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-red-800 mb-1",
                                                                    children: [
                                                                        "• ",
                                                                        line
                                                                    ]
                                                                }, idx, true, {
                                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                                    lineNumber: 908,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 906,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-center font-bold text-red-600",
                                                            children: current.sonia.mainContent.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                            lineNumber: 911,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                    lineNumber: 903,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 751,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 738,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                            lineNumber: 731,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                    lineNumber: 529,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-purple-900 border-2 border-purple-500 rounded-xl p-4 mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-white mb-3 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl",
                                    children: "🤖"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 922,
                                    columnNumber: 13
                                }, this),
                                " AI Agent Reasoning (Behind the Scenes)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                            lineNumber: 921,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-purple-800 rounded-lg p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-purple-200 mb-1",
                                            children: "Active Agent:"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 928,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white font-bold",
                                            children: current.llm.agent
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 929,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 927,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-blue-900 rounded-lg p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-blue-200 mb-1",
                                            children: "LLM Prompt:"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 934,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white text-xs font-mono whitespace-pre-wrap",
                                            children: current.llm.prompt
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 935,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 933,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-green-900 rounded-lg p-3 flex flex-col justify-center items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-green-200 mb-1",
                                            children: "Confidence:"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 940,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-4xl font-bold text-green-400",
                                            children: current.llm.confidence
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 941,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 939,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                            lineNumber: 925,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3 mt-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 rounded-lg p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-300 mb-2",
                                            children: "💭 AI Thinking Process:"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 948,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white text-xs font-mono whitespace-pre-wrap",
                                            children: current.llm.thinking
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 949,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 947,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-green-800 rounded-lg p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-green-200 mb-2",
                                            children: "✅ Decision & Action:"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 954,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white text-xs font-mono whitespace-pre-wrap font-semibold",
                                            children: current.llm.decision
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 955,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 953,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                            lineNumber: 945,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                    lineNumber: 920,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-800 rounded-xl p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setPhase(Math.max(0, phase - 1)),
                                    disabled: phase === 0,
                                    className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold rounded-lg text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__["SkipBack"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 968,
                                            columnNumber: 15
                                        }, this),
                                        " Back"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 963,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsPlaying(!isPlaying),
                                    className: "flex items-center gap-2 px-4 py-2 ".concat(isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700', " text-white font-bold rounded-lg text-sm"),
                                    children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                lineNumber: 975,
                                                columnNumber: 30
                                            }, this),
                                            " Pause"
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                                lineNumber: 975,
                                                columnNumber: 63
                                            }, this),
                                            " Auto"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 971,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setPhase(Math.min(phases.length - 1, phase + 1)),
                                    disabled: phase === phases.length - 1,
                                    className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold rounded-lg text-sm",
                                    children: [
                                        "Next ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__["SkipForward"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                            lineNumber: 983,
                                            columnNumber: 20
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 978,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                            lineNumber: 962,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-1",
                            children: phases.map((p, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setPhase(idx),
                                    className: "flex-1 h-2 rounded ".concat(idx === phase ? 'bg-red-500 ring-1 ring-red-300' : idx < phase ? 'bg-green-600' : 'bg-gray-600'),
                                    title: p.name
                                }, idx, false, {
                                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                                    lineNumber: 989,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                            lineNumber: 987,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
                    lineNumber: 961,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
            lineNumber: 512,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js",
        lineNumber: 511,
        columnNumber: 5
    }, this);
}
_s(AttackerCommandCenter, "8MdCE7/4RRbg2m3DLLuUOrrij94=");
_c = AttackerCommandCenter;
var _c;
__turbopack_context__.k.register(_c, "AttackerCommandCenter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/info492/info492-demo1/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$app$2f$components$2f$AttackDemo2WithMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/info492/info492-demo1/app/components/AttackDemo2WithMap.js [app-client] (ecmascript)");
'use client';
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$info492$2f$info492$2d$demo1$2f$app$2f$components$2f$AttackDemo2WithMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/Documents/info492/info492-demo1/app/page.js",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_info492_info492-demo1_app_b11c1d9d._.js.map
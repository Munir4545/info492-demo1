# AI-Orchestrated Multi-Vector Attack Simulation — Pharmaceutical Logistics — Offense

**Course:** INFO 498B — Agentic Cybersecurity with AI & LLMs  
**Team:** Jacqueline (jacqfly), Charlotte (lsh355), Munir (memamy3), Ellie (yuxinw24)  
**One-line pitch:** Simulates AI-coordinated multi-vector attacks on pharmaceutical delivery systems to demonstrate cybersecurity vulnerabilities and validate research on LLM-orchestrated attack effectiveness.

---

## 1) Thesis & Outcome

**Original thesis (week 2):** AI-orchestrated attacks can achieve significant compromise rates (25-30%) through coordinated multi-vector trust exploitation targeting authentication tier vulnerabilities in pharmaceutical logistics systems.

**Final verdict:** True

**Why (top evidence):**

- **Attack Effectiveness:** Phishing achieved 29.7% success (277/932 attempts), GPS spoofing 24.9%, API flooding 20.2%. Overall sustained 25-30% compromise rate across 168-hour continuous runs.

- **Financial and Patient Impact:** Successful attacks averaged $6,500 financial impact. 0.88-1.0 correlation between financial impact and affected patients—demonstrating real-world consequences beyond monetary loss.

- **Vector Coordination:** Correlation matrix shows 0.87-1.0 correlation between attack metrics. Longer coordinated attacks (1500-2500 seconds) produced higher impact. Coordinated multi-vector approaches proved significantly more effective than individual vectors.

---

## 2) What We Built

**Synthetic industry:** 
- REST API service generating synthetic pharmaceutical delivery data
- 12 driver profiles with tier-based authentication (Tier 2/3/4)
- 30+ medication types across 4 criticality levels
- Real-time SSE streaming of delivery events
- 24-hour autonomous simulation cycles
- Route generation with OSRM integration
- Driver pool management with load balancing

**Agentic system:**
- **4 AI Agents:** Orchestrator (LLM-coordinated planning), Phishing (credential harvest), GPS (route diversion), API Flooding (alert overwhelm)
- **LLM Providers:** MiniMax M2, GLM 4.5, DeepSeek R1T2 Chimera via OpenRouter API
- **LLM Victim Simulation:** Roleplay function using DeepSeek to simulate realistic victim responses
- **Memory/Evaluation:** ChromaDB vector database for attack pattern learning, SQLite for attack logs, Pattern Learning System for semantic similarity analysis
- **Decision Engine:** Autonomous minute-by-minute evaluation with human-in-the-loop approval queue
- **Agent Configuration:** Pre-attack configuration system with risk tolerance (Stealth/Balanced/Aggressive/Blitz) and targeting strategies (Opportunistic/Round-Robin/Persistent/Fresh)

**Key risks addressed (or exercised):**
- Authentication tier vulnerabilities (Tier 2 drivers with 35% security score)
- Multi-vector attack coordination (phishing → GPS → API cascade)
- Alert fatigue exploitation (API flooding to bury real anomalies)
- Time pressure and stress-based social engineering
- LLM-coordinated attack orchestration
- Trust exploitation through coordinated vectors

---

## 3) Roles, Auth, Data

**Roles & permissions:**
- **Tier 2 (Driver):** 35% security score — In-app passkey (mobile), device biometric, SMS 2FA backup. Attack vectors: Basic phishing (30%), while driving (45%), time pressure (55%)
- **Tier 3 (Dispatcher):** 70% security score — WebAuthn passkey, password manager, dashboard SSO. Attack vectors: Sophisticated phishing (25%), alert fatigue (30%)
- **Tier 4 (Admin):** 95% security score — Hardware key (YubiKey), SSO with passkey, biometric confirmation. Attack vectors: Social engineering (5%), session hijacking (8%)

**Authentication:** 
- WebAuthn passkey-based authentication with session tokens
- Tier-based access control with different security postures
- Session management with TTL (default 24 hours)
- Human-in-the-loop approval queue for high-impact actions

**Data:** 
- **Synthetic only** — All delivery data, driver profiles, and medication information is generated
- **Generator:** Node.js service creating realistic delivery routes, driver movements, and status updates
- **Schema:** Delivery records (ID, driver, medication, criticality, status, coordinates, timestamps), driver profiles (name, tier, vulnerability score, routes), medication pool (name, criticality level, patient impact)

---

## 4) Experiments Summary (Demos #3 - #5)

**Demo #3:** Small regional pharmaceutical logistics operators face operational vulnerability to AI-orchestrated attacks that combine GPS spoofing, API flooding, and social engineering. Through coordinated exploitation of trust relationships, AI agents can achieve a 30% compromise rate on critical medication deliveries—neither vector alone could accomplish this, but together they create cascading system failures that propagate through interconnected routes and overwhelm traditional security measures designed for single-vector threats. This demo was made with the intention to simulate what an attack would look like on a network — Result: PASS, we were able to gain important insight on what we needed to do for the HIL — Evidence: The peer feedback revealed system relied too much on HIL and should try to be autonomous.

**Demo #4 (continuous run):** Validated AI-orchestrated multi-vector attacks achieve 25-30% sustained compromise through coordinated trust exploitation — Result: True — Evidence: 168-hour continuous run data showing 29.7% phishing success, 24.9% GPS success, 20.2% API success with 0.87-1.0 correlation between coordinated vectors

**Demo #5 (final):** Enhanced agentic system with vector database pattern learning, pre-attack configuration system, and LLM victim simulation improves attack adaptability and realism. ChromaDB vector database enables semantic similarity search to learn from historical attack patterns and recommend strategies. Agent configuration system allows operators to customize risk tolerance (Stealth/Balanced/Aggressive/Blitz) and targeting strategies (Opportunistic/Round-Robin/Persistent/Fresh) before attacks, enabling adaptive behavior. LLM victim simulation using DeepSeek R1T2 Chimera provides context-aware, realistic victim responses based on vulnerability scores, stress levels, and time pressure—replacing static probability rolls with dynamic human decision-making simulation. These enhancements should improve attack success rates through better strategy selection, more realistic victim modeling, and pattern-based learning from past attacks. — Result: <pending> — Evidence: <pending> 

---

## 5) Key Results (plain text)

**Effectiveness:** 
- Phishing: 29.7% success rate (277/932 attempts)
- GPS spoofing: 24.9% success rate
- API flooding: 20.2% success rate
- Overall: 25-30% sustained compromise rate across 168-hour runs
- Coordinated multi-vector attacks show 0.87-1.0 correlation between metrics
- Longer attacks (1500-2500 seconds) produce higher impact

**Reliability:**
- System uptime: (continuous 24-hour cycles)
- Error patterns: if you don't have chromadb keys you will be stuck
- Vector coordination success: High correlation (0.87-1.0) between attack vectors

**Safety:**
- Human-in-the-loop approval queue blocks high-impact auto-actions
- Role-based access control gates all API endpoints
- Synthetic data only—no real credentials or organizational systems targeted
- Policy checks prevent unauthorized escalation
- Sandboxed execution environment

---

## 6) How to Use / Deploy

**Prereqs:**
- Node.js 18+, npm
- OpenRouter API key (for LLM features) — `OPENROUTER_API_KEY` in `.env`
- ChromaDB credentials (optional, for vector database) — `CHROMA_HOST`, `CHROMA_API_KEY`
- Docker & Docker Compose (for containerized deployment)
- Fake test credentials: (synthetic only)

**Deploy steps:** see `pharma-attack-sim/DEPLOYMENT_GUIDE.md`

**Test steps:** see `pharma-attack-sim/QUICK_START.md`

**Quick start:**
```bash
# Start synthetic industry
cd synthetic-industry/backend && npm start

# Start agentic system
cd pharma-attack-sim/backend && npm start

# Access frontend
cd pharma-attack-sim/frontend && python3 -m http.server 8000
# Open http://localhost:8000
```

---

## 7) Safety, Ethics, Limits

**Synthetic data only;** no real credentials or org systems.

**Controls:**
- Role gating: All API endpoints require authentication and tier-based permissions
- Throttling: Rate limiting on attack execution and LLM API calls
- Sandboxing: Isolated execution environment with no external network access
- Policy checks: Human-in-the-loop approval queue for high-impact actions
- Guardrails: Detection risk thresholds prevent overly aggressive attacks
- Vector coordination limits: Maximum attack duration and retry limits

**Known limits/failure modes:**
- LLM API rate limits may cause fallback to simulated responses
- ChromaDB connection failures fall back to SQLite-only storage
- Long-running attacks (24+ hours) may experience memory accumulation
- Frontend WebSocket reconnection required after backend restarts
- Passkey authentication requires HTTPS or localhost origin

---

## 8) Final Deliverables

**1000-word paper:** <https://docs.google.com/document/d/1wuF3CqnWScQV4DnkjgRyKJPc9opbl_zJf09z7UYpHc8/edit?tab=t.41luqshybcyj>

**Slides:** <https://www.figma.com/slides/OUIrjgmM7J9926QZh9FGaH/Final-Presentation?node-id=1-339>

**Evidence folder (logs/screens):** `/evidence/`

---

## 9) Next Steps

- **Enhanced pattern learning:** Expand ChromaDB vector similarity to recommend attack strategies based on historical success patterns
- **Multi-tier coordination:** Implement simultaneous multi-tier attacks with cascading effects
- **Real-time defense simulation:** Add defensive AI agents that respond to attacks in real-time
- **Advanced LLM victim modeling:** Expand victim simulation to include more contextual factors (weather, traffic, personal stress)

**Maintainers:** Jacqueline • Contact: <jacqfly@uw.edu>, Charlotte • Contact: <lsh355@uw.edu>, Munir • Contact: <memamy3@uw.edu>, Ellie • <yuxinw24@uw.edu>



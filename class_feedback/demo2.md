# Team 7 — Demo 2 Feedback Summary

## Biggest Risks & Assumptions

- **Over-engineered / Hard-to-validate Scenarios**  
  Multiple reviewers warned that persona-based, multi-vector scenarios can become overly complicated without clear metrics showing which factors actually increase attack success. (A/B tests and controlled validation were recommended.)

- **Detection & Calibration Risk**  
  The detection-risk scoring may be mis-calibrated or brittle across different defender states and real countermeasures. Reviewers recommended running shadow digital-twin exercises and computing ROC/PR and calibration error (ECE) to tune thresholds.

- **Agent Stealth & Traceability**  
  There is concern that noisy actions (e.g., alert flooding to hide GPS spoofs) could leave artifacts that specialists can trace back. Reviewers suggested researching ways to keep attacking agents untraceable or to understand what paper-trail defenses reveal.

- **Human-in-the-Loop & LLM Reliability**  
  Several reviewers flagged the assumption that the LLM-powered agents will always act correctly. They suggested adding Human-in-the-Loop checkpoints, feedback loops, and error analysis to mitigate hallucination and unpredictable autonomous behavior.

- **Real-World Tool & Regulatory Mismatch**  
  The PoC may not reflect security measures and real tools used in industry routing/GPS systems (and SDR/regulatory limits). Test plans should account for real products, API rate limits, and SDR frequency constraints.

- **Coordination & Timing Fragility**  
  Multi-agent synchronization (timing, state sharing, escalation) is a point of failure—latency, conflict resolution, and partial observability from defenders could break the orchestration.

- **Measurement / Ground-Truth Gaps**  
  Claims like “500+ disruptions” lack clear validation methodology. There’s a consistent ask for concrete, quantitative measurement (latency, detection rates, human escalation times).

---

## Suggestions for a One-Sprint Build / Test

- **A/B Test Persona Effectiveness**  
  Run controlled comparisons of generic vs. persona-based attacks to measure lift in success rates and validate which persona features matter.

- **Shadow Digital-Twin with Real Countermeasures**  
  Execute a shadow environment that includes common defender tools and countermeasures; compute ROC/PR and calibration error per state to tune the detection-risk model.

- **Build an Agent-Monitoring Dashboard**  
  Create a transparent dashboard that shows agent decisions, shared state changes, LLM query logs, and error analysis to improve interpretability, safety auditing, and debugging.

- **Coordination / Replay Harness**  
  Ship a coordination engine with an explicit state machine and a replay harness that logs time-to-misroute, human escalation rates, and success under countermeasure ablations.

- **Monte-Carlo Human Response Simulator**  
  Build a simulator that injects different human response profiles (calm, routine, panicked) and timing distributions to tune escalation logic and find robustness sweet spots.

- **Live Coordination Simulator with Defender Noise**  
  Create an emulation harness that simulates defender noise (delays, false positives, partial logs) to measure coordination resilience and how frequently agents converge on optimal actions.

- **Grounding Against Real Market Tools**  
  Research real-world routing/GPS products and defenses; prototype integration points or adversarial interactions tied to those products rather than only to a toy dispatcher.

- **Quantitative Full-Chain Simulation**  
  Run an end-to-end sandbox test where phishing, GPS manipulation, and API suppression operate together, measuring latency, coordination accuracy, and conflict resolution.

- **Stakeholder Validation**  
  Collaborate with dispatch center stakeholders (or test drivers on set paths) to validate assumptions about human behavior, message trust, and system interactions.

---

## Strongest Elements of the Presentation

- **Persona-based Attacks & Human-Factor Focus**  
  The move to persona-based templates was widely praised — it makes the experiments more realistic by modeling varied human trust patterns and behavioral triggers.

- **Multi-Agent / Multi-Vector Architecture**  
  Reviewers liked the refined multi-agent LLM architecture and state-based coordination (phishing, GPS, API suppression), which enables dynamic and plausible attack sequences.

- **Clear Agent/LLM Backtracing & Risk Calculations**  
  The team’s explicit separation of Agent vs LLM roles, plus visible risk calculations and stepwise reasoning, gave reviewers strong insight into the system’s logic.

- **Polished, Engaging Demo & Storytelling**  
  The animation, demo visuals, and narrative (including “implicit trust” reasoning) were described as polished, realistic, and easy to follow.

- **Novel Vulnerability Scoring & Use of Data**  
  The vulnerability scoring idea and evidence-backed persona reasoning stood out as novel and valuable to the thesis.

- **Actionable Research Orientation**  
  Many reviewers noted the team’s clear research direction (measuring, iterating, and validating) and offered concrete experiments to move from concept to measurable results.

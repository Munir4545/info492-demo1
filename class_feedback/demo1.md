# Risk Review & Sprint Suggestions

## Biggest Risks & Assumptions

- **Agent Utilization and Training**  
  A key risk is ensuring the AI agent actually uses the scoring system and is trained to prioritize the highest scores.

- **Real-World Attack Prevention**  
  There is concern about accidentally enabling real-world attacks through unsafe testing or insufficient safeguards. Recommended mitigations include strict access controls, comprehensive logging, and emergency kill switches.

- **GPS and API System Functionality**  
  Questions exist about GPS and API connectivity: how the GPS/API system will function and how specific points for GPS spoofs would be narrowed down.

- **Trust in Message-Based Updates (Assumption)**  
  The plan assumes dispatchers and drivers will always trust message-based updates without verification — a fragile assumption.

- **SDR Signal Ranges**  
  For Software-Defined Radios (SDR), signals must remain within permitted (free) frequency ranges to avoid regulatory issues.

- **Complex Tracking Systems**  
  The real-world delivery system may be more complex than assumed, with more sophisticated tracking and driver communications.

- **Trusted-Role Impersonation & Disruptions**  
  Assuming successful trusted-role impersonation and effective GPS/API disruptions is risky without accounting for carrier defenses, dispatcher verification practices, or API rate limits.

---

## Suggestions for a One-Sprint Build / Test

- **API Development for Attack Victims**  
  Build/test an API that models truck locations and potential attack victim scenarios.

- **Defensive Detection Prototype**  
  Develop a defensive prototype (e.g., a dashboard that simulates GPS data and flags abnormalities) for safe vulnerability testing.

- **Stakeholder Collaboration**  
  Work with dispatch center stakeholders to identify real vulnerabilities and realistic operational constraints.

- **Delivery Photo Overwriting (for Testing)**  
  For completed deliveries in the test environment, consider overwriting delivery-photo location metadata to prevent test agents from being traced to real locations.

- **SDR and Defense Simulation**  
  Build SDR prototypes and a defense simulation that includes a verification step or AI-based anomaly detector for suspicious route updates.

- **Orchestration Harness for Multi-Vector Tests**  
  Create an orchestration harness to simultaneously drive SMS phishing, GPS spoofing scenarios, and programmable API flood/load against a replica dispatch API.

---

## Strongest Elements of the Presentation

- **Impressive & Legitimate Demo**  
  The demo was frequently praised as amazing, easy to follow, and visually legitimate.

- **In-Depth & Descriptive Presentation**  
  Reviewers noted the demo was very in-depth and descriptive; the research appeared thorough.

- **Multi-Vector, Socio-Technical Focus**  
  Focusing on multi-vector socio-technical attacks (impersonation, GPS manipulation, API flooding) was a major strength.

- **Strong Use of Datasets**  
  The team’s use of datasets was highlighted as a positive element.

- **Clear Storytelling & Attack Explanation**  
  The storytelling — particularly the “implicit trust problem” slide — and the step-by-step attack explanation were highly regarded.

- **Polished & Realistic Demo**  
  The GPS and dispatch interface demo was described as polished and realistic.

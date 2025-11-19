# 🕒 24-Hour Autonomous Industry Simulation Guide

This guide explains how to run the Pharma Attack Simulator in a high-fidelity, 24-hour autonomous mode that simulates a realistic Advanced Persistent Threat (APT) campaign.

## 🧠 New Feature: Campaign Memory

We have upgraded the simulation to include a **Campaign Manager**. This persistent brain allows the attacker to:

1.  **Remember Targets**: It tracks which drivers have been compromised and which are "vigilant" (detected attacks).
2.  **Evolve Strategy**:
    *   **Vulnerability Scoring**: Drivers who fall for phishing get higher vulnerability scores, making them preferred targets for future attacks.
    *   **Detection Cooling**: If an attack is detected, the system lowers the priority of that target to avoid "burning" the vector.
3.  **Day/Night Cycles**: The system now tracks "Campaign Days". Strategy shifts as the campaign progresses.

## ⚙️ Configuration for 24-Hour Run

To run a true 24-hour autonomous simulation, you have two options depending on your goals:

### Option A: Accelerated Time (Recommended for Demos)
Simulate multiple "days" of attacks within a 24-hour real-world window. This generates the most data.

*   **Configuration**: Default settings.
*   **Behavior**: One "day" passes every ~25 minutes.
*   **Result**: Over 24 hours, you will simulate ~50+ days of campaign activity, showing long-term degradation of security posture.

### Option B: Real-Time Simulation
Run the simulation in real-time synchronization with the wall clock.

1.  Create or edit `pharma-attack-sim/.env`:
    ```env
    # 1 real second = 1 sim second (Real Time)
    SIM_MINUTE_MS=60000
    
    # 24 hours of simulation
    SIM_TOTAL_MINUTES=1440
    ```

2.  **Behavior**: The autonomous loop will execute *very* slowly.
    *   Decisions happen once per minute.
    *   Attacks unfold over hours, not seconds.
    *   This is "Boring but Realistic" - exactly like real SOC monitoring.

## 🚀 Launching the Campaign

1.  **Start the Backend**:
    ```bash
    cd pharma-attack-sim/backend
    npm start
    ```

2.  **Start the Synthetic Industry** (in a separate terminal):
    ```bash
    cd synthetic-industry/backend
    npm start
    ```

3.  **Engage Autonomy**:
    ```bash
    cd pharma-attack-sim/backend
    npm run start_attack
    ```

## 📊 Monitoring the Campaign

The system will now run indefinitely.

*   **Console**: Watch for `[AUTONOMY]` logs. You will see:
    *   `Campaign Day X`: Tracking the progression.
    *   `Targeting X`: Dynamic target selection based on the Campaign Manager's profile of that driver.
    *   `Night falls...`: Indication of day advancement.
*   **Database**: The `campaign_state` and `driver_profiles` tables in `attacks.db` store the long-term memory. You can query this to see the "Most Compromised Driver".

## 🧹 Resetting the Campaign

To start a fresh 24-hour run:

```bash
rm pharma-attack-sim/backend/attacks.db
# Restart server to regenerate fresh DB
```


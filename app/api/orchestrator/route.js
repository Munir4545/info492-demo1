export async function POST(req) {
  try {
    const { sharedState, attackHistory } = await req.json();

    // Build context for the orchestrator
    const systemPrompt = `You are an AI Attack Orchestrator for a cybersecurity demonstration. You coordinate three specialized agents:
1. Phishing Agent - Harvests credentials via email campaigns
2. GPS Manipulation Agent - Spoofs vehicle locations
3. API Flood Agent - Injects fake orders into the system

CURRENT SHARED STATE:
- Compromised Accounts: ${sharedState.compromisedAccounts}
- Detection Risk: ${sharedState.detectionRisk}%
- Attack Phase: ${sharedState.phase}
- Elapsed Time: ${sharedState.elapsedTime}s
- Total Disruptions: ${sharedState.totalDisruptions}

RECENT ACTIONS:
${attackHistory.slice(-3).join('\n')}

YOUR TASK: Analyze the current state and decide the next action. Choose ONE agent and specify what it should do.

Respond in JSON format:
{
  "thinking": "Your strategic analysis of the current situation (2-3 sentences)",
  "decision": "Which agent to activate and why",
  "agent": "phishing" | "gps" | "api",
  "action": "Specific action for the agent to take",
  "expectedOutcome": "What you expect to achieve",
  "riskAssessment": "low" | "medium" | "high"
}

Consider:
- If detection risk is high (>70%), use stealthier tactics
- If few accounts are compromised, prioritize phishing
- GPS manipulation works best after having some compromised credentials
- API flooding is most effective when you have multiple compromised accounts
- Vary your tactics to avoid detection patterns`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'What is your next strategic move?' }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return Response.json(
        { error: 'Failed to fetch from OpenRouter API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const orchestratorResponse = data.choices[0].message.content;
    
    // Try to parse JSON from the response
    let decision;
    try {
      // Extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = orchestratorResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        decision = JSON.parse(jsonMatch[0]);
      } else {
        decision = JSON.parse(orchestratorResponse);
      }
    } catch (parseError) {
      // Fallback if LLM doesn't return valid JSON
      decision = {
        thinking: orchestratorResponse.substring(0, 200),
        decision: "Continuing multi-vector attack",
        agent: sharedState.compromisedAccounts < 3 ? "phishing" : "gps",
        action: "Execute tactical operation",
        expectedOutcome: "Increase system disruption",
        riskAssessment: "medium"
      };
    }

    return Response.json({
      success: true,
      orchestratorDecision: decision,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in orchestrator API:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


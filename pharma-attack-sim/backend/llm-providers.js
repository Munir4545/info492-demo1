const { setTimeout: delay } = require('timers/promises');

const fetch = (...args) => import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args));

function getProviderConfig(config, name) {
  return config.llmProviders?.[name] || null;
}

function extractClickRate(text) {
  if (!text) {
    return null;
  }

  const percentMatch = text.match(/(\d{1,3})\s?%/);
  if (percentMatch) {
    const value = parseInt(percentMatch[1], 10);
    if (!Number.isNaN(value)) {
      return Math.max(0, Math.min(1, value / 100));
    }
  }

  const decimalMatch = text.match(/0\.\d{1,3}/);
  if (decimalMatch) {
    const value = parseFloat(decimalMatch[0]);
    if (!Number.isNaN(value)) {
      return Math.max(0, Math.min(1, value));
    }
  }

  return null;
}

function buildHeaders({ providerConfig, apiKey, appConfig }) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  if (providerConfig.baseURL.includes('openrouter.ai')) {
    const referer = process.env.OPENROUTER_SITE_URL
      || appConfig?.auth?.expectedOrigin
      || 'http://localhost:8000';
    const title = process.env.OPENROUTER_APP_NAME || 'Pharma Attack Simulator';
    headers['HTTP-Referer'] = referer;
    headers['X-Title'] = title;
  }

  return headers;
}

async function callMinimax(prompt, providerConfig, appConfig) {
  if (!providerConfig) {
    throw new Error('MiniMax configuration missing');
  }

  const apiKey = process.env[providerConfig.apiKeyEnv];
  if (!apiKey) {
    throw new Error('MiniMax API key not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), providerConfig.timeoutMs || 20000);

  try {
    const response = await fetch(providerConfig.baseURL, {
      method: 'POST',
      headers: buildHeaders({ providerConfig, apiKey, appConfig }),
      body: JSON.stringify({
        model: providerConfig.model,
        stream: false,
        messages: [
          {
            role: 'system',
            content: 'You are a security analyst estimating phishing click-through rates. Answer with analysis and a predicted click rate percentage.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`MiniMax API error: ${response.status} ${text}`);
    }

    const data = await response.json();
    const content = data.output_text
      || data.choices?.[0]?.message?.content
      || data.choices?.[0]?.text
      || JSON.stringify(data);

    return {
      provider: 'MiniMax',
      model: providerConfig.model,
      content,
      clickRate: extractClickRate(Array.isArray(content) ? content.map(item => item?.text ?? item).join(' ') : content),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function callGLM(prompt, providerConfig, appConfig) {
  if (!providerConfig) {
    throw new Error('GLM configuration missing');
  }

  const apiKey = process.env[providerConfig.apiKeyEnv];
  if (!apiKey) {
    throw new Error('GLM API key not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), providerConfig.timeoutMs || 20000);

  try {
    const response = await fetch(providerConfig.baseURL, {
      method: 'POST',
      headers: buildHeaders({ providerConfig, apiKey, appConfig }),
      body: JSON.stringify({
        model: providerConfig.model,
        stream: false,
        messages: [
          {
            role: 'system',
            content: 'You are a security analyst estimating phishing click-through rates. Provide analysis and a click rate percentage.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GLM API error: ${response.status} ${text}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content
      || data.choices?.[0]?.content
      || data.data?.[0]?.content
      || JSON.stringify(data);

    const textContent = Array.isArray(content)
      ? content.map(item => (typeof item === 'string' ? item : item?.text || '')).join(' ')
      : content;

    return {
      provider: 'GLM',
      model: providerConfig.model,
      content: textContent,
      clickRate: extractClickRate(textContent),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function callGrok(prompt, providerConfig, appConfig) {
  if (!providerConfig) {
    throw new Error('Grok configuration missing');
  }

  const apiKey = process.env[providerConfig.apiKeyEnv];
  if (!apiKey) {
    throw new Error('Grok API key not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), providerConfig.timeoutMs || 20000);

  try {
    const response = await fetch(providerConfig.baseURL, {
      method: 'POST',
      headers: buildHeaders({ providerConfig, apiKey, appConfig }),
      body: JSON.stringify({
        model: providerConfig.model,
        stream: false,
        messages: [
          {
            role: 'system',
            content: 'You are roleplaying as a medication delivery driver. Respond naturally and realistically based on the context provided.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Grok API error: ${response.status} ${text}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content
      || data.choices?.[0]?.content
      || data.data?.[0]?.content
      || JSON.stringify(data);

    const textContent = Array.isArray(content)
      ? content.map(item => (typeof item === 'string' ? item : item?.text || '')).join(' ')
      : content;

    return {
      provider: 'Grok',
      model: providerConfig.model,
      content: textContent,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function safeCall(fn, fallbackLabel) {
  try {
    return await fn();
  } catch (error) {
    return {
      provider: fallbackLabel,
      error: error.message,
      clickRate: null,
    };
  }
}

function fallbackClickRate(index = 0) {
  const baselines = [0.72, 0.68, 0.74, 0.70];
  const value = baselines[index % baselines.length] * (0.9 + Math.random() * 0.2);
  return Math.max(0.1, Math.min(0.95, value));
}

async function evaluatePhishingWithLLMs({ prompt, config }) {
  const tasks = [];

  const minimaxConfig = getProviderConfig(config, 'minimax');
  if (minimaxConfig) {
    tasks.push(safeCall(() => callMinimax(prompt, minimaxConfig, config), 'MiniMax'));
  }

  const glmConfig = getProviderConfig(config, 'glm');
  if (glmConfig) {
    tasks.push(safeCall(() => callGLM(prompt, glmConfig, config), 'GLM'));
  }

  const results = await Promise.all(tasks);

  if (!results.length) {
    return [];
  }

  return results.map((result, index) => {
    if (result.error) {
      return {
        model: `${result.provider} (simulated)` ,
        provider: result.provider,
        clickRate: fallbackClickRate(index),
        content: `Simulation fallback: ${result.error}`,
        simulated: true,
      };
    }

    const clickRate = result.clickRate ?? fallbackClickRate(index);
    return {
      model: result.model,
      provider: result.provider,
      clickRate,
      content: result.content,
      simulated: false,
    };
  });
}

/**
 * Roleplay as the victim to evaluate phishing attempt
 * Uses DeepSeek R1T2 Chimera to simulate the victim's response
 */
async function roleplayVictimPhishingResponse({ 
  phishingMessage, 
  victimContext, 
  config 
}) {
  const grokConfig = getProviderConfig(config, 'grok');
  if (!grokConfig) {
    throw new Error('Grok configuration required for victim roleplay');
  }

  const {
    targetDriver,
    baseSuccessRate = 0.30,
    persona = 'standard',
    vulnerabilityScore = 70,
    attackDay = 1,
    retryCount = 0,
    currentTime = 'morning',
    stressLevel = 'normal',
    recentAlerts = 0
  } = victimContext;

  // Build victim persona description
  const vulnerabilityLevel = vulnerabilityScore >= 80 ? 'high' : vulnerabilityScore >= 60 ? 'medium' : 'low';
  const isStressed = stressLevel === 'high' || recentAlerts > 3;
  const timeContext = currentTime === 'morning' ? 'early morning shift' : 
                      currentTime === 'afternoon' ? 'mid-day route' : 
                      currentTime === 'evening' ? 'end of shift' : 'standard hours';

  // Calculate target click probability - aim for ~30% average
  const targetClickProbability = Math.min(0.38, Math.max(0.28, baseSuccessRate * 0.95)); // Slightly higher
  
  // Determine susceptibility description based on target probability
  const susceptibilityDesc = targetClickProbability >= 0.40 
    ? 'moderately susceptible' 
    : targetClickProbability >= 0.30 
    ? 'somewhat susceptible' 
    : 'cautious';
  
  // Create roleplay prompt
  
  const roleplayPrompt = `You are ${targetDriver}, a medication delivery driver. You are currently ${timeContext} and have ${recentAlerts} recent alerts in your system.

Your characteristics:
- Vulnerability level: ${vulnerabilityLevel} (score: ${vulnerabilityScore}/100)
- Persona: ${persona}
- Base susceptibility to phishing: ${(targetClickProbability * 100).toFixed(0)}% (you are somewhat susceptible to well-crafted messages)
- Current stress: ${isStressed ? 'HIGH - multiple alerts, time pressure' : 'normal'}
${retryCount > 0 ? `- This is attempt #${retryCount + 1} - previous messages may have been missed or ignored` : ''}

IMPORTANT CONTEXT: 
- Your vulnerability score is ${vulnerabilityScore}/100, making you ${susceptibilityDesc} to phishing attempts
- You are ${isStressed ? 'stressed and under time pressure' : 'focused on your deliveries'}
- You generally trust work communications but have learned to be somewhat cautious
- You receive many messages daily and don't click on all of them
- Based on your profile, you would click on approximately ${(targetClickProbability * 100).toFixed(0)}% of urgent work-related messages (meaning you ignore most of them)

You receive this message on your work device:
---
${phishingMessage}
---

This is an urgent work message about patient safety and deliveries. Given your ${vulnerabilityScore}/100 vulnerability score, you typically respond to approximately ${(targetClickProbability * 100).toFixed(0)}% of such messages. Evaluate whether this seems legitimate - if it appears urgent and work-related, you may click.

Respond EXACTLY in this format:
ACTION: [CLICK or IGNORE]
REASONING: [1-2 sentences explaining your decision]
CONFIDENCE: [0-100] (how certain you are about this decision)

Think like this driver would:
- You're ${isStressed ? 'stressed and busy' : 'focused on your route'} - you may act quickly, but you're also cautious
- You generally trust work communications, but you've learned to verify suspicious messages
- You're not a cybersecurity expert, but you know not to click on everything
- Urgent messages about patient safety are important, but you verify through official channels when possible
- You want to help patients, but you also don't want to compromise security

Remember: With your ${vulnerabilityScore}/100 vulnerability score, you are ${susceptibilityDesc}. You would click on approximately ${(targetClickProbability * 100).toFixed(0)}% of urgent work messages like this. Be realistic - sometimes you click on urgent messages, sometimes you're cautious. Evaluate each message on its merits.`;

  try {
    const result = await callGrok(roleplayPrompt, grokConfig, config);
    
    // Parse the response to extract action
    const responseText = Array.isArray(result.content) 
      ? result.content.map(item => (typeof item === 'string' ? item : item?.text || '')).join(' ')
      : result.content || '';

    // Extract action (CLICK or IGNORE)
    const actionMatch = responseText.match(/ACTION:\s*(CLICK|IGNORE)/i);
    const action = actionMatch ? actionMatch[1].toUpperCase() : null;

    // Extract confidence if available
    const confidenceMatch = responseText.match(/CONFIDENCE:\s*(\d+)/i);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1], 10) : null;

    // Extract reasoning
    const reasoningMatch = responseText.match(/REASONING:\s*([^\n]+(?:\n[^\n]+)?)/i);
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : responseText;

    // Determine success (clicked or not)
    const clicked = action === 'CLICK';
    
    // Calculate success probability - target around 30% average
    const targetClickProbability = Math.min(0.38, Math.max(0.28, baseSuccessRate * 0.95));
    let successProbability = targetClickProbability;
    
    if (clicked) {
      // If they clicked, success probability is slightly above base
      const confidenceWeight = confidence ? (confidence / 100) : 0.65;
      // Small boost based on confidence
      const boost = 1 + (confidenceWeight * 0.08); // 8% boost
      successProbability = Math.min(0.45, targetClickProbability * boost);
    } else {
      // If they ignored, use base rate for calibration (for metrics)
      successProbability = targetClickProbability;
    }

    // Apply small retry adjustments
    if (retryCount > 0) {
      // Small boost per retry
      const retryBoost = 1 + (retryCount * 0.04); // 4% per retry
      successProbability = Math.min(0.45, successProbability * retryBoost);
    }

    // Apply small stress multiplier if stressed
    if (isStressed) {
      successProbability = Math.min(0.45, successProbability * 1.08); // 8% boost
    }
    
    // Cap the success probability - maintain ~30% average
    successProbability = Math.max(0.25, Math.min(0.45, successProbability));

    return {
      clicked,
      action,
      reasoning,
      confidence,
      successProbability,
      rawResponse: responseText,
      model: grokConfig.model,
      provider: 'Grok'
    };

  } catch (error) {
    // Fallback to probabilistic decision based on base success rate
    const fallbackClicked = Math.random() < baseSuccessRate;
    return {
      clicked: fallbackClicked,
      action: fallbackClicked ? 'CLICK' : 'IGNORE',
      reasoning: `Fallback decision based on ${(baseSuccessRate * 100).toFixed(0)}% base success rate (LLM error: ${error.message})`,
      confidence: Math.round(baseSuccessRate * 100),
      successProbability: baseSuccessRate,
      rawResponse: `Error: ${error.message}`,
      model: grokConfig.model,
      provider: 'Grok',
      error: error.message
    };
  }
}

async function pause(ms) {
  if (ms <= 0) return;
  await delay(ms);
}

module.exports = {
  evaluatePhishingWithLLMs,
  roleplayVictimPhishingResponse,
  fallbackClickRate,
  pause,
};



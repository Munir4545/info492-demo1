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

async function pause(ms) {
  if (ms <= 0) return;
  await delay(ms);
}

module.exports = {
  evaluatePhishingWithLLMs,
  fallbackClickRate,
  pause,
};



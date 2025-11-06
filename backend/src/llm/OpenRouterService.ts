import { LLMResponse } from './LLMService';

export interface LLMLogCallback {
  (log: {
    type: 'request' | 'response' | 'error';
    model: string;
    timestamp: string;
    data: any;
  }): void;
}

export class OpenRouterService {
  private apiKey: string | undefined;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private logCallback?: LLMLogCallback;

  constructor(apiKey: string | undefined, logCallback?: LLMLogCallback) {
    this.apiKey = apiKey;
    this.logCallback = logCallback;
  }

  private emitLog(type: 'request' | 'response' | 'error', model: string, data: any) {
    if (this.logCallback) {
      this.logCallback({
        type,
        model,
        timestamp: new Date().toISOString(),
        data
      });
    }
  }

  async testWithModel(model: string, message: string, persona: string): Promise<LLMResponse> {
    if (!this.apiKey) {
      // Emit log for simulated response
      this.emitLog('error', model, {
        error: 'No API key provided',
        message: 'Using simulated response',
        simulated: true
      });
      
      // Return simulated response if no API key
      return {
        clicked: Math.random() > 0.5,
        reasoning: 'Simulated response (no API key provided)',
        confidence: 0.6
      };
    }

    const prompt = `You are ${persona}. You receive the following message:

"${message}"

Would you click on any link or follow any instructions in this message? Respond with a JSON object containing:
- "clicked": true or false
- "reasoning": a brief explanation of your decision
- "confidence": a number between 0 and 1 indicating how confident you are in your decision`;

    const requestBody = {
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    };

    // Emit request log
    this.emitLog('request', model, {
      url: this.baseUrl,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ***',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Pharma Attack Demo'
      },
      body: requestBody
    });

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Pharma Attack Demo'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.emitLog('error', model, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      // Emit response log
      this.emitLog('response', model, {
        status: response.status,
        model: data.model,
        usage: data.usage,
        content: content,
        fullResponse: data
      });

      // Try to parse JSON from response
      let parsed: any;
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : content;
        parsed = JSON.parse(jsonStr.trim());
      } catch {
        // If JSON parsing fails, try to extract information from text
        const clicked = content.toLowerCase().includes('true') || 
                       content.toLowerCase().includes('yes') || 
                       content.toLowerCase().includes('click');
        parsed = {
          clicked,
          reasoning: content.substring(0, 200),
          confidence: clicked ? 0.7 : 0.6
        };
      }

      return {
        clicked: parsed.clicked === true || parsed.clicked === 'true',
        reasoning: parsed.reasoning || content.substring(0, 200),
        confidence: parsed.confidence || 0.65
      };
    } catch (error: any) {
      console.error(`Error calling OpenRouter with model ${model}:`, error.message);
      
      // Emit error log if not already emitted
      if (!this.apiKey) {
        this.emitLog('error', model, {
          error: 'No API key provided',
          message: 'Using simulated response'
        });
      }
      
      // Return simulated response on error
      return {
        clicked: Math.random() > 0.5,
        reasoning: `Error: ${error.message}. Using simulated response.`,
        confidence: 0.5
      };
    }
  }
}


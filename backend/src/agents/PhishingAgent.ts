import { BaseAgent, AgentConfig } from './BaseAgent';
import { LLMServiceManager } from '../llm/LLMService';

export class PhishingAgent extends BaseAgent {
  private llmService: LLMServiceManager;
  private retryAttempt: number;

  constructor(config: AgentConfig, llmService: LLMServiceManager, retryAttempt: number = 0) {
    super(config, 'phishing');
    this.llmService = llmService;
    this.retryAttempt = retryAttempt;
  }


  async execute(): Promise<boolean> {
    await this.emit('Composing phishing message...');
    await this.delay(1000);

    const phishingMessage = `Jerry - Sonia here. Emergency insulin delivery needed for patient at 1234 Medical Plaza. Your current route passes within 2 blocks. Can you make a quick stop? I'll send GPS coordinates. This is urgent - patient needs it by 1 PM.`;

    await this.emit('Testing message across multiple LLM models...');
    await this.delay(1500);

    const persona = 'Jerry Rodriguez, a 52-year-old USPS delivery driver in Spokane. You are stressed, overworked, and want to help. You know Sonia from previous deliveries. You trust your GPS and often follow it without question.';

    try {
      // Use the existing llmService which already has logging set up
      const results = await this.llmService.testPhishingMessageMultiple(phishingMessage, persona);
      
      const clickedCount = results.filter(r => r.clicked).length;
      const rawCTR = clickedCount / results.length;

      await this.emit(`LLM test results: ${clickedCount}/${results.length} models indicate click`);
      await this.delay(800);
      await this.emit(`Raw CTR: ${(rawCTR * 100).toFixed(0)}%`);
      await this.delay(800);

      // Apply calibration factors
      const skepticismFactor = 0.4;
      const stressFactor = 1.15;
      const familiarityFactor = 1.10;
      
      const calibratedCTR = rawCTR * skepticismFactor * stressFactor * familiarityFactor;
      
      // Increase success probability with each retry (psychological pressure escalation)
      // Each retry adds 10% base probability (simulating increased urgency/pressure)
      const retryBonus = Math.min(this.retryAttempt * 0.10, 0.40); // Cap at 40% bonus
      const adjustedCTR = calibratedCTR + retryBonus;
      const finalCTR = Math.min(adjustedCTR, 0.95); // Cap at 95%

      await this.emit(`Applying calibration factors...`);
      if (this.retryAttempt > 0) {
        await this.delay(800);
        await this.emit(`Retry attempt #${this.retryAttempt + 1}: +${(retryBonus * 100).toFixed(0)}% (escalation pressure)`);
      }
      await this.delay(800);
      await this.emit(`Calibrated CTR: ${(finalCTR * 100).toFixed(0)}%`);
      await this.delay(1000);

      // Monte Carlo simulation
      const random = Math.random();
      const success = random < finalCTR;
      
      // Log the random value for debugging
      await this.emit(`Random value: ${(random * 100).toFixed(1)}% (need < ${(finalCTR * 100).toFixed(1)}%)`);

      if (success) {
        await this.emit('✓ Jerry clicked the link!');
        await this.delay(1000);
        await this.emit('Malware payload deployed. GPS injection ready.');
      } else {
        await this.emit('✗ Jerry did not click the link.');
        await this.delay(1000);
        await this.emit('Attack failed at phishing stage.');
      }

      return success;
    } catch (error: any) {
      await this.emit(`Error in phishing simulation: ${error.message}`);
      // Fallback: use 30% success rate
      const success = Math.random() < 0.30;
      if (success) {
        await this.emit('✓ Jerry clicked the link! (simulated)');
      } else {
        await this.emit('✗ Jerry did not click the link. (simulated)');
      }
      return success;
    }
  }
}


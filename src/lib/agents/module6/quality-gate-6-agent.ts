// lib/agents/module6/quality-gate-6-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { QualityGate6Input, QualityGate6Output, QualityGate6InputSchema, QualityGate6OutputSchema } from '../../../types/agents';
import { QUALITY_GATE_6_PROMPT } from '../../prompts/module6';

export class QualityGate6Agent extends BaseAgent<QualityGate6Input, QualityGate6Output> {
  protected agentName = 'agent-qg6-production-viability-audit';
  protected agentVersion = '1.0';
  protected inputSchema = QualityGate6InputSchema;
  protected outputSchema = QualityGate6OutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.2 });
  }

  protected async execute(input: QualityGate6Input, context: AgentContext): Promise<QualityGate6Output> {
    const prompt = `
      ${QUALITY_GATE_6_PROMPT}

      Audit the following integrated Technical Bible:
      ${JSON.stringify(input.technicalBible, null, 2)}
    `;
    
    const response = await this.geminiClient.generateStructuredContent<QualityGate6Output>(
        prompt, 
        this.outputSchema
    );

    // Manually update the gate name as the prompt is reused
    response.qualityGateReport.gateName = "Quality Gate #6: Production Viability";
    
    return response;
  }

  protected async assessQuality(output: QualityGate6Output): Promise<number> {
    return output.qualityGateReport.summary.overallPassed ? 100 : 50;
  }
}
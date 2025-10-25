// lib/agents/module3/quality-gate-3-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { QualityGate3Input, QualityGate3Output, QualityGate3InputSchema, QualityGate3OutputSchema } from '../../../types/agents';
import { QUALITY_GATE_3_PROMPT } from '../../../prompts/module3';

export class QualityGate3Agent extends BaseAgent<QualityGate3Input, QualityGate3Output> {
  protected agentName = 'agent-qg3-visual-consistency-audit';
  protected agentVersion = '1.0';
  protected inputSchema = QualityGate3InputSchema;
  protected outputSchema = QualityGate3OutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.2 });
  }

  protected async execute(input: QualityGate3Input, context: AgentContext): Promise<QualityGate3Output> {
    const prompt = `
      ${QUALITY_GATE_3_PROMPT}

      Audit the following integrated Visual Bible:
      ${JSON.stringify(input.visualBible, null, 2)}
    `;
    
    // The Gemini response should match the full output schema directly.
    const response = await this.geminiClient.generateStructuredContent<QualityGate3Output>(
        prompt, 
        this.outputSchema // Use the full QualityGate3OutputSchema
    );
    
    return response;
  }

  protected async assessQuality(output: QualityGate3Output): Promise<number> {
    return output.qualityGateReport.summary.overallPassed ? 100 : 50;
  }
}
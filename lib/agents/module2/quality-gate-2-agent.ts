// lib/agents/module2/quality-gate-2-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { QualityGate2Input, QualityGate2Output, QualityGate2InputSchema, QualityGate2OutputSchema } from '../../../types/agents';
import { QUALITY_GATE_2_PROMPT } from '../../../prompts/module2';

export class QualityGate2Agent extends BaseAgent<QualityGate2Input, QualityGate2Output> {
  protected agentName = 'agent-qg2-creative-foundation-audit';
  protected agentVersion = '1.0';
  protected inputSchema = QualityGate2InputSchema;
  protected outputSchema = QualityGate2OutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.2 });
  }

  protected async execute(input: QualityGate2Input, context: AgentContext): Promise<QualityGate2Output> {
    const prompt = `
      ${QUALITY_GATE_2_PROMPT}

      Audit the following creative foundation documents:
      Story Architecture: ${JSON.stringify(input.storyArchitecture, null, 2)}
      Emotional Arc: ${JSON.stringify(input.emotionalArc, null, 2)}
      Thematic Elements: ${JSON.stringify(input.thematicElements, null, 2)}
    `;
    
    // The Gemini response should match the full output schema directly.
    const response = await this.geminiClient.generateStructuredContent<QualityGate2Output>(
        prompt, 
        this.outputSchema // Use the full QualityGate2OutputSchema
    );
    
    return response;
  }

  protected async assessQuality(output: QualityGate2Output): Promise<number> {
    // Quality of a quality gate is determined by its own successful execution.
    return output.qualityGateReport.summary.overallPassed ? 100 : 50;
  }
}
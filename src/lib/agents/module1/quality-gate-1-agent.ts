// lib/agents/module1/quality-gate-1-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { QualityGate1Input, QualityGate1Output, QualityGate1InputSchema, QualityGate1OutputSchema } from '../../../types/agents';
import { QUALITY_GATE_1_PROMPT } from '../../prompts/module1';
import { z } from 'zod';

export class QualityGate1Agent extends BaseAgent<QualityGate1Input, QualityGate1Output> {
  protected agentName = 'agent-qg1-vision-audit';
  protected agentVersion = '1.0';
  protected inputSchema = QualityGate1InputSchema;
  protected outputSchema = QualityGate1OutputSchema;

  constructor() {
    super({
      model: 'gemini-2.5-flash',
      temperature: 0.2,
    });
  }

  protected async execute(
    input: QualityGate1Input,
    context: AgentContext
  ): Promise<QualityGate1Output> {
    const prompt = `
      ${QUALITY_GATE_1_PROMPT}

      Audit the following Vision Document:
      ${JSON.stringify(input.visionDocument, null, 2)}
    `;
    
    // The Gemini response should match the full output schema directly.
    const response = await this.geminiClient.generateStructuredContent<QualityGate1Output>(
        prompt, 
        this.outputSchema // Use the full QualityGate1OutputSchema
    );
    
    return response;
  }

  protected async assessQuality(output: QualityGate1Output): Promise<number> {
    // Quality of a quality gate is determined by its own successful execution.
    return output.qualityGateReport.summary.overallPassed ? 100 : 50;
  }
}
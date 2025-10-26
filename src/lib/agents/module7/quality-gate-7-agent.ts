// lib/agents/module7/quality-gate-7-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { QualityGate7Input, QualityGate7Output, QualityGate7InputSchema, QualityGate7OutputSchema } from '../../../types/agents';
import { QUALITY_GATE_7_PROMPT } from '../../prompts/module7';

export class QualityGate7Agent extends BaseAgent<QualityGate7Input, QualityGate7Output> {
  protected agentName = 'agent-qg7-final-excellence-audit';
  protected agentVersion = '1.0';
  protected inputSchema = QualityGate7InputSchema;
  protected outputSchema = QualityGate7OutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.1 });
  }

  protected async execute(input: QualityGate7Input, context: AgentContext): Promise<QualityGate7Output> {
    const prompt = `
      ${QUALITY_GATE_7_PROMPT}

      Audit the following Master Production Prompt:
      ${JSON.stringify(input.masterPrompt, null, 2)}
    `;
    
    const response = await this.geminiClient.generateStructuredContent<QualityGate7Output>(
        prompt, 
        this.outputSchema
    );
    
    // Manually update the gate name
    response.qualityGateReport.gateName = "Quality Gate #7: Final Excellence Audit";
    
    return response;
  }

  protected async assessQuality(output: QualityGate7Output): Promise<number> {
    return output.qualityGateReport.summary.overallPassed ? 100 : 50;
  }
}
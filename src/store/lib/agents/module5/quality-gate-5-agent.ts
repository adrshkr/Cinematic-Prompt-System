// lib/agents/module5/quality-gate-5-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { QualityGate5Input, QualityGate5Output, QualityGate5InputSchema, QualityGate5OutputSchema } from '../../../types/agents';
import { QUALITY_GATE_5_PROMPT } from '../../prompts/module5';

export class QualityGate5Agent extends BaseAgent<QualityGate5Input, QualityGate5Output> {
  protected agentName = 'agent-qg5-audio-visual-harmony-audit';
  protected agentVersion = '1.0';
  protected inputSchema = QualityGate5InputSchema;
  protected outputSchema = QualityGate5OutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.2 });
  }

  protected async execute(input: QualityGate5Input, context: AgentContext): Promise<QualityGate5Output> {
    const prompt = `
      ${QUALITY_GATE_5_PROMPT}

      Audit the following integrated Audio Bible:
      ${JSON.stringify(input.audioBible, null, 2)}

      And cross-reference it with the final Cinematography Bible for timing and sync:
      ${JSON.stringify(input.cinematographyBible, null, 2)}
    `;
    
    const response = await this.geminiClient.generateStructuredContent<QualityGate5Output>(
        prompt, 
        this.outputSchema
    );
    
    return response;
  }

  protected async assessQuality(output: QualityGate5Output): Promise<number> {
    return output.qualityGateReport.summary.overallPassed ? 100 : 50;
  }
}

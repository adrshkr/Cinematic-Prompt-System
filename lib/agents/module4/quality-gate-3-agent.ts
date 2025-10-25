// lib/agents/module4/quality-gate-4-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { QualityGate4Input, QualityGate4Output, QualityGate4InputSchema, QualityGate4OutputSchema } from '../../../types/agents';
// FIX: Corrected the import path. The prompt for Quality Gate 4 is in module4.
import { QUALITY_GATE_4_PROMPT } from '../../../prompts/module4';

export class QualityGate4Agent extends BaseAgent<QualityGate4Input, QualityGate4Output> {
  // FIX: Corrected agent name to align with the purpose defined in QUALITY_GATE_4_PROMPT.
  protected agentName = 'agent-qg4-cinematography-excellence-audit';
  protected agentVersion = '1.0';
  protected inputSchema = QualityGate4InputSchema;
  protected outputSchema = QualityGate4OutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.2 });
  }

  protected async execute(input: QualityGate4Input, context: AgentContext): Promise<QualityGate4Output> {
    const prompt = `
      ${QUALITY_GATE_4_PROMPT}

      Audit the following integrated Cinematography Bible:
      ${JSON.stringify(input.cinematographyBible, null, 2)}
    `;
    
    return this.geminiClient.generateStructuredContent<QualityGate4Output>(
        prompt, 
        this.outputSchema
    );
  }

  protected async assessQuality(output: QualityGate4Output): Promise<number> {
    return output.qualityGateReport.summary.overallPassed ? 100 : 50;
  }
}

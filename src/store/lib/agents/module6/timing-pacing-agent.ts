// lib/agents/module6/timing-pacing-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { TimingPacingInput, TimingPacingOutput, TimingPacingInputSchema, TimingPacingOutputSchema } from '../../../../types/agents';
import { TIMING_PACING_PROMPT } from '../../prompts/module6';

export class TimingPacingAgent extends BaseAgent<TimingPacingInput, TimingPacingOutput> {
  protected agentName = 'agent-6.3-timing-pacing';
  protected agentVersion = '1.0';
  protected inputSchema = TimingPacingInputSchema;
  protected outputSchema = TimingPacingOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.3 });
  }

  protected async execute(input: TimingPacingInput, context: AgentContext): Promise<TimingPacingOutput> {
    const prompt = `
      ${TIMING_PACING_PROMPT}

      Cinematography Bible:
      ${JSON.stringify(input.cinematographyBible, null, 2)}

      Audio Bible:
      ${JSON.stringify(input.audioBible, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<TimingPacingOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: TimingPacingOutput): Promise<number> {
    if (Math.abs(output.total_adjusted_duration - 15.0) < 0.1) {
        return 100;
    }
    return 50;
  }
}

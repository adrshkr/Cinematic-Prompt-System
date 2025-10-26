// lib/agents/module4/lighting-director-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { LightingDirectorInput, LightingDirectorOutput, LightingDirectorInputSchema, LightingDirectorOutputSchema } from '../../../types/agents';
import { LIGHTING_DIRECTOR_PROMPT } from '../../prompts/module4';

export class LightingDirectorAgent extends BaseAgent<LightingDirectorInput, LightingDirectorOutput> {
  protected agentName = 'agent-4.2-lighting-director';
  protected agentVersion = '1.0';
  protected inputSchema = LightingDirectorInputSchema;
  protected outputSchema = LightingDirectorOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.5, thinkingBudget: 16384 });
  }

  protected async execute(input: LightingDirectorInput, context: AgentContext): Promise<LightingDirectorOutput> {
    const prompt = `
      ${LIGHTING_DIRECTOR_PROMPT}

      Shot List:
      ${JSON.stringify(input.cameraFraming.shot_list, null, 2)}
      
      Visual Bible (for style and color reference):
      ${JSON.stringify(input.visualBible, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<LightingDirectorOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: LightingDirectorOutput): Promise<number> {
    let score = 0;
    if (output.lighting_per_shot.length > 0) score += 50;
    if (output.lighting_philosophy.length > 20) score += 25;
    if (Object.keys(output.lighting_evolution).length === 3) score += 25;
    return Math.min(score, 100);
  }
}
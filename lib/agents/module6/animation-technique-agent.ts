// lib/agents/module6/animation-technique-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { AnimationTechniqueInput, AnimationTechniqueOutput, AnimationTechniqueInputSchema, AnimationTechniqueOutputSchema } from '../../../types/agents';
import { ANIMATION_TECHNIQUE_PROMPT } from '../../../prompts/module6';

export class AnimationTechniqueAgent extends BaseAgent<AnimationTechniqueInput, AnimationTechniqueOutput> {
  protected agentName = 'agent-6.1-animation-technique';
  protected agentVersion = '1.0';
  protected inputSchema = AnimationTechniqueInputSchema;
  protected outputSchema = AnimationTechniqueOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.4, thinkingBudget: 16384 });
  }

  protected async execute(input: AnimationTechniqueInput, context: AgentContext): Promise<AnimationTechniqueOutput> {
    const prompt = `
      ${ANIMATION_TECHNIQUE_PROMPT}

      Visual Bible:
      ${JSON.stringify(input.visualBible, null, 2)}

      Motion Choreography:
      ${JSON.stringify(input.motionChoreography, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<AnimationTechniqueOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: AnimationTechniqueOutput): Promise<number> {
    let score = 0;
    if (output.animation_specs_per_shot.length > 0) score += 50;
    if (output.effects_animation.length > 0) score += 50;
    return score;
  }
}
// lib/agents/module4/motion-choreographer-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { MotionChoreographerInput, MotionChoreographerOutput, MotionChoreographerInputSchema, MotionChoreographerOutputSchema } from '../../../types/agents';
import { MOTION_CHOREOGRAPHER_PROMPT } from '../../prompts/module4';

export class MotionChoreographerAgent extends BaseAgent<MotionChoreographerInput, MotionChoreographerOutput> {
  protected agentName = 'agent-4.3-motion-choreographer';
  protected agentVersion = '1.0';
  protected inputSchema = MotionChoreographerInputSchema;
  protected outputSchema = MotionChoreographerOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.7, thinkingBudget: 16384 });
  }

  protected async execute(input: MotionChoreographerInput, context: AgentContext): Promise<MotionChoreographerOutput> {
    const prompt = `
      ${MOTION_CHOREOGRAPHER_PROMPT}

      Shot List:
      ${JSON.stringify(input.cameraFraming.shot_list, null, 2)}
      
      Emotional Arc:
      ${JSON.stringify(input.emotionalArc, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<MotionChoreographerOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: MotionChoreographerOutput): Promise<number> {
    let score = 0;
    if (output.motion_per_shot.length > 0) score += 50;
    if (output.transitions.length > 0) score += 25;
    if (output.sakuga_moments.length > 0) score += 25;
    return Math.min(score, 100);
  }
}
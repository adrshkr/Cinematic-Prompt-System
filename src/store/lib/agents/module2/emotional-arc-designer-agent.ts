// lib/agents/module2/emotional-arc-designer-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { EmotionalArcDesignerInput, EmotionalArcDesignerOutput, EmotionalArcDesignerInputSchema, EmotionalArcDesignerOutputSchema } from '../../../types/agents';
import { EMOTIONAL_ARC_DESIGNER_PROMPT } from '../../prompts/module2';

export class EmotionalArcDesignerAgent extends BaseAgent<EmotionalArcDesignerInput, EmotionalArcDesignerOutput> {
  protected agentName = 'agent-2.2-emotional-arc-designer';
  protected agentVersion = '1.0';
  protected inputSchema = EmotionalArcDesignerInputSchema;
  protected outputSchema = EmotionalArcDesignerOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.7 });
  }

  protected async execute(input: EmotionalArcDesignerInput, context: AgentContext): Promise<EmotionalArcDesignerOutput> {
    const prompt = `
      ${EMOTIONAL_ARC_DESIGNER_PROMPT}

      Vision Document:
      ${JSON.stringify(input.visionDocument, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<EmotionalArcDesignerOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: EmotionalArcDesignerOutput): Promise<number> {
    let score = 0;
    if (output.emotionalArc.emotionalJourney.length === 3) score += 40;
    if (output.emotionalArc.keyEmotionalShift.trigger) score += 30;
    if (output.emotionalArc.sensoryRecommendations.visual.length > 0) score += 30;
    return score;
  }
}

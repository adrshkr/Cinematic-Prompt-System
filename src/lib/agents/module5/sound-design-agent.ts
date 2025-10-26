// lib/agents/module5/sound-design-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { SoundDesignInput, SoundDesignOutput, SoundDesignInputSchema, SoundDesignOutputSchema } from '../../../types/agents';
import { SOUND_DESIGN_PROMPT } from '../../prompts/module5';

export class SoundDesignAgent extends BaseAgent<SoundDesignInput, SoundDesignOutput> {
  protected agentName = 'agent-5.1-sound-design';
  protected agentVersion = '1.0';
  protected inputSchema = SoundDesignInputSchema;
  protected outputSchema = SoundDesignOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.6, thinkingBudget: 16384 });
  }

  protected async execute(input: SoundDesignInput, context: AgentContext): Promise<SoundDesignOutput> {
    const prompt = `
      ${SOUND_DESIGN_PROMPT}

      Cinematography Bible:
      ${JSON.stringify(input.cinematographyBible, null, 2)}
      
      ${input.qaFeedback ? `
      **REVISION REQUIRED - Address these issues from Quality Gate:**
      ${JSON.stringify(input.qaFeedback, null, 2)}
      ` : ''}
    `;
    return this.geminiClient.generateStructuredContent<SoundDesignOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: SoundDesignOutput): Promise<number> {
    let score = 0;
    if (output.sound_effects_per_shot.length > 0) score += 50;
    if (output.sound_philosophy.length > 20) score += 25;
    if (output.silence_moments.length > 0) score += 25;
    return Math.min(score, 100);
  }
}
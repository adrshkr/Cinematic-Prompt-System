// lib/agents/module5/music-composer-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { MusicComposerInput, MusicComposerOutput, MusicComposerInputSchema, MusicComposerOutputSchema } from '../../../../types/agents';
import { MUSIC_COMPOSER_PROMPT } from '../../prompts/module5';

export class MusicComposerAgent extends BaseAgent<MusicComposerInput, MusicComposerOutput> {
  protected agentName = 'agent-5.2-music-composer';
  protected agentVersion = '1.0';
  protected inputSchema = MusicComposerInputSchema;
  protected outputSchema = MusicComposerOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.8, thinkingBudget: 16384 });
  }

  protected async execute(input: MusicComposerInput, context: AgentContext): Promise<MusicComposerOutput> {
    const prompt = `
      ${MUSIC_COMPOSER_PROMPT}

      Cinematography Bible:
      ${JSON.stringify(input.cinematographyBible, null, 2)}

      Emotional Arc:
      ${JSON.stringify(input.emotionalArc, null, 2)}

      ${input.qaFeedback ? `
      **REVISION REQUIRED - Address these issues from Quality Gate:**
      ${JSON.stringify(input.qaFeedback, null, 2)}
      ` : ''}
    `;
    return this.geminiClient.generateStructuredContent<MusicComposerOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: MusicComposerOutput): Promise<number> {
    let score = 0;
    if (Object.keys(output.musical_structure).length === 4) score += 50;
    if (output.sync_points.length > 0) score += 50;
    return Math.min(score, 100);
  }
}

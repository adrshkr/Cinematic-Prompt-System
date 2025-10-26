// lib/agents/module5/dialogue-director-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { DialogueDirectorInput, DialogueDirectorOutput, DialogueDirectorInputSchema, DialogueDirectorOutputSchema } from '../../../../types/agents';
import { DIALOGUE_DIRECTOR_PROMPT } from '../../prompts/module5';

export class DialogueDirectorAgent extends BaseAgent<DialogueDirectorInput, DialogueDirectorOutput> {
  protected agentName = 'agent-5.3-dialogue-director';
  protected agentVersion = '1.0';
  protected inputSchema = DialogueDirectorInputSchema;
  protected outputSchema = DialogueDirectorOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.7 });
  }

  protected async execute(input: DialogueDirectorInput, context: AgentContext): Promise<DialogueDirectorOutput> {
    const prompt = `
      ${DIALOGUE_DIRECTOR_PROMPT}

      Story Architecture:
      ${JSON.stringify(input.storyArchitecture, null, 2)}

      Character Design:
      ${JSON.stringify(input.characterDesign, null, 2)}

      ${input.qaFeedback ? `
      **REVISION REQUIRED - Address these issues from Quality Gate:**
      ${JSON.stringify(input.qaFeedback, null, 2)}
      ` : ''}
    `;
    return this.geminiClient.generateStructuredContent<DialogueDirectorOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: DialogueDirectorOutput): Promise<number> {
    // Quality is high if a conscious choice was made and justified.
    if (output.has_dialogue === false && output.reasoning) return 100;
    if (output.has_dialogue === true && output.dialogue_list && output.dialogue_list.length > 0) return 100;
    return 20; // Incomplete output
  }
}

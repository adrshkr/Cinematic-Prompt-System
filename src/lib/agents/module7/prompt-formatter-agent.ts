// lib/agents/module7/prompt-formatter-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { PromptFormatterInput, PromptFormatterOutput, PromptFormatterInputSchema, PromptFormatterOutputSchema } from '../../../types/agents';
import { PROMPT_FORMATTER_PROMPT } from '../../prompts/module7';
import { formatISO } from 'date-fns';

export class PromptFormatterAgent extends BaseAgent<PromptFormatterInput, PromptFormatterOutput> {
  protected agentName = 'agent-7.3-prompt-formatter';
  protected agentVersion = '1.0';
  protected inputSchema = PromptFormatterInputSchema;
  protected outputSchema = PromptFormatterOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.2 });
  }

  protected async execute(input: PromptFormatterInput, context: AgentContext): Promise<PromptFormatterOutput> {
    const prompt = `
      ${PROMPT_FORMATTER_PROMPT}

      Format the following Master Production Prompt:
      ${JSON.stringify(input.masterPrompt, null, 2)}
    `;
    const formattedPrompt = await this.geminiClient.generateStructuredContent<PromptFormatterOutput>(prompt, this.outputSchema);

    // Add metadata that the LLM can't generate
    if (formattedPrompt.finalFormattedPrompt.metadata) {
      formattedPrompt.finalFormattedPrompt.metadata.generated_at = formatISO(new Date());
      if(input.masterPrompt.masterPrompt.unified_story.logline) {
          formattedPrompt.finalFormattedPrompt.metadata.title = input.masterPrompt.masterPrompt.unified_story.logline;
      }
    }
    
    return formattedPrompt;
  }

  protected async assessQuality(output: PromptFormatterOutput): Promise<number> {
    // Quality is based on correct formatting and completeness
    let score = 0;
    const { metadata, global_settings, shot_by_shot_instructions } = output.finalFormattedPrompt;
    if (metadata && metadata.version === '1.0.0') score += 25;
    if (global_settings && global_settings.duration_seconds === 15) score += 25;
    if (shot_by_shot_instructions && shot_by_shot_instructions.length > 0) score += 50;
    return score;
  }
}
// lib/agents/module2/theme-symbolism-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { ThemeSymbolismInput, ThemeSymbolismOutput, ThemeSymbolismInputSchema, ThemeSymbolismOutputSchema } from '../../../types/agents';
import { THEME_SYMBOLISM_PROMPT } from '../../prompts/module2';

export class ThemeSymbolismAgent extends BaseAgent<ThemeSymbolismInput, ThemeSymbolismOutput> {
  protected agentName = 'agent-2.3-theme-symbolism';
  protected agentVersion = '1.0';
  protected inputSchema = ThemeSymbolismInputSchema;
  protected outputSchema = ThemeSymbolismOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.8, thinkingBudget: 16384 });
  }

  protected async execute(input: ThemeSymbolismInput, context: AgentContext): Promise<ThemeSymbolismOutput> {
    const prompt = `
      ${THEME_SYMBOLISM_PROMPT}

      Vision Document:
      ${JSON.stringify(input.visionDocument, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<ThemeSymbolismOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: ThemeSymbolismOutput): Promise<number> {
    let score = 0;
    if (output.thematicElements.coreTheme) score += 40;
    if (output.thematicElements.primarySymbol.symbol) score += 30;
    if (output.thematicElements.motifIntegrationPlan.length > 0) score += 30;
    return score;
  }
}
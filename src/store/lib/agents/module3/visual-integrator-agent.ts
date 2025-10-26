// lib/agents/module3/visual-integrator-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { VisualIntegratorInput, VisualIntegratorOutput, VisualIntegratorInputSchema, VisualIntegratorOutputSchema } from '../../../../types/agents';
import { VISUAL_INTEGRATION_PROMPT } from '../../prompts/module3';

export class VisualIntegratorAgent extends BaseAgent<VisualIntegratorInput, VisualIntegratorOutput> {
  protected agentName = 'agent-3.4-visual-integrator';
  protected agentVersion = '1.0';
  protected inputSchema = VisualIntegratorInputSchema;
  protected outputSchema = VisualIntegratorOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.4, thinkingBudget: 16384 });
  }

  protected async execute(input: VisualIntegratorInput, context: AgentContext): Promise<VisualIntegratorOutput> {
    const prompt = `
      ${VISUAL_INTEGRATION_PROMPT}

      Character Design Draft:
      ${JSON.stringify(input.characterDesign, null, 2)}

      World Design Draft:
      ${JSON.stringify(input.worldDesign, null, 2)}
      
      Color Script (Authoritative):
      ${JSON.stringify(input.colorScript, null, 2)}
    `;
     try {
        const llmOutput = await this.geminiClient.generateStructuredContent<VisualIntegratorOutput>(prompt, this.outputSchema);
        // Basic validation to ensure the LLM didn't return an empty or malformed object
        if (llmOutput.visualBible && llmOutput.visualBible.characterDesign && llmOutput.visualBible.worldDesign && llmOutput.visualBible.colorScript) {
            return llmOutput;
        }
        throw new Error("LLM output was incomplete.");
    } catch (error) {
        console.warn('Visual Integrator: LLM output was structurally invalid or incomplete. Using robust manual fallback.', error);
        return this.createManualFallback(input);
    }
  }

  private createManualFallback(input: VisualIntegratorInput): VisualIntegratorOutput {
    // This robust fallback programmatically stitches the inputs together.
    const bible = {
        characterDesign: input.characterDesign.characterDesign,
        worldDesign: input.worldDesign.worldDesign,
        colorScript: input.colorScript.colorScript
    };
    return { visualBible: bible };
  }

  protected async assessQuality(output: VisualIntegratorOutput): Promise<number> {
    // High quality if all parts are present
    const { characterDesign, worldDesign, colorScript } = output.visualBible;
    let score = 0;
    if (characterDesign) score += 33;
    if (worldDesign) score += 33;
    if (colorScript) score += 34;
    return score;
  }
}

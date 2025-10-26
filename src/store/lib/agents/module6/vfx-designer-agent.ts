// lib/agents/module6/vfx-designer-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { VFXDesignerInput, VFXDesignerOutput, VFXDesignerInputSchema, VFXDesignerOutputSchema } from '../../../types/agents';
import { VFX_DESIGNER_PROMPT } from '../../prompts/module6';

export class VFXDesignerAgent extends BaseAgent<VFXDesignerInput, VFXDesignerOutput> {
  protected agentName = 'agent-6.2-vfx-designer';
  protected agentVersion = '1.0';
  protected inputSchema = VFXDesignerInputSchema;
  protected outputSchema = VFXDesignerOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.7, thinkingBudget: 16384 });
  }

  protected async execute(input: VFXDesignerInput, context: AgentContext): Promise<VFXDesignerOutput> {
    const prompt = `
      ${VFX_DESIGNER_PROMPT}

      Visual Bible:
      ${JSON.stringify(input.visualBible, null, 2)}

      Lighting Design:
      ${JSON.stringify(input.lightingDesign, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<VFXDesignerOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: VFXDesignerOutput): Promise<number> {
    let score = 0;
    if (output.vfx_specs.length > 0) score += 100;
    return score;
  }
}

// lib/agents/module3/world-design-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { WorldDesignInput, WorldDesignOutput, WorldDesignInputSchema, WorldDesignOutputSchema } from '../../../../types/agents';
import { WORLD_DESIGN_PROMPT } from '../../prompts/module3';

export class WorldDesignAgent extends BaseAgent<WorldDesignInput, WorldDesignOutput> {
  protected agentName = 'agent-3.2-world-design';
  protected agentVersion = '1.0';
  protected inputSchema = WorldDesignInputSchema;
  protected outputSchema = WorldDesignOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.8, thinkingBudget: 32768 });
  }

  protected async execute(input: WorldDesignInput, context: AgentContext): Promise<WorldDesignOutput> {
    const prompt = `
      ${WORLD_DESIGN_PROMPT}

      Vision Document:
      ${JSON.stringify(input.visionDocument, null, 2)}

      Story Architecture:
      ${JSON.stringify(input.storyArchitecture, null, 2)}

      Color Script:
      ${JSON.stringify(input.colorScript, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<WorldDesignOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: WorldDesignOutput): Promise<number> {
    let score = 0;
    if (output.worldDesign.overallAtmosphere) score += 25;
    if (output.worldDesign.locations.length > 0) score += 25;
    const additions = output.worldDesign.creativeAdditions;
    if (additions.floraAndFauna.length > 0 || additions.backgroundLife.length > 0 || additions.celestialDetails.length > 0) score += 25;
    if (output.worldDesign.technicalDetails.parallaxLayers.length > 2) score += 25;
    return score;
  }
}

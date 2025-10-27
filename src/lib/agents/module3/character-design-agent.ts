// lib/agents/module3/character-design-agent.ts
import { BaseAgent, AgentContext, AgentCritique } from '../base-agent';
import { CharacterDesignInput, CharacterDesignOutput, CharacterDesignInputSchema, CharacterDesignOutputSchema, VisionValidatorOutput, ColorScriptOutput, EmotionalArcDesignerOutput, ThemeSymbolismOutput } from '../../../types/agents';
import { CHARACTER_DESIGN_PROMPT } from '../../prompts/module3';

export class CharacterDesignAgent extends BaseAgent<CharacterDesignInput, CharacterDesignOutput> {
  protected agentName = 'agent-3.1-character-design';
  protected agentVersion = '1.0';
  protected inputSchema = CharacterDesignInputSchema;
  protected outputSchema = CharacterDesignOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.6, thinkingBudget: 16384 });
  }

  public critique(context: AgentContext): AgentCritique[] {
    const critiques: AgentCritique[] = [];
    const visionDocument = context.outputs.visionSynthesizer as VisionValidatorOutput;
    const colorScript = context.outputs.colorScript as ColorScriptOutput;
    const emotionalArc = context.outputs.emotionalArcDesigner as EmotionalArcDesignerOutput;
    const thematicElements = context.outputs.themeSymbolism as ThemeSymbolismOutput;

    if (!visionDocument || !colorScript || !emotionalArc || !thematicElements) {
        return critiques;
    }

    // Check 1: Ensure required colors from the vision exist in the color script's palette.
    const characterDescription = visionDocument.synthesizedVision?.unifiedDescription.toLowerCase() || '';
    const masterPaletteHexCodes = new Set(colorScript.colorScript.masterPalette.map(c => c.hex.toLowerCase()));

    // Example check for a specific color mentioned in the vision
    // FIX: Corrected typo from 'emerald green' to check for the color mentioned in the description.
    if (characterDescription.includes('emerald green') && ![...masterPaletteHexCodes].some(hex => this.isGreen(hex as string))) {
        critiques.push({
            targetAgentName: 'agent-3.3-color-script',
            critique: "The Color Script is missing a required color from the Vision Document. The vision specifies 'emerald green', but no green hex code was provided in the master palette.",
            suggestion: "Please revise the Color Script's master palette to include a vibrant emerald green (e.g., #50C878) and assign it a purpose related to the character's key features."
        });
    }

    return critiques;
  }

  // Helper function to check if a hex code is a shade of green.
  private isGreen(hex: string): boolean {
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    if (cleanHex.length !== 6) return false;
    try {
        const r = parseInt(cleanHex.slice(0, 2), 16);
        const g = parseInt(cleanHex.slice(2, 4), 16);
        const b = parseInt(cleanHex.slice(4, 6), 16);
        // A simple heuristic for 'green': G is the dominant channel.
        return g > r && g > b;
    } catch (e) {
        return false;
    }
  }

  protected async execute(input: CharacterDesignInput, context: AgentContext): Promise<CharacterDesignOutput> {
    const prompt = `
      ${CHARACTER_DESIGN_PROMPT}

      Vision Document:
      ${JSON.stringify(input.visionDocument, null, 2)}
      
      Story Architecture:
      ${JSON.stringify(input.storyArchitecture, null, 2)}

      Emotional Arc Design:
      ${JSON.stringify(input.emotionalArc, null, 2)}

      Theme & Symbolism:
      ${JSON.stringify(input.thematicElements, null, 2)}

      Color Script:
      ${JSON.stringify(input.colorScript, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<CharacterDesignOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: CharacterDesignOutput): Promise<number> {
    let score = 0;
    if (output.characterDesign.characterIdentity.faceStructure) score += 25;
    if (output.characterDesign.costumeAndProps.overview) score += 25;
    if (output.characterDesign.animationRequirements.expressionRange.length > 0) score += 25;
    if (output.characterDesign.consistencyRules.length > 0) score += 25;
    return score;
  }
}
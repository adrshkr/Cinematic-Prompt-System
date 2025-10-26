// lib/agents/module3/color-script-agent.ts
import { BaseAgent, AgentContext, AgentCritique } from '../base-agent';
import { ColorScriptInput, ColorScriptOutput, ColorScriptInputSchema, ColorScriptOutputSchema, EmotionalArcDesignerOutput } from '../../../../types/agents';
import { COLOR_SCRIPT_PROMPT } from '../../prompts/module3';

export class ColorScriptAgent extends BaseAgent<ColorScriptInput, ColorScriptOutput> {
  protected agentName = 'agent-3.3-color-script';
  protected agentVersion = '1.0';
  protected inputSchema = ColorScriptInputSchema;
  protected outputSchema = ColorScriptOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.7 });
  }

  public critique(context: AgentContext): AgentCritique[] {
    const critiques: AgentCritique[] = [];
    const emotionalArc = context.outputs.emotionalArcDesigner as EmotionalArcDesignerOutput;

    if (!emotionalArc?.emotionalArc) {
        return critiques;
    }

    // Check 1: Emotional Cohesion and Clarity
    const journey = emotionalArc.emotionalArc.emotionalJourney;
    if (!journey || journey.length < 3) {
      critiques.push({
        targetAgentName: 'agent-2.2-emotional-arc-designer',
        critique: "The Emotional Arc is incomplete or missing. I cannot design a color journey without a clear emotional map.",
        suggestion: "Please provide a complete emotional journey with distinct 'start', 'middle', and 'end' emotional states."
      });
    }

    const hasGenericEmotions = journey?.some(
      (beat) => !beat.emotion || beat.emotion.toLowerCase() === 'n/a' || beat.emotion.split(' ').length < 2
    );
    if (hasGenericEmotions) {
      critiques.push({
        targetAgentName: 'agent-2.2-emotional-arc-designer',
        critique: "The emotions defined in the Emotional Arc are too generic or not descriptive enough.",
        suggestion: "Please revise the emotional journey to use more specific and evocative emotional descriptors (e.g., 'bittersweet nostalgia' instead of 'sad'). Each emotion should be clearly defined."
      });
    }
    
    return critiques;
  }

  protected async execute(input: ColorScriptInput, context: AgentContext): Promise<ColorScriptOutput> {
    const prompt = `
      ${COLOR_SCRIPT_PROMPT}

      Vision Document:
      ${JSON.stringify(input.visionDocument, null, 2)}

      Emotional Arc Design:
      ${JSON.stringify(input.emotionalArc, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<ColorScriptOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: ColorScriptOutput): Promise<number> {
    let score = 0;
    if (output.colorScript.masterPalette.length > 5) score += 40;
    if (Object.keys(output.colorScript.colorJourney).length === 3) score += 30;
    if (output.colorScript.colorRules.characterBackgroundSeparation) score += 30;
    return score;
  }
}

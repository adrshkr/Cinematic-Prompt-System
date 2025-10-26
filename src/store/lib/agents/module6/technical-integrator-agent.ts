// lib/agents/module6/technical-integrator-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { TechnicalIntegratorInput, TechnicalIntegratorOutput, TechnicalIntegratorInputSchema, TechnicalIntegratorOutputSchema } from '../../../types/agents';
import { TECHNICAL_INTEGRATOR_PROMPT } from '../../prompts/module6';

export class TechnicalIntegratorAgent extends BaseAgent<TechnicalIntegratorInput, TechnicalIntegratorOutput> {
  protected agentName = 'agent-6.4-technical-integrator';
  protected agentVersion = '1.0';
  protected inputSchema = TechnicalIntegratorInputSchema;
  protected outputSchema = TechnicalIntegratorOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.4 });
  }

  protected async execute(input: TechnicalIntegratorInput, context: AgentContext): Promise<TechnicalIntegratorOutput> {
    const prompt = `
      ${TECHNICAL_INTEGRATOR_PROMPT}

      Animation Technique Specs:
      ${JSON.stringify(input.animation, null, 2)}

      VFX Design Specs:
      ${JSON.stringify(input.vfx, null, 2)}
      
      Timing & Pacing Specs:
      ${JSON.stringify(input.timing, null, 2)}
    `;
     try {
        const llmOutput = await this.geminiClient.generateStructuredContent<TechnicalIntegratorOutput>(prompt, this.outputSchema);
        if (llmOutput.technicalBible && llmOutput.technicalBible.animationTechnique && llmOutput.technicalBible.vfxDesign && llmOutput.technicalBible.finalTiming) {
            return llmOutput;
        }
        throw new Error("LLM output was incomplete.");
    } catch(error) {
        console.warn('Technical Integrator: LLM output was structurally invalid. Using robust manual fallback.', error);
        return this.createManualFallback(input);
    }
  }
  
  private createManualFallback(input: TechnicalIntegratorInput): TechnicalIntegratorOutput {
    // This robust fallback programmatically stitches the inputs together.
    return {
        technicalBible: {
            animationTechnique: input.animation,
            vfxDesign: input.vfx,
            finalTiming: input.timing,
            feasibility_report: {
                overall_difficulty: "Medium",
                production_notes: ["Manual integration fallback was triggered. Review complexity."],
                warnings: ["Ensure all technical specs are compatible as they were not AI-verified for cohesion."]
            }
        }
    };
  }

  protected async assessQuality(output: TechnicalIntegratorOutput): Promise<number> {
    let score = 0;
    if (output.technicalBible.animationTechnique) score += 33;
    if (output.technicalBible.vfxDesign) score += 33;
    if (output.technicalBible.finalTiming) score += 34;
    return score;
  }
}

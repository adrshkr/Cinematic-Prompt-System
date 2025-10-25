// lib/agents/module1/vision-validator-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
// FIX: Corrected import names to match types/agents.ts
import { VisionValidatorInput, VisionValidatorOutput, VisionSynthesizerInputSchema, VisionSynthesizerOutputSchema } from '../../../types/agents';
// FIX: Imported the revision prompt to be used when correcting a failed vision document.
import { VISION_SYNTHESIS_PROMPT, REVISE_VISION_PROMPT } from '../../../prompts/module1';

export class VisionValidatorAgent extends BaseAgent<VisionValidatorInput, VisionValidatorOutput> {
  protected agentName = 'agent-1.3-vision-validator';
  protected agentVersion = '1.0';
  // FIX: Corrected schema names
  protected inputSchema = VisionSynthesizerInputSchema;
  protected outputSchema = VisionSynthesizerOutputSchema;

  constructor() {
    super({
      model: 'gemini-2.5-pro',
      temperature: 0.7,
      thinkingBudget: 32768,
    });
  }

  protected async execute(
    input: VisionValidatorInput,
    context: AgentContext
  ): Promise<VisionValidatorOutput> {
    // FIX: Implemented logic to switch between the initial synthesis prompt and the revision prompt
    // based on whether `issuesToAddress` are provided from a failed Quality Gate.
    const isRevision = input.issuesToAddress && input.issuesToAddress.length > 0;
    const prompt = isRevision ? `
      ${REVISE_VISION_PROMPT}

      Revise based on the following:
      ${JSON.stringify({
        imageAnalysis: input.imageAnalysis,
        conceptExtraction: input.conceptExtraction,
        failedVisionDocument: input.failedVisionDocument,
        issuesToAddress: input.issuesToAddress,
      }, null, 2)}
    ` : `
      ${VISION_SYNTHESIS_PROMPT}

      Synthesize the following inputs:
      ${JSON.stringify(input, null, 2)}
    `;

    const vision = await this.geminiClient.generateStructuredContent<VisionValidatorOutput>(
      prompt,
      this.outputSchema
    );
    return vision;
  }

  protected async assessQuality(output: VisionValidatorOutput): Promise<number> {
    let score = 0;
    if (output.validationStatus.readyToProceed) score += 50;
    if (output.northStarRequirements.visualMandates.length > 3) score += 25;
    if (output.riskAssessment.aestheticRisks.length === 0 && output.riskAssessment.narrativeRisks.length === 0) score += 25;
    return Math.min(score, 100);
  }
}

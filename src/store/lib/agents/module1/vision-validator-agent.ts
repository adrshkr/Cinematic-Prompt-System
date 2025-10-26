// lib/agents/module1/vision-validator-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { VisionValidatorInput, VisionValidatorOutput, VisionSynthesizerInputSchema, VisionSynthesizerOutputSchema } from '../../../../types/agents';
import { VISION_SYNTHESIS_PROMPT, REVISE_VISION_PROMPT } from '../../prompts/module1';

export class VisionValidatorAgent extends BaseAgent<VisionValidatorInput, VisionValidatorOutput> {
  protected agentName = 'agent-1.3-vision-validator';
  protected agentVersion = '1.0';
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

// lib/agents/module1/image-analysis-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { ImageAnalysisInput, ImageAnalysisOutput, ImageAnalysisInputSchema, ImageAnalysisOutputSchema } from '../../../../types/agents';
import { SEED_ANALYSIS_PROMPT } from '../../prompts/module1';

export class ImageAnalysisAgent extends BaseAgent<ImageAnalysisInput, ImageAnalysisOutput> {
  protected agentName = 'agent-1.1-image-analysis';
  protected agentVersion = '1.0';
  protected inputSchema = ImageAnalysisInputSchema;
  protected outputSchema = ImageAnalysisOutputSchema;

  constructor() {
    super({
      model: 'gemini-2.5-pro',
      temperature: 0.3,
      thinkingBudget: 32768,
    });
  }

  protected async execute(
    input: ImageAnalysisInput,
    context: AgentContext
  ): Promise<ImageAnalysisOutput> {
    const analysis = await this.geminiClient.analyzeImageStructured<ImageAnalysisOutput>(
      input.imageData,
      SEED_ANALYSIS_PROMPT,
      this.outputSchema
    );
    return analysis;
  }

  protected async assessQuality(output: ImageAnalysisOutput): Promise<number> {
    let score = 0;
    if (output.visualElements.length >= 20) score += 40;
    else if (output.visualElements.length >= 10) score += 20;

    const avgClarity = (output.clarityAssessment.sharpness + output.clarityAssessment.exposure + output.clarityAssessment.contrast) / 3;
    if (avgClarity >= 7) score += 30;
    else if (avgClarity >= 5) score += 15;

    if (output.twoDPurityCheck.isPure2D && output.twoDPurityCheck.confidence > 80) score += 30;

    return Math.min(score, 100);
  }
}
